const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteMessages() {
  try {
    const deleteResult = await prisma.message.deleteMany({
      where: {
        chatId: undefined,
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
