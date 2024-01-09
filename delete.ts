const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteMessages() {
  try {
    const deleteResult = await prisma.message.deleteMany({
      where: {
        chatId: '84ce680d-9ad6-4455-8596-360646663e7a',
      },
    });
    console.log(`${deleteResult.count} messages deleted.`);
  } catch (error) {
    console.error('Error deleting messages:', error);
  }
}

deleteMessages()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


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
