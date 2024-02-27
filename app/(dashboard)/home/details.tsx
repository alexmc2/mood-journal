'use client';

import { useSession, useUser, UserButton } from '@clerk/nextjs';

import { motivationQuotes } from '../../../utils/motivationQuotes';

import { useEffect, useState } from 'react';
import { CopyIcon, Dot } from '../../icons';

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
      className="bg-white/90  shadow-xl dark:bg-blue-900/95 overflow-hidden sm:rounded-lg xl:min-h-[55vh] xl:max-h-[55vh]"
      style={{
        boxShadow: `0px 20px 24px -4px rgba(16, 24, 40, 0.08)`,
      }}
    >
      <div className="flex md:p-4 p-2">
        {isLoaded && user ? (
          <div className="py-6 ">
            <dl>
              {user.imageUrl && (
                <div className="px-8 py-2 p-8">
                  <dd className="mt-1 text-lg text-gray-600 dark:text-slate-100 sm:mt-0 sm:col-span-2 ">
                    <div className="user-button-wrapper">
                      <UserButton />
                    </div>
                  </dd>
                </div>
              )}
              {user.firstName && (
                <div className="px-8 py-2">
                  <dt className="text-lg dark:text-slate-500 font-semibold mb-1">
                    First Name
                  </dt>
                  <dd className="mt-1 text-lg text-gray-600 dark:text-slate-100 sm:mt-0 sm:col-span-2">
                    {user.firstName}
                  </dd>
                </div>
              )}
              {user.lastName && (
                <div className="px-8 py-2">
                  <dt className=" text-lg font-semibold mb-1 dark:text-slate-500">
                    Last Name
                  </dt>
                  <dd className="mt-1 text-lg text-gray-600 dark:text-slate-100 sm:mt-0 sm:col-span-2">
                    {user.lastName}
                  </dd>
                </div>
              )}
              <div className="px-8 py-2">
                <dt className="text-lg font-semibold mb-1 dark:text-slate-500 text-gray-600">
                  Email addresses
                </dt>
                <dd className="mt-1 text-lg text-gray-600 dark:text-slate-100 sm:mt-0 sm:col-span-2">
                  {user.emailAddresses.map((email) => (
                    <div key={email.id} className="flex gap-2 mb-1">
                      {email.emailAddress}
                    </div>
                  ))}
                </dd>
              </div>

              {session && session.status === 'active' && (
                <div className="px-8 py-2">
                  <dt className="text-lg font-semibold">Session Status</dt>
                  <dd className="mt-1 text-lg text-gray-600 dark:text-slate-100">
                    <span className="text-lg bg-success-50 text-success-700 flex w-min gap-1 px-2 py-[1px] rounded-2xl font-medium">
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
  }, []);

  return (
    <div
      className="bg-white/90 shadow-xl dark:bg-blue-900/95 overflow-hidden sm:rounded-lg text-center xl:min-h-[55vh] xl:max-h-[55vh] lg:px-8 px-0 py-8"
      style={{ boxShadow: `0px 20px 24px -4px rgba(16, 24, 40, 0.08)` }}
    >
      <div className="p-8 xl:grid place-items-center">
        <h3 className="text-2xl font-semibold text-gray-600 dark:text-slate-100">
          Daily Motivation
        </h3>
        <div className="text-gray-600 dark:text-slate-100 text-3xl text-left xl:pt-20 py-8 px-8 w-full max-w-[95%] md:max-w-xl mx-auto">
          "{prompt}"
        </div>
      </div>
    </div>
  );
}

export function Welcome() {
  return (
    <div
      className="bg-white/90  shadow-xl dark:bg-blue-900/95 overflow-hidden sm:rounded-lg lg:p-6 px-2"
      style={{
        boxShadow: `0px 20px 24px -4px rgba(16, 24, 40, 0.08)`,
      }}
    >
      <div className="p-8">
        <h3 className="text-2xl leading-6 font-semibold text-gray-600 dark:text-slate-100 text-center py-6">
          Welcome to Mood Chat!
        </h3>
        <p className="mt-4 text-gray-600 dark:text-slate-100 text-lg">
          Mood Chat is your personal space to reflect on your day, track your
          mood, and discover insights about your emotional well-being. Here's
          how you can get started:
        </p>
        <br />
        <ul className="list-disc pl-5 mt-4 text-gray-600 dark:text-slate-100 text-lg">
          <li>
            <strong>Journal Entries:</strong> Create daily entries to document
            your thoughts, feelings, and the day's events. AI-powered analysis
            will provide you with a summary and sentiment score for each entry.
          </li>
          <br />
          <li>
            <strong>Chat with Your Personal Chatbot:</strong> Engage with your
            OpenAI-powered chatbot for personalised insights and support based
            on your journal entries and chat history.
          </li>
          <br />
          <li>
            <strong>Visualise Your Mood:</strong> Explore your mood patterns
            over time with your history sentiment chart, helping you understand
            your emotional cycles better.
          </li>
        </ul>
        <br />
        <p className="mt-4 text-gray-600 dark:text-slate-100 ">
          Visit the{' '}
          <a href="/userguide" className="text-blue-500">
            User Guide
          </a>{' '}
          for more information on how to use Mood Chat.
        </p>
      </div>
    </div>
  );
}
