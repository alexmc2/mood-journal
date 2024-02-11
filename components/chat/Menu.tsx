'use client';

import { Menu as MenuIcon } from 'lucide-react';
import PopoverButton from './Popover';
import { useDisclosure } from '@nextui-org/react';

import { Button } from '@/components/chat/ui/button';
import axios, { AxiosError } from 'axios';
import { useToast } from './ui/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SetStateAction, useEffect, useState } from 'react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/chat/ui/sheet';
import { fetchAllChats } from '@/utils/api';
import { Tooltip } from '@nextui-org/react';
import DeleteModal from '../DeleteChatModal';
import { deleteChat } from '@/utils/api';
import { useParams } from 'next/navigation';

const EDIT_INITIAL = {
  username: '',
  avatar: '',
  apiKey: '',
};

type Chat = {
  id: string;
  firstMessageSummary: string;
  firstMessageTime: string;
  // Add other fields as necessary
};

export default function Menu({ clear }: { clear: () => void }) {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { toast } = useToast();
  const { push } = useRouter();
  const [mode, setMode] = useState('dark');
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(EDIT_INITIAL);

  const params = useParams();
  const currentChatId = params.chatId;

  

 

  useEffect(() => {
    let localMode = localStorage.getItem('mode');
    if (!localMode) {
      return;
    }
    if (localMode == 'dark') {
      document.getElementById('mode')?.classList.add('dark');
      setMode('dark');
    } else {
      document.getElementById('mode')?.classList.remove('dark');
      setMode('light');
    }
  }, []);

  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const loadChats = async () => {
      try {
        const fetchedChats: Chat[] = await fetchAllChats();
        console.log('fetchedChats:', fetchedChats);
        setChats(fetchedChats);
      } catch (error) {
        console.error('Error fetching chats:', error);
        // Handle the error appropriately
      }
    };

    loadChats();
  }, []);

  useEffect(() => {
    if (open) {
      setEdit(EDIT_INITIAL);
    }
  }, [open]);

  // const handleChatDelete = (deletedChatId) => {
  //   const updatedChats = chats.filter((chat) => chat.id !== deletedChatId);
  //   setChats(updatedChats);
  // };

  // Handle chat deletion
  const handleChatDelete = async () => {
    if (selectedChatId) {
      try {
        await deleteChat(selectedChatId);
        // Update state to reflect deletion...
        onClose(); // Close the modal
      } catch (error) {
        console.error('Error deleting chat:', error);
        // Handle error (e.g., show a toast notification)
      }
    }
  };

  const openDeleteModal = (chatId: SetStateAction<null>) => {
    setSelectedChatId(chatId);
    onOpen();
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            className="absolute top-20 left-5 max-[500px]:left-2 "
            variant="default"
          >
            <MenuIcon className="w-5 h-5" />{' '}
            <span className="ml-2 hidden sm:flex">Chats</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="dark:border-slate-800 z-[9999] overflow-y-auto"
        >
          <SheetHeader>
            <div className="pt-8 flex flex-col gap-2">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className="flex flex-row items-center justify-between hover:bg-gray-800 dark:hover:text-inherit hover:text-white py-3 px-3 rounded-lg cursor-pointer"
                  onClick={() => {
                    push(`/chat/${chat.id}`);
                    clear();
                  }}
                >
                  <span>{chat.firstMessageSummary}</span>
                  <PopoverButton
                    chatId={chat.id}
                    onOpenDeleteModal={openDeleteModal}
                  />
                </div>
              ))}
            </div>
          </SheetHeader>
        </SheetContent>

        <DeleteModal
          isOpen={isOpen}
          onClose={onClose}
          chatId={selectedChatId || ''}
          onDelete={handleChatDelete}
          currentChatId={Array.isArray(currentChatId) ? currentChatId[0] : currentChatId}
        />
      </Sheet>
    </>
  );
}
