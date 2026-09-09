# ProPeinture Outillage — concept de boutique

Projet de démonstration / portfolio : concept de boutique en ligne d'outillage
et de matériel pour peintres professionnels. **Aucune commande réelle**, aucune
société derrière, aucun paiement branché — un bandeau permanent le rappelle en
haut de page.

**Démo en ligne : https://yboukamir.github.io/propeinture-outillage/**

## Aperçu

![Header et hero : panneau charbon, titre en Barlow Semi Condensed, double appel à l'action et ligne de réassurance](docs/captures/01-hero.webp)

Le hero et sa barre de navigation. Le panneau charbon et l'encoche claire du
header donnent le contraste ; les quatre vignettes de catégories suivent juste
en dessous.

![Grille produits : six cartes avec photo en 4:3, badge best-seller, pastille de stock, prix à l'unité](docs/captures/02-catalogue.webp)

Le catalogue, sa recherche, son tri et ses filtres par catégorie. Chaque carte
porte sa photo en plein cadre, son état de stock, sa référence et son prix à l'unité.

![Fiche produit : grande photo, prix, sélecteur de quantité et tableau du prix unitaire à chaque palier](docs/captures/06-produit.webp)

La fiche produit, atteinte en cliquant une carte. Elle décline le prix unitaire
à chaque palier, en euros plutôt qu'en pourcentage, et porte les avis en bas
de page.

![Panneau panier ouvert : deux lignes avec photo et sélecteur de quantité, jauge vers le palier suivant, remise artisan appliquée au total](docs/captures/05-panier.webp)

Le panier, seule partie réellement fonctionnelle du concept : la remise se
recalcule à chaque changement de quantité et la jauge annonce ce qui manque
pour atteindre le palier suivant.

![Trois paliers tarifaires, celui du milieu en charbon avec la remise en jaune](docs/captures/03-tarifs.webp)

Les tarifs dégressifs. Le palier atteint par le panier en cours y est signalé
« Votre palier ».

<img src="docs/captures/04-mobile.webp" alt="Le hero en 420 px de large : navigation repliée derrière un bouton, contenu en une colonne" width="360">

En mobile, la navigation se replie dans un panneau latéral.

Les deux façons d'échouer, volontairement distinctes :

| Référence inconnue, dans l'appli | Chemin inconnu, servi par l'hébergeur |
|---|---|
| ![Vue « Référence introuvable » : l'identifiant demandé est affiché, avec deux sorties et des suggestions](docs/captures/07-introuvable.webp) | ![Page 404 : grand chiffre en brique, titre et deux liens de retour](docs/captures/08-404.webp) |
| L'adresse est valide, son contenu manque : on garde l'en-tête, le panier et l'URL. | L'adresse n'existe pas : page autonome, hors application. |

Les captures ci-dessus sont en thème clair ; `docs/captures/` contient les
mêmes en sombre, suffixées `-sombre`. Elles se régénèrent toutes, dans les deux
thèmes, avec le serveur de dev lancé :

```bash
npm run captures
```

Le script utilise le Chrome installé sur la machine, sans télécharger de
navigateur (`CHROME_PATH=...` pour en désigner un autre). Le thème est obtenu
en émulant la préférence système, chaque passe dans un contexte de navigation
neuf.

## Stack

- Vite 6 + React 19 + TypeScript
- Tailwind CSS v4 (plugin `@tailwindcss/vite`, thème en variables CSS)
- Composants shadcn/ui (`new-york`, base `stone`) : `button`, `badge`, `card`,
  `separator`, `sheet`
- `lucide-react` pour les icônes ; aucune librairie d'animation, tout est en CSS

## Composants issus du catalogue 21st.dev

Chaque section part d'un composant du catalogue, récupéré via le MCP 21st
(`search` + `get_component`), puis adapté : contenu sorti en props, textes en
français, palette du projet.

| Section | Composant d'origine | Auteur |
|---|---|---|
| Header + hero | [Commerce Hero](https://21st.dev/@bankkroll/components/commerce-hero) | bankkroll |
| Grille produits | [Product Card](https://21st.dev/@ravikatiyar162/components/product-card-2) | ravikatiyar162 |
| Tarifs dégressifs | [Pricing Section 1](https://21st.dev/@shadcnstore/components/pricing-section-1) | shadcnstore |
| Footer | [Minimal Footer](https://21st.dev/@efferd/components/minimal-footer) | efferd |

Les adaptations sont documentées en tête de chaque fichier dans
`src/components/ui/`.

## Le panier et les remises

C'est le seul comportement réel du projet, et le cœur du concept : la remise
dépend du **nombre total d'unités du panier, toutes références confondues**.

| Palier | À partir de | Remise |
|---|---|---|
| Particulier | 1 unité | prix catalogue |
| Artisan | 10 unités | −12 % |
| Chantier / Grossiste | 50 unités | −22 % |

Le barème et les calculs vivent dans [`src/lib/tarifs.ts`](src/lib/tarifs.ts),
en fonctions pures et sans dépendance à React — le reste n'en est que
l'affichage. L'état du panier est un `useReducer` exposé par
[`src/panier/PanierContext.tsx`](src/panier/PanierContext.tsx).

Le panneau annonce en continu ce qui manque pour le palier suivant, et la
section tarifs marque « Votre palier » sur celui qui s'applique. Le bouton
« Commander » est volontairement désactivé : il n'y a ni back-end ni paiement.

## Les avis

Fictifs, comme la boutique et son catalogue — la section le dit explicitement,
un avis inventé se prenant plus facilement au sérieux qu'un prix inventé. Ils
vivent dans [`src/data/avis.ts`](src/data/avis.ts), avec la moyenne calculée à
partir d'eux plutôt que saisie à la main.

Quatre des six références en ont, les deux autres affichant l'absence d'avis :
une vitrine réelle a toujours des fiches sans retour, autant que la maquette le
montre.

Les étoiles sont décoratives et la note est portée par un texte lisible — un
lecteur d'écran annonce « 4,7 sur 5 » au lieu d'énumérer cinq icônes. Là où la
valeur est déjà écrite à côté, ce texte est muselé pour ne pas être annoncé
deux fois.

## Navigation

Quatre états vivent dans l'URL, gérés par
[`src/lib/navigation.ts`](src/lib/navigation.ts) :

- `?produit=<id>` — la fiche produit, ouverte en cliquant une carte ;
- `?categorie=<nom>` — le filtre du catalogue ;
- `?recherche=<terme>` — la recherche ;
- `?tri=prix-asc|prix-desc` — le tri par prix.

Les trois derniers se combinent librement : changer l'un préserve les autres,
car toutes les URL du catalogue passent par un même constructeur.

Pas de routeur : le site est servi en sous-chemin sur GitHub Pages, où des URL
en segments renverraient un 404 sans page de repli, et sa navigation repose sur
des ancres (`#catalogue`) qu'un routeur à hash confisquerait. Les liens restent
partageables, le bouton retour du navigateur défait le filtre comme la fiche, et
une valeur inconnue dégrade proprement — une référence inconnue affiche une vue
« Référence introuvable », une catégorie vide un message, un tri non reconnu
revient à l'ordre du catalogue. Passer à react-router ne toucherait que ce
fichier et `App.tsx`.

Le tri est un `<select>` natif : accessible au clavier et au lecteur d'écran
sans rien réimplémenter, et le menu déroulant reste celui du système.

Les filtres sont de vrais liens plutôt que des boutons, et les quatre vignettes
de catégories du hero pointent sur le filtre correspondant : elles se
contentaient jusque-là de faire défiler vers le catalogue. Le bouton loupe du
header, jusque-là inerte lui aussi, donne le focus au champ de recherche.

La recherche porte sur le nom, le descriptif, la référence et la catégorie.
Les accents sont ignorés — « bache » trouve « Bâche » — et chaque mot saisi
doit apparaître, si bien que « rouleau 18 » isole le rouleau 18 cm. Elle
s'écrit dans l'URL avec `replaceState` et non `pushState` : taper dix lettres
n'ajoute pas dix entrées à l'historique, mais le lien reste copiable.

### Page 404

`404.html` est servie par l'hébergeur pour les chemins inconnus, hors de toute
navigation applicative : elle est donc entièrement autonome — styles en ligne,
ni React ni bundle — et duplique à dessein le petit script de thème, n'ayant
rien à quoi se raccrocher.

Elle est déclarée en entrée de build dans `vite.config.ts` plutôt que déposée
dans `public/` : les fichiers de `public/` sont copiés tels quels, alors qu'une
entrée reçoit la substitution de `%BASE_URL%`. Sans ça, ses liens de retour
pointeraient la racine du domaine au lieu de celle du déploiement — cassés sur
GitHub Pages, qui sert en sous-chemin.

À ne pas confondre avec la vue « Référence introuvable » : là, l'adresse est
valide et seul son contenu manque, donc on reste dans l'application — en-tête,
panier et suggestions intacts — au lieu de servir cette page-ci.

## Démarrer

```bash
npm install
npm run dev
```

Build de production : `npm run build`, puis `npm run preview`.

## Mettre en ligne

Le site est entièrement statique : `dist/` se sert tel quel, sans back-end.

**GitHub Pages** — le dépôt embarque le workflow
[`.github/workflows/pages.yml`](.github/workflows/pages.yml). Après avoir poussé
sur GitHub, activer Pages dans *Settings → Pages → Source : GitHub Actions* ;
chaque push sur `main` republie. Le workflow passe `BASE_PATH` au build, car
Pages sert sur `/<nom-du-depot>/`.

**Netlify ou Vercel** — importer le dépôt, commande de build `npm run build`,
dossier publié `dist`. Rien d'autre à régler : ces hébergeurs servent à la
racine, et `base` vaut `/` par défaut.

Le chemin de déploiement est piloté par la variable `BASE_PATH`, lue dans
`vite.config.ts`. Les fichiers de `public/` sont résolus au travers de
`asset()` ([`src/lib/utils.ts`](src/lib/utils.ts)), pour que le site fonctionne
aussi bien à la racine que dans un sous-chemin :

```bash
BASE_PATH=/mon-depot/ npm run build
```

## Structure

```
404.html             la page d'erreur, autonome et sans bundle
docs/captures/       les images de l'aperçu (WebP, clair et sombre)
scripts/captures.mjs le script qui les régénère
src/
  components/
    ui/               composants shadcn/ui + les 4 composants 21st adaptés
    sections/         BandeauDemo, Hero, GrilleProduits, TarifsDegressifs,
                      BandeLivraison, Footer, PageProduit, AvisClients,
                      ProduitIntrouvable,
                      PanierPanneau —
                      de fines enveloppes qui alimentent les composants ui/
                      en contenu français
    Marque.tsx        le logo, partagé header / footer
    BasculeTheme.tsx  le bouton clair / sombre
    Etoiles.tsx       la note en étoiles
    SuggestionsProduits.tsx  grille partagée fiche / introuvable
    EnTeteProduit.tsx en-tête sobre de la fiche produit
  data/avis.ts        les avis fictifs et le calcul de la moyenne
  data/produits.ts    les 6 références du catalogue + les 4 catégories
  lib/navigation.ts   fiche produit, filtre et recherche dans l'URL
  lib/tarifs.ts       le barème dégressif, en fonctions pures
  lib/theme.ts        clair / sombre, avec suivi de la préférence système
  lib/utils.ts        cn(), prix en euros (fr-FR), normalisation pour la recherche
  panier/             l'état du panier (useReducer + contexte)
  index.css           palette, polices et thème Tailwind v4
```

## Palette et typographie

Univers artisanal / BTP plutôt que SaaS, construit sur un écart de valeurs
franc : chaux `#f3eee4` en fond de page, blanc pur `#ffffff` pour les cartes
produit — ce sont les photos qui doivent porter la couleur —, charbon `#15110d`
pour ancrer le hero, le palier tarifaire mis en avant et le footer, brique
brûlée `#b23c17` en couleur principale et jaune de balisage `#f0a81c` en accent.
Deux motifs accompagnent le thème : `bg-tarp` / `bg-tarp-dark` (trame diagonale
façon bâche) et `bg-hazard` (liseré de balisage).

Titres et marque en **Barlow Semi Condensed** (police de signalétique), texte
courant en **Inter**, les deux chargées depuis Google Fonts dans `index.html`.

## Mode sombre

Tout le thème passant par des jetons sémantiques (`--background`, `--primary`…),
le mode sombre se résume à redéfinir leurs valeurs sous
`:root[data-theme="dark"]` : aucun composant n'a à connaître le mode.

| Clair | Sombre |
|---|---|
| ![Catalogue en thème clair](docs/captures/02-catalogue.webp) | ![Catalogue en thème sombre](docs/captures/02-catalogue-sombre.webp) |

La bascule est dans les deux en-têtes. Sans choix explicite, la préférence
système est suivie et continue de l'être si elle change ; un clic enregistre un
choix dans `localStorage` qui prend alors le dessus. Un script en ligne dans
`index.html` pose `data-theme` avant la feuille de styles, sinon la page
apparaîtrait en clair avant de basculer.

Deux ajustements ont été nécessaires, le reste suivant tout seul : la brique
s'éclaircit — à sa valeur claire elle passait sous le seuil de lisibilité en
texte sur fond sombre — et le palier tarifaire mis en avant reçoit un liseré
d'accent, son fond charbon ne le distinguant plus quand toutes les cartes sont
déjà sombres. Les contrastes des deux thèmes ont été mesurés dans le
navigateur : tous au-dessus du seuil AA (le plus bas, le libellé de catégorie
en brique sur carte, est à 5,06 en sombre et 5,91 en clair).

## Photos

Les visuels produit et catégories sont dans `public/produits/` (WebP, 1000 px de
large) et référencés par leur chemin dans `data/produits.ts` — aucune dépendance
réseau à l'exécution. Leur provenance est listée dans
[`public/produits/SOURCES.md`](public/produits/SOURCES.md). Pour une vraie
boutique, remplacer les fichiers en gardant les mêmes noms.

## Notes

- Tous les boutons sont inertes : c'est une maquette de style, pas une
  boutique. Aucun panier, aucun back-end, aucun moyen de paiement branché.
- Les apparitions et les effets de survol sont en CSS pur, sans librairie
  d'animation. L'utilitaire `animate-apparition` (défini dans `index.css`) monte
  en `animation-fill-mode: both`, donc l'élément finit toujours visible ; la
  cascade se règle avec `animation-delay` en style inline, et tout est neutralisé
  sous `prefers-reduced-motion: reduce`.
- Si vous déplacez le projet dans un dossier Windows redirigé (OneDrive, dossier
  d'une application packagée), le serveur de dev peut servir les sources non
  transformées : il faut alors ancrer `root` sur `fs.realpathSync(__dirname)` et
  poser `server.fs.strict: false` dans `vite.config.ts`. Inutile ici.
