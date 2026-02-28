import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [
    { enforce: 'pre', ...mdx({ providerImportSource: '@mdx-js/react' }) },
    react(),
    tailwindcss(),
  ],
  server: {
    port: 4200,
  },
  resolve: {
    alias: {
      '@generated': resolve(__dirname, '../../generated'),
    },
  },
});
