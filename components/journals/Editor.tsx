'use client';

import { updateEntry, deleteEntry, fetchEntry } from '@/utils/api';
import React, { useRef, useEffect, useState } from 'react';
import Spinner from '../Spinner';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import CustomEditor from './CustomEditor';
import DeleteEntryModal from './DeleteEntryModal';
import { useDisclosure } from '@nextui-org/react';
import { useParams } from 'next/navigation';
import DeleteEntryButton from './DeleteEntryButton';
import { useAutosave } from 'react-autosave';
import InfoButton from './dropdown-help';
import { debounce } from 'lodash';

const createHash = async (content: string | undefined) => {
  const msgBuffer = new TextEncoder().encode(content); // Encode as UTF-8
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer); // Hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(''); // Convert bytes to hex string
  return hashHex;
};

// This analysis background colour is dynamic so this function is used to determine the text colour based on the background colour
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

interface Entry {
  id: string;
  content?: string;
  analysis?: {
    mood?: string;
    summary?: string;
    color?: string;
    subject?: string;
    negative?: boolean;
    sentimentScore?: number;
  } | null;
}

const Editor = ({ entry }: { entry: Entry | null }) => {
  // const editorContentRef = useRef(entry?.content || '');

  const [analysis, setAnalysis] = useState(entry?.analysis || {});
  const [isSaving, setIsSaving] = useState(false);
  const [lastAnalyzedContentHash, setLastAnalyzedContentHash] = useState('');
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(
    null
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editorContent, setEditorContent] = useState(entry?.content || '');
  const editorContentRef = useRef(editorContent);

  const params = useParams();
  const currentEntryId = params.id;

  const router = useRouter();

  const { theme } = useTheme(); // Get the current theme

  // Define stroke colors for light and dark themes
  const lightThemeStrokeColor = '#000000'; //black for light theme
  const darkThemeStrokeColor = '#FFFFFF'; //white for dark theme

  // Determine the stroke color based on the theme
  const svgStrokeColor =
    theme === 'dark' ? darkThemeStrokeColor : lightThemeStrokeColor;

  const handleJournalDelete = async () => {
    if (selectedJournalId) {
      try {
        await deleteEntry(selectedJournalId);
        // Update state to reflect deletion...
        onClose(); // Close the modal
      } catch (error) {
        console.error('Error deleting journal:', error);
       
      }
    }
  };

  const openDeleteJournalModal = async (Id: string, content: string) => {
    // Check if the content is empty or contains placeholder text
    if (
      !content ||
      content.trim() === '' ||
      content === 'Write about your day...'
    ) {
      try {
        await deleteEntry(Id); // Directly call the delete function
        console.log('Entry deleted successfully');
        router.push('/journal'); // Redirect to the journal page
      } catch (error) {
        console.error('Error deleting journal:', error);
      }
    } else {
      // For entries with content, proceed with the normal deletion process
      setSelectedJournalId(Id);
      onOpen(); // Only open the modal for entries that actually have content
    }
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const savedContent = await fetchEntry(entry?.id || '');
        editorContentRef.current = savedContent.content;
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchContent();
  }, [entry?.id]);

  useEffect(() => {
    if (entry) {
      createHash(entry.content).then((hash) =>
        setLastAnalyzedContentHash(hash)
      );
    }
  }, [entry, entry?.content]);

  const handleEditorChange = (content: string) => {
    setEditorContent(content); // For autosave
    editorContentRef.current = content; // For manual save
  };

  // const handleEditorChange = (content: string) => {
  //   editorContentRef.current = content;
  // };

  const handleSave = async () => {
    setIsSaving(true); // Indicate saving process has started

    const content = editorContentRef.current; // Use the current ref value
    const contentHash = await createHash(content);

    try {
      if (entry) {
        // Always update the entry to save the latest content on manual save
        const data = await updateEntry(entry.id, content);

        setAnalysis(data.analysis || {});
        setLastAnalyzedContentHash(contentHash); // Update the hash to reflect this analysis
      }
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setIsSaving(false); // Indicate saving process has ended
    }
  };

  useAutosave({
    data: editorContent, // Triggered by changes to editorContent
    onSave: async (currentContent) => {
      const currentContentHash = await createHash(currentContent);

      // Proceed with autosave only if the content hash differs from the last saved hash
      if (
        currentContentHash !== lastAnalyzedContentHash &&
        currentContent !== entry?.content
      ) {
        setIsSaving(true);
        try {
          if (entry) {
            const data = await updateEntry(entry.id, editorContentRef.current);
          }

          setLastAnalyzedContentHash(currentContentHash); // Update the hash to reflect the latest content
        } catch (error) {
          console.error('Error saving entry:', error);
        } finally {
          setIsSaving(false);
        }
      } else {
        console.log('No significant changes detected, autosave skipped.');
      }
    },
  });

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

  // Need a workaround for router.events because this isn't available in the app router.
  // This still needs to be implemented.

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 p-8 mt-16 h-full w-full">
      <div className="absolute left-4 top-20  ">
        {isSaving ? (
          <Spinner />
        ) : (
          <div className="w-[16px] h-[16px] rounded-full bg-green-500 "></div>
        )}
      </div>
      <div className=" absolute left-28 top-20 p-2 flex  ">
        <DeleteEntryButton
          Id={entry ? entry.id : ''}
          onOpenDeleteModal={() =>
            entry && openDeleteJournalModal(entry.id, editorContentRef.current)
          }
        />
        <DeleteEntryModal
          isOpen={isOpen}
          onClose={onClose}
          id={entry ? entry.id : ''}
          onDelete={handleJournalDelete}
          currentEntryId={
            Array.isArray(currentEntryId) ? currentEntryId[0] : currentEntryId
          }
        />
        <div className="pl-2">
          <InfoButton />
        </div>
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
      <div className="order-1 lg:order-1 flex flex-col lg:col-span-2  lg:mb-0">
        <div className="card lg:min-h-[60vh]">
          <div className="">
            <CustomEditor
              onChange={handleEditorChange}
              value={editorContentRef.current}
            ></CustomEditor>
          </div>
        </div>
      </div>
      <div className="order-2 lg:order-2 flex flex-col lg:border-l lg:px-8 dark:border-slate-600 border-slate-300 lg:col-span-1">
        <div
          className="card shadow-xl flex w-full h-full flex-col gap-4 p-8"
          style={{ backgroundColor: color, color: textColor }}
        >
          <h2 className="text-2xl font-bold items-center justify-between self-center pt-2">
            Analysis
          </h2>
          <div className="divider"></div>
          {color === '#ffffff' ? (
            <div className="flex flex-col space-y-4 p-4">
              <p>
                Press the save button to run the AI analysis on your journal
                entry.
                <br />
                <br />
                Your journal entries will be saved automatically.
              </p>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor;
