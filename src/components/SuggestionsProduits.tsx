import { produits } from "@/data/produits"
import { lienProduit, naviguer } from "@/lib/navigation"
import { asset, formatPrix } from "@/lib/utils"

/**
 * Petite grille de références, partagée par la fiche produit et la page
 * « référence introuvable » : les deux proposent la même sortie de secours.
 */
export function SuggestionsProduits({
  titre,
  exclure,
  nombre = 3,
}: {
  titre: string
  exclure?: string
  nombre?: number
}) {
  const suggestions = produits
    .filter((p) => p.id !== exclure)
    .slice(0, nombre)

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold tracking-tight">{titre}</h2>
      <ul className="mt-6 grid gap-5 sm:grid-cols-3">
        {suggestions.map((produit) => (
          <li key={produit.id}>
            <a
              href={lienProduit(produit.id)}
              onClick={(e) => {
                e.preventDefault()
                naviguer(lienProduit(produit.id))
              }}
              className="group block overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
            >
              <img
                src={asset(produit.photo)}
                alt={produit.photoAlt}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div className="p-4">
                <p className="text-sm font-semibold leading-snug">
                  {produit.nom}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatPrix(produit.prix)} /{produit.unite}
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
