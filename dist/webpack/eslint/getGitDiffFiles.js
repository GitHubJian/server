const { execSync } = require('child_process');

const getGitDiffFiles = () => {
    const filesStringInWorkspace = execSync('git diff --name-only'); // 工作区 <Buffer >
    const filesStringInCacheArea = execSync('git diff --cached --name-only'); // 缓存区 <Buffer >
    const gitDiffFiles = (filesStringInCacheArea + filesStringInWorkspace)
        .trim()
        .split('\n')
        .filter(v => {
            return ['.js', '.vue'].some(v2 => v.endsWith(v2));
        });
    return gitDiffFiles;
};

const filesCache = {};

module.exports = () => {
    const timeSecond = Math.floor(Date.now() / 1000);

    Object.entries(filesCache).forEach(([k, v]) => {
        if (k < timeSecond - 10) {
            delete filesCache[k];
        }
    });

    if (!filesCache[timeSecond]) {
        filesCache[timeSecond] = getGitDiffFiles();
    }
    return filesCache[timeSecond];
};
