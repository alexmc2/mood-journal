// api/chat/[chatId]/route.ts

import { qa } from '@/utils/chatbot/chatbotChain';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';
import { generateEmbedding } from '@/utils/chatbot/embeddings';
import { createClient } from '@supabase/supabase-js';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { client } from '@/utils/chatbot/supabaseClient';

export const maxDuration = 300;

export const GET = async (request: Request | NextRequest, { params }: any) => {
  console.log('Params:', params);
  console.log(request.url);

  const chatId = params.chatId; // Access chatId from params

  // Fetch the chat by its ID
  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });

  if (!chat) {
    return NextResponse.json({ error: 'Chat not found' });
  }

  console.log(chat);
  return NextResponse.json({ data: chat });
};

// POST request handler for /api/chat/[chatId]
export const POST = async (request: Request | NextRequest, { params }: any) => {
  const chatId = params.chatId;
  const { newMessage } = await request.json();
  const user = await getUserByClerkId();

  // Verify the chat exists
  const chat = await prisma.chat.findUnique({ where: { id: chatId } });
  if (!chat) {
    return NextResponse.json({ error: 'Chat not found' });
  }

  const savedMessage = await prisma.message.create({
    data: {
      chatId: chatId,
      text: newMessage,
      userId: user.id,
      isUser: true,
      createdAt: new Date(),
    },
  });

  console.log('New message from the route file:', newMessage);

  try {
    // Split the incoming message
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000, // Adjust the chunk size as needed
      chunkOverlap: 200, // Adjust the overlap as needed
    });
    const splitDocs = await splitter.splitDocuments([
      new Document({ pageContent: newMessage }),
    ]);

    // Process each chunk
    for (const doc of splitDocs) {
      const embedding = await generateEmbedding(doc.pageContent);
      const metadata = {
        messageId: savedMessage.id,
        chatId: chatId,
        userId: user?.id,
        type: 'message',
        createdAt: new Date(),
      };

      // Insert the embedding into the 'documents' table. This will insert the embedding directly into Supabase.
      const { error } = await client.from('documents').insert([
        {
          content: doc.pageContent,
          metadata,
          embedding,
          userId: user.id,
          chatId: chatId,
          createdAt: new Date(),
        },
      ]);
      if (error) throw error;
    }
  } catch (error) {
    console.error('Error in POST handler:', error);
  }

  // Generate and save chatbot's response
  const answer = await qa(chatId, newMessage, user.id);

  const savedBotMessage = await prisma.message.create({
    data: {
      chatId: chatId,
      text: answer,
      userId: user.id,
      isUser: false,
      createdAt: new Date(),
    },
  });

  try {
    // Split the bot's response message
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 100,
    });
    const splitBotResponseDocs = await splitter.splitDocuments([
      new Document({ pageContent: answer }),
    ]);

    // Process each chunk of bot's response
    for (const doc of splitBotResponseDocs) {
      const embedding = await generateEmbedding(doc.pageContent);
      const metadata = {
        messageId: savedBotMessage.id,
        chatId: chatId,
        type: 'bot-response',
        createdAt: new Date(),
      };

      const { error } = await client.from('documents').insert([
        {
          content: doc.pageContent,
          metadata,
          embedding,
          userId: user.id,
          chatId: chatId,
          createdAt: new Date(),
        },
      ]);
      if (error) throw error;
    }
  } catch (error) {
    console.error('Error processing bot response:', error);
  }

  console.log(answer);
  return NextResponse.json({ data: answer, chatId: chatId });
};

// DELETE request handler for /api/chat/[chatId]

export const DELETE = async (
  request: Request | NextRequest,
  { params }: any
) => {
  console.log('Params:', params);
  console.log(request.url);
  const user = await getUserByClerkId();
  const chatId = params.chatId;

  // Verify if the chat belongs to the user
  const chat = await prisma.chat.findUnique({
    where: { id: chatId, userId: user.id },
  });

  if (!chat) {
    return NextResponse.json({ error: 'Chat not found or unauthorized' });
  }

  try {
    // Delete messages from Prisma
    await prisma.message.deleteMany({ where: { chatId: chatId } });

    // Delete corresponding messages from Supabase
    const { error: supabaseError } = await client
      .from('documents')
      .delete()
      .eq('chatId', chatId);

    if (supabaseError) throw supabaseError;

    // Delete the chat itself
    await prisma.chat.delete({ where: { id: chatId } });

    return NextResponse.json({
      message: 'Chat and messages deleted successfully',
    });
  } catch (error) {
    console.error('Error during deletion:', error);
    return NextResponse.json({ error: 'Failed to delete chat and messages' });
  }
};
