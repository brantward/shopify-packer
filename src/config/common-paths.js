const path = require('path');
const os = require('os');

module.exports = {
  root: process.cwd(),
  package: (config) => path.join(config.get('root'), 'package.json'),
  commonExcludes: [/node_modules/, /assets\/static/, /\.gitkeep$/],
  cache: (config) => path.join(config.get('root'), '.cache'),
  'packer.config': (config) =>
    path.join(config.get('root'), 'packer.config.js'),
  'packer.env': (config) => path.join(config.get('root'), 'packer.env.json'),

  /* Webpack merge files - https://www.npmjs.com/package/webpack-merge */
  'merge.dev': (config) => path.join(config.get('root'), 'dev.config.js'),
  'merge.prod': (config) => path.join(config.get('root'), 'prod.config.js'),

  /* PostCSS */
  postcss: (config) => path.join(config.get('root'), 'postcss.config.js'),

  /* Theme path settings */
  /* src folder */
  'theme.src.assets': (config) =>
    path.join(config.get('theme.src.root'), 'assets'),
  'theme.src.scripts': (config) =>
    path.join(config.get('theme.src.root'), 'scripts'),
  'theme.src.styles': (config) =>
    path.join(config.get('theme.src.root'), 'styles'),
  'theme.src.layout': (config) =>
    path.join(config.get('theme.src.root'), 'layout'),
  'theme.src.locales': (config) =>
    path.join(config.get('theme.src.root'), 'locales'),
  'theme.src.templates': (config) =>
    path.join(config.get('theme.src.root'), 'templates'),
  'theme.src.customers': (config) =>
    path.join(config.get('theme.src.root'), 'templates/customers'),
  'theme.src.sections': (config) =>
    path.join(config.get('theme.src.root'), 'sections'),
  'theme.src.snippets': (config) =>
    path.join(config.get('theme.src.root'), 'snippets'),
  'theme.src.config': (config) =>
    path.join(config.get('theme.src.root'), 'config'),
  'theme.src.root': (config) => path.join(config.get('root'), './src'),

  /* dist folder */
  'theme.dist.assets': (config) =>
    path.join(config.get('theme.dist.root'), 'assets'),
  'theme.dist.scripts': (config) =>
    path.join(config.get('theme.dist.root'), 'scripts'),
  'theme.dist.styles': (config) =>
    path.join(config.get('theme.dist.root'), 'styles'),
  'theme.dist.layout': (config) =>
    path.join(config.get('theme.dist.root'), 'layout'),
  'theme.dist.locales': (config) =>
    path.join(config.get('theme.dist.root'), 'locales'),
  'theme.dist.templates': (config) =>
    path.join(config.get('theme.dist.root'), 'templates'),
  'theme.dist.customers': (config) =>
    path.join(config.get('theme.dist.root'), 'templates/customers'),
  'theme.dist.sections': (config) =>
    path.join(config.get('theme.dist.root'), 'sections'),
  'theme.dist.snippets': (config) =>
    path.join(config.get('theme.dist.root'), 'snippets'),
  'theme.dist.config': (config) =>
    path.join(config.get('theme.dist.root'), 'config'),
  'theme.dist.root': (config) => path.join(config.get('root'), './dist'),
};
