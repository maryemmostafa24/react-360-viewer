import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = path.join(rootDir, 'dist/index.js');
const importLine = 'import "./styles.css";';

let js = await readFile(indexPath, 'utf8');

if (!js.includes(importLine)) {
    js = js.replace('"use client";\n', `"use client";\n${importLine}\n`);
    await writeFile(indexPath, js, 'utf8');
}
