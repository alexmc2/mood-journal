import React from 'react';
import ChatThemeProvider from '@/components/chat/theme-provider';
import { Toaster } from '@/components/chat/ui/toaster';

export default function ChatLayout({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="flex flex-col h-full">
      <ChatThemeProvider>
        <Toaster />
        {children}
      </ChatThemeProvider>
    </div>
  );
}
