import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",  // relative paths -> works on Netlify AND GitHub Pages subpaths
  plugins: [react()],
  server: {
    proxy: { "/api": "http://localhost:8000" },
  },
});
