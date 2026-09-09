import { ArrowLeft, ShoppingBasket } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Marque } from "@/components/Marque"
import { lienAccueil, naviguer } from "@/lib/navigation"
import { usePanier } from "@/panier/PanierContext"

/**
 * En-tête de la page produit. Le header du site vit dans le composant hero,
 * inséparable de son panneau charbon : la fiche produit a donc le sien, plus
 * sobre, réduit au retour, à la marque et au panier.
 */
export function EnTeteProduit() {
  const { totaux, ouvrir } = usePanier()

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a
          href={lienAccueil()}
          onClick={(e) => {
            e.preventDefault()
            naviguer(lienAccueil())
          }}
          className="flex items-center gap-3"
        >
          <span className="flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span className="sr-only">Retour au catalogue</span>
          </span>
          <Marque />
        </a>

        <Button
          variant="outline"
          onClick={ouvrir}
          className="relative gap-2"
          aria-label={`Panier, ${totaux.quantite} unité${totaux.quantite > 1 ? "s" : ""}`}
        >
          <ShoppingBasket className="size-4" />
          <span className="hidden sm:inline">Panier</span>
          {totaux.quantite > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground tabular-nums">
              {totaux.quantite}
            </span>
          )}
        </Button>
      </div>
    </header>
  )
}
