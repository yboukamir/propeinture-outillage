export type Produit = {
  id: string
  nom: string
  prix: number
  unite: string
  detail: string
  categorie: string
  reference: string
  stock: "en-stock" | "reappro"
  /** Chemin servi depuis `public/`, voir public/produits/SOURCES.md. */
  photo: string
  photoAlt: string
  populaire?: boolean
}

export const produits: Produit[] = [
  {
    id: "rouleau-laqueur-18",
    nom: "Rouleau laqueur 18 cm",
    prix: 9.9,
    unite: "pièce",
    detail: "Fibre courte 4 mm",
    categorie: "Application",
    reference: "RL-18-04",
    stock: "en-stock",
    photo: "/produits/rouleau-laqueur.webp",
    photoAlt: "Rouleau à peinture blanc posé sur un fond clair",
    populaire: true,
  },
  {
    id: "pinceau-plat-40",
    nom: "Pinceau plat n°40",
    prix: 6.5,
    unite: "pièce",
    detail: "Soie synthétique",
    categorie: "Application",
    reference: "PP-40-SY",
    stock: "en-stock",
    photo: "/produits/pinceau-plat.webp",
    photoAlt: "Pinceau plat de peintre sur fond uni",
  },
  {
    id: "bache-4x5",
    nom: "Bâche de protection 4 × 5 m",
    prix: 14.9,
    unite: "pièce",
    detail: "Polyéthylène 100 µ",
    categorie: "Protection",
    reference: "BP-450-100",
    stock: "en-stock",
    photo: "/produits/bache-protection.webp",
    photoAlt: "Bâche drapée formant des plis profonds",
  },
  {
    id: "enduit-lissage-25",
    nom: "Enduit de lissage 25 kg",
    prix: 28,
    unite: "sac",
    detail: "Poudre à gâcher, intérieur",
    categorie: "Préparation",
    reference: "EL-25-INT",
    stock: "reappro",
    photo: "/produits/enduit-lissage.webp",
    photoAlt: "Application d'enduit sur un mur à la truelle",
    populaire: true,
  },
  {
    id: "ruban-masquage-50",
    nom: "Ruban de masquage pro 50 m",
    prix: 4.2,
    unite: "rouleau",
    detail: "Arêtes nettes, retrait sans trace",
    categorie: "Protection",
    reference: "RM-50-PRO",
    stock: "en-stock",
    photo: "/produits/ruban-masquage.webp",
    photoAlt: "Rouleau de ruban de masquage sur fond jaune",
  },
  {
    id: "grille-essorage",
    nom: "Grille d'essorage universelle",
    prix: 7.9,
    unite: "pièce",
    detail: "Compatible seaux 10 à 20 L",
    categorie: "Accessoires",
    reference: "GE-UNI",
    stock: "en-stock",
    photo: "/produits/grille-essorage.webp",
    photoAlt: "Rouleau chargé de peinture dans son bac",
  },
]

export const categories = [
  {
    titre: "Application",
    photo: "/produits/categorie-application.webp",
    alt: "Rouleaux à peinture de couleurs vives",
  },
  {
    titre: "Préparation",
    photo: "/produits/categorie-preparation.webp",
    alt: "Mur fraîchement enduit",
  },
  {
    titre: "Protection",
    photo: "/produits/bache-protection.webp",
    alt: "Bâche de protection drapée",
  },
  {
    titre: "Accessoires",
    photo: "/produits/categorie-accessoires.webp",
    alt: "Pots de peinture vus de dessus",
  },
]
