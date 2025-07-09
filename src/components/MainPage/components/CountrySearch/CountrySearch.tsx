import { FC, useState, useMemo, useRef, useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Country } from '../../../../types';
import { CountrySearchDropdown } from '../CountrySearchDropdown';
import { fetchCountriesFromExternalAPI } from '../../../../utils/api-helpers';
import styles from './CountrySearch.module.css';

const CountrySearch: FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [query, setQuery] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fetchedRef = useRef<boolean>(false);

  const loadAllCountries = useCallback(async () => {
    if (fetchedRef.current) return;
    setIsLoading(true);
    try {
      const countries = await fetchCountriesFromExternalAPI(router.locale || 'en');
      setAllCountries(countries);
      fetchedRef.current = true;
    } catch (error) {
      console.error('Failed to load countries for search', error);
    } finally {
      setIsLoading(false);
    }
  }, [router.locale]);

  const filteredQuery = useMemo(() => {
    const searchQuery = query.trim().toLowerCase();
    if (!searchQuery) return [];

    return allCountries.filter(
      countryElement =>
        countryElement.country.toLowerCase().includes(searchQuery) ||
        (countryElement.iso && countryElement.iso.toLowerCase().includes(searchQuery)) ||
        (Array.isArray(countryElement.search) &&
          countryElement.search.some(element => element.toLowerCase().includes(searchQuery))),
    );
  }, [query, allCountries]);

  const handleItemClick = (country: Country) => {
    router.push(country.url);
    setOpen(false);
    setQuery('');
  };

  const handleFocus = () => {
    setOpen(true);
    if (!fetchedRef.current) {
      loadAllCountries();
    }
  };

  return (
    <div className={styles.searchWrapper}>
      <input
        className={styles.countrySearchInput}
        type='text'
        placeholder={isLoading ? t('loading') : t('search_placeholder')}
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={handleFocus}
        onBlur={() => {
          setTimeout(() => setOpen(false), 150);
        }}
        aria-label={t('search_placeholder')}
        disabled={isLoading}
      />
      {open && query && (
        <CountrySearchDropdown filteredQuery={filteredQuery} handleItemClick={handleItemClick} />
      )}
    </div>
  );
};

export default CountrySearch;
