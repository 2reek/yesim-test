import { FC, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { AddonIcon } from '../../../../assets/icons';
import LangsSelectDropdown from '../LangsSelectDropdown/LangsSelectDropdown';
import styles from './LangsSwitcher.module.css';

const LANGS = [
  { code: 'en', label: 'ENG' },
  { code: 'ru', label: 'RU' },
];

const LangsSwitcher: FC = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleLangClick = () => setOpen(isOpen => !isOpen);
  const handleLangSelect = () => setOpen(false);

  return (
    <div
      className={styles.lang}
      tabIndex={0}
      aria-label='Language switcher'
      role='button'
      onClick={handleLangClick}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleLangClick()}
    >
      {LANGS.find(lang => lang.code === i18n.language)?.label || 'ENG'}

      <Image src={AddonIcon} alt='switch icon' className={styles.switchIcon} />

      {open && <LangsSelectDropdown langs={LANGS} onSelect={handleLangSelect} />}
    </div>
  );
};

export default LangsSwitcher;
