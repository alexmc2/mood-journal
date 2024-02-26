'use client';

import { useEffect, useState } from 'react';
import { useAppProvider } from '@/app/providers/app-provider';
import { UserButton } from '@clerk/nextjs';
import { useUser, SignInButton, SignUpButton } from '@clerk/nextjs';

import ThemeToggle from '@/components/theme-toggle';

export default function Header() {
  const { sidebarOpen, setSidebarOpen } = useAppProvider();
  const { isSignedIn } = useUser();
  // const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);

  useEffect(() => { }, []);

  return (
    <header className="sticky top-0  bg-slate-900 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 ">
          {/* Header: Left side */}
          <div className="flex">
            {/* Hamburger button */}

            <button
              className="text-blue-200 hover:text-blue-400 lg:hidden"
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
            {/* Conditionally render sign-in and sign-up buttons if the user is not signed in */}
            {!isSignedIn ? (
              <>
                <SignInButton afterSignInUrl="/new-user">
                  <button className="bg-blue-200 hover:bg-blue-400 text-black font-bold py-2 px-4 rounded transition duration-500">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton afterSignUpUrl="/new-user">
                  <button className="ml-2 bg-blue-200 hover:bg-blue-400 text-black font-bold py-2 px-4 rounded transition duration-500">
                    Sign Up
                  </button>
                </SignUpButton>
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
