'use server';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import DivisionBadge from '../my-components/DivisionBadge';
import { getDivisionAssets } from '@/services/get-league-urls';

function getDivisionType(): 'winter' | 'summer' {
  const today = new Date();
  const month = today.getMonth();
  // between May and September is summer
  if (month >= 4 && month <= 8) {
    return 'summer';
  }
  return 'winter';
}

export default async function LeagueList() {
  const divisionType = getDivisionType();
  const divisions = await getDivisionAssets(divisionType);
  return (
    <div>
      <div className='capitalize mx-2 mb-2 font-bold'>{divisionType} League</div>
      {divisions.map((division) => (
        <Card className='mx-2 mb-2' key={division.id}>
          <CardHeader>
            <CardTitle>{division.id}</CardTitle>
            <CardDescription>{division.divisionsUrlList.length} Divisions</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className='flex flex-wrap'>
              {division.divisionsUrlList.map((d) => (
                <DivisionBadge key={d.url} url={d.url} division={d.division} category={division.id} />
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
