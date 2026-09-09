/**
 * Barème dégressif : la remise dépend du nombre total d'unités du panier,
 * toutes références confondues — c'est la règle annoncée dans la section
 * tarifs, et le seul calcul métier du projet.
 */

export type Palier = {
  id: string
  nom: string
  /** Quantité minimale, en unités cumulées sur l'ensemble du panier. */
  seuil: number
  /** Remise appliquée, en fraction (0.12 = 12 %). */
  remise: number
}

export const paliers: Palier[] = [
  { id: "particulier", nom: "Particulier", seuil: 0, remise: 0 },
  { id: "artisan", nom: "Artisan", seuil: 10, remise: 0.12 },
  { id: "grossiste", nom: "Chantier / Grossiste", seuil: 50, remise: 0.22 },
]

/** Palier atteint pour une quantité donnée. Toujours défini : seuil 0. */
export function palierPour(quantite: number): Palier {
  let atteint = paliers[0]
  for (const palier of paliers) {
    if (quantite >= palier.seuil) atteint = palier
  }
  return atteint
}

/** Palier suivant, ou `null` si le meilleur est déjà atteint. */
export function palierSuivant(quantite: number): Palier | null {
  return paliers.find((palier) => quantite < palier.seuil) ?? null
}

export type TotauxPanier = {
  quantite: number
  sousTotal: number
  palier: Palier
  montantRemise: number
  total: number
  suivant: Palier | null
  /** Unités manquantes pour atteindre `suivant`, 0 s'il n'y en a pas. */
  unitesAvantSuivant: number
}

export function calculerTotaux(
  lignes: { prix: number; quantite: number }[],
): TotauxPanier {
  const quantite = lignes.reduce((n, l) => n + l.quantite, 0)
  const sousTotal = lignes.reduce((n, l) => n + l.prix * l.quantite, 0)
  const palier = palierPour(quantite)
  const montantRemise = sousTotal * palier.remise
  const suivant = palierSuivant(quantite)

  return {
    quantite,
    sousTotal,
    palier,
    montantRemise,
    total: sousTotal - montantRemise,
    suivant,
    unitesAvantSuivant: suivant ? suivant.seuil - quantite : 0,
  }
}

/** « −12 % », ou « Prix catalogue » quand aucune remise ne s'applique. */
export function formatRemise(remise: number) {
  return remise === 0 ? "Prix catalogue" : `−${Math.round(remise * 100)} %`
}
