const fs = require('fs');
const { join } = require('path');
const { pathConfig } = require('../../config');

module.exports = function(config) {
    return async (ctx, next) => {
        // mock
        if (!ctx.path.startsWith('/mock')) {
            return await next();
        }
        // url: mock/folder/filename/method
        let pathArr = ctx.path.split('/'),
            methodName = pathArr.pop(),
            restPath = pathArr.join('/');
        // 获取 mock 文件
        let filePath = join(pathConfig.root, `${restPath}.js`);

        if (!fs.existsSync(filePath)) {
            return (ctx.status = 404);
        }
        // 清除 mock 缓存
        delete require.cache[filePath];

        let methods = require(filePath);
        let api = methods[methodName];
        if (api) {
            // mock 方法存在
            ctx.body = {
                code: 0,
                msg: '',
                data: api({ query: ctx.query, body: ctx.request.body })
            };
        } else {
            return (ctx.status = 404);
        }
    };
};
