const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');

const leagueType = ['Main', 'Master', 'Ladies']

const filePath = path.join(__dirname, 'resources', `2024-2025.html`);
  const htmlFile = fs.readFileSync(filePath, 'utf-8');
  
  const $ = cheerio.load(htmlFile);
  
  

  function generateDivisionsJson(leagueType) {
    const divisionData = [];
  
    const leagueList = $(`#league${leagueType}21 > div > div.league-list.clearfix`);
    const divisions = leagueList.find('a');
    for (let division of divisions) {
      const url = division.attribs.href;
      const divisionName = $(division).text();
      divisionData.push({ division: divisionName, url });
    }
    
    fs.writeFileSync(
      path.join(__dirname, 'output', `divisions-${leagueType.toLowerCase()}.json`),
      JSON.stringify(divisionData, null, 2)
    );
  }

  for (let type of leagueType) {
    generateDivisionsJson(type);
  }