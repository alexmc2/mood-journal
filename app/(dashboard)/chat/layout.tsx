import ChatThemeProvider from '@/components/chat/theme-provider';
import { Toaster } from '@/components/chat/ui/toaster';
import { ReactNode } from 'react';

interface ChatLayoutProps {
  children: ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="flex flex-col h-full    ">
      <ChatThemeProvider>
        <Toaster />
        {children}
      </ChatThemeProvider>
    </div>
  );
}
