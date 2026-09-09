/**
 * Régénère les captures du README à partir du serveur de dev.
 *
 *   npm run dev        # dans un terminal
 *   npm run captures   # dans un autre
 *
 * S'appuie sur le Chrome installé sur la machine (puppeteer-core ne télécharge
 * aucun navigateur). Surcharger au besoin :
 *   CHROME_PATH="/chemin/vers/chrome" npm run captures
 */
import { mkdir } from "node:fs/promises"
import { existsSync } from "node:fs"
import path from "node:path"
import puppeteer from "puppeteer-core"

const URL_SITE = process.env.URL_SITE ?? "http://localhost:5173/"
const DOSSIER = path.resolve("docs/captures")

const CHEMINS_CHROME = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean)

const executablePath = CHEMINS_CHROME.find((p) => existsSync(p))
if (!executablePath) {
  console.error(
    "Aucun Chrome trouvé. Indiquez-le avec CHROME_PATH=... npm run captures",
  )
  process.exit(1)
}

/** Hauteur du bandeau de démonstration, qui reste collé en haut. */
const BANDEAU = 44

/**
 * `prepare` s'exécute dans la page avant la capture, pour les vues qui
 * demandent une interaction (le panier n'existe qu'une fois rempli).
 */
const vues = [
  { nom: "01-hero.png", selecteur: null, largeur: 1280, hauteur: 900 },
  { nom: "02-catalogue.png", selecteur: "#catalogue", largeur: 1280, hauteur: 900 },
  { nom: "03-tarifs.png", selecteur: "#tarifs", largeur: 1280, hauteur: 900 },
  { nom: "04-mobile.png", selecteur: null, largeur: 420, hauteur: 860 },
  {
    nom: "06-produit.png",
    url: `${URL_SITE}?produit=enduit-lissage-25`,
    selecteur: null,
    largeur: 1280,
    hauteur: 780,
  },
  {
    nom: "05-panier.png",
    selecteur: null,
    largeur: 1280,
    hauteur: 900,
    // Un panier à 12 unités : la remise Artisan est déclenchée et la jauge
    // vers le palier grossiste est visible.
    prepare: async () => {
      const attendre = (ms) => new Promise((r) => setTimeout(r, ms))
      const ajouter = [...document.querySelectorAll("button")].filter(
        (b) => b.textContent.trim() === "Ajouter",
      )
      ajouter[0].click()
      await attendre(400)
      ajouter[3].click()
      await attendre(400)
      const plus = [...document.querySelectorAll("[role=dialog] button")].filter(
        (b) => b.getAttribute("aria-label")?.startsWith("Ajouter une unité"),
      )
      for (let i = 0; i < 10; i++) {
        plus[0].click()
        await attendre(40)
      }
      // Sinon le dernier bouton cliqué garde son anneau de focus sur l'image.
      document.activeElement?.blur()
      await attendre(400)
    },
  },
]

await mkdir(DOSSIER, { recursive: true })

const navigateur = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ["--hide-scrollbars", "--disable-gpu"],
})

/**
 * Le thème se choisit en émulant la préférence système : le script de
 * index.html la résout au chargement, aucun stockage à préparer. Chaque thème
 * tourne dans un contexte neuf pour qu'un `localStorage` laissé par le
 * précédent ne vienne pas l'écraser.
 */
const themes = [
  { nom: "clair", media: "light", suffixe: "" },
  { nom: "sombre", media: "dark", suffixe: "-sombre" },
]

try {
  for (const theme of themes) {
  const contexte = await navigateur.createBrowserContext()
  for (const vue of vues) {
    const page = await contexte.newPage()
    await page.emulateMediaFeatures([
      { name: "prefers-color-scheme", value: theme.media },
    ])
    await page.setViewport({ width: vue.largeur, height: vue.hauteur })
    await page.goto(vue.url ?? URL_SITE, { waitUntil: "networkidle0" })

    if (vue.selecteur) {
      // scrollIntoView puis correction du bandeau collé, sinon il recouvre le
      // haut de la section capturée.
      await page.evaluate((sel, decalage) => {
        const cible = document.querySelector(sel)
        cible.scrollIntoView()
        window.scrollBy(0, -decalage)
      }, vue.selecteur, BANDEAU)
    }

    // Les images sont en `loading="lazy"` : le défilement en déclenche le
    // chargement, on attend donc que le réseau se calme à nouveau. Pas de
    // `decode()` ici — sur une image restée hors écran, elle ne se résout
    // jamais et bloque le script.
    await page.waitForNetworkIdle({ idleTime: 500, timeout: 8000 }).catch(() => {})

    // Laisse les apparitions CSS (600 ms + cascade) se terminer.
    await new Promise((r) => setTimeout(r, 1200))

    if (vue.prepare) {
      await page.evaluate(vue.prepare)
      await new Promise((r) => setTimeout(r, 600))
    }

    const nom = vue.nom.replace(/\.png$/, `${theme.suffixe}.png`)
    await page.screenshot({ path: path.join(DOSSIER, nom) })
    console.log(`${nom}  ${vue.largeur}×${vue.hauteur}`)
    await page.close()
  }
  await contexte.close()
  }
} finally {
  await navigateur.close()
}
