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

  function getContrastYIQ(hexcolor: string) {
    // Default to a valid color if hexcolor is undefined or invalid
    // if (!hexcolor || !hexcolor.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)) {
    //   hexcolor = '#ffffff'; // default to white
    // }
    if (!hexcolor) {
      console.error('Hex color is undefined');
      return '#ffffff';
    }

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
      // Only proceed if there is content
      if (_value.trim().length > 50) {
        setIsSaving(true);

        try {
          // Call the API to update the entry
          const updatedEntry = await updateEntry(entry.id, _value);
          setAnalysis(updatedEntry.analysis || {});
        } catch (error) {
          console.error('Error saving entry:', error);
          // Handle the error appropriately
        } finally {
          setIsSaving(false);
        }
      }
    },
  });

  // const data = await updateEntry(entry.id, _value);

  // setAnalysis(data.analysis || {});

  // setIsSaving(false);

  //dummy data
  // setTimeout(() => {
  //   setAnalysis({

  //   });
  //   setIsSaving(false);
  // }, 1000);

  return (
    // <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
    //   {/* Page content */}
    //   <div className="max-w-5xl mx-auto flex flex-col lg:flex-row lg:space-x-8 xl:space-x-16">

    <div className="h-full w-full mx-auto grid md:grid-cols-3 gap-8 p-8 pt-4 ">
      <div className="md:col-span-2  ">
        <div className=" w-full min-h-[40vh] card shadow-xl ">
          <TextareaAutosize
            cacheMeasurements
            className=" min-h-[40vh] w-full p-8 border-none shadow-none outline-none no-scrollbar bg-base-100 dark:bg-blue-900 rounded-2xl "
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Write about your day..."
          />

          <div className="absolute left-1 top-1 p-2 ">
            {isSaving ? (
              <Spinner />
            ) : (
              <div className="w-[16px] h-[16px] rounded-full bg-green-500 "></div>
            )}
          </div>
        </div>
      </div>
      <div className=" md:border-l px-8 h-full dark:border-slate-600 border-slate-300">
        <div
          className="flex w-full h-full flex-col mb-6 md:mb-0 gap-4 p-8  card shadow-xl"
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
