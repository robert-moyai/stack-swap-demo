import {
  SiG2,
  SiGoogle,
  SiInstagram,
  SiProducthunt,
  SiTiktok,
  SiTrustpilot,
  SiX,
  SiYoutube,
} from "@icons-pack/react-simple-icons"
import type { ComponentType, SVGProps } from "react"

import { PLATFORM_META } from "@/data/playbooks"
import { cn } from "@/lib/utils"
import { isPlatformId, type Platform, type PlatformId } from "@/types"

type BrandIconProps = SVGProps<SVGSVGElement> & {
  size?: number | string
  color?: string
  title?: string
}

/**
 * Brand SVGs from Simple Icons (https://simpleicons.org) via
 * `@icons-pack/react-simple-icons`. LinkedIn is no longer shipped by Simple Icons
 * (trademark), so we keep a minimal official-style mark for that one platform.
 */
function LinkedInIcon({ size = 16, color = "currentColor", title = "LinkedIn", className, ...props }: BrandIconProps) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={color}
      className={className}
      aria-label={title}
      {...props}
    >
      <title>{title}</title>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

const BRAND_ICONS: Record<PlatformId, { Icon: ComponentType<BrandIconProps>; color: string }> = {
  linkedin: { Icon: LinkedInIcon, color: "#0A66C2" },
  x: { Icon: SiX, color: "#000000" },
  instagram: { Icon: SiInstagram, color: "#E4405F" },
  tiktok: { Icon: SiTiktok, color: "#000000" },
  youtube: { Icon: SiYoutube, color: "#FF0000" },
  trustpilot: { Icon: SiTrustpilot, color: "#00B67A" },
  g2: { Icon: SiG2, color: "#FF492C" },
  google_reviews: { Icon: SiGoogle, color: "#4285F4" },
  product_hunt: { Icon: SiProducthunt, color: "#DA552F" },
}

export function PlatformIcon({
  platform,
  size = 16,
  className,
  branded = true,
}: {
  platform: Platform
  size?: number
  className?: string
  /** Use official brand hex when true; otherwise inherit currentColor. */
  branded?: boolean
}) {
  if (!isPlatformId(platform)) {
    const label = platform.slice(0, 2).toUpperCase()
    return (
      <span className={cn("grid place-items-center text-[11px] font-bold leading-none", className)} aria-hidden>
        {label}
      </span>
    )
  }

  const { Icon, color } = BRAND_ICONS[platform]
  const title = PLATFORM_META[platform].name
  return (
    <Icon
      size={size}
      color={branded ? color : "currentColor"}
      title={title}
      className={cn("shrink-0", className)}
    />
  )
}

export function PlatformBadge({
  platform,
  size = "md",
  className,
}: {
  platform: Platform
  size?: "sm" | "md"
  className?: string
}) {
  const box = size === "sm" ? "size-8 rounded-lg" : "size-9 rounded-xl"
  const iconSize = size === "sm" ? 15 : 17
  const color = isPlatformId(platform) ? PLATFORM_META[platform].color : "bg-[#eef1ec] text-[#34443a]"

  return (
    <span className={cn("grid place-items-center", box, color, className)}>
      <PlatformIcon platform={platform} size={iconSize} />
    </span>
  )
}
