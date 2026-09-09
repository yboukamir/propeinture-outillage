import { Mail, MapPin, Phone } from "lucide-react"

import { Marque } from "@/components/Marque"
import { MinimalFooter } from "@/components/ui/minimal-footer"

const contacts = [
  { icone: Phone, texte: "01 23 45 67 89" },
  { icone: Mail, texte: "contact@propeinture-demo.fr" },
  { icone: MapPin, texte: "Zone artisanale — adresse fictive" },
]

const colonnes = [
  {
    titre: "Catalogue",
    liens: [
      { titre: "Application", href: "#catalogue" },
      { titre: "Préparation", href: "#catalogue" },
      { titre: "Protection", href: "#catalogue" },
      { titre: "Accessoires", href: "#catalogue" },
    ],
  },
  {
    titre: "Professionnels",
    liens: [
      { titre: "Tarifs dégressifs", href: "#tarifs" },
      { titre: "Compte pro", href: "#tarifs" },
      { titre: "Demande de devis", href: "#tarifs" },
      { titre: "Livraison chantier", href: "#livraison" },
    ],
  },
]

export function Footer() {
  return (
    <MinimalFooter
      marque={<Marque sombre />}
      accroche="Outillage et matériel pour peintres professionnels. Petite ou grosse quantité, livré sur chantier."
      contacts={contacts}
      colonnes={colonnes}
      mentions="ProPeinture Outillage — maquette fictive, société inexistante."
      depot={{
        href: "https://github.com/yboukamir/propeinture-outillage",
        libelle: "Code source sur GitHub",
      }}
      rappel="Projet de démonstration — aucune commande réelle"
    />
  )
}
