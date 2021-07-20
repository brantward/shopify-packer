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

  fs.readdirSync(path.join(config.get('theme.src.styles'), 'sections')).forEach(
    (file) => {
      const name = path.parse(file).name;

      if (name.includes('.critical')) {
        const cssFile = path.join(
          config.get('theme.src.styles'),
          'sections',
          `${name}.scss`
        );
        entrypoints[`section.${name}`] = entrypointSettings(cssFile);
      }
    }
  );
  return entrypoints;
};
