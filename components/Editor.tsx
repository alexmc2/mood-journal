'use client';

import { updateEntry, deleteEntry, newEntry } from '@/utils/api';

import React, { useState, useEffect } from 'react';

import { useAutosave } from 'react-autosave';
import Spinner from './Spinner';
import { useRouter } from 'next/navigation';

import TextareaAutosize from 'react-textarea-autosize';
// import LexicalEditor from './LexicalEditor';
// import { useLexicalContent } from '../utils/hooks/lexicalEditor';
import ExampleTheme from '../utils/themes/ExampleTheme';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import TreeViewPlugin from '../utils/plugins/TreeViewPlugin';
import ToolbarPlugin from '../utils/plugins/ToolbarPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';

import ListMaxIndentLevelPlugin from '../utils/plugins/ListMaxIndentLevelPlugin';
import CodeHighlightPlugin from '../utils/plugins/CodeHighlightPlugin';
import AutoLinkPlugin from '../utils/plugins/AutoLinkPlugin';

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
  const [value, setValue] = useState(entry?.content || '');
  const [editorContent, setEditorContent] = useState(entry?.content || '');
  const [analysis, setAnalysis] = useState(entry?.analysis || {});
  const [isNewEntry, setIsNewEntry] = useState(!entry?.id); // Changed to determine if it's a new entry
  const [isSaving, setIsSaving] = useState(false);
  const [lastAnalyzedContentHash, setLastAnalyzedContentHash] = useState('');

  const router = useRouter();

  const editorConfig = {
    // The editor theme
    theme: ExampleTheme,
    // Handling of errors during update
    onError(error: any) {
      throw error;
    },
    // Any custom nodes go here
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
    ],
  };

  const handleDelete = async () => {
    await deleteEntry(entry?.id);
    router.push('/journal');
  };

  useEffect(() => {
    createHash(entry.content).then((hash) => setLastAnalyzedContentHash(hash));
  }, [entry.content]);

  const handleTextChange = async (e) => {
    const newValue = e.target.value;
    setValue(newValue);
  };

  const handleContentUpdate = (content) => {
    setEditorContent(content);
    // useAutosave setup
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAutosave({
      data: value,
      onSave: async (_value) => {
        const contentHash = await createHash(_value);
        if (contentHash !== lastAnalyzedContentHash) {
          setIsSaving(true); // Show saving spinner
          try {
            const data = await updateEntry(entry.id, _value);
            setAnalysis(data.analysis);
            setLastAnalyzedContentHash(contentHash); // Update the hash
          } catch (error) {
            console.error('Error saving entry:', error);
          } finally {
            setIsSaving(false); // Hide saving spinner
          }
        }
      },
    });
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

  // const dataAnalysis = [
  //   { name: 'summary', value: summary },
  //   { name: 'subject', value: subject },
  //   { name: 'mood', value: mood },
  //   { name: 'negative', value: negative ? 'yes' : 'no' },
  //   { name: 'sentiment score', value: sentimentScore },
  // ];

  const compactAnalysis = [
    { name: 'Mood', value: mood },
    { name: 'Negative', value: negative ? 'yes' : 'no' },
    { name: 'Sentiment score', value: sentimentScore },
  ];

  const detailedAnalysis = [
    { name: 'Summary', value: summary },
    { name: 'Subject', value: subject },
  ];

  function Placeholder() {
    return <div className="editor-placeholder">Enter some rich text...</div>;
  }

  return (
    <LexicalComposer
      initialConfig={{ ...editorConfig, namespace: 'your-namespace' }}
    >
      <div className="h-full w-full mx-auto p-8 pt-4">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Analysis section - Show this first on small to large screens, second on large screens */}
          <div className="sm:col-span-3 md:col-span-1 md:order-2">
            <div
              className="flex flex-col mb-6 md:mb-0 gap-4 px-8 py-6 pt-12 card shadow-xl"
              style={{ backgroundColor: color, color: textColor }}
            >
              <h2 className="text-2xl font-bold  self-center ">Analysis</h2>
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
              <div className=" absolute right-1 top-1 p-2 flex  ">
                <button
                  onClick={handleDelete}
                  className="btn md:btn-md btn-sm bg-slate-500/20 hover:bg-slate-500/30 border-none text-black "
                >
                  <svg
                    className="shrink-0 h-8 w-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
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
            </div>
          </div>

          {/* Textarea section - Show this second on small to large screens, first on extra-large screens */}
          {/* Textarea section - Show this second on small to large screens, first on large screens */}
          <div className="sm:col-span-3 md:col-span-2 md:order-1">
            <div className="editor-inner ">
              <div className="editor-container  ">
                <ToolbarPlugin />

                <RichTextPlugin
                  contentEditable={
                    <ContentEditable className="editor-input " />
                  }
                  placeholder={<Placeholder />}
                  // Remove the onChange prop
                  // onChange={handleContentUpdate}
                  ErrorBoundary={LexicalErrorBoundary}
                />
                {/* <div className="absolute left-1 top-1 p-2">
                    {isSaving ? (
                      <Spinner />
                    ) : (
                      <div className="w-[16px] h-[16px] rounded-full bg-green-500"></div>
                    )}
                  </div> */}
                {/* <TextareaAutosize
                    cacheMeasurements
                    className="min-h-[50vh] w-full p-8 border-none shadow-none outline-none no-scrollbar bg-base-100 dark:bg-blue-900 rounded-2xl"
                    value={value}
                    onChange={handleTextChange}
                    placeholder="Write about your day..."
                  /> */}

                <HistoryPlugin />

                <AutoFocusPlugin />
                <CodeHighlightPlugin />
                <ListPlugin />
                <LinkPlugin />
                <AutoLinkPlugin />
                <ListMaxIndentLevelPlugin maxDepth={7} />
                <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
              </div>
            </div>

            {/* Additional elements for Textarea section */}
          </div>
        </div>
      </div>
    </LexicalComposer>
  );
};

export default Editor;

//for testing
// setTimeout(() => {
//   const dummyAnalysis = {
//     mood: 'Content',
//     summary: 'This is a summary of the dummy content.',
//     color: '#abc123',
//     subject: 'Dummy Subject',
//     negative: false,
//     sentimentScore: 5,
//   };

//   setAnalysis(dummyAnalysis);
//   setLastAnalyzedContentHash(contentHash); // Update the hash
//   setIsSaving(false); // Hide saving spinner
// }, 1000);
