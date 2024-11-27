import { Suspense } from 'react';
import TeamSelect from './components/TeamSelect';
import Spinner from '@/app/my-components/Spinner';

export default async function Page({ params }: { params: { id: string[] } }) {
  const urlString = (await params).id;
  const url = urlString.join('/');
  const fullUrl = `https://www.hksquash.org.hk/${url}`.replace('detail', 'results_schedules');
  return (
    <div>
      <section>
        <h1 className='text-center text-2xl my-2 font-bold py-2'>Select your team</h1>
      </section>
      <main className='mx-2 py-2'>
        <Suspense fallback={<Spinner message='Retrieving Teams' />}>
          <TeamSelect url={fullUrl ?? ''} />
        </Suspense>
      </main>
    </div>
  );
}
