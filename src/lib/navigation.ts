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

export function naviguer(url: string) {
  window.history.pushState({}, "", url)
  window.dispatchEvent(new Event(EVENEMENT_NAVIGATION))
  window.scrollTo({ top: 0 })
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
