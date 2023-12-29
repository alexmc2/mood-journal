'use client';

import { updateEntry, deleteEntry, fetchEntry } from '@/utils/api';
import React, { useRef, useEffect, useState } from 'react';
import Spinner from './Spinner';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import CustomEditor from './CustomEditor';

const createHash = async (content: string | undefined) => {
  const msgBuffer = new TextEncoder().encode(content); // Encode as UTF-8
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer); // Hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(''); // Convert bytes to hex string
  return hashHex;
};

const getContrastYIQ = (hexcolor: string) => {
  if (!hexcolor) {
    console.error('Hex color is undefined');
    return '#ffffff';
  }

  hexcolor = hexcolor.replace('#', '');
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? 'black' : 'white';
};

const Editor = ({ entry }) => {
  const editorContentRef = useRef(entry.content || '');
  const [analysis, setAnalysis] = useState(entry.analysis || {});
  const [isSaving, setIsSaving] = useState(false);
  const [lastAnalyzedContentHash, setLastAnalyzedContentHash] = useState('');

  const router = useRouter();

  const { theme } = useTheme(); // Get the current theme

  // Define stroke colors for light and dark themes
  const lightThemeStrokeColor = '#000000'; //black for light theme
  const darkThemeStrokeColor = '#FFFFFF'; //white for dark theme

  // Determine the stroke color based on the theme
  const svgStrokeColor =
    theme === 'dark' ? darkThemeStrokeColor : lightThemeStrokeColor;

  const handleDelete = async () => {
    await deleteEntry(entry.id);
    router.push('/journal');
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const savedContent = await fetchEntry(entry.id);
        editorContentRef.current = savedContent.content;
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchContent();
  }, [entry.id]);

  useEffect(() => {
    createHash(entry.content).then((hash) => setLastAnalyzedContentHash(hash));
  }, [entry.content]);

  const handleEditorChange = (content) => {
    editorContentRef.current = content;
  };

  const handleSave = async () => {
    const content = editorContentRef.current; // Use the current ref value
    const contentHash = await createHash(content);
    if (contentHash !== lastAnalyzedContentHash) {
      setIsSaving(true); // Show saving spinner
      try {
        const data = await updateEntry(entry.id, editorContentRef.current);
        setAnalysis(data.analysis || {});
        setLastAnalyzedContentHash(contentHash); // Update the hash
      } catch (error) {
        console.error('Error saving entry:', error);
      } finally {
        setIsSaving(false); // Hide saving spinner
      }

      //   setTimeout(() => {
      //     const dummyAnalysis = {
      //       mood: 'Content',
      //       summary: 'This is a summary of the dummy content.',
      //       color: '#abc123',
      //       subject: 'Dummy Subject',
      //       negative: false,
      //       sentimentScore: 5,
      //     };

      //     setAnalysis(dummyAnalysis);
      //     setLastAnalyzedContentHash(contentHash); // Update the hash
      //     setIsSaving(false); // Hide saving spinner
      //   }, 1000);
      // } else {
      //   console.log('No significant changes detected, autosave skipped.');
    }
  };

  const {
    mood = '',
    summary = '',
    color = '#ffffff',
    subject = '',
    negative = false,
    sentimentScore = '',
  } = analysis;

  const textColor = getContrastYIQ(color);

  const compactAnalysis = [
    { name: 'Mood', value: mood },
    { name: 'Negative', value: negative ? 'yes' : 'no' },
    { name: 'Sentiment score', value: sentimentScore },
  ];

  const detailedAnalysis = [
    { name: 'Summary', value: summary },
    { name: 'Subject', value: subject },
  ];

  return (
    <div className="h-full w-full mx-auto grid md:grid-cols-3 gap-8 p-8 mt-8 ">
      <div className="absolute left-4 top-20  ">
        {isSaving ? (
          <Spinner />
        ) : (
          <div className="w-[16px] h-[16px] rounded-full bg-green-500 "></div>
        )}
      </div>
      <div className=" absolute left-28 top-20 p-2 flex  ">
        <button
          onClick={handleDelete}
          className="btn btn-md dark:bg-red-400 dark:hover:bg-red-500 bg-red-400 hover:bg-red-500 border-none dark:text-slate-600 text-slate-300 "
        >
          <svg
            className="shrink-0 h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke={svgStrokeColor}
            strokeWidth="1.5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
      </div>
      <div className=" absolute left-10 top-20 p-2 flex  ">
        <button
          onClick={handleSave}
          className="btn btn-md dark:bg-green-400 dark:hover:bg-green-500 bg-green-400 hover:bg-green-500 border-none dark:text-slate-600 text-slate-300 "
        >
          <svg
            className="shrink-0 h-9 w-9"
            viewBox="0 0 24 24"
            fill="none"
            stroke={svgStrokeColor}
            strokeWidth="1.5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6C4 4.89543 4.89543 4 6 4H12H14.1716C14.702 4 15.2107 4.21071 15.5858 4.58579L19.4142 8.41421C19.7893 8.78929 20 9.29799 20 9.82843V12V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 4H13V7C13 7.55228 12.5523 8 12 8H9C8.44772 8 8 7.55228 8 7V4Z"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 15C7 13.8954 7.89543 13 9 13H15C16.1046 13 17 13.8954 17 15V20H7V15Z"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div className="md:col-span-2  ">
        <div className=" w-full min-h-[60vh] card  ">
          <div className="">
            <CustomEditor
              onChange={handleEditorChange}
              initialValue={editorContentRef.current}
            />
          </div>
        </div>
      </div>
      <div className=" md:border-l px-8 h-full dark:border-slate-600 border-slate-300">
        <div
          className="flex w-full h-full flex-col mb-6 md:mb-0 gap-4 p-8 card shadow-xl"
          style={{ backgroundColor: color, color: textColor }}
        >
          <h2 className="text-2xl font-bold items-center justify-between self-center pt-4">
            Analysis
          </h2>
          <div className="divider"></div>
          <div className="flex flex-col space-y-4">
            {detailedAnalysis.map((item) => (
              <div key={item.name} className="flex flex-col">
                <span className="font-bold pb-2">{item.name}:</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
          <div className="divider"></div>

          <div className="flex flex-col space-y-3">
            {compactAnalysis.map((item) => (
              <div
                key={item.name}
                className="flex justify-between items-center"
              >
                <span className="font-semibold">{item.name}:</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
          {/* Divider here if needed */}
          {/* Detailed Analysis Display */}
        </div>
      </div>
    </div>
  );
};

export default Editor;
