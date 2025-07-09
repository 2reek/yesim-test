import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { MainTitle, CountrySearch, CountryList } from '../components/MainPage';
import { Slider } from '../components/Slider';
import { Country } from '../types';
import { POPULAR_COUNTRIES_FALLBACK } from '../constants';
import { CACHE_DURATION } from '../utils';

const serverCache = new Map<string, { data: Country[]; timestamp: number }>();

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const lang = locale || 'en';
  const cacheKey = `popular_${lang}`;

  try {
    const cached = serverCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return {
        props: {
          countries: cached.data,
          lang,
          ...(await serverSideTranslations(lang, ['translation'])),
        },
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/get-popular-countries?lang=${lang}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success || !data.countries) {
      throw new Error('Invalid API response');
    }

    serverCache.set(cacheKey, {
      data: data.countries,
      timestamp: Date.now(),
    });

    return {
      props: {
        countries: data.countries,
        lang,
        ...(await serverSideTranslations(lang, ['translation'])),
      },
    };
  } catch (error) {
    console.error('Error fetching countries:', error);

    return {
      props: {
        countries: POPULAR_COUNTRIES_FALLBACK,
        lang,
        ...(await serverSideTranslations(lang, ['translation'])),
      },
    };
  }
};

type Props = {
  countries: Country[];
  lang: string;
};

const HomePage: NextPage<Props> = ({ countries }) => {
  const { t } = useTranslation();

  return (
    <>
      <main>
        <MainTitle text={t('simTitle')} />
        <CountrySearch />
        <CountryList initialCountries={countries} />
        <Slider title={t('faq')} />
      </main>
    </>
  );
};

export default HomePage;
