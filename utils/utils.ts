import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfigFile from '@/tailwind.config.js';

import { twMerge } from 'tailwind-merge';
import { type ClassValue, clsx } from 'clsx';

import { NextResponse } from 'next/server';
import ServerError, { JWTPayload } from './types';
import { verify } from 'jsonwebtoken';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function errorHandler(err: unknown) {
  if (err instanceof ServerError) {
    return NextResponse.json(
      {
        message: err.message,
      },
      { status: err.status }
    );
  }
  if (err instanceof Error) {
    return NextResponse.json(
      {
        message: err.message ?? 'Internal server error',
      },
      { status: err.message === 'jwt expired' ? 401 : 500 }
    );
  }
}

export function decryptToken(token: string, secret: string) {
  return <JWTPayload>verify(token, secret);
}

export type CodeMessage = {
  language: string;
  code: string;
};

function removeCode(str: string) {
  let i = 0;
  const regexToRmCode = /```[\s\S]*?```/g;

  if (typeof str !== 'string') {
    console.error('removeCode called with a non-string argument');
    return [];
  }
  return str.replace(regexToRmCode, `some-code`).split('some-code');
}

function getCodesFromString(str: string) {
  const regexToRmContent = /```(\w+)\n([\s\S]+?)```/g;
  let match;
  const codes: CodeMessage[] = [];
  while ((match = regexToRmContent.exec(str)) !== null) {
    const language = match[1];
    const code = match[2];
    codes.push({
      language,
      code,
    });
  }
  return codes;
}

export function parseCode(str: string) {
  return {
    withoutCodeArr: removeCode(str),
    codesArr: getCodesFromString(str),
  };
}

export const tailwindConfig = resolveConfig(tailwindConfigFile) as any;

export const getBreakpointValue = (value: string): number => {
  const screenValue = tailwindConfig.theme.screens[value];
  return +screenValue.slice(0, screenValue.indexOf('px'));
};

// Code for expandable sidebar
export const getBreakpoint = () => {
  let currentBreakpoint;
  let biggestBreakpointValue = 0;
  let windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
  for (const breakpoint of Object.keys(tailwindConfig.theme.screens)) {
    const breakpointValue = getBreakpointValue(breakpoint);
    if (
      breakpointValue > biggestBreakpointValue &&
      windowWidth >= breakpointValue
    ) {
      biggestBreakpointValue = breakpointValue;
      currentBreakpoint = breakpoint;
    }
  }
  return currentBreakpoint;
};
