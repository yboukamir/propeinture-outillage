import { CreditCard, ShieldCheck, Truck } from "lucide-react"

import { CommerceHero } from "@/components/ui/commerce-hero"
import { Marque } from "@/components/Marque"
import { categories } from "@/data/produits"

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

const vignettes = categories.map((categorie) => ({
  title: categorie.titre,
  href: "#catalogue",
  photo: categorie.photo,
  alt: categorie.alt,
}))

export function Hero() {
  return (
    <CommerceHero
      marque={<Marque />}
      navigation={navigation}
      telephone="01 23 45 67 89"
      titre={
        <>
          L'outillage qui tient
          <br />
          <span className="text-accent">la cadence du chantier.</span>
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
