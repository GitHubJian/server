const { dllEntry } = require('../config');

module.exports = () => {
    const dllPkgs = Object.values(dllEntry).reduce((prev, cur) => {
        prev.push(...cur);
        return prev;
    }, []);

    const dllPkgsVersion = dllPkgs.reduce((prev, cur) => {
        prev[cur] = require(`${cur}/package.json`).version;
        return prev;
    });

    return dllPkgsVersion;
};
