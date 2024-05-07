const fs = require('fs');
const path = require('path');

const ASSET_FOLDER = path.join(__dirname, '../src/assets');

const SCAN_FOLDERS = ['images/results', 'images/questions', 'animations'];

const SUPPORTED_TYPES = ['.png', '.mp4', '.json'];

const filenameSafe = file => {
  const name = path.parse(file).name;
  return name.replace('-', '_').replace(' ', '');
};

const scanFolder = name => {
  const files = [];
  fs.readdirSync(path.join(ASSET_FOLDER, name)).forEach(file => {
    if (SUPPORTED_TYPES.includes(path.parse(file).ext)) {
      files.push(file);
    }
  });

  const importPart = files
    .map(
      file => `export { default as ${filenameSafe(file)} } from './${file}';\n`
    )
    .join('');

  fs.writeFileSync(path.join(ASSET_FOLDER, name, 'index.ts'), importPart);
};

SCAN_FOLDERS.forEach(folder => scanFolder(folder));
