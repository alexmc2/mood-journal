import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({

  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// import { PrismaClient } from '@prisma/client';
// import { withAccelerate } from '@prisma/extension-accelerate';

// const prismaClientSingleton = () => {
//   return new PrismaClient().$extends(withAccelerate());
// };

// declare global {
//   var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
// }

// export const prisma = globalThis.prisma ?? prismaClientSingleton();

// if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
