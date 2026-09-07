import * as React from "react"

import { cn, formatPrix } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

/**
 * Adapté de « Product Card » par ravikatiyar162 (21st.dev)
 * https://21st.dev/@ravikatiyar162/components/product-card-2
 *
 * Modifications : formatage roupies → euros (`formatPrix`, locale fr-FR),
 * `imageUrl` remplacé par un visuel libre en ReactNode, prix barré / texte
 * d'offre remplacés par le prix à l'unité, la référence et l'état de stock,
 * ajout d'un bouton d'ajout au panier. Le `whileHover` framer-motion d'origine
 * est rendu en transition CSS.
 */

export interface ProductCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  visuel: React.ReactNode
  nom: string
  detail: string
  prix: number
  unite: string
  reference: string
  categorie: string
  enStock: boolean
  badge?: string
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  (
    {
      className,
      visuel,
      nom,
      detail,
      prix,
      unite,
      reference,
      categorie,
      enStock,
      badge,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          // `translate` et non `transform` : en Tailwind v4 les utilitaires de
          // translation passent par la propriété `translate`.
          "group relative flex h-full w-full flex-col items-center justify-start overflow-hidden rounded-xl border border-border bg-card text-center text-card-foreground shadow-sm transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-md",
          className,
        )}
        {...props}
      >
        <div className="relative flex h-44 w-full items-center justify-center border-b border-border bg-plaster bg-tarp p-6">
          <div className="h-full w-full transition-transform duration-300 group-hover:scale-105">
            {visuel}
          </div>
          {badge && (
            <Badge variant="accent" className="absolute left-4 top-4">
              {badge}
            </Badge>
          )}
        </div>

        <div className="flex w-full flex-grow flex-col items-center gap-2 p-6 pb-4">
          <div className="flex w-full items-center justify-between gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {categorie}
            </span>
            <span
              className={cn(
                "flex items-center gap-1.5 text-[11px] font-medium",
                enStock ? "text-muted-foreground" : "text-primary",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "size-1.5 rounded-full",
                  enStock ? "bg-emerald-600" : "bg-primary",
                )}
              />
              {enStock ? "En stock" : "Réappro 5 j"}
            </span>
          </div>
          <h3 className="font-semibold leading-snug">{nom}</h3>
          <p className="text-sm text-muted-foreground">{detail}</p>
          <p className="text-xs text-muted-foreground/70">Réf. {reference}</p>
        </div>

        <div className="flex w-full items-center justify-between gap-3 border-t border-border p-5">
          <p className="flex items-baseline gap-1">
            <span className="text-xl font-bold tracking-tight">
              {formatPrix(prix)}
            </span>
            <span className="text-sm text-muted-foreground">/{unite}</span>
          </p>
          <Button size="sm" type="button">
            Ajouter
          </Button>
        </div>
      </div>
    )
  },
)

ProductCard.displayName = "ProductCard"

export { ProductCard }
