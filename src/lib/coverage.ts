import { PLAYBOOKS } from "@/data/playbooks"
import type { ContentType, Platform, PlatformId, Post, Score, Vertical } from "@/types"

export type CoverageStatus = "covered" | "thin" | "missing"

export type PlatformCoverage = {
  platform: PlatformId
  score: Score
  count: number
  status: CoverageStatus
}

export type ContentTypeCoverage = {
  contentType: ContentType
  score: Score
  count: number
  status: CoverageStatus
}

export type GapRecommendation = {
  platform: PlatformId
  contentType: ContentType
  score: Score
  /** True when the platform is not yet a swimlane on the board. */
  platformMissing: boolean
}

export type CoverageResult = {
  vertical: Vertical
  platforms: PlatformCoverage[]
  contentTypes: ContentTypeCoverage[]
  gaps: GapRecommendation[]
}

const MAX_GAPS = 6

/**
 * v1 coverage rule, intentionally simple and explainable:
 * - 0 posts  -> missing
 * - 1 post   -> thin
 * - 2+ posts -> covered
 */
function statusFromCount(count: number): CoverageStatus {
  if (count === 0) return "missing"
  if (count === 1) return "thin"
  return "covered"
}

/**
 * Compare a vertical playbook against what is actually planned on the board.
 * `enabledPlatforms` only affects whether a gap is flagged as needing a new swimlane.
 */
export function computeCoverage(
  vertical: Vertical,
  posts: Post[],
  enabledPlatforms: Platform[] = [],
): CoverageResult {
  const playbook = PLAYBOOKS[vertical]
  const enabled = new Set(enabledPlatforms)

  const platformKeys = Object.keys(playbook.platforms) as PlatformId[]

  const platforms: PlatformCoverage[] = platformKeys
    .map((platform) => {
      const score = (playbook.platforms[platform] ?? 0) as Score
      const count = posts.filter((post) => post.platform === platform).length
      return { platform, score, count, status: statusFromCount(count) }
    })
    .sort((a, b) => b.score - a.score || b.count - a.count)

  const contentTypeKeys = new Set<ContentType>([
    ...(Object.keys(playbook.contentTypes) as ContentType[]),
    ...posts.flatMap((post) => (post.contentType ? [post.contentType] : [])),
  ])

  const contentTypes: ContentTypeCoverage[] = [...contentTypeKeys]
    .map((contentType) => {
      const score = (playbook.contentTypes[contentType] ?? 0) as Score
      const count = posts.filter((post) => post.contentType === contentType).length
      return { contentType, score, count, status: statusFromCount(count) }
    })
    .sort((a, b) => b.score - a.score || b.count - a.count)

  const gaps: GapRecommendation[] = (playbook.pairs ?? [])
    .filter((pair) => {
      const covered = posts.some(
        (post) => post.platform === pair.platform && post.contentType === pair.contentType,
      )
      return !covered
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_GAPS)
    .map((pair) => ({
      platform: pair.platform,
      contentType: pair.contentType,
      score: pair.score,
      platformMissing: !enabled.has(pair.platform),
    }))

  return { vertical, platforms, contentTypes, gaps }
}
