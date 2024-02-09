'use client';

import { useOrganization, useSession, useUser } from '@clerk/nextjs';

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
                    <img
                      src={user.imageUrl}
                      alt={`Profile image for ${user.fullName}`}
                      className="rounded-full w-14 h-14"
                    />
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
                      {user.primaryEmailAddressId === email.id && (
                        <span className="text-sm bg-success-50 text-primary-700 rounded-2xl px-2 font-medium pt-[2px]">
                          Primary
                        </span>
                      )}
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

export function JournalLinks() {
  const { isLoaded, session } = useSession();


  return (
    <div
      className="bg-white shadow-xl dark:bg-blue-900 overflow-hidden sm:rounded-lg"
      style={{
        boxShadow: `0px 20px 24px -4px rgba(16, 24, 40, 0.08)`,
      }}
    >
      <div className="flex p-8">
        <h3 className="text-xl leading-6 font-semibold text-gray-600 dark:text-slate-100 my-auto">
          Latest Journals
        </h3>
      </div>
    </div>
  );
}

export function ChatLinks() {
  const { isLoaded, organization } = useOrganization();
  const [jsonOutput, setJsonOutput] = useState(false);



   return (
     <div
       className="bg-white shadow-xl dark:bg-blue-900 overflow-hidden sm:rounded-lg"
       style={{
         boxShadow: `0px 20px 24px -4px rgba(16, 24, 40, 0.08)`,
       }}
     >
       <div className="flex p-8">
         <h3 className="text-xl leading-6 font-semibold text-gray-600 dark:text-slate-100 my-auto">
           Latest Chats
         </h3>
       </div>
     </div>
   );
}

