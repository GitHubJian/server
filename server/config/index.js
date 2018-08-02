const NODE_ENV = process.env.NODE_EVN || 'development';
const defaultConfig = require('./default');
const config = require(`./${NODE_ENV}`);

module.exports = Object.assign({}, defaultConfig, config);
