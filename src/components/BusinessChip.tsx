import { LoaderCircle } from "lucide-react"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { VERTICAL_META } from "@/data/playbooks"
import type { BusinessProfile } from "@/types"

export function BusinessChip({
  profile,
  onLoadContext,
  loading,
}: {
  profile: BusinessProfile
  onLoadContext: (url: string) => Promise<string>
  loading: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [url, setUrl] = useState(profile.url)
  const vertical = VERTICAL_META[profile.vertical]

  async function handleAnalyze(event: React.FormEvent) {
    event.preventDefault()
    try {
      const normalizedUrl = await onLoadContext(url)
      setUrl(normalizedUrl)
      setEditing(false)
    } catch {
      // The context panel shows the actionable crawl error.
    }
  }

  if (editing) {
    return (
      <form onSubmit={handleAnalyze} className="order-3 flex w-full items-center gap-2 md:order-none md:w-auto">
        <input
          autoFocus
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://yourcompany.com"
          className="h-9 min-w-0 flex-1 rounded-lg border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20 md:w-56 md:flex-none"
          disabled={loading}
        />
        <Button type="submit" size="sm" disabled={loading || !url.trim()}>
          {loading ? <LoaderCircle className="size-3.5 animate-spin" /> : null}
          {loading ? "Loading…" : "Load context"}
        </Button>
        <Button type="button" variant="ghost" size="sm" disabled={loading} onClick={() => setEditing(false)}>
          Cancel
        </Button>
      </form>
    )
  }

  return (
    <button
      type="button"
      onClick={() => { setUrl(profile.url); setEditing(true) }}
      className="flex items-center gap-2 rounded-full border bg-white py-1 pl-1 pr-3 shadow-sm transition hover:border-foreground/20"
      title={`${profile.url} · ${vertical.description}${profile.summary ? ` · ${profile.summary}` : ""} · Click to load website context`}
    >
      <span className="grid size-7 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
        {profile.companyName.charAt(0)}
      </span>
      <span className="text-sm font-medium">{profile.companyName}</span>
      <Badge variant="secondary" className="text-[11px]">{vertical.label}</Badge>
    </button>
  )
}
