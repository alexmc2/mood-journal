// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// async function deleteMessages() {
//   try {
//     const deleteResult = await prisma.message.deleteMany({
//       where: {
//         chatId: '0d462336-a324-4c6c-9036-47d25c2eecab',
//       },
//     });
//     console.log(`${deleteResult.count} messages deleted.`);
//   } catch (error) {
//     console.error('Error deleting messages:', error);
//   }
// }

// deleteMessages()
//   .catch((e) => {
//     throw e;
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });


// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// async function deleteMessages() {
//   try {
//     const deleteResult = await prisma.message.deleteMany();
//     console.log(`${deleteResult.count} messages deleted.`);
//   } catch (error) {
//     console.error('Error deleting messages:', error);
//   }
// }

// deleteMessages()
//   .catch((e) => {
//     throw e;
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteEmptyChats() {
  try {
    // Step 1: Find all chats with zero messages
    const emptyChats = await prisma.chat.findMany({
      where: {
        messages: {
          none: {}, 
        },
      },
      select: {
        id: true, 
      },
    });

    // Extract chat ids
    const emptyChatIds = emptyChats.map((chat) => chat.id);

    // Step 2: Delete chats that were identified as empty
    const deleteResult = await prisma.chat.deleteMany({
      where: {
        id: {
          in: emptyChatIds, 
        },
      },
    });

    console.log(`${deleteResult.count} empty chats deleted.`);
  } catch (error) {
    console.error('Error deleting empty chats:', error);
  }
}

deleteEmptyChats()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// async function deleteMessagesInSingleMessageChats() {
//   try {
//     // Fetch all chats along with their message count
//     const chats = await prisma.chat.findMany({
//       include: {
//         _count: {
//           select: { messages: true },
//         },
//         messages: {
//           select: { id: true },
//           take: 1,
//         },
//       },
//     });

//     // Filter chats that have exactly one message
//     const messagesToDelete = chats
//       .filter((chat) => chat._count.messages === 1)
//       .flatMap((chat) => chat.messages)
//       .map((message) => message.id);

//     // Delete messages that were identified in chats with one message
//     if (messagesToDelete.length > 0) {
//       const deleteResult = await prisma.message.deleteMany({
//         where: {
//           id: {
//             in: messagesToDelete,
//           },
//         },
//       });

//       console.log(
//         `${deleteResult.count} messages in single-message chats deleted.`
//       );
//     } else {
//       console.log('No single-message chats found.');
//     }
//   } catch (error) {
//     console.error('Error deleting messages in single-message chats:', error);
//   }
// }

// deleteMessagesInSingleMessageChats()
//   .catch((e) => {
//     throw e;
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
