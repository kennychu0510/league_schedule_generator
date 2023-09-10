// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { getTeams } from '@/helpers/getTeams';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = JSON.parse(req.body);

  if (!url) {
    return res.status(404).json({ message: 'no url is provided' });
  }

  const { data } = await axios.get(url);
  const result = await getTeams(data);

  if (result.status === 'failed') {
    return res.status(404).json({
      message: result.message,
    });
  } else {
    return res.json(result);
  }
}
