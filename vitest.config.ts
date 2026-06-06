import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const packageSrc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src');

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': packageSrc,
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./test-setup.ts'],
        reporters: ['verbose'],
    },
});
