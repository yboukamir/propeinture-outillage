import { PackageX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EnTeteProduit } from "@/components/EnTeteProduit"
import { SuggestionsProduits } from "@/components/SuggestionsProduits"
import { lienAccueil, naviguer, urlCatalogue } from "@/lib/navigation"

/** Au-delà, l'identifiant déborde de la mise en page sans rien apprendre. */
const LONGUEUR_MAX = 60

/**
 * Une référence demandée qui n'existe pas. Distinct du 404 de l'hébergeur :
 * l'adresse est valide, c'est son contenu qui manque — d'où une vue dans
 * l'application, avec son en-tête et son panier intacts.
 */
export function ProduitIntrouvable({ identifiant }: { identifiant: string }) {
  const abrege =
    identifiant.length > LONGUEUR_MAX
      ? `${identifiant.slice(0, LONGUEUR_MAX)}…`
      : identifiant

  return (
    <div className="min-h-screen bg-background">
      <EnTeteProduit />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="flex flex-col items-center rounded-xl border border-border bg-card px-6 py-14 text-center">
          <PackageX
            className="size-10 text-muted-foreground/50"
            aria-hidden="true"
          />
          <h1 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
            Référence introuvable
          </h1>
          <p className="mt-3 max-w-lg text-muted-foreground">
            Aucune référence ne correspond à{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm text-foreground">
              {abrege}
            </code>
            . Elle a peut-être été retirée du catalogue, ou le lien est
            incomplet.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button
              onClick={() => naviguer(urlCatalogue(), { ancre: "catalogue" })}
            >
              Parcourir le catalogue
            </Button>
            <Button
              variant="outline"
              onClick={() => naviguer(lienAccueil())}
            >
              Retour à l'accueil
            </Button>
          </div>
        </div>

        <SuggestionsProduits titre="Nos références les plus commandées" />
      </main>
    </div>
  )
}
