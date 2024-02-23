import { auth } from '@clerk/nextjs';
import Link from 'next/link';

export default async function Home() {
  const { userId } = await auth();
  let href = userId ? '/home' : '/new-user';

  return (
    <div className="h-full overflow-x-hidden overflow-y-hidden flex flex-col justify-between items-center no-scrollbar">
      <div className="relative w-full h-screen flex flex-col justify-center items-center">
        <video
          className="absolute top-0 left-0 max-w-full min-w-full min-h-full z-negative object-cover"
          autoPlay
          muted
          loop
        >
          <source
            src="https://res.cloudinary.com/drbz4rq7y/video/upload/v1708622742/1871533_yellow_background_silhouette_person_3840x2160_qu2vho.mp4"
            type="video/mp4"
          />
        </video>
        <div className="relative z-10 text-white sm:px-2 md:px-3 px-4 text-center sm:max-w-screen-md max-w-screen-sm font-bold flex flex-col items-center">
          <div className="w-full max-w-[900px]  px-2 card bg-slate-900/95 ">
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
