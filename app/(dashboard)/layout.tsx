import React from 'react';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full min-h-screen bg-blue-800 text-slate-400">
      <div className="flex h-[100vh] overflow-hidden ">
        <Sidebar />

        {/* <div className="px-4 my-4">
          <span className="text-3xl">MOOD</span>
        </div> */}
        {/* <div className="px-5 py-1"></div> */}
      </div>
      <div className="flex-1 ">
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header />

          <div className="h-full w-full px-6 flex items-center justify-end"></div>
        </div>
        <main className="grow [&>*:first-child]:scroll-mt-16 pb-16 pt-8 px-4 h-[calc(100vh-60px)] w-[calc(100vw-200px)] no-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
