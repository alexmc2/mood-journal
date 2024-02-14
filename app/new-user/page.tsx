import { prisma } from '@/utils/db';
import { auth, currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

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

// app/new-user/page.tsx
// 'use client';

// import { useEffect } from 'react';
// import { currentUser } from '@clerk/nextjs';
// import { useRouter } from 'next/navigation';
// import { prisma } from '@/utils/db';

// export default function NewUser() {
//   const navigate = useRouter();

//   useEffect(() => {
//     const createAndRedirectUser = async () => {
//       const user = await currentUser();
//       if (user) {
//         const match = await prisma.user.findUnique({
//           where: { clerkId: user.id },
//         });

//         if (!match) {
//           await prisma.user.create({
//             data: {
//               clerkId: user.id,
//               email: user.emailAddresses[0].emailAddress,
//             },
//           });
//         }
//       }

//       navigate.push('/journal');
//     };

//     createAndRedirectUser();
//   }, [navigate]);

//   return <div>...loading</div>;
// }
