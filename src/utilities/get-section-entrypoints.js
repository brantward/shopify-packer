const fs = require('fs');
const path = require('path');

const PackerConfig = require('../config');
const config = new PackerConfig(require('../../packer.schema'));

module.exports = function () {
  const entrypoints = {};

  fs.readdirSync(config.get('theme.src.sections')).forEach((file) => {
    const name = path.parse(file).name;
    if (!name.includes('.critical')) {
      const jsFile = path.join(
        config.get('theme.src.scripts'),
        'sections',
        `${name}.js`
      );
      if (fs.existsSync(jsFile)) {
        entrypoints[`section.${name}`] = jsFile;
      }
    }
  });
  return entrypoints;
};
