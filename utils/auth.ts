import { auth } from '@clerk/nextjs';
import { prisma } from './db';
import { client } from './chatbot/supabaseClient';

export const getUserByClerkId = async () => {
  const { userId } = await auth();

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      clerkId: userId ?? undefined,
    },
  });

  return user;
};
