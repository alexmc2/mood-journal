import React from 'react';
import { prisma } from '@/utils/db';
import { getUserByClerkId } from '@/utils/auth';
import NewEntryCard from '@/components/NewEntryCard';
import EntryCard from '@/components/EntryCard';
import Link from 'next/link';
import { analyse } from '@/utils/ai';
import Question from '@/components/Question';

const getEntries = async () => {
  const user = await getUserByClerkId();

  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      analysis: true,
    },
  });

  return entries;
};
const JournalPage = async () => {
  const entries = await getEntries();

  return (
    <div className="p-10 pt-6 ">
      <h2 className="text-3xl pl-5 sm:pl-7 ">JOURNALS</h2>
      {/* <div className="pl-5 sm:pl-7 py-2 ">
        <Question />
      </div> */}
      <div className="grid 2xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-y-5 mt-4  md:gap-4 md:p-8 ">
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
