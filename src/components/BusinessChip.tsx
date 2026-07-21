import { LoaderCircle } from "lucide-react"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { VERTICAL_META } from "@/data/playbooks"
import { analyzeBusinessFromUrl } from "@/lib/analyzeBusiness"
import type { BusinessProfile } from "@/types"

export function BusinessChip({
  profile,
  onProfileChange,
}: {
  profile: BusinessProfile
  onProfileChange: (profile: BusinessProfile) => void
}) {
  const [editing, setEditing] = useState(false)
  const [url, setUrl] = useState(profile.url)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const vertical = VERTICAL_META[profile.vertical]

  async function handleAnalyze(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const next = await analyzeBusinessFromUrl(url)
      onProfileChange(next)
      setEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not analyze that URL")
    } finally {
      setLoading(false)
    }
  }

  if (editing) {
    return (
      <form onSubmit={handleAnalyze} className="hidden items-center gap-2 md:flex">
        <input
          autoFocus
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://yourcompany.com"
          className="h-9 w-56 rounded-lg border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
          disabled={loading}
        />
        <Button type="submit" size="sm" disabled={loading || !url.trim()}>
          {loading ? <LoaderCircle className="size-3.5 animate-spin" /> : null}
          {loading ? "Analyzing…" : "Analyze"}
        </Button>
        <Button type="button" variant="ghost" size="sm" disabled={loading} onClick={() => { setEditing(false); setError(null) }}>
          Cancel
        </Button>
        {error && <span className="max-w-48 truncate text-xs text-red-600" title={error}>{error}</span>}
      </form>
    )
  }

  return (
    <button
      type="button"
      onClick={() => { setUrl(profile.url); setEditing(true) }}
      className="hidden items-center gap-2 rounded-full border bg-white py-1 pl-1 pr-3 shadow-sm transition hover:border-foreground/20 md:flex"
      title={`${profile.url} · ${vertical.description}${profile.summary ? ` · ${profile.summary}` : ""} · Click to analyze a URL`}
    >
      <span className="grid size-7 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
        {profile.companyName.charAt(0)}
      </span>
      <span className="text-sm font-medium">{profile.companyName}</span>
      <Badge variant="secondary" className="text-[11px]">{vertical.label}</Badge>
    </button>
  )
}
