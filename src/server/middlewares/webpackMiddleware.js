module.exports = function(config, app) {
    return async (ctx, next) => {
        await next();
    };
};
