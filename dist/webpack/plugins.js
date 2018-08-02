const {
    createHappyPlugin,
    vueStyleLoaders,
    plugins: stylePlugins
} = require('./utils/style');
const { resolve } = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const AssetsWebpackPlugin = require('assets-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const {
    isDevelopment,
    isProduction,
    dllEntry,
    extractCSS,
    pathConfig,
    projectConfig
} = require('./config');

const plugins = [
    ...stylePlugins,
    createHappyPlugin('js', [
        {
            loader: 'babel-loader',
            options: {
                plugins: ['transform-runtime'],
                presets: [['env', { modules: false }], 'stage-1']
            }
        }
    ]),
    createHappyPlugin('vue', [
        {
            loader: 'vue-loader',
            options: {
                loaders: {
                    ...vueStyleLoaders,
                    js: {
                        loader: 'babel-loader',
                        options: {
                            plugins: ['transform-runtime', 'transform-vue-jsx'],
                            presets: [['env', { modules: false }], 'stage-1']
                        }
                    }
                }
            }
        }
    ]),
    new webpack.ProgressPlugin(),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.DefinePlugin({
        'process.env.buildTime': JSON.stringify(Date.now()),
        'process.env.projectTitle': JSON.stringify(projectConfig.title),
        'process.env.projectConfig': JSON.stringify(projectConfig)
    }),
    new webpack.ProvidePlugin({
        qs: 'query-string',
        _: 'lodash',
        moment: 'moment',
        ...(projectConfig.provide || {})
    }),
    projectConfig.fixMomentjsLocale
        ? new webpack.IgnorePlugin(/^\.\/locale$/, /moment\/min$/)
        : new webpack.IgnorePlugin(/\.\/locale$/),
    new CopyWebpackPlugin(
        [
            {
                from: resolve(pathConfig.dll, 'static'),
                to: 'static'
            },
            {
                from: pathConfig.favicon,
                to: 'static'
            },
            projectConfig.copyAssets
        ].filter(v => v)
    ),
    ...Object.keys(dllEntry).map(
        v =>
            new webpack.DllReferencePlugin({
                manifest: require(`${pathConfig.dll}/${v}.json`)
            })
    ),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'global',
        minChunks: module =>
            module.context && module.context.includes('node_modules')
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        minChunks: Infinity
    })
];

if (isDevelopment) {
    plugins.push(
        ...[
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.NamedModulesPlugin(),
            new HtmlWebpackIncludeAssetsPlugin({
                append: false,
                publicPath: '',
                assets: Object.entries(require(`${pathConfig.dll}/index.json`))
                    .map(([k, v]) => Object.values(v))
                    .reduce((prev, cur) => {
                        prev.push(...cur);
                        return prev;
                    }, [])
            })
        ]
    );
} else {
    plugins.push(
        ...[
            extractCSS,
            new CleanWebpackPlugin([pathConfig.build], {
                root: pathConfig.root,
                verbose: false
            }),
            new AssetsWebpackPlugin({
                path: pathConfig.asset,
                filename: 'index.json',
                prettyPrint: true
            })
        ]
    );
}

if (isProduction) {
    plugins.push(
        new ParallelUglifyPlugin({
            uglifyJS: {
                compress: {
                    warnings: false
                }
            }
        })
    );
}

module.exports = plugins;
