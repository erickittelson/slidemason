import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
import { studioApiPlugin, recentApiEdits } from './vite-plugin-studio-api';

const MONO_ROOT = resolve(__dirname, '../..');

/**
 * Ensures imports resolve correctly from files outside the studio app root
 * (e.g. decks/<slug>/slides.tsx). Uses Vite's own resolution but pretends
 * the import came from within the studio app so pnpm can find packages.
 */
function monorepoResolvePlugin(): Plugin {
  const studioSrc = resolve(__dirname, 'src');
  const studioEntry = resolve(studioSrc, 'main.tsx');

  // Packages that deck files might import
  const redirectPkgs = new Set([
    'react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime',
    'framer-motion', 'lucide-react',
  ]);

  return {
    name: 'slidemason-monorepo-resolve',
    handleHotUpdate({ file, server }) {
      // When any deck's slides.tsx changes, force a full page reload
      // because import.meta.glob eager cache can't be HMR'd.
      // BUT skip the reload if the change came from the studio's inline
      // editor — the DOM already has the update and reloading would
      // reset slide position and disrupt the editing flow.
      if (file.includes('/decks/') && file.endsWith('/slides.tsx')) {
        if (recentApiEdits.has(file)) {
          return []; // suppress reload — inline edit already in DOM
        }
        server.ws.send({ type: 'full-reload' });
        return [];
      }
    },
    async resolveId(source, importer, options) {
      // Only intercept imports from files outside the studio app
      if (!importer || importer.startsWith(studioSrc)) return null;

      // Workspace package — point directly to source
      if (source === '@slidemason/renderer') {
        return resolve(MONO_ROOT, 'packages/renderer/src/index.ts');
      }

      if (source === '@slidemason/primitives') {
        return resolve(MONO_ROOT, 'packages/primitives/src/index.ts');
      }

      // Re-resolve through the studio app so pnpm's strict isolation is satisfied
      if (redirectPkgs.has(source)) {
        const resolved = await this.resolve(source, studioEntry, {
          ...options,
          skipSelf: true,
        });
        return resolved;
      }

      return null;
    },
  };
}

export default defineConfig({
  plugins: [
    monorepoResolvePlugin(),
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
      '@generated': resolve(MONO_ROOT, 'generated'),
    },
  },
});
