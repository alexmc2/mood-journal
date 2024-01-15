'use client';

import {
  Cloud,
  Github,
  LogOut,
  User,
  Menu as MenuIcon,
  Sun,
  Moon,
  XCircle,
} from 'lucide-react';
import PopoverButton from './Popover';

import { Button } from '@/components/chat/ui/button';
import axios, { AxiosError } from 'axios';
import { useToast } from './ui/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/chat/ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { httpRequest } from '@/utils/interceptor';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/chat/ui/sheet';
import { fetchAllChats } from '@/utils/api';
import { Tooltip } from '@nextui-org/react';

const EDIT_INITIAL = {
  username: '',
  avatar: '',
  apiKey: '',
};

type Chat = {
  id: string;
  firstMessageSummary: string;
  firstMessageTime: string; // assuming this is a string representation of a date
  // Add other fields as necessary
};

export default function Menu({ clear }: { clear: () => void }) {
  const { toast } = useToast();
  const { push } = useRouter();
  const [mode, setMode] = useState('dark');
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(EDIT_INITIAL);

  // Remove the declaration of 'chats' since it is already declared above
  // const chats: Chat[] = // your data here
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

  function handleUpdate() {
    httpRequest
      .put('/api/profile', {
        ...edit,
      })
      .then(({ data }) => {
        localStorage.setItem('user', JSON.stringify(data));
        window.location.reload();
      })
      .catch((err) => {
        toast({
          title: 'Error',
          description: err.response?.data.message,
        });
      });
  }

  useEffect(() => {
    if (open) {
      setEdit(EDIT_INITIAL);
    }
  }, [open]);

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            className="absolute top-24 left-5 max-[500px]:left-2 "
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
                  <PopoverButton  />
                </div>
              ))}

              {/* You can keep or remove other menu items as per your requirement */}
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
        <DialogContent className="sm:max-w-[495px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when youre done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                value={edit.username}
                onChange={(e) =>
                  setEdit((prev) => ({ ...prev, username: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="avatar" className="text-right">
                Avatar URL
              </Label>
              <Input
                id="avatar"
                value={edit.avatar}
                onChange={(e) =>
                  setEdit((prev) => ({ ...prev, avatar: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="api" className="text-right">
                API Key
              </Label>
              <Input
                id="api"
                value={edit.apiKey}
                onChange={(e) =>
                  setEdit((prev) => ({ ...prev, apiKey: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleUpdate}
              disabled={!edit.apiKey && !edit.avatar && !edit.username}
              type="submit"
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
