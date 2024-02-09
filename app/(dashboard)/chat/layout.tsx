import ChatThemeProvider from '@/components/chat/theme-provider';
import { Toaster } from '@/components/chat/ui/toaster';

export default function ChatLayout({ children }) {
  return (
    <div className="flex flex-col h-full    ">
      <ChatThemeProvider>
        <Toaster />
        {children}
      </ChatThemeProvider>
    </div>
  );
}
