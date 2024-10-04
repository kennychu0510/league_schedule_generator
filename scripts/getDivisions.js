const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');

const filePath = path.join(__dirname, 'resources', '2024-2025.html');
const htmlFile = fs.readFileSync(filePath, 'utf-8');

const $ = cheerio.load(htmlFile);

const divisionData = [];

const leagueList = $('#leagueMain21 > div > div.league-list.clearfix');
const divisions = leagueList.find('a');
for (let division of divisions) {
  const url = division.attribs.href;
  const divisionName = $(division).text();
  divisionData.push({ division: divisionName, url });
}

fs.writeFileSync(
  path.join(__dirname, 'output', 'divisions.json'),
  JSON.stringify(divisionData, null, 2)
);
