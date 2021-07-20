const path = require('path');
const webpack = require('webpack');
const {merge} = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const PackerConfig = require('../../config');
const config = new PackerConfig(require('../../../packer.schema'));
const development = false;
process.env.NODE_ENV = 'production';
const {customConfigCheck} = require('../custom');
const getLayoutEntrypoints = require('../../utilities/get-layout-entrypoints');
const getTemplateEntrypoints = require('../../utilities/get-template-entrypoints');
const getSectionEntrypoints = require('../../utilities/get-section-entrypoints');
const getCritLayoutEntrypoints = require('../../utilities/get-crit-css-layout-entrypoints');
const getCritTemplateEntrypoints = require('../../utilities/get-crit-css-template-entrypoints');
const getCritSectionEntrypoints = require('../../utilities/get-crit-css-section-entrypoints');
config.set('files.layout', getLayoutEntrypoints());
config.set('files.template', getTemplateEntrypoints());
config.set('files.section', getSectionEntrypoints());
config.set('files.crit.layout', getCritLayoutEntrypoints());
config.set('files.crit.template', getCritTemplateEntrypoints());
config.set('files.crit.section', getCritSectionEntrypoints());

// Parts
const core = require('../parts/core');
const css = require('../parts/css');
const scss = require('../parts/scss');
const assets = require('../parts/assets');
const liquid = require('../parts/liquid');
const copy = require('../parts/copy');
const optimization = require('../parts/optimization');
//const liquidStyles = require('../parts/liquid-styles');
const mergeProd = customConfigCheck(config.get('merge.prod'));

core.entry = {
  ...config.get('files.layout'),
  ...config.get('files.template'),
  ...config.get('files.section'),
  ...config.get('files.crit.layout'),
  ...config.get('files.crit.template'),
  ...config.get('files.crit.section'),
  ...config.get('entrypoints'),
};

const output = merge([
  //liquidStyles,
  core,
  assets,
  scss,
  css,
  liquid,
  copy,
  {
    mode: 'production',
    devtool: false,
    optimization: optimization,
    plugins: [
      new CleanWebpackPlugin({
        dry: false,
        dangerouslyAllowCleanPatternsOutsideProject: true,
        cleanOnceBeforeBuildPatterns: [
          path.join(config.get('theme.dist.root'), '/**/*'),
        ],
      }),

      // new MiniCssExtractPlugin({
      //   filename: '[name].css',
      // }),

      new MiniCssExtractPlugin({
        filename: (chunkData) => {
          //console.log(chunkData.chunk);
          const criticalNamespace = '.critical';
          return chunkData.chunk.runtime.includes(criticalNamespace)
            ? `../.ignore/[name].min.css`
            : `[name].min.css`;
        },
      }),

      new webpack.DefinePlugin({
        'process.env': {NODE_ENV: '"production"'},
      }),

      new HtmlWebpackPlugin({
        excludeChunks: ['static'],
        filename: `${config.get('theme.dist.snippets')}/script-tags.liquid`,
        template: path.resolve(__dirname, '../script-tags.webpack'),
        inject: false,
        showErrors: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: false,
          preserveLineBreaks: false,
          ignoreCustomFragments: [/{%[\s\S]*?%}/],
          trimCustomFragments: true,
        },
        isDevServer: development,
        liquidTemplates: config.get('files.template'),
        liquidLayouts: config.get('files.layout'),
      }),

      new HtmlWebpackPlugin({
        excludeChunks: ['static'],
        filename: `${config.get('theme.dist.snippets')}/style-tags.liquid`,
        template: path.resolve(__dirname, '../style-tags.webpack'),
        inject: false,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: false,
          preserveLineBreaks: false,
          ignoreCustomFragments: [/{%[\s\S]*?%}/],
          trimCustomFragments: true,
        },
        isDevServer: development,
        criticalTemplates: config.get('files.crit.template'),
        criticalLayouts: config.get('files.crit.layout'),
        liquidTemplates: config.get('files.template'),
        liquidLayouts: config.get('files.layout'),
      }),
      //new IncludeLiquidStylesPlugin(),
    ],
  },
  mergeProd,
]);

module.exports = output;
