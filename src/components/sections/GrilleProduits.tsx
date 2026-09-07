import { motion, type Variants } from "framer-motion"

import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/ui/product-card"
import { ProduitIllustration } from "@/components/ProduitIllustration"
import { produits } from "@/data/produits"

/* Animation d'entrée en cascade reprise de la démo 21st de la ProductCard. */
const conteneurVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const carteVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 14 },
  },
}

export function GrilleProduits() {
  return (
    <section
      id="catalogue"
      className="border-y border-border bg-background px-4 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Catalogue
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Le matériel de tous les jours, prêt à partir
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Sélection des références les plus commandées par les artisans.
              Tous les prix s'entendent hors taxes, remise dégressive appliquée
              automatiquement au panier.
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <a href="#tarifs">Voir les paliers de remise</a>
          </Button>
        </div>

        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={conteneurVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {produits.map((produit) => (
            <motion.div key={produit.id} variants={carteVariants}>
              <ProductCard
                visuel={<ProduitIllustration id={produit.illustration} />}
                nom={produit.nom}
                detail={produit.detail}
                prix={produit.prix}
                unite={produit.unite}
                reference={produit.reference}
                categorie={produit.categorie}
                enStock={produit.stock === "en-stock"}
                badge={produit.populaire ? "Best-seller" : undefined}
              />
            </motion.div>
          ))}
        </motion.div>

        <p className="mt-8 text-sm text-muted-foreground">
          Besoin d'une référence absente de cette sélection ?{" "}
          <a
            href="#contact"
            className="font-medium text-primary underline underline-offset-4"
          >
            Demandez-nous un approvisionnement
          </a>
          .
        </p>
      </div>
    </section>
  )
}
