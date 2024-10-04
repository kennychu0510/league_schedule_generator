import { getTeams } from '@/helpers/getTeams';
import fs from 'fs';
import { expect, test } from 'vitest';

test('get teams working properly', async () => {
  const data = fs.readFileSync('./tests/sample1.html', { encoding: 'utf-8' });

  expect((await getTeams(data)).teams?.length).toBe(7);
  expect((await getTeams(data)).teams).toBeDefined();
  expect(
    (await getTeams(data)).teams?.map((item) => item.toLocaleLowerCase())
  ).toEqual(
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
