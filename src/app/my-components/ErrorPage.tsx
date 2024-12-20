import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

export default function ErrorPage({ message }: { message: string }) {
  return (
    <div className='absolute inset-0 h-dvh w-dvw flex justify-center items-center flex-col space-y-2'>
      <p className='text-red-500 font-bold'>{message}</p>
      <Link href={'/'}>
        <Button className='rounded-full'>Return Home</Button>
      </Link>
    </div>
  );
}
