// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import * as cheerio from "cheerio";

type Data = {
  message: string;
  teams?: string[];
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { url } = JSON.parse(req.body);

  if (!url) {
    return res.status(404).json({ message: "no url is provided" });
  }

  async function main() {
    try {
      const teams = new Set<string>();
      const { data } = await axios.get(url);
      if (!data) {
        return res.status(404).json({
          message: "invalid url",
        });
      }
      const $ = cheerio.load(data);
      const tables = $(".results-schedules-container");
      for (let table of tables) {
        const time = $(table).find(".results-schedules-title").text().trim();
        const schedule = $(table).find(".results-schedules-content");
        const team = $(schedule).children().eq(2).children().first().text()

        // const teamA = $(schedule).children('div:contains("KCC")').children().first().text();

        // teams.push(teams);
        if (teams) {
          teams.add(team);
        }
      }
      console.log(teams);
      res.status(200).json({
        message: "success",
        teams: Array.from(teams.values()),
      });
    } catch (error) {
      console.log("something went wrong");
      res.status(404).json({
        message: "Invalid URL",
      });
    }
  }

  main();
}
