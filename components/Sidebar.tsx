'use client';

import {
  useEffect,
  useRef,
  useState,
  useContext,
  SetStateAction,
  use,
} from 'react';
import { useAppProvider } from '@/app/providers/app-provider';
import { useSelectedLayoutSegments } from 'next/navigation';
import { Transition } from '@headlessui/react';
import { getBreakpoint } from '../utils/utils';
import { newEntry } from '@/utils/api';
import Link from 'next/link';
import HomeIcon from './icons/home';
import HistoryIcon from './icons/history';
import JournalIcon from './icons/journal';
import { ChatIcon } from './icons/chat';
import newEntryIcon from './icons/newEntry';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { useTheme } from 'next-themes';

export default function Sidebar() {
  const sidebar = useRef<HTMLDivElement>(null);
  const { sidebarOpen, setSidebarOpen } = useAppProvider();
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(true);
  const segments = useSelectedLayoutSegments();
  const [breakpoint, setBreakpoint] = useState<string | undefined>(
    getBreakpoint()
  );
  const expandOnly =
    !sidebarExpanded && (breakpoint === 'lg' || breakpoint === 'xl');
  const router = useRouter();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [navigateTo, setNavigateTo] = useState(null);

  const { isSignedIn } = useUser();

  const { theme } = useTheme();
  // const iconColor = theme === 'light' ? 'white' : 'black';

  const links = [
    { name: 'Home', href: '/home', icon: HomeIcon },
    { name: 'Journal Entries', href: '/journal', icon: JournalIcon },
    { name: 'New Entry', href: `/journal/{data.id}`, icon: newEntryIcon },
    { name: 'History', href: '/history', icon: HistoryIcon },
    { name: 'New Chat', href: '/chat', icon: ChatIcon },
  ];

  // useEffect hook to log the user's sign-in status whenever it changes
  useEffect(() => {
    console.log(`User is ${isSignedIn ? 'signed in' : 'not signed in'}.`);
  }, [isSignedIn]);

  // close on click outside sidebar (mobile only and medium screens)
  useEffect(() => {
    const clickHandler = ({ target }: { target: EventTarget | null }): void => {
      if (!sidebar.current) return;
      if (!sidebarOpen || sidebar.current.contains(target as Node)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: { keyCode: number }): void => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const handleBreakpoint = () => {
    setBreakpoint(getBreakpoint());
  };

  useEffect(() => {
    window.addEventListener('resize', handleBreakpoint);
    return () => {
      window.removeEventListener('resize', handleBreakpoint);
    };
  }, [breakpoint]);

  // New journal entry link
  const handleOnClick = async () => {
    if (!isSignedIn) {
      router.push(`/please-login?action=new_entry`);
    } else {
      if (!isButtonDisabled) {
        setIsButtonDisabled(true); // Disable the button
        const { data } = await newEntry();
        router.push(`/journal/${data.id}`);
        // Enable the button again after 4 seconds. Protects against spamming the button if it doesn't respond immediately, creating multiple new entries
        setTimeout(() => setIsButtonDisabled(false), 4000);
      }
    }
  };

  const generateNewChatId = async () => {
    if (!isButtonDisabled) {
      setIsButtonDisabled(true); // Disable the button
      try {
        // Sending a POST request with an empty message or placeholder
        const response = await axios.post('/api/chat', {
          newMessage: '',
        });

        return response.data.chatId;
      } catch (error) {
        console.error('Error in generateNewChatId:', error);
        throw error;
      }
    }
  };

  const handleChatClick = async () => {
    if (!isSignedIn) {
      router.push(`/please-login?action=new_chat`);
    } else {
      if (!isButtonDisabled) {
        setIsButtonDisabled(true); // Disable the button
        let newChatId = await generateNewChatId();
        router.replace(`/chat/${newChatId}`);
        setTimeout(() => setIsButtonDisabled(false), 4000);
      }
    }
  };

  // Handler for "Journal Entries" button
  const handleJournalClick = async () => {
    if (!isSignedIn) {
      router.push('/please-login?action=journals');
    } else {
      router.push('/journal');
    }
  };

  // Handler for "History" button
  const handleHistoryClick = async () => {
    if (!isSignedIn) {
      router.push('/please-login?action=history');
    } else {
      router.push('/history');
    }
  };

  return (
    <div className={`min-w-fit  ${sidebarExpanded ? 'sidebar-expanded' : ''} `}>
      {/* Sidebar backdrop (mobile only) */}
      <Transition
        className="fixed inset-0 bg-slate-900 bg-opacity-40 z-40 lg:hidden lg:z-auto"
        show={sidebarOpen}
        enter="transition-opacity ease-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-out duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        aria-hidden="true"
      />

      {/* Sidebar */}
      <Transition
        show={sidebarOpen}
        unmount={false}
        as="div"
        id="sidebar"
        ref={sidebar}
        className="flex lg:!flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 dark:bg-slate-900 bg-neutral-100 p-4 transition-all duration-200 ease-in-out"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        {/* Sidebar header */}

        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Close button */}
          <button
            className="lg:hidden text-slate-500 hover:text-slate-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
        </div>

        <div className="space-y-8 " onClick={() => setSidebarOpen(false)}>
          <div>
            <ul className="mt-1">
              {links.map((link) => (
                <li key={link.name} className="my-2 ">
                  {link.name === 'New Chat' ? (
                    // 'CHAT' button
                    <div
                      className={`flex items-center text-lg btn btn-md w-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-200 dark:hover:bg-blue-300 border-none text-slate-600 dark:text-slate-800 ${
                        sidebarExpanded
                          ? 'justify-start pl-4'
                          : 'justify-center'
                      }`}
                      onClick={handleChatClick}
                    >
                      <link.icon
                        className={`${sidebarExpanded ? 'mr-2' : ''}`}
                      />
                      {sidebarExpanded && <span>{link.name}</span>}
                    </div>
                  ) : link.name === 'New Entry' ? (
                    // 'NEW ENTRY' button
                    <button
                      className={`flex items-center btn text-lg btn-md w-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-200 dark:hover:bg-blue-300 border-none text-slate-600 dark:text-slate-800 ${
                        sidebarExpanded
                          ? 'justify-start pl-4'
                          : 'justify-center'
                      }`}
                      onClick={handleOnClick}
                    >
                      <link.icon
                        className={`${sidebarExpanded ? 'mr-2' : ''}`}
                      />
                      {sidebarExpanded && <span>{link.name}</span>}
                    </button>
                  ) : link.name === 'Journal Entries' ? (
                    // 'JOURNAL ENTRIES' button
                    <div
                      className={`flex items-center text-lg btn btn-md w-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-200 dark:hover:bg-blue-300 border-none text-slate-600 dark:text-slate-800 ${
                        sidebarExpanded
                          ? 'justify-start pl-4'
                          : 'justify-center'
                      }`}
                      onClick={handleJournalClick}
                    >
                      <link.icon
                        className={`${sidebarExpanded ? 'mr-2' : ''}`}
                      />
                      {sidebarExpanded && <span>{link.name}</span>}
                    </div>
                  ) : link.name === 'History' ? (
                    // 'HISTORY' button
                    <div
                      className={`flex items-center text-lg btn btn-md w-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-200 dark:hover:bg-blue-300 border-none text-slate-600 dark:text-slate-800 ${
                        sidebarExpanded
                          ? 'justify-start pl-4'
                          : 'justify-center'
                      }`}
                      onClick={handleHistoryClick}
                    >
                      <link.icon
                        className={`${sidebarExpanded ? 'mr-2' : ''}`}
                      />
                      {sidebarExpanded && <span>{link.name}</span>}
                    </div>
                  ) : (
                    // Other links
                    <Link href={link.href}>
                      <div
                        className={`flex items-center text-lg btn btn-md w-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-200 dark:hover:bg-blue-300 border-none text-slate-600 dark:text-slate-800 ${
                          sidebarExpanded
                            ? 'justify-start pl-4'
                            : 'justify-center'
                        }`}
                      >
                        <link.icon
                          className={`${sidebarExpanded ? 'mr-2' : ''}`}
                        />
                        {sidebarExpanded && <span>{link.name}</span>}
                      </div>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-start mt-auto">
          <div className="px-3 py-2">
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg
                className="w-6 h-6 fill-current sidebar-expanded:rotate-180"
                viewBox="0 0 24 24"
              >
                <path
                  className="text-slate-400"
                  d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z"
                />
                <path className="text-slate-600" d="M3 23H1V1h2z" />
              </svg>
            </button>
          </div>
        </div>
      </Transition>
    </div>
  );
}
