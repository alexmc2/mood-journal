import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import HistoryChart from '@/components/HistoryChart';

const getData = async () => {
  const user = await getUserByClerkId();
  const analyses = await prisma.analysis.findMany({
    where: {
      userId: user.id,
    },
  });

 

  const sum = analyses.reduce((all, current) => {
    return all + current.sentimentScore;
  }, 0);

  const average = Math.round(sum / analyses.length);

  return { analyses, average };
};

const History = async () => {
  const { average, analyses } = await getData();

  return (
    <div className="w-full h-full">
      <div className='text-lg'>HISTORY</div>
      <div>{`Average Sentiment Score:`} {average}</div>
      <div className="w-full h-full">
        <HistoryChart data={analyses} />
      </div>
    </div>
  );
};

export default History;
