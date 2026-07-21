import { PLATFORM_META } from "@/data/playbooks"
import type { Platform, PlatformId } from "@/types"

export type PlatformConfig = {
  id: Platform
  name: string
  short: string
  color: string
  bestPractices: string[]
}

export const platformsStorageKey = "postflow-platforms-v1"

export const genericBestPractices = [
  "Lead with one clear message.",
  "Adapt the format and tone to the platform’s audience.",
  "Make the post easy to scan and act on.",
  "Review performance and repeat what resonates.",
]

const knownBestPractices: Partial<Record<PlatformId, string[]>> = {
  linkedin: [
    "Lead with a strong first line before the “see more” break.",
    "Use short paragraphs and whitespace for easy scanning.",
    "Share a clear point of view, lesson, or practical takeaway.",
    "End with one focused question or call to action.",
  ],
  x: [
    "Make the first sentence useful enough to stand alone.",
    "Keep each post focused on one idea.",
    "Use threads only when every post adds meaningful context.",
    "Invite replies with a specific, easy-to-answer prompt.",
  ],
  instagram: [
    "Pair every caption with a strong visual hook.",
    "Put the most important message in the opening lines.",
    "Use a clear caption structure: hook, value, action.",
    "Choose a small set of highly relevant hashtags.",
  ],
  tiktok: [
    "Hook viewers in the first 1–2 seconds.",
    "Keep the story simple and visual-first.",
    "Use native trends only when they fit the brand.",
    "End with a clear reason to follow or engage.",
  ],
  youtube: [
    "Promise a specific outcome in the title and thumbnail.",
    "Deliver value early; don’t bury the payoff.",
    "Structure with chapters when the topic is dense.",
    "Ask for one clear next action (subscribe, comment, click).",
  ],
  trustpilot: [
    "Ask happy customers promptly after a successful delivery.",
    "Respond to reviews with specifics, not templates.",
    "Highlight recent, detailed reviews in other channels.",
    "Fix recurring complaint themes before asking for more reviews.",
  ],
  g2: [
    "Focus on verified customer outcomes and use cases.",
    "Encourage reviews after clear product wins.",
    "Keep category and competitor comparisons accurate.",
    "Turn strong reviews into case-study seeds.",
  ],
  google_reviews: [
    "Make leaving a review frictionless on mobile.",
    "Reply to every review, especially critical ones.",
    "Ask locally relevant customers after a great visit.",
    "Keep your business profile details complete and current.",
  ],
  product_hunt: [
    "Lead with a crisp one-liner of what ships today.",
    "Show the product working, not just describing it.",
    "Engage every comment on launch day.",
    "Have makers available for live Q&A.",
  ],
}

export const defaultPlatforms: PlatformConfig[] = [
  {
    id: "linkedin",
    name: "LinkedIn",
    short: "in",
    color: "bg-[#e8f3ff] text-[#0a66c2]",
    bestPractices: knownBestPractices.linkedin!,
  },
  {
    id: "x",
    name: "X / Twitter",
    short: "X",
    color: "bg-[#eceeed] text-[#111]",
    bestPractices: knownBestPractices.x!,
  },
  {
    id: "instagram",
    name: "Instagram",
    short: "◎",
    color: "bg-[#fff0f3] text-[#c13584]",
    bestPractices: knownBestPractices.instagram!,
  },
]

export function loadPlatforms(): PlatformConfig[] {
  try {
    const saved = localStorage.getItem(platformsStorageKey)
    return saved ? (JSON.parse(saved) as PlatformConfig[]) : defaultPlatforms
  } catch {
    return defaultPlatforms
  }
}

/** Build a board swimlane config for a known recommended platform. */
export function platformConfigFor(id: PlatformId): PlatformConfig {
  const meta = PLATFORM_META[id]
  return {
    id,
    name: meta.name,
    short: meta.short,
    color: meta.color,
    bestPractices: knownBestPractices[id] ?? genericBestPractices,
  }
}

export function customPlatformConfig(name: string): PlatformConfig {
  const baseId = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "platform"
  return {
    id: baseId,
    name,
    short: name.slice(0, 2).toUpperCase(),
    color: "bg-[#eef1ec] text-[#34443a]",
    bestPractices: genericBestPractices,
  }
}
