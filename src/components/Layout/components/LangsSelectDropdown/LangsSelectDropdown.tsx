import { FC } from 'react';
import { useRouter } from 'next/router';
import styles from './LangsSelectDropdown.module.css';

type Lang = {
  code: string;
  label: string;
};

type Props = {
  langs: Lang[];
  onSelect: (code: string) => void;
};

const LangsSelectDropdown: FC<Props> = ({ langs, onSelect }) => {
  const router = useRouter();

  const handleLangSelect = (code: string) => {
    onSelect(code);
    router.push(router.asPath, router.asPath, { locale: code });
  };

  return (
    <div className={styles.langDropdown} role='menu'>
      {langs.map(lang => (
        <div
          key={lang.code}
          className={styles.langOption}
          tabIndex={0}
          role='menuitem'
          aria-label={lang.label}
          onClick={e => {
            e.stopPropagation();
            handleLangSelect(lang.code);
          }}
        >
          {lang.label}
        </div>
      ))}
    </div>
  );
};

export default LangsSelectDropdown;
