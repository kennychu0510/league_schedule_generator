// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import * as cheerio from "cheerio";
import * as ics from "ics";

type Data = {
  message: string;
  schedule?: any;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { url, team } = JSON.parse(req.body);

  if (!url) {
    return res.status(404).json({ message: "no url is provided" });
  }

  async function main() {
    const iCalFile: ics.EventAttributes[] = [];

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const tables = $(".results-schedules-container");
    const divContainer = $('.teams-section-container').children().first()
    const div = $(divContainer).find('a').text().trim();
    for (let table of tables) {
      const time = $(table).find(".results-schedules-title").text().trim();
      const schedule = $(table).find(".results-schedules-content");
      const teamA = $(schedule).children(`div:contains(${team})`).children().first().text();
      const teamB = $(schedule).children(`div:contains(${team})`).children().eq(2).text();
      const venue = $(schedule).children(`div:contains(${team})`).children().eq(3).text();
      const week = time.slice(0, time.indexOf("-") - 1);
      const date = time
        .slice(time.indexOf("-") + 2)
        .split("/")
        .map((item) => Number(item));

      const opponent = teamA.includes(team) ? teamB : teamA;
      const event: ics.EventAttributes = {
        title: `Squash League - ${div} - vs ${opponent}`,
        start: [date[2], date[1], date[0], 19, 0],
        duration: { hours: 2 },
        location: venue || "",
      };

      iCalFile.push(event);
    }

    ics.createEvents(iCalFile, (error, value) => {
      if (error) {
        console.log(error)
        res.status(500).json({
          message: "error generating schedule",
        });
        return
      }

      res.status(200).json({
        message: "success",
        schedule: value,
      });

    });

    
  }

  try {
    main();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "url parsing error",
    });
  }
}
