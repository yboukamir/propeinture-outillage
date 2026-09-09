import type * as React from "react"
import { CreditCard, ShieldCheck, Truck } from "lucide-react"

import { CommerceHero } from "@/components/ui/commerce-hero"
import { Marque } from "@/components/Marque"
import { categories } from "@/data/produits"
import { usePanier } from "@/panier/PanierContext"
import { focaliserRecherche, lienCategorie, naviguer } from "@/lib/navigation"

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

/* Les vignettes filtrent réellement le catalogue au lieu de s'y contenter d'y
   faire défiler. */
const vignettes = categories.map((categorie) => ({
  title: categorie.titre,
  href: lienCategorie(categorie.titre),
  photo: categorie.photo,
  alt: categorie.alt,
  onClick: (evenement: React.MouseEvent) => {
    evenement.preventDefault()
    naviguer(lienCategorie(categorie.titre), { ancre: "catalogue" })
  },
}))

export function Hero() {
  const { totaux, ouvrir } = usePanier()

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
      panier={{ nombre: totaux.quantite, ouvrir }}
      onRechercher={focaliserRecherche}
    />
  )
}
