'use client';

import Link from 'next/link';
import { Menu, Transition } from '@headlessui/react';

export default function UpdateProfileButton({
  align,
}: {
  align?: 'left' | 'right';
}) {
  return (
    <Menu as="div" className="relative inline-flex">
      {({ open }) => (
        <>
          <Menu.Button className="w-7 h-7 flex items-center justify-center rounded-full ml-2">
            <svg
              className="w-6 h-6"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="fill-current text-slate-300 dark:text-slate-400 hover:text-slate-400 dark:hover:text-slate-500 transition-colors duration-300"
                d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z"
              />
            </svg>
          </Menu.Button>
          <Transition
            className={`origin-top z-10 absolute top-full min-w-[11rem] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 rounded shadow-lg overflow-hidden mt-1 ${
              align === 'right' ? 'md:right-0' : 'md:left-0'
            } left-1/2 transform -translate-x-1/2 md:translate-x-0`}
            enter="transition ease-out duration-200 transform"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="text-sm font-semibold text-slate-500 dark:text-slate-300 pt-1.5 pb-2 px-2">
              Click on your profile image to update your details
            </div>
          </Transition>
        </>
      )}
    </Menu>
  );
}
