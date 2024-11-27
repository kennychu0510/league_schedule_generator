'use server';
import * as ics from 'ics';
import * as cheerio from 'cheerio';
import axios from 'axios';
import { ServerActionResponse } from './interface';

type Response = {
  file: ics.EventAttributes[];
  schedule: string;
};

function createICalFileData(htmlFile: any, team: string, url?: string): ics.EventAttributes[] {
  const iCalFile: ics.EventAttributes[] = [];

  let $ = cheerio.load(htmlFile);
  const tables = $('.results-schedules-container');
  const divContainer = $('.teams-section-container').children().first();
  const div = $(divContainer).find('a').text().trim();
  for (let table of tables) {
    const time = $(table).find('.results-schedules-title').text().trim();
    const schedule = $(table).find('.results-schedules-content');
    const matchRows = $(schedule).find('.results-schedules-list');
    const { teamA, teamB, venue } = getBothTeams(matchRows, team);
    const week = time.slice(0, time.indexOf('-') - 1);
    const date = time
      .slice(time.indexOf('-') + 2)
      .split('/')
      .map((item) => Number(item));

    const isHome = teamA.toLocaleLowerCase().includes(team.toLocaleLowerCase());
    const isBye = teamB.toLocaleLowerCase().includes('BYE'.toLocaleLowerCase());

    const opponent = teamA.toLocaleLowerCase().includes(team.toLocaleLowerCase()) ? teamB : teamA;
    const title = isBye ? `Squash League - ${div} - BYE` : `Squash League - ${div} - vs ${opponent} (${isHome ? 'HOME' : 'AWAY'})`;
    const event: ics.EventAttributes = {
      title: title,
      start: [date[2], date[1], date[0], 19 - 8, 0],
      duration: { hours: 2 },
      location: venue || '',
      startInputType: 'utc',
      startOutputType: 'utc',
      endInputType: 'utc',
      endOutputType: 'utc',
      url: url,
    };

    iCalFile.push(event);
  }
  return iCalFile;
}

function getBothTeams(matchRows: any, selectedTeam: string): { teamA: string; teamB: string; venue: string } {
  const [header, ...rest] = matchRows;
  for (let matchRow of rest) {
    const $ = cheerio.load(matchRow);
    const teamA = $(matchRow).children('.col-xs-2').first().text();
    const teamB = $(matchRow).children('.col-xs-3').first().text();
    const venue = $(matchRow).children('.col-xs-3').eq(1).text().trim();
    if (teamA.toLocaleLowerCase() === selectedTeam.toLocaleLowerCase() || teamB.toLocaleLowerCase() === selectedTeam.toLocaleLowerCase()) {
      return { teamA, teamB, venue };
    }
  }
  return { teamA: '', teamB: '', venue: '' };
}

export default async function createSchedule(url: string, team: string): Promise<ServerActionResponse<Response | null>> {
  const { data } = await axios.get(url);
  if (!data) {
    return {
      status: 'failed',
      message: 'invalid url',
      data: null,
    };
  }
  const iCalFileData = createICalFileData(data, team, url);

  const iCalFile = ics.createEvents(iCalFileData);
  if (iCalFile.value) {
    return {
      status: 'success',
      message: 'created ICS file successfully',
      data: {
        schedule: iCalFile.value,
        file: iCalFileData,
      },
    };
  }
  return {
    status: 'failed',
    message: 'failed to create ICS file',
    data: null,
  };
}
