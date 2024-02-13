import { auth } from '@clerk/nextjs';
import { prisma } from './db';

export const runtime = 'edge';

export const dynamic = 'force-dynamic';

export const getUserByClerkId = async () => {
  const { userId } = await auth();

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      clerkId: userId ?? undefined,
    },
  });

  return user;
};
