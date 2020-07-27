const fs = require('fs');
const path = require('path');
const assert = require('assert');
const langFolder = "langs";
const args = process.argv.slice(2);
let files = [];
if(args.length == 0) {
  for(const filename of fs.readdirSync(langFolder)) {
    const filePath = path.join(langFolder, filename);
    if(fs.lstatSync(filePath).isDirectory() || filename === "en.json") continue;
    const ext = filename.split('.').slice(1).join('.');
    if(ext !== "json") continue;
    files.push(filename);
  }
} else {
  for(const filePath of args) {
    if(!filePath.startsWith(langFolder)) continue;
    files.push(path.basename(filePath));
  }
}
let file = fs.readFileSync(path.join(langFolder, "en.json"), "utf8");
let tmpl;
try {
  tmpl = Object.entries(JSON.parse(file).strings);
} catch(err) {
  console.log(`\x1b[31mTemplate file is corrupt, aborting\x1b[0m`);
  process.exitCode = 1;
  return;
}
let failed = false;
for(const filename of files) {
  const dirPath = path.join(langFolder, filename);
  if(fs.lstatSync(dirPath).isDirectory()) continue;
  console.log(`Testing locale file ${filename} . . .`);
  file = fs.readFileSync(dirPath, "utf8");
  let arr;
  const diff = [];
  try {
    arr = Object.entries(JSON.parse(file).strings);
  } catch(err) {
    failed = true;
    console.log(`  \x1b[31m${err.message}\x1b[0m`);
    break;
  }
  let different = false;
  for(let i = 0; i < tmpl.length; i++) {
    const oldKey = tmpl[i][0];
    const oldVal = tmpl[i][1];
    const newKey = i < arr.length ? arr[i][0] : null;
    const newVal = i < arr.length ? arr[i][1] : null;
    if(oldKey === newKey) continue;
    failed = different = true;
    diff.push({actual: [newKey, newVal], expected: [oldKey, oldVal]});
  }
  if(different) {
    for(const elem of diff) {
      const actual = elem.actual;
      const expected = elem.expected;
      console.log(`  \x1b[31m-\t"${actual[0]}": "${actual[1]}"\x1b[0m`);
      console.log(`  \x1b[32m+\t"${expected[0]}": "${actual[1]}"\x1b[0m`);
    }
    console.log(`  \x1b[32m+ expected\x1b[0m \x1b[31m- actual\x1b[0m`);
    console.log(`  \x1b[31mError: File contents differ.\x1b[0m`);
  } else {
    console.log(`  \x1b[32mAll checks passed\x1b[0m`);
  }
}
if(failed) process.exitCode = 1;
