const { resolve } = require('path');
const { NODE_ENV } = process.env;
const [isDevelopment, isProduction] = [
    NODE_ENV === 'development',
    NODE_ENV === 'production'
];
const rootPath = process.cwd();
const tempPath = resolve(rootPath, '.temp');
// 具体项目中的配置
let projectConfig = require(`${rootPath}/project.config`);
const serverConfig = require(`${rootPath}/server/config`);

if (!projectConfig.title) {
    projectConfig.title = '测试系统';
}

projectConfig = Object.assign({}, projectConfig);

const pathConfig = Object.assign(
    {
        root: rootPath,
        nodeModulePath: resolve(rootPath, 'node_modules'),
        NODE_CONFIG_DIR: resolve(rootPath, 'server/config'),
        favicon: resolve(__dirname, 'favicon.ico'),
        temp: tempPath,
        tpl: resolve(tempPath, 'tpl'),
        dll: resolve(tempPath, 'dll'),
        static: resolve(rootPath, 'static'),
        src: resolve(rootPath, 'src'),
        global: resolve(rootPath, 'src/global.js'),
        build: resolve(rootPath, 'static'),
        pages: resolve(rootPath, 'src/pages'),
        extra: resolve(rootPath, 'src/extra.js')
    },
    projectConfig.pathConfig
);

pathConfig.dllVersion = resolve(pathConfig.dll, 'version.json');

module.exports = {
    NODE_ENV,
    isDevelopment,
    isProduction,
    projectConfig,
    serverConfig,
    pathConfig
};
