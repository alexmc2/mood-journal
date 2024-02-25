import { PrismaClient } from '@prisma/client';
import { fieldEncryptionExtension } from 'prisma-field-encryption';

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };

// export const prisma = globalForPrisma.prisma ?? new PrismaClient({});

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const globalClient = new PrismaClient();

export const prisma = globalClient.$extends(
  // This is a function, don't forget to call it:
  fieldEncryptionExtension({
    encryptionKey: process.env.PRISMA_FIELD_ENCRYPTION_KEY,
  })
);
