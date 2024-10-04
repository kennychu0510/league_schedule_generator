// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as ics from 'ics';
import createIcalFile from '@/helpers/createIcalFile';

type Data = {
  message: string;
  schedule?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { url, team } = JSON.parse(req.body);

  if (!url) {
    return res.status(404).json({ message: 'no url is provided' });
  }
  const { data } = await axios.get(url);

  async function main() {
    const iCalFile = createIcalFile(data, team, url);

    ics.createEvents(iCalFile, (error, value) => {
      if (error) {
        console.log(error);
        res.status(500).json({
          message: 'error generating schedule',
        });
        return;
      }

      res.status(200).json({
        message: 'success',
        schedule: value,
      });
    });
  }

  try {
    main();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'url parsing error',
    });
  }
}
