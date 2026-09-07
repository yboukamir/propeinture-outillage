import { PaintRoller } from "lucide-react"

import { cn } from "@/lib/utils"

export function Marque({
  className,
  sombre = false,
}: {
  className?: string
  sombre?: boolean
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <PaintRoller className="size-5" aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-base font-bold tracking-tight">ProPeinture</span>
        <span
          className={cn(
            "text-[11px] font-medium uppercase tracking-[0.18em]",
            sombre ? "text-secondary-foreground/60" : "text-muted-foreground",
          )}
        >
          Outillage
        </span>
      </span>
    </span>
  )
}
