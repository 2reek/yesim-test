import { FC } from 'react';
import Image from 'next/image';
import { YesimLogoIcon } from '@assets/icons';
import { LangsSwitcher } from '@components/Layout/components/LangsSwitcher';
import styles from './Header.module.css';

const Header: FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.wrapper}>
        <Image src={YesimLogoIcon} alt='yesim logo' className={styles.logo} />
        <LangsSwitcher />
      </div>
    </header>
  );
};

export default Header;
