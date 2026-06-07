import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const STYLE_ID = 'mmmmzxe-react-360-viewer-styles';
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cssPath = path.join(rootDir, 'dist/styles.css');
const injectPath = path.join(rootDir, 'dist/inject-styles.js');
const indexPath = path.join(rootDir, 'dist/index.js');

let css = await readFile(cssPath, 'utf8');

// Never leak :root/:host — those override the host app's entire shadcn theme.
css = css.replace(/:root,:host/g, '[data-viewer-360]');
css = css.replace(/:root\b/g, '[data-viewer-360]');

// Keep @keyframes global so animate-ping / animate-spin work inside @scope.
const keyframesRegex = /@keyframes\s+[\w-]+\{(?:[^{}]|\{[^{}]*\})*\}/g;
const keyframes = css.match(keyframesRegex)?.join('') ?? '';
const scopedCss = css.replace(keyframesRegex, '').trim();

// Wrap utilities in @scope so they never touch elements outside the viewer.
css = `${keyframes}\n@scope ([data-viewer-360]) {\n${scopedCss}\n}`;

const escapedCss = css.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

const injectSource = `"use client";

const STYLE_ID = "${STYLE_ID}";

const viewer360Styles = \`${escapedCss}\`;

export function injectViewer360Styles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = viewer360Styles;
  document.head.appendChild(style);
}

injectViewer360Styles();
`;

await writeFile(injectPath, injectSource, 'utf8');

let indexSource = await readFile(indexPath, 'utf8');

if (!indexSource.includes('./inject-styles.js')) {
    indexSource = indexSource.replace('"use client";', '"use client";\nimport "./inject-styles.js";');
    await writeFile(indexPath, indexSource, 'utf8');
}
