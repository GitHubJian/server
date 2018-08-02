const logger = require('../../utils/logger');
const time = require('../../utils/time');

module.exports = function(config, app) {
    return async (ctx, next) => {
        const t1 = Date.now();
        next();
        const t2 = Date.now();
        logger.info('-'.repeat(30));
        logger.info(`
            ST: ${time.format(t1)}
            ET: ${time.format(t2)}
            Time: ${String(t2 - t1).padStart(4, ' ')}
        `);
        logger.info('-'.repeat(30));
    };
};
