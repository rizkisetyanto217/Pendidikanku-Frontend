// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import * as path from "path";

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      // semua request ke /api diarahkan ke Railway
      "/api": {
        target: "https://schoolkubackend4-production.up.railway.app",
        changeOrigin: true,
        secure: true,
        // tetap biarkan prefix /api (backend kamu memang /api/…)
        rewrite: (p) => p.replace(/^\/api/, "/api"),
      },
    },
  },
});
