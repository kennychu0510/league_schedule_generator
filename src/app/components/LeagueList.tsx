'use server';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import DivisionBadge from '../my-components/DivisionBadge';
import { getDivisionAssets } from '@/services/get-league-urls';
import { RootUrl } from '@/constants';

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
  const { divisions, link } = await getDivisionAssets(divisionType);
  const invalidResult = divisions.length === 0;
  return (
    <div className='flex flex-col mx-2'>
      {invalidResult ? (
        <div className='text-red-400 my-4'>There are no divisions available for the {divisionType} league at the moment.</div>
      ) : (
        <>
          <div className='capitalize mb-2 font-bold'>{divisionType} League</div>
          {divisions.map((division) => (
            <Card className=' mb-2' key={division.id}>
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
        </>
      )}
      {/* source */}
      <div className='text-xs text-muted-foreground mt-2'>
        <a href={`${RootUrl + link}`} target='_blank' rel='noopener noreferrer' className='underline'>
          Source
        </a>
      </div>
    </div>
  );
}
