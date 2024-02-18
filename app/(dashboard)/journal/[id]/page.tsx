import React from 'react';
import Editor from '@/components/Editor';

import { getUserByClerkId } from '@/utils/chatbot/auth';
import { prisma } from '@/utils/db';

const getEntry = async (id: string) => {
  const user = await getUserByClerkId();

  const entry = await prisma.journalEntry.findUnique({
    where: {
      userId_id: {
        userId: user.id,
        id,
      },
    },
    include: {
      analysis: true,
    },
  });

  return entry;
};

const EntryPage = async ({ params }: { params: any }) => {
  const entry = await getEntry(params.id);

  if (!entry) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Editor entry={entry} />
    </div>
  );
};

export default EntryPage;
