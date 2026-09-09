import { describe, expect, it } from "vitest"

import { trier, TRIS_AVIS, type TriAvis } from "@/lib/tri-avis"
import { type Avis } from "@/data/avis"

/** Avis de test réduits au strict nécessaire, dans l'ordre d'arrivée du site. */
function avis(
  id: string,
  date: string,
  note: number,
  utiles: number,
  reponse = false,
): Avis {
  return {
    id,
    produit: "p",
    auteur: id,
    metier: "Peintre",
    note,
    date,
    texte: "…",
    utiles,
    ...(reponse ? { reponse: { date, texte: "…" } } : {}),
  }
}

/** Les données arrivent déjà de la plus récente à la plus ancienne. */
const liste = [
  avis("c", "2026-07-14", 5, 4),
  avis("b", "2026-06-28", 3, 20, true),
  avis("a", "2026-05-09", 5, 12),
]

const sansVote = (a: Avis) => a.utiles
const ids = (l: Avis[]) => l.map((a) => a.id).join("")

describe("trier", () => {
  it("laisse l'ordre reçu pour « Plus récents », qui est déjà le bon", () => {
    expect(trier(liste, "recent", sansVote)).toBe(liste)
  })

  it("renverse pour « Plus anciens » au lieu de retrier", () => {
    expect(ids(trier(liste, "ancien", sansVote))).toBe("abc")
  })

  it("classe par note, sans jamais toucher au tableau reçu", () => {
    expect(ids(trier(liste, "note-desc", sansVote))).toBe("cab")
    expect(ids(trier(liste, "note-asc", sansVote))).toBe("bca")
    expect(ids(liste)).toBe("cba")
  })

  it("départage les ex æquo par date décroissante, pour une liste stable", () => {
    // « c » et « a » sont tous deux à cinq étoiles : le plus récent passe.
    expect(ids(trier(liste, "note-desc", sansVote)).slice(0, 2)).toBe("ca")
  })

  it("suit le compteur d'utilité tel qu'il s'affiche, vote du visiteur compris", () => {
    expect(ids(trier(liste, "utiles", sansVote))).toBe("bac")
    // Le visiteur a voté pour « c » : l'ordre doit suivre le chiffre affiché.
    const avecVote = (a: Avis) => a.utiles + (a.id === "c" ? 100 : 0)
    expect(ids(trier(liste, "utiles", avecVote))).toBe("cba")
  })

  it("remonte les avis répondus sans déranger l'ordre des autres", () => {
    expect(ids(trier(liste, "repondus", sansVote))).toBe("bca")
  })

  it("supporte une liste vide ou à un seul élément", () => {
    for (const option of TRIS_AVIS) {
      expect(trier([], option.valeur, sansVote)).toHaveLength(0)
      expect(trier([liste[0]], option.valeur, sansVote)).toHaveLength(1)
    }
  })
})

describe("les options proposées", () => {
  it("couvrent chaque tri exactement une fois", () => {
    const attendus: TriAvis[] = [
      "recent",
      "ancien",
      "utiles",
      "repondus",
      "note-desc",
      "note-asc",
    ]
    expect(TRIS_AVIS.map((o) => o.valeur).sort()).toEqual([...attendus].sort())
  })

  it("commencent par l'ordre par défaut de la section", () => {
    expect(TRIS_AVIS[0].valeur).toBe("recent")
  })
})
