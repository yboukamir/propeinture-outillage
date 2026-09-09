import * as React from "react"
import { Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/ui/product-card"
import { categories, produits, type Produit } from "@/data/produits"
import { usePanier } from "@/panier/PanierContext"
import {
  ID_CHAMP_RECHERCHE,
  lienCategorie,
  lienProduit,
  naviguer,
  rechercheInitiale,
  remplacer,
  urlCatalogue,
  useCategorieAffichee,
} from "@/lib/navigation"
import { cn, normaliser } from "@/lib/utils"

/** « Tout » d'abord, puis les catégories dans l'ordre du catalogue. */
const filtres = [
  { libelle: "Tout", valeur: null as string | null },
  ...categories.map((c) => ({ libelle: c.titre, valeur: c.titre })),
]

/** Recherche sur tout ce qui identifie une référence, accents ignorés. */
function correspond(produit: Produit, terme: string) {
  if (!terme.trim()) return true
  const cible = normaliser(
    [produit.nom, produit.detail, produit.reference, produit.categorie].join(" "),
  )
  // Chaque mot saisi doit apparaître : « rouleau 18 » trouve le rouleau 18 cm.
  return normaliser(terme)
    .split(/\s+/)
    .filter(Boolean)
    .every((mot) => cible.includes(mot))
}

export function GrilleProduits() {
  const { ajouter } = usePanier()
  const categorieActive = useCategorieAffichee()
  // L'URL n'alimente le champ qu'au montage : en faire la source de vérité
  // ferait sauter le curseur à chaque frappe au milieu du texte.
  const [recherche, setRecherche] = React.useState(rechercheInitiale)

  function changerRecherche(valeur: string) {
    setRecherche(valeur)
    remplacer(urlCatalogue({ categorie: categorieActive, recherche: valeur }))
  }

  const parCategorie = categorieActive
    ? produits.filter((p) => p.categorie === categorieActive)
    : produits

  const compte = (valeur: string | null) =>
    produits.filter(
      (p) => (!valeur || p.categorie === valeur) && correspond(p, recherche),
    ).length

  const visibles = parCategorie.filter((p) => correspond(p, recherche))

  return (
    <section
      id="catalogue"
      className="border-y border-border bg-plaster bg-tarp px-4 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Catalogue
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Le matériel de tous les jours, prêt à partir
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Sélection des références les plus commandées par les artisans.
              Tous les prix s'entendent hors taxes, remise dégressive appliquée
              automatiquement au panier.
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <a href="#tarifs">Voir les paliers de remise</a>
          </Button>
        </div>

        {/*
          Vrais liens plutôt que boutons : le filtre vit dans l'URL, il reste
          donc partageable et le bouton retour du navigateur le défait.
        */}
        <div className="mt-8 mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Filtrer par catégorie">
          <ul className="flex flex-wrap gap-2">
            {filtres.map((filtre) => {
              const actif = categorieActive === filtre.valeur
              return (
                <li key={filtre.libelle}>
                  <a
                    href={lienCategorie(filtre.valeur, recherche)}
                    aria-current={actif ? "true" : undefined}
                    onClick={(e) => {
                      e.preventDefault()
                      naviguer(lienCategorie(filtre.valeur, recherche), {
                        defilerEnHaut: false,
                      })
                    }}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-plaster",
                      actif
                        ? "border-transparent bg-secondary text-secondary-foreground"
                        : "border-border bg-card text-foreground hover:border-primary hover:text-primary",
                    )}
                  >
                    {filtre.libelle}
                    <span
                      className={cn(
                        "text-xs tabular-nums",
                        actif
                          ? "text-secondary-foreground/60"
                          : "text-muted-foreground",
                      )}
                    >
                      {compte(filtre.valeur)}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="relative lg:w-80">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id={ID_CHAMP_RECHERCHE}
            type="search"
            value={recherche}
            onChange={(e) => changerRecherche(e.target.value)}
            placeholder="Rechercher une référence…"
            aria-label="Rechercher dans le catalogue"
            className="h-10 w-full rounded-full border border-border bg-card pl-9 pr-9 text-sm placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-plaster"
          />
          {recherche && (
            <button
              type="button"
              onClick={() => changerRecherche("")}
              aria-label="Effacer la recherche"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-primary"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        </div>

        {/* Cascade d'apparition en CSS : le délai porte sur l'enveloppe, la
            carte garde son propre `transform` pour le survol. */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((produit, index) => (
            <div
              // La clé inclut la catégorie active : sans elle React réutilise
              // les nœuds d'un filtre à l'autre et l'apparition ne rejoue pas.
              key={`${categorieActive ?? "tout"}-${produit.id}`}
              className="animate-apparition"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard
                photo={produit.photo}
                photoAlt={produit.photoAlt}
                nom={produit.nom}
                detail={produit.detail}
                prix={produit.prix}
                unite={produit.unite}
                reference={produit.reference}
                categorie={produit.categorie}
                enStock={produit.stock === "en-stock"}
                badge={produit.populaire ? "Best-seller" : undefined}
                onAjouter={() => ajouter(produit)}
                href={lienProduit(produit.id)}
                onOuvrir={(e) => {
                  e.preventDefault()
                  naviguer(lienProduit(produit.id))
                }}
              />
            </div>
          ))}
        </div>

        {visibles.length === 0 && (
          <div className="rounded-lg border border-border bg-card px-5 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              {recherche.trim()
                ? `Aucune référence ne correspond à « ${recherche.trim()} »`
                : "Aucune référence dans cette catégorie pour le moment."}
              {recherche.trim() && categorieActive && ` en « ${categorieActive} »`}
              .
            </p>
            {recherche.trim() && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  changerRecherche("")
                  naviguer(urlCatalogue(), { defilerEnHaut: false })
                }}
              >
                Réinitialiser la recherche
              </Button>
            )}
          </div>
        )}

        {/* `aria-live` : le nombre de résultats change sans rechargement, un
            lecteur d'écran doit l'entendre. */}
        <p className="mt-8 text-sm text-muted-foreground" aria-live="polite">
          {recherche.trim() || categorieActive ? (
            <>
              {visibles.length} référence{visibles.length > 1 ? "s" : ""}
              {categorieActive && ` en « ${categorieActive} »`}
              {recherche.trim() && ` pour « ${recherche.trim()} »`}.{" "}
              <a
                href={urlCatalogue()}
                onClick={(e) => {
                  e.preventDefault()
                  changerRecherche("")
                  naviguer(urlCatalogue(), { defilerEnHaut: false })
                }}
                className="font-medium text-primary underline underline-offset-4"
              >
                Voir tout le catalogue
              </a>
              .
            </>
          ) : (
            <>
              Besoin d'une référence absente de cette sélection ?{" "}
              <a
                href="#contact"
                className="font-medium text-primary underline underline-offset-4"
              >
                Demandez-nous un approvisionnement
              </a>
              .
            </>
          )}
        </p>
      </div>
    </section>
  )
}
