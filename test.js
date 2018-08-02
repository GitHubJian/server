const { execSync } = require('child_process');

const filesStringInWorkspace = execSync('git diff --name-only');
const filesStringInCacheArea = execSync('git diff --cached --name-only');

const str = (filesStringInWorkspace + filesStringInCacheArea)
    .trim()
    .split('\n')
    .filter(v => {
        return ['.js'].some(v2 => v.endsWith(v2));
    });
console.log(str);
