import { OpenAI } from "langchain/llms/openai";
import { GooglePaLM } from "langchain/llms/googlepalm";
import { PromptTemplate } from "langchain/prompts";
import { Document } from "langchain/document";
import { loadQARefineChain } from "langchain/chains";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { z } from "zod";
import {
  StructuredOutputParser,
  OutputFixingParser,
} from "langchain/output_parsers";

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z
      .string()
      .describe("the mood of the person who wrote the journal entry."),
    subject: z.string().describe("the subject of the journal entry."),
    negative: z
      .boolean()
      .describe(
        "is the journal entry negative? (i.e. does it contain negative emotions?)."
      ),
    summary: z
      .string()
      .describe(
        "quick summary of the entire entry with maximum of 15 words not more than that."
      ),
    color: z
      .string()
      .describe(
        "a hexidecimal color code that represents the mood of the entry. Example #0101fe for blue representing happiness."
      ),
    sentimentScore: z
      .number()
      .describe(
        "sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive."
      ),
  })
);

const getPrompt = async (content) => {
  const format_instructions = parser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template:
      "Analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}",
    inputVariables: ["entry"],
    partialVariables: { format_instructions },
  });

  const input = await prompt.format({ entry: content });
  return input;
};

export const analyze = async (content) => {
  const input = await getPrompt(content);
  // const model = new GooglePaLM({
  //   apiKey: process.env.GOOGLE_API_KEY,
  //   temperature: 0,
  //   modelName: "models/text-bison-001",
  // });
  const model = new OpenAI({ temperature: 0, modelName: "gpt-3.5-turbo" });
  const output = await model.call(input);

  // console.log({ output });

  try {
    return parser.parse(output);
  } catch (e) {
    const fixParser = OutputFixingParser.fromLLM(
      // new GooglePaLM({
      //   apiKey: process.env.GOOGLE_API_KEY,
      //   temperature: 0,
      //   modelName: "models/text-bison-001",
      // }),
      new OpenAI({ temperature: 0, modelName: "gpt-3.5-turbo" }),
      parser
    );
    const fix = await fixParser.parse(output);
    return fix;
  }
};

export const qa = async (question, entries) => {
  const docs = entries.map(
    (entry) =>
      new Document({
        pageContent: entry.content,
        metadata: { source: entry.id, date: entry.createdAt },
      })
  );
  const model = new OpenAI({ temperature: 0, modelName: "gpt-3.5-turbo" });
  const chain = loadQARefineChain(model);
  const embeddings = new OpenAIEmbeddings();
  const store = await MemoryVectorStore.fromDocuments(docs, embeddings);
  const relevantDocs = await store.similaritySearch(question);
  const res = await chain.call({
    input_documents: relevantDocs,
    question,
  });

  return res.output_text;
};
