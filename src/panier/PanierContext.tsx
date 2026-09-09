import * as React from "react"

import { calculerTotaux, type TotauxPanier } from "@/lib/tarifs"
import type { Produit } from "@/data/produits"

export type LignePanier = {
  id: string
  nom: string
  prix: number
  unite: string
  photo: string
  photoAlt: string
  quantite: number
}

type Action =
  | { type: "ajouter"; produit: Produit }
  | { type: "definir"; id: string; quantite: number }
  | { type: "retirer"; id: string }
  | { type: "vider" }

function reducteur(lignes: LignePanier[], action: Action): LignePanier[] {
  switch (action.type) {
    case "ajouter": {
      const { produit } = action
      const existante = lignes.find((l) => l.id === produit.id)
      if (existante) {
        return lignes.map((l) =>
          l.id === produit.id ? { ...l, quantite: l.quantite + 1 } : l,
        )
      }
      return [
        ...lignes,
        {
          id: produit.id,
          nom: produit.nom,
          prix: produit.prix,
          unite: produit.unite,
          photo: produit.photo,
          photoAlt: produit.photoAlt,
          quantite: 1,
        },
      ]
    }
    case "definir": {
      // Descendre à 0 retire la ligne : évite les lignes fantômes à zéro.
      if (action.quantite <= 0) return lignes.filter((l) => l.id !== action.id)
      return lignes.map((l) =>
        l.id === action.id ? { ...l, quantite: action.quantite } : l,
      )
    }
    case "retirer":
      return lignes.filter((l) => l.id !== action.id)
    case "vider":
      return []
  }
}

type ValeurPanier = {
  lignes: LignePanier[]
  totaux: TotauxPanier
  ouvert: boolean
  ouvrir: () => void
  fermer: () => void
  ajouter: (produit: Produit) => void
  definirQuantite: (id: string, quantite: number) => void
  retirer: (id: string) => void
  vider: () => void
}

const ContextePanier = React.createContext<ValeurPanier | null>(null)

export function PanierProvider({ children }: { children: React.ReactNode }) {
  const [lignes, envoyer] = React.useReducer(reducteur, [])
  const [ouvert, setOuvert] = React.useState(false)

  const valeur = React.useMemo<ValeurPanier>(
    () => ({
      lignes,
      totaux: calculerTotaux(lignes),
      ouvert,
      ouvrir: () => setOuvert(true),
      fermer: () => setOuvert(false),
      ajouter: (produit) => {
        envoyer({ type: "ajouter", produit })
        setOuvert(true)
      },
      definirQuantite: (id, quantite) =>
        envoyer({ type: "definir", id, quantite }),
      retirer: (id) => envoyer({ type: "retirer", id }),
      vider: () => envoyer({ type: "vider" }),
    }),
    [lignes, ouvert],
  )

  return (
    <ContextePanier.Provider value={valeur}>{children}</ContextePanier.Provider>
  )
}

export function usePanier() {
  const valeur = React.useContext(ContextePanier)
  if (!valeur) {
    throw new Error("usePanier doit être utilisé dans un <PanierProvider>")
  }
  return valeur
}
