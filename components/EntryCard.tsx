'use client';

const EntryCard = ({ entry }) => {
  const date = new Date(entry.createdAt).toDateString();
  return (
    <div className=" card cursor-pointer overflow-hidden bg-slate-50 text-slate-800 shadow-md px-4 py-2 sm:px-6 ">
      <div className="card-body divide-y divide-slate-600  py-5 ">
        <div className="card py-2">{date}</div>
        <div className="pb-2 pt-4">summary</div>

        <div className="py-3 justify-start">mood</div>
      </div>
    </div>
  );
};

export default EntryCard;
