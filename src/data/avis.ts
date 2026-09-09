/**
 * Avis de démonstration. Ils sont inventés, comme le reste du catalogue et la
 * société elle-même — la section qui les affiche le dit explicitement, pour
 * qu'on ne les prenne pas pour de vrais retours clients.
 */
export type Avis = {
  id: string
  /** Identifiant du produit noté, voir `data/produits.ts`. */
  produit: string
  auteur: string
  metier: string
  /** De 1 à 5. */
  note: number
  /** Format ISO, affiché en toutes lettres. */
  date: string
  texte: string
  /** Nombre de personnes ayant trouvé l'avis utile. Fictif lui aussi. */
  utiles: number
  /** Déposé depuis la page, jamais enregistré : signalé comme tel à l'écran. */
  local?: boolean
}

export const avis: Avis[] = [
  {
    id: "av-1",
    produit: "rouleau-laqueur-18",
    auteur: "Karim B.",
    metier: "Peintre, Lyon",
    note: 5,
    date: "2026-07-14",
    texte:
      "La fibre courte tient bien la laque, pas de peluche sur les portes. J'en prends dix à chaque commande, à ce prix-là je ne les lave même plus entre deux chantiers.",
    utiles: 14,
  },
  {
    id: "av-2",
    produit: "rouleau-laqueur-18",
    auteur: "Sylvie M.",
    metier: "Artisan peintre, Nantes",
    note: 4,
    date: "2026-06-28",
    texte:
      "Bon rendu sur boiseries, rien à dire. Le manche plie un peu quand on appuie fort sur un plafond, mais pour du laquage c'est parfait.",
    utiles: 6,
  },
  {
    id: "av-3",
    produit: "rouleau-laqueur-18",
    auteur: "Thomas L.",
    metier: "Entreprise de peinture, Rennes",
    note: 5,
    date: "2026-05-09",
    texte:
      "Commandé par cinquante pour l'équipe. Qualité constante d'un lot à l'autre, ce qui n'est pas le cas partout.",
    utiles: 9,
  },
  {
    id: "av-4",
    produit: "pinceau-plat-40",
    auteur: "Momo D.",
    metier: "Peintre en bâtiment, Marseille",
    note: 4,
    date: "2026-07-02",
    texte:
      "Soie bien garnie, la coupe reste nette après une dizaine de chantiers. Il perd deux ou trois poils les premiers jours, ensuite plus rien.",
    utiles: 11,
  },
  {
    id: "av-5",
    produit: "pinceau-plat-40",
    auteur: "Élodie R.",
    metier: "Décoratrice, Bordeaux",
    note: 5,
    date: "2026-04-21",
    texte:
      "Parfait pour les angles et les plinthes. Se nettoie facilement à l'eau tant qu'on ne le laisse pas sécher.",
    utiles: 4,
  },
  {
    id: "av-6",
    produit: "enduit-lissage-25",
    auteur: "Patrick V.",
    metier: "Plaquiste, Toulouse",
    note: 5,
    date: "2026-06-11",
    texte:
      "Se gâche sans grumeaux et reste travaillable une bonne demi-heure. Ponçage minimal derrière, c'est ce que je demande à un enduit de lissage.",
    utiles: 17,
  },
  {
    id: "av-7",
    produit: "enduit-lissage-25",
    auteur: "Julien A.",
    metier: "Artisan, Grenoble",
    note: 3,
    date: "2026-03-30",
    texte:
      "Le produit est bon mais les sacs arrivent parfois éventrés. À voir avec le transporteur, ce n'est pas la faute de l'enduit.",
    utiles: 3,
  },
  {
    id: "av-8",
    produit: "ruban-masquage-50",
    auteur: "Nadia K.",
    metier: "Peintre, Lille",
    note: 5,
    date: "2026-07-19",
    texte:
      "Arêtes franches sur laque comme sur mat, et il se retire sans arracher, même après deux jours en place. Je ne reviens pas au ruban de grande surface.",
    utiles: 21,
  },
  {
    id: "av-9",
    produit: "ruban-masquage-50",
    auteur: "Cédric P.",
    metier: "Entreprise générale, Rouen",
    note: 4,
    date: "2026-05-25",
    texte:
      "Bonne tenue sur support propre. Sur crépi il faut appuyer davantage, mais c'est vrai de tous les rubans.",
    utiles: 5,
  },
  {
    id: "av-10",
    produit: "rouleau-laqueur-18",
    auteur: "Fabrice T.",
    metier: "Peintre, Angers",
    note: 4,
    date: "2026-07-08",
    texte:
      "Rendu impeccable sur portes isoplanes. Je retire une étoile parce que le rouleau boit beaucoup au premier chargement, il faut le préparer.",
    utiles: 8,
  },
  {
    id: "av-11",
    produit: "rouleau-laqueur-18",
    auteur: "Sonia G.",
    metier: "Artisan, Metz",
    note: 5,
    date: "2026-06-15",
    texte:
      "Trois chantiers avec le même rouleau, la fibre ne s'est pas tassée. À neuf euros, je ne cherche pas plus loin.",
    utiles: 12,
  },
  {
    id: "av-12",
    produit: "rouleau-laqueur-18",
    auteur: "Bruno M.",
    metier: "Peintre, Dijon",
    note: 3,
    date: "2026-06-02",
    texte:
      "Correct sans plus. Bien pour la laque, mais j'ai eu deux manches voilés sur un lot de dix.",
    utiles: 7,
  },
  {
    id: "av-13",
    produit: "rouleau-laqueur-18",
    auteur: "Aïcha R.",
    metier: "Entreprise de peinture, Toulon",
    note: 5,
    date: "2026-05-22",
    texte:
      "On en commande par cartons pour l'équipe. Zéro peluche sur les finitions, c'est le seul critère qui compte chez nous.",
    utiles: 19,
  },
  {
    id: "av-14",
    produit: "rouleau-laqueur-18",
    auteur: "Damien C.",
    metier: "Peintre, Amiens",
    note: 4,
    date: "2026-04-30",
    texte:
      "Bonne prise en main et nettoyage rapide à l'eau tiède. La largeur de 18 cm est idéale pour les huisseries.",
    utiles: 5,
  },
  {
    id: "av-15",
    produit: "rouleau-laqueur-18",
    auteur: "Léa P.",
    metier: "Décoratrice, Tours",
    note: 5,
    date: "2026-04-11",
    texte:
      "Utilisé sur du mobilier repeint en laque satinée, aucune trace de reprise. Je le recommande sans réserve.",
    utiles: 10,
  },
  {
    id: "av-16",
    produit: "rouleau-laqueur-18",
    auteur: "Hervé N.",
    metier: "Artisan peintre, Caen",
    note: 2,
    date: "2026-03-18",
    texte:
      "Déçu sur ce lot : la fibre s'est détachée dès le deuxième passage. Les précédents tenaient mieux, peut-être un mauvais tirage.",
    utiles: 15,
  },
]

export function avisPour(produitId: string) {
  return avis
    .filter((a) => a.produit === produitId)
    .sort((a, b) => b.date.localeCompare(a.date))
}

/** Moyenne arrondie au dixième, ou `null` quand il n'y a aucun avis. */
export function noteMoyenne(produitId: string): number | null {
  const liste = avisPour(produitId)
  if (liste.length === 0) return null
  const somme = liste.reduce((total, a) => total + a.note, 0)
  return Math.round((somme / liste.length) * 10) / 10
}
