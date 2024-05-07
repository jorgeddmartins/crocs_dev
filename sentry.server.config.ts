// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: publicRuntimeConfig.sentryDSN,
    maxBreadcrumbs: 50,
    tracesSampleRate: publicRuntimeConfig.buildEnv === 'production' ? 1 : 0.1,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false
  });
}
