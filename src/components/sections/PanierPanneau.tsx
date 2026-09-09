import { Minus, Plus, ShoppingBasket, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { usePanier } from "@/panier/PanierContext"
import { formatRemise } from "@/lib/tarifs"
import { formatPrix } from "@/lib/utils"

export function PanierPanneau() {
  const {
    lignes,
    totaux,
    ouvert,
    fermer,
    definirQuantite,
    retirer,
    vider,
  } = usePanier()

  return (
    <Sheet open={ouvert} onOpenChange={(o) => !o && fermer()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-l border-border bg-background p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border p-6 text-left">
          <SheetTitle className="flex items-center gap-2.5">
            <ShoppingBasket className="size-5 text-primary" aria-hidden="true" />
            Votre panier
            {totaux.quantite > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                {totaux.quantite} unité{totaux.quantite > 1 ? "s" : ""}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {lignes.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <ShoppingBasket
              className="size-10 text-muted-foreground/40"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              Votre panier est vide. Ajoutez des références au catalogue pour
              voir la remise se déclencher.
            </p>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto">
              {lignes.map((ligne) => (
                <li key={ligne.id} className="flex gap-4 p-5">
                  <img
                    src={ligne.photo}
                    alt={ligne.photoAlt}
                    className="size-20 shrink-0 rounded-md border border-border object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="text-sm font-semibold leading-snug">
                      {ligne.nom}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatPrix(ligne.prix)} /{ligne.unite}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8"
                          aria-label={`Retirer une unité de ${ligne.nom}`}
                          onClick={() =>
                            definirQuantite(ligne.id, ligne.quantite - 1)
                          }
                        >
                          <Minus />
                        </Button>
                        <span
                          className="w-9 text-center text-sm font-semibold tabular-nums"
                          aria-live="polite"
                        >
                          {ligne.quantite}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8"
                          aria-label={`Ajouter une unité de ${ligne.nom}`}
                          onClick={() =>
                            definirQuantite(ligne.id, ligne.quantite + 1)
                          }
                        >
                          <Plus />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold tabular-nums">
                          {formatPrix(ligne.prix * ligne.quantite)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-primary"
                          aria-label={`Supprimer ${ligne.nom} du panier`}
                          onClick={() => retirer(ligne.id)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border bg-plaster p-5">
              <ProgressionPalier />

              <dl className="mt-4 flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Sous-total</dt>
                  <dd className="tabular-nums">
                    {formatPrix(totaux.sousTotal)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    Remise {totaux.palier.nom.toLowerCase()}
                  </dt>
                  <dd className="tabular-nums text-primary">
                    {totaux.montantRemise > 0
                      ? `− ${formatPrix(totaux.montantRemise)}`
                      : formatRemise(0)}
                  </dd>
                </div>
              </dl>

              <Separator className="my-3" />

              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium">Total HT</span>
                <span className="font-display text-2xl font-bold tabular-nums">
                  {formatPrix(totaux.total)}
                </span>
              </div>

              <Button className="mt-4 w-full" size="lg" type="button" disabled>
                Commander — désactivé sur la démo
              </Button>
              <button
                type="button"
                onClick={vider}
                className="mt-3 w-full text-xs text-muted-foreground underline underline-offset-4 hover:text-primary"
              >
                Vider le panier
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

/** Jauge vers le palier suivant : c'est l'argument commercial de la boutique. */
function ProgressionPalier() {
  const { totaux } = usePanier()
  const { suivant, unitesAvantSuivant, quantite, palier } = totaux

  if (!suivant) {
    return (
      <p className="rounded-md bg-secondary px-3 py-2.5 text-sm font-medium text-secondary-foreground">
        Meilleur palier atteint : {formatRemise(palier.remise)} sur tout le
        panier.
      </p>
    )
  }

  const depart = palier.seuil
  const avancement = Math.min(
    100,
    Math.max(0, ((quantite - depart) / (suivant.seuil - depart)) * 100),
  )

  return (
    <div>
      <p className="text-sm">
        Plus que{" "}
        <strong className="font-semibold text-primary">
          {unitesAvantSuivant} unité{unitesAvantSuivant > 1 ? "s" : ""}
        </strong>{" "}
        pour passer à {formatRemise(suivant.remise)}.
      </p>
      <div
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuemin={depart}
        aria-valuemax={suivant.seuil}
        aria-valuenow={quantite}
        aria-label={`Progression vers le palier ${suivant.nom}`}
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300"
          style={{ width: `${avancement}%` }}
        />
      </div>
    </div>
  )
}
