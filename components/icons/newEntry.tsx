import React from 'react';

export default function newEntryIcon({ className, color = 'currentColor' }) {
  return (
    <svg
      className="shrink-0 h-10 w-10"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M512 0C229.230364 0 0 229.230364 0 512s229.230364 512 512 512 512-229.230364 512-512C1023.6928 229.357796 794.642204 0.3072 512 0z m0 912.574009C290.769351 912.574009 111.425991 733.230649 111.425991 512S290.769351 111.425991 512 111.425991 912.574009 290.769351 912.574009 512C912.266809 733.104356 733.104356 912.267947 512 912.574009z"
        fill="#000000"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
      />
    </svg>
  );
}
