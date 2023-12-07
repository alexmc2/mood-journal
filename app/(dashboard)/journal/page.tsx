import React from 'react';
import { prisma } from '@/utils/db';
import { getUserByClerkId } from '@/utils/auth';
import NewEntryCard from '@/components/NewEntryCard';
import EntryCard from '@/components/EntryCard';

const getEntries = async () => {
  const user = await getUserByClerkId();

  const entries = await prisma.jounalEntry.findMany({
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
    <div className="p-8">
      <h2 className="text-2xl font-bold">Journal</h2>
      <div className="grid grid-cols-3 gap-4 p-8">
        <NewEntryCard />

        {entries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
};

export default JournalPage;
