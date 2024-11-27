import mainDivisions from './assets/divisions-main.json';
import masterDivisions from './assets/divisions-master.json';
import ladiesDivisions from './assets/divisions-ladies.json';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DivisionBadge from './components/DivisionBadge';

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
  return (
    <div>
      <section>
        <h1 className='text-center text-2xl py-2 shadow-md font-bold'>Squash League Schedule Generator</h1>
      </section>
      <main>
        <p className='p-2'>Generate an ICS file and import to your phone!</p>
        {divisions.map((division) => (
          <Card className='mx-2 mb-2' key={division.title}>
            <CardHeader>
              <CardTitle>{division.title}</CardTitle>
              <CardDescription>{division.divisions.length} Divisions</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className='flex flex-wrap'>
                {division.divisions.map((d) => (
                  <DivisionBadge key={d.url} url={d.url} division={d.division} title={division.title} />
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
}
