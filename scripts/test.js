const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const axios = require('axios');

const rootUrl = 'https://www.hksquash.org.hk';
async function main() {
  const response = await axios.get(rootUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    },
  });
  const $ = cheerio.load(response.data);
  // save response.data as html file
  fs.writeFileSync('response.html', response.data);
  const menuItems = $('li.menu-li-childer');
  // filter item with text === Squash League or Summer League
  const squashLeagueItem = menuItems.filter((i, el) => $(el).text().includes('Squash League'));
  const summerLeagueItem = menuItems.filter((i, el) => $(el).text().includes('Summer League'));
  const squashLeagueLink = squashLeagueItem.find('a').attr('href');
  const summerLeagueLink = summerLeagueItem.find('a').attr('href');
  // console.log({ squashLeagueLink, summerLeagueLink });

  const assets = await extractLeagueScheduleMapping(summerLeagueLink);
}

async function extractLeagueScheduleMapping(url) {
  const response = await axios.get(rootUrl + url);
  const $ = cheerio.load(response.data);
  const firstTabContent = $('div.tab-content div.tab-content').first();
  const leagueList = firstTabContent.find('div.league-list-box');
  const result = [];
  for (const league of leagueList) {
    const id = $(league).attr('id').replace('league', '').replace(/\d/g, '');
    const divisionsUrlList = $(league)
      .find('a')
      .map((i, el) => {
        return {
          url: $(el).attr('href'),
          division: $(el).text(),
        };
      })
      .get();
    result.push({ id, divisionsUrlList });
  }
  return result;
}

main();
