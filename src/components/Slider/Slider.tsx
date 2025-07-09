import { FC } from 'react';
import { useTranslation } from 'next-i18next';
import styles from './Slider.module.css';

export interface SlideItem {
  id: string | number;
  title: string;
}

type Props = {
  title: string;
  itemCount?: number;
  itemTitleKey?: string;
};

const Slider: FC<Props> = ({ title, itemCount = 3, itemTitleKey = 'longTitle' }) => {
  const { t } = useTranslation();

  const sliderItems: SlideItem[] = Array.from({ length: itemCount }, (_, index) => ({
    id: index + 1,
    title: t(itemTitleKey),
  }));

  return (
    <section className={styles.sliderSection}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.sliderContainer}>
        {sliderItems.map(item => (
          <div key={item.id} className={styles.sliderCard}>
            <h3 className={styles.sliderCardTitle}>{item.title}</h3>
            <div className={styles.sliderPlaceholder} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Slider;
