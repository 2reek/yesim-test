import type { NextApiRequest, NextApiResponse } from 'next';
import type { Country } from '@/types';
import { POPULAR_COUNTRIES_FALLBACK } from '@constants/index';
import { HTTP_STATUS, API_ERRORS, API_MESSAGES } from '@constants/http-statuses';

declare global {
  // eslint-disable-next-line no-var
  var __countriesCache: Map<string, { data: Country[]; timestamp: number }> | undefined;
}

if (!global.__countriesCache) {
  global.__countriesCache = new Map();
}

const apiCache = global.__countriesCache;
const CACHE_DURATION = Number(process.env.CACHE_DURATION) || 5 * 60 * 1000;

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
const API_FORCE_TYPE = process.env.NEXT_PUBLIC_API_FORCE_TYPE;

const fetchAllCountries = async (lang: string = 'ru'): Promise<Country[]> => {
  const cacheKey = `external_all_${lang}`;

  const cached = apiCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await fetch(
      `${API_URL}${API_ENDPOINT}?force_type=${API_FORCE_TYPE}&lang=${lang}`,
    );

    if (!response.ok) {
      console.error(API_MESSAGES.EXTERNAL_API_ERROR, response.status, response.statusText);

      if (response.status === HTTP_STATUS.TOO_MANY_REQUESTS) {
        return POPULAR_COUNTRIES_FALLBACK;
      }

      throw new Error(API_ERRORS.EXTERNAL_API_ERROR(response.status));
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
    return res.status(HTTP_STATUS.METHOD_NOT_ALLOWED).json({
      success: false,
      error: API_ERRORS.METHOD_NOT_ALLOWED,
    });
  }

  try {
    const { lang = 'ru' } = req.query;
    const countries = await fetchAllCountries(lang as string);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      countries: countries,
      total: countries.length,
    });
  } catch (error) {
    console.error(`${API_MESSAGES.FETCH_ERROR} get-all-countries:`, error);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      countries: POPULAR_COUNTRIES_FALLBACK,
      total: POPULAR_COUNTRIES_FALLBACK.length,
    });
  }
}
