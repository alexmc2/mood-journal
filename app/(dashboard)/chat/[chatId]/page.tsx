'use client';

import ChatComponent from '../../../../components/chat/ChatComponent';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ChatIdPage() {
  const searchParams = useSearchParams();
  const initialChatId = searchParams.get('chatId');

  return <ChatComponent initialChatId={initialChatId} />;
}
