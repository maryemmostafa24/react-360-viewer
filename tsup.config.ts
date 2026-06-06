import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'tsup';

const packageSrc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src');

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    external: ['react', 'react-dom', 'lucide-react'],
    esbuildOptions(options) {
        options.alias = {
            '@': packageSrc,
        };
        options.banner = {
            js: '"use client";',
        };
    },
});
