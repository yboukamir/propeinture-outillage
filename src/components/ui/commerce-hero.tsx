"use client"

/**
 * Adapté de « Commerce Hero » par bankkroll (21st.dev)
 * https://21st.dev/@bankkroll/components/commerce-hero
 *
 * Modifications : contenu sorti en props (le composant d'origine embarquait ses
 * données), images CDN remplacées par des visuels libres en ReactNode, ajout
 * d'un CTA secondaire et d'une ligne de réassurance, panneau du hero repeint
 * dans la palette atelier plutôt qu'en `bg-accent/50`.
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

export type LienNav = { name: string; href: string }

export type Vignette = {
  title: string
  href: string
  visuel: React.ReactNode
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
}: CommerceHeroProps) {
  return (
    <div className="relative mx-auto w-full max-w-7xl px-2 pb-16 sm:px-4">
      <div className="relative mt-6 rounded-2xl border border-border bg-plaster bg-tarp">
        <header className="flex items-center">
          <div className="flex w-full items-center gap-2 rounded-tl-2xl rounded-br-2xl bg-background/95 p-4 backdrop-blur-sm md:w-2/3 lg:w-1/2">
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
                aria-label="Panier"
                className="cursor-pointer transition-colors hover:text-primary"
              >
                <ShoppingBasket className="h-5 w-5" />
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
                    className="relative h-12 justify-start gap-2 transition-colors hover:bg-muted"
                  >
                    <ShoppingBasket className="h-4 w-4" />
                    Panier
                    <span className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      0
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
              className="flex items-center gap-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              <Phone className="h-4 w-4" />
              {telephone}
            </a>
            <Button
              asChild
              variant="secondary"
              className="group cursor-pointer rounded-full p-0 pr-1 shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <a href="#tarifs">
                <span className="py-2 pl-4 text-sm font-medium">Compte pro</span>
                <span className="m-auto ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-300 group-hover:scale-110">
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
              className="mx-auto max-w-2xl animate-apparition text-base leading-relaxed text-muted-foreground md:text-lg"
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
                  className="flex items-center gap-2 text-sm font-medium text-foreground/80"
                >
                  <Icone className="h-4 w-4 text-primary" />
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
            className="group relative min-h-[220px] w-full animate-apparition overflow-hidden rounded-3xl border border-border bg-card p-4 sm:min-h-[260px] sm:p-6"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <a href={vignette.href} className="absolute inset-0 z-20">
              <h2 className="relative z-10 my-2 text-center text-xl font-bold text-primary transition-colors duration-300 group-hover:text-primary/90 sm:my-4 sm:text-2xl">
                {vignette.title}
              </h2>
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-[160px] opacity-90 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100">
                  {vignette.visuel}
                </div>
              </div>
              <div className="absolute bottom-0 right-0 z-10 flex h-16 w-16 items-center justify-center rounded-tl-xl border-l border-t border-border/50 bg-background/95 backdrop-blur-sm md:h-20 md:w-20">
                <span className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground md:bottom-3 md:right-3 md:h-12 md:w-12">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
