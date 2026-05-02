import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const BACKEND = 'https://fastapi-railway-app-production.up.railway.app';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: BACKEND,
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
