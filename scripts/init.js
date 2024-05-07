const prompts = require('prompts');
const kleur = require('kleur');
const path = require('path');
const fs = require('fs');
const PackageJson = require('@npmcli/package-json');

const ROOT_FOLDER = path.join(__dirname, '../');
const COMPONENTS_FOLDER = path.join(__dirname, '../src/components');
const STYLES_FOLDER = path.join(__dirname, '../src/styles');
const UTILS_FOLDER = path.join(__dirname, '../src/utils');
const QUERIES_FOLDER = path.join(__dirname, '../src/queries');

const moveComponents = (name, toMove, toDelete) => {
  // Move components to top folder
  fs.readdirSync(path.join(COMPONENTS_FOLDER, name)).forEach(file => {
    toMove.push({
      from: path.join(COMPONENTS_FOLDER, name, file),
      to: COMPONENTS_FOLDER
    });
    toDelete.push(path.join(COMPONENTS_FOLDER, name));
  });
};

(async () => {
  console.log(path.join(ROOT_FOLDER, 'package.json'));
  const pkgJson = await PackageJson.load(path.join(ROOT_FOLDER));
  const response = await prompts([
    {
      type: 'text',
      name: 'name',
      message: 'What is the name of this project?',
      hint: 'No spaces, no capitals',
      validate: value => {
        // No spaces
        if (value.includes(' ')) return 'No spaces';

        // No capitals
        if (value.toLowerCase() !== value) return 'No capitals';

        // Valid
        return true;
      }
    },
    {
      type: 'multiselect',
      name: 'functionalities',
      message: 'Select functionality',
      choices: [
        { title: 'graphql', value: 'GraphQL' },
        { title: 'nike', value: 'Nike' },
        { title: 'xr8', value: '8th Wall' }
      ],
      hint: '- Space to select. Return to submit',
      instructions: null
    },
    {
      type: prev => (prev.includes('xr8') ? 'text' : null),
      name: 'xr8Key',
      message: 'What is 8th Wall key for this project?'
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Are you sure you want to delete files?',
      validate: value => !!value
    }
  ]);

  const toDelete = [];
  const toMove = [];
  const keys = {};

  if (!response.functionalities.includes('graphql')) {
    // delete graphql specific fildes
    toDelete.push(QUERIES_FOLDER);
    toDelete.push(path.join(ROOT_FOLDER, 'codegen.yml'));
  }

  if (!response.functionalities.includes('nike')) {
    // delete nike specific folders
    toDelete.push(path.join(COMPONENTS_FOLDER, 'nike'));
    toDelete.push(path.join(STYLES_FOLDER, 'nike'));
  } else {
    moveComponents('nike', toMove, toDelete);
  }

  if (!response.functionalities.includes('xr8')) {
    // delete XR8 specific folders
    toDelete.push(path.join(COMPONENTS_FOLDER, 'xr8'));
    toDelete.push(path.join(STYLES_FOLDER, 'xr8'));
    toDelete.push(path.join(UTILS_FOLDER, 'xr8.ts'));
  } else {
    // Move components
    moveComponents('xr8', toMove, toDelete);

    // Add 8th Wall key to env
    keys['NEXT_PUBLIC_8TH_WALL_KEY'] = response.xr8Key;
  }

  if (!response.confirm) {
    console.info(kleur.yellow('Dry mode, not writting/deleting files...'));
    console.info(response);
    console.info({ toDelete, toMove, keys });
    return;
  }

  // Move files
  toMove.forEach(move => {
    try {
      fs.renameSync(move.from, move.to);
    } catch (e) {
      console.error(kleur.red(`Error while moving file: ${move.from}`));
    }
  });

  // Delete files
  toDelete.forEach(file => {
    try {
      const stats = fs.lstatSync(path_string);

      if (stats.isDirectory()) {
        console.info(`Deleting directory: ${file}`);
        fs.rmSync(file, { recursive: true, force: true });
      } else if (stats.isFile()) {
        console.info(`Deleting file: ${file}`);
        fs.unlinkSync(file);
      }
    } catch (e) {
      console.error(kleur.red(`Error while deleting file: ${file}`));
    }
  });

  // Rename name in package json
  pkgJson.update({
    name: response.name
  });
  await pkgJson.save();

  // add keys
  if (Object.keys(keys).length > 0) {
    const keysToAdd = Object.keys(keys)
      .map(key => `${key}=${keys[key]}`)
      .join('\n');

    const original = fs
      .readFileSync(path.join(ROOT_FOLDER, '.env.example'))
      .toString('utf8');
    const newKeys = [original, keysToAdd].join('\n');

    fs.writeFileSync(path.join(ROOT_FOLDER, '.env.example'), newKeys);
    console.info('Written key(s) to .env.example');
  }

  // Copy .env.example to .env
  if (!fs.existsSync(path.join(ROOT_FOLDER, '.env'))) {
    fs.copyFileSync(
      path.join(ROOT_FOLDER, '.env.example'),
      path.join(ROOT_FOLDER, '.env')
    );
    console.info('Created .env file from example');
  }

  // And done
  console.info(kleur.green('Project init script ran successfully'));
})();
