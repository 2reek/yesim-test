import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const lang = req.query.lang === 'ru' ? 'ru' : 'en';
  const apiRes = await fetch(`https://api3.yesim.cc/sale_list?force_type=countries&lang=${lang}`);
  const json = await apiRes.json();
  
  res.status(200).json({ countries: json?.countries?.[lang] || [] });
}
