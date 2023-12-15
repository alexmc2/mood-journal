import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { analyse } from '@/utils/ai';

export const POST = async () => {
  const user = await getUserByClerkId();
  const entry = await prisma.journalEntry.create({
    data: {
      userId: user.id,

      content: '',
    },
  });

  // Check if content is not empty
  // if (entry.content && entry.content.trim() !== '') {
  const analysis = await analyse(entry.content);
  await prisma.analysis.create({
    data: {
      userId: user.id,
      entryId: entry.id,
      ...analysis,
    },
  });
  // }

  revalidatePath('/journal');

  return NextResponse.json({ data: entry });
};
