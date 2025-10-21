import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allow external access (for Replit, Render, etc.)
    port: 3000,
    strictPort: true,
    allowedHosts: true, // fixes Replit “blocked host” error
    hmr: {
      protocol: "wss", // secure WebSocket for Replit preview
      clientPort: 443, // match HTTPS port
    },
    watch: {
      usePolling: true, // prevents ENOSPC file watcher crash
      interval: 300,
    },
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
});
