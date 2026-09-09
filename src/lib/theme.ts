import * as React from "react"

/**
 * Trois états : un choix explicite « clair » ou « sombre », ou `null` quand
 * l'utilisateur n'a rien décidé — auquel cas on suit la préférence système et
 * on continue de la suivre si elle change.
 *
 * Le `data-theme` initial est posé par le script de index.html, avant le
 * premier rendu. Ce module ne fait que le maintenir ensuite.
 */
export type ChoixTheme = "clair" | "sombre" | null
export type Theme = "clair" | "sombre"

const CLE = "propeinture-theme"
const REQUETE = "(prefers-color-scheme: dark)"

function lireChoix(): ChoixTheme {
  try {
    const valeur = localStorage.getItem(CLE)
    return valeur === "clair" || valeur === "sombre" ? valeur : null
  } catch {
    // Navigation privée ou stockage bloqué : on retombe sur le système.
    return null
  }
}

function themeSysteme(): Theme {
  return window.matchMedia(REQUETE).matches ? "sombre" : "clair"
}

export function useTheme() {
  const [choix, setChoix] = React.useState<ChoixTheme>(lireChoix)
  const [systeme, setSysteme] = React.useState<Theme>(themeSysteme)

  // Suivre le système tant qu'aucun choix explicite n'a été fait.
  React.useEffect(() => {
    const media = window.matchMedia(REQUETE)
    const maj = () => setSysteme(media.matches ? "sombre" : "clair")
    media.addEventListener("change", maj)
    return () => media.removeEventListener("change", maj)
  }, [])

  const theme: Theme = choix ?? systeme

  React.useEffect(() => {
    document.documentElement.dataset.theme =
      theme === "sombre" ? "dark" : "light"
  }, [theme])

  const basculer = React.useCallback(() => {
    setChoix((actuel) => {
      const suivant: Theme =
        (actuel ?? themeSysteme()) === "sombre" ? "clair" : "sombre"
      try {
        localStorage.setItem(CLE, suivant)
      } catch {
        // Le thème s'applique quand même, il ne sera juste pas mémorisé.
      }
      return suivant
    })
  }, [])

  return { theme, basculer }
}
