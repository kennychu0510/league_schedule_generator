/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect } from '@playwright/test';
import ical from 'node-ical';

test('has all divisions', async ({ page }) => {
  await page.goto('http://localhost:3000');

  expect(page.getByLabel('Main-Premier Main')).toBeVisible();
  expect(page.getByLabel('Main-2')).toBeVisible();
  expect(page.getByLabel('Main-3')).toBeVisible();
  expect(page.getByLabel('Main-4')).toBeVisible();
  expect(page.getByLabel('Main-5')).toBeVisible();
  expect(page.getByLabel('Main-6')).toBeVisible();
  expect(page.getByLabel('Main-7A')).toBeVisible();
  expect(page.getByLabel('Main-7B')).toBeVisible();
  expect(page.getByLabel('Main-8B')).toBeVisible();
  expect(page.getByLabel('Main-8A')).toBeVisible();
  expect(page.getByLabel('Main-9')).toBeVisible();
  expect(page.getByLabel('Main-10')).toBeVisible();
  expect(page.getByLabel('Main-11')).toBeVisible();
  expect(page.getByLabel('Main-12')).toBeVisible();
  expect(page.getByLabel('Main-13B')).toBeVisible();
  expect(page.getByLabel('Main-13A')).toBeVisible();
  expect(page.getByLabel('Main-14')).toBeVisible();
  expect(page.getByLabel('Main-15A')).toBeVisible();
  expect(page.getByLabel('Main-15B')).toBeVisible();

  expect(page.getByLabel('Master-Premier Masters')).toBeVisible();
  expect(page.getByLabel('Master-2')).toBeVisible();
  expect(page.getByLabel('Master-3')).toBeVisible();
  expect(page.getByLabel('Master-4')).toBeVisible();

  expect(page.getByLabel('Ladies-Premier Ladies')).toBeVisible();
  expect(page.getByLabel('Ladies-2')).toBeVisible();
  expect(page.getByLabel('Ladies-3')).toBeVisible();
  expect(page.getByLabel('Ladies-4')).toBeVisible();

  await page.getByLabel('Main-3').click();
  await page.waitForURL('http://localhost:3000/division?*');
  await page.getByLabel('Kowloon Cricket Club 3B').click();
  await page.waitForURL('http://localhost:3000/result?*');
  expect(page.getByLabel('Download')).toBeVisible();

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download' }).click();
  const download = await downloadPromise;
  const reader = await download.createReadStream();
  const buffer: any = await new Promise((resolve) => {
    const chunks: any = [];
    reader.on('data', (chunk) => chunks.push(chunk));
    reader.on('end', () => resolve(Buffer.concat(chunks)));
  });
  const ics = buffer.toString('utf8');
  const events = Object.values(ical.sync.parseICS(ics)) as any;

  expect(events[0].summary).toBe('Squash League - Division 3 - vs Kowloon Cricket Club 3A (AWAY)');
  expect(events[0].location).toBe('Kowloon Cricket Club');
  expect(events[0].start.toString()).toBe('Tue Oct 08 2024 19:00:00 GMT+0800 (Hong Kong Standard Time)');

  expect(events[17].summary).toBe('Squash League - Division 3 - vs Hong Kong Football Club 3A (AWAY)');
  expect(events[17].location).toBe('Hong Kong Football Club');
  expect(events[17].start.toString()).toBe('Tue Mar 18 2025 19:00:00 GMT+0800 (Hong Kong Standard Time)');
});
