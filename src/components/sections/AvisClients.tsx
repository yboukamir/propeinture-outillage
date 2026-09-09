import { Info, MessageSquareOff } from "lucide-react"

import { Etoiles } from "@/components/Etoiles"
import { Separator } from "@/components/ui/separator"
import { avisPour, noteMoyenne } from "@/data/avis"

const dateLongue = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

export function AvisClients({ produitId }: { produitId: string }) {
  const liste = avisPour(produitId)
  const moyenne = noteMoyenne(produitId)

  return (
    <section className="mt-16" aria-labelledby="titre-avis">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="titre-avis" className="text-2xl font-bold tracking-tight">
          Avis des professionnels
        </h2>
        {moyenne !== null && (
          <p className="flex items-center gap-2 text-sm">
            <Etoiles note={moyenne} muet />
            <span className="font-semibold">
              {moyenne.toLocaleString("fr-FR")} sur 5
            </span>
            <span className="text-muted-foreground">
              · {liste.length} avis
            </span>
          </p>
        )}
      </div>

      {/* Le bandeau de la page dit déjà que le site est une maquette ; on le
          redit ici, parce qu'un avis inventé se prend plus facilement au
          sérieux qu'un prix inventé. */}
      <p className="mt-3 flex items-start gap-2 rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        Avis fictifs, écrits pour la démonstration : ni ces clients ni cette
        boutique n'existent.
      </p>

      {liste.length === 0 ? (
        <p className="mt-6 flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-8 text-sm text-muted-foreground">
          <MessageSquareOff className="size-4 shrink-0" aria-hidden="true" />
          Cette référence n'a pas encore d'avis.
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-4">
          {liste.map((avis) => (
            <li
              key={avis.id}
              className="rounded-lg border border-border bg-card p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{avis.auteur}</p>
                  <p className="text-sm text-muted-foreground">
                    {avis.metier}
                  </p>
                </div>
                <div className="text-right">
                  <Etoiles note={avis.note} taille="petite" />
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    <time dateTime={avis.date}>
                      {dateLongue.format(new Date(avis.date))}
                    </time>
                  </p>
                </div>
              </div>
              <Separator className="my-3" />
              <p className="text-sm leading-relaxed">{avis.texte}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
