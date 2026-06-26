import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import viteReact from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [
    tanstackStart({
      srcDirectory: './app',
      routesDirectory: './app/routes',
      generatedRouteTree: './app/routeTree.gen.ts',
    }),
    tailwindcss(),
    viteReact(),
  ],
  resolve: {
    alias: {
      '~': path.resolve(import.meta.dirname, './app'),
      '@journey-map/types': path.resolve(import.meta.dirname, '../../packages/types/src/index.ts'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
