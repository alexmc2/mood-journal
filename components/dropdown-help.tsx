'use client';

import Link from 'next/link';
import { Menu, Transition } from '@headlessui/react';

export default function InfoButton({ align }: { align?: 'left' | 'right' }) {
  return (
    <Menu as="div" className="relative inline-flex">
      {({ open }) => (
        <>
          <Menu.Button
            className={`w-12 h-12 flex items-center justify-center bg-yellow-400 hover:bg-yellow-600/80 dark:bg-yellow-500 dark:hover:bg-yellow-600/80 rounded-full ${
              open && 'bg-slate-100'
            }`}
          >
            <span className="sr-only">Need help?</span>
            <svg
              className="w-6 h-6"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="fill-current text-slate-500 dark:text-slate-200"
                d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z"
              />
            </svg>
          </Menu.Button>
          <Transition
            className={`origin-top-right z-10 absolute top-full min-w-[11rem] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 rounded shadow-lg overflow-hidden mt-1 ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
            enter="transition ease-out duration-200 transform"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-out duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase pt-1.5 pb-2 px-3">
              Need help?
            </div>
            <Menu.Items as="ul" className="focus:outline-none">
              <Menu.Item as="li">
                {({ active }) => (
                  <Link
                    className={`font-medium text-sm flex items-center py-1 px-3 ${
                      active
                        ? 'text-slate-600 dark:text-slate-300'
                        : 'text-slate-600'
                    }`}
                    href="/userguide"
                  >
                    <svg
                      className="w-3 h-3 fill-current text-slate-600 dark:text-slate-300 shrink-0 mr-2"
                      viewBox="0 0 12 12"
                    >
                      <rect y="3" width="12" height="9" rx="1" />
                      <path d="M2 0h8v2H2z" />
                    </svg>
                    <span className="dark:text-slate-300 hover:dark:text-slate-400 hover:text-slate-400">User Guide</span>
                  </Link>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}
