import * as ics from 'ics';
import * as cheerio from 'cheerio';

export default function createIcalFile(htmlFile: any, team: string): ics.EventAttributes[] {
  const iCalFile: ics.EventAttributes[] = [];

  const $ = cheerio.load(htmlFile);
  const tables = $('.results-schedules-container');
  const divContainer = $('.teams-section-container').children().first();
  const div = $(divContainer).find('a').text().trim();
  for (let table of tables) {
    const time = $(table).find('.results-schedules-title').text().trim();
    const schedule = $(table).find('.results-schedules-content');
    const teamA = $(schedule).children(`div:contains(${team})`).children().first().text();
    const teamB = $(schedule).children(`div:contains(${team})`).children().eq(2).text();
    const venue = $(schedule).children(`div:contains(${team})`).children().eq(3).text();
    const week = time.slice(0, time.indexOf('-') - 1);
    const date = time
      .slice(time.indexOf('-') + 2)
      .split('/')
      .map((item) => Number(item));

    const opponent = teamA.includes(team) ? teamB : teamA;
    const event: ics.EventAttributes = {
      title: `Squash League - ${div} - vs ${opponent}`,
      start: [date[2], date[1], date[0], 19 - 8, 0],
      duration: { hours: 2 },
      location: venue || '',
      startInputType: 'utc',
      startOutputType: 'utc',
      endInputType: 'utc',
      endOutputType: 'utc',
    };

    iCalFile.push(event);
  }
  return iCalFile;
}
