'use client';
import createSchedule from '@/services/create-schedule';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ics from 'ics';
import Spinner from '@/app/my-components/Spinner';
import { ServerActionResponse } from '@/services/interface';

type CreateScheduleResponse = ServerActionResponse<{
  file: ics.EventAttributes[];
  schedule: string;
} | null>;

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<CreateScheduleResponse | null>(null);
  const searchParams = useSearchParams();

  const url = searchParams.get('url');
  const team = searchParams.get('team');

  useEffect(() => {
    if (!url || !team) {
      return;
    }
    async function getSchedule(url: string, team: string) {
      const response = await createSchedule(url, team);
      return response;
    }
    try {
      getSchedule(url, team).then((res) => {
        setResult(res);
        setIsLoading(false);
      });
    } catch (error) {
      setIsLoading(false);
    }
  }, [url, team]);

  return (
    <div>
      <section>
        <h1 className='text-center text-2xl my-2 font-bold py-2'>Your Schedule</h1>
      </section>
      {isLoading ? (
        <Spinner />
      ) : (
        <main>
          <div>{team}</div>
          <div>{url}</div>
          <div>{result?.message}</div>
        </main>
      )}
    </div>
  );
}
