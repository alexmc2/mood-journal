// 'use client';
// import { useState } from 'react';
// import { auth, useSignUp } from '@clerk/nextjs';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';

// export default function Home() {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();
//   const { signUp, isLoaded } = useSignUp();

//   if (!isLoaded) {
//     return null; // Or some loading indicator
//   }

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setIsLoading(true);
//     setMessage('');

//     try {
//       // Create the user's email address
//       await signUp.create({ emailAddress: email });

//       // Start the Email link flow
//       const { startEmailLinkFlow } = signUp.createEmailLinkFlow();
//       await startEmailLinkFlow({
//         redirectUrl: window.location.origin + '/api/auth/verification', // Assuming you have a verification page set up
//       });

//       setMessage('Email link sent! Check your email to log in.');
//     } catch (error) {
//       console.error('Error sending Email link:', error);
//       setMessage('An error occurred. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen overflow-x-hidden overflow-y-hidden flex flex-col justify-between items-center">
//       <div className="relative w-full h-screen flex flex-col justify-center items-center">
//         <video
//           className="absolute top-0 left-0 max-w-full min-w-full min-h-full z-negative object-cover"
//           autoPlay
//           muted
//           loop
//         >
//           <source
//             src="https://res.cloudinary.com/drbz4rq7y/video/upload/v1708217932/1118289_macro_lens_defocused_3840x2160_w3sdzw.mp4"
//             type="video/mp4"
//           />
//         </video>
//         <div className="relative z-10 text-white sm:px-2 md:px-3 px-4 text-center sm:max-w-screen-md max-w-screen-sm font-bold flex flex-col items-center">
//           <div className="w-full max-w-[900px] px-10 mx-auto sm:text-center md:text-left">
//             <h1 className="text-5xl md:text-6xl mb-8 text-white">
//               MOOD JOURNAL
//             </h1>
//             <p className="text-4xl text-white/90 mb-8">Track your mood</p>
//             <div className="rounded-md">
//               <form
//                 onSubmit={handleSubmit}
//                 className="flex flex-col md:flex-row items-center gap-4 text-black"
//               >
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Enter your email"
//                   required
//                   className="rounded-md flex-1"
//                 />

//                 <button
//                   className="bg-blue-500 px-4 py-2 btn-info text-white btn btn-md md:btn-md lg:btn-md border-none text-lg flex-1 "
//                   type="submit"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? 'Sending...' : 'Send Email Link'}
//                 </button>
//               </form>
//             </div>
//             {message && <p>{message}</p>}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { auth } from '@clerk/nextjs';
import Link from 'next/link';

export default async function Home() {
  const { userId } = await auth();
  let href = userId ? '/home' : '/new-user';

  return (
    <div className="min-h-screen overflow-x-hidden overflow-y-hidden flex flex-col justify-between items-center">
      <div className="relative w-full h-screen flex flex-col justify-center items-center">
        <video
          className="absolute top-0 left-0 max-w-full min-w-full min-h-full z-negative object-cover"
          autoPlay
          muted
          loop
        >
          <source
            src="https://res.cloudinary.com/drbz4rq7y/video/upload/v1708217932/1118289_macro_lens_defocused_3840x2160_w3sdzw.mp4"
            type="video/mp4"
          />
        </video>
        <div className="relative z-10 text-white sm:px-2 md:px-3 px-4 text-center sm:max-w-screen-md max-w-screen-sm font-bold flex flex-col items-center">
          <div className="w-full max-w-[900px]  px-2 card bg-black/50 ">
            <div className="card-body">
              <h1 className="text-3xl md:text-5xl pb-4  text-white">
                MOOD JOURNAL
              </h1>
              {/* <p className="md:text-4xl text-3xl text-white/90 mb-8">Track your mood</p> */}
              <div>
                <Link href={href}>
                  <button className="bg-blue-500 px-4  btn-info text-white btn btn-wide border-none text-xl ">
                    Enter
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
