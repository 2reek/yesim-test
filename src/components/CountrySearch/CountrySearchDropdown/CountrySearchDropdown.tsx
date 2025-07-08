import { FC } from 'react';
import { useTranslation } from 'next-i18next';
import { Country } from '../../../types';
import CountryElement from '../../CountryElement/CountryElement';
import styles from './CountrySearchDropdown.module.css';

type Props = {
  filteredQuery: Country[];
  handleItemClick: (url: string) => void;
};

const CountrySearchDropdown: FC<Props> = ({ filteredQuery, handleItemClick }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.countrySearchDropdown} role="listbox">
      {filteredQuery.length > 0 ? (
        filteredQuery.map(countryElement => (
          <div
            key={countryElement.iso || countryElement.id}
            className={styles.dropdownItem}
            onClick={() => handleItemClick(countryElement.url)}
            role="button"
            tabIndex={0}
          >
            <CountryElement country={countryElement} />
          </div>
        ))
      ) : (
        <div className={styles.noResults}>{t('no_results')}</div>
      )}
    </div>
  );
};

export default CountrySearchDropdown; 