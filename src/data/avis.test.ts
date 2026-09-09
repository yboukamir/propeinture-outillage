import { describe, expect, it } from "vitest"

import { avis, avisPour, noteMoyenne } from "@/data/avis"
import { produits } from "@/data/produits"

describe("avisPour", () => {
  it("ne renvoie que les avis de la référence demandée", () => {
    const liste = avisPour("rouleau-laqueur-18")
    expect(liste.length).toBeGreaterThan(0)
    expect(liste.every((a) => a.produit === "rouleau-laqueur-18")).toBe(true)
  })

  it("les rend du plus récent au plus ancien, ordre dont dépend la section", () => {
    const dates = avisPour("rouleau-laqueur-18").map((a) => a.date)
    expect([...dates].sort().reverse()).toEqual(dates)
  })

  it("renvoie une liste vide pour une référence sans avis", () => {
    expect(avisPour("reference-inexistante")).toEqual([])
  })
})

describe("noteMoyenne", () => {
  it("arrondit au dixième", () => {
    expect(noteMoyenne("rouleau-laqueur-18")).toBe(4.2)
  })

  it("distingue « aucun avis » d'une note nulle", () => {
    expect(noteMoyenne("reference-inexistante")).toBeNull()
  })

  it("colle à la moyenne recalculée à la main", () => {
    for (const produit of produits) {
      const liste = avisPour(produit.id)
      if (liste.length === 0) continue
      const somme = liste.reduce((n, a) => n + a.note, 0)
      expect(noteMoyenne(produit.id)).toBeCloseTo(somme / liste.length, 1)
    }
  })
})

/*
 * Les avis sont écrits à la main : ces invariants attrapent la faute de frappe
 * qu'une relecture laisse passer — une note à 6, une date de réponse antérieure
 * à l'avis, un identifiant recopié.
 */
describe("les données elles-mêmes", () => {
  it("porte des identifiants uniques", () => {
    const ids = avis.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("ne note qu'entre une et cinq étoiles, en entiers", () => {
    for (const a of avis) {
      expect(Number.isInteger(a.note)).toBe(true)
      expect(a.note).toBeGreaterThanOrEqual(1)
      expect(a.note).toBeLessThanOrEqual(5)
    }
  })

  it("rattache chaque avis à une référence du catalogue", () => {
    const catalogue = new Set(produits.map((p) => p.id))
    for (const a of avis) expect(catalogue.has(a.produit)).toBe(true)
  })

  it("date les avis et les réponses, la réponse venant après l'avis", () => {
    for (const a of avis) {
      expect(a.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(Number.isNaN(Date.parse(a.date))).toBe(false)
      if (!a.reponse) continue
      expect(a.reponse.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(a.reponse.date >= a.date).toBe(true)
    }
  })

  it("compte des votes d'utilité positifs", () => {
    for (const a of avis) {
      expect(Number.isInteger(a.utiles)).toBe(true)
      expect(a.utiles).toBeGreaterThanOrEqual(0)
    }
  })

  it("garde une référence assez commentée pour que la pagination se voie", () => {
    const parProduit = new Map<string, number>()
    for (const a of avis) {
      parProduit.set(a.produit, (parProduit.get(a.produit) ?? 0) + 1)
    }
    expect(Math.max(...parProduit.values())).toBeGreaterThan(5)
  })
})
