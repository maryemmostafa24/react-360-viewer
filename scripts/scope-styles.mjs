import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cssPath = path.join(rootDir, 'dist/styles.css');

let css = await readFile(cssPath, 'utf8');

// Never leak :root/:host — those override the host app's entire theme.
css = css.replace(/:root,:host/g, '[data-viewer-360]');
css = css.replace(/:root\b/g, '[data-viewer-360]');

// Keep @keyframes global so animate-ping / animate-spin work inside @scope.
const keyframesRegex = /@keyframes\s+[\w-]+\{(?:[^{}]|\{[^{}]*\})*\}/g;
const keyframes = css.match(keyframesRegex)?.join('') ?? '';
const scopedCss = css.replace(keyframesRegex, '').trim();

// Wrap utilities in @scope so they never touch elements outside the viewer.
css = `${keyframes}\n@scope ([data-viewer-360]) {\n${scopedCss}\n}`;

await writeFile(cssPath, css, 'utf8');
