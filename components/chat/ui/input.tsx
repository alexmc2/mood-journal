import * as React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { cn } from '@/utils/utils';


type InputProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  style?: React.CSSProperties & { height?: number };
  isBotTyping?: boolean;
  isBotProcessing?: boolean;
};

const Input = React.forwardRef<HTMLTextAreaElement, InputProps>(
  ({ className, value, onKeyDown, ...props }, ref) => {
    const handleHeightChange = (height: any, { rowHeight }: any) => {
      console.log(
        `Textarea height changed to ${height}, row height is ${rowHeight}`
      );
    };

    return (
      <TextareaAutosize
        maxRows={10}
        minRows={1}
        onHeightChange={handleHeightChange}
        onKeyDown={onKeyDown}
        cacheMeasurements={true}
        value={value}
        style={{ lineHeight: '2.0' }}
        className={cn(
          'flex w-full resize-none rounded-md border border-neutral-200 bg-white px-3 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-800 ',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
