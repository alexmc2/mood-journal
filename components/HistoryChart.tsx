'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from 'recharts';
import { useRouter } from 'next/navigation';

const CustomTooltip = ({ payload, label, active }) => {
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
        <p className="label xs:text-md text-xl uppercase p-4">{analysis.mood}</p>
        <p className="label xs:text-sm md:text-lg p-4 ">
          Sentiment Score: {analysis.sentimentScore}
        </p>
      </div>
    );
  }

  return null;
};

const CustomDot = ({ cx, cy, payload }) => {
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

const HistoryChart = ({ data }) => {
  return (
    <ResponsiveContainer height="100%" minWidth={600}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="sentimentScore"
          stroke="#8884d8"
          strokeWidth={2}
          dot={<CustomDot />}
        />
        <XAxis dataKey="createdAt" />
        <Tooltip content={<CustomTooltip />} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default HistoryChart;
