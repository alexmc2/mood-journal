//api/chat/route.ts

import { qa } from '@/utils/ai';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { NextResponse } from 'next/server';

// API Route for handling chat messages
export const POST = async (request, { params } = {}) => {
  const { newMessage } = await request.json();
  const user = await getUserByClerkId();

  let currentChatId = params?.chatId; // Use optional chaining to safely access chatId

  // If chatId is not provided, create a new chat
  if (!currentChatId) {
    const newChat = await prisma.chat.create({
      data: {
        userId: user?.id,
      },
    });
    currentChatId = newChat.id;
  }

  // Save the new message to the database
  await prisma.message.create({
    data: {
      chatId: currentChatId,
      text: newMessage,
      userId: user?.id,
      isUser: true,
    },
  });

  const answer = await qa(currentChatId, newMessage, user.id);

  await prisma.message.create({
    data: {
      chatId: currentChatId,
      text: answer,
      userId: null, // No userId for chatbot messages
      isUser: false,
    },
  });

  console.log(answer);
  return NextResponse.json({ data: answer, chatId: currentChatId });
};

// GET request handler for fetching all chats with the summary of the first user message
export const GET = async () => {
  const user = await getUserByClerkId();

  // Fetch all chats associated with the user
  const chats = await prisma.chat.findMany({
    where: {
      userId: user.id,
    },
    include: {
      messages: {
        take: 1, // Only fetch the first user message for each chat
        orderBy: {
          createdAt: 'asc',
        },
        where: {
          isUser: true, // Filter to only include messages sent by the user
        },
      },
    },
  });

  // Map through chats to format the data for the sidebar
  const formattedChats = chats.map((chat) => ({
    id: chat.id,
    firstMessageSummary: chat.messages[0]?.text || 'No messages yet',
    firstMessageTime: chat.messages[0]?.createdAt || chat.createdAt,
  }));

  return NextResponse.json({ chats: formattedChats });
};
