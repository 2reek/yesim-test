import { FC, useState, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { Country } from '../../types';
import CountrySearchDropdown from './CountrySearchDropdown/CountrySearchDropdown';
import styles from './CountrySearch.module.css';

type Props = {
  countries: Country[];
};

const CountrySearch: FC<Props> = ({ countries }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);

  const filteredQuery = useMemo(() => {
    const searchQuery = query.trim().toLowerCase();
    
    if (!searchQuery) return [];
    
    return countries.filter(
      countryElement =>
        countryElement.country.toLowerCase().includes(searchQuery) ||
        (countryElement.iso && countryElement.iso.toLowerCase().includes(searchQuery)) ||
        (Array.isArray(countryElement.search) && countryElement.search.some(element => element.toLowerCase().includes(searchQuery)))
    );
  }, [query, countries]);

  const handleItemClick = (url: string) => {
    window.location.href = url;
  };

  return (
    <div className={styles.searchWrapper}>
      <input
        className={styles.countrySearchInput}
        type="text"
        placeholder={t('search_placeholder')}
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        aria-label={t('search_placeholder')}
      />
      {open && query && (
        <CountrySearchDropdown
          filteredQuery={filteredQuery}
          handleItemClick={handleItemClick}
        />
      )}
    </div>
  );
};

export default CountrySearch; 