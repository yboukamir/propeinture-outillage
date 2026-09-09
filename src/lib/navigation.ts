import * as React from "react"

/**
 * Navigation minimale, pilotée par la query string (`?produit=<id>`).
 *
 * Pourquoi pas un routeur : le site est servi en sous-chemin sur GitHub Pages,
 * où des URL en segments (`/produit/xxx`) renvoient un 404 sans page de repli,
 * et sa navigation repose sur des ancres (`#catalogue`) qu'un routeur à hash
 * confisquerait. La query string évite les deux écueils, reste partageable et
 * garde le bouton retour du navigateur. Passer à react-router plus tard ne
 * touche que ce fichier et `App.tsx`.
 */

const EVENEMENT_NAVIGATION = "navigation-interne"

export function lienProduit(id: string) {
  return `${import.meta.env.BASE_URL}?produit=${encodeURIComponent(id)}`
}

export function lienAccueil() {
  return import.meta.env.BASE_URL
}

/**
 * URL du catalogue avec son état de consultation. `#catalogue` y reste pour
 * qu'un lien ouvert à froid défile jusqu'à la grille — voir
 * `useDefilementVersAncre`.
 */
export type Tri = "catalogue" | "prix-asc" | "prix-desc"

/** `catalogue` est l'ordre par défaut : il n'apparaît pas dans l'URL. */
export const TRIS: { valeur: Tri; libelle: string }[] = [
  { valeur: "catalogue", libelle: "Ordre du catalogue" },
  { valeur: "prix-asc", libelle: "Prix croissant" },
  { valeur: "prix-desc", libelle: "Prix décroissant" },
]

export function urlCatalogue({
  categorie = null,
  recherche = "",
  tri = "catalogue",
}: {
  categorie?: string | null
  recherche?: string
  tri?: Tri
} = {}) {
  const parametres = new URLSearchParams()
  if (categorie) parametres.set("categorie", categorie)
  if (recherche.trim()) parametres.set("recherche", recherche.trim())
  if (tri !== "catalogue") parametres.set("tri", tri)
  const requete = parametres.toString()
  return `${import.meta.env.BASE_URL}${requete ? `?${requete}` : ""}#catalogue`
}

/** Raccourci pour les filtres, qui ne touchent qu'à la catégorie. */
export function lienCategorie(categorie: string | null, recherche = "") {
  return urlCatalogue({ categorie, recherche })
}

/**
 * `replaceState` et non `pushState` : la recherche se tape lettre par lettre,
 * l'empiler dans l'historique obligerait à autant de retours en arrière pour
 * en sortir. L'URL reste copiable, sans polluer la navigation.
 */
export function remplacer(url: string) {
  window.history.replaceState({}, "", url)
  window.dispatchEvent(new Event(EVENEMENT_NAVIGATION))
}

type OptionsNavigation = {
  /** Section vers laquelle défiler, au lieu de remonter en haut. */
  ancre?: string
  /** Faux pour un changement qui ne doit pas bouger la page (un filtre). */
  defilerEnHaut?: boolean
}

export function naviguer(
  url: string,
  { ancre, defilerEnHaut = true }: OptionsNavigation = {},
) {
  window.history.pushState({}, "", url)
  window.dispatchEvent(new Event(EVENEMENT_NAVIGATION))

  if (ancre) {
    // Laisse React rendre la nouvelle vue avant de chercher la cible.
    requestAnimationFrame(() => {
      document.getElementById(ancre)?.scrollIntoView({ behavior: "smooth" })
    })
  } else if (defilerEnHaut) {
    window.scrollTo({ top: 0 })
  }
}

function souscrire(rappel: () => void) {
  // `popstate` couvre les boutons précédent/suivant, l'évènement maison couvre
  // nos propres pushState — le navigateur n'en émet aucun.
  window.addEventListener("popstate", rappel)
  window.addEventListener(EVENEMENT_NAVIGATION, rappel)
  return () => {
    window.removeEventListener("popstate", rappel)
    window.removeEventListener(EVENEMENT_NAVIGATION, rappel)
  }
}

const instantane = () => window.location.search

export function useProduitAffiche(): string | null {
  const recherche = React.useSyncExternalStore(souscrire, instantane, () => "")
  return new URLSearchParams(recherche).get("produit")
}

export function useCategorieAffichee(): string | null {
  const parametres = React.useSyncExternalStore(souscrire, instantane, () => "")
  return new URLSearchParams(parametres).get("categorie")
}

export function useTri(): Tri {
  const parametres = React.useSyncExternalStore(souscrire, instantane, () => "")
  const valeur = new URLSearchParams(parametres).get("tri")
  // Une valeur inconnue retombe sur l'ordre par défaut plutôt que de casser.
  return valeur === "prix-asc" || valeur === "prix-desc" ? valeur : "catalogue"
}

/** Terme de recherche présent dans l'URL au chargement. */
export function rechercheInitiale() {
  if (typeof window === "undefined") return ""
  return new URLSearchParams(window.location.search).get("recherche") ?? ""
}

/** Identifiant du champ de recherche, pour que le header puisse l'atteindre. */
export const ID_CHAMP_RECHERCHE = "recherche-catalogue"

export function focaliserRecherche() {
  const champ = document.getElementById(ID_CHAMP_RECHERCHE)
  // `focus()` amène l'élément dans la vue : pas besoin de défiler à part.
  if (champ instanceof HTMLInputElement) champ.focus()
}

/**
 * Rejoue l'ancre de l'URL au premier rendu. Le navigateur la traite au
 * chargement du document, quand React n'a encore rien monté : la section
 * n'existe pas et le défilement n'a pas lieu. Sans ça, un lien vers
 * `?categorie=Protection#catalogue` ouvre la page en haut.
 */
export function useDefilementVersAncre() {
  React.useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id) return

    const image = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView()
    })
    return () => cancelAnimationFrame(image)
  }, [])
}
