import { FC, useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Country } from '../../../../types';
import { countriesCache, CACHE_DURATION } from '../../../../utils';
import { CountryElement } from '../CountryElement';
import styles from './CountryList.module.css';

type Props = {
  initialCountries: Country[];
};

const CountryList: FC<Props> = ({ initialCountries }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [countries, setCountries] = useState<Country[]>(initialCountries);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allLoaded, setAllLoaded] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const shouldShowButton = !allLoaded && countries.length > 0 && !loading;
  const shouldShowLoading = loading && countries.length > 0;

  const fetchWithCache = async (
    url: string,
    lang: string,
    forceRefresh: boolean = false,
  ): Promise<Country[]> => {
    const cacheKey = `${url}_${lang}`;
    const cached = countriesCache.get(cacheKey);

    if (!forceRefresh && cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    // await new Promise(resolve => setTimeout(resolve, 100));

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.countries) {
      countriesCache.set(cacheKey, {
        data: data.countries,
        timestamp: Date.now(),
      });
      return data.countries;
    } else {
      throw new Error('Invalid response format');
    }
  };

  const loadPopularCountries = useCallback(
    async (lang: string) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setLoading(true);
      setError(null);

      try {
        const url = `/api/get-popular-countries?lang=${lang}&t=${Date.now()}`;
        const countriesData = await fetchWithCache(url, lang);

        setCountries(countriesData);
        setAllLoaded(false);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        setError(t('failedToLoadCountries'));
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [t],
  );

  const loadAllCountries = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const cacheKey = `/api/get-all-countries_${router.locale || 'en'}`;
      countriesCache.delete(cacheKey);

      const url = `/api/get-all-countries?lang=${router.locale || 'en'}&t=${Date.now()}`;

      const countriesData = await fetchWithCache(url, router.locale || 'en', true);

      setCountries(countriesData);
      setAllLoaded(true);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setError(t('failedToLoadCountries'));
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleShowAll = () => {
    if (!allLoaded) {
      loadAllCountries();
    }
  };

  useEffect(() => {
    const currentLang = router.locale || 'en';
    const cacheKey = `/api/get-popular-countries_${currentLang}`;
    const cached = countriesCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setCountries(cached.data);
      setAllLoaded(false);
      return;
    }

    loadPopularCountries(currentLang);
  }, [router.locale, loadPopularCountries]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  if (countries.length === 0 && !error && !loading) {
    loadPopularCountries(router.locale || 'en');
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          {error}
          <button
            onClick={() => loadPopularCountries(router.locale || 'en')}
            className={styles.retryButton}
          >
            {t('retry')}
          </button>
        </div>
      </div>
    );
  }

  if (loading && countries.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {countries.map(country => (
          <CountryElement key={country.id} country={country} />
        ))}
      </div>

      {shouldShowButton && (
        <button onClick={handleShowAll} className={styles.showAllButton} disabled={loading}>
          {loading ? t('loading') : t('showAllCountries')}
        </button>
      )}

      {shouldShowLoading && <div className={styles.loading}>{t('loading')}</div>}
    </div>
  );
};

export default CountryList;
