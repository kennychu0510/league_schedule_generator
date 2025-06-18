import { Suspense } from 'react';
import LeagueList from './components/LeagueList';
import LoadingPage from './my-components/LoadingPage';

export default async function Home() {
  return (
    <div>
      <section>
        <h1 className='mx-2 text-2xl py-2 font-bold'>Squash League Schedule Generator</h1>
      </section>
      <main className='pb-2'>
        <p className='p-2 text-muted-foreground'>Generate an ICS file and import to your phone!</p>
        <Suspense fallback={<LoadingPage message='Retrieving League Schedule' />}>
          <LeagueList />
        </Suspense>
      </main>
    </div>
  );
}
