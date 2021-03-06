const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const webpack = require('webpack')

const parts = require('./webpack.parts');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
};

const commonConfig = merge([
  {
    // entry: {
    //   app: PATHS.app,
    // },
    output: {
      path: PATHS.build,
      filename: '[name].js',
    },

    //Might not need resolve??
    resolve: {
      extensions: ['.js', 'json', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          query: {
            presets: ['es2015', 'react'],
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            'file-loader',
          ],
        },
      ],
      loaders: [
        {
          test: /\.json$/,
          loader: 'json-loader',
        },
      ],
    },
  },
]);


const productionConfig = merge([
  {
    entry: {
      app: PATHS.app,
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'San Francisco Trains',
      }),
    ],
  },
  parts.extractCSS({ use: 'css-loader' }),
]);


const developmentConfig = merge([
  {
    entry: {
      app: ['react-hot-loader/patch', PATHS.app],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'San Francisco Trains',
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
    ],
  },
  parts.devServer({
    // Customize host/port here if needed
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  parts.loadCSS(),  
]);


module.exports = (env) => {

  process.env.BABEL_ENV = env;  

  if (env === 'production') {
    return merge(commonConfig, productionConfig);
  }
  return merge(commonConfig, developmentConfig);
};