import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const eur = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
})

export function formatPrix(valeur: number) {
  return eur.format(valeur)
}

/**
 * Résout un fichier de `public/` en tenant compte de la base du déploiement.
 * Sans ça, un site servi ailleurs qu'à la racine — GitHub Pages sert sur
 * `/nom-du-depot/` — cherche les images au mauvais endroit. `BASE_URL` se
 * termine toujours par une barre oblique, les chemins passés n'en portent donc
 * pas au début.
 */
export function asset(chemin: string) {
  return import.meta.env.BASE_URL + chemin
}

/**
 * Minuscules sans accents, pour comparer « bâche » et « bache ». Sur un
 * catalogue français, exiger les accents à la saisie serait pénible.
 */
export function normaliser(texte: string) {
  return texte
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
}
