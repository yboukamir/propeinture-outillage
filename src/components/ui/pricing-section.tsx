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
}

export function PricingSection({
  surtitre,
  titre,
  intro,
  paliers,
  note,
  id = "tarifs",
  className,
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
          {paliers.map((palier) => (
            <Card
              key={palier.id}
              className={cn("flex h-full flex-col overflow-hidden py-6", {
                "border-primary shadow-lg lg:-mt-4 lg:pb-9 lg:pt-9":
                  palier.populaire,
              })}
            >
              <CardHeader className="px-6">
                <div className="flex items-center justify-between gap-4">
                  <CardTitle className="text-xl font-bold lg:text-2xl">
                    {palier.nom}
                  </CardTitle>
                  {palier.populaire ? (
                    <Badge className="rounded-full px-2.5 py-0.5 font-semibold">
                      Le plus choisi
                    </Badge>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">
                  {palier.description}
                </p>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col px-6">
                <div className="mb-6 flex items-baseline gap-2">
                  <span
                    className={cn(
                      "text-3xl font-bold lg:text-4xl",
                      palier.populaire && "text-primary",
                    )}
                  >
                    {palier.remise}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {palier.volume}
                  </span>
                </div>
                <ul className="flex flex-col gap-3">
                  {palier.avantages.map((avantage) => (
                    <li key={avantage} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span className="text-sm leading-snug text-muted-foreground">
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
                  variant={palier.populaire ? "default" : "outline"}
                  aria-label={`${palier.cta} — palier ${palier.nom}`}
                >
                  {palier.cta} <ArrowRight />
                </Button>
              </CardFooter>
            </Card>
          ))}
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
