const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react");
const path = require("path");
module.exports = defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  server: { host: true, port: 5173, strictPort: true },
  preview:{ host: true, port: 4173, strictPort: true },
  build: { sourcemap: true }
});
