'use client';

import ChatComponent from '../../../../components/chat/ChatComponent';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ChatIdPage() {
  const searchParams = useSearchParams();

  // Assuming `searchParams` is correctly typed as URLSearchParams
  const initialChatId = searchParams.get ? searchParams.get('chatId') : null;

  return <ChatComponent initialChatId={initialChatId} />;
}