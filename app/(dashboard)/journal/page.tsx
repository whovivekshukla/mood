import EntryCard from "@/components/EntryCard";
import NewEntryCard from "@/components/NewEntryCard";
import { analyze } from "@/utils/ai";
import { getUserByClerkID } from "@/utils/auth";
import { prisma } from "@/utils/db";
import Link from "next/link";
import Question from "@/components/Question";

const getEntries = async () => {
  const user = await getUserByClerkID();
  const data = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    }
  });


  return data;
};

const JournalPage = async () => {
  const entries = await getEntries();
  console.log("entries", entries);

  return (
    <div className="p-8 bg-zinc-400/10 h-full">
      <h2 className="text-3xl mb-8">Journal</h2>
      <div className="my-8">
        <Question/>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <NewEntryCard />
        {entries.map((entry) => (
          <Link href={`/journal/${entry.id}`}>
            <EntryCard key={entry.id} entry={entry} />
          </Link>
        ))}
      </div>
    </div>
  );
};
export default JournalPage;
