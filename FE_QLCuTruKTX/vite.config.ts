import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 🔥 PORT BACKEND ĐÚNG: 5160 (xem trong launchSettings.json)
const BACKEND = "http://localhost:5160";

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    strictPort: true,
    host: true,

    proxy: {
      // ===== API =====
      "/api": {
        target: BACKEND,
        changeOrigin: true,
        secure: false,
      },

      // ===== SignalR Hubs =====
      "/hubs": {
        target: BACKEND,
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
