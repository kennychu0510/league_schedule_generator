'use client';
import ErrorPage from '@/app/my-components/ErrorPage';
import LoadingPage from '@/app/my-components/LoadingPage';
import { Card, CardContent } from '@/components/ui/card';
import createSchedule from '@/services/create-schedule';
import { ServerActionResponse } from '@/services/interface';
import ics, { EventAttributes } from 'ics';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { CiCalendar, CiLink, CiLocationOn } from 'react-icons/ci';
import ScheduleSummary from './components/ScheduleSummary';
import DownloadIcsButton from './DownloadIcsButton';
import EmailButton from './EmailButton';
import { LeagueYear } from '@/constants';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AddToCalendarButton from './AddToCalButton';

type CreateScheduleResponse = ServerActionResponse<{
  file: ics.EventAttributes[];
  schedule: string;
  division: string;
  team: string;
} | null>;

function Content() {
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
    } catch {
      setIsLoading(false);
    }
  }, [url, team]);

  return (
    <div>
      <section>
        <h1 className='text-center text-2xl my-2 font-bold py-2'>{LeagueYear} Schedule</h1>
      </section>
      {isLoading ? (
        <LoadingPage message='Generating Schedule' />
      ) : result != null ? (
        <main className='mx-2 pb-2'>
          <h1 className='text-xl font-bold mb-2'>{`Schedule for ${team}`}</h1>
          <div className='flex flex-col space-y-2'>
            <ScheduleSummary schedule={result.data!.file} team={team!} />
            <div className='flex justify-between'>
              <AddToCalendarButton schedule={result.data!.schedule} division={result.data!.division} team={team!} />
              <div className='flex space-x-2'>
                <Link href={url!} target='_blank'>
                  <Button className='rounded-full'>
                    <CiLink />
                  </Button>
                </Link>
                <DownloadIcsButton schedule={result.data!.schedule} division={result.data!.division} team={team!} />
                <EmailButton schedule={result.data!.schedule} division={result.data!.division} team={team!} />
              </div>
            </div>
            {result.data?.file.map((item: EventAttributes, index: number) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const [year, month, day] = item.start as any;
              const opponent = item.title?.split('vs')[1]?.trim() ?? 'BYE';
              return (
                <Card key={item.start.toString()}>
                  <CardContent className='p-2'>
                    <div className='uppercase font-bold text-center'>week {index + 1}</div>
                    <div className='uppercase font-bold'>{opponent}</div>
                    {opponent !== 'BYE' && (
                      <>
                        <div className='flex items-center space-x-1'>
                          <CiLocationOn />
                          <p className='text-secondary-foreground'>{item.location}</p>
                        </div>
                        <div className='flex items-center space-x-1'>
                          <CiCalendar />
                          <p className='text-muted-foreground'>
                            {year}/{month}/{day}
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </main>
      ) : (
        <ErrorPage message='Failed to generate schedule' />
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
