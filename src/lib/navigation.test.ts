import { describe, expect, it } from "vitest"

import { lienCategorie, lienProduit, urlCatalogue } from "@/lib/navigation"

/*
 * L'URL est l'état partageable du site : ce qui compte ici est qu'elle reste
 * lisible, qu'elle omette les valeurs par défaut et qu'elle échappe ce que le
 * visiteur tape. Les hooks du même module lisent `window` et se vérifient au
 * navigateur, pas ici.
 */
describe("lienProduit", () => {
  it("pointe la fiche depuis la racine du déploiement", () => {
    expect(lienProduit("rouleau-laqueur-18")).toBe(
      "/?produit=rouleau-laqueur-18",
    )
  })

  it("échappe un identifiant douteux plutôt que de casser l'URL", () => {
    expect(lienProduit("a b&c=d")).toBe("/?produit=a%20b%26c%3Dd")
  })
})

describe("urlCatalogue", () => {
  it("ne porte que l'ancre quand rien n'est filtré", () => {
    expect(urlCatalogue()).toBe("/#catalogue")
  })

  it("omet l'ordre par défaut, qui n'a rien à faire dans l'URL", () => {
    expect(urlCatalogue({ tri: "catalogue" })).toBe("/#catalogue")
    expect(urlCatalogue({ tri: "prix-asc" })).toBe("/?tri=prix-asc#catalogue")
  })

  it("combine catégorie, recherche et tri", () => {
    expect(
      urlCatalogue({
        categorie: "Application",
        recherche: "rouleau",
        tri: "prix-desc",
      }),
    ).toBe("/?categorie=Application&recherche=rouleau&tri=prix-desc#catalogue")
  })

  it("ignore une recherche vide ou faite d'espaces, et rogne les autres", () => {
    expect(urlCatalogue({ recherche: "   " })).toBe("/#catalogue")
    expect(urlCatalogue({ recherche: "  bâche " })).toBe(
      "/?recherche=b%C3%A2che#catalogue",
    )
  })

  it("garde l'ancre en fin d'URL, sinon le défilement à froid ne part pas", () => {
    expect(urlCatalogue({ categorie: "Protection" }).endsWith("#catalogue")).toBe(
      true,
    )
  })
})

describe("lienCategorie", () => {
  it("conserve la recherche en cours en changeant de catégorie", () => {
    expect(lienCategorie("Préparation", "enduit")).toBe(
      "/?categorie=Pr%C3%A9paration&recherche=enduit#catalogue",
    )
  })

  it("revient au catalogue entier avec `null`", () => {
    expect(lienCategorie(null)).toBe("/#catalogue")
  })
})
