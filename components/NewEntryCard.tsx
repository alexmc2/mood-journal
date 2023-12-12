'use client';

import { newEntry } from '@/utils/api';
import { revalidatePath } from 'next/cache';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
} from '@nextui-org/react';

const NewEntryCard = () => {
  const router = useRouter();

  const handleOnClick = async () => {
    const data = await newEntry();
    router.push(`/journal/${data.id}`);
  };
  return (
    <Card className="cursor-pointer overflow-hidden bg-slate-50 text-slate-800 shadow-md px-4 py-5 sm:p-6 ">
      <div className="" onClick={handleOnClick}>
        <CardHeader className="text-3xl font-semibold text-slate-600">New Entry</CardHeader>
    
      </div>
    </Card>
  );
};

export default NewEntryCard;
