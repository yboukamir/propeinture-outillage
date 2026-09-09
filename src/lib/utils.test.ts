import { describe, expect, it } from "vitest"

import { asset, cn, formatPrix, normaliser } from "@/lib/utils"

describe("formatPrix", () => {
  it("met le symbole après le montant, à la française", () => {
    // Les espaces sont insécables : les comparer tels quels vérifie aussi
    // qu'aucun retour à la ligne ne peut couper un prix en deux.
    expect(formatPrix(9.9)).toBe("9,90 €")
    expect(formatPrix(1234.5)).toBe("1 234,50 €")
  })

  it("affiche toujours deux décimales", () => {
    expect(formatPrix(28)).toBe("28,00 €")
    expect(formatPrix(0)).toBe("0,00 €")
  })
})

describe("normaliser", () => {
  it("rapproche « bâche » de « bache », sans quoi la recherche exigerait les accents", () => {
    expect(normaliser("Bâche")).toBe(normaliser("bache"))
    expect(normaliser("Préparation")).toBe("preparation")
    expect(normaliser("ÉLODIE")).toBe("elodie")
  })

  it("laisse intact ce qui n'a pas d'accent", () => {
    expect(normaliser("rouleau 18")).toBe("rouleau 18")
  })
})

describe("asset", () => {
  it("préfixe la base du déploiement, jamais une barre en trop", () => {
    expect(asset("produits/rouleau.webp")).toBe("/produits/rouleau.webp")
  })
})

describe("cn", () => {
  it("laisse la dernière classe l'emporter, ce pour quoi tailwind-merge est là", () => {
    expect(cn("px-2", "px-4")).toBe("px-4")
  })

  it("écarte les valeurs conditionnelles fausses", () => {
    expect(cn("rounded", false && "hidden", undefined, "border")).toBe(
      "rounded border",
    )
  })
})
