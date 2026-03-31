import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : '/tds_ssot/shared-v2/',
  plugins: [react(), svgr({ svgrOptions: { icon: true }, include: '**/*.svg?component' })],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../src'),
      '@': path.resolve(__dirname, '../src'),
    },
  },
  css: {
    postcss: __dirname,
  },
  build: {
    outDir: '../../docs/shared-v2',
    emptyOutDir: true,
  },
  server: {
    port: 5174,
    fs: {
      allow: [path.resolve(__dirname, '..')],
    },
  },
}));
