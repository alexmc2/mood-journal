'use client';
import { updateEntry } from '@/utils/api';
import { useState } from 'react';
import { useAutosave } from 'react-autosave';

import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
} from '@nextui-org/react';
import TextareaAutosize from 'react-textarea-autosize';

const Editor = ({ entry }) => {
  const [value, setValue] = useState(entry.content);

  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  // const handleDelete = async () => {
  //   await deleteEntry(entry.id);
  //   router.push('/journal');
  // };

  useAutosave({
    data: value,
    onSave: async (_value) => {
      setIsSaving(true);

      const updated = await updateEntry(entry.id, _value);

      setIsSaving(false);
    },
  });

  return (
    <div className="flex w-full h-full flex-wrap md:flex-nowrap mb-6 md:mb-0  p-8 ">
      <Card className="flex w-full h-full text-md    " >
        <TextareaAutosize
          cacheMeasurements
          className=" h-full w-full p-8 text-slate-700 border-none shadow-none outline-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </Card>
    </div>
  );
};

export default Editor;
