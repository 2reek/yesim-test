import type { NextApiRequest, NextApiResponse } from 'next';
import { Country } from '../../types';
import { POPULAR_COUNTRIES_FALLBACK } from '../../constants';

declare global {
  // eslint-disable-next-line no-var
  var __countriesCache: Map<string, { data: Country[]; timestamp: number }> | undefined;
}

if (!global.__countriesCache) {
  global.__countriesCache = new Map();
}

const apiCache = global.__countriesCache;
const CACHE_DURATION = 5 * 60 * 1000;

const fetchAllCountries = async (lang: string = 'ru'): Promise<Country[]> => {
  const cacheKey = `external_all_${lang}`;

  const cached = apiCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await fetch(
      `https://api3.yesim.cc/sale_list?force_type=countries&lang=${lang}`,
    );

    if (!response.ok) {
      console.error('External API error:', response.status, response.statusText);

      if (response.status === 429) {
        return POPULAR_COUNTRIES_FALLBACK;
      }

      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.json();

    const countries = data.countries?.[lang];

    if (!Array.isArray(countries)) {
      return POPULAR_COUNTRIES_FALLBACK;
    }

    apiCache.set(cacheKey, {
      data: countries,
      timestamp: Date.now(),
    });

    return countries;
  } catch {
    return POPULAR_COUNTRIES_FALLBACK;
  }
};

type ApiResponse = {
  success: boolean;
  countries?: Country[];
  error?: string;
  total?: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const { lang = 'ru' } = req.query;
    const countries = await fetchAllCountries(lang as string);

    res.status(200).json({
      success: true,
      countries: countries,
      total: countries.length,
    });
  } catch (error) {
    console.error('❌ API Error in get-all-countries:', error);

    res.status(200).json({
      success: true,
      countries: POPULAR_COUNTRIES_FALLBACK,
      total: POPULAR_COUNTRIES_FALLBACK.length,
    });
  }
}
