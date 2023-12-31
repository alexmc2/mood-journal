// //app/(dashboard)/chat/page.tsx

// 'use client';

// import Menu from '@/components/chat/Menu';
// import Message, { Skeleton } from '@/components/chat/Message';
// // import { Button } from '@/components/chat/ui/button';
// import { Button } from '@nextui-org/react';
// import ArrowIcon from '@/components/icons/arrow';
// import { Input } from '@/components/chat/ui/input';
// import { useToast } from '@/components/chat/ui/use-toast';
// import { httpRequest } from '@/utils/interceptor';
// import axios, { AxiosError } from 'axios';
// import { useEffect, useRef, useState } from 'react';
// import { v4 as idGen } from 'uuid';
// import { useRouter, useSearchParams } from 'next/navigation';
// import ScrollableFeed from 'react-scrollable-feed';

// type Message = {
//   id: string;
//   text: string;
//   isUser: boolean;
// };

// export default function Chat() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [chatId, setChatId] = useState<string | null>(null);
//   const scrollRef = useRef<HTMLDivElement | null>(null);
//   const router = useRouter();
//   const { toast } = useToast();

//   // Fetch existing chat and messages if any
//   useEffect(() => {
//     if (chatId) {
//       setLoading(true);
//       httpRequest
//         .get(`/api/chat/${chatId}`)
//         .then((res) => {
//           console.log('API response for fetching messages:', res);
//           const fetchedMessages = Array.isArray(res.data.messages)
//             ? res.data.messages
//             : res.data;
//           console.log('Processed fetched messages:', fetchedMessages);
//           setMessages(
//             fetchedMessages.map((msg) => ({
//               id: msg.id,
//               text: msg.text,
//               isUser: msg.userId !== null,
//             }))
//           );
//         })
//         .catch((err) => {
//           if (err instanceof AxiosError)
//             toast({
//               title: 'Error',
//               description: err.response?.data.message,
//             });
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     }
//   }, [chatId, toast]);

//   // Function to handle sending messages
//   function handleEmit() {
//     setLoading(true);
//     const newMessageId = idGen();
//     setMessages((prev) => [
//       ...prev,
//       { id: newMessageId, isUser: true, text: message },
//     ]);

//     const endpoint = chatId ? `/api/chat/${chatId}` : '/api/chat';
//     httpRequest
//       .post(endpoint, {
//         newMessage: message,
//       })
//       .then(({ data }) => {
//         console.log('Response received:', data);
//         console.log('POST response data:', data);

//         if (data.chatId) {
//           // Redirect to the specific chat URL
//           router.push(`/chat/${data.chatId}`);
//         }

//         setChatId(data.chatId); // Set chatId if new chat is started
//         setMessages((prev) => [
//           ...prev,

//           { id: idGen(), isUser: false, text: data.data },
//         ]);
//       })
//       .catch((err) => {
//         if (err instanceof AxiosError)
//           toast({
//             title: 'Error',
//             description: err.response?.data.message,
//           });
//       })
//       .finally(() => {
//         setLoading(false);
//         setMessage('');
//       });
//   }

//   // Clear messages
//   function clear() {
//     setMessages([]);
//     setChatId(null);
//   }

//   // Auto-scroll to latest message
//   useEffect(() => {
//     var element = scrollRef.current;
//     if (element) {
//       element.scrollTop = element.scrollHeight;
//       scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [messages]);

//   // Component JSX
//   return (
//     <div className="overflow-y-hidden no-scrollbar">
//       <Menu clear={clear} />
//       <div className="input w-full flex flex-col justify-between h-screen bg-neutral-100 dark:bg-blue-800 text-neutral-600 dark:text-slate-300 ">
//         {/* Messages display */}
//         <ScrollableFeed>
//           <div
//             className="messages w-full mx-auto h-full mb-4 overflow-auto flex flex-col gap-10 pt-10 max-[900px]:pt-20 scroll-smooth"
//             ref={scrollRef}
//           >
//             {messages.map((message) => (
//               <Message
//                 key={`${message.id}-${message.isUser}`} // Unique key combining id and isUser
//                 id={message.id}
//                 isUser={message.isUser}
//                 text={message.text}
//               />
//             ))}
//             {loading && <Skeleton />}
//           </div>
//         </ScrollableFeed>
//         {/* Message input */}
//         <div className="w-[50%] max-[900px]:w-[90%] flex flex-row gap-3 mx-auto mt-auto my-4 py-8">
//           <Input
//             onKeyDown={(e) => {
//               if (e.keyCode === 13 && message) {
//                 handleEmit();
//               }
//             }}
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Send a message"
//             className="h-14 text-lg"
//           />
//           <Button
//             disabled={!message}
//             onClick={handleEmit}
//             className="h-14 dark:bg-black/90 dark:text-white"
//           >
//             <ArrowIcon className="text-neutral-600 dark:text-neutral-100" />
//           </Button>
//         </div>
//         {/* Disclaimer */}
//         <span className="mx-auto mb-6 text-xs mt-3 text-center">
//           ChatGPT may produce inaccurate information about people, places, or
//           facts.
//         </span>
//       </div>
//     </div>
//   );
// }



import ChatComponent from '../../../components/chat/ChatComponent';

export default function ChatPage() {
  return <ChatComponent initialChatId={null} />;
}
