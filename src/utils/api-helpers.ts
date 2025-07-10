import { Country } from '../types';
import { POPULAR_COUNTRIES_FALLBACK, POPULAR_COUNTRIES_NAMES } from '../constants';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
const API_FORCE_TYPE = process.env.NEXT_PUBLIC_API_FORCE_TYPE;

export const fetchCountriesFromExternalAPI = async (lang: string = 'ru'): Promise<Country[]> => {
  try {
    const response = await fetch(
      `${API_URL}${API_ENDPOINT}?force_type=${API_FORCE_TYPE}&lang=${lang}`,
    );

    if (!response.ok) {
      console.error('External API error:', response.status, response.statusText);
      return POPULAR_COUNTRIES_FALLBACK;
    }

    const data = await response.json();
    const countries = data.countries?.[lang];

    if (!Array.isArray(countries)) {
      return POPULAR_COUNTRIES_FALLBACK;
    }

    return countries;
  } catch (error) {
    console.error('Failed to fetch from external API:', error);
    return POPULAR_COUNTRIES_FALLBACK;
  }
};

export const fetchPopularCountriesFromExternalAPI = async (lang: string = 'ru'): Promise<Country[]> => {
  try {
    const allCountries = await fetchCountriesFromExternalAPI(lang);
    
    return allCountries.filter((country: Country) => {
      const countryName = country.url.replace(/^\/country\//, '').replace(/\/$/, '');
      return POPULAR_COUNTRIES_NAMES.includes(countryName);
    });
  } catch (error) {
    console.error('Failed to fetch popular countries:', error);
    return POPULAR_COUNTRIES_FALLBACK;
  }
};
