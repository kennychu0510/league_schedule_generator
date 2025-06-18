'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function BottomNavigation({ returnToHome = false }) {
  const router = useRouter();

  return (
    <div className='flex justify-center my-4'>
      <Button className='rounded-xl' onClick={() => (returnToHome ? router.push('/') : router.back())}>
        {returnToHome ? 'Home' : 'Back'}
      </Button>
    </div>
  );
}
