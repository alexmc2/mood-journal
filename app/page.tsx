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
            src="https://res.cloudinary.com/drbz4rq7y/video/upload/v1705288349/5080661_Ocean_Sea_Nature_1280x720_rwm2vf.mp4"
            type="video/mp4"
          />
        </video>
        <div className="relative z-10 text-white sm:px-2 md:px-3 px-4 text-center sm:max-w-screen-md max-w-screen-sm font-bold flex flex-col items-center">
          <div className="w-full max-w-[900px] px-10 mx-auto sm:text-center md:text-left">
            <h1 className="text-5xl md:text-6xl mb-8 text-white">
              MOOD JOURNAL
            </h1>
            <p className="text-4xl text-white/50 mb-8">Track your mood</p>
            <div>
              <Link href={href}>
                <button className="bg-blue-500 px-4 py-2 btn-info btn btn-lg md:btn-lg lg:btn-lg border-none text-2xl ">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
