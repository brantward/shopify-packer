const PackerConfig = require('../../config');
const config = new PackerConfig(require('../../../packer.schema'));
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const isDev = process.env.NODE_ENV !== 'production';

function generateHtmlPlugins(templateDir) {
  // Read files in template directory
  const templateFiles = fs.readdirSync(config.get(`theme.src.${templateDir}`));

  const templateContent = function () {
    const files = arguments[0].htmlWebpackPlugin.files;
    const options = arguments[0].htmlWebpackPlugin.options;
    const compilation = arguments[0].compilation;
    let css = '';
    let js = '';

    files.css.forEach(function (chunk) {
      const cssFile = chunk.split('/').reverse()[0];
      const inline = compilation.assets[chunk.substr(files.publicPath.length)]
        .source()
        .trim();
      if (inline.length) {
        if (cssFile.includes('.critical')) {
          css += `<style>${inline}</style>\n`;
        } else {
          css = `<link rel="stylesheet" href="{{ '${cssFile}' | asset_url }}" media="print" onload="this.media='all'">\n<noscript>{{ '${cssFile}' | asset_url | stylesheet_tag }}</noscript>`;
        }
      }
    });
    files.js.forEach(function (chunk) {
      const jsFile = chunk.split('/').reverse()[0];
      const inline = compilation.assets[chunk.substr(files.publicPath.length)]
        .source()
        .trim();
      if (inline.length) {
        if (!jsFile.includes('.critical')) {
          js += `<script src="{{ '${jsFile}' | asset_url }}" defer="defer"></script>\n`;
        }
      }
    });

    const template = fs.readFileSync(options.templatePath, 'utf8');
    return css + js + template;
  };

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
      const chunks = [
        'section.' + file.replace('.liquid', ''),
        'section.' + file.replace('.liquid', '') + '.critical',
      ];

      return new HtmlWebpackPlugin({
        chunks: chunks,
        filename: path.join(config.get(`theme.dist.${templateDir}`), `${file}`),
        template: path.join(config.get(`theme.src.${templateDir}`), `${file}`),
        templatePath: path.join(
          config.get(`theme.src.${templateDir}`),
          `${file}`
        ),
        templateContent: templateContent,
        inject: false,
        showErrors: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: false,
          preserveLineBreaks: true,
          ignoreCustomFragments: [/{%[\s\S]*?%}/],
          trimCustomFragments: false,
          processScripts: ['text/javascript', 'application/ld+json'],
          removeScriptTypeAttributes: true,
        },
      });
    });
}

const liquid = {
  plugins: [].concat(
    generateHtmlPlugins('snippets'),
    generateHtmlPlugins('sections')
  ),
};

module.exports = liquid;
