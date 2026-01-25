import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Read version from package.json for injection into app
import { readFileSync } from 'node:fs';
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig({
  plugins: [react()],
  define: {
    // Inject app version at build time
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  // Base path for deployment - defaults to '/' for local dev
  // Set VITE_BASE_PATH env var for GitHub Pages (e.g., '/repo-name/')
  base: process.env.VITE_BASE_PATH || '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // Raise chunk size warning limit slightly (default 500KB)
    // Our vendor chunk is ~510KB which is acceptable for a PWA
    chunkSizeWarningLimit: 520,
    rollupOptions: {
      output: {
        manualChunks(id): string | undefined {
          // MUI is the largest dependency - isolate it for better caching
          // Include Emotion (MUI's styling engine) to keep them together
          if (id.includes('node_modules/@mui') || id.includes('node_modules/@emotion')) {
            return 'vendor-mui';
          }

          // Everything else from node_modules goes into vendor
          // Keeping React with its dependents avoids circular chunk warnings
          if (id.includes('node_modules')) {
            return 'vendor';
          }

          return undefined;
        },
      },
    },
  },
});
