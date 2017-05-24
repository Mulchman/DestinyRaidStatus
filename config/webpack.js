const webpack = require('webpack');

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
// const Visualizer = require('webpack-visualizer-plugin');

const NotifyPlugin = require('notify-webpack-plugin');

const ASSET_NAME_PATTERN = 'static/[name]-[hash:6].[ext]';

const packageJson = require('../package.json');
const configJson = require('../apiKey.json');
const nodeModulesDir = path.join(__dirname, '../node_modules');

// https://github.com/dmachat/angular-webpack-cookbook/wiki/Optimizing-Development
const preMinifiedDeps = [
  'messageformat/messageformat.min.js'
];

module.exports = (env) => {
  const isDev = env === 'dev';
  const version = packageJson.version.toString();
  const apiKey = configJson.apiKey.toString();
  // const apiKey = configJson.apiKeyServerWeb.toString();
  // const apiKey = configJson.apiKeyServerDev.toString();

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
          loader: 'url-loader',
          options: {
            limit: 5 * 1024, // only inline if less than 5kb
            name: ASSET_NAME_PATTERN
          }
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

      noParse: [
        /\/jquery\.slim\.min\.js$/,
        /\/sql\.js$/
      ]
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
        { from: './app/.htaccess' },
        { from: './app/extension-scripts/main.js', to: 'extension-scripts/' },
        { from: './app/manifest.json' },
        { from: `./icons/` }
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
      //new Visualizer(),
    ],

    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    }
  };

  // Run through big deps and extract the first part of the path,
  // as that is what you use to require the actual node modules
  // in your code. Then use the complete path to point to the correct
  // file and make sure webpack does not try to parse it
  preMinifiedDeps.forEach(function(dep) {
    var depPath = path.resolve(nodeModulesDir, dep);
    config.resolve.alias[dep.split(path.sep)[0]] = depPath;
    config.module.noParse.push(new RegExp(depPath));
  });

  if (!isDev) {
    // Bail and fail hard on first error
    // config.bail = true;
    // config.stats = 'verbose';

    // The sql.js library doesnt work at all (reports no tables) when minified,
    // so we exclude it from the regular minification
    // FYI, uglification runs on final chunks rather than individual modules
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      output: { comments: false },
      sourceMap: true
    }));
  }

  return config;
};