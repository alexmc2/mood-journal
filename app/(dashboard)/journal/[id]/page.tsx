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
    include: {
      analysis: true,
    },
  });

  return entry;
};

function getContrastYIQ(hexcolor) {
  hexcolor = hexcolor.replace('#', '');
  var r = parseInt(hexcolor.substr(0, 2), 16);
  var g = parseInt(hexcolor.substr(2, 2), 16);
  var b = parseInt(hexcolor.substr(4, 2), 16);
  var yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? 'black' : 'white';
}

const EntryPage = async ({ params }) => {
  const entry = await getEntry(params.id);
  const { mood, summary, color, subject, negative } = entry.analysis;
  const textColor = getContrastYIQ(color);

  const dataAnalysis = [
    { name: 'summary', value: summary },
    { name: 'subject', value: subject },
    { name: 'mood', value: mood },
    { name: 'negative', value: negative ? 'yes' : 'no' },
  ];

  return (
    <div className="h-full w-full grid grid-cols-3">
      <div className="col-span-2">
        <Editor entry={entry} />
      </div>
      <div className="border-l h-full border-slate-700 p-8">
        <div
          className="flex w-full h-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 p-8 card "
          style={{ backgroundColor: color, color: textColor }}
        >
          <h2 className="text-2xl ">Analysis</h2>

          <ul>
            {dataAnalysis.map((item) => (
              <li key={item.name} className="flex items-center justify-between">
                <div className="">{item.name}</div>
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
