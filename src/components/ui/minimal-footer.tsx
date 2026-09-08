import * as React from "react"

/**
 * Adapté de « Minimal Footer » par efferd (21st.dev)
 * https://21st.dev/@efferd/components/minimal-footer
 *
 * Modifications : colonnes de liens, marque et mentions sorties en props
 * (elles étaient codées en dur), icônes de réseaux sociaux remplacées par les
 * coordonnées de contact — une maquette n'a pas de comptes à pointer —,
 * largeur portée de `max-w-4xl` à `max-w-6xl` pour s'aligner sur le reste de
 * la page, et ligne de rappel « projet de démonstration » ajoutée en pied.
 */

export type ColonneFooter = {
  titre: string
  liens: { titre: string; href: string }[]
}

export type ContactFooter = {
  icone: React.ComponentType<{ className?: string }>
  texte: string
}

export interface MinimalFooterProps {
  marque: React.ReactNode
  accroche: string
  contacts: ContactFooter[]
  colonnes: ColonneFooter[]
  mentions: string
  rappel: string
  id?: string
}

export function MinimalFooter({
  marque,
  accroche,
  contacts,
  colonnes,
  mentions,
  rappel,
  id = "contact",
}: MinimalFooterProps) {
  const annee = new Date().getFullYear()

  return (
    <footer
      className="bg-tarp-dark relative bg-secondary text-secondary-foreground"
      id={id}
    >
      <div className="mx-auto max-w-6xl md:border-x md:border-border-dark">

        <div className="grid max-w-6xl grid-cols-6 gap-6 p-6">
          <div className="col-span-6 flex flex-col gap-5 md:col-span-4">
            <div className="w-max">{marque}</div>
            <p className="max-w-sm text-sm text-balance text-secondary-foreground/70">
              {accroche}
            </p>
            <ul className="flex flex-col gap-2.5">
              {contacts.map(({ icone: Icone, texte }) => (
                <li
                  key={texte}
                  className="flex items-center gap-2.5 text-sm text-secondary-foreground/80"
                >
                  <Icone className="size-4 shrink-0 text-accent" />
                  {texte}
                </li>
              ))}
            </ul>
          </div>

          {colonnes.map((colonne) => (
            <div key={colonne.titre} className="col-span-3 w-full md:col-span-1">
              <span className="mb-1 text-xs uppercase tracking-[0.16em] text-secondary-foreground/50">
                {colonne.titre}
              </span>
              <div className="flex flex-col gap-1">
                {colonne.liens.map((lien) => (
                  <a
                    key={lien.titre}
                    className="w-max py-1 text-sm text-secondary-foreground/80 duration-200 hover:text-accent hover:underline"
                    href={lien.href}
                  >
                    {lien.titre}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mx-6 h-px bg-border-dark" />

        <div className="flex max-w-6xl flex-col justify-between gap-2 px-6 pb-6 pt-4">
          <p className="text-center text-sm text-secondary-foreground/60">
            © {annee} {mentions}
          </p>
          <p className="text-center text-xs font-medium text-accent">
            {rappel}
          </p>
        </div>
      </div>
    </footer>
  )
}
