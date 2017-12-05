var config = require('../package.json').standard || {};

config.fix = false;

module.exports = {
  cwd: '',
  opts: config
};
