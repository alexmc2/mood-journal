import { qa } from '@/utils/ai';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { NextResponse } from 'next/server';

export const POST = async (request: { body: any; json: () => PromiseLike<{ question: any; }> | { question: any; }; }) => {
   console.log(request.body);
  const { question } = await request.json();
  const user = await getUserByClerkId();
  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  });

  const answer = await qa(question, entries);
  console.log(answer);
  return NextResponse.json({ data: answer });
};
