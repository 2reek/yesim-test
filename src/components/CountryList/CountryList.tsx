import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import CountryElement from '../CountryElement/CountryElement';
import { Country } from '../../types';
import styles from './CountryList.module.css';

type Props = {
  initialCountries: Country[];
  lang: string;
};

const CountryList: FC<Props> = ({ initialCountries, lang }) => {
  const { t } = useTranslation();
  const [countries, setCountries] = useState<Country[]>(initialCountries);
  const [allLoaded, setAllLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setCountries(initialCountries);
    
    setAllLoaded(false);
  }, [initialCountries]);

  const handleShowAll = async () => {
    setLoading(true);

    try {
      const res = await fetch(`/api/countries?lang=${lang}`);
      const data = await res.json();
      setCountries(data.countries || []);
      setAllLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.listWrapper} aria-label={t('popularCountries')}>
      <div className={styles.countries}>
        {countries.map(country => (
          <div
            key={country.iso || country.id}
            className={styles.countryItem}
            onClick={() => (window.location.href = `${country.url}`)}
            role="button"
            tabIndex={0}
            aria-label={country.country}
          >
            <CountryElement country={country} />
          </div>
        ))}
      </div>
      {!allLoaded && (
        <button
          className={styles.button}
          onClick={handleShowAll}
          disabled={loading}
          aria-label={t('all_countries')}
        >
          {loading ? '...' : t('all_countries')}
        </button>
      )}
    </section>
  );
};

export default CountryList; 