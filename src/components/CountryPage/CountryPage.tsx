import { FC } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Country } from '../../types';
import { Slider } from '../Slider';
import styles from './CountryPage.module.css';

type Props = {
  country: Country;
  lang: string;
};

const CountryPage: FC<Props> = ({ country }) => {
  const router = useRouter();
  const { t } = useTranslation();

  const flagSrc = country.iso ? `/flags/${country.iso.toLowerCase()}.svg` : '/flags/un.svg';

  if (router.isFallback) {
    return (
      <main className={styles.loadingContainer}>
        <h2>{t('loading')}</h2>
      </main>
    );
  }

  if (!country) {
    return (
      <main className={styles.container}>
        <h1 className={styles.title}>{t('countryNotFound')}</h1>
        <button onClick={() => router.back()} className={styles.backButton}>
          {t('back')}
        </button>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <section className={styles.infoCard}>
        <div className={styles.infoText}>
          <h1 className={styles.title}>{country.country}</h1>
          <p className={styles.subtitle}>{t('travelSim')}</p>
        </div>
        <div className={styles.flagWrapper}>
          <Image
            src={flagSrc}
            alt={country.country}
            width={32}
            height={32}
            className={styles.flag}
          />
        </div>
      </section>

      <Slider title={t('faq')} />
    </main>
  );
};

export default CountryPage;
