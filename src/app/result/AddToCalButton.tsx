'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CiCalendar } from 'react-icons/ci';

export default function AddToCalendarButton({ division, team, schedule }: { division: string; team: string; schedule: string }) {
  return (
    <div className='space-y-2'>
      <Link
        href={
          '/api/schedule?' +
          new URLSearchParams({
            division,
            team,
            schedule,
          })
        }
      >
        <Button className='rounded-full' aria-label='add-to-calendar'>
          <CiCalendar />
          Add To Calendar
        </Button>
      </Link>
    </div>
  );
}
