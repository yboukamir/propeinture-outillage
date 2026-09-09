"use client"

/**
 * Adapté de « Commerce Hero » par bankkroll (21st.dev)
 * https://21st.dev/@bankkroll/components/commerce-hero
 *
 * Modifications : contenu sorti en props (le composant d'origine embarquait ses
 * données), ajout d'un CTA secondaire et d'une ligne de réassurance. Le panneau
 * du hero passe en charbon au lieu du `bg-accent/50` d'origine : l'encoche
 * blanche du header y découpe franchement, ce qui reproduit le contraste fort
 * de la preview du catalogue tout en gardant l'univers chantier.
 */

import * as React from "react"
import { ArrowUpRight, Menu, Phone, Search, ShoppingBasket } from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { asset } from "@/lib/utils"

export type LienNav = { name: string; href: string }

export type Vignette = {
  title: string
  href: string
  photo: string
  alt: string
}

export interface CommerceHeroProps {
  marque: React.ReactNode
  navigation: LienNav[]
  titre: React.ReactNode
  sousTitre: string
  ctaPrincipal: { label: string; href: string }
  ctaSecondaire: { label: string; href: string }
  reassurance: {
    icone: React.ComponentType<{ className?: string }>
    texte: string
  }[]
  telephone: string
  vignettes: Vignette[]
  /** Compteur et ouverture du panneau panier, câblés sur les icônes du header. */
  panier: { nombre: number; ouvrir: () => void }
}

export function CommerceHero({
  marque,
  navigation,
  titre,
  sousTitre,
  ctaPrincipal,
  ctaSecondaire,
  reassurance,
  telephone,
  vignettes,
  panier,
}: CommerceHeroProps) {
  return (
    <div className="relative mx-auto w-full max-w-7xl px-2 pb-16 sm:px-4">
      <div className="bg-tarp-dark relative mt-6 overflow-hidden rounded-2xl bg-secondary text-secondary-foreground shadow-[0_30px_60px_-30px_rgba(23,19,15,0.6)]">
        <header className="flex items-center">
          {/* `text-foreground` explicite : l'encoche est claire alors que le
              panneau qui l'entoure est en charbon, sans quoi la marque et les
              icônes héritent de la couleur claire et disparaissent. */}
          <div className="flex w-full items-center gap-2 rounded-tl-2xl rounded-br-2xl bg-background/95 p-4 text-foreground backdrop-blur-sm md:w-2/3 lg:w-1/2">
            <a href="#" className="shrink-0">
              {marque}
            </a>

            <nav className="hidden w-full items-center justify-between lg:flex">
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  asChild
                  variant="link"
                  className="cursor-pointer text-foreground/80 transition-colors hover:text-primary"
                >
                  <a href={item.href}>{item.name}</a>
                </Button>
              ))}
              <Button
                variant="ghost"
                size="icon"
                aria-label="Rechercher une référence"
                className="cursor-pointer transition-colors hover:text-primary"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Panier, ${panier.nombre} unité${panier.nombre > 1 ? "s" : ""}`}
                onClick={panier.ouvrir}
                className="relative cursor-pointer transition-colors hover:text-primary"
              >
                <ShoppingBasket className="h-5 w-5" />
                {panier.nombre > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground tabular-nums">
                    {panier.nombre}
                  </span>
                )}
              </Button>
            </nav>

            <Sheet>
              <SheetTrigger asChild className="ml-auto lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Ouvrir le menu"
                  className="transition-colors hover:text-primary"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[300px] border-r border-border/50 bg-background/95 p-0 backdrop-blur-md sm:w-[400px]"
              >
                <SheetHeader className="border-b border-border/50 p-6 text-left">
                  <SheetTitle>{marque}</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-1 p-6">
                  {navigation.map((item) => (
                    <Button
                      key={item.name}
                      asChild
                      variant="ghost"
                      className="h-12 justify-start px-2 text-base font-medium transition-colors hover:bg-muted hover:text-primary"
                    >
                      <a href={item.href}>{item.name}</a>
                    </Button>
                  ))}
                </nav>
                <Separator className="mx-6 w-auto" />
                <div className="flex flex-col gap-4 p-6">
                  <Button
                    variant="outline"
                    className="h-12 justify-start gap-2 transition-colors hover:bg-muted"
                  >
                    <Search className="h-4 w-4" />
                    Rechercher une référence
                  </Button>
                  <Button
                    variant="outline"
                    onClick={panier.ouvrir}
                    className="relative h-12 justify-start gap-2 transition-colors hover:bg-muted"
                  >
                    <ShoppingBasket className="h-4 w-4" />
                    Panier
                    <span className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground tabular-nums">
                      {panier.nombre}
                    </span>
                  </Button>
                </div>
                <Separator className="mx-6 w-auto" />
                <div className="p-6">
                  <Button
                    asChild
                    className="h-12 w-full shadow-lg transition-all duration-300 hover:shadow-xl"
                  >
                    <a href={ctaPrincipal.href}>
                      {ctaPrincipal.label}
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="ml-auto hidden w-1/2 items-center justify-end gap-4 pr-4 md:flex">
            <a
              href="#contact"
              className="flex items-center gap-2 text-sm font-medium text-secondary-foreground/70 transition-colors hover:text-secondary-foreground"
            >
              <Phone className="h-4 w-4" />
              {telephone}
            </a>
            <Button
              asChild
              className="group cursor-pointer rounded-full bg-background p-0 pr-1 text-foreground shadow-lg transition-all duration-300 hover:bg-background/90 hover:shadow-xl"
            >
              <a href="#tarifs">
                <span className="py-2 pl-4 text-sm font-medium">Compte pro</span>
                <span className="m-auto ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-110">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </a>
            </Button>
          </div>
        </header>

        <section className="w-full animate-apparition px-4 py-20 sm:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h1
              className="mb-6 animate-apparition text-4xl font-bold leading-tight tracking-tight text-balance md:text-5xl lg:text-6xl"
              style={{ animationDelay: "200ms" }}
            >
              {titre}
            </h1>
            <p
              className="mx-auto max-w-2xl animate-apparition text-base leading-relaxed text-secondary-foreground/70 md:text-lg"
              style={{ animationDelay: "400ms" }}
            >
              {sousTitre}
            </p>

            <div
              className="mt-8 flex animate-apparition flex-col justify-center gap-3 sm:flex-row"
              style={{ animationDelay: "500ms" }}
            >
              <Button asChild size="lg">
                <a href={ctaPrincipal.href}>
                  {ctaPrincipal.label}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={ctaSecondaire.href}>{ctaSecondaire.label}</a>
              </Button>
            </div>

            <ul
              className="mt-8 flex animate-apparition flex-wrap items-center justify-center gap-x-6 gap-y-3"
              style={{ animationDelay: "600ms" }}
            >
              {reassurance.map(({ icone: Icone, texte }) => (
                <li
                  key={texte}
                  className="flex items-center gap-2 text-sm font-medium text-secondary-foreground/80"
                >
                  <Icone className="h-4 w-4 text-accent" />
                  {texte}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {vignettes.map((vignette, index) => (
          <div
            key={vignette.title}
            className="group relative min-h-[220px] w-full animate-apparition overflow-hidden rounded-2xl border border-border bg-secondary sm:min-h-[260px]"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <img
              src={asset(vignette.photo)}
              alt={vignette.alt}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            {/* Voile sombre : sans lui, le titre devient illisible dès que la
                photo est claire. */}
            <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/45 to-secondary/5" />

            <a href={vignette.href} className="absolute inset-0 z-20">
              <span className="sr-only">Voir la catégorie {vignette.title}</span>
            </a>

            <h2 className="absolute bottom-5 left-5 z-10 text-xl font-bold text-secondary-foreground sm:text-2xl">
              {vignette.title}
            </h2>
            <span className="absolute bottom-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-background text-foreground shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
