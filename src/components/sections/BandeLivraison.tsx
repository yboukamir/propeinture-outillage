import { CreditCard, PackageCheck, ShieldCheck, Truck } from "lucide-react"

const garanties = [
  {
    icone: Truck,
    titre: "Livraison chantier 48 h",
    texte: "Dépôt sur adresse de chantier, créneau confirmé la veille par SMS.",
  },
  {
    icone: ShieldCheck,
    titre: "Paiement sécurisé PayPal",
    texte: "Aucune donnée bancaire conservée, protection des achats incluse.",
  },
  {
    icone: CreditCard,
    titre: "10× sans frais",
    texte: "Étalez les grosses commandes de matériel sans surcoût.",
  },
  {
    icone: PackageCheck,
    titre: "Retour sous 14 jours",
    texte: "Emballage d'origine non ouvert, reprise sans justificatif.",
  },
]

export function BandeLivraison() {
  return (
    <section id="livraison" className="border-b border-border py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {garanties.map(({ icone: Icone, titre, texte }) => (
            <li key={titre}>
              <span className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icone className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-sm font-semibold tracking-tight">{titre}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {texte}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
