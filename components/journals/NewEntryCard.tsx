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
    <div className="cursor-pointer overflow-hidden shadow-md px-4 sm:p-6 bg-base-100 dark:bg-blue-900 card hover:scale-105 transition-transform duration-300">
      <div className="card-body" onClick={handleOnClick}>
        <div className="text-3xl font-semibold">New Entry</div>
      </div>
    </div>
  );
};

export default NewEntryCard;
