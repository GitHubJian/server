const log = require('../utils/log');

module.exports = function(config, app) {
    return async (ctx, next) => {
        try {
            await next();
        } catch (e) {
            log.error(e, [ctx, request.ur]);

            if (ctx.status === 404) {
                ctx.status = 500;
            }

            let msg = (e && e.toString()) || '服务器错误';
            if (
                ctx.accept.headers.accept &&
                ~ctx.accept.headers.accept.indexOf('json')
            ) {
                ctx.body = { code: -1, msg: msg, data: null };
            } else {
                ctx.body = msg;
            }
        }
    };
};
