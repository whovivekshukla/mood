import HistoryChart from "@/components/HistoryChart";
import { getUserByClerkID } from "@/utils/auth";
import { prisma } from "@/utils/db";

const getData = async () => {
  const user = await getUserByClerkID();
  const analyses = await prisma.analysis.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const sum = analyses.reduce(
    (all, current) => all + current.sentimentScore,
    0
  );
  const avg = sum / analyses.length;
  return { analyses, avg };
};

const HistoryPage = async () => {
  const { analyses, avg } = await getData();
  console.log(analyses);

  return (
    <div className="h-full px-6 py-8">
      <div>
        <h1 className="text-2xl mb-4">{`Avg. Sentiment: ${avg}`}</h1>
      </div>
      <div className="h-full w-full">
        <HistoryChart data={analyses} />
      </div>
    </div>
  );
};

export default HistoryPage;
