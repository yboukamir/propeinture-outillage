import { ArrowRight, Check } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

/**
 * Adapté de « Pricing Section 1 » par shadcnstore (21st.dev)
 * https://21st.dev/@shadcnstore/components/pricing-section-1
 *
 * Modifications : paliers et libellés sortis en props (ils étaient codés en
 * dur), `price/frequency` réinterprétés en remise / volume, libellé du bouton
 * propre à chaque palier, mise en avant du palier populaire renforcée
 * (bordure + décalage) et note de bas de section ajoutée.
 */

export interface PalierTarifaire {
  id: string
  nom: string
  description: string
  remise: string
  volume: string
  avantages: string[]
  cta: string
  populaire?: boolean
}

export interface PricingSectionProps {
  surtitre: string
  titre: string
  intro?: string
  paliers: PalierTarifaire[]
  note?: string
  id?: string
  className?: string
  /** Palier réellement atteint par le panier, signalé sur la carte concernée. */
  palierActifId?: string
}

export function PricingSection({
  surtitre,
  titre,
  intro,
  paliers,
  note,
  id = "tarifs",
  className,
  palierActifId,
}: PricingSectionProps) {
  return (
    <section className={cn("py-16 sm:py-20 lg:py-24", className)} id={id}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {surtitre}
          </p>
          <h2 className="text-3xl font-bold text-balance lg:text-4xl">
            {titre}
          </h2>
          {intro && (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {intro}
            </p>
          )}
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-3 lg:gap-8">
          {paliers.map((palier) => {
            const actif = palier.id === palierActifId
            return (
            <Card
              key={palier.id}
              className={cn(
                "relative flex h-full flex-col overflow-hidden py-6",
                {
                  // Le palier mis en avant bascule en charbon : c'est plus net
                  // qu'une simple bordure colorée, et ça rappelle le hero. En
                  // mode sombre ce contraste disparaît — toutes les cartes sont
                  // déjà sombres —, un liseré d'accent prend le relais.
                  "border-transparent bg-secondary text-secondary-foreground shadow-[0_30px_60px_-30px_rgba(23,19,15,0.6)] lg:-mt-4 lg:pt-9 lg:pb-9 dark:border-accent/40 dark:shadow-none":
                    palier.populaire,
                  // Palier atteint par le panier en cours.
                  "ring-2 ring-primary ring-offset-2 ring-offset-plaster": actif,
                },
              )}
            >
              <CardHeader className="px-6">
                <div className="flex items-center justify-between gap-4">
                  <CardTitle className="text-xl font-bold lg:text-2xl">
                    {palier.nom}
                  </CardTitle>
                  {actif ? (
                    <Badge className="rounded-full px-2.5 py-0.5 font-semibold">
                      Votre palier
                    </Badge>
                  ) : palier.populaire ? (
                    <Badge
                      variant="accent"
                      className="rounded-full px-2.5 py-0.5 font-semibold"
                    >
                      Le plus choisi
                    </Badge>
                  ) : null}
                </div>
                <p
                  className={cn(
                    "text-sm",
                    palier.populaire
                      ? "text-secondary-foreground/70"
                      : "text-muted-foreground",
                  )}
                >
                  {palier.description}
                </p>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col px-6">
                <div className="mb-6 flex items-baseline gap-2">
                  <span
                    className={cn(
                      "font-display text-4xl font-bold lg:text-5xl",
                      palier.populaire && "text-accent",
                    )}
                  >
                    {palier.remise}
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      palier.populaire
                        ? "text-secondary-foreground/60"
                        : "text-muted-foreground",
                    )}
                  >
                    {palier.volume}
                  </span>
                </div>
                <ul className="flex flex-col gap-3">
                  {palier.avantages.map((avantage) => (
                    <li key={avantage} className="flex items-start gap-2">
                      <Check
                        className={cn(
                          "mt-0.5 size-4 shrink-0",
                          palier.populaire ? "text-accent" : "text-primary",
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm leading-snug",
                          palier.populaire
                            ? "text-secondary-foreground/85"
                            : "text-muted-foreground",
                        )}
                      >
                        {avantage}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="border-0 bg-transparent px-6 pb-6">
                <Button
                  className="h-10 w-full cursor-pointer gap-2 px-8"
                  size="lg"
                  type="button"
                  variant={palier.populaire ? "accent" : "outline"}
                  aria-label={`${palier.cta} — palier ${palier.nom}`}
                >
                  {palier.cta} <ArrowRight />
                </Button>
              </CardFooter>
            </Card>
            )
          })}
        </div>

        {note && (
          <p className="mt-8 text-center text-xs text-muted-foreground">
            {note}
          </p>
        )}
      </div>
    </section>
  )
}
