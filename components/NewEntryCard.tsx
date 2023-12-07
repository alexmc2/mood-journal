'use client';

const NewEntryCard = () => {
  return (
    <div className="card w-96 cursor-pointer overflow-hidden bg-slate-50 shadow-md px-4 py-5 sm:p-6 ">
      <div className="card-body">
        <h2 className="card-title prose">New Entry</h2>
        <p className=" prose">How are you feeling today?</p>
        <div className="card-actions justify-end"></div>
      </div>
    </div>
  );
};

export default NewEntryCard;
