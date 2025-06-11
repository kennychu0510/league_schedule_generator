import mainDivisions from '../assets/divisions-main.json';
import masterDivisions from '../assets/divisions-master.json';
import ladiesDivisions from '../assets/divisions-ladies.json';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DivisionBadge from './my-components/DivisionBadge';
import { LeagueYear } from '@/constants';

const divisions = [
  {
    title: 'Main',
    divisions: mainDivisions,
  },
  {
    title: 'Master',
    divisions: masterDivisions,
  },
  {
    title: 'Ladies',
    divisions: ladiesDivisions,
  },
];

export default function Home() {
  const divisionsWithItems = divisions.filter((division) => division.divisions.length > 0);
  return (
    <div>
      <section>
        <h1 className='mx-2 text-2xl py-2 font-bold'>Squash League Schedule Generator {LeagueYear}</h1>
      </section>
      <main className='pb-2'>
        <p className='p-2 text-muted-foreground'>Generate an ICS file and import to your phone!</p>
        {divisionsWithItems.map((division) => (
          <Card className='mx-2 mb-2' key={division.title}>
            <CardHeader>
              <CardTitle>{division.title}</CardTitle>
              <CardDescription>{division.divisions.length} Divisions</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className='flex flex-wrap'>
                {division.divisions.map((d) => (
                  <DivisionBadge key={d.url} url={d.url} division={d.division} category={division.title} />
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
}
