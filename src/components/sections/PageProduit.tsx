import * as React from "react"
import { Check, ChevronRight, Minus, Plus, Truck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { EnTeteProduit } from "@/components/EnTeteProduit"
import { SuggestionsProduits } from "@/components/SuggestionsProduits"
import { type Produit } from "@/data/produits"
import { lienAccueil, naviguer } from "@/lib/navigation"
import { paliers, formatRemise } from "@/lib/tarifs"
import { asset, formatPrix } from "@/lib/utils"
import { usePanier } from "@/panier/PanierContext"

export function PageProduit({ produit }: { produit: Produit }) {
  const { ajouter, definirQuantite, lignes } = usePanier()
  const [quantite, setQuantite] = React.useState(1)

  function ajouterAuPanier() {
    // `ajouter` incrémente d'une unité : on pose ensuite la quantité voulue,
    // en tenant compte de ce qui est déjà au panier.
    const dejaPresent = lignes.find((l) => l.id === produit.id)?.quantite ?? 0
    ajouter(produit)
    if (quantite > 1) {
      definirQuantite(produit.id, dejaPresent + quantite)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <EnTeteProduit />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <nav aria-label="Fil d'Ariane" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <a
            href={lienAccueil()}
            onClick={(e) => {
              e.preventDefault()
              naviguer(lienAccueil())
            }}
            className="transition-colors hover:text-primary"
          >
            Catalogue
          </a>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <span>{produit.categorie}</span>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <span className="text-foreground">{produit.nom}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* `self-start` : sans lui la grille étire le cadre à la hauteur de
              la colonne de droite et laisse un vide sous l'image. */}
          <div className="self-start overflow-hidden rounded-xl border border-border bg-muted">
            <img
              src={asset(produit.photo)}
              alt={produit.photoAlt}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                {produit.categorie}
              </span>
              {produit.populaire && <Badge variant="accent">Best-seller</Badge>}
            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {produit.nom}
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              {produit.detail}
            </p>

            <div className="mt-5 flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold tracking-tight">
                {formatPrix(produit.prix)}
              </span>
              <span className="text-muted-foreground">/{produit.unite}</span>
              <span className="ml-1 text-sm text-muted-foreground">HT</span>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div className="flex justify-between border-b border-border py-1.5">
                <dt className="text-muted-foreground">Référence</dt>
                <dd className="font-medium">{produit.reference}</dd>
              </div>
              <div className="flex justify-between border-b border-border py-1.5">
                <dt className="text-muted-foreground">Disponibilité</dt>
                <dd
                  className={
                    produit.stock === "en-stock"
                      ? "font-medium text-emerald-700"
                      : "font-medium text-primary"
                  }
                >
                  {produit.stock === "en-stock" ? "En stock" : "Réappro 5 j"}
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 rounded-md border border-border p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9"
                  aria-label="Diminuer la quantité"
                  onClick={() => setQuantite((q) => Math.max(1, q - 1))}
                >
                  <Minus />
                </Button>
                <span className="w-10 text-center font-semibold tabular-nums">
                  {quantite}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9"
                  aria-label="Augmenter la quantité"
                  onClick={() => setQuantite((q) => q + 1)}
                >
                  <Plus />
                </Button>
              </div>

              <Button size="lg" onClick={ajouterAuPanier} className="flex-1 sm:flex-none">
                Ajouter au panier
              </Button>
            </div>

            <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="size-4 text-primary" aria-hidden="true" />
              Livraison chantier sous 48 h
            </p>

            <Separator className="my-6" />

            <PrixParPalier prix={produit.prix} unite={produit.unite} />
          </div>
        </div>

        <SuggestionsProduits titre="Dans le même chantier" exclure={produit.id} />
      </main>
    </div>
  )
}

/**
 * Prix unitaire à chaque palier : la remise dégressive est l'argument de vente
 * du site, autant la montrer en euros plutôt qu'en pourcentage.
 */
function PrixParPalier({ prix, unite }: { prix: number; unite: string }) {
  return (
    <div>
      <h2 className="text-sm font-semibold">Tarifs dégressifs</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        La remise s'applique au panier entier, toutes références confondues.
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {paliers.map((palier) => (
          <li
            key={palier.id}
            className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-sm"
          >
            <span className="flex items-center gap-2">
              {palier.remise > 0 && (
                <Check className="size-4 text-primary" aria-hidden="true" />
              )}
              <span className="font-medium">{palier.nom}</span>
              <span className="text-muted-foreground">
                {palier.seuil === 0
                  ? "1 à 9 unités"
                  : `dès ${palier.seuil} unités`}
              </span>
            </span>
            <span className="flex items-baseline gap-2">
              <span className="text-xs text-muted-foreground">
                {formatRemise(palier.remise)}
              </span>
              <span className="font-semibold tabular-nums">
                {formatPrix(prix * (1 - palier.remise))}
                <span className="font-normal text-muted-foreground">
                  /{unite}
                </span>
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
