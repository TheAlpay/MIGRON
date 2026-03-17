import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: false, // Security: hide source code in production
  },
  server: {
    proxy: {
      // All /api/* routes → vercel dev server (port 3000)
      // Run `vercel dev` alongside `npm run dev` for full functionality.
      // Without vercel dev, camera widget falls back to YouTube streams.
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
