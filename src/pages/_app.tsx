import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { Layout } from '@components/Layout';
import '@styles/globals.css';

const YesimApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default appWithTranslation(YesimApp);
