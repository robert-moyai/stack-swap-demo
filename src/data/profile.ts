import type { BusinessProfile, PlatformId } from "@/types"

/**
 * Storage/API contract shared with URL onboarding.
 *
 * URL onboarding (built separately) is the source of truth for the business
 * profile. Its only responsibility toward this feature is to write a
 * `BusinessProfile` JSON blob to `PROFILE_STORAGE_KEY`. When a real backend
 * exists, swap `loadProfile`/`saveProfile` for API calls with the same shape;
 * nothing in the coverage engine or UI needs to change.
 */
export const PROFILE_STORAGE_KEY = "postflow-profile-v1"
export const ENABLED_PLATFORMS_STORAGE_KEY = "postflow-enabled-platforms-v1"

/** Platforms shown on the board before the user adds any recommendations. */
export const DEFAULT_ENABLED_PLATFORMS: PlatformId[] = ["linkedin", "x", "instagram"]

/**
 * Demo profile used until URL onboarding writes a real one. E-commerce is chosen
 * so the seeded social-only board immediately shows review-platform gaps
 * (Trustpilot store reviews, TikTok product demos, etc.).
 */
export const MOCK_PROFILE: BusinessProfile = {
  vertical: "ecommerce",
  companyName: "Nordic Supply Co.",
  url: "https://nordicsupply.example",
  summary: "Direct-to-consumer outdoor gear brand.",
  audience: "Outdoor and travel enthusiasts",
  source: "mock",
}

export function loadProfile(): BusinessProfile {
  try {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY)
    return saved ? (JSON.parse(saved) as BusinessProfile) : MOCK_PROFILE
  } catch {
    return MOCK_PROFILE
  }
}

export function saveProfile(profile: BusinessProfile) {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
  } catch {
    // ignore write failures (private mode, quota, etc.)
  }
}

export function loadEnabledPlatforms(): PlatformId[] {
  try {
    const saved = localStorage.getItem(ENABLED_PLATFORMS_STORAGE_KEY)
    return saved ? (JSON.parse(saved) as PlatformId[]) : DEFAULT_ENABLED_PLATFORMS
  } catch {
    return DEFAULT_ENABLED_PLATFORMS
  }
}
