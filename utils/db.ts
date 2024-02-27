import { PrismaClient } from '@prisma/client';
import { fieldEncryptionExtension } from 'prisma-field-encryption';

const globalClient = new PrismaClient();

// Conditionally apply the fieldEncryptionExtension based on the environment
const prisma =
  process.env.NODE_ENV === 'production'
    ? globalClient.$extends(
        fieldEncryptionExtension({
          encryptionKey: process.env.PRISMA_FIELD_ENCRYPTION_KEY,
        })
      )
    : globalClient;

export { prisma };
