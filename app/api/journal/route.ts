// api/journal/[id]/route.ts
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { analyse } from '@/utils/ai';
import { generateEmbedding } from '@/utils/chatbot/embeddings';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { client } from '@/utils/chatbot/supabaseClient';

export const POST = async (request: Request) => {
  const data = await request.json();
  const user = await getUserByClerkId();
  const defaultContent = 'Write about your day...';

  const entry = await prisma.journalEntry.create({
    data: {
      content: data.content || defaultContent,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });
  if (
    entry.content &&
    entry.content.length > 10 &&
    entry.content !== defaultContent
  ) {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splitDocs = await splitter.splitDocuments([
      new Document({ pageContent: entry.content }),
    ]);

    for (const doc of splitDocs) {
      try {
        // Process each chunk

        const embedding = await generateEmbedding(doc.pageContent);
        const metadata = {
          journalEntryId: entry.id,
          userId: user.id,
          type: 'journal',
          createdAt: new Date(),
        };

        // Insert into Supabase
        const { error } = await client.from('documents').insert([
          {
            content: doc.pageContent,
            embedding,
            userId: user.id,
            journalEntryId: entry.id,
            metadata,
          },
        ]);
        if (error) throw error;
      } catch (error) {
        console.error('Error inserting journal entry embedding:', error);
      }
    }

    const analysis = await analyse(entry.content);
    await prisma.analysis.create({
      data: {
        userId: user.id,
        entryId: entry.id,
        ...analysis,
      },
    });
  }

  revalidatePath('/journal');

  return NextResponse.json({ data: entry });
};
