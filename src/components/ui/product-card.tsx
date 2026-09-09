import * as React from "react"

import { asset, cn, formatPrix } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

/**
 * Adapté de « Product Card » par ravikatiyar162 (21st.dev)
 * https://21st.dev/@ravikatiyar162/components/product-card-2
 *
 * Modifications : formatage roupies → euros (`formatPrix`, locale fr-FR), prix
 * barré / texte d'offre remplacés par le prix à l'unité, la référence et l'état
 * de stock, ajout d'un bouton d'ajout au panier. Le `whileHover` framer-motion
 * d'origine est rendu en transition CSS. La photo passe en pleine largeur au
 * lieu d'être contenue avec marge : c'est ce qui donne l'allure de vitrine dans
 * les previews du catalogue.
 */

export interface ProductCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  photo: string
  photoAlt: string
  nom: string
  detail: string
  prix: number
  unite: string
  reference: string
  categorie: string
  enStock: boolean
  badge?: string
  onAjouter?: () => void
  /** Lien vers la fiche produit : vrai `href`, pour garder clic droit et
   *  ouverture dans un nouvel onglet. */
  href?: string
  onOuvrir?: (evenement: React.MouseEvent) => void
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  (
    {
      className,
      photo,
      photoAlt,
      nom,
      detail,
      prix,
      unite,
      reference,
      categorie,
      enStock,
      badge,
      onAjouter,
      href,
      onOuvrir,
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
          "group relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-[0_1px_2px_rgba(23,19,15,0.06)] transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_18px_40px_-18px_rgba(23,19,15,0.45)]",
          className,
        )}
        {...props}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <img
            src={asset(photo)}
            alt={photoAlt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
            {badge ? (
              <Badge variant="accent" className="shadow-sm">
                {badge}
              </Badge>
            ) : (
              <span />
            )}
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-full bg-background/90 px-2 py-1 text-[11px] font-semibold backdrop-blur-sm",
                enStock ? "text-foreground/75" : "text-primary",
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
        </div>

        <div className="flex flex-1 flex-col p-5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            {categorie}
          </span>
          {/* Lien étiré : le titre porte le lien — focusable et annoncé
              correctement — et son pseudo-élément couvre toute la carte, ce
              qui la rend cliquable sans recouvrement en dur. Le pied de carte
              repasse au-dessus pour garder le bouton « Ajouter » utilisable. */}
          <h3 className="mt-1.5 text-lg font-semibold leading-snug">
            <a
              href={href ?? "#"}
              onClick={onOuvrir}
              className="rounded-sm after:absolute after:inset-0 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {nom}
            </a>
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
          <p className="mt-auto pt-3 text-xs text-muted-foreground/70">
            Réf. {reference}
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between gap-3 border-t border-border px-5 py-4">
          <p className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-bold tracking-tight">
              {formatPrix(prix)}
            </span>
            <span className="text-sm text-muted-foreground">/{unite}</span>
          </p>
          <Button size="sm" type="button" onClick={onAjouter}>
            Ajouter
          </Button>
        </div>
      </div>
    )
  },
)

ProductCard.displayName = "ProductCard"

export { ProductCard }
