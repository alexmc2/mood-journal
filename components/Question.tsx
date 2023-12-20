'use client';

import { askQuestion } from '@/utils/api';
import { useState } from 'react';

const Question = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data } = await askQuestion(question);

    // Formatting the response
    let formattedAnswer = data;
    // Remove any 'Friend:' prefix
    // formattedAnswer = formattedAnswer.replace(/^Friend:\s*/, '');
    // Ensure proper paragraph formatting
    formattedAnswer = formattedAnswer.split('\n').join('<br/>');

    setAnswer(formattedAnswer);
    setLoading(false);
    setQuestion('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="input input-bordered w-full max-w-[600px] mt-4 mr-3 text-slate-700"
          disabled={loading}
          placeholder="Ask a question..."
        />
        <button
          disabled={loading}
          type="submit"
          className="btn btn-xs sm:btn-sm md:btn-md w-[150px] text-center bg-blue-200 hover:bg-blue-400 border-none "
        >
          Ask
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {answer && (
        <div
          className="my-4 text-xl"
          dangerouslySetInnerHTML={{ __html: answer }}
        />
      )}
    </div>
  );
};

export default Question;
