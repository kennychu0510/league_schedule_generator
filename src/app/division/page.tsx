'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import TeamSelect from './components/TeamSelect';
import Spinner from '@/app/my-components/Spinner';
import ErrorPage from '../my-components/ErrorPage';
import { getTeams } from '@/services/get-teams';

function Content() {
  const [isLoading, setIsLoading] = useState(true);
  const [teams, setTeams] = useState<string[] | null>(null);
  const searchParams = useSearchParams();

  const url = searchParams.get('url');
  const division = searchParams.get('division');
  const category = searchParams.get('category');
  const fullUrl = `https://www.hksquash.org.hk${url}`.replace('detail', 'results_schedules');

  useEffect(() => {
    if (!url || !fullUrl) return;
    async function getTeamsFromServer() {
      setIsLoading(true);
      const teamData = await getTeams(fullUrl);
      setTeams(teamData.data ?? []);
      setIsLoading(false);
    }
    try {
      getTeamsFromServer();
    } finally {
      setIsLoading(false);
    }
  }, [url, fullUrl]);

  return (
    <div>
      <section>
        <h1 className='text-center text-2xl my-2 font-bold py-2'>Select your team</h1>
        <h2 className='text-muted-foreground text-center w-full'>
          {category} League - Division {division}
        </h2>
      </section>
      {isLoading || teams === null ? (
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

export default function Page() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}
