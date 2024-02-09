'use client';

import ChatComponent from '../../../../components/chat/ChatComponent';
import { useRouter, useSearchParams } from 'next/navigation';

interface ChatIdPageParams {
  chatId?: string;
}

export default function ChatIdPage({ params }: { params: ChatIdPageParams }) {
  const searchParams = useSearchParams();
  const initialChatId = searchParams.get('chatId') || params?.chatId;

  return <ChatComponent initialChatId={initialChatId} />;
}
