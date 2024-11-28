import { Card, CardContent } from '@/components/ui/card';
import { EventAttributes } from 'ics';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function ScheduleSummary({ schedule, team }: { schedule: EventAttributes[]; team: string }) {
  const totalMatches = schedule.filter((item) => !!item.location).length;
  const totalOpponents = schedule.map((item) => trimHomeAndAwayDetail(item.title?.split('vs')[1]?.trim() ?? '')).filter((teamName) => !!teamName && teamName != team);
  const uniqueOpponents = new Set(totalOpponents);
  const totalVenues = new Set(schedule.map((item) => item.location ?? '').filter(Boolean));
  const totalRounds = totalOpponents.filter((teamName) => teamName === totalOpponents[0]).length;
  return (
    <div className='grid grid-cols-4 gap-x-2'>
      <SummaryItem value={totalMatches.toString()} label={'Matches'} />
      <SummaryItem value={uniqueOpponents.size.toString()} label={'Opponents'} details={Array.from(uniqueOpponents)} />
      <SummaryItem value={totalVenues.size.toString()} label={'Venues'} details={Array.from(totalVenues)} />
      <SummaryItem value={totalRounds.toString()} label={totalRounds > 1 ? 'Rounds' : 'Round'} />
    </div>
  );
}

const SummaryItem = ({ value, label, details }: { value: string; label: string; details?: string[] }) => {
  const CardDetail = (
    <Card>
      <CardContent className='p-2'>
        <div className='flex flex-col items-center justify-center h-full aspect-square'>
          <p className='font-bold text-2xl'>{value}</p>
          <p className='text-center uppercase text-xs'>{label}</p>
        </div>
      </CardContent>
    </Card>
  );
  if (!details) {
    return CardDetail;
  }
  const sortedDetails = details.sort((a, b) => a.localeCompare(b));
  return (
    <Dialog modal>
      <DialogTrigger>{CardDetail}</DialogTrigger>
      <DialogContent className='rounded-2xl'>
        <DialogHeader>
          <DialogTitle className='uppercase text-center'>{label}</DialogTitle>
          <DialogDescription className='mx-auto flex flex-col space-y-2'>
            {sortedDetails.map((detail) => (
              <p key={detail} className='text-left text-xl'>
                {detail}
              </p>
            ))}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

function trimHomeAndAwayDetail(teamName: string) {
  return teamName.replace('(HOME)', '').replace('(AWAY)', '').trim();
}
