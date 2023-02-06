const fs = require('fs');
const path = require('path');

const langFolder = "langs";
const args = process.argv.slice(2);
let files = [];

if (args.length === 0) {
    for (const filename of fs.readdirSync(langFolder)) {
        const filePath = path.join(langFolder, filename);
        if (fs.lstatSync(filePath).isDirectory() || filename === "en.json") continue;
        if (!filename.match(/\.json$/)) continue;
        files.push(filename);
    }
} else {
    for (const filePath of args) {
        if (!filePath.startsWith(langFolder)) continue;
        files.push(path.basename(filePath));
    }
}

function transformKeys(keys) {
    keys = keys.map(e => e.endsWith(':OTHER') ? e.slice(0, -6) : e).filter(e => !e.includes(':'));
    return [...new Set(keys)];
}

let baseKeys;
try {
    baseKeys = transformKeys(Object.keys(JSON.parse(fs.readFileSync(path.join(langFolder, "en.json"), "utf8")).strings));
} catch (err) {
    console.log(`\x1b[31mTemplate file is corrupt, aborting\x1b[0m`);
    process.exit(1);
    return;
}

let failed = false;
for (const filename of files) {
    const dirPath = path.join(langFolder, filename);
    if (fs.lstatSync(dirPath).isDirectory()) continue;
    console.log(`Testing locale file ${filename}...`);

    const diff = [];
    let keys;
    try {
        keys = transformKeys(Object.keys(JSON.parse(fs.readFileSync(dirPath, "utf8")).strings));
    } catch (err) {
        failed = true;
        console.log(`  \x1b[31m${err.message}\x1b[0m`);
        break;
    }

    let different = false;
    for (let i = 0; i < baseKeys.length; i++) {
        const oldKey = baseKeys[i];
        const newKey = i < keys.length ? keys[i] : null;
        if (oldKey === newKey) continue;
        failed = different = true;
        diff.push({ actual: newKey, expected: oldKey });
    }

    if (different) {
        for (const elem of diff) {
            const actual = elem.actual;
            const expected = elem.expected;
            console.log(`  \x1b[31m-\t"${actual}"\x1b[0m`);
            console.log(`  \x1b[32m+\t"${expected}"\x1b[0m`);
        }
        console.log(`  \x1b[32m+ expected\x1b[0m \x1b[31m- actual\x1b[0m`);
        console.log(`  \x1b[31mError: File contents differ.\x1b[0m`);
    } else {
        console.log(`  \x1b[32mAll checks passed\x1b[0m`);
    }
}

if (failed) process.exit(1);
