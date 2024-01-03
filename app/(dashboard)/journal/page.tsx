'use client';

import React from 'react';
import { useState, useEffect } from 'react';

import { Pagination } from '@nextui-org/react';

import EntryCard from '@/components/EntryCard';
import Link from 'next/link';

const getEntries = async (page = 1) => {
  try {
    // Replace 'your-api-route' with the actual route, e.g., '/api/pagination'
    const response = await fetch(`/api/pagination/${page}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data; // This should include both entries and pagination info
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

  useEffect(() => {
    const fetchData = async () => {
      const data = await getEntries(currentPage);
      setEntries(data.data);
      setTotalPages(data.pageCount);
    };
    fetchData();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page); // Update current page
  };

  return (
    <div className="p-10 pt-6 ">
      <h2 className="text-3xl pl-5 sm:pl-7 ">JOURNALS</h2>

      <div className="grid 2xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-y-5 mt-4  md:gap-4 md:p-8 ">
        {entries.map((entry) => (
          <Link href={`/journal/${entry.id}`} key={entry.id}>
            <EntryCard key={entry.id} entry={entry} />
          </Link>
        ))}
      </div>

      <div className="flex justify-center pt-8 items-center">
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
