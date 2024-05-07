const depcheck = require('depcheck');
const fs = require('fs');
const path = require('path');
const kleur = require('kleur');

const IGNORE = [
  'husky',
  '@svgr/webpack',
  'cross-env',
  'url-loader',
  'raw-loader',
  'file-loader',
  '@testing-library/jest-dom',
  '@testing-library/react',
  'jest',
  'classnames'
];

const getDirectories = source =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

// fix absolute imports in nextjs
getDirectories(path.join(__dirname, '../src')).forEach(folder =>
  IGNORE.push(folder)
);

const options = {
  ignoreBinPackage: false, // ignore the packages with bin entry
  skipMissing: false, // skip calculation of missing dependencies
  ignorePatterns: [
    // files matching these patterns will be ignored
    'dist',
    'build',
    'out',
    'proto',
    'deploy',
    'coverage',
    'runtime',
    'storybook-static',
    '*.d.ts',
    '.storybook/*.js'
  ],
  ignoreMatches: [
    '@types/*',
    '@storybook/*',
    '@components/*',
    '@utils/*',
    '@assets/*',
    '@hooks/*',
    '@pages/*',
    '@graphql-codegen/*'
  ],
  parsers: {
    // the target parsers
    '**/preview.js': depcheck.parser.jsx,
    '**/*.js': depcheck.parser.es6,
    '**/*.jsx': depcheck.parser.jsx,
    '**/*.ts': depcheck.parser.typescript,
    '**/*.tsx': depcheck.parser.typescript
  },
  detectors: [
    // the target detectors
    depcheck.detector.requireCallExpression,
    depcheck.detector.importDeclaration
  ],
  specials: [
    // the target special parsers
    depcheck.special.eslint,
    depcheck.special.tslint,
    depcheck.special.husky,
    depcheck.special.prettier,
    depcheck.special.jest,
    depcheck.special['lint-staged']
  ]
};

depcheck(process.cwd(), options).then(unused => {
  let hasError = false;

  [...unused.dependencies, ...unused.devDependencies].forEach(depName => {
    if (!IGNORE.includes(depName)) {
      console.info(
        `Unused dependency ${kleur
          .bold()
          .blue(depName)} detected in the package.json. \n${kleur.grey(
          'Remove it from the list, or ignore it in scripts/unused-dependencies.js'
        )}`
      );

      hasError = true;
    }
  });

  Object.keys(unused.missing).forEach(depName => {
    if (!IGNORE.includes(depName)) {
      console.info(
        `Dependency ${kleur
          .bold()
          .yellow(depName)} is missing in the package.json`
      );

      hasError = true;
    }
  });

  Object.keys(unused.invalidFiles).forEach(fileName => {
    console.info(
      `${kleur
        .bold()
        .kleur.red(
          fileName
        )} can not be read while trying to detect the dependencies`
    );

    hasError = true;
  });

  if (hasError) {
    process.exit(1);
  }
});
