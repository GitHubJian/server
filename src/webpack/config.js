// 抽离css
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('static/css/[name].[chunkhash].css');
const {
    NODE_ENV,
    isDevelopment,
    isProduction,
    projectConfig,
    pathConfig,
    serverConfig
} = require('../config');
const vendor = [
    'query-string', //
    'fetch-detector', // fetch 探测库
    'fetch-ie8', // ie8兼容fetch
    'es5-shim', // 兼容es5
    'babel-polyfill', // 兼容es6
    'moment' // 时间处理
];

let dllEntry = projectConfig.dllEntry;

if (dllEntry) {
    if (Array.isArray(dllEntry)) {
        let tmp = Array.from(new Set([].concat(vendor, dllEntry)));
        dllEntry = { vendor: tmp };
    } else {
        throw new TypeError('dllEntry must be array');
    }
} else {
    dllEntry = { vendor };
}

// 处理兼容
// Object.entries(dllEntry).forEach(([k, v]) => {});

module.exports = {
    NODE_ENV,
    isDevelopment,
    isProduction,
    dllEntry,
    extractCSS,
    projectConfig,
    pathConfig,
    serverConfig
};
