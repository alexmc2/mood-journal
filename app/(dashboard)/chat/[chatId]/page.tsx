'use client';

import ChatComponent from '../../../../components/chat/ChatComponent';
import { useRouter, useSearchParams } from 'next/navigation';

interface ChatIdPageProps {
  params: {
    chatId?: string;
  
  };
}

export default function ChatIdPage({ params }: ChatIdPageProps) {
  const searchParams = useSearchParams();
  const initialChatId = searchParams.get('chatId') || params?.chatId || '';

  return <ChatComponent initialChatId={initialChatId} />;
}
