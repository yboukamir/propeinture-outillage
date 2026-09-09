import * as React from "react"
import { Info, MessageSquareOff, ThumbsUp } from "lucide-react"

import { Etoiles } from "@/components/Etoiles"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { type Avis } from "@/data/avis"
import { FormulaireAvis } from "@/components/sections/FormulaireAvis"

const dateLongue = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

type TriAvis = "recent" | "note-desc" | "note-asc" | "utiles"

const TRIS_AVIS: { valeur: TriAvis; libelle: string }[] = [
  { valeur: "recent", libelle: "Plus récents" },
  { valeur: "utiles", libelle: "Les plus utiles" },
  { valeur: "note-desc", libelle: "Meilleures notes" },
  { valeur: "note-asc", libelle: "Notes les plus basses" },
]

/**
 * Départage toujours par date décroissante, pour que la liste reste stable.
 * `utilite` compte le vote du visiteur : le tri doit suivre le nombre affiché,
 * sinon l'ordre contredirait les compteurs sous les yeux du lecteur.
 */
function trier(
  liste: Avis[],
  tri: TriAvis,
  utilite: (avis: Avis) => number,
) {
  if (tri === "recent") return liste
  return [...liste].sort((a, b) => {
    const ecart =
      tri === "utiles"
        ? utilite(b) - utilite(a)
        : tri === "note-desc"
          ? b.note - a.note
          : a.note - b.note
    return ecart || b.date.localeCompare(a.date)
  })
}

export function AvisClients({
  liste: tous,
  moyenne,
  onAjout,
}: {
  liste: Avis[]
  moyenne: number | null
  onAjout: (avis: Avis) => void
}) {
  /*
   * En état local et non dans l'URL, contrairement au tri du catalogue. La
   * règle qu'on suit : l'URL porte ce qu'on regarde — fiche, filtre, recherche,
   * ordre du catalogue —, l'état local porte la façon de le lire à l'intérieur
   * d'une vue. Personne ne partage un lien vers « cette fiche, avis triés par
   * note croissante ».
   */
  const [tri, setTri] = React.useState<TriAvis>("recent")
  /** Note sélectionnée dans l'histogramme, `null` quand tout est affiché. */
  const [filtreNote, setFiltreNote] = React.useState<number | null>(null)
  /** Avis que le visiteur a marqués utiles. Rien n'est envoyé, comme le reste. */
  const [votes, setVotes] = React.useState<ReadonlySet<string>>(new Set())

  /** Compteur tel qu'il s'affiche : base des données plus le vote du visiteur. */
  const utilite = (avis: Avis) => avis.utiles + (votes.has(avis.id) ? 1 : 0)

  function basculerVote(id: string) {
    setVotes((actuels) => {
      const suivants = new Set(actuels)
      if (!suivants.delete(id)) suivants.add(id)
      return suivants
    })
  }

  // De 5 à 1 : c'est l'ordre attendu d'un histogramme d'avis.
  const distribution = [5, 4, 3, 2, 1].map((note) => ({
    note,
    nombre: tous.filter((a) => a.note === note).length,
  }))

  const filtres = filtreNote
    ? tous.filter((a) => a.note === filtreNote)
    : tous
  const liste = trier(filtres, tri, utilite)

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
            {/* Le total, pas le nombre filtré : la moyenne à côté porte sur
                l'ensemble, les deux chiffres doivent parler du même lot. */}
            <span className="text-muted-foreground">· {tous.length} avis</span>
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

      {tous.length > 0 && (
        <div className="mt-6 rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold">Filtrer par note</h3>
          <ul className="mt-3 flex flex-col gap-1.5">
            {distribution.map(({ note, nombre }) => {
              const actif = filtreNote === note
              const part = tous.length === 0 ? 0 : (nombre / tous.length) * 100
              return (
                <li key={note}>
                  <button
                    type="button"
                    // Un clic sur la note active la retire : pas besoin d'un
                    // bouton « tout » séparé.
                    onClick={() => setFiltreNote(actif ? null : note)}
                    disabled={nombre === 0}
                    aria-pressed={actif}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                      nombre === 0
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-muted",
                      actif && "bg-muted",
                    )}
                  >
                    <span className="w-16 shrink-0 tabular-nums">
                      {note} étoile{note > 1 ? "s" : ""}
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-2 flex-1 overflow-hidden rounded-full bg-foreground/10"
                    >
                      <span
                        className="block h-full rounded-full bg-accent transition-[width] duration-300"
                        style={{ width: `${part}%` }}
                      />
                    </span>
                    <span className="w-6 shrink-0 text-right tabular-nums text-muted-foreground">
                      {nombre}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          {filtreNote !== null && (
            <p className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3 text-sm text-muted-foreground">
              <span aria-live="polite">
                {liste.length} avis sur {tous.length} affiché
                {liste.length > 1 ? "s" : ""}.
              </span>
              <button
                type="button"
                onClick={() => setFiltreNote(null)}
                className="font-medium text-primary underline underline-offset-4"
              >
                Voir tous les avis
              </button>
            </p>
          )}
        </div>
      )}

      {liste.length > 1 && (
        <label className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
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

      {tous.length === 0 ? (
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
                  <p className="flex flex-wrap items-center gap-2 font-semibold">
                    {avis.auteur}
                    {avis.local && (
                      <span className="rounded-full border border-border px-2 py-0.5 text-xs font-normal text-muted-foreground">
                        Non enregistré
                      </span>
                    )}
                  </p>
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

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => basculerVote(avis.id)}
                  aria-pressed={votes.has(avis.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                    votes.has(avis.id)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary hover:text-primary",
                  )}
                >
                  <ThumbsUp
                    className={cn(
                      "size-4",
                      votes.has(avis.id) && "fill-primary/20",
                    )}
                    aria-hidden="true"
                  />
                  {votes.has(avis.id) ? "Avis utile" : "Cet avis est utile"}
                  <span className="tabular-nums">
                    {utilite(avis)}
                  </span>
                </button>
                {votes.has(avis.id) && (
                  <span className="text-xs text-muted-foreground">
                    Compté seulement ici
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <FormulaireAvis
        onAjout={(nouveau) => {
          // Sans ça, un avis déposé avec une autre note serait invisible :
          // il tomberait hors du filtre actif.
          setFiltreNote(null)
          onAjout(nouveau)
        }}
      />
    </section>
  )
}
