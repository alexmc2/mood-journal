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
import Head from 'next/head';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: false,
});

export const metadata = {
  title: 'Mood Journal',
  description: 'AI-Powered Mood Tracking Journal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:url" content="http://mood-chat.com" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/drbz4rq7y/image/upload/v1708799841/Screenshot_from_2024-02-24_18-33-22_vuuw8j.png"
        />

        <meta name="twitter:card" content="AI-Powered Mood Tracking Journal" />
        <meta name="twitter:title" content={metadata.title} />
        <meta
          name="twitter:description"
          content="AI-Powered Mood Tracking Journal"
        />
        <meta
          name="twitter:image"
          content="https://res.cloudinary.com/drbz4rq7y/image/upload/v1708733721/Screenshot_from_2024-02-24_00-15-03_pcvkci.png"
        />
      </Head>
      <html lang="en">
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
