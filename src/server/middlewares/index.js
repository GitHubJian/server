const glob = require('glob');

const middlewares = glob
    .sync(`${__dirname}/*.js`)
    .filter(v => v !== `${__dirname}/index.js`);

module.exports = middlewares.reduce((prev, cur) => {
    const name = cur
        .split('/')
        .slice(-1)[0]
        .replace('.js', '');
    prev[name] = require(cur);
    return prev;
}, {});
