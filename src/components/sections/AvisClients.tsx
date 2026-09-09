import * as React from "react"
import { Info, MessageSquareOff } from "lucide-react"

import { Etoiles } from "@/components/Etoiles"
import { Separator } from "@/components/ui/separator"
import { avisPour, noteMoyenne, type Avis } from "@/data/avis"

const dateLongue = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

type TriAvis = "recent" | "note-desc" | "note-asc"

const TRIS_AVIS: { valeur: TriAvis; libelle: string }[] = [
  { valeur: "recent", libelle: "Plus récents" },
  { valeur: "note-desc", libelle: "Meilleures notes" },
  { valeur: "note-asc", libelle: "Notes les plus basses" },
]

/** À note égale, le plus récent d'abord — la liste reste stable et lisible. */
function trier(liste: Avis[], tri: TriAvis) {
  if (tri === "recent") return liste
  return [...liste].sort(
    (a, b) =>
      (tri === "note-desc" ? b.note - a.note : a.note - b.note) ||
      b.date.localeCompare(a.date),
  )
}

export function AvisClients({ produitId }: { produitId: string }) {
  /*
   * En état local et non dans l'URL, contrairement au tri du catalogue. La
   * règle qu'on suit : l'URL porte ce qu'on regarde — fiche, filtre, recherche,
   * ordre du catalogue —, l'état local porte la façon de le lire à l'intérieur
   * d'une vue. Personne ne partage un lien vers « cette fiche, avis triés par
   * note croissante ».
   */
  const [tri, setTri] = React.useState<TriAvis>("recent")

  const liste = trier(avisPour(produitId), tri)
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

      {liste.length > 1 && (
        <label className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <span className="shrink-0">Trier les avis</span>
          <select
            value={tri}
            onChange={(e) => setTri(e.target.value as TriAvis)}
            className="h-9 rounded-full border border-border bg-card px-3 text-sm text-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {TRIS_AVIS.map((option) => (
              <option key={option.valeur} value={option.valeur}>
                {option.libelle}
              </option>
            ))}
          </select>
        </label>
      )}

      {liste.length === 0 ? (
        <p className="mt-6 flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-8 text-sm text-muted-foreground">
          <MessageSquareOff className="size-4 shrink-0" aria-hidden="true" />
          Cette référence n'a pas encore d'avis.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-4">
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
