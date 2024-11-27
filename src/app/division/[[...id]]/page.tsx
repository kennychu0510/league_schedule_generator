import { Suspense } from 'react';
import TeamSelect from './components/TeamSelect';

// const url = '/public/leagues/detail/id/D00426/league/Squash/year/2024-2025/pages_id/25.html';

export default async function Page({ params }: { params: { id: string[] } }) {
  const url = await params.id.join('/');
  const fullUrl = `https://www.hksquash.org.hk/${url}`.replace('detail', 'results_schedules');
  return (
    <div>
      <section>
        <h1 className='text-center text-2xl my-2 shadow-md font-bold py-2'>Select your team</h1>
      </section>
      <main className='mx-2 py-2'>
        <Suspense fallback={<div>Loading...</div>}>
          <TeamSelect url={fullUrl ?? ''} />
        </Suspense>
      </main>
    </div>
  );
}
