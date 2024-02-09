import { auth } from '@clerk/nextjs';
import Link from 'next/link';


export default async function Home() {
  const { userId } = await auth();
 let href = userId ? '/journal' : '/new-user';

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
            src="https://res.cloudinary.com/drbz4rq7y/video/upload/v1706190379/_import_61b32af0cc8408.81077246_q1tak6.mp4"
            type="video/mp4"
          />
        </video>
        <div className="relative z-10 text-white sm:px-2 md:px-3 px-4 text-center sm:max-w-screen-md max-w-screen-sm font-bold flex flex-col items-center">
          <div className="w-full max-w-[900px] px-10 mx-auto sm:text-center md:text-left">
            <h1 className="text-5xl md:text-6xl mb-8 text-white">
              MOOD JOURNAL
            </h1>
            <p className="text-4xl text-white/90 mb-8">Track your mood</p>
            <div>
              <Link href={href}>
                <button className="bg-blue-500 px-4 py-2 btn-info text-white btn btn-lg md:btn-lg lg:btn-lg border-none text-lg ">
                  Get Started
                </button>
              </Link>

              {/* <Link
                href={href}
                className="flex content-center gap-2 px-4 py-2 font-semibold text-white transition-colors duration-200 rounded-lg bg-primary-600 hover:bg-primary-700"
              >
                Get Started
                <div className="m-auto"></div>
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
