import { PLATFORM_META } from "@/data/playbooks"
import type { Platform, PlatformId } from "@/types"

export type PlatformConfig = {
  id: Platform
  name: string
  short: string
  color: string
  bestPractices: string[]
}

export const platformsStorageKey = "visible-platforms-v1"

export const genericBestPractices = [
  "Complete the profile or source record.",
  "Define the visibility signal this platform can influence.",
  "Create a recurring action cadence.",
  "Review score movement and turn gaps into to-dos.",
]

const knownBestPractices: Partial<Record<PlatformId, string[]>> = {
  website: [
    "Server-side render key content so AI crawlers can read it.",
    "Allow GPTBot, PerplexityBot, ClaudeBot, and relevant search crawlers in robots.txt.",
    "Create comparison, alternative, FAQ, and original research pages.",
    "Use clear factual sentences, visible dates, and substantive quarterly refreshes.",
  ],
  linkedin: [
    "Post 3-5 times per week from the founder, not only the company page.",
    "Share frameworks, results, and clear points of view for B2B queries.",
    "Complete founder and company profiles with consistent brand facts.",
    "Engage in-niche daily to build authority signals.",
  ],
  x: [
    "Post consistently and join niche conversations.",
    "Use founder voice and build-in-public updates more than brand broadcasts.",
    "Share results, lessons, and real-time signals that can feed Grok.",
    "Track mentions and reply in relevant threads daily.",
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
    "Get the brand into useful videos and transcripts for buying-intent topics.",
    "Promise a specific outcome in the title and thumbnail.",
    "Use demos, comparisons, and case studies that AI systems can summarize.",
    "Structure with chapters when the topic is dense.",
  ],
  trustpilot: [
    "Automate review invites after purchase or delivery.",
    "Keep TrustScore strong through steady volume and recent reviews.",
    "Respond to negative reviews quickly and publicly.",
    "Verify the company domain and keep profile details complete.",
  ],
  g2: [
    "Complete the profile to 100 percent and choose the right categories.",
    "Drive steady review velocity instead of one short burst.",
    "Respond to every review and keep recent proof flowing.",
    "Keep category and competitor comparisons accurate.",
  ],
  clutch: [
    "Complete the agency profile and choose the right service categories.",
    "Drive steady review velocity from recent client wins.",
    "Respond to every review with specific project context.",
    "Turn strong reviews into case-study and listicle proof.",
  ],
  google_reviews: [
    "Fully complete the Google Business Profile.",
    "Drive steady genuine reviews that mention relevant terms naturally.",
    "Reply to every review and publish profile updates monthly.",
    "Keep name, address, and phone details identical everywhere.",
  ],
  reddit: [
    "Participate organically in niche subreddits without hard-selling.",
    "Answer questions genuinely and mention the brand only when relevant.",
    "Build account karma before promotion-sensitive activity.",
    "Treat Reddit as high-reward but volatile and diversify beyond it.",
  ],
  github: [
    "Use only when the audience is technical or dev-tool oriented.",
    "Write a strong README with clear positioning and setup details.",
    "Submit useful open-source work to relevant awesome lists.",
    "Track stars, traffic, clones, and docs usefulness over time.",
  ],
  media: [
    "Earn mentions in trade press and listicles AI engines actually cite.",
    "Run original data studies that journalists and roundups can reference.",
    "Pitch expert quotes and pursue niche podcasts.",
    "Keep brand facts consistent across every media mention.",
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
    id: "website",
    name: PLATFORM_META.website.name,
    short: PLATFORM_META.website.short,
    color: PLATFORM_META.website.color,
    bestPractices: knownBestPractices.website!,
  },
  {
    id: "trustpilot",
    name: PLATFORM_META.trustpilot.name,
    short: PLATFORM_META.trustpilot.short,
    color: PLATFORM_META.trustpilot.color,
    bestPractices: knownBestPractices.trustpilot!,
  },
  {
    id: "linkedin",
    name: PLATFORM_META.linkedin.name,
    short: PLATFORM_META.linkedin.short,
    color: PLATFORM_META.linkedin.color,
    bestPractices: knownBestPractices.linkedin!,
  },
  {
    id: "x",
    name: "X",
    short: PLATFORM_META.x.short,
    color: PLATFORM_META.x.color,
    bestPractices: knownBestPractices.x!,
  },
  {
    id: "google_reviews",
    name: "Google",
    short: PLATFORM_META.google_reviews.short,
    color: PLATFORM_META.google_reviews.color,
    bestPractices: knownBestPractices.google_reviews!,
  },
  {
    id: "media",
    name: PLATFORM_META.media.name,
    short: PLATFORM_META.media.short,
    color: PLATFORM_META.media.color,
    bestPractices: knownBestPractices.media!,
  },
  {
    id: "g2",
    name: PLATFORM_META.g2.name,
    short: PLATFORM_META.g2.short,
    color: PLATFORM_META.g2.color,
    bestPractices: knownBestPractices.g2!,
  },
  {
    id: "reddit",
    name: PLATFORM_META.reddit.name,
    short: PLATFORM_META.reddit.short,
    color: PLATFORM_META.reddit.color,
    bestPractices: knownBestPractices.reddit!,
  },
  {
    id: "youtube",
    name: PLATFORM_META.youtube.name,
    short: PLATFORM_META.youtube.short,
    color: PLATFORM_META.youtube.color,
    bestPractices: knownBestPractices.youtube!,
  },
  {
    id: "github",
    name: PLATFORM_META.github.name,
    short: PLATFORM_META.github.short,
    color: PLATFORM_META.github.color,
    bestPractices: knownBestPractices.github!,
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
