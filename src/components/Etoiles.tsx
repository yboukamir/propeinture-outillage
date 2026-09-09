import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Note en étoiles. Les étoiles sont décoratives — `aria-hidden` — et la valeur
 * est portée par un texte lisible : un lecteur d'écran annonce « 4,5 sur 5 »
 * plutôt que d'énumérer cinq icônes.
 */
export function Etoiles({
  note,
  taille = "normale",
  muet = false,
  className,
}: {
  note: number
  taille?: "normale" | "petite"
  /** À activer quand la note est déjà écrite en clair juste à côté : sans ça
   *  un lecteur d'écran l'annonce deux fois. */
  muet?: boolean
  className?: string
}) {
  const dimension = taille === "petite" ? "size-3.5" : "size-4"

  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      <span className="flex" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((rang) => (
          <Star
            key={rang}
            className={cn(
              dimension,
              rang <= Math.round(note)
                ? "fill-accent text-accent"
                : "fill-transparent text-muted-foreground/40",
            )}
          />
        ))}
      </span>
      {!muet && (
        <span className="sr-only">{note.toLocaleString("fr-FR")} sur 5</span>
      )}
    </span>
  )
}
