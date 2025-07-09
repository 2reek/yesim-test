import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Country } from '../../types';
import { findCountryById } from '../../utils/utils';
import { CountryPage as CountryPageComponent } from '../../components';
import { POPULAR_COUNTRIES_NAMES, POPULAR_COUNTRIES_FALLBACK } from '../../constants/constants';

const fetchAllCountries = async (lang: string = 'en'): Promise<Country[]> => {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/get-all-countries?lang=${lang}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && Array.isArray(data.countries)) {
      return data.countries;
    }

    throw new Error('Invalid API response format');
  } catch (error) {
    console.warn('Failed to fetch all countries:', error);
    return POPULAR_COUNTRIES_FALLBACK;
  }
};

const fetchPopularCountries = async (lang: string = 'en'): Promise<Country[]> => {
  try {
    const allCountries = await fetchAllCountries(lang);

    return allCountries.filter((country: Country) => {
      const countryName = country.url.replace(/^\/country\//, '').replace(/\/$/, '');

      return POPULAR_COUNTRIES_NAMES.includes(countryName);
    });
  } catch (error) {
    console.warn('Failed to fetch popular countries, using fallback data:', error);
    return POPULAR_COUNTRIES_FALLBACK;
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const supportedLocales = ['en', 'ru'];
  const paths: { params: { id: string }; locale: string }[] = [];

  try {
    for (const locale of supportedLocales) {
      const popularCountries = await fetchPopularCountries(locale);

      popularCountries.forEach((country: Country) => {
        const countryName = country.url.replace(/^\/country\//, '').replace(/\/$/, '');
        if (countryName) {
          paths.push({
            params: { id: countryName },
            locale,
          });
        }
      });
    }
  } catch (error) {
    console.error('Failed to generate paths for popular countries:', error);
  }

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const lang = locale || 'en';
  const countryId = params?.id as string;

  try {
    const countries = await fetchAllCountries(lang);

    const countryData = findCountryById(countryId, countries);

    if (!countryData) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        country: countryData,
        lang,
        ...(await serverSideTranslations(lang, ['translation'])),
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      notFound: true,
    };
  }
};

type Props = {
  country: Country;
  lang: string;
};

const CountryPage: NextPage<Props> = ({ country, lang }) => {
  return <CountryPageComponent country={country} lang={lang} />;
};

export default CountryPage;
