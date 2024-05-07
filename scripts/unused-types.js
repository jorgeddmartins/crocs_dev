const path = require('path');
const kleur = require('kleur');
const analyzeTsConfig = require('ts-unused-exports').default;

const result = analyzeTsConfig(path.join(process.cwd(), 'tsconfig.json'));

let hasError = false;

Object.keys(result).forEach(pathName => {
  const error = result[pathName];
  const relativePath = kleur.underline(path.relative(process.cwd(), pathName));
  const errors = error
    .filter(error => {
      // instead of adding exceptions here, you can also use:
      // ts-unused-exports:disable-next-line

      if (pathName.includes('pages/') && error.exportName === 'default') {
        return false;
      }
      if (pathName.includes('utils/math.ts')) {
        return false;
      }
      if (
        pathName.includes('pages/') &&
        (error.exportName === 'getStaticProps' ||
          error.exportName === 'getServerSideProps')
      ) {
        return false;
      }
      if (pathName.includes('.stories')) {
        return false;
      }

      return true;
    })
    .map(
      error =>
        `${kleur.bold().red(error.exportName)}(${kleur.grey(
          error.location.line
        )})`
    );

  if (errors.length > 0) {
    hasError = true;
    console.info(`Unused exports for ${relativePath}: ${errors.join(', ')}`);
  }
});

if (hasError) {
  process.exit(1);
}
