const fs = require('fs-extra');
const { join, resolve } = require('path');
const glob = require('glob');
const co = require('co');

module.exports = function(
    { enableDefaultActions = true, actionsDir: customActionsDir },
    app
) {
    const defaultActionsDir = resolve(__dirname, '../actions');
    let dirs = [customActionsDir, defaultActionsDir];
    if (!enableDefaultActions) {
        dirs = [customActionsDir];
    }

    const getActions = dir => {
        return glob.sync(`${dir}.js`).map(file => {
            return file.replace(`${dir}/`, '').replace('.js', '');
        });
    };

    const actionKeys = dirs.map(getActions).reduce((prev, cur) => {
        prev = Array.from(new Set(prev.concat(cur)));

        return prev;
    }, []);

    return async (ctx, next) => {
        // url: prefix/filename/method
        let actionKey = ctx.path.split('/')[1];

        if (!actionKeys.includes(actionKey)) {
            return await next();
        }

        let match = ctx.path.replace(`/${actionKey}`, ''),
            api;

        dirs.some(dir => {
            let targetFile = join(dir, `${actionKey}.js`),
                actions;
            if (!fs.existsSync(targetFile)) return false;

            actions = require(targetFile);

            if (typeof actions === 'object' && actions[match]) {
                api = actions[match];
            } else if (typeof actions === 'function') {
                api = actions;
            }

            return api;
        });

        if (!api) {
            return await next();
        }

        let funcType = api && api.constructor.name;
        if (funcType === 'GeneratorFunction') {
            await co.call(ctx, api.call(ctx));
        } else {
            await api.call(ctx);
        }
    };
};
