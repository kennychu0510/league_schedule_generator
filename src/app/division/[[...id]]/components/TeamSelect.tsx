'use server';

import { Badge } from '@/components/ui/badge';
import { getTeams } from '@/services/get-teams';
import Link from 'next/link';
import React from 'react';

export default async function TeamSelect({ url }: { url: string }) {
  const teamData = await getTeams(url);
  return (
    <div>
      {teamData.status === 'failed' && <div className='text-red-500 font-bold'>Something went wrong, failed to retrieve schedule</div>}
      {teamData.data?.map((team) => (
        <Link key={team} href={`/result/?${new URLSearchParams({ url, team })}`}>
          <Badge variant='outline' className='mr-2 mb-2 h-10 rounded-full min-w-10 flex justify-center' inputMode='none'>
            {team}
          </Badge>
        </Link>
      ))}
    </div>
  );
}
