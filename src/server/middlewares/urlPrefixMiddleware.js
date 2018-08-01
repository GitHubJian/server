const { normalize } = require('path');

module.exports = function({ urlPrefix = '' }) {
    return async (ctx, next) => {
        ctx.urlPrefix = urlPrefix;
        ctx.path = normalize('/' + ctx.path.replace(urlPrefix, ''));

        await next();
    };
};
