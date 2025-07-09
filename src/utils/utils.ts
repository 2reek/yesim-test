import { Country } from '../types';

export const findCountryById = (countryId: string, allCountries: Country[]): Country | null => {
  let country = allCountries.find(c => {
    const countryName = c.url.replace(/^\/country\//, '').replace(/\/$/, '');

    return countryName === countryId;
  });

  if (!country) {
    country = allCountries.find(c => c.iso && c.iso.toLowerCase() === countryId.toLowerCase());
  }

  return country || null;
};

export const countriesCache = new Map<string, { data: Country[]; timestamp: number }>();
export const CACHE_DURATION = 5 * 60 * 1000;
