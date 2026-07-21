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
export const PROFILE_STORAGE_KEY = "visible-profile-v1"
export const ENABLED_PLATFORMS_STORAGE_KEY = "visible-enabled-platforms-v1"

/** Platforms shown on the board before the user adds any recommendations. */
export const DEFAULT_ENABLED_PLATFORMS: PlatformId[] = [
  "website",
  "trustpilot",
  "linkedin",
  "x",
  "google_reviews",
  "media",
  "g2",
  "reddit",
  "youtube",
  "github",
]

/**
 * Demo profile used until URL onboarding writes a real one. SaaS is chosen
 * because Visible is initially framed around agencies and SaaS GEO workflows.
 */
export const MOCK_PROFILE: BusinessProfile = {
  vertical: "saas",
  companyName: "Visible",
  url: "https://visible.example",
  summary: "Company-agnostic visibility and GEO workspace.",
  audience: "Agencies and SaaS teams improving AI visibility",
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
