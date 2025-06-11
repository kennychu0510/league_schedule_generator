const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const axios = require('axios');

const leagueType = ['Main', 'Master', 'Ladies'];

const url = 'https://www.hksquash.org.hk/public/leagues/index/league/Summer/pages_id/26.html';

async function main() {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  function generateDivisionsJson(leagueType) {
    const divisionData = [];

    const leagueList = $(`#league${leagueType}22 > div > div.league-list.clearfix`);
    const divisions = leagueList.find('a');
    for (let division of divisions) {
      const url = division.attribs.href;
      const divisionName = $(division).text();
      divisionData.push({ division: divisionName, url });
    }

    fs.writeFileSync(path.join(__dirname, 'output', `divisions-${leagueType.toLowerCase()}.json`), JSON.stringify(divisionData, null, 2));
    const appAssetsFolder = path.join(__dirname, '..', 'src', 'assets');
    fs.writeFileSync(path.join(appAssetsFolder, `divisions-${leagueType.toLowerCase()}.json`), JSON.stringify(divisionData, null, 2));
  }

  for (let type of leagueType) {
    generateDivisionsJson(type);
  }
}

main();
