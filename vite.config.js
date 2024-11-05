import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    open: true, // automatically open browser
    host: true, // needed for proper network access
    strictPort: false, // allow fallback ports if default is busy
    headers: {
      'Content-Type': 'application/javascript'
    }
  }
})