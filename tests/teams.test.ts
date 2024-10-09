import { getTeams } from '@/helpers/getTeams';
import fs from 'fs';
import { expect, test } from 'vitest';

test('get teams working properly', async () => {
  const data = fs.readFileSync('./tests/sample1.html', { encoding: 'utf-8' });
  const { teams } = await getTeams(data);
  console.log(teams);
  expect(teams?.length).toBe(7);
  expect(teams).toBeDefined();
  expect(teams?.map((item) => item.toLocaleLowerCase())).toEqual(
    expect.arrayContaining(
      [
        'HAPPY SQUASH 1',
        'I-MASK ADVANCE SQUASH CLUB 1',
        'KCC 1',
        'LAST MINUTE',
        'PHYSICAL CHESS 1',
        'SIU 4',
        'TNG 1',
      ].map((item) => item.toLocaleLowerCase())
    )
  );
});

test('get teams working properly 2', async () => {
  const data = fs.readFileSync('./tests/sample2.html', { encoding: 'utf-8' });

  expect((await getTeams(data)).teams?.length).toBe(12);
  expect((await getTeams(data)).teams).toBeDefined();
});

test('get teams from ladies division 2024-2025', async () => {
  const data = fs.readFileSync('./tests/sample3.html', { encoding: 'utf-8' });

  const { teams } = await getTeams(data);

  expect(teams?.length).toBe(6);
  expect(teams?.includes('Hong Kong Cricket Club L2')).toBeTruthy();
  expect(teams?.includes('Hong Kong Football Club L2A')).toBeTruthy();
  expect(teams?.includes('Hong Kong Football Club L2B')).toBeTruthy();
  expect(teams?.includes('Hong Kong Football Club L2C')).toBeTruthy();
  expect(teams?.includes('JESSICA L2')).toBeTruthy();
  expect(teams?.includes('Kowloon Cricket Club L2')).toBeTruthy();
});
