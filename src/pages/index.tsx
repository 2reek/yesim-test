import type { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Header from '../components/Header/Header';
import MainTitle from '../components/MainTitle/MainTitle';
import CountrySearch from '../components/CountrySearch/CountrySearch';
import CountryList from '../components/CountryList/CountryList';
import { Country } from '../types';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const lang = locale || 'en';
  const res = await fetch(`https://api3.yesim.cc/sale_list?force_type=countries&lang=${lang}`);
  const json = await res.json();
  
  const countriesRaw = json?.countries?.[lang] || [];
  const countries = Array.isArray(countriesRaw) ? countriesRaw.slice(0, 12) : [];
  
  return {
    props: {
      countries,
      lang,
      ...(await serverSideTranslations(lang, ['translation'])),
    },
  };
};

type Props = {
  countries: Country[];
  lang: string;
};

const IndexPage: NextPage<Props> = ({ countries, lang }) => {
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <main>
        <MainTitle text={t('simTitle')} />
        <CountrySearch countries={countries} />
        <CountryList initialCountries={countries} lang={lang} />
      </main>
    </>
  );
};

export default IndexPage; 