export type Produit = {
  id: string
  nom: string
  prix: number
  unite: string
  detail: string
  categorie: string
  reference: string
  stock: "en-stock" | "reappro"
  /** Identifiant de photo Unsplash, voir `imageUrl()` dans lib/utils. */
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
    photo: "photo-1516962080544-eac695c93791",
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
    photo: "photo-1513364776144-60967b0f800f",
    photoAlt: "Pinceaux alignés sur un textile",
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
    photo: "photo-1783361728036-94e0ff894f21",
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
    photo: "photo-1768839725085-829e6ac7ac26",
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
    photo: "photo-1536356915696-c6bf1c01da46",
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
    photo: "photo-1652829069862-87874e119527",
    photoAlt: "Rouleau chargé de peinture dans son bac",
  },
]

export const categories = [
  {
    titre: "Application",
    photo: "photo-1525909002-1b05e0c869d8",
    alt: "Rouleaux à peinture de couleurs vives",
  },
  {
    titre: "Préparation",
    photo: "photo-1639430257115-f63af9eab97d",
    alt: "Mur fraîchement enduit",
  },
  {
    titre: "Protection",
    photo: "photo-1783361728036-94e0ff894f21",
    alt: "Bâche de protection drapée",
  },
  {
    titre: "Accessoires",
    photo: "photo-1456086272160-b28b0645b729",
    alt: "Pots de peinture vus de dessus",
  },
]
