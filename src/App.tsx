import { BandeauDemo } from "@/components/sections/BandeauDemo"
import { BandeLivraison } from "@/components/sections/BandeLivraison"
import { Footer } from "@/components/sections/Footer"
import { GrilleProduits } from "@/components/sections/GrilleProduits"
import { Hero } from "@/components/sections/Hero"
import { PanierPanneau } from "@/components/sections/PanierPanneau"
import { TarifsDegressifs } from "@/components/sections/TarifsDegressifs"
import { PanierProvider } from "@/panier/PanierContext"

export default function App() {
  return (
    <PanierProvider>
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
        <PanierPanneau />
      </div>
    </PanierProvider>
  )
}
