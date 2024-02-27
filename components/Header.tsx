'use client';

import { useEffect, useState } from 'react';
import { useAppProvider } from '@/app/providers/app-provider';
import { UserButton } from '@clerk/nextjs';
import { useUser, SignInButton, SignUpButton } from '@clerk/nextjs';

import ThemeToggle from '@/components/theme-toggle';

export default function Header() {
  const { sidebarOpen, setSidebarOpen } = useAppProvider();
  const { isSignedIn } = useUser();

  // useEffect hook to log the user's sign-in status whenever it changes
  useEffect(() => {
    console.log(`User is ${isSignedIn ? 'signed in' : 'not signed in'}.`);
  }, [isSignedIn]);

  //TODO, search functionality
  // const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0  dark:bg-slate-900 bg-neutral-100 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 ">
          {/* Header: Left side */}
          <div className="flex">
            {/* Hamburger button */}

            <button
              className="dark:text-blue-200 text-blue-600 hover:text-blue-400 lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={() => {
                setSidebarOpen(!sidebarOpen);
              }}
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="4" y="5" width="16" height="2" />
                <rect x="4" y="11" width="16" height="2" />
                <rect x="4" y="17" width="16" height="2" />
              </svg>
            </button>
          </div>

          {/* Header: Right side */}
          <div className="flex items-center space-x-3">
            <div>
              {/* 
              <SearchModal
                isOpen={searchModalOpen}
                setIsOpen={setSearchModalOpen}
              /> */}
            </div>
            <ThemeToggle />

            {/*  Divider */}
            <hr className="w-px h-6 bg-slate-200 dark:bg-slate-700 border-none" />

            {!isSignedIn ? (
              <>
                <div className="flex justify-center items-center space-x-2">
                  <SignInButton mode="redirect" afterSignInUrl="/new-user">
                    <div className="cursor-pointer bg-blue-100 hover:bg-blue-200 dark:bg-blue-200 dark:hover:bg-blue-300 border-none text-slate-600 dark:text-slate-800 font-bold py-2 px-4 rounded transition duration-500">
                      Sign In
                    </div>
                  </SignInButton>
                  <SignUpButton mode="redirect" afterSignUpUrl="/new-user">
                    <div className="cursor-pointer bg-blue-100 hover:bg-blue-200 dark:bg-blue-200 dark:hover:bg-blue-300 border-none text-slate-600 dark:text-slate-800 font-bold py-2 px-4 rounded transition duration-500">
                      Sign Up
                    </div>
                  </SignUpButton>
                </div>
              </>
            ) : (
              <UserButton /> // Show UserButton if the user is signed in
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
