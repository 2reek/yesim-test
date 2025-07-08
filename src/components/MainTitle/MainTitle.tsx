import { FC } from 'react';
import styles from './MainTitle.module.css';

type Props = {
  text: string;
};

const MainTitle: FC<Props> = ({ text }) => {
  return <h1 className={styles.title}>{text}</h1>;
};

export default MainTitle;
