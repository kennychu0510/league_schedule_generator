'use server';

import { Badge } from '@/components/ui/badge';
import { getTeams } from '@/services/get-teams';
import React from 'react';

export default async function TeamSelect({ url }: { url: string }) {
  const teamData = await getTeams(url);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return (
    <div>
      {teamData.status === 'failed' && <div className='text-red-500 font-bold'>Something went wrong, failed to retrieve schedule</div>}
      {teamData.teams?.map((team) => (
        <Badge key={team} variant='outline' className='mr-2 mb-2 h-10 rounded-full min-w-10 flex justify-center'>
          {team}
        </Badge>
      ))}
    </div>
  );
}
