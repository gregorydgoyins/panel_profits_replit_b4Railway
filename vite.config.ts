import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,           // listen on all interfaces
    port: 3000,
    strictPort: true,
    allowedHosts: true,   // allow replit preview hosts
    hmr: {
      protocol: 'wss',    // Replit preview runs behind HTTPS
      clientPort: 443,    // force WS to 443 so it connects in preview
    },
    watch: {
      usePolling: true,
      interval: 300,      // avoid ENOSPC (watcher limit)
    },
  },
})
