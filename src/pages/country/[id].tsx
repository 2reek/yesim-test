import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Country } from '../../types';
import { findCountryById } from '../../utils/utils';
import { CountryPage as CountryPageComponent } from '../../components';
import {
  fetchCountriesFromExternalAPI,
  fetchPopularCountriesFromExternalAPI,
} from '../../utils/api-helpers';
import { useRouter } from 'next/router';

export const getStaticPaths: GetStaticPaths = async () => {
  const supportedLocales = ['en', 'ru'];
  const paths: { params: { id: string }; locale: string }[] = [];

  try {
    for (const locale of supportedLocales) {
      const popularCountries = await fetchPopularCountriesFromExternalAPI(locale);

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
    const countries = await fetchCountriesFromExternalAPI(lang);

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
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!country) {
    return <div>Country not found</div>;
  }

  return <CountryPageComponent country={country} lang={lang} />;
};

export default CountryPage;
