import * as React from "react"
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  Info,
  MessageSquareOff,
  ThumbsUp,
} from "lucide-react"

import { Etoiles } from "@/components/Etoiles"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { type Avis } from "@/data/avis"
import { FormulaireAvis } from "@/components/sections/FormulaireAvis"

const dateLongue = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

type TriAvis =
  | "recent"
  | "ancien"
  | "note-desc"
  | "note-asc"
  | "utiles"
  | "repondus"

/** Cinq avis par page : au-delà, la fiche devient un mur de texte. */
const PAR_PAGE = 5

const TRIS_AVIS: { valeur: TriAvis; libelle: string }[] = [
  { valeur: "recent", libelle: "Plus récents" },
  { valeur: "ancien", libelle: "Plus anciens" },
  { valeur: "utiles", libelle: "Les plus utiles" },
  // La boutique répond au plus une fois par avis : trier par nombre de
  // réponses revient à remonter ceux qui en ont une, et le libellé le dit.
  { valeur: "repondus", libelle: "Avec réponse d'abord" },
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
  // Les données arrivent déjà triées de la plus récente à la plus ancienne :
  // « Plus récents » n'a rien à faire, « Plus anciens » les renverse.
  if (tri === "recent") return liste
  if (tri === "ancien") return [...liste].reverse()
  return [...liste].sort((a, b) => {
    const ecart =
      tri === "utiles"
        ? utilite(b) - utilite(a)
        : tri === "repondus"
          ? Number(Boolean(b.reponse)) - Number(Boolean(a.reponse))
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
  /** Avis signalés. Aucune modération derrière : la page le dit à l'écran. */
  const [signales, setSignales] = React.useState<ReadonlySet<string>>(new Set())
  const [page, setPage] = React.useState(1)

  /** Le repère de la liste, pour y ramener le lecteur au changement de page. */
  const debutListe = React.useRef<HTMLDivElement>(null)

  /** Compteur tel qu'il s'affiche : base des données plus le vote du visiteur. */
  const utilite = (avis: Avis) => avis.utiles + (votes.has(avis.id) ? 1 : 0)

  /** Change de page et ramène le lecteur en haut de la liste, pas de la page. */
  function allerPage(numero: number) {
    setPage(numero)
    debutListe.current?.scrollIntoView({ block: "start" })
  }

  function basculerVote(id: string) {
    setVotes((actuels) => {
      const suivants = new Set(actuels)
      if (!suivants.delete(id)) suivants.add(id)
      return suivants
    })
  }

  /**
   * Le signalement est annulable, sur le même bouton dont le libellé change :
   * un signalement par erreur ne doit pas être une impasse, et remplacer le
   * bouton par un autre élément ferait perdre le focus au clavier.
   */
  function basculerSignalement(id: string) {
    setSignales((actuels) => {
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

  const pages = Math.max(1, Math.ceil(liste.length / PAR_PAGE))
  /*
   * La page est bornée à chaque rendu plutôt que corrigée par un effet :
   * filtrer, trier ou déposer un avis peut raccourcir la liste sous la page
   * courante, qui afficherait alors du vide le temps d'un rendu.
   */
  const pageCourante = Math.min(page, pages)
  const visibles = liste.slice(
    (pageCourante - 1) * PAR_PAGE,
    pageCourante * PAR_PAGE,
  )

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
        Avis et réponses fictifs, écrits pour la démonstration : ni ces clients
        ni cette boutique n'existent.
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
                    onClick={() => {
                      setFiltreNote(actif ? null : note)
                      setPage(1)
                    }}
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
                onClick={() => {
                  setFiltreNote(null)
                  setPage(1)
                }}
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
            onChange={(e) => {
              setTri(e.target.value as TriAvis)
              setPage(1)
            }}
            className="h-9 rounded-full border border-border bg-card px-3 text-sm text-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {TRIS_AVIS.filter(
              // Sur une fiche sans aucune réponse, ce tri ne bougerait rien :
              // autant ne pas proposer un choix sans effet.
              (option) =>
                option.valeur !== "repondus" || tous.some((a) => a.reponse),
            ).map((option) => (
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
        <>
          <div ref={debutListe} className="scroll-mt-16" />
          <ul className="mt-4 flex flex-col gap-4">
            {visibles.map((avis) => (
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

                {/* Placée juste sous l'avis auquel elle répond, et décalée
                    pour qu'on ne la confonde pas avec la parole du client. La
                    rangée d'actions qui suit porte sur l'avis, pas sur elle. */}
                {avis.reponse && (
                  <div className="mt-4 rounded-md border-s-2 border-primary/40 bg-muted/40 py-3 pe-3 ps-4">
                    <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm font-semibold">
                      Réponse de ProPeinture Outillage
                      <span className="rounded-full border border-border px-2 py-0.5 text-xs font-normal text-muted-foreground">
                        Vendeur
                      </span>
                      <time
                        dateTime={avis.reponse.date}
                        className="text-xs font-normal text-muted-foreground"
                      >
                        {dateLongue.format(new Date(avis.reponse.date))}
                      </time>
                    </p>
                    <p className="mt-2 text-sm leading-relaxed">
                      {avis.reponse.texte}
                    </p>
                  </div>
                )}

                {/* Passe à la ligne plutôt que de déborder : sur mobile,
                    un avis à la fois voté et signalé ne tient pas sur une. */}
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
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

                  {/* Pas de signalement sur son propre avis : il porte déjà la
                      mention « Non enregistré » et on ne se dénonce pas. */}
                  {!avis.local && (
                    <div className="ms-auto flex flex-wrap items-center justify-end gap-2">
                      {/* Région d'état montée en permanence : un lecteur
                          d'écran annonce le texte qui y arrive, ce qu'il ne
                          fait pas d'une région apparue en même temps que lui. */}
                      <p
                        role="status"
                        className="flex items-center gap-1.5 text-xs text-muted-foreground"
                      >
                        {signales.has(avis.id) && (
                          <>
                            <Flag
                              className="size-3.5 fill-current"
                              aria-hidden="true"
                            />
                            Signalé, rien n'a été envoyé
                          </>
                        )}
                      </p>
                      <button
                        type="button"
                        onClick={() => basculerSignalement(avis.id)}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                      >
                        {!signales.has(avis.id) && (
                          <Flag className="size-3.5" aria-hidden="true" />
                        )}
                        {/* Le soulignement est porté par le libellé : sur le
                            conteneur flex, il n'atteindrait aucun enfant. */}
                        <span className="underline underline-offset-4">
                          {signales.has(avis.id)
                            ? "Annuler le signalement"
                            : "Signaler"}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {pages > 1 && (
            <nav
              aria-label="Pagination des avis"
              className="mt-6 flex flex-wrap items-center justify-center gap-2"
            >
              <Button
                variant="outline"
                size="sm"
                disabled={pageCourante === 1}
                onClick={() => allerPage(pageCourante - 1)}
              >
                <ChevronLeft aria-hidden="true" />
                Précédent
              </Button>

              <ul className="flex items-center gap-1">
                {Array.from({ length: pages }, (_, i) => i + 1).map((numero) => (
                  <li key={numero}>
                    <button
                      type="button"
                      onClick={() => allerPage(numero)}
                      aria-current={numero === pageCourante ? "page" : undefined}
                      aria-label={`Page ${numero} sur ${pages}`}
                      className={cn(
                        "size-9 rounded-md text-sm font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        numero === pageCourante
                          ? "bg-secondary text-secondary-foreground"
                          : "border border-border hover:border-primary hover:text-primary",
                      )}
                    >
                      {numero}
                    </button>
                  </li>
                ))}
              </ul>

              <Button
                variant="outline"
                size="sm"
                disabled={pageCourante === pages}
                onClick={() => allerPage(pageCourante + 1)}
              >
                Suivant
                <ChevronRight aria-hidden="true" />
              </Button>
            </nav>
          )}
        </>
      )}

      <FormulaireAvis
        onAjout={(nouveau) => {
          // Sans ça, un avis déposé avec une autre note serait invisible :
          // il tomberait hors du filtre actif.
          setFiltreNote(null)
          // Même raison : il est daté d'aujourd'hui, donc dernier de la liste
          // sous « Plus anciens » et introuvable sous les tris par note.
          setTri("recent")
          // L'avis part en tête de liste : la page 1 est la seule où le voir.
          setPage(1)
          onAjout(nouveau)
        }}
      />
    </section>
  )
}
