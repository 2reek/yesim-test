import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { MainTitle, CountrySearch, CountryList } from '@components/MainPage';
import { Slider } from '@components/Slider';
import type { Country } from '@/types';
import { POPULAR_COUNTRIES_FALLBACK } from '@constants/index';
import { API_ERRORS, REVALIDATION_TIME } from '@constants/http-statuses';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const lang = locale || 'en';

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/get-popular-countries?lang=${lang}`,
      {
        next: { revalidate: REVALIDATION_TIME.DEFAULT },
        headers: {
          Accept: 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(API_ERRORS.EXTERNAL_API_ERROR(response.status));
    }

    const data = await response.json();

    if (!data.success || !data.countries) {
      throw new Error(API_ERRORS.INVALID_RESPONSE);
    }

    return {
      props: {
        countries: data.countries,
        ...(await serverSideTranslations(lang, ['translation'])),
      },
      revalidate: REVALIDATION_TIME.DEFAULT,
    };
  } catch (error) {
    console.error('Error fetching countries:', error);

    return {
      props: {
        countries: POPULAR_COUNTRIES_FALLBACK,
        ...(await serverSideTranslations(lang, ['translation'])),
      },
      revalidate: REVALIDATION_TIME.ERROR,
    };
  }
};

type Props = {
  countries: Country[];
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
