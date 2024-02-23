'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from 'recharts';
import { useRouter } from 'next/navigation';

const CustomTooltip = ({
  payload,
  label,
  active,
}: {
  payload: any;
  label: any;
  active: any;
}) => {
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

const CustomDot = ({
  cx,
  cy,
  payload,
}: {
  cx: number;
  cy: number;
  payload: any;
}) => {
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
  createdAt: Date;
  sentimentScore: number;
  entryId: string;
};

type HistoryChartProps = {
  data: DataItem[];
};

const HistoryChart = ({ data }: HistoryChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className=" min-h-screen ">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover "
          autoPlay
          muted
          loop
        >
          <source
            src="https://res.cloudinary.com/drbz4rq7y/video/upload/e_accelerate:-50/v1708611224/1476901_objects_miscellaneous_3840x2160_kzwcv4.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-white opacity-60"></div>{' '}
        {/* Video Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center p-4 space-y-4">
          <p className="text-4xl md:text-5xl text-center text-slate-500">
            Your history sentiment chart will appear here.
          </p>
        </div>
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
