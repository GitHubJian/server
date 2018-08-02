const prepack = require('./prepack');
const isNeedRunDll = require('./isNeedRunDll');

const noop = () => {};

module.exports = {
    noop,
    prepack,
    isNeedRunDll
};
