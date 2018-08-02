const { pathConfig } = require('./config');
const glob = require('glob');
const { statSync } = require('fs');
const { basename } = require('path');
const { entry } = require('./utils/routers');

const alias = glob
    .sync(`${pathConfig.src}/*`)
    .filter(v => {
        return statSync(v).isDirectory();
    })
    .reduce((prev, cur) => {
        prev[basename(cur)] = cur;
        return prev;
    }, {});

const webpackConfig = {
    entry: Object.assign({ global: pathConfig.global }, entry),
    output: {
        path: pathConfig.build,
        filename: `static/js/[name]${isDevelopment ? '' : '.[chunkhash]'}.js`,
        publicPath: `${projectConfig.publicPath || ''}/`
    },
    resolve: {
        alias,
        extensions: ['.js', '.json', '.vue'],
        modules: [pathConfig.src, pathConfig.nodeModulePath]
    },
    resolveLoader: {
        modules: [pathConfig.nodeModulePath]
    },
    performance: {
        hints: false
    },
    stats: {
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        warningsFilter: warnings =>
            [
                'component lists rendered with v-for should have explicit keys',
                'the "scope" attribute for scoped slots have been deprecated and replaced by "slot-scope" since 2.5'
            ].some(v => warnings.includes(v))
    }
};

if (isDevelopment) {
    webpackConfig.devtool = '#eval';
}

module.exports = { webpackConfig };
