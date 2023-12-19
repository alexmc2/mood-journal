import React from 'react';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto ">
        {/*  Site header */}
        <Header />

        <main className=" pb-16 pt-8 px-4 h-[calc(100vh-60px)]  ">
          {children}
        </main>
      </div>
    </div>
  );
}
