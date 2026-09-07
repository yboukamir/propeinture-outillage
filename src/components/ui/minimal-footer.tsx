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
    <footer className="relative" id={id}>
      <div className="mx-auto max-w-6xl bg-[radial-gradient(35%_80%_at_30%_0%,--theme(--color-foreground/.08),transparent)] md:border-x">
        <div className="absolute inset-x-0 h-px w-full bg-border" />

        <div className="grid max-w-6xl grid-cols-6 gap-6 p-6">
          <div className="col-span-6 flex flex-col gap-5 md:col-span-4">
            <div className="w-max">{marque}</div>
            <p className="max-w-sm text-sm text-balance text-muted-foreground">
              {accroche}
            </p>
            <ul className="flex flex-col gap-2.5">
              {contacts.map(({ icone: Icone, texte }) => (
                <li
                  key={texte}
                  className="flex items-center gap-2.5 text-sm text-muted-foreground"
                >
                  <Icone className="size-4 shrink-0 text-primary" />
                  {texte}
                </li>
              ))}
            </ul>
          </div>

          {colonnes.map((colonne) => (
            <div key={colonne.titre} className="col-span-3 w-full md:col-span-1">
              <span className="mb-1 text-xs text-muted-foreground">
                {colonne.titre}
              </span>
              <div className="flex flex-col gap-1">
                {colonne.liens.map((lien) => (
                  <a
                    key={lien.titre}
                    className="w-max py-1 text-sm duration-200 hover:underline"
                    href={lien.href}
                  >
                    {lien.titre}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute inset-x-0 h-px w-full bg-border" />

        <div className="flex max-w-6xl flex-col justify-between gap-2 px-6 pb-6 pt-4">
          <p className="text-center text-sm text-muted-foreground">
            © {annee} {mentions}
          </p>
          <p className="text-center text-xs font-medium text-primary">
            {rappel}
          </p>
        </div>
      </div>
    </footer>
  )
}
