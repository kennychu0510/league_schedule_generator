/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect } from '@playwright/test';
import ical from 'node-ical';

test('has all divisions', async ({ page }) => {
  await page.goto('http://localhost:3000');

  expect(page.getByTestId('Main-Premier Main-chip')).toBeVisible();
  expect(page.getByTestId('Main-2-chip')).toBeVisible();
  expect(page.getByTestId('Main-3-chip')).toBeVisible();
  expect(page.getByTestId('Main-4-chip')).toBeVisible();
  expect(page.getByTestId('Main-5-chip')).toBeVisible();
  expect(page.getByTestId('Main-6-chip')).toBeVisible();
  expect(page.getByTestId('Main-7A-chip')).toBeVisible();
  expect(page.getByTestId('Main-7B-chip')).toBeVisible();
  expect(page.getByTestId('Main-8B-chip')).toBeVisible();
  expect(page.getByTestId('Main-8A-chip')).toBeVisible();
  expect(page.getByTestId('Main-9-chip')).toBeVisible();
  expect(page.getByTestId('Main-10-chip')).toBeVisible();
  expect(page.getByTestId('Main-11-chip')).toBeVisible();
  expect(page.getByTestId('Main-12-chip')).toBeVisible();
  expect(page.getByTestId('Main-13B-chip')).toBeVisible();
  expect(page.getByTestId('Main-13A-chip')).toBeVisible();
  expect(page.getByTestId('Main-14-chip')).toBeVisible();
  expect(page.getByTestId('Main-15A-chip')).toBeVisible();
  expect(page.getByTestId('Main-15B-chip')).toBeVisible();

  expect(page.getByTestId('Master-Premier Masters-chip')).toBeVisible();
  expect(page.getByTestId('Master-2-chip')).toBeVisible();
  expect(page.getByTestId('Master-3-chip')).toBeVisible();
  expect(page.getByTestId('Master-4-chip')).toBeVisible();

  expect(page.getByTestId('Ladies-Premier Ladies-chip')).toBeVisible();
  expect(page.getByTestId('Ladies-2-chip')).toBeVisible();
  expect(page.getByTestId('Ladies-3-chip')).toBeVisible();
  expect(page.getByTestId('Ladies-4-chip')).toBeVisible();

  await page.getByTestId('Main-3-chip').click();
  await page.getByRole('button').click();
  await page.getByRole('combobox').click();
  await page.getByRole('option', { name: 'Happy Squash' }).click();
  await page.getByRole('button', { name: 'Generate' }).click();
  expect(page.getByTestId('generated-schedule')).toBeVisible();

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

  expect(events[0].summary).toBe('Squash League - Division 3 - vs NEXUS 1 (HOME)');
  expect(events[0].location).toBe('Cornwall Street Squash Centre');
  expect(events[0].start.toString()).toBe('Tue Oct 08 2024 19:00:00 GMT+0800 (Hong Kong Standard Time)');

  expect(events[17].summary).toBe('Squash League - Division 3 - vs Hong Kong Football Club 3B (HOME)');
  expect(events[17].location).toBe('Cornwall Street Squash Centre');
  expect(events[17].start.toString()).toBe('Tue Mar 11 2025 19:00:00 GMT+0800 (Hong Kong Standard Time)');
});
