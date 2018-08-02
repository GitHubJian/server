const { pathConfig } = require('./../config');

module.exports = {
    test: /\.(js|vue)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    exclude: /node_modules/,
    include: file => {
        if (file.includes('node_modules')) {
            return false;
        }
        if (!file.startsWith(pathConfig.src)) {
            return false;
        }
        const gitDiffFiles = getGitDiffFiles();
        return gitDiffFiles.some(v => {
            return file === join(pathConfig.root, v);
        });
    },
    options: {
        formatter: require('eslint/lib/formatters/table'),
        emitWarning: true, // 热更新模式下开启 https://github.com/webpack-contrib/eslint-loader#emitwarning-default-false
        configFile: join(__dirname, '.eslintrc.js')
    }
};
