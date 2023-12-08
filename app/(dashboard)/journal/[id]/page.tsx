import Editor from '@/components/Editor';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';

const getEntry = async (id) => {
  const user = await getUserByClerkId();

  const entry = await prisma.journalEntry.findUnique({
    where: {
      userId_id: {
        userId: user.id,
        id,
      },
    },
  });

  return entry;
};

const EntryPage = async ({ params }) => {
  const entry = await getEntry(params.id);

  const dataAnalysis = [
    { name: 'summary', value: '' },
    { name: 'subject', value: '' },
    { name: 'mood', value: '' },
    { name: 'negative', value: 'false' },
  ];

  return (
    <div className="h-full w-full grid grid-cols-3">
      <div className="col-span-2">
        <Editor entry={entry} />
      </div>
      <div className="border-l h-full border-slate-700 p-8">
        <div className="bg-blue-500 flex w-full h-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 p-8 card">
          <h2 className="text-2xl ">Analysis</h2>

          <ul>
            {dataAnalysis.map((item) => (
              <li key={item.name} className="flex items-center justify-between">
                <span className="">{item.name}</span>
                <div className="divider"></div>
                <span>{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EntryPage;
