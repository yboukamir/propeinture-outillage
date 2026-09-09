import { describe, expect, it } from "vitest"

import {
  calculerTotaux,
  formatRemise,
  palierPour,
  palierSuivant,
  paliers,
} from "@/lib/tarifs"

/*
 * Le barème est le seul calcul métier du projet, et le seul endroit où une
 * erreur coûterait de l'argent si la boutique existait. Les tests visent donc
 * les bornes : c'est là qu'un `>` mis pour un `>=` se voit.
 */
describe("palierPour", () => {
  it("laisse au prix catalogue en dessous de dix unités", () => {
    expect(palierPour(0).id).toBe("particulier")
    expect(palierPour(1).id).toBe("particulier")
    expect(palierPour(9).id).toBe("particulier")
  })

  it("bascule en artisan à partir de dix, pas à onze", () => {
    expect(palierPour(10).id).toBe("artisan")
    expect(palierPour(49).id).toBe("artisan")
  })

  it("bascule en grossiste à partir de cinquante", () => {
    expect(palierPour(50).id).toBe("grossiste")
    expect(palierPour(500).id).toBe("grossiste")
  })
})

describe("palierSuivant", () => {
  it("annonce le palier à atteindre", () => {
    expect(palierSuivant(0)?.id).toBe("artisan")
    expect(palierSuivant(9)?.id).toBe("artisan")
    expect(palierSuivant(10)?.id).toBe("grossiste")
  })

  it("ne promet rien une fois le meilleur palier atteint", () => {
    expect(palierSuivant(50)).toBeNull()
    expect(palierSuivant(1000)).toBeNull()
  })
})

describe("calculerTotaux", () => {
  it("compte un panier vide sans remise ni division par zéro", () => {
    const t = calculerTotaux([])
    expect(t.quantite).toBe(0)
    expect(t.sousTotal).toBe(0)
    expect(t.total).toBe(0)
    expect(t.palier.id).toBe("particulier")
    expect(t.unitesAvantSuivant).toBe(10)
  })

  it("cumule les quantités de toutes les références, remise comprise", () => {
    // Six rouleaux et six pinceaux : aucune ligne n'atteint dix, le panier si.
    const t = calculerTotaux([
      { prix: 9.9, quantite: 6 },
      { prix: 6.5, quantite: 6 },
    ])
    expect(t.quantite).toBe(12)
    expect(t.palier.id).toBe("artisan")
    expect(t.sousTotal).toBeCloseTo(98.4, 10)
    expect(t.montantRemise).toBeCloseTo(11.808, 10)
    expect(t.total).toBeCloseTo(86.592, 10)
  })

  it("compte les unités manquantes vers le palier suivant", () => {
    expect(calculerTotaux([{ prix: 10, quantite: 7 }]).unitesAvantSuivant).toBe(3)
    expect(calculerTotaux([{ prix: 10, quantite: 30 }]).unitesAvantSuivant).toBe(
      20,
    )
    expect(calculerTotaux([{ prix: 10, quantite: 60 }]).unitesAvantSuivant).toBe(
      0,
    )
  })

  it("applique la remise au panier entier et non à la ligne déclenchante", () => {
    const t = calculerTotaux([
      { prix: 100, quantite: 49 },
      { prix: 1, quantite: 1 },
    ])
    expect(t.palier.id).toBe("grossiste")
    expect(t.montantRemise).toBeCloseTo(4901 * 0.22, 10)
  })
})

describe("formatRemise", () => {
  it("nomme l'absence de remise au lieu d'afficher zéro", () => {
    expect(formatRemise(0)).toBe("Prix catalogue")
  })

  it("écrit les remises avec le signe moins et une espace insécable", () => {
    // L'espace est un U+00A0 : en colonne étroite, une espace ordinaire
    // laissait « −22 % » se couper entre le nombre et le signe.
    expect(formatRemise(0.12)).toBe("−12\u00a0%")
    expect(formatRemise(0.22)).toBe("−22\u00a0%")
  })
})

describe("le barème lui-même", () => {
  it("part de zéro et monte, sans quoi palierPour renverrait n'importe quoi", () => {
    expect(paliers[0].seuil).toBe(0)
    const seuils = paliers.map((p) => p.seuil)
    expect([...seuils].sort((a, b) => a - b)).toEqual(seuils)
    const remises = paliers.map((p) => p.remise)
    expect([...remises].sort((a, b) => a - b)).toEqual(remises)
  })
})
