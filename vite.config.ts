import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // 로컬 개발: '/', 프로덕션 빌드: '/tds_ssot/'
  base: command === 'serve' ? '/' : '/tds_ssot/',
  build: {
    outDir: 'docs',
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  appType: 'spa',
}))
