'use strict';

const url = require('url');
const koaProxy = require('koa-proxy');
const koaConvert = require('koa-convert');
const logger = require('../../utils/logger');

module.exports = function({ apiConfig }) {
    let paths = apiConfig && Object.keys(apiConfig);

    return async (ctx, next) => {
        let reqPath = ctx.path;

        if (!paths) {
            await next();
        }

        let convert = defaultConvertPath;

        for (let i = paths.length - 1; i >= 0; i--) {
            let path = paths[i];

            if (reqPath.startsWith(path)) {
                let host = apiConfig[path].url;

                if (typeof apiConfig[path].convert === 'function') {
                    convert = apiConfig[path].convert;
                }

                // 打印日志
                logProxyRule(host, reqPath, convert);

                let fn = koaConvert(koaProxy({ host, map: convert }));

                return await fn(ctx, next);
            }
        }

        await next();
    };
};

function defaultConvertPath(path) {
    return path;
}

function logProxyRule(host, path, convert) {
    let targetUrl = convert(path);
    targetUrl = url.resolve(host, targetUrl);
    logger.proxy(`${path} => ${targetUrl}`);
}
