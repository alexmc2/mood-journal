// PaginationControls.tsx
'use client';

import { FC } from 'react';

interface PaginationControlsProps {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void; 
}

const PaginationControls: FC<PaginationControlsProps> = ({
  hasNextPage,
  hasPrevPage,
  currentPage,
  totalPages,
  onPageChange, 
}) => {
  return (
    <div className="flex gap-2 ">
      <button
        className="bg-blue-500 text-white p-1"
        disabled={!hasPrevPage}
        onClick={() => onPageChange(currentPage - 1)} 
      >
        prev page
      </button>

      <div>
        {currentPage} / {totalPages}
      </div>

      <button
        className="bg-blue-500 text-white p-1 "
        disabled={!hasNextPage}
        onClick={() => onPageChange(currentPage + 1)} 
      >
        next page
      </button>
    </div>
  );
};

export default PaginationControls;
