import { auth, clerkClient } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Motivation, ChatLinks, UserDetails } from './details';
import Link from 'next/link';

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/');
  }

  const user = await clerkClient.users.getUser(userId);

  const isStranger = !user?.firstName;

  return (
    <div className="px-8 py-12 sm:py-16 md:px-20">
      {user && (
        <>
          <h1 className="text-3xl font-semibold text-slate-600 dark:text-slate-300">
            👋 Hi, {user.firstName || `Stranger`}
            {isStranger && (
              // Simply mentioning to go to the Clerk profile for updates
              <span className="ml-2 text-sm text-slate-500">
                (Click on profile image to update your details)
              </span>
            )}
          </h1>
          <div className="grid gap-4 mt-8 lg:grid-cols-3">
            <UserDetails />

            <ChatLinks />
            <Motivation />
          </div>
        </>
      )}
    </div>
  );
}
