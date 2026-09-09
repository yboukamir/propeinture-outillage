import {
  PricingSection,
  type PalierTarifaire,
} from "@/components/ui/pricing-section"
import { usePanier } from "@/panier/PanierContext"

const paliers: PalierTarifaire[] = [
  {
    id: "particulier",
    nom: "Particulier",
    description: "Le dépannage ponctuel, sans compte à créer.",
    remise: "Prix catalogue",
    volume: "1 à 9 unités",
    avantages: [
      "Prix catalogue, sans minimum de commande",
      "Paiement sécurisé PayPal",
      "Livraison standard à domicile",
      "Retour sous 14 jours",
    ],
    cta: "Commander à l'unité",
  },
  {
    id: "artisan",
    nom: "Artisan",
    description: "Le rythme d'un chantier après l'autre.",
    remise: "−12 %",
    volume: "dès 10 unités",
    avantages: [
      "Remise automatique de 12 % au panier",
      "Livraison prioritaire sur adresse de chantier",
      "Paiement en 10× sans frais",
      "Historique de commandes et recommande en un clic",
    ],
    cta: "Ouvrir un compte artisan",
    populaire: true,
  },
  {
    id: "grossiste",
    nom: "Chantier / Grossiste",
    description: "Les gros volumes et les marchés au long cours.",
    remise: "−22 %",
    volume: "dès 50 unités",
    avantages: [
      "Remise de 22 % sur l'ensemble du catalogue",
      "Devis sur mesure sous 24 h",
      "Compte pro avec encours et facturation mensuelle",
      "Interlocuteur dédié et planning de livraison",
    ],
    cta: "Demander un devis",
  },
]

export function TarifsDegressifs() {
  const { totaux } = usePanier()

  return (
    <PricingSection
      className="border-b border-border bg-plaster bg-tarp"
      surtitre="Tarifs dégressifs"
      titre="Plus la quantité monte, plus le prix descend"
      intro="La remise s'applique au panier, toutes références confondues. Pas d'abonnement, pas d'engagement : seule la quantité commandée compte."
      paliers={paliers}
      note="Prix hors taxes. Remises non cumulables avec une offre promotionnelle en cours."
      palierActifId={totaux.quantite > 0 ? totaux.palier.id : undefined}
    />
  )
}
