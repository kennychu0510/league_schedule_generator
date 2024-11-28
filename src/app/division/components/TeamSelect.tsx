'use client';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import React from 'react';

export default function TeamSelect({ teams, url }: { teams: string[]; url: string }) {
  return (
    <div>
      {teams.map((team) => (
        <Link key={team} href={`/result/?${new URLSearchParams({ url, team })}`} aria-label={team}>
          <Badge variant='outline' className='mr-2 mb-2 h-10 rounded-full min-w-10 flex justify-center' inputMode='none'>
            {team}
          </Badge>
        </Link>
      ))}
    </div>
  );
}
