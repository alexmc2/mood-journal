// api/journal/[id]/route.ts
import { analyse } from '@/utils/ai';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { update } from '@/utils/actions';
import { generateEmbedding } from '@/utils/chatbot/embeddings';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { client } from '@/utils/chatbot/supabaseClient';

export const DELETE = async (
  request: Request | NextRequest,
  { params }: { params: any }
) => {
  const user = await getUserByClerkId();

  // Delete the journal entry
  await prisma.journalEntry.delete({
    where: {
      userId_id: {
        id: params.id,
        userId: user.id,
      },
    },
  });

  try {
    const { data, error } = await client.from('documents').delete().match({
      'metadata->>journalEntryId': params.id,
      'metadata->>userId': user.id,
      'metadata->>type': 'journal',
    });
  } catch (error) {
    console.error('Error deleting corresponding document:', error);
  }

  update(['/journal']);

  return NextResponse.json({ data: { id: params.id } });
};

export const GET = async (request: Request | NextRequest, { params }: any) => {
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

export const PATCH = async (
  request: Request | NextRequest,
  { params }: any
) => {
  const { content } = await request.json();
  const defaultContent = 'Write about your day...';
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
  if (
    newContentHash !== currentEntry?.contentHash &&
    newContentHash &&
    newContentHash !== defaultContent
  ) {
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

    if (content && content.length > 10 && content !== defaultContent) {
      try {
        const embedding = await generateEmbedding(updatedEntry.content);
        const metadata = {
          journalEntryId: params.id,
          userId: user.id,
          type: 'journal',
          updatedAt: new Date(), 
        };


        const { error } = await client.from('documents').insert({
          content: updatedEntry.content,
          embedding: embedding,
          metadata,
        });

        if (error) throw error;
      } catch (error) {
        console.error(
          'Error inserting updated journal entry embedding:',
          error
        );
      }
    }

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
