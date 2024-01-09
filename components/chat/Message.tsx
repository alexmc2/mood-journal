import { CodeMessage, parseCode } from '@/utils/utils';
import { Logo } from './assets/Icons';
import { Avatar, AvatarImage } from './ui/avatar';
import { useState, useEffect } from 'react';
import Typewriter from 'typewriter-effect';
import Code from './Code';

type MessageProps = {
  text: string;
  id: string;
  isUser: boolean;
  isNewMessage?: boolean;
};

export default function Message({
  id,
  isUser,
  text,
  isNewMessage = false,
}: MessageProps) {
  console.log('Message component props:', { id, isUser, text });

  const [avatar, setAvatar] = useState<string | undefined>(undefined);

  // Ensure text is a string before parsing
  const textString = typeof text === 'string' ? text : String(text);
  const { codesArr, withoutCodeArr } = parseCode(textString);
  let result = withoutCodeArr.map((item, index) => {
    return codesArr[index] ? [item, codesArr[index]] : [item];
  });

  useEffect(() => {
    const local = localStorage.getItem('user');
    if (local) {
      const t = JSON.parse(local);
      if (t.avatar) {
        setAvatar(t.avatar);
      }
    }
  }, []);

  return (
    <div
      className={`${!isUser ? 'py-4' : 'py-1'} h-fit ${
        !isUser
          ? 'dark:bg-blue-800 bg-neutral-100'
          : 'dark:bg-blue-800 bg-neutral-100'
      }`}
    >
      <div className="flex flex-row gap-6 w-[50%] max-[900px]:w-[88%]  mx-auto items-start ">
        {isUser ? (
          <>
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={avatar ?? 'https://ui.shadcn.com/avatars/01.png'}
              />
            </Avatar>
          </>
        ) : (
          <span className="">{Logo}</span>
        )}
        <span className="leading-8 w-[97%]">
          {isUser ? (
            <>
              {result.flat().map((item: any, index: number) => {
                return (
                  <div key={id + index} className="">
                    {typeof item == 'string' ? (
                      isNewMessage ? (
                        <TypeOnce isNewMessage={isNewMessage}>{item}</TypeOnce>
                      ) : (
                        item
                      )
                    ) : (
                      <div className="mb-1 w-[94%] z-50 ">
                        <Code language={item.language}>{item.code}</Code>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            <>
              {result.flat().map((item, index) => {
                return (
                  <div key={`${id}-${index}`}>
                    {' '}
                    {/* Ensure the key is unique for each item */}
                    {typeof item == 'string' ? (
                      <TypeOnce isNewMessage={isNewMessage}>{item}</TypeOnce>
                    ) : (
                      <div className="mb-1 w-[94%] z-50">
                        <Code language={item.language}>{item.code}</Code>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </span>
      </div>
    </div>
  );
}

export function Skeleton() {
  return (
    <div className={`py-7 h-fit `}>
      <div className="flex flex-row gap-6 w-[50%] max-[900px]:w-[88%]  mx-auto items-start ">
        <span className="">{Logo}</span>
        <span className="leading-8">
          <Typewriter
            options={{
              delay: 95,
              loop: true,
              autoStart: true,
            }}
            onInit={(typewriter) => {
              typewriter.typeString('...').start();
            }}
          />
        </span>
      </div>
    </div>
  );
}

function TypeOnce({
  children,
  isNewMessage,
}: {
  children: string;
  isNewMessage: boolean;
}) {
  const [on, setOn] = useState(isNewMessage);

  useEffect(() => {
    if (!isNewMessage) {
      setOn(false); // Disable Typewriter effect if not a new message
    }
  }, [isNewMessage]);

  return on ? (
    <Typewriter
      options={{
        delay: 5,
      }}
      onInit={(typewriter) => {
        typewriter
          .typeString(children)
          .start()
          .callFunction(() => {
            setOn(false);
          });
      }}
    />
  ) : (
    <p className="">{children}</p>
  );
}
