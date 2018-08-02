const cheerio = require('cheerio'),
    glob = require('glob'),
    { existsSync, readFileSync } = require('fs'),
    { resolve, relative, dirname } = require('path'),
    { pathConfig, projectConfig } = require('../config'),
    extraData = existsSync(pathConfig.extra) ? require(pathConfig.extra) : {};
// 固定的规则解析出入口文件
const routers = glob.sync(`${pathConfig.pages}/**/index.vue`);

const entry = {},
    pagesConfig = {};

const getTdk = rawText => {
    let $ = cheerio.load(rawText, { decodeEntities: false });
    $ = cheerio.load($('template').html(), { decodeEntities: false });

    let layout = '',
        title = $('title').text(),
        metas = [],
        style = [],
        script = [];

    $('meta').each(function() {
        const attrs = $(this).attr();
        if (attrs['name'] === 'layout') {
            layout = resolve(pathConfig.root, attrs['content']);
        } else if (attrs['name'] === 'extra:style') {
            style.push(attrs['content']);
        } else if (attrs['name'] === 'extra:script') {
            script.push(attrs['content']);
        } else {
            metas.push(attrs);
        }
    });
    return { layout, title, metas, style, script };
};

routers.forEach(v => {
    const entryKey = dirname(relative(pathConfig.pages, v)),
        entryVal = resolve(pathConfig.tpl, entryKey, 'index.js');

    entry[entryKey] = entryVal;

    pagesConfig.push({
        vuePath: v,
        outputPath: entryKey,
        entryPath: entryVal,
        extra: Object.assign(
            { title: projectConfig.title, layout: '', metas: [] },
            extraData[entryKey]
        )
    });
});

pagesConfig.forEach(v => {
    const { vuePath } = v,
        content = readFileSync(vuePath).toString(),
        templateContent = content.match(/<template>(\n|.)+<\/template>/);

    if (!templateContent) {
        return;
    }

    const { layout, title, metas, style, script } = getTdk(templateContent[0]);

    if (layout) {
        v.extra.layout = layout;
    }
    if (title) {
        v.extra.title = title;
    }
    v.extra.metas = metas;

    if (style.length) {
        if (v.extra.css) {
            if (Array.isArray(v.extra.css)) {
                v.extra.css.push(...style);
            } else {
                v.extra.css = [v.extra.css, ...style];
            }
        } else {
            v.extra.css = style;
        }
    }
    if (script.length) {
        if (v.extra.script) {
            if (Array.isArray(v.extra.script)) {
                v.extra.script.push(...script);
            } else {
                v.extra.script = [v.extra.script, ...script];
            }
        } else {
            v.extra.script = script;
        }
    }
});

module.exports = { entry, pagesConfig };
