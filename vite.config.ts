import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import type { Connect } from 'vite'

// Middleware to redirect non-base paths to base path
function redirectToBaseMiddleware(): Connect.NextHandleFunction {
  return (req, res, next) => {
    const base = '/topology'
    const url = req.url || '/'
    
    // Skip if already has base path, or is a Vite internal path
    if (url.startsWith(base) || url.startsWith('/@') || url.startsWith('/node_modules')) {
      return next()
    }
    
    // Skip static assets
    if (url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
      return next()
    }
    
    // Redirect to base path
    const newUrl = base + url
    res.writeHead(302, { Location: newUrl })
    res.end()
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/topology/',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'redirect-to-base',
      configureServer(server) {
        server.middlewares.use(redirectToBaseMiddleware())
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  appType: 'spa',
})
