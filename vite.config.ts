import path from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  /*
   * Racine du déploiement. Netlify, Vercel ou un domaine dédié servent à la
   * racine et n'ont rien à faire ; GitHub Pages sert sur `/nom-du-depot/` et
   * doit donc passer BASE_PATH au build.
   */
  base: process.env.BASE_PATH ?? "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
