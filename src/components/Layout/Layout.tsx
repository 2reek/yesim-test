import { FC, ReactNode } from 'react';
import { Header } from '@components/Layout/components/Header';

type Props = {
  children: ReactNode;
};

const Layout: FC<Props> = ({ children }) => {
  return (
    <div className='app-layout'>
      <Header />
      <div className='app-content'>{children}</div>
    </div>
  );
};

export default Layout;
