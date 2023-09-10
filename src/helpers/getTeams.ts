import axios from 'axios';
import { NextApiResponse } from 'next';
import * as cheerio from 'cheerio';

type Data = {
  status: 'success' | 'failed';
  message: string;
  teams?: string[];
};
export async function getTeams(htmlFile: any): Promise<Data> {
  try {
    const teams = new Set<string>();

    if (!htmlFile) {
      return {
        status: 'failed',
        message: 'invalid url',
      };
    }
    const $ = cheerio.load(htmlFile);
    const tables = $('.results-schedules-container');
    for (let table of tables) {
      const time = $(table).find('.results-schedules-title').text().trim();
      const schedule = $(table).find('.results-schedules-content');
      const teamA = $(schedule).children(':not(:first-child)').children('div:nth-child(1)').first().text();
      const teamB = $(schedule).children(':not(:first-child)').children('div:nth-child(3)').first().text();

      teams.add(teamA);
      teams.add(teamB);
    }
    if (teams.size === 0) {
      return {
        status: 'failed',
        message: 'No Teams Found',
      };
    }
    return {
      status: 'success',
      message: 'success',
      teams: Array.from(teams.values()),
    };
  } catch (error) {
    console.log('something went wrong');
    return {
      status: 'failed',
      message: 'Invalid URL',
    };
  }
}
