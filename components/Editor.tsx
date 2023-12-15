'use client';

import { updateEntry } from '@/utils/api';
import { useState } from 'react';
import { useAutosave } from 'react-autosave';
import Spinner from './Spinner';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
} from '@nextui-org/react';
import TextareaAutosize from 'react-textarea-autosize';

const Editor = ({ entry }) => {
  const [value, setValue] = useState(entry.content);
  const [analysis, setAnalysis] = useState(entry.analysis || {}); // Default to an empty object if null
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  // const handleDelete = async () => {
  //   await deleteEntry(entry.id);
  //   router.push('/journal');
  // };

  function getContrastYIQ(hexcolor) {
    // Default to a valid color if hexcolor is undefined or invalid
    // if (!hexcolor || !hexcolor.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)) {
    //   hexcolor = '#ffffff'; // default to white
    // }
    hexcolor = hexcolor.replace('#', '');
    var r = parseInt(hexcolor.substr(0, 2), 16);
    var g = parseInt(hexcolor.substr(2, 2), 16);
    var b = parseInt(hexcolor.substr(4, 2), 16);
    var yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? 'black' : 'white';
  }

  const {
    mood = '',
    summary = '',
    color = '#ffffff',
    subject = '',
    negative = false,
    sentimentScore = '',
  } = analysis;
  const textColor = getContrastYIQ(color);

  const dataAnalysis = [
    { name: 'summary', value: summary },
    { name: 'subject', value: subject },
    { name: 'mood', value: mood },
    { name: 'negative', value: negative ? 'yes' : 'no' },
    { name: 'sentiment score', value: sentimentScore },
  ];

  useAutosave({
    data: value,
    onSave: async (_value) => {
      setIsSaving(false);

      const data = await updateEntry(entry.id, _value);

      setAnalysis(data.analysis || {});

      setIsSaving(false);
    },
  });

  return (
    <div className="h-full w-full grid md:grid-cols-3 gap-8 p-8 pt-4">
      <div className="md:col-span-2">
        <Card className="flex h-full w-full">
          <div className="absolute left-1 top-1 p-2">
            {isSaving ? (
              <Spinner />
            ) : (
              <div className="w-[16px] h-[16px] rounded-full bg-green-500"></div>
            )}
          </div>
          <TextareaAutosize
            cacheMeasurements
            className=" h-full w-full p-8 text-slate-700 border-none shadow-none outline-none no-scrollbar "
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </Card>
      </div>
      <div className="border-l px-8 h-full border-slate-700">
        <div
          className="flex w-full h-full flex-col mb-6 md:mb-0 gap-4 p-8  card "
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

export default Editor;
