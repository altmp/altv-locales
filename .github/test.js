const fs = require('fs');
const path = require('path');
const assert = require('assert');
const testData = 'langs';
let file = fs.readFileSync(path.join('langs', 'en.json'), "utf8");
const en = Object.entries(JSON.parse(file).strings);
let failed = false;
for(const dir of fs.readdirSync(testData)) {
    const dirPath = path.join(testData, dir);
    if(fs.lstatSync(dirPath).isDirectory()) {
        continue;
    }
    console.log(`Testing locale file ${dir} . . .`);
    file = fs.readFileSync(dirPath, "utf8");
    const arr = Object.entries(JSON.parse(file).strings);
    const diff = [];
    let different = false;
    for(let i = 0; i < en.length; i++) {
        const oldKey = en[i][0];
        const oldVal = en[i][1];
        const newKey = i < arr.length ? arr[i][0] : null;
        const newVal = i < arr.length ? arr[i][1] : null;
        if(oldKey === newKey) continue;
        failed = different = true;
        diff.push({actual: [newKey, newVal], expected: [oldKey, oldVal]});
    }
    if(different) {
        // console.log(dir);
        for(const elem of diff) {
            const actual = elem.actual;
            const expected = elem.expected;
            console.log(`  \x1b[31m-    "${actual[0]}": "${actual[1]}"\x1b[0m`);
            console.log(`  \x1b[32m+    "${expected[0]}": "${actual[1]}"\x1b[0m`);
        }
        console.log(`  \x1b[32m+ expected\x1b[0m \x1b[31m- actual\x1b[0m`);
        console.log(`  \x1b[31mError: File contents differ.\x1b[0m`);
    } else {
        console.log(`  \x1b[32mAll checks passed\x1b[0m`);
    }
}
if(failed) process.exitCode = 1;