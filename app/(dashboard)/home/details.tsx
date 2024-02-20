/* eslint-disable @next/next/no-img-element */
'use client';

import {
  useOrganization,
  useSession,
  useUser,
  UserButton,
} from '@clerk/nextjs';

import { motivationQuotes } from '../../../utils/motivationQuotes';

import { useEffect, useState } from 'react';
import { CopyIcon, Dot } from '../../icons';
import Image from 'next/image';
import axios from 'axios';

declare global {
  interface Window {
    Prism: any;
  }
}

export function UserDetails() {
  const { isLoaded, user } = useUser();
  const { session } = useSession(); // Fetching session details

  return (
    <div
      className="bg-white shadow-xl dark:bg-blue-900 overflow-hidden sm:rounded-lg"
      style={{
        boxShadow: `0px 20px 24px -4px rgba(16, 24, 40, 0.08)`,
      }}
    >
      <div className="flex p-2">
        {isLoaded && user ? (
          <div className="py-6 max-h-96">
            <dl>
              {user.imageUrl && (
                <div className="px-8 py-2">
                  <dd className="mt-1 text-md text-gray-600 dark:text-slate-100 sm:mt-0 sm:col-span-2">
                    <div className="user-button-wrapper">
                      <UserButton />
                    </div>
                  </dd>
                </div>
              )}
              {user.firstName && (
                <div className="px-8 py-2">
                  <dt className="text-md dark:text-slate-500 font-semibold mb-1">
                    First Name
                  </dt>
                  <dd className="mt-1 text-md text-gray-600 dark:text-slate-100 sm:mt-0 sm:col-span-2">
                    {user.firstName}
                  </dd>
                </div>
              )}
              {user.lastName && (
                <div className="px-8 py-2">
                  <dt className="text-md font-semibold mb-1 dark:text-slate-500">
                    Last Name
                  </dt>
                  <dd className="mt-1 text-md text-gray-600 dark:text-slate-100 sm:mt-0 sm:col-span-2">
                    {user.lastName}
                  </dd>
                </div>
              )}
              <div className="px-8 py-2">
                <dt className="text-md font-semibold mb-1 dark:text-slate-500 text-gray-600">
                  Email addresses
                </dt>
                <dd className="mt-1 text-md text-gray-600 dark:text-slate-100 sm:mt-0 sm:col-span-2">
                  {user.emailAddresses.map((email) => (
                    <div key={email.id} className="flex gap-2 mb-1">
                      {email.emailAddress}
                      {/* {user.primaryEmailAddressId === email.id && (
                        <span className="text-sm bg-success-50 text-primary-700 rounded-2xl px-2 font-medium pt-[2px]">
                          Primary
                        </span>
                      )} */}
                    </div>
                  ))}
                </dd>
              </div>

              {session && session.status === 'active' && (
                <div className="px-8 py-2">
                  <dt className="text-md font-semibold">Session Status</dt>
                  <dd className="mt-1 text-md text-gray-600 dark:text-slate-100">
                    <span className="text-md bg-success-50 text-success-700 flex w-min gap-1 px-2 py-[1px] rounded-2xl font-medium">
                      <div className="m-auto">
                        <Dot />
                      </div>
                      Active
                    </span>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        ) : (
          <div className="text-gray-600 dark:text-slate-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            Loading user data...
          </div>
        )}
      </div>
    </div>
  );
}

// export function Motivation() {
//   const { isLoaded, session } = useSession();
//   const [prompt, setPrompt] = useState('');
//   const [promptIndex, setPromptIndex] = useState(0);

//   const setNextPrompt = () => {
//     if (promptIndex < motivationQuotes.length - 1) {
//       setPrompt(motivationQuotes[promptIndex + 1]);
//       setPromptIndex(promptIndex + 1);
//     } else {
//       // Reset to the first prompt if we've reached the end of the array
//       setPrompt(motivationQuotes[0]);
//       setPromptIndex(0);
//     }
//   };

//   return (
//     <div
//       className="bg-white shadow-xl dark:bg-blue-900 overflow-hidden sm:rounded-lg"
//       style={{
//         boxShadow: `0px 20px 24px -4px rgba(16, 24, 40, 0.08)`,
//       }}
//     >
//       <div className="flex p-8">
//         <h3 className="text-xl leading-6 font-semibold text-gray-600 dark:text-slate-100 my-auto">
//           Latest Journals
//         </h3>
//       </div>
//     </div>
//   );
// }

export function Motivation() {
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    // Get the current date
    const today = new Date();
    // Use the day of the year to determine the index
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = Number(today) - Number(startOfYear);
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Use modulo to cycle through prompts without going out of bounds
    const promptIndex = dayOfYear % motivationQuotes.length;
    setPrompt(motivationQuotes[promptIndex]);
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div
      className="bg-white shadow-xl dark:bg-blue-900 overflow-hidden sm:rounded-lg"
      style={{ boxShadow: `0px 20px 24px -4px rgba(16, 24, 40, 0.08)` }}
    >
      <div className="p-8">
        <h3 className="text-xl leading-6 font-semibold text-gray-600 dark:text-slate-100 items-center">
          Daily Motivation
        </h3>
        <p className="mt-4 text-gray-600 dark:text-slate-100 text-4xl text-left py-20">
          "{prompt}"
        </p>
      </div>
    </div>
  );
}

export function ChatLinks() {
  return (
    <div
      className="bg-white shadow-xl dark:bg-blue-900 overflow-hidden sm:rounded-lg"
      style={{
        boxShadow: `0px 20px 24px -4px rgba(16, 24, 40, 0.08)`,
      }}
    >
      <div className="p-8">
        <h3 className="text-xl leading-6 font-semibold text-gray-600 dark:text-slate-100">
          Welcome to Mood Journal!
        </h3>
        <p className="mt-4 text-gray-600 dark:text-slate-100">
          Mood Journal is your personal space to reflect on your day, track your
          mood, and discover insights about your emotional well-being. Here's
          how you can get started:
        </p>
        <ul className="list-disc pl-5 mt-4 text-gray-600 dark:text-slate-100">
          <li>
            <strong>Journal Entries:</strong> Create daily entries to document
            your thoughts, feelings, and the day's events. Our AI-powered
            analysis will provide you with a summary and sentiment score for
            each entry.
          </li>
          <br />
          <li>
            <strong>Chat with Your Personal Chatbot:</strong> Engage with your
            OpenAI-powered chatbot for personalised insights and support based
            on your journal entries and mood trends.
          </li>
          <br />
          <li>
            <strong>Visualise Your Mood:</strong> Explore your mood patterns
            over time with our interactive charts and summaries, helping you
            understand your emotional cycles better.
          </li>
        </ul>
      </div>
    </div>
  );
}
