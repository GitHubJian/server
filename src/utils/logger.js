'use strict';

const chalk = require('chalk');

const type2Color = {
    proxy: 'yellow',
    info: 'green',
    error: 'red'
};

const maxLen = Math.max(...Object.keys(type2Color).map(v => v.length));

module.exports = Object.entries(type2Color).reduce((prev, [type, color]) => {
    prev[type] = str => {
        console.log(
            chalk[color](type),
            `${' '.repeat(maxLen - type.length)}${str}`
        );
    };

    return prev;
}, {});
