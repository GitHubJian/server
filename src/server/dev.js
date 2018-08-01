'use strict';

const koa = require('koa');
const koaBody = require('koa-body');
const logger = require('./utils/logger');

const {
    actionsMiddleware,
    apiProxyMiddleware,
    authMiddleware,
    exceptionMiddleware,
    logMiddleware,
    mockMiddleware,
    permissionMiddleware,
    urlPrefixMiddleware,
    utilsMiddleware
} = require('./middlewares');

module.exports = function(config, customMiddlewares = {}) {
    const app = new koa();
    const env = process.env.NODE_ENV;

    const checkMiddleware = (function(app, customMiddlewares, config) {
        return function(name) {
            customMiddlewares[name] &&
                app.use(customMiddlewares[name](config, app));
        };
    })(app, customMiddlewares, config);

    app.use(koaBody({ patchKoa: true }));
    // 日志记录
    app.use(logMiddleware(config, app));
    // after logger
    checkMiddleware('afterLogger');
    // 错误
    app.use(exceptionMiddleware(config, app));

    // auth
    checkMiddleware('beforeAuth');
    app.use(authMiddleware(config, app));
    app.use(permissionMiddleware(config, app));
    checkMiddleware('afterAuth');

    // prepare
    checkMiddleware('beforePrepare');
    app.use(urlPrefixMiddleware(config, app));
    app.use(utilsMiddleware(config, app));
    checkMiddleware('afterPrepare');

    // mock
    app.use(mockMiddleware(config, app));

    // actions
    checkMiddleware('beforeActions');
    app.use(actionsMiddleware(config, app));
    checkMiddleware('afterActions');
    // apiProxy
    app.use(apiProxyMiddleware(config, app));

    // webpack
    checkMiddleware('beforeAssert');
    app.use(webpackMiddleware(config, app));
    checkMiddleware('afterAssert');

    // Start
    let { port, hostname = 'http://localhost' } = config;
    app.listen(port, hostname, () => {
        logger.info(`✨ 服务已经启动 ${hostname}:${config.port}`);
    });
};
