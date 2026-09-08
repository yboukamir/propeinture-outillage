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
 * Photos de démonstration servies par le CDN Unsplash. Pour une vraie boutique,
 * remplacer par les visuels du catalogue déposés dans `public/`.
 */
export function imageUrl(id: string, largeur = 800) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${largeur}&q=80`
}
