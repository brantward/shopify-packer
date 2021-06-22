const fs = require('fs');
const path = require('path');

const PackerConfig = require('../config');
const config = new PackerConfig(require('../../packer.schema'));
const development = process.env.NODE_ENV !== 'production';

const VALID_LIQUID_TEMPLATES = [
  '404',
  'article',
  'blog',
  'cart',
  'collection',
  'account',
  'activate_account',
  'addresses',
  'login',
  'order',
  'register',
  'reset_password',
  'gift_card',
  'index',
  'list-collections',
  'page',
  'password',
  'product',
  'search',
];

function isValidTemplate(filename) {
  const name = VALID_LIQUID_TEMPLATES.some((template) =>
    filename.startsWith(`${template}.`)
  );
  return Boolean(name);
}

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

  fs.readdirSync(
    path.join(config.get('theme.src.styles'), 'templates')
  ).forEach((file) => {
    const name = path.parse(file).name;
    const cssFile = path.join(
      config.get('theme.src.styles'),
      'templates',
      `${name}.scss`
    );

    if (isValidTemplate(file) && name.includes('.critical')) {
      entrypoints[`template.${name}`] = entrypointSettings(cssFile);
    }
  });

  fs.readdirSync(
    path.join(config.get('theme.src.styles'), 'templates/customers')
  ).forEach((file) => {
    const name = `${path.parse(file).name}`;
    const cssFile = path.join(
      config.get('theme.src.styles'),
      'templates',
      'customers',
      `${name}.scss`
    );

    if (isValidTemplate(file) && name.includes('.critical')) {
      entrypoints[`template.${name}`] = entrypointSettings(cssFile);
    }
  });

  return entrypoints;
};
