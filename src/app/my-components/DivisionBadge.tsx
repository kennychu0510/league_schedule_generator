'use client';

import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function DivisionBadge({ url, division, category }: { url: string; division: string; category: string }) {
  const router = useRouter();
  return (
    <Badge
      inputMode='none'
      onClick={() => {
        router.push(`/division/?${new URLSearchParams({ url, division, category })}`);
      }}
      variant='outline'
      key={url}
      className='mr-2 mb-2 h-10 rounded-full min-w-10 flex justify-center cursor-pointer'
    >
      {division}
    </Badge>
  );
}
