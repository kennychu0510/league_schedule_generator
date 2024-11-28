import axios from 'axios';
import * as cheerio from 'cheerio';
import { ServerActionResponse } from './interface';

export async function getTeams(scheduleLink: string): Promise<ServerActionResponse<string[]>> {
  try {
    const { data } = await axios.get(scheduleLink);
    const teams = new Set<string>();

    if (!data) {
      return {
        status: 'failed',
        message: 'invalid url',
        data: [],
      };
    }
    const $ = cheerio.load(data);
    const tables = $('.results-schedules-container');
    for (const table of tables) {
      // const time = $(table).find('.results-schedules-title').text().trim();
      const schedule = $(table).find('.results-schedules-content');
      const matchRows = $(schedule).find('.results-schedules-list');
      // trim the first row from matchRows
      const [, ...rest] = matchRows;
      for (const matchRow of rest) {
        const teamA = $(matchRow).children('.col-xs-2').first().text();
        const teamB = $(matchRow).children('.col-xs-3').first().text();
        teams.add(teamA);
        teams.add(teamB);
      }
    }
    if (teams.size === 0) {
      return {
        status: 'failed',
        message: 'No Teams Found',
        data: [],
      };
    }
    teams.delete('[BYE]');
    return {
      status: 'success',
      message: 'success',
      data: Array.from(teams.values()),
    };
  } catch {
    console.log('something went wrong');
    return {
      status: 'failed',
      message: 'Invalid URL',
      data: [],
    };
  }
}
