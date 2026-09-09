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
 *
 * Un panier à 12 unités : la remise Artisan est déclenchée et la jauge vers le
 * palier grossiste est visible. Partagé par les deux vues du panier, pour
 * qu'elles montrent le même contenu à deux largeurs.
 */
const remplirPanier = async () => {
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
}

const vues = [
  { nom: "01-hero.webp", selecteur: null, largeur: 1280, hauteur: 900 },
  // 980 et non 900 : la note sur les cartes a rallongé la première rangée,
  // dont le prix et le bouton se retrouvaient coupés.
  { nom: "02-catalogue.webp", selecteur: "#catalogue", largeur: 1280, hauteur: 980 },
  { nom: "03-tarifs.webp", selecteur: "#tarifs", largeur: 1280, hauteur: 900 },
  { nom: "04-mobile.webp", selecteur: null, largeur: 420, hauteur: 860 },
  {
    /*
     * Le catalogue en 420 px : filtres qui passent à la ligne, tri et
     * recherche empilés, une carte par rangée. La hauteur s'arrête au bas de
     * la première carte — 1135 px sous le haut de section, plus le bandeau —
     * pour ne pas laisser dépasser un liseré de la suivante.
     */
    nom: "13-catalogue-mobile.webp",
    selecteur: "#catalogue",
    largeur: 420,
    hauteur: 1180,
  },
  {
    nom: "06-produit.webp",
    url: `${URL_SITE}?produit=enduit-lissage-25`,
    selecteur: null,
    largeur: 1280,
    hauteur: 780,
  },
  {
    /*
     * La même fiche qu'en 1280 px, à 420 : tout passe en une colonne et le
     * tableau des paliers se réempile. La hauteur descend jusqu'au bas de ce
     * tableau — mesuré à 1145 px —, qui est ce que la largeur mobile met le
     * plus à l'épreuve.
     */
    nom: "12-produit-mobile.webp",
    url: `${URL_SITE}?produit=enduit-lissage-25`,
    selecteur: null,
    largeur: 420,
    hauteur: 1180,
  },
  {
    nom: "07-introuvable.webp",
    url: `${URL_SITE}?produit=reference-supprimee`,
    selecteur: null,
    largeur: 1280,
    hauteur: 820,
  },
  {
    // La référence la plus commentée : c'est la seule dont la liste dépasse
    // une page, donc la seule où la pagination se voit.
    nom: "09-avis.webp",
    url: `${URL_SITE}?produit=rouleau-laqueur-18`,
    selecteur: "#titre-avis",
    largeur: 1280,
    hauteur: 2300,
  },
  {
    /*
     * Le pied de page se prend par le bas et non au sélecteur : arrivé en
     * butée de défilement, la correction du bandeau collé rognerait d'autant
     * le bas de la capture. La hauteur vaut celle du pied plus le bandeau,
     * qui recouvre exactement la bande de section restée au-dessus.
     */
    nom: "10-pied.webp",
    bas: true,
    selecteur: null,
    largeur: 1280,
    hauteur: 404,
  },
  {
    // Page servie par l'hébergeur : elle vit hors de l'application, d'où
    // l'URL directe vers le fichier.
    nom: "08-404.webp",
    url: `${URL_SITE}404.html`,
    selecteur: null,
    largeur: 1280,
    hauteur: 720,
  },
  {
    nom: "05-panier.webp",
    selecteur: null,
    largeur: 1280,
    hauteur: 900,
    prepare: remplirPanier,
  },
  {
    // Le même panier en 420 px : le panneau latéral y occupe tout l'écran.
    nom: "11-panier-mobile.webp",
    selecteur: null,
    largeur: 420,
    hauteur: 860,
    prepare: remplirPanier,
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

    if (vue.bas) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    }

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

    const nom = vue.nom.replace(/\.webp$/, `${theme.suffixe}.webp`)
    // WebP plutôt que PNG : environ six fois plus léger pour un dépôt qui
    // versionne ses images. Qualité haute, le texte d'interface étant ce qui
    // souffre le plus d'une compression avec pertes.
    await page.screenshot({ path: path.join(DOSSIER, nom), type: "webp", quality: 92 })
    console.log(`${nom}  ${vue.largeur}×${vue.hauteur}`)
    await page.close()
  }
  await contexte.close()
  }
} finally {
  await navigateur.close()
}
