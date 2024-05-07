const { withSentryConfig } = require('@sentry/nextjs');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

if (
  process.env.NODE_ENV === 'production' &&
  (!process.env.SENTRY_DSN ||
    !process.env.SENTRY_ORG ||
    !process.env.SENTRY_PROJECT ||
    !process.env.SENTRY_AUTH_TOKEN)
) {
  console.warn(
    'Sentry environment variables not set, ensure the following ones are set: "SENTRY_DSN, SENTRY_ORG, SENTRY_PROJECT, SENTRY_AUTH_TOKEN"'
  );
}

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    unoptimized: true
  },
  reactStrictMode: false,
  swcMinify: true,
  trailingSlash: true,
  pageExtensions: ['tsx'],
  publicRuntimeConfig: {
    buildEnv: process.env.BUILD_ENV || 'development',
    sentryDSN: process.env.SENTRY_DSN
  },
  webpack(config, { webpack, isServer, buildId, dev }) {
    // SVG React components import support
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: [{ name: 'removeViewBox', active: false }]
            }
          }
        },
        'url-loader'
      ]
    });

    // Graphql file import support
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      use: ['raw-loader']
    });

    // Animation file import support
    config.module.rules.push({
      test: /\.(glb|mp4)$/,
      exclude: /node_modules/,
      type: 'asset',
      generator: {
        filename: 'static/media/[path][name].[hash][ext]'
      }
    });

    // Shader file import support
    config.module.rules.push({
      test: /\.glsl$/,
      exclude: /node_modules/,
      use: ['raw-loader']
    });

    return config;
  }
};

// Analyze bundles
const bundleConfig = withBundleAnalyzer(nextConfig);

// Adds Sentry to bundle
const sentryConfig = withSentryConfig(
  bundleConfig,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,

    org: process.env.SENTRY_ORG || 'omm-pi',
    project: process.env.SENTRY_PROJECT
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    // tunnelRoute: '/monitoring',

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true
  }
);

const sentryBranches = ['develop', 'main'];
const releaseInSentry =
  process.env.ANALYZE !== 'true' &&
  sentryBranches.includes(process.env.BITBUCKET_BRANCH);

if (releaseInSentry) {
  console.info('Sentry release will be created');
}

module.exports = releaseInSentry ? sentryConfig : bundleConfig;
