import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Offline APP build — the REAL ClassNest SPA, no Node server.
 * Used only by `npm run pack:portable`. Live preview still uses vite.config.ts.
 */
export default defineConfig({
  base: "/",
  publicDir: false,
  build: {
    outDir: "dist-portable",
    emptyOutDir: true,
    sourcemap: false,
  },
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    tanstackStart({
      spa: { enabled: true },
      importProtection: {
        enabled: true,
        behavior: { build: "mock" },
      },
    }),
    viteReact(),
  ],
});
