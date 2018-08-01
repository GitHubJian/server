const signature = require('../utils/signature');

module.exports = function(config) {
    return async (ctx, next) => {
        ctx.utils = {};
        ctx.utils.signature = signature;

        await next();
    };
};
