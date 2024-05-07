import type { AppProps } from 'next/app';

import useGARouterTracking from '@hooks/useGARouterTracking';
import ErrorBoundary from '@components/ErrorBoundary';

import '../src/styles/global.scss';

const MyApp = ({ Component, pageProps }: AppProps) => {
  useGARouterTracking();

  // show error screen on prod
  if (process.env.NODE_ENV === 'production') {
    return (
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    );
  }

  return <Component {...pageProps} />;
};

export default MyApp;
