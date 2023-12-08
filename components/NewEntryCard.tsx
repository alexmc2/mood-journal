'use client';

import { newEntry } from '@/utils/api';
import { revalidatePath } from 'next/cache';
import { useRouter } from 'next/navigation';

const NewEntryCard = () => {
  const router = useRouter();


  const handleOnClick = async () => {
    const data = await newEntry();
    router.push(`/journal/${data.id}`);
  };
  return (
    <div className="card cursor-pointer overflow-hidden bg-slate-50 text-slate-800 shadow-md px-4 py-5 sm:p-6 ">
      <div className="card-body" onClick={handleOnClick}>
        <h2 className="card-title">New Entry</h2>
        <p className=" prose">Write about your day</p>
        <div className="card-actions justify-end"></div>
      </div>
    </div>
  );
};

export default NewEntryCard;
