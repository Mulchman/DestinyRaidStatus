const webpack = require('webpack');

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const NotifyPlugin = require('notify-webpack-plugin');
// const Visualizer = require('webpack-visualizer-plugin');

const packageJson = require('../package.json');
const configJson = require('../apiKey.json');

module.exports = (env) => {
  const isDev = env === 'dev';
  const version = packageJson.version.toString();
  // const apiKey = configJson.apiKey.toString();
  // const apiKey = configJson.apiKeyServerWeb.toString();
  const apiKey = configJson.apiKeyServerDev.toString();

  const config = {
    entry: {
      main: './app/index.js'
    },

    output: {
      path: path.resolve('./dist'),
      filename: '[name]-[chunkhash:6].js',
      chunkFilename: 'chunk-[id]-[name]-[chunkhash:6].js'
    },

    devServer: {
      contentBase: path.resolve(__dirname, './app'),
      publicPath: '/',
      https: true,
      host: '0.0.0.0',
      hot: false,
      historyApiFallback: {
        index: '/index.html'
      }
    },

    devtool: 'source-map',

    stats: 'errors-only',

    performance: {
      hints: false
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            'babel-loader'
          ]
        }, {
          test: /\.json$/,
          loader: 'json-loader'
        }, {
          test: /\.html$/,
          use: [
            'raw-loader',
            'extract-loader',
            'html-loader'
          ]
        }, {
          test: /\.(png|eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
          loader: 'url-loader'
        }, {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract({
            use: [
              'css-loader',
              'postcss-loader',
              'sass-loader'
            ],
            fallback: 'style-loader'
          })
        }
      ],
    },

    resolve: {
      extensions: ['.js', '.json'],
      alias: {
        app: path.resolve('./app')
      }
    },

    plugins: [
      new CleanWebpackPlugin(['dist'], {
        root: path.resolve('./')
      }),

      new NotifyPlugin('DRS', !isDev),

      new ExtractTextPlugin('styles-[contenthash:6].css'),

      new HtmlWebpackPlugin({
        inject: false,
        filename: 'index.html',
        template: '!handlebars-loader!app/index.html'
      }),

      new CopyWebpackPlugin([
        // Web app stuff
        { from: './app/.htaccess' },
        { from: `./icons/` },
        // Chrome extension stuff
        { from: './app/extension-scripts/background.js', to: 'chrome-extension/' },
        { from: './app/extension-scripts/content-destinyraidstatus.js', to: 'chrome-extension/' },
        { from: './app/extension-scripts/content-destinylfg.js', to: 'chrome-extension/' },
        { from: './app/extension-scripts/manifest.json', to: 'chrome-extension/' },
        { from: `./icons/`, to: 'chrome-extension/' },
      ]),

      // Optimize chunk IDs
      new webpack.optimize.OccurrenceOrderPlugin(true),

      new webpack.DefinePlugin({
        $DRS_VERSION: JSON.stringify(version),
        $DRS_FLAVOR: JSON.stringify(env),
        $DRS_API_KEY: JSON.stringify(apiKey)
      }),

      new LodashModuleReplacementPlugin({
        shorthands: true,
        // cloning: true,
        // currying: true,
        // caching: true,
        collections: true,
        exotics: true,
        guards: true,
        // metadata: true,
        deburring: true,
        unicode: true,
        chaining: true,
        // memoizing: true,
        // coercions: true,
        flattening: true,
        paths: true,
        placeholders: true
      }),

      // Enable if you want to debug the size of the chunks
      // new Visualizer(),
    ],

    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    }
  };

  return config;
};