import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// API requests go to the local Pages Functions runner (apps/api, port 8788).
// Set API_ORIGIN to point the dev site at a deployed backend instead.
const apiOrigin = process.env.API_ORIGIN ?? "http://127.0.0.1:8788";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  envDir: "../..",
  envPrefix: ["VITE_", "PUBLIC_"],
  server: {
    port: 5173,
    proxy: { "/api": { target: apiOrigin, changeOrigin: true } },
  },
  build: { target: "es2022", sourcemap: false },
});
