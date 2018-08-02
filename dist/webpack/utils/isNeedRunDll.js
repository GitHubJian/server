const fs = require('fs');
const { pathConfig } = require('../config');
const getDllVersion = require('./getDllVersion');

const isSameJson = (a, b) => {
    let aKeys = Object.keys(a),
        bKeys = Object.keys(b);
    return aKeys.length === bKeys.length && aKeys.every(v => a[v] === b[v]);
};

module.exports = () => {
    const dllPkgsVersion = getDllVersion();

    if (fs.existsSync(pathConfig.dllVersion)) {
        const cacheDllPkgsVersion = require(pathConfig.dllVersion);
        return !isSameJson(dllPkgsVersion, cacheDllPkgsVersion);
    } else {
        return true;
    }
};
