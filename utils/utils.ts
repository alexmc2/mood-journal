import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfigFile from '@/tailwind.config.js';

export const tailwindConfig = resolveConfig(tailwindConfigFile) as any;

export const getBreakpointValue = (value: string): number => {
  const screenValue = tailwindConfig.theme.screens[value];
  return +screenValue.slice(0, screenValue.indexOf('px'));
};

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
