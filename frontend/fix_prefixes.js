const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    const regex = /\b((?:hover|focus|active|disabled|placeholder|group-hover):)([a-zA-Z0-9-]+(?:\/[0-9]+)?)\s+dark:([^ \t\r\n"']+)\b/g;

    content = content.replace(regex, (match, prefix, lightClass, darkClass) => {
        if (darkClass.startsWith(prefix)) {
            return match;
        }
        return `${prefix}${lightClass} dark:${prefix}${darkClass}`;
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed: ${filePath}`);
    }
}
function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.js') && !fullPath.includes('node_modules')) {
            fixFile(fullPath);
        }
    }
}

walkDir(srcDir);
