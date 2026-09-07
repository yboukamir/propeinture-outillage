import type { IllustrationId } from "@/data/produits"
import { cn } from "@/lib/utils"

/**
 * Illustrations vectorielles maison : le concept reste autonome, sans photo
 * ni dépendance à un CDN d'images.
 */
export function ProduitIllustration({
  id,
  className,
}: {
  id: IllustrationId
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 160 120"
      role="presentation"
      aria-hidden="true"
      className={cn("h-full w-full", className)}
    >
      <g
        fill="none"
        stroke="var(--secondary)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {formes[id]}
      </g>
    </svg>
  )
}

const formes: Record<IllustrationId, React.ReactNode> = {
  rouleau: (
    <>
      <rect x="28" y="30" width="72" height="26" rx="6" fill="var(--primary)" stroke="none" />
      <rect x="28" y="30" width="72" height="26" rx="6" />
      <path d="M100 43h14v34" />
      <path d="M114 77h-8v20" />
      <rect x="98" y="95" width="18" height="8" rx="4" fill="var(--accent)" />
      <path d="M40 30v26M52 30v26M64 30v26M76 30v26M88 30v26" strokeWidth={1.5} opacity={0.35} />
    </>
  ),
  pinceau: (
    <>
      <path
        d="M56 20h30v42H56z"
        fill="var(--secondary)"
        stroke="none"
        opacity={0.12}
      />
      <rect x="56" y="16" width="30" height="46" rx="4" />
      <rect x="52" y="62" width="38" height="14" rx="3" fill="var(--accent)" />
      <path d="M56 76h30l-4 28H60z" fill="var(--primary)" stroke="none" />
      <path d="M56 76h30l-4 28H60z" />
      <path d="M66 80v22M76 80v22" strokeWidth={1.5} opacity={0.4} />
    </>
  ),
  bache: (
    <>
      <path
        d="M24 34c22-10 44 10 66 0s40 6 46 0v56c-8 8-26-6-46 0s-44-8-66 2z"
        fill="var(--muted)"
        stroke="none"
      />
      <path d="M24 34c22-10 44 10 66 0s40 6 46 0v56c-8 8-26-6-46 0s-44-8-66 2z" />
      <path d="M46 30v58M68 40v56M90 34v58M112 40v54" strokeWidth={1.5} opacity={0.4} />
    </>
  ),
  enduit: (
    <>
      <path
        d="M46 34c0-6 6-10 14-10h40c8 0 14 4 14 10v62c0 5-4 8-10 8H56c-6 0-10-3-10-8z"
        fill="var(--card)"
      />
      <path d="M46 52h68" />
      <rect x="58" y="62" width="44" height="22" rx="3" fill="var(--accent)" stroke="none" />
      <rect x="58" y="62" width="44" height="22" rx="3" />
      <path d="M66 73h28" strokeWidth={2} />
      <path d="M60 24c8-6 32-6 40 0" />
    </>
  ),
  ruban: (
    <>
      <circle cx="80" cy="62" r="40" fill="var(--accent)" stroke="none" opacity={0.9} />
      <circle cx="80" cy="62" r="40" />
      <circle cx="80" cy="62" r="16" fill="var(--background)" />
      <path d="M120 62c0 10-4 18-4 18l16 8" />
      <circle cx="80" cy="62" r="28" strokeWidth={1.5} opacity={0.45} />
    </>
  ),
  grille: (
    <>
      <path
        d="M34 26h92l-14 74H48z"
        fill="var(--muted)"
        stroke="none"
      />
      <path d="M34 26h92l-14 74H48z" />
      <path
        d="M50 26l-6 74M70 26l-2 74M90 26l2 74M110 26l6 74"
        strokeWidth={1.5}
        opacity={0.5}
      />
      <path d="M40 50h80M43 74h74" strokeWidth={1.5} opacity={0.5} />
      <path d="M34 26h92" strokeWidth={4} stroke="var(--primary)" />
    </>
  ),
}
