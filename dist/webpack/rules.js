const { rules: styleRules } = require('./utils/style');
const { projectConfig } = require('./config');

const rules = [
    ...styleRules,
    ...projectConfig.loaders,
    {
        test: /\.vue$/,
        use: 'happypack/loader?id=vue',
        exclude: [/node_modules\/(?!@lsfe)/]
    },
    {
        test: /\.js$/,
        use: 'happypack/loader?id=js',
        exclude: [/node_modules\/(?!@lsfe)/]
    },
    {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'static/image/[name].[hash].[ext]'
                }
            }
        ]
    },
    {
        test: /\.mp3$/,
        use: [
            {
                loader: 'url-loader',
                query: {
                    limit: 1,
                    name: 'static/voice/[name].[hash].[ext]'
                }
            }
        ]
    }
];

// if (isDevelopment && projectConfig.enableEslint) {
//     rules.push(createEslintRule());
// }

module.exports = rules;
