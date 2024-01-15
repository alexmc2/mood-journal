// api/chat/[chatId]/route.ts

import { qa } from '@/utils/ai';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { NextResponse } from 'next/server';

// GET request handler

export const GET = async (request, { params }) => {
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
export const POST = async (request, { params }) => {
  const chatId = params.chatId;
  const { newMessage } = await request.json();
  const user = await getUserByClerkId();

  // Verify the chat exists
  const chat = await prisma.chat.findUnique({ where: { id: chatId } });
  if (!chat) {
    return NextResponse.json({ error: 'Chat not found' });
  }

  // Add user's message to the chat
  await prisma.message.create({
    data: {
      chatId: chatId,
      text: newMessage,
      userId: user.id,
      isUser: true,
    },
  });

  // Generate and save chatbot's response
  const answer = await qa(chatId, newMessage, user.id);
  await prisma.message.create({
    data: {
      chatId: chatId,
      text: answer,
      userId: null, // No userId for chatbot messages
      isUser: false,
    },
  });

  console.log(answer);
  return NextResponse.json({ data: answer, chatId: chatId });
};

// DELETE request handler for /api/chat/[chatId]

export const DELETE = async (request, { params }) => {
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

  // Delete messages and then the chat
  await prisma.message.deleteMany({ where: { chatId: chatId } });
  await prisma.chat.delete({ where: { id: chatId } });

  return NextResponse.json({ message: 'Chat deleted successfully' });
};


//api/chat/[chatId]/route.ts

// import { qa } from '@/utils/ai';
// import { getUserByClerkId } from '@/utils/auth';
// import { prisma } from '@/utils/db';
// import { NextResponse } from 'next/server';

// // GET request handler

// export const GET = async (request, { params }) => {
//   console.log('Params:', params);
//   console.log(request.url);

//   const chatId = params.chatId; // Access chatId from params

//   // Fetch the chat by its ID
//   const chat = await prisma.chat.findUnique({
//     where: {
//       id: chatId,
//     },
//     include: {
//       messages: {
//         orderBy: {
//           createdAt: 'asc',
//         },
//       },
//     },
//   });

//   if (!chat) {
//     return NextResponse.json({ error: 'Chat not found' });
//   }

//   console.log(chat);
//   return NextResponse.json({ data: chat });
// };

// // POST request handler for /api/chat/[chatId]
// export const POST = async (request, { params }) => {
//   const chatId = params.chatId;
//   const { newMessage } = await request.json();
//   const user = await getUserByClerkId();

//   // Verify the chat exists
//   const chat = await prisma.chat.findUnique({ where: { id: chatId } });
//   if (!chat) {
//     return NextResponse.json({ error: 'Chat not found' });
//   }

//   // Add user's message to the chat
//   await prisma.message.create({
//     data: {
//       chatId: chatId,
//       text: newMessage,
//       userId: user.id,
//       isUser: true,
//     },
//   });

//   const entries = await prisma.journalEntry.findMany({
//     where: {
//       userId: user.id,
//     },
//     select: {
//       content: true,
//       createdAt: true,
//     },
//   });

//   // Generate and save chatbot's response
//   const answer = await qa(newMessage, entries);
//   await prisma.message.create({
//     data: {
//       chatId: chatId,
//       text: answer,
//       userId: null, // No userId for chatbot messages
//       isUser: false,
//     },
//   });

//   console.log(answer);
//   return NextResponse.json({ data: answer, chatId: chatId });
// };

// // DELETE request handler for /api/chat/[chatId]

// export const DELETE = async (request, { params }) => {
//   console.log('Params:', params);
//   console.log(request.url);
//   const user = await getUserByClerkId();
//   const chatId = params.chatId;

//   // Verify if the chat belongs to the user
//   const chat = await prisma.chat.findUnique({
//     where: { id: chatId, userId: user.id },
//   });

//   if (!chat) {
//     return NextResponse.json({ error: 'Chat not found or unauthorized' });
//   }

//   // Delete messages and then the chat
//   await prisma.message.deleteMany({ where: { chatId: chatId } });
//   await prisma.chat.delete({ where: { id: chatId } });

//   return NextResponse.json({ message: 'Chat deleted successfully' });
// };
