import React from 'react';
import Link from 'next/link';

// UserGuide component
const UserGuide = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div>
        <title>User Guide | Mood Journal</title>
      </div>
      {/* Back to Mood Journal button */}
      <div className="pt-6 px-5 w-full flex justify-start">
        <Link href="/home" passHref>
          <div className="mb-2 flex items-center text-blue-500 hover:text-blue-700 font-semibold">
            {/* Arrow icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Mood Journal
          </div>
        </Link>
      </div>
      {/* Main content */}
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-4xl mx-auto p-5">
          <div className="bg-white p-8 rounded-lg shadow-lg prose">
            <h1 className="text-center pt-6">How to Use Mood Journal</h1>

            <p>
              Welcome to Mood Journal, your personal digital space for emotional
              well-being and self-reflection. The app combines the simplicity of
              journaling with the power of AI to offer insights into your mood
              patterns and emotional health. Here’s how to make the most out of
              Mood Journal:
            </p>

            <h2>Getting Started</h2>
            <ul>
              <li>
                <strong>Navigate the App:</strong> Use the sidebar to access
                different parts of the app. The sidebar includes links to Home,
                Journal Entries, New Entry, History, and New Chat. On smaller
                interfaces, you can expand or collapse the sidebar for more
                space.
              </li>
            </ul>

            <h2>Journaling</h2>
            <ul>
              <li>
                <strong>Create a New Journal Entry:</strong> Click "New Entry"
                on the sidebar to start writing. The editor supports rich text
                formatting with TinyMCE.
              </li>
              <br />
              <li>
                <strong>Autosave:</strong> The app automatically saves your
                entries as you type, preventing data loss if you navigate away
                or close the browser.
              </li>
              <br />
              <li>
                <strong>Save and Analyse:</strong> Press "Save" to manually save
                your entry and run AI analysis, providing a summary and
                sentiment score. AI analysis is only performed on manual saves.
              </li>

              <br />
              <li>
                <strong>View and Manage Entries:</strong> Access your previous
                entries through "Journal Entries" in the sidebar. Here, you can
                read, edit, or delete past entries.
              </li>
            </ul>
            <h2>Engaging with AI Chatbot</h2>
            <ul>
              <li>
                <strong>Start a New Chat:</strong> Click on "New Chat" from the
                sidebar. This generates a new chat session where you can
                converse with an OpenAI-powered chatbot. The chatbot offers
                insights and support based on your journal entries and mood
                trends.
              </li>
              <br />
              <li>
                <strong>Interact and Reflect:</strong> Ask questions, seek
                advice, or simply reflect on your day with the chatbot. It’s
                designed to provide personalised interactions by using your
                journal entries and chat history for context-aware responses.
              </li>
            </ul>

            <h2>Exploring Mood Insights</h2>
            <ul>
              <li>
                <strong>Track Your Mood:</strong> Visit the "History" section to
                view visual charts of your mood over time. This
                feature allows you to identify patterns, triggers, and
                improvements in your emotional well-being. You can also access
                your journal entries directly from the chart.
              </li>
              <br />
              <li>
                <strong>Insightful Summaries:</strong> The AI analysis of each
                journal entry contributes to your overall mood insights, helping
                you understand your emotional cycles better.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
