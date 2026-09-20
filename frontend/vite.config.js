import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GeoShield AI — Frontend Vite Config
// Proxies /api → Node.js Gateway (port 5000)
// Proxies /py  → Python FastAPI Engine (port 8000)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/py': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/py/, ''),
      },
    },
  },
})
