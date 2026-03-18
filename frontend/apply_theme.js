const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = {
    'bg-slate-950': 'bg-white dark:bg-slate-950',
    'bg-slate-900': 'bg-slate-50 dark:bg-slate-900',
    'bg-slate-800': 'bg-slate-100 dark:bg-slate-800',
    'bg-slate-700': 'bg-slate-200 dark:bg-slate-700',
    'text-slate-50': 'text-slate-900 dark:text-slate-50',
    'text-slate-100': 'text-slate-800 dark:text-slate-100',
    'text-slate-200': 'text-slate-700 dark:text-slate-200',
    'text-slate-300': 'text-slate-600 dark:text-slate-300',
    'text-slate-400': 'text-slate-500 dark:text-slate-400',
    'text-slate-500': 'text-slate-400 dark:text-slate-500',
    'border-slate-800': 'border-slate-200 dark:border-slate-800',
    'border-slate-700': 'border-slate-300 dark:border-slate-700',
};

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // We should only replace whole words, so we can use regex
    // also handle variations like bg-slate-900/80 which translates to dark:bg-slate-900/80

    // Custom logic instead of simple map to handle opacities
    // Match prefix: (bg|text|border)-slate-(\d+)(/[0-9]+)?

    const regex = /\b((?:bg|text|border)-slate-\d+(?:\/\d+)?)\b/g;

    content = content.replace(regex, (match) => {
        // If the match starts with dark: or we've already done it somehow, skip
        // We can't really lookbehind easily if it's dynamic but we can just do a simple check

        // Actually simpler to just use a custom replacer:
        // Split the match into base and opacity
        let base = match;
        let opacity = '';
        if (match.includes('/')) {
            const parts = match.split('/');
            base = parts[0];
            opacity = '/' + parts[1];
        }

        if (replacements[base]) {
            // e.g. bg-white dark:bg-slate-950
            // if opacity, we apply it to both: bg-white/80 dark:bg-slate-950/80
            const replacementParts = replacements[base].split(' ');
            // replacementParts[0] is the light mode class
            // replacementParts[1] is the dark mode class
            return `${replacementParts[0]}${opacity} ${replacementParts[1]}${opacity}`;
        }
        return match;
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.js') && !fullPath.includes('node_modules')) {
            processFile(fullPath);
        }
    }
}

walkDir(srcDir);
console.log('Done!');
