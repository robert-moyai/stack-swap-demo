import type { ContentType, PlatformId, Vertical, VerticalPlaybook } from "@/types"

export type PlatformCategory = "social" | "review" | "launch"

export type PlatformMeta = {
  name: string
  short: string
  color: string
  dot: string
  category: PlatformCategory
}

export const PLATFORM_META: Record<PlatformId, PlatformMeta> = {
  linkedin: { name: "LinkedIn", short: "in", color: "bg-[#e8f3ff] text-[#0a66c2]", dot: "bg-[#0a66c2]", category: "social" },
  x: { name: "X / Twitter", short: "X", color: "bg-[#eceeed] text-[#111]", dot: "bg-[#111]", category: "social" },
  instagram: { name: "Instagram", short: "◎", color: "bg-[#fff0f3] text-[#c13584]", dot: "bg-[#c13584]", category: "social" },
  tiktok: { name: "TikTok", short: "♪", color: "bg-[#eceeed] text-[#111]", dot: "bg-[#111]", category: "social" },
  youtube: { name: "YouTube", short: "▶", color: "bg-[#ffebeb] text-[#c4302b]", dot: "bg-[#c4302b]", category: "social" },
  trustpilot: { name: "Trustpilot", short: "★", color: "bg-[#e6f7f0] text-[#00875a]", dot: "bg-[#00b67a]", category: "review" },
  g2: { name: "G2", short: "G2", color: "bg-[#ffece8] text-[#e5401f]", dot: "bg-[#ff492c]", category: "review" },
  google_reviews: { name: "Google Reviews", short: "G", color: "bg-[#e8f0fe] text-[#1a73e8]", dot: "bg-[#1a73e8]", category: "review" },
  product_hunt: { name: "Product Hunt", short: "P", color: "bg-[#fdeee9] text-[#da552f]", dot: "bg-[#da552f]", category: "launch" },
}

export const CONTENT_TYPE_META: Record<ContentType, { label: string; description: string }> = {
  testimonial: { label: "Testimonial", description: "Direct customer quotes vouching for you" },
  store_review: { label: "Store review", description: "Ratings and reviews on a marketplace or review site" },
  case_study: { label: "Case study", description: "A structured before/after customer story" },
  product_demo: { label: "Product demo", description: "Show the product working end to end" },
  thought_leadership: { label: "Thought leadership", description: "Opinions and insight that build authority" },
  ugc: { label: "User content", description: "Content created by customers and fans" },
  offer: { label: "Promo / offer", description: "Deals, launches, and time-bound offers" },
  educational: { label: "Educational", description: "How-tos and explainers for your audience" },
}

export const VERTICAL_META: Record<Vertical, { label: string; description: string }> = {
  ecommerce: { label: "E-commerce", description: "Direct-to-consumer and online retail" },
  saas: { label: "SaaS", description: "Software sold as a subscription" },
  fintech: { label: "Fintech", description: "Financial products and services" },
  agency: { label: "Agency", description: "Services sold to other businesses" },
  local_services: { label: "Local services", description: "Location-based service businesses" },
}

export const PLAYBOOKS: Record<Vertical, VerticalPlaybook> = {
  ecommerce: {
    vertical: "ecommerce",
    platforms: { instagram: 3, tiktok: 3, trustpilot: 3, google_reviews: 2, youtube: 1, linkedin: 1, x: 1 },
    contentTypes: { store_review: 3, ugc: 3, offer: 3, testimonial: 2, product_demo: 2, educational: 1 },
    pairs: [
      { platform: "trustpilot", contentType: "store_review", score: 3 },
      { platform: "instagram", contentType: "ugc", score: 3 },
      { platform: "tiktok", contentType: "product_demo", score: 3 },
      { platform: "google_reviews", contentType: "store_review", score: 2 },
      { platform: "instagram", contentType: "offer", score: 2 },
    ],
  },
  saas: {
    vertical: "saas",
    platforms: { linkedin: 3, g2: 3, x: 2, product_hunt: 2, youtube: 2, instagram: 1 },
    contentTypes: { case_study: 3, product_demo: 3, testimonial: 2, thought_leadership: 2, educational: 2 },
    pairs: [
      { platform: "g2", contentType: "testimonial", score: 3 },
      { platform: "linkedin", contentType: "case_study", score: 3 },
      { platform: "product_hunt", contentType: "product_demo", score: 3 },
      { platform: "youtube", contentType: "product_demo", score: 2 },
      { platform: "linkedin", contentType: "thought_leadership", score: 2 },
    ],
  },
  fintech: {
    vertical: "fintech",
    platforms: { linkedin: 3, x: 2, trustpilot: 2, youtube: 1, g2: 1 },
    contentTypes: { thought_leadership: 3, case_study: 3, testimonial: 2, educational: 2 },
    pairs: [
      { platform: "linkedin", contentType: "thought_leadership", score: 3 },
      { platform: "linkedin", contentType: "case_study", score: 3 },
      { platform: "trustpilot", contentType: "testimonial", score: 2 },
      { platform: "x", contentType: "educational", score: 2 },
    ],
  },
  agency: {
    vertical: "agency",
    platforms: { linkedin: 3, instagram: 2, x: 2, youtube: 1 },
    contentTypes: { case_study: 3, ugc: 2, thought_leadership: 2, testimonial: 2 },
    pairs: [
      { platform: "linkedin", contentType: "case_study", score: 3 },
      { platform: "instagram", contentType: "ugc", score: 2 },
      { platform: "linkedin", contentType: "thought_leadership", score: 2 },
      { platform: "x", contentType: "thought_leadership", score: 2 },
    ],
  },
  local_services: {
    vertical: "local_services",
    platforms: { google_reviews: 3, instagram: 2, trustpilot: 2, tiktok: 1 },
    contentTypes: { store_review: 3, testimonial: 3, offer: 2, ugc: 2 },
    pairs: [
      { platform: "google_reviews", contentType: "store_review", score: 3 },
      { platform: "trustpilot", contentType: "testimonial", score: 2 },
      { platform: "instagram", contentType: "offer", score: 2 },
      { platform: "instagram", contentType: "ugc", score: 2 },
    ],
  },
}
