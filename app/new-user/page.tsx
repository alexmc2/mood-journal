'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// The user is redirected to this page after signing in.
// This page calls the /api/user endpoint to check if the user exists in the database.
export default function NewUser() {
  const router = useRouter();

  useEffect(() => {
    async function fetchUserStatus() {
      console.log('Fetching user status from /api/user');
      const response = await fetch('/api/user');
      const result = await response.json();
      console.log('Fetch response:', result);

      if (response.ok && result.success) {
        console.log('User setup successful, redirecting to /home');
        router.push('/home');
      } else {
        console.log(
          'User setup failed or not authenticated, redirecting to sign-in'
        );
        router.push('/sign-in');
      }
    }

    fetchUserStatus();
  }, [router]);

  return (
    <div className="min-h-screen overflow-x-hidden overflow-y-hidden flex flex-col justify-between items-center">
      <div className="relative w-full h-screen flex flex-col justify-center items-center">
        <div className="relative z-10 text-white sm:px-2 md:px-3 px-4 text-center sm:max-w-screen-md max-w-screen-sm font-bold flex flex-col items-center">
          <div className="w-full max-w-[900px]  px-2 card bg-black/50 ">
            <div className="card-body ">
              <h1 className="text-3xl md:text-5xl pb-4  text-white ">
                Mood Chat
              </h1>

              <div>
                <div className="px-4 text-white text-xl">
                  Loading<span className="thinking-dots"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
