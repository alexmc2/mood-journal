import React from 'react';
import { prisma } from '@/utils/db';
import { getUserByClerkId } from '@/utils/auth';
import NewEntryCard from '@/components/NewEntryCard';
import EntryCard from '@/components/EntryCard';
import Link from 'next/link';
import { analyse } from '@/utils/ai';

const getEntries = async () => {
  const user = await getUserByClerkId();

  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return entries;
};
const JournalPage = async () => {
  const entries = await getEntries();

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold pl-5 sm:pl-7">Journal</h2>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 p-8">
        <NewEntryCard />

        {entries.map((entry) => (
          <Link href={`/journal/${entry.id}`} key={entry.id}>
            <EntryCard key={entry.id} entry={entry} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default JournalPage;
