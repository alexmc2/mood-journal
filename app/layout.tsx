import './css/globals.css';
import './css/utility-patterns.css';
import './css/styles.css';

import { Inter } from 'next/font/google';
import Theme from './providers/theme-provider';
import AppProvider from './providers/app-provider';
import { ClerkProvider } from '@clerk/nextjs';
import { Providers } from './providers/providers';
import { Analytics } from '@vercel/analytics/react';
import { Roboto } from 'next/font/google';
import UnsavedChangesProvider from '@/app/providers/unsavedChangesProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: false,
});

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Mood Journal',
  description: 'Track your emotional well-being with the help of AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        {/* suppressHydrationWarning: https://github.com/vercel/next.js/issues/44343 */}
        <body
          className={`${inter.className} font-inter antialiased bg-neutral-100 dark:bg-blue-800 text-slate-600 dark:text-slate-300 no-scrollbar`}
        >
          <Theme>
            <AppProvider>
              <Providers>
                {children} <Analytics />
              </Providers>
            </AppProvider>
          </Theme>
        </body>
      </html>
    </ClerkProvider>
  );
}
