import { useState } from 'react';
import React from 'react';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

interface DeleteEntryButtonProps {
  Id: string; // or number, depending on your data
  onOpenDeleteModal: (id: string) => void; // or (id: number) => void
}

export default function DeleteEntryButton({
  Id,
  onOpenDeleteModal,
}: DeleteEntryButtonProps) {
  const [visible, setVisible] = useState(false);

  const lightThemeStrokeColor = '#000000'; //black for light theme
  const darkThemeStrokeColor = '#FFFFFF'; //white for dark theme

  const router = useRouter();

  const { theme } = useTheme(); // Get the current theme

  // Determine the stroke color based on the theme
  const svgStrokeColor =
    theme === 'dark' ? darkThemeStrokeColor : lightThemeStrokeColor;

  return (
    <>
      <div >
        <button
          className="btn btn-md dark:bg-red-400 dark:hover:bg-red-500 bg-red-400 hover:bg-red-500 border-none dark:text-slate-600 text-slate-300  "
          onClick={() => onOpenDeleteModal(Id)}
        >
          <svg
            className="shrink-0 h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke={svgStrokeColor}
            strokeWidth="1.5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
