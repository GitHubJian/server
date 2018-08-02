const os = require('os');
const {
    isDevelopment,
    isProduction,
    pathConfig,
    projectConfig,
    dllEntry: entry
} = require('./config');

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const AssetsWebpackPlugin = require('assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const extractCSS = new ExtractTextPlugin(
    `static/css/[name]${!isDevelopment ? '.[chunkhash]' : ''}.css`
);

const LIBRARY_NAME = '__[name]_[chunkhash]';

const webpackConfig = {
    entry,
    output: {
        filename: `static/js/[name]${!isDevelopment ? '.[chunkhash]' : ''}.js`,
        path: pathConfig.dll,
        publicPath: (projectConfig.publicPath || '') + '/',
        library: LIBRARY_NAME
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: extractCSS.extract([
                    {
                        loader: 'css-loader',
                        options: { minimize: !isDevelopment }
                    }
                ])
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: `static/image/[name]${
                        !isDevelopment ? '.[hash]' : ''
                    }.[ext]`
                }
            }
        ]
    },
    resolveLoader: {
        modules: [pathConfig.nodeModulePath]
    },
    resolve: {
        extensions: ['.js'],
        modules: [pathConfig.nodeModulePath]
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new webpack.EnvironmentPlugin(['NODE_ENV']),
        projectConfig.fixMomentjsLocale
            ? new webpack.IgnorePlugin(/^\.\/locale$/, /moment\/min$/)
            : new webpack.IgnorePlugin(/\.\/locale$/),
        new CleanWebpackPlugin([pathConfig.dll], {
            root: pathConfig.root,
            verbose: false
        }),
        extractCSS,
        new webpack.DllPlugin({
            path: `${pathConfig.dll}/[name].json`,
            name: LIBRARY_NAME
        }),
        new AssetsWebpackPlugin({
            path: pathConfig.dll,
            filename: 'index.json',
            prettyPrint: true
        })
    ],
    stats: {
        colors: true,
        modules: false,
        children: false,
        chunks: false
    }
};

if (isProduction) {
    webpackConfig.plugins.push(
        new ParallelUglifyPlugin({
            workerCount: os.cpus().length,
            uglifyJS: {
                compress: {
                    warnings: false
                }
            }
        })
    );
}

module.exports = webpackConfig;
