'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PleaseLogin() {
  const searchParams = useSearchParams();

  // use the get method on the URLSearchParams instance
  const action = searchParams.get('action');

  // Initialize the message based on the 'action' query parameter
  let message = 'Please log in to continue.';
  switch (action) {
    case 'new_chat':
      message = 'Please sign in to start a new chat.';
      break;
    case 'new_entry':
      message = 'Please sign in to make a new journal entry.';
      break;
    case 'journals':
      message = 'Please sign in to view your journals.';
      break;
    case 'history':
      message = 'Please sign in to view your sentiment history chart.';
      break;
    default:
      break;
  }

  return (
    <div className="relative h-full">
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
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center sm:px-24 p-8 space-y-4">
        <p className="text-4xl md:text-5xl text-center text-slate-500">
          {message}
        </p>
      </div>
    </div>
  );
}
