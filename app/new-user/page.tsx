import { prisma } from '@/utils/db';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const createNewUser = async () => {
  console.log('Starting createNewUser function.');
  const user = await currentUser();
  console.log('currentUser():', user);

  if (user) {
    console.log('User found, checking for existing user in database.');
    const match = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });
    console.log('Database search result for user:', match);

    if (!match) {
      console.log(
        'No matching user found, creating new user with email:',
        user.emailAddresses[0].emailAddress
      );
      const newUser = await prisma.user.create({
        data: {
          clerkId: user.id,
          email: user.emailAddresses[0].emailAddress,
        },
      });
      console.log('New user created:', newUser);
      return newUser;
    } else {
      console.log(
        'Matching user already exists in the database, not creating a new user.'
      );
    }
  } else {
    console.log('No user found, redirecting to /journal.');
  }

  redirect('/journal');

};

const NewUser = async () => {
  console.log('NewUser page function started.');
  await createNewUser();
  console.log('NewUser page function finished. Now rendering...');
  return <div>...loading</div>;
};

export default NewUser;
