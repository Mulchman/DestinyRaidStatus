// const webpack = require('webpack');
const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.common.js');

module.exports = (env) => {
  const common = CommonConfig(env);

  return Merge(common, {
    // TODO: dev settings
  });
};