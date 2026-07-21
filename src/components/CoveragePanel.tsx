import { Plus, Sparkles, Target, TrendingUp, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CONTENT_TYPE_META, PLATFORM_META, VERTICAL_META } from "@/data/playbooks"
import { exemplarsForVertical } from "@/data/exemplars"
import type { CoverageResult, CoverageStatus } from "@/lib/coverage"
import type { BusinessProfile, ContentType, Platform, PlatformId, Score } from "@/types"

const statusMeta: Record<CoverageStatus, { label: string; className: string }> = {
  covered: { label: "Covered", className: "bg-[#e6f7f0] text-[#00875a]" },
  thin: { label: "Thin", className: "bg-[#fef6e7] text-[#b7791f]" },
  missing: { label: "Missing", className: "bg-[#fdecea] text-[#c0392b]" },
}

function StatusPill({ status }: { status: CoverageStatus }) {
  const meta = statusMeta[status]
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${meta.className}`}>{meta.label}</span>
}

function ScoreDots({ score }: { score: Score }) {
  return (
    <span className="flex items-center gap-1" aria-label={`Priority ${score} of 3`}>
      {[1, 2, 3].map((level) => (
        <span
          key={level}
          className={`size-1.5 rounded-full ${level <= score ? "bg-primary" : "bg-border"}`}
        />
      ))}
    </span>
  )
}

function PlatformBadge({ platform }: { platform: PlatformId }) {
  const meta = PLATFORM_META[platform]
  return (
    <span className={`grid size-8 place-items-center rounded-lg text-xs font-bold ${meta.color}`}>{meta.short}</span>
  )
}

export function CoveragePanel({
  profile,
  coverage,
  enabledPlatforms,
  onAddIdea,
  onAddPlatform,
}: {
  profile: BusinessProfile
  coverage: CoverageResult
  enabledPlatforms: Platform[]
  onAddIdea: (platform: PlatformId, contentType: ContentType) => void
  onAddPlatform: (platform: PlatformId) => void
}) {
  const vertical = VERTICAL_META[profile.vertical]
  const enabled = new Set(enabledPlatforms)
  const platformRows = coverage.platforms.filter((row) => row.score > 0 || row.count > 0)
  const contentRows = coverage.contentTypes.filter((row) => row.score > 0 || row.count > 0)
  const exemplars = exemplarsForVertical(profile.vertical)

  return (
    <section className="animate-in overflow-hidden rounded-2xl border border-black/[0.07] bg-white/70 shadow-[0_1px_2px_rgba(24,34,28,0.03)]">
      <div className="flex flex-col gap-1 border-b border-black/[0.06] px-5 py-4 md:px-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          <Sparkles className="size-3.5" /> Recommended for {vertical.label}
        </div>
        <h2 className="text-lg font-semibold tracking-tight">Where your presence should be</h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Based on what works for {vertical.label.toLowerCase()} businesses like {profile.companyName}. Close the gaps
          below to stop leaving reach on the table.
        </p>
      </div>

      <div className="grid gap-px bg-black/[0.06] md:grid-cols-2">
        <div className="bg-white/70 p-5 md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="size-4 text-muted-foreground" />
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Platforms that score
            </h3>
          </div>
          <ul className="space-y-2.5">
            {platformRows.map((row) => {
              const meta = PLATFORM_META[row.platform]
              const canAdd = row.score >= 2 && !enabled.has(row.platform)
              return (
                <li key={row.platform} className="flex items-center gap-3">
                  <PlatformBadge platform={row.platform} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium">{meta.name}</span>
                      <ScoreDots score={row.score} />
                    </div>
                    <div className="text-[11px] capitalize text-muted-foreground">{meta.category}</div>
                  </div>
                  {canAdd ? (
                    <Button variant="outline" size="sm" onClick={() => onAddPlatform(row.platform)}>
                      <Plus className="size-3.5" /> Add to board
                    </Button>
                  ) : (
                    <StatusPill status={row.status} />
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        <div className="bg-white/70 p-5 md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Target className="size-4 text-muted-foreground" />
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Content that works
            </h3>
          </div>
          <ul className="space-y-2.5">
            {contentRows.map((row) => {
              const meta = CONTENT_TYPE_META[row.contentType]
              return (
                <li key={row.contentType} className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium">{meta.label}</span>
                      <ScoreDots score={row.score} />
                    </div>
                    <div className="truncate text-[11px] text-muted-foreground">{meta.description}</div>
                  </div>
                  <StatusPill status={row.status} />
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {exemplars.length > 0 && (
        <div className="border-t border-black/[0.06] p-5 md:p-6">
          <div className="mb-1 flex items-center gap-2">
            <Users className="size-4 text-muted-foreground" />
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Who wins here — and how
            </h3>
          </div>
          <p className="mb-4 text-xs leading-5 text-muted-foreground">
            Category exemplars for {vertical.label.toLowerCase()}, not a scrape of your exact competitors. Use them as
            the playbook for each channel.
          </p>
          <div className="grid gap-3 lg:grid-cols-3">
            {exemplars.map(({ platform, exemplar }) => {
              const meta = PLATFORM_META[platform]
              const primaryType = exemplar.contentTypes[0]
              const canAdd = !enabled.has(platform)
              return (
                <div key={platform} className="flex flex-col rounded-xl border border-black/[0.07] bg-white p-4">
                  <div className="flex items-center gap-2.5">
                    <PlatformBadge platform={platform} />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{meta.name}</div>
                      <div className="truncate text-[11px] text-muted-foreground">{exemplar.brands.join(" · ")}</div>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">{exemplar.play}</p>
                  <p className="mt-2 text-[11px] leading-4 text-foreground/80">
                    <span className="font-medium">Pattern:</span> {exemplar.pattern}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {exemplar.contentTypes.map((type) => (
                      <span key={type} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {CONTENT_TYPE_META[type].label}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto flex gap-2 pt-4">
                    {canAdd && (
                      <Button variant="outline" size="sm" onClick={() => onAddPlatform(platform)}>
                        <Plus className="size-3.5" /> Add platform
                      </Button>
                    )}
                    {primaryType && (
                      <Button size="sm" onClick={() => onAddIdea(platform, primaryType)}>
                        <Plus className="size-3.5" /> Try this play
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {coverage.gaps.length > 0 && (
        <div className="border-t border-black/[0.06] p-5 md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Gaps worth closing
            </h3>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
              {coverage.gaps.length}
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {coverage.gaps.map((gap) => {
              const platformMeta = PLATFORM_META[gap.platform]
              const contentMeta = CONTENT_TYPE_META[gap.contentType]
              return (
                <div
                  key={`${gap.platform}-${gap.contentType}`}
                  className="flex items-center gap-3 rounded-xl border border-black/[0.07] bg-white p-3.5"
                >
                  <PlatformBadge platform={gap.platform} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">
                      {contentMeta.label} on {platformMeta.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {gap.platformMissing ? "Not on your board yet" : "Nothing planned here yet"}
                    </div>
                  </div>
                  <Button size="sm" onClick={() => onAddIdea(gap.platform, gap.contentType)}>
                    <Plus className="size-3.5" /> Add idea
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
