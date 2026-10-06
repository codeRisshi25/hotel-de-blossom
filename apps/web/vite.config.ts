import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// API requests go to the local Pages Functions runner (apps/api, port 8788).
// Set API_ORIGIN to point the dev site at a deployed backend instead.
const apiOrigin = process.env.API_ORIGIN ?? "http://127.0.0.1:8788";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  envDir: "../..",
  envPrefix: ["VITE_", "PUBLIC_"],
  server: {
    port: 5173,
    proxy: { "/api": { target: apiOrigin, changeOrigin: true } },
  },
  // The workspace package ships TypeScript source, so the prerender bundle must include it.
  ssr: { noExternal: ["@hdb/shared"] },
  build: {
    target: "es2022",
    sourcemap: false,
    rollupOptions: isSsrBuild
      ? undefined
      : {
          output: {
            // Long-lived vendor chunks cache across deploys; page code changes far more often.
            manualChunks(id) {
              if (id.includes("node_modules/gsap") || id.includes("node_modules/@gsap")) return "gsap";
              if (id.includes("node_modules/lenis")) return "lenis";
              if (/node_modules\/(react|react-dom|react-router|scheduler)\//.test(id)) return "react";
            },
          },
        },
  },
}));
