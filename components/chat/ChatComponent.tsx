'use client';
import Menu from '@/components/chat/Menu';
import Message, { Skeleton } from '@/components/chat/Message';
import { Button } from '@nextui-org/react';
import ArrowIcon from '@/components/icons/arrow';
import { Input } from '@/components/chat/ui/input';
import { useToast } from '@/components/chat/ui/use-toast';
import { httpRequest } from '@/utils/interceptor';
import axios, { AxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { v4 as idGen } from 'uuid';
import ScrollableFeed from 'react-scrollable-feed';
import { useRouter } from 'next/navigation';


type MessageType = {
  id: string;
  text: string;
  isUser: boolean;
  isNewMessage?: boolean;
};

export default function ChatComponent({ initialChatId }) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(initialChatId);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [inputKey, setInputKey] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isBotProcessing, setIsBotProcessing] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, []);

  // Fetch existing chat and messages if any
  useEffect(() => {
    // Fetch messages only if chatId is present
    if (chatId) {
      setLoading(true);
      httpRequest
        .get(`/api/chat/${chatId}`)
        .then((res) => {
          const fetchedMessages = res.data.data.messages;
          setMessages(
            fetchedMessages.map((msg) => ({
              id: msg.id,
              text: msg.text,
              isUser: msg.userId !== null,
              isNewMessage: false,
            }))
          );
        })
        .catch((err) => {
          if (err instanceof AxiosError) {
            toast({ title: 'Error', description: err.response?.data.message });
          }
        })
        .finally(() => setLoading(false));
    }
    isInitialMount.current = false;
  }, [chatId, toast]);

  //   Function to handle sending messages
  function handleEmit() {
    if (isBotProcessing) return;
    setLoading(true);
    setIsBotProcessing(true);
    setMessage('')

    const newMessageId = idGen();
    setMessages((prev) => [
      ...prev,
      { id: newMessageId, isUser: true, text: message, isNewMessage: false },
    ]);

    const endpoint = chatId ? `/api/chat/${chatId}` : '/api/chat';
    httpRequest
      .post(endpoint, {
        newMessage: message,
      })
      .then(({ data }) => {
        console.log('Response received:', data);
        console.log('POST response data:', data);

        if (data.chatId) {
          // Redirect to the specific chat URL
          router.push(`/chat/${data.chatId}`);
        }

        setChatId(data.chatId); // Set chatId if new chat is started

        setMessages((prev) => [
          ...prev,

          { id: idGen(), isUser: false, text: data.data, isNewMessage: true },
        ]);
      })
      .catch((err) => {
        if (err instanceof AxiosError)
          toast({
            title: 'Error',
            description: err.response?.data.message,
          });
      })
      .finally(() => {
        setLoading(false);
        setMessage('');
        setIsBotProcessing(false);

        // Manually reset the height of the textarea
        if (textareaRef.current) {
          textareaRef.current.style.height = ''; // Reset the height
        }
      });
  }
  function clear() {
    setMessages([]); // Clears the messages array
    setChatId(null); // Resets the chatId to null
  }

  //   Auto-scroll to latest message
  function updateScroll() {
    var element = scrollRef.current;
    if (!element) return;
    element.scrollTop = element.scrollHeight;
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(updateScroll, [messages]);

  // Component JSX

  return (
    <div className="overflow-y-hidden  ">
      <Menu clear={clear} />

      <div className="input w-full flex flex-col justify-between h-screen bg-neutral-100 dark:bg-blue-800 text-neutral-600 dark:text-slate-300   ">
        {/* Messages display */}

        <div
          className=" messages w-full mx-auto h-full mb-4 overflow-y-auto flex flex-col gap-8 pt-10 max-[900px]:pt-20 scroll-smooth  "
          ref={scrollRef}
        >
          {messages.map((message) => (
            <Message
              key={`${message.id}-${message.isUser}`}
              id={message.id}
              isUser={message.isUser}
              text={message.text}
              isNewMessage={message.isNewMessage}
            />
          ))}
          {loading && <Skeleton />}
          <div ref={bottomRef} />
        </div>

        <div className="chat-input-container relative w-[50%] max-w-[900px] mx-auto mt-auto mb-16 pb-6">
          {/* Textarea and button wrapper */}
          <div className="textarea-button-wrapper relative">
            <Input
              onKeyDown={(e) => {
                if (e.key === 'Enter' && message && !isBotProcessing) {
                  e.preventDefault(); // Prevent form submission
                  handleEmit();
                }
              }}
              key={inputKey}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Send a message"
              className="text-lg"
            />
            <Button
              isIconOnly
              disabled={!message || isBotProcessing}
              onClick={handleEmit}
              className="send-button absolute bottom-0 right-0 mb-2 mr-2 "
              // Adjust styles as needed
            >
              <ArrowIcon className="text-neutral-600 dark:text-neutral-100" />
            </Button>
          </div>
        </div>

        {/* Disclaimer */}
        {/* <span className="mx-auto mb-6 text-xs mt-3 text-center">
          ChatGPT may produce inaccurate information about people, places, or
          facts.
        </span> */}
      </div>
    </div>
  );
}
