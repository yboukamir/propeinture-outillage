import { CreditCard, ShieldCheck, Truck } from "lucide-react"

import { CommerceHero } from "@/components/ui/commerce-hero"
import { Marque } from "@/components/Marque"
import { ProduitIllustration } from "@/components/ProduitIllustration"

const navigation = [
  { name: "Catalogue", href: "#catalogue" },
  { name: "Tarifs pros", href: "#tarifs" },
  { name: "Livraison", href: "#livraison" },
  { name: "Contact", href: "#contact" },
]

const reassurance = [
  { icone: ShieldCheck, texte: "Paiement sécurisé PayPal" },
  { icone: CreditCard, texte: "10× sans frais" },
  { icone: Truck, texte: "Livraison chantier 48 h" },
]

const vignettes = [
  {
    title: "Application",
    href: "#catalogue",
    visuel: <ProduitIllustration id="rouleau" />,
  },
  {
    title: "Préparation",
    href: "#catalogue",
    visuel: <ProduitIllustration id="enduit" />,
  },
  {
    title: "Protection",
    href: "#catalogue",
    visuel: <ProduitIllustration id="bache" />,
  },
  {
    title: "Accessoires",
    href: "#catalogue",
    visuel: <ProduitIllustration id="grille" />,
  },
]

export function Hero() {
  return (
    <CommerceHero
      marque={<Marque />}
      navigation={navigation}
      telephone="01 23 45 67 89"
      titre={
        <>
          <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
            L'outillage qui tient
          </span>
          <br />
          <span className="text-foreground">la cadence du chantier.</span>
        </>
      }
      sousTitre="Rouleaux, pinceaux, bâches et enduits. Commande rapide en petite ou grosse quantité, tarifs dégressifs pour les pros."
      ctaPrincipal={{ label: "Voir le catalogue", href: "#catalogue" }}
      ctaSecondaire={{ label: "Tarifs vente en gros", href: "#tarifs" }}
      reassurance={reassurance}
      vignettes={vignettes}
    />
  )
}
