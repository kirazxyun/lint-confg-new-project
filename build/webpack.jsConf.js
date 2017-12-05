var path = require('path');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = function (config) {
  return {
    module: {
      rules: [{
        test: /\.(js|vue)$/,
        loader: 'standard-loader',
        enforce: 'pre',
        include: [resolve('src')],
        options: {
          fix: false
        }
      }]
    }
  };
};
