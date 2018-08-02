const webpack = require('webpack');
const { log, noop, formatState } = require('./utils');

const webpackCompiler = (webpackConfig, callback = noop) => {
    return new Promise((resolve, reject) => {
        const compiler = webpack(webpackConfig);
        compiler.run((err, stats) => {
            if (err) {
                log('webpack 编译报错', 'red');
                log(err);
                if (err.details) {
                    log(err.details, 'red');
                }
                reject(err);
            } else {
                log(stats.toString(webpackConfig.stats));
                //formatStats(stats);
                resolve();
            }
        });
        compiler.plugin('done', callback);
    });
};

const webpackDllBuild = async () => {
    const webpackDllConfig = require('./webpack.dll.config.js');
    const { produceDllVersion } = require('./utils/prepack');
    await webpackCompiler(webpackDllConfig);
};

const webpackBuild = async () => {
    const webpackConfig = require('./webpack.config.js');
    const { prepack } = require('./utils');
    prepack();
    await webpackCompiler(webpackConfig);
};

module.exports = { webpackDllBuild, webpackBuild };
