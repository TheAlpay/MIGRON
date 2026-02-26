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
      // Proxy /api/* to a local Express-like handler during dev.
      // Since Vercel serverless functions don't run natively in vite dev,
      // we proxy to vercel dev server on port 3000 if running, otherwise
      // the request will hit the vite server (404) and the catch block
      // in AiTerminal.jsx will show the actual error message.
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // Only active if you run `vercel dev` alongside `npm run dev`
        // Otherwise the AI widget shows the actual error in the chat.
      }
    }
  }
})
