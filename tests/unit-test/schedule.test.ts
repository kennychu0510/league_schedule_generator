import { createICalFileData } from '@/services/create-schedule';
import fs from 'fs';
import { EventAttributes } from 'ics';
import { expect, test } from 'vitest';

test('create iCal File works properly', async () => {
  const data = fs.readFileSync('./tests/unit-test/sample1.html', {
    encoding: 'utf-8',
  });
  const schedule = (await createICalFileData(data, 'KCC 1')).file;
  expect(schedule.length).toBe(14);
  expect(schedule[0].title).toMatch(/i-mask advance squash club 1/i);
  expect(schedule[13].title).toMatch(/PHYSICAL CHESS 1/i);
  expect(schedule[13].location).toMatch(/HK SQUASH CENTRE/i);
});

test('create iCal File works properly 2', async () => {
  const data = fs.readFileSync('./tests/unit-test/sample2.html', {
    encoding: 'utf-8',
  });
  const schedule = (await createICalFileData(data, 'Bruh')).file;
  expect(schedule.length).toBe(11);
  expect(schedule[0].title).toMatch(/FRIEND CLUB 1/i);
  expect(schedule[10].title).toMatch(/I-MASK ADVANCE SQUASH CLUB 2/i);
});

test('Test Home and Away is correctly handled', async () => {
  const data = fs.readFileSync('./tests/unit-test/sample2.html', {
    encoding: 'utf-8',
  });
  const schedule = (await createICalFileData(data, 'TNGX')).file;
  expect(schedule[3].title).toContain('(AWAY)');
  expect(schedule[4].title).toContain('(HOME)');
});

test('Bye correctly handled', async () => {
  const data = fs.readFileSync('./tests/unit-test/sample1.html', {
    encoding: 'utf-8',
  });
  const schedule = (await createICalFileData(data, 'KCC 1')).file;
  expect(schedule[1].title).toContain('BYE');
});

test('Ladies D2 2024-2025 is correct', async () => {
  const data = fs.readFileSync('./tests/unit-test/sample3.html', {
    encoding: 'utf-8',
  });
  const division = 'L2';
  const schedule = (await createICalFileData(data, 'Jessica L2')).file;
  verifyEvent({
    awayTeam: 'Kowloon Cricket Club L2',
    division,
    venue: 'HK Squash Centre',
    date: '08/10/2024',
    event: schedule[0],
    isHome: true,
  });
  verifyEvent({
    awayTeam: 'Hong Kong Football Club L2B',
    division,
    venue: 'HK Squash Centre',
    date: '15/10/2024',
    event: schedule[1],
    isHome: true,
  });
  verifyEvent({
    awayTeam: 'Hong Kong Cricket Club L2',
    division,
    venue: 'Hong Kong Cricket Club',
    date: '22/10/2024',
    event: schedule[2],
    isHome: false,
  });
  verifyEvent({
    awayTeam: 'Hong Kong Football Club L2C',
    division,
    venue: 'HK Squash Centre',
    date: '29/10/2024',
    event: schedule[3],
    isHome: true,
  });
  verifyEvent({
    awayTeam: 'Hong Kong Football Club L2A',
    division,
    venue: 'Hong Kong Football Club',
    date: '05/11/2024',
    event: schedule[4],
    isHome: false,
  });
  verifyEvent({
    awayTeam: 'Kowloon Cricket Club L2',
    division,
    venue: 'Kowloon Cricket Club',
    date: '12/11/2024',
    event: schedule[5],
    isHome: false,
  });
  verifyEvent({
    awayTeam: 'Hong Kong Football Club L2B',
    division,
    venue: 'Hong Kong Football Club',
    date: '19/11/2024',
    event: schedule[6],
    isHome: false,
  });
  verifyEvent({
    awayTeam: 'Hong Kong Cricket Club L2',
    division,
    venue: 'HK Squash Centre',
    date: '26/11/2024',
    event: schedule[7],
    isHome: true,
  });
  verifyEvent({
    awayTeam: 'Hong Kong Football Club L2A',
    division,
    venue: 'HK Squash Centre',
    date: '25/03/2025',
    event: schedule[19],
    isHome: true,
  });
});

test('Main D3 2024-2025 is correct', async () => {
  const data = fs.readFileSync('./tests/unit-test/sample4.html', {
    encoding: 'utf-8',
  });
  const division = '3';
  const schedule = (await createICalFileData(data, 'Kowloon Cricket Club 3B')).file;
  verifyEvent({
    awayTeam: 'Young Player 3',
    division,
    venue: 'HK Squash Centre',
    date: '22/10/2024',
    event: schedule[2],
    isHome: false,
  });
  verifyEvent({
    awayTeam: 'BYE',
    division,
    venue: '',
    date: '29/10/2024',
    event: schedule[3],
    isHome: null,
  });
});

function verifyEvent({ awayTeam, venue, date, event, division, isHome }: { division: string; awayTeam: string; venue: string; date: string; event: EventAttributes; isHome: boolean | null }) {
  const suffix = isHome !== null ? `vs ${awayTeam} (${isHome ? 'HOME' : 'AWAY'})` : 'BYE';
  expect(event.title).toBe(`Squash League - Division ${division} - ${suffix}`);
  expect(event.location).toBe(venue);
  const dateSplit = date.split('/');
  const [day, month, year] = dateSplit.map((item) => Number(item));
  expect(event.start).toEqual([year, month, day, 11, 0]);
}
