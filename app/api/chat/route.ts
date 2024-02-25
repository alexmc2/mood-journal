//api/chat/route.ts

import { chatSummary } from '@/utils/ai';
import { qa } from '@/utils/chatbot/chatbotChain';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';
import { OpenAIEmbeddings } from '@langchain/openai';
import { generateEmbedding } from '@/utils/chatbot/embeddings';
import { client } from '@/utils/chatbot/supabaseClient';
import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

// API Route for handling chat messages
export const POST = async (
  request: Request | NextRequest,
  { params }: { params: any }
) => {
  // console.log('POST route hit with request:', request);

  const { newMessage } = await request.json();
  const user = await getUserByClerkId();

  let currentChatId = params?.chatId;

  // If chatId is not provided, create a new chat
  if (!currentChatId) {
    const newChat = await prisma.chat.create({
      data: {
        userId: user?.id,
      },
    });
    currentChatId = newChat.id;
    return NextResponse.json({ chatId: currentChatId });
  }

  const savedMessage = await prisma.message.create({
    data: {
      chatId: currentChatId,
      text: newMessage,
      userId: user?.id,
      isUser: true,
      createdAt: new Date(),
    },
  });

  console.log('New message from the route file:', newMessage);

  try {
    // Split the incoming message
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splitDocs = await splitter.splitDocuments([
      new Document({ pageContent: newMessage }),
    ]);

    // Process each chunk
    for (const doc of splitDocs) {
      const embedding = await generateEmbedding(doc.pageContent);
      const metadata = {
        messageId: savedMessage.id,
        userId: user?.id,
        chatId: currentChatId,
        type: 'message',
        createdAt: new Date(),
      };

      const { error } = await client.from('documents').insert([
        {
          content: doc.pageContent,
          metadata,
          embedding,
          userId: user.id,
          chatId: currentChatId,
          createdAt: new Date(),
        },
      ]);
      if (error) throw error;
    }
  } catch (error) {
    console.error('Error in POST handler:', error);
  }

  const answer = await qa(currentChatId, newMessage, user.id);

  const savedBotMessage = await prisma.message.create({
    data: {
      chatId: currentChatId,
      text: answer,
      userId: null, // No userId for chatbot messages
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
        chatId: currentChatId,
        type: 'bot-response',
        createdAt: new Date(),
      };

      const { error } = await client.from('documents').insert([
        {
          content: doc.pageContent,
          metadata,
          embedding,
          userId: user.id,
          chatId: currentChatId,
          createdAt: new Date(),
        },
      ]);
      if (error) throw error;
    }
  } catch (error) {
    console.error('Error processing bot response:', error);
  }

  console.log(answer);
  return NextResponse.json({ data: answer, chatId: currentChatId });
};

// GET request handler for fetching all chats with the summary of the first user message
export const GET = async () => {
  const user = await getUserByClerkId();

  const chats = await prisma.chat.findMany({
    where: {
      userId: user.id,
      NOT: {
        summary: null,
      },
    },
    include: {
      messages: {
        take: 1,
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  const formattedChats = await Promise.all(
    chats.map(async (chat) => {
      let summary;
      if (!chat.summary && chat.messages[0]?.text) {
        const summaryData = await chatSummary(chat.messages[0].text);
        summary = summaryData.summary;

        if (summary.length > 40) {
          summary = summary.slice(0, 50) + '...';
        }

        await prisma.chat.update({
          where: { id: chat.id },
          data: { summary },
        });
      } else {
        summary = chat.summary || 'No summary available';
      }

      return {
        id: chat.id,
        firstMessageSummary: summary,
        firstMessageTime: chat.messages[0]?.createdAt || chat.createdAt,
      };
    })
  );

  return NextResponse.json({ chats: formattedChats });
};
