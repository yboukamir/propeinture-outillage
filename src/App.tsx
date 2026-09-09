import { BandeauDemo } from "@/components/sections/BandeauDemo"
import { BandeLivraison } from "@/components/sections/BandeLivraison"
import { Footer } from "@/components/sections/Footer"
import { GrilleProduits } from "@/components/sections/GrilleProduits"
import { Hero } from "@/components/sections/Hero"
import { PageProduit } from "@/components/sections/PageProduit"
import { PanierPanneau } from "@/components/sections/PanierPanneau"
import { TarifsDegressifs } from "@/components/sections/TarifsDegressifs"
import { produits } from "@/data/produits"
import { useProduitAffiche } from "@/lib/navigation"
import { PanierProvider } from "@/panier/PanierContext"

export default function App() {
  return (
    <PanierProvider>
      <Contenu />
      <PanierPanneau />
    </PanierProvider>
  )
}

function Contenu() {
  const produitId = useProduitAffiche()
  const produit = produitId
    ? produits.find((p) => p.id === produitId)
    : undefined

  // Un identifiant inconnu retombe sur l'accueil plutôt que sur une page vide.
  if (produit) {
    return (
      <>
        {/* Le bandeau reste visible sur la fiche produit : c'est une maquette
            partout, pas seulement sur l'accueil. */}
        <div className="sticky top-0 z-50">
          <BandeauDemo />
        </div>
        <PageProduit produit={produit} />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Le bandeau reste seul en zone fixe : le header fait partie du bloc
          hero, comme dans le composant Commerce Hero d'origine. */}
      <div className="sticky top-0 z-50">
        <BandeauDemo />
      </div>
      <main>
        <Hero />
        <GrilleProduits />
        <TarifsDegressifs />
        <BandeLivraison />
      </main>
      <Footer />
    </div>
  )
}
