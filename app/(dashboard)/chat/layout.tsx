// import '../../css/globals.css'
// import type { Metadata } from 'next';
// import { Space_Grotesk } from 'next/font/google';
// import { Toaster } from '@/components/chat/ui/toaster';
// import ThemeProvider from '@/components/chat/theme-provider';

// const font = Space_Grotesk({ subsets: ['latin'], variable: '--font' });

// export const metadata: Metadata = {
//   title: 'ChatGPT',
//   description: 'ChatGPT clone with simple design',
// };

// export default function Layout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en" id="mode" suppressHydrationWarning>
//       <body
//         className={`${font.className} dark:bg-neutral-950 bg-white dark:text-neutral-200`}
//       >
//         <ThemeProvider>
//           <>
//             <main>
//               <Toaster />
//               {children}
//             </main>
//           </>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }

// app/dashboard/chat/layout.tsx

export default function ChatLayout({ children }) {
  return (
    <div className=" bg-slate-200 dark:bg-blue-800 text-slate-600 dark:text-slate-300 ">
      {children}
    </div>
  );
}
