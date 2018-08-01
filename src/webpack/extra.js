const { pathConfig } = require('./config');

const webpackConfig = {
    entry: Object.assign({ global: pathConfig.global }, entry),
    output,
    resolve,
    resolveLoader,
    performance,
    stats
};

module.exports = { webpackConfig };
