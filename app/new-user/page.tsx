import { prisma } from '@/utils/db';
import { auth, currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export const runtime = 'edge';

export const dynamic = 'force-dynamic';

const createNewUser = async () => {
  const user = await currentUser();
  console.log(user);

  if (user) {
    const match = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    if (!match) {
      const newUser = await prisma.user.create({
        data: {
          clerkId: user.id,
          email: user.emailAddresses[0].emailAddress,
        },
      });
      return newUser;
    }
  }

  redirect('/journal');
};

const NewUser = async () => {
  await createNewUser();
  return <div>...loading</div>;
};

export default NewUser;
