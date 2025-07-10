import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import styles from './CountryElement.module.css';
import type { Country } from '@/types';
import AddonIcon from '@assets/icons/addon.svg';

type Props = {
  country: Country;
};

const CountryElement: React.FC<Props> = ({ country }) => {
  const router = useRouter();
  const { t } = useTranslation();

  const priceText = country.classic_info?.price_per_gb
    ? `${t('from')} €${(parseInt(country.classic_info.price_per_gb, 10) / 100).toFixed(2).replace('.', ',')}/GB`
    : '';

  const handleClick = () => {
    router.push(country.url);
  };

  const flagSrc = country.iso ? `/flags/${country.iso.toLowerCase()}.svg` : '/flags/un.svg';

  return (
    <div className={styles.element} onClick={handleClick}>
      <div className={styles.flagWrapper}>
        <Image
          src={flagSrc}
          alt={country.country}
          width={32}
          height={32}
          className={styles.flag}
          loading='lazy'
        />
      </div>
      <div className={styles.info}>
        <div className={styles.name}>{country.country}</div>
        {priceText && <div className={styles.price}>{priceText}</div>}
      </div>
      <Image src={AddonIcon} alt='arrow' className={styles.arrow} />
    </div>
  );
};

export default CountryElement;
