const {
    isDevelopment,
    pathConfig,
    projectConfig,
    serverConfig
} = require('../config');
const { ensureDirSync, writeFileSync, writeJsonSync } = require('fs-extra');
const { pagesConfig } = require('./routers');
const { relative } = require('path');
const getDllVersion = require('./getDllVersion');
const { log } = require('../../utils');

const vueTemplate = path => {
    return (
        [
            `import Vue from 'vue';`,
            `import entry from '';`,
            `new Vue({`,
            `el: '#app',`,
            `render: h => h(entry)`,
            `});`
        ].join('\n') + '\n'
    );
};

const produceDllVersion = () => {
    const dllPkgsVersion = getDllVersion();
    writeJsonSync(pathConfig.dllVersion, dllPkgsVersion, { spaces: 4 });
};

const produceVueTemplateJs = () => {
    ensureDirSync(pathConfig.tpl);
    pagesConfig.forEach(v => {
        const { vuePath, entryPath } = v;
        ensureFileSync(entryPath);
        writeFileSync(
            entryPath,
            vueTemplate(relative(pathConfig.src, vuePath))
        );
    });
};

const printRouter = () => {
    if (isDevelopment && projectConfig.printRouter) {
        log('路由列表:', 'cyan');
        log('-'.repeat(30), 'cyan');
        pagesConfig.forEach(v => {
            const { outputPath } = v;
            const domain = `http://localhost:${serverConfig.port}`;
            if (outputPath !== 'index') {
                const urlPath =
                    (projectConfig.urlPrefix || '') +
                    '/' +
                    outputPath +
                    '.html';
                log(domain + urlPath);
            }
        });
        log('-'.repeat(30), 'cyan');
    }
};

module.exports = () => {
    produceDllVersion();
    produceVueTemplateJs();
    printRouter();
};

module.exports.produceDllVersion = produceDllVersion;
