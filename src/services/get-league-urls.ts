'use server';

import * as cheerio from 'cheerio';
import axios from 'axios';

const rootUrl = 'https://www.hksquash.org.hk';

export async function getDivisionAssets(type: 'summer' | 'winter') {
  const response = await axios.get(rootUrl);
  const $ = cheerio.load(response.data);
  const menuItems = $('li.menu-li-childer');
  const squashLeagueItem = menuItems.filter((i, el) => $(el).text().includes('Squash League'));
  const summerLeagueItem = menuItems.filter((i, el) => $(el).text().includes('Summer League'));
  const squashLeagueLink = squashLeagueItem.find('a').attr('href');
  const summerLeagueLink = summerLeagueItem.find('a').attr('href');
  if (type === 'summer') {
    const divisions = await getScheduleUrlsMapping(summerLeagueLink);
    return { divisions, link: summerLeagueLink };
  }
  const divisions = await getScheduleUrlsMapping(squashLeagueLink);
  return { divisions, link: squashLeagueLink };
}

async function getScheduleUrlsMapping(leagueListUrl: string | undefined) {
  if (!leagueListUrl) {
    return [];
  }
  const response = await axios.get(rootUrl + leagueListUrl);
  const $ = cheerio.load(response.data);
  const firstTabContent = $('div.tab-content div.tab-content').first();
  const leagueList = firstTabContent.find('div.league-list-box');
  const result = [];
  for (const league of leagueList) {
    const id = $(league).attr('id')?.replace('league', '').replace(/\d/g, '');
    if (!id) {
      continue;
    }
    const divisionsUrlList = $(league)
      .find('a')
      .map((i, el) => {
        return {
          url: $(el).attr('href'),
          division: $(el).text(),
        };
      })
      .get()
      .filter((item) => !!item.url) as { url: string; division: string }[];

    result.push({ id, divisionsUrlList });
  }
  return result;
}
