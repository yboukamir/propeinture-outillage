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

const vues = [
  { nom: "01-hero.png", selecteur: null, largeur: 1280, hauteur: 900 },
  { nom: "02-catalogue.png", selecteur: "#catalogue", largeur: 1280, hauteur: 900 },
  { nom: "03-tarifs.png", selecteur: "#tarifs", largeur: 1280, hauteur: 900 },
  { nom: "04-mobile.png", selecteur: null, largeur: 420, hauteur: 860 },
]

await mkdir(DOSSIER, { recursive: true })

const navigateur = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ["--hide-scrollbars", "--disable-gpu"],
})

try {
  for (const vue of vues) {
    const page = await navigateur.newPage()
    await page.setViewport({ width: vue.largeur, height: vue.hauteur })
    await page.goto(URL_SITE, { waitUntil: "networkidle0" })

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

    const fichier = path.join(DOSSIER, vue.nom)
    await page.screenshot({ path: fichier })
    console.log(`${vue.nom}  ${vue.largeur}×${vue.hauteur}`)
    await page.close()
  }
} finally {
  await navigateur.close()
}
