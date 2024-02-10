'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from 'recharts';
import { useRouter } from 'next/navigation';

const CustomTooltip = ({ payload, label, active }: { payload: any, label: any, active: any }) => {
  console.log(payload);

  const dateLabel = new Date(label).toLocaleString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  if (active) {
    const analysis = payload[0].payload;

    return (
      <div className="custom-tooltip bg-white/5 shadow-md border border-black/10 rounded-lg backdrop-blur-md relative ">
        <div
          className="absolute left-2 top-2 w-2 h-2 rounded-full"
          style={{ background: analysis.color }}
        ></div>
        <p className="label xs:text-sm md:text-lg p-4">{dateLabel}</p>
        <p className="label xs:text-md text-xl uppercase p-4">
          {analysis.mood}
        </p>
        <p className="label xs:text-sm md:text-lg p-4 ">
          Sentiment Score: {analysis.sentimentScore}
        </p>
      </div>
    );
  }

  return null;
};

const CustomDot = ({ cx, cy, payload }: { cx: number, cy: number, payload: any }) => {
  const router = useRouter(); // Using useRouter hook

  return (
    <circle
      cx={cx}
      cy={cy}
      r={8}
      fill="#8884d8"
      stroke="none"
      onClick={() => router.push(`/journal/${payload.entryId}`)}
      style={{ cursor: 'pointer' }}
    />
  );
};

type DataItem = {
  createdAt: string;
  sentimentScore: number;
  entryId: string;

};

type HistoryChartProps = {
  data: DataItem[];
};

const HistoryChart = ({ data }: HistoryChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-500">
          Your history sentiment score chart will appear here.
        </p>
      </div>
    );
  }


  return (
    <ResponsiveContainer height="100%" minWidth={600}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="sentimentScore"
          stroke="#8884d8"
          strokeWidth={2}
          dot={<CustomDot cx={0} cy={0} payload={undefined} />}
        />
        <XAxis dataKey="createdAt" />
        <Tooltip
          content={
            <CustomTooltip
              payload={undefined}
              label={undefined}
              active={undefined}
            />
          }
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default HistoryChart;
