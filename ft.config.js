'use strict';

var path = require('path');
var merge = require('webpack-merge');
var serversConfig = require('./build/servers.conf');
var lintConfig = require('./build/lint.conf');
var webpackJsConfig = require('./build/webpack.jsConf');
var webpackCssConfig = require('./build/webpack.cssConf');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  servers: serversConfig,

  lint: lintConfig,

  config: function () {
    return {
      webpackConfig: function (jsConfig, cssConfig, options, node_env) {
        return {
          jsConfig: merge(jsConfig, webpackJsConfig(jsConfig)),
          cssConfig: merge(cssConfig, webpackCssConfig(cssConfig))
        };
      },

      exports: [
        "main.js"
      ]
    };
  }
};
