import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "@/lib/theme"

export function BasculeTheme({ className }: { className?: string }) {
  const { theme, basculer } = useTheme()
  const versSombre = theme === "clair"

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={basculer}
      // Le libellé annonce l'action, pas l'état : c'est ce que fera le clic.
      aria-label={versSombre ? "Passer en mode sombre" : "Passer en mode clair"}
      title={versSombre ? "Mode sombre" : "Mode clair"}
      className={cn("cursor-pointer transition-colors hover:text-primary", className)}
    >
      {versSombre ? (
        <Moon className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Sun className="h-5 w-5" aria-hidden="true" />
      )}
    </Button>
  )
}
