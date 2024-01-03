import { analyse } from '@/utils/ai';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { NextResponse } from 'next/server';
import { createHash } from 'crypto'; // Node.js native module
import { update } from '@/utils/actions';

export const DELETE = async (request: Request, { params }) => {
  const user = await getUserByClerkId();

  await prisma.journalEntry.delete({
    where: {
      userId_id: {
        id: params.id,
        userId: user.id,
      },
    },
  });

  update(['/journal']);

  return NextResponse.json({ data: { id: params.id } });
};

export const GET = async (request, { params }) => {
  const user = await getUserByClerkId();
  const entry = await prisma.journalEntry.findUnique({
    where: {
      userId_id: {
        userId: user.id,
        id: params.id,
      },
    },
    include: {
      analysis: true,
    },
  });
  console.log(entry);
  return NextResponse.json({ data: entry });
};

export const PATCH = async (request, { params }) => {
  const { content } = await request.json();
  const user = await getUserByClerkId();

  // Retrieve the current entry
  const currentEntry = await prisma.journalEntry.findUnique({
    where: {
      userId_id: {
        userId: user.id,
        id: params.id,
      },
    },
    include: {
      analysis: true,
    },
  });

  // Generate a hash of the new content
  const newContentHash = createHash('sha256').update(content).digest('hex');

  // Compare the new content hash with the existing one
  if (newContentHash !== currentEntry?.contentHash) {
    // Content has changed significantly, update entry and re-analyse
    const updatedEntry = await prisma.journalEntry.update({
      where: {
        userId_id: {
          userId: user.id,
          id: params.id,
        },
      },
      data: {
        content,
        contentHash: newContentHash, // Update the content hash
      },
    });

    const analysis = await analyse(updatedEntry.content);

    const updatedAnalysis = await prisma.analysis.upsert({
      where: {
        entryId: updatedEntry.id,
      },
      create: {
        userId: user.id,
        entryId: updatedEntry.id,
        ...analysis,
      },
      update: analysis,
    });

    return NextResponse.json({
      data: { ...updatedEntry, analysis: updatedAnalysis },
    });
  } else {
    // Content hasn't changed significantly, skip re-analysis
    return NextResponse.json({ data: currentEntry });
  }
};
