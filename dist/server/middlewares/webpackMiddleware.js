const fs = require('fs');
const webpack = require('webpack');
const singleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const { hotMiddleware } = require('koa-webpack-middleware');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../../webpack/webpack.config');
const { NODE_ENV, pathConfig, projectConfig } = require('../../config');
const { pagesConfig } = require('../../webpack/utils/routers');
const getSingleHtml = require('../../webpack/utils/getSingleHtml');

webpackConfig.entry = {
    global: ['webpack-hot-middleware/client', pathConfig.global]
};

const utimeFn = strPath => {
    const now = Date.now() / 1000;
    const then = now - 10;
    fs.utimes(strPath, then, then);
};

const getSingleHtmlPlugin = page => {
    const { entryPath, outputPath, extra } = page;
    return new HtmlwebpackPlugin({
        filename: `${outputPath}.html`,
        inject: false,
        chunks: ['manifest', 'global', outputPath],
        templateContent: templateParams =>
            getSingleHtml(outputPath, templateParams)
    });
};

module.exports = function(config, app) {
    const htmlCache = {};
    const compiler = webpack(webpackConfig);
    const devMiddlewareInstance = webpackDevMiddleware(compiler, {
        publicPath: '/',
        stats: webpackConfig.stats
    });

    app.use(async (ctx, next) => {
        if (ctx.path === '/' || ctx.path.endsWidth('.html')) {
            const entry =
                ctx.path === '/'
                    ? 'index'
                    : ctx.path.replace('.html', '').substr(1);
            if (htmlCache[entry]) {
                await next();
            } else {
                const page = pagesConfig.find(v => entry === v.outputPath);
                if (page) {
                    compiler.apply(
                        new singleEntryPlugin(
                            pathConfig.root,
                            page.entryPath,
                            page.outputPath
                        )
                    );
                    compiler.apply(getSingleHtmlPlugin(page));
                    devMiddlewareInstance.invalidate();
                    htmlCache[entry] = true;
                    await next();
                }
            }
        }
        await next();
    });

    app.use(async (ctx, next) => {
        ctx.status = 200;
        await devMiddlewareInstance(ctx.req, ctx.res, async () => {
            await next();
        });
    });

    app.use(hotMiddleware(compiler));
};
