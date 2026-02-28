import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
import { studioApiPlugin } from './vite-plugin-studio-api';

export default defineConfig({
  plugins: [
    { enforce: 'pre', ...mdx({ providerImportSource: '@mdx-js/react' }) },
    react(),
    tailwindcss(),
    studioApiPlugin(),
  ],
  server: {
    port: 4200,
  },
  resolve: {
    conditions: ['source'],
    alias: {
      '@generated': resolve(__dirname, '../../generated'),
    },
  },
});
