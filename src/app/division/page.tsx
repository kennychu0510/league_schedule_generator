'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import TeamSelect from './components/TeamSelect';
import Spinner from '@/app/my-components/Spinner';
import ErrorPage from '../my-components/ErrorPage';
import { getTeams } from '@/services/get-teams';

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [teams, setTeams] = useState<string[]>([]);
  const searchParams = useSearchParams();

  const url = searchParams.get('url');
  const division = searchParams.get('division');
  const category = searchParams.get('category');

  useEffect(() => {
    if (!url) return;
    async function getTeamsFromServer(url: string) {
      const teamData = await getTeams(url);
      setTeams(teamData.data ?? []);
    }
    try {
      getTeamsFromServer(url);
      setIsLoading(true);
    } catch {
      setIsLoading(false);
    }
  }, [url]);

  const fullUrl = `https://www.hksquash.org.hk/${url}`.replace('detail', 'results_schedules');
  return (
    <div>
      <section>
        <h1 className='text-center text-2xl my-2 font-bold py-2'>Select your team</h1>
        <h2 className='text-muted-foreground'>
          {category} - {division}
        </h2>
      </section>
      {isLoading ? (
        <Spinner message='Retrieving Teams' />
      ) : teams.length > 0 ? (
        <main className='mx-2 py-2'>
          <TeamSelect url={fullUrl ?? ''} teams={teams} />
        </main>
      ) : (
        <ErrorPage message='No teams found' />
      )}
    </div>
  );
}
