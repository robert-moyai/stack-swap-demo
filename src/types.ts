export const knownPlatforms = [
  "linkedin",
  "x",
  "instagram",
  "tiktok",
  "youtube",
  "website",
  "trustpilot",
  "g2",
  "clutch",
  "google_reviews",
  "reddit",
  "github",
  "media",
  "product_hunt",
] as const
export const statuses = ["idea", "ready"] as const
export const verticals = ["ecommerce", "saas", "fintech", "agency", "local_services"] as const
export const contentTypes = [
  "testimonial",
  "store_review",
  "case_study",
  "product_demo",
  "thought_leadership",
  "ugc",
  "offer",
  "educational",
] as const

/** Known platforms used by vertical playbooks / recommendations. */
export type PlatformId = (typeof knownPlatforms)[number]
/** Any board swimlane id — known platforms or user-added custom ones. */
export type Platform = string
export type PlatformOption = { id: Platform; name: string }
export type PostStatus = (typeof statuses)[number]
export type Vertical = (typeof verticals)[number]
export type ContentType = (typeof contentTypes)[number]

export type Post = {
  id: string
  platform: Platform
  status: PostStatus
  title: string
  content: string
  contentType?: ContentType
  updatedAt: string
}

export type PostDraft = Pick<Post, "platform" | "status" | "title" | "content" | "contentType">

/**
 * Business profile consumed by the coverage engine. Written by website crawl
 * onboarding (or single-URL analyze). See src/data/profile.ts.
 */
export type BusinessProfile = {
  vertical: Vertical
  companyName: string
  url: string
  summary?: string
  audience?: string
  source: "url_onboarding" | "manual" | "mock"
}

/** 0 = ignore, 1 = nice to have, 2 = recommended, 3 = must-have. */
export type Score = 0 | 1 | 2 | 3

export type VerticalPlaybook = {
  vertical: Vertical
  platforms: Partial<Record<PlatformId, Score>>
  contentTypes: Partial<Record<ContentType, Score>>
  pairs?: Array<{ platform: PlatformId; contentType: ContentType; score: Score }>
}

export function isPlatformId(value: string): value is PlatformId {
  return (knownPlatforms as readonly string[]).includes(value)
}
