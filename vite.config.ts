/// <reference types="vitest/config" />
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
  /*
   * Les tests portent sur les modules purs — barème, URL, tri et intégrité
   * des données. Pas d'environnement DOM : ce qui touche à l'écran est
   * vérifié dans un vrai navigateur, pas dans une imitation.
   */
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  build: {
    rollupOptions: {
      /*
       * `404.html` est déclarée en entrée — et non déposée dans `public/` —
       * pour que Vite y substitue `%BASE_URL%`. Les fichiers de `public/` sont
       * copiés tels quels : les liens de retour pointeraient alors la racine du
       * domaine au lieu de celle du déploiement.
       */
      input: {
        index: path.resolve(__dirname, "index.html"),
        "404": path.resolve(__dirname, "404.html"),
      },
    },
  },
})
