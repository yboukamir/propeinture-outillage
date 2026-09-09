/**
 * Ordre d'affichage des avis d'une fiche. Séparé du composant parce que c'est
 * la seule logique de la section qui se raisonne — et se teste — sans écran.
 */
import { type Avis } from "@/data/avis"

export type TriAvis =
  | "recent"
  | "ancien"
  | "note-desc"
  | "note-asc"
  | "utiles"
  | "repondus"

export const TRIS_AVIS: { valeur: TriAvis; libelle: string }[] = [
  { valeur: "recent", libelle: "Plus récents" },
  { valeur: "ancien", libelle: "Plus anciens" },
  { valeur: "utiles", libelle: "Les plus utiles" },
  // La boutique répond au plus une fois par avis : trier par nombre de
  // réponses revient à remonter ceux qui en ont une, et le libellé le dit.
  { valeur: "repondus", libelle: "Avec réponse d'abord" },
  { valeur: "note-desc", libelle: "Meilleures notes" },
  { valeur: "note-asc", libelle: "Notes les plus basses" },
]

/**
 * Départage toujours par date décroissante, pour que la liste reste stable.
 * `utilite` compte le vote du visiteur : le tri doit suivre le nombre affiché,
 * sinon l'ordre contredirait les compteurs sous les yeux du lecteur.
 */
export function trier(
  liste: Avis[],
  tri: TriAvis,
  utilite: (avis: Avis) => number,
) {
  // Les données arrivent déjà triées de la plus récente à la plus ancienne :
  // « Plus récents » n'a rien à faire, « Plus anciens » les renverse.
  if (tri === "recent") return liste
  if (tri === "ancien") return [...liste].reverse()
  return [...liste].sort((a, b) => {
    const ecart =
      tri === "utiles"
        ? utilite(b) - utilite(a)
        : tri === "repondus"
          ? Number(Boolean(b.reponse)) - Number(Boolean(a.reponse))
          : tri === "note-desc"
            ? b.note - a.note
            : a.note - b.note
    return ecart || b.date.localeCompare(a.date)
  })
}
