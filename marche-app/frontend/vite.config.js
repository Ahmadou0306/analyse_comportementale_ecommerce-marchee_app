import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// En Docker, le backend est accessible via le nom du service "backend"
// En dev local, il tourne sur localhost:5000
const backendUrl = process.env.VITE_API_URL || 'http://localhost:5000'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    logLevel: 'info',
    proxy: {
      '/api': {
        target: backendUrl,
        changeOrigin: true,
      },
      '/images': {
        target: backendUrl,
        changeOrigin: true,
      },
    },
  },
})
