import * as React from "react"
import { Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Avis } from "@/data/avis"

const TEXTE_MIN = 20
const TEXTE_MAX = 600
const AUTEUR_MAX = 40

type Erreurs = Partial<Record<"note" | "auteur" | "texte", string>>

/**
 * Formulaire d'avis. Rien n'est envoyé : l'avis rejoint la liste de la page et
 * disparaît au rechargement — il n'y a ni back-end ni stockage derrière cette
 * maquette. Le formulaire est fonctionnel malgré tout, validation comprise :
 * c'est ce qu'il y a à montrer.
 */
export function FormulaireAvis({
  onAjout,
}: {
  onAjout: (avis: Avis) => void
}) {
  const [note, setNote] = React.useState(0)
  const [auteur, setAuteur] = React.useState("")
  const [metier, setMetier] = React.useState("")
  const [texte, setTexte] = React.useState("")
  const [erreurs, setErreurs] = React.useState<Erreurs>({})
  const [confirme, setConfirme] = React.useState(false)

  const refNote = React.useRef<HTMLInputElement>(null)
  const refAuteur = React.useRef<HTMLInputElement>(null)
  const refTexte = React.useRef<HTMLTextAreaElement>(null)

  function valider(): Erreurs {
    const trouvees: Erreurs = {}
    if (note === 0) trouvees.note = "Choisissez une note."
    if (auteur.trim().length === 0) trouvees.auteur = "Indiquez votre nom."
    if (texte.trim().length < TEXTE_MIN) {
      trouvees.texte = `Votre avis doit faire au moins ${TEXTE_MIN} caractères.`
    }
    return trouvees
  }

  function envoyer(evenement: React.FormEvent) {
    evenement.preventDefault()
    const trouvees = valider()
    setErreurs(trouvees)

    if (Object.keys(trouvees).length > 0) {
      // Le focus part sur le premier champ fautif, dans l'ordre du formulaire.
      if (trouvees.note) refNote.current?.focus()
      else if (trouvees.auteur) refAuteur.current?.focus()
      else refTexte.current?.focus()
      setConfirme(false)
      return
    }

    onAjout({
      id: `local-${Date.now()}`,
      produit: "",
      auteur: auteur.trim(),
      metier: metier.trim() || "Client",
      note,
      date: new Date().toISOString().slice(0, 10),
      texte: texte.trim(),
      local: true,
    })

    setNote(0)
    setAuteur("")
    setMetier("")
    setTexte("")
    setErreurs({})
    setConfirme(true)
  }

  const classeChamp =
    "h-10 w-full rounded-md border border-border bg-card px-3 text-sm placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

  return (
    <form
      onSubmit={envoyer}
      noValidate
      className="mt-6 rounded-lg border border-border bg-card p-5"
      aria-labelledby="titre-formulaire-avis"
    >
      <h3 id="titre-formulaire-avis" className="text-lg font-semibold">
        Donner votre avis
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Rien n'est envoyé ni enregistré : votre avis s'ajoute à cette page et
        disparaît au rechargement.
      </p>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium">Votre note</legend>
        {/* Cinq boutons radio habillés en étoiles : le clavier et les lecteurs
            d'écran retrouvent un groupe de choix standard. */}
        <div className="mt-2 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((valeur) => (
            <label
              key={valeur}
              className="cursor-pointer rounded-sm p-0.5 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-card"
            >
              <input
                ref={valeur === 1 ? refNote : undefined}
                type="radio"
                name="note"
                value={valeur}
                checked={note === valeur}
                onChange={() => setNote(valeur)}
                aria-invalid={erreurs.note ? true : undefined}
                aria-describedby={erreurs.note ? "erreur-note" : undefined}
                className="sr-only"
              />
              <Star
                aria-hidden="true"
                className={cn(
                  "size-6 transition-colors",
                  valeur <= note
                    ? "fill-accent text-accent"
                    : "fill-transparent text-muted-foreground/50 hover:text-accent",
                )}
              />
              <span className="sr-only">
                {valeur} étoile{valeur > 1 ? "s" : ""}
              </span>
            </label>
          ))}
        </div>
        {erreurs.note && (
          <p id="erreur-note" className="mt-1.5 text-sm text-primary">
            {erreurs.note}
          </p>
        )}
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="avis-auteur" className="text-sm font-medium">
            Votre nom
          </label>
          <input
            ref={refAuteur}
            id="avis-auteur"
            value={auteur}
            maxLength={AUTEUR_MAX}
            onChange={(e) => setAuteur(e.target.value)}
            aria-invalid={erreurs.auteur ? true : undefined}
            aria-describedby={erreurs.auteur ? "erreur-auteur" : undefined}
            placeholder="Karim B."
            className={cn("mt-1.5", classeChamp)}
          />
          {erreurs.auteur && (
            <p id="erreur-auteur" className="mt-1.5 text-sm text-primary">
              {erreurs.auteur}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="avis-metier" className="text-sm font-medium">
            Métier et ville{" "}
            <span className="font-normal text-muted-foreground">
              (facultatif)
            </span>
          </label>
          <input
            id="avis-metier"
            value={metier}
            maxLength={AUTEUR_MAX}
            onChange={(e) => setMetier(e.target.value)}
            placeholder="Peintre, Lyon"
            className={cn("mt-1.5", classeChamp)}
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="avis-texte" className="text-sm font-medium">
          Votre avis
        </label>
        <textarea
          ref={refTexte}
          id="avis-texte"
          value={texte}
          rows={4}
          maxLength={TEXTE_MAX}
          onChange={(e) => setTexte(e.target.value)}
          aria-invalid={erreurs.texte ? true : undefined}
          aria-describedby={
            erreurs.texte ? "erreur-texte compteur-texte" : "compteur-texte"
          }
          placeholder="Comment se comporte cette référence sur vos chantiers ?"
          className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2 text-sm leading-relaxed placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
        <div className="mt-1.5 flex items-start justify-between gap-3">
          {erreurs.texte ? (
            <p id="erreur-texte" className="text-sm text-primary">
              {erreurs.texte}
            </p>
          ) : (
            <span />
          )}
          <p
            id="compteur-texte"
            className="shrink-0 text-xs tabular-nums text-muted-foreground"
          >
            {texte.length} / {TEXTE_MAX}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <Button type="submit">Publier mon avis</Button>
        {/* `role="status"` : la confirmation est annoncée sans voler le focus. */}
        <p role="status" className="text-sm text-muted-foreground">
          {confirme && "Merci, votre avis a été ajouté en haut de la liste."}
        </p>
      </div>
    </form>
  )
}
