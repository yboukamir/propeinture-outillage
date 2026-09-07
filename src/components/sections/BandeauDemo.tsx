import { TriangleAlert } from "lucide-react"

/**
 * Bandeau permanent : le site est une maquette, aucune transaction n'existe.
 * Volontairement non masquable.
 */
export function BandeauDemo() {
  return (
    <div className="border-b border-secondary/40 bg-secondary text-secondary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2.5 px-4 py-2 text-center">
        <TriangleAlert className="size-4 shrink-0 text-accent" aria-hidden="true" />
        <p className="text-xs font-medium leading-snug sm:text-sm">
          Projet de démonstration — concept de style, aucune commande réelle
        </p>
      </div>
      <div className="h-1 bg-hazard" />
    </div>
  )
}
