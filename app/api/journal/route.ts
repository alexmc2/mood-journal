import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { analyse } from '@/utils/ai';
import { generateEmbedding } from '@/utils/chatbot/embeddings';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { client } from '@/utils/chatbot/supabaseClient';


export const POST = async () => {
  const user = await getUserByClerkId();
  const defaultContent = 'Write about your day...';
  const entry = await prisma.journalEntry.create({
    data: {
      userId: user.id,
      content: 'Write about your day...',
    },
  });
  if (
    entry.content &&
    entry.content.length > 40 &&
    entry.content !== defaultContent
  ) {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000, // Adjust chunk size as needed
      chunkOverlap: 200, // Adjust overlap as needed
    });
    const splitDocs = await splitter.splitDocuments([
      new Document({ pageContent: entry.content }),
    ]);

     for (const doc of splitDocs) {
      try { // Process each chunk
  
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
  }

  const analysis = await analyse(entry.content);
  await prisma.analysis.create({
    data: {
      userId: user.id,
      entryId: entry.id,
      ...analysis,
    },
  });

  revalidatePath('/journal');

  return NextResponse.json({ data: entry });
};
