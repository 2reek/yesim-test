import { FC } from 'react';
import { useRouter } from 'next/router';
import { Country } from '../../types';
import styles from './CountryPage.module.css';

type Props = {
  country: Country;
  lang: string;
};

const CountryPage: FC<Props> = ({ country }) => {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <main className={styles.loadingContainer}>
        <h2>Загрузка...</h2>
        <p>Страница генерируется...</p>
      </main>
    );
  }

  if (!country) {
    return (
      <main className={styles.container}>
        <h1 className={styles.title}>Страна не найдена</h1>
        <button onClick={() => router.back()} className={styles.backButton}>
          Назад
        </button>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>{country.country}</h1>
      <p className={styles.info}>ISO: {country.iso}</p>
      {country.classic_info?.price_per_gb && (
        <p className={styles.price}>
          Цена: от €
          {(parseInt(country.classic_info.price_per_gb, 10) / 100).toFixed(2).replace('.', ',')}/GB
        </p>
      )}
      {country.classic_info?.price_per_day && (
        <p className={styles.price}>
          Цена за день: от €
          {(parseInt(country.classic_info.price_per_day, 10) / 100).toFixed(2).replace('.', ',')}
          /день
        </p>
      )}
      <button onClick={() => router.back()} className={styles.backButton}>
        Назад
      </button>
    </main>
  );
};

export default CountryPage;
