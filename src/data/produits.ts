export type Produit = {
  id: string
  nom: string
  prix: number
  unite: string
  detail: string
  categorie: string
  reference: string
  stock: "en-stock" | "reappro"
  illustration: IllustrationId
  populaire?: boolean
}

export type IllustrationId =
  | "rouleau"
  | "pinceau"
  | "bache"
  | "enduit"
  | "ruban"
  | "grille"

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
    illustration: "rouleau",
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
    illustration: "pinceau",
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
    illustration: "bache",
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
    illustration: "enduit",
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
    illustration: "ruban",
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
    illustration: "grille",
  },
]
