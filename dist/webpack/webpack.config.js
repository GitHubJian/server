const { isDevelopment } = require('./config');
const rules = require('./rules');
const plugins = require('./plugins');
const { webpackConfig: extra } = require('./extra');

const webpackConfig = {
    module: { rules },
    plugins,
    ...extra
};

if (!isDevelopment) {
    Object.entries(extra.entry).forEach(([k, v]) => {
        webpackConfig.entry[k] = (k === 'global'
            ? ['fetch-detector', 'fetch-ie8', 'es5-shim']
            : []
        ).concat('babel-polyfill', v);
    });
}

module.exports = webpackConfig;
