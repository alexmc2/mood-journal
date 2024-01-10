import React from 'react';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[100dvh] overflow-hidden ">
      <Sidebar />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto ">
        {/*  Site header */}
        <Header />

        <main className="  h-[calc(100vh-60px)] overflow-y-auto no-scrollbar ">
          {children}
        </main>
      </div>
    </div>
  );
}
