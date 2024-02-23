import { auth, clerkClient } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Motivation, Welcome, UserDetails } from './details';

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/');
  }

  const user = await clerkClient.users.getUser(userId);

  const isStranger = !user?.firstName;

  //   return (
  //     <div className="px-8 py-12 sm:py-16 md:px-20">
  //       {user && (
  //         <>
  //           <h1 className="text-3xl font-semibold text-slate-600 dark:text-slate-300">
  //             👋 Hi, {user.firstName || `Stranger`}
  //             {isStranger && (
  //               <span className="ml-2 text-sm text-slate-500">
  //                 (Click on profile image to update your details)
  //               </span>
  //             )}
  //           </h1>
  //           <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-4">
  //             <div>
  //               <UserDetails />
  //             </div>
  //             <div className="">
  //               <Motivation />
  //             </div>

  //             <div className="xl:col-span-2">
  //               <Welcome />
  //             </div>
  //           </div>
  //         </>
  //       )}
  //     </div>
  //   );
  // }

  return (
    <div className="relative min-h-screen">
      <video
        className="absolute top-0 left-0 w-full h-full  object-cover"
        autoPlay
        muted
        loop
      >
        <source
          src="https://res.cloudinary.com/drbz4rq7y/video/upload/v1708622995/1871531_silhouette_blue_background_street_dance_3840x2160_1_dvko4d.mp4"
          type="video/mp4"
        />
      </video>
      {/* <div className="absolute inset-0 bg-white opacity-10"></div>{' '} */}
      {/* This div wraps content and ensures it's above the video */}
      <div className="z-10 relative px-8 py-12 sm:py-16 md:px-20">
        {user && (
          <>
            <h1 className="text-3xl font-semibold text-slate-800 dark:text-slate-800">
              👋 Hi, {user.firstName || `Stranger`}
              {isStranger && (
                <span className="ml-2 text-lg text-slate-700 ">
                  (Click on profile image to update your details)
                </span>
              )}
            </h1>

            <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-5">
              <div>
                <UserDetails />
              </div>
              <div>
                <Motivation />
              </div>
              <div className="xl:col-span-2">
                <Welcome />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
