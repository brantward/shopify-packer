const webpack = require('webpack');
const chalk = require('chalk');
const ora = require('ora');
const {writeFileSync} = require('fs');
const spinner = ora(chalk.magenta('Compiling...'));

module.exports = () => {
  let config = require('../../src/webpack/config/dev.config');

  spinner.start();

  webpack(config, (err, stats) => {
    if (err) throw err;

    spinner.stop();

    if (stats.compilation.errors.length) throw Error('Compile errors');

    console.log('Webpack updated');
  });
};
