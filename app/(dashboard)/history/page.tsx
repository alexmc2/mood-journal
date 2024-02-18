import HistoryChart from '@/components/HistoryChart';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';

const getData = async () => {
  const user = await getUserByClerkId();
  const analyses = await prisma.analysis.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
  const total = analyses.reduce((acc, curr) => {
    return acc + curr.sentimentScore;
  }, 0);
  const average =
    analyses.length > 0
      ? Math.ceil(
          analyses.reduce((acc, curr) => acc + curr.sentimentScore, 0) /
            analyses.length
        )
      : 0; // Return 0 or another default value

  return { analyses, average };
};

const History = async () => {
  const { average, analyses } = await getData();

  return (
    <div className="flex flex-col h-full p-10">
      <div className="text-lg ">HISTORY</div>
      <div className="pb-6">
        {`Average Sentiment Score:`} {average}
      </div>
      <div className=" h-full overflow-x-auto">
        <HistoryChart data={analyses} />
      </div>
    </div>
  );
};

export default History;
