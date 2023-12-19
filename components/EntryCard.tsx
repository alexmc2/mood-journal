'use client';
import { Card, CardHeader, CardBody, CardFooter, Divider } from '@nextui-org/react';

const EntryCard = ({ entry }) => {
  const date = new Date(entry.createdAt).toDateString();
  return (
    <div className=" cursor-pointer overflow-hidden px-4 py-3 sm:px-6 card shadow-xl bg-base-100 dark:bg-blue-900">
      <div className="py-3">{date}</div>
      <Divider />
      <div className="py-3">summary</div>
      <Divider />
      <div className="py-3 justify-start">mood</div>
    </div>
  );
};

export default EntryCard;
