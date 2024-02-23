'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination } from '@nextui-org/react';
import { newEntry } from '@/utils/api';
import { useRouter } from 'next/navigation';
import newEntryIcon from '@/components/icons/newEntry';

import EntryCard from '@/components/EntryCard';
import Link from 'next/link';

const getEntries = async (page = 1) => {
  try {
    const response = await axios.get(`/api/pagination/${page}`);
    return response.data;
  } catch (error) {
    console.error('Fetch error:', error);
    return { entries: [], pageCount: 0 };
  }
};

interface JournalEntry {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  content: string;
  contentHash?: string;
  analysis?: Analysis;
}

interface Analysis {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  entryId: string;
  userId: string;
  mood: string;
  summary: string;
  color: string;
  negative: boolean;
  subject: string;
  sentimentScore: number;
}

const JournalPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;
  const router = useRouter();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getEntries(currentPage);
      setEntries(data.data);
      setTotalPages(data.pageCount);
    };
    fetchData();
  }, [currentPage]);

  const handlePageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };
  const link = [
    {
      name: 'new journal entry',
      href: `/journal/{data.id}`,
      icon: newEntryIcon,
    },
  ];

  // New journal entry link on empty journal page

  const handleOnClick = async () => {
    if (!isButtonDisabled) {
      setIsButtonDisabled(true); // Disable the button
      const { data } = await newEntry();
      router.push(`/journal/${data.id}`);
      setTimeout(() => setIsButtonDisabled(false), 4000);
    }
  };

  if (!entries || entries.length === 0) {
    return (
      <div className="relative h-full">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover "
          autoPlay
          muted
          loop
        >
          <source
            src="https://res.cloudinary.com/drbz4rq7y/video/upload/e_accelerate:-50/v1708611224/1476901_objects_miscellaneous_3840x2160_kzwcv4.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-white opacity-60"></div>{' '}
        {/* Video Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center p-4 space-y-4">
          <p className="text-4xl md:text-5xl text-center text-slate-500">
            Your journal entries will appear here.
          </p>

          <p className="text-2xl md:text-3xl text-center text-slate-500 pt-8 p-2">
            Make a{' '}
            {link.map(
              (link) =>
                link.name === 'new journal entry' && (
                  <a
                    key={link.name}
                    onClick={(e) => {
                      e.preventDefault(); // Prevent default link behavior
                      handleOnClick();
                    }}
                    className="text-blue-500 hover:text-blue-600 cursor-pointer "
                    style={{
                      pointerEvents: isButtonDisabled ? 'none' : 'auto',
                    }}
                  >
                    {link.name}
                  </a>
                )
            )}{' '}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between h-full p-10 pt-6">
      <div>
        <h2 className="text-3xl pl-5 sm:pl-7 mt-16">JOURNALS</h2>
        <div className="grid 2xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-y-5 mt-4 md:gap-4 md:p-8">
          {entries.map((entry) => (
            <Link href={`/journal/${entry.id}`} key={entry.id}>
              <div>
                <EntryCard key={entry.id} entry={entry} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-8 items-end">
        <Pagination
          total={totalPages}
          initialPage={1}
          page={currentPage}
          onChange={handlePageChange}
          isCompact
          showControls
        />
      </div>
    </div>
  );
};

export default JournalPage;
