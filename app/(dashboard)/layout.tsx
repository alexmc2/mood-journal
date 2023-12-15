import React from 'react';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

const links = [
  { name: 'HOME', href: '/' },
  { name: 'JOURNALS', href: '/journal' },
  { name: 'HISTORY', href: '/history' },
];

const DashboardLayout = ({ children }) => {
  return (
    <div className="w-screen h-screen relative">
      <aside className="absolute w-[200px] top-0 left-0 h-full border-r border-slate-700">
        <div className="px-4 my-4">
          <span className="text-3xl">MOOD</span>
        </div>
        <div>
          {links.map((link) => (
            <div key={link.name} className="text-xl my-4">
              <Link href={link.href}>
                <div className="px-5 py-1 ">
                  <button className="btn btn-xs sm:btn-sm md:btn-md w-[150px] text-center bg-blue-200 hover:bg-blue-400 border-none ">
                    {link.name}
                  </button>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </aside>
      <div className="ml-[200px] ">
        <header className="h-[60px] border-b border-slate-700">
          <div className="h-full w-full px-6 flex items-center justify-end">
            <UserButton />
          </div>
        </header>
        <div className="p-8 h-[calc(100vh-60px)] w-[calc(100vw-200px)] ">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
