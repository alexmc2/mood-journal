import React from 'react';
import { Button } from '@nextui-org/react';

export default function Buttons({ children }) {
  const customStyle = {
    backgroundColor: '#66aaf9',
  };

  return (
    <div>
      <Button style={customStyle} className="w-[150px] text-center">
        {children}
      </Button>
    </div>
  );
}
