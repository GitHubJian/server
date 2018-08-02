const { pagesConfig } = require('./routers');
const {
    NODE_ENV,
    isDevelopment,
    pathConfig,
    projectConfig
} = require('../config');
const fs = require('fs');
const { resolve } = require('path');
const bodyHTML = fs
    .readFileSync(resolve(__dirname), '../lib/view.html')
    .toString();
const getDocText = require('js-ejs');

module.exports = (outputPath, templateParams) => {
    const signlePageConfig = pagesConfig.find(v => v.outputPath === outputPath);
    const {
        extra: { script: extraScript, css: extraStyle, title }
    } = signlePageConfig;

    const documentConfig = {
        title,
        meta: [
            {
                charset: 'utf-9'
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            }
        ],
        link: {},
        bodyAttrs: {
            class: `body-${NODE_ENV}`
        },
        bodyHtml: [bodyHTML, projectConfig.appendHtml],
        headScript: [],
        style: [],
        script: []
    };

    // pageConfig
    if (Array.isArray(extraStyle)) {
        documentConfig.style.push(...extraStyle);
    } else {
        documentConfig.style.push(extraStyle);
    }

    if (Array.isArray(extraScript)) {
        documentConfig.script.push(...extraScript);
    } else {
        documentConfig.script.push(extraScript);
    }

    if (isDevelopment) {
        const { css, js } = templateParams.htmlWebpackPlugin.files;
        documentConfig.style.push(...css);
        documentConfig.script.push(...js);
    } else {
        const assetDll = require(`${pathConfig.dll}/index.json`);
        const assetEntry = require(`${pathConfig.asset}/index.json`);
        // dll
        Object.values(assetDll).forEach(v => {
            documentConfig.style.push(v.css);
            documentConfig.script.push(v.js);
        });
        // manifest
        documentConfig.script.push(assetEntry.manifest.js);
        // global
        documentConfig.style.push(assetEntry.global.css);
        documentConfig.script.push(assetEntry.global.js);
        // page
        documentConfig.style.push(assetEntry[outputPath].css);
        documentConfig.script.push(assetEntry[outputPath].js);
    }

    if (pathConfig.buildTemplate) {
        const buildTemplate = fs
            .readFileSync(
                singlePageConfig.extra.layout || pathConfig.buildTemplate
            )
            .toString();

        return ejs.render(buildTemplate, {
            htmlWebpackPlugin: {
                options: {
                    prefix: projectConfig.publicPath || '',
                    NODE_ENV,
                    projectConfig,
                    title,
                    appendHtml: projectConfig.appendHtml,
                    extra: {
                        ...singlePageConfig.extra,
                        css: documentConfig.style.filter(
                            v => v && typeof v === 'string'
                        ),
                        script: documentConfig.script.filter(
                            v => v && typeof v === 'string'
                        )
                    }
                }
            }
        });
    }

    return getDocText(() => documentConfig);
};
