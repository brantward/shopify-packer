const fs = require('fs');
const path = require('path');

const PackerConfig = require('../config');
const config = new PackerConfig(require('../../packer.schema'));
const development = process.env.NODE_ENV !== 'production';

function entrypointSettings(file) {
  if (development) {
    return file;
  } else {
    return {
      import: file,
      filename: `../.ignore/[name]`,
    };
  }
}

module.exports = function () {
  const entrypoints = {};

  fs.readdirSync(path.join(config.get('theme.src.styles'), 'layout')).forEach(
    (file) => {
      const name = path.parse(file).name;

      const cssFile = path.join(
        config.get('theme.src.styles'),
        'layout',
        `${name}.scss`
      );

      if (name.includes('.critical')) {
        entrypoints[`layout.${name}`] = entrypointSettings(cssFile);
      }
    }
  );
  return entrypoints;
};
