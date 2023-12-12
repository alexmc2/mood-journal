import { auth } from '@clerk/nextjs';
import Link from 'next/link';

export default async function Home() {
  const { userId } = await auth();
  let href = userId ? '/journal' : '/new-user';

  return (
   
      <div className="w-screen h-screen bg-black flex justify-center items-center text-white ">
        <div className="w-full max-w-[600px] mx-auto ">
          <h1 className="text-6xl mb-8">Mood Journal</h1>
          <p className="text-3xl text-white/60 mb-8">Track your mood</p>
          <div>
            <Link href={href}>
              <button className="bg-blue-500 px-4 py-2 btn-info btn md:btn-md lg:btn-lg border-none">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      
    </div>
  );
}
