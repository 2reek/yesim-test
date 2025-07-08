import React from 'react';
import Image from 'next/image';
import styles from './CountryElement.module.css';
import { Country } from '../../types';
import AddonIcon from '../../assets/icons/addon.svg';

type Props = {
  country: Country;
};

const CountryElement: React.FC<Props> = ({ country }) => {
  const priceText = country.classic_info?.price_per_gb
    ? `от €${(parseInt(country.classic_info.price_per_gb, 10) / 100).toFixed(2).replace('.', ',')}/GB`
    : '';

  return (
    <div className={styles.element}>
      <div className={styles.flagWrapper}>
        <Image
          src={country.iso ? `/flags/${country.iso.toLowerCase()}.svg` : '/flags/un.svg'}
          alt={country.country}
          width={32}
          height={32}
          className={styles.flag}
          loading="lazy"
        />
      </div>
      <div className={styles.info}>
        <div className={styles.name}>{country.country}</div>
        {priceText && <div className={styles.price}>{priceText}</div>}
      </div>
      <Image src={AddonIcon} alt="arrow" className={styles.arrow} />
    </div>
  );
};

export default CountryElement; 