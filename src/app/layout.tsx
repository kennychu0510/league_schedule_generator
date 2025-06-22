import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'Generate Squash League Schedule',
  description: 'Generate an ICS file from the squash league schedule',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='bg-background text-foreground'>
      <body className='flex justify-center'>
        <div className=''>{children}</div>
      </body>
      <Analytics />
    </html>
  );
}
