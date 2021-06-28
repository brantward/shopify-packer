const PackerConfig = require('../../config');
const config = new PackerConfig(require('../../../packer.schema'));
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

function generateHtmlPlugins(templateDir) {
  // Read files in template directory
  const templateFiles = fs.readdirSync(config.get(`theme.src.${templateDir}`));
  return templateFiles
    .filter((file) => {
      if (file.includes('.liquid')) {
        return true;
      } else {
        return false;
      }
    })
    .map((file) => {
      // Create new HtmlWebpackPlugin with options
      return new HtmlWebpackPlugin({
        filename: path.join(config.get(`theme.dist.${templateDir}`), `${file}`),
        template: path.join(config.get(`theme.src.${templateDir}`), `${file}`),
        inject: false,
        showErrors: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: false,
          preserveLineBreaks: false,
          ignoreCustomFragments: [/{%[-\s]*liquid[\s\S]*?%}/],
          processScripts: ['application/ld+json'],
        },
      });
    });
}

const liquid = {
  plugins: [].concat(
    generateHtmlPlugins('layout'),
    generateHtmlPlugins('templates'),
    generateHtmlPlugins('customers'),
    generateHtmlPlugins('snippets'),
    generateHtmlPlugins('sections')
  ),
};

module.exports = liquid;
