'use client';
import { Card, CardHeader, CardBody, CardFooter, Divider } from '@nextui-org/react';

const EntryCard = ({ entry }) => {
  const date = new Date(entry.createdAt).toDateString();
  return (
    <Card className=" cursor-pointer overflow-hidden bg-slate-50 text-slate-800 px-4 py-3 sm:px-6 ">
      <div className="py-3">{date}</div>
      <Divider />
      <div className="py-3">summary</div>
      <Divider />
      <div className="py-3 justify-start">mood</div>
    </Card>
  );
};

export default EntryCard;
