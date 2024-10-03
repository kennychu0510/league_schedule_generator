import createIcalFile from '@/helpers/createIcalFile';
import fs from 'fs';
import { expect, test } from 'vitest';

test('create iCal File works properly', () => {
  const data = fs.readFileSync('./tests/sample1.html', { encoding: 'utf-8' });
  const schedule = createIcalFile(data, 'KCC 1');
  expect(schedule.length).toBe(14);
  expect(schedule[0].title).toMatch(/i-mask advance squash club 1/i);
  expect(schedule[13].title).toMatch(/PHYSICAL CHESS 1/i);
  expect(schedule[13].location).toMatch(/HK SQUASH CENTRE/i);
});

test('create iCal File works properly 2', () => {
  const data = fs.readFileSync('./tests/sample2.html', { encoding: 'utf-8' });
  const schedule = createIcalFile(data, 'Bruh');
  expect(schedule.length).toBe(11);
  expect(schedule[0].title).toMatch(/FRIEND CLUB 1/i);
  expect(schedule[10].title).toMatch(/I-MASK ADVANCE SQUASH CLUB 2/i);
});

test('Test Home and Away is correctly handled', () => {
  const data = fs.readFileSync('./tests/sample2.html', { encoding: 'utf-8' });
  const schedule = createIcalFile(data, 'TNGX');
  expect(schedule[3].title).toContain('(AWAY)');
  expect(schedule[4].title).toContain('(HOME)');
});

test('Bye correctly handled', () => {
  const data = fs.readFileSync('./tests/sample1.html', { encoding: 'utf-8' });
  const schedule = createIcalFile(data, 'KCC 1');
  expect(schedule[1].title).toContain('BYE');
});
