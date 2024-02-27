'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Motivation, Welcome, UserDetails } from './details';
import UpdateProfileButton from '@/components/ProfileUpdate';

export default function DashboardPage() {
  const { isSignedIn, user } = useUser();
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    if (user) {
      // Assuming `firstName` is a direct property of the user object.
      setFirstName(user.firstName || '');
    }
  }, [user]);

  const isStranger = !firstName;

  return (
    <div className="relative min-h-screen">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
      >
        <source
          src="https://res.cloudinary.com/drbz4rq7y/video/upload/v1708622995/1871531_silhouette_blue_background_street_dance_3840x2160_1_dvko4d.mp4"
          type="video/mp4"
        />
      </video>
      <div className="z-10 relative px-4 py-12 sm:py-10 md:px-20 ">
        <h1 className="text-center sm:text-left md:text-4xl lg:text-5xl text-3xl font-semibold text-slate-200 dark:text-slate-800 ">
          Hi, {isSignedIn && user ? user.firstName || `Stranger` : 'Visitor!'}
          {isStranger && isSignedIn && (
            // <span className="block sm:inline ml-2 text-center sm:text-left md:text-2xl lg:text-3xl text-xl font-semibold text-slate-200 dark:text-slate-800 ">
            //   (Click on profile image to update your details)
            // </span>
            <UpdateProfileButton />
          )}
        </h1>

        <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="xl:col-span-2">
            <Welcome />
          </div>
          {/* Always render the UserDetails container but conditionally display content based on sign-in status */}
          <div>
            {isSignedIn && user ? (
              <UserDetails />
            ) : (
              <div
                className="bg-white/90  shadow-xl dark:bg-blue-900/95 overflow-hidden sm:rounded-lg xl:min-h-[55vh] xl:max-h-[55vh] flex items-center justify-center h-full"
                style={{
                  boxShadow: `0px 20px 24px -4px rgba(16, 24, 40, 0.08)`,
                }}
              >
                <div className="text-gray-600 dark:text-slate-100 text-3xl text-center py-8 px-8 w-full max-w-[95%] md:max-w-xl mx-auto">
                  <p>Please sign in to access your profile details.</p>
                </div>
              </div>
            )}
          </div>
          <div>
            <Motivation />
          </div>
        </div>
      </div>
    </div>
  );
}
