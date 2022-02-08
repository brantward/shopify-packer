const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isDev = process.env.NODE_ENV !== 'production';

const part = {
  module: {
    rules: [],
  },
  plugins: [],
};

const sassRule = {
  test: /\.s[ac]ss$/,
};

const cssLoader = {
  loader: 'css-loader',
  options: {
    importLoaders: 2,
    sourceMap: isDev,
  },
};

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    sourceMap: isDev,
    implementation: require('postcss'),
  },
};

const sassLoader = {
  loader: 'sass-loader',
  options: {
    sourceMap: isDev,
    implementation: require('sass'),
    sassOptions: {},
  },
};

sassRule.use = [
  MiniCssExtractPlugin.loader,
  cssLoader,
  postcssLoader,
  sassLoader,
];

part.module.rules.push(sassRule);

module.exports = part;
