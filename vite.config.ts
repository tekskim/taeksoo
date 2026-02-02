import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { execSync } from 'child_process'

// Changelog 생성 플러그인
function generateChangelogPlugin() {
  return {
    name: 'generate-changelog',
    buildStart() {
      try {
        console.log('📝 Generating changelog from git commits...')
        execSync('node scripts/generate-changelog.cjs', { stdio: 'inherit' })
      } catch (error) {
        console.warn('⚠️ Changelog generation failed:', error)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // 로컬 개발: '/', 프로덕션 빌드: '/tds_ssot/'
  base: command === 'serve' ? '/' : '/tds_ssot/',
  build: {
    outDir: 'docs',
  },
  plugins: [
    generateChangelogPlugin(),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  appType: 'spa',
  server: {
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: false,
    },
  },
}))
