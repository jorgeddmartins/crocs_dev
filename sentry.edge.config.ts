// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
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
