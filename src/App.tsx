import { ArrowUpRight, Check, ChevronDown, CirclePlus, Lightbulb, Plus, Search, Settings2, Sparkles } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { BusinessChip } from "@/components/BusinessChip"
import { CoveragePanel } from "@/components/CoveragePanel"
import { PostCard } from "@/components/PostCard"
import { PostDialog } from "@/components/PostDialog"
import { WebsiteContext, type CrawlPage } from "@/components/WebsiteContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getExemplar } from "@/data/exemplars"
import {
  customPlatformConfig,
  loadPlatforms,
  platformConfigFor,
  platformsStorageKey,
  type PlatformConfig,
} from "@/data/platforms"
import { CONTENT_TYPE_META } from "@/data/playbooks"
import { loadProfile, saveProfile } from "@/data/profile"
import { seedPosts } from "@/data/seed"
import { computeCoverage } from "@/lib/coverage"
import { profileFromCrawl } from "@/lib/profileFromCrawl"
import { isPlatformId, type BusinessProfile, type ContentType, type Platform, type PlatformId, type Post, type PostDraft, type PostStatus } from "@/types"

const storageKey = "postflow-posts-v1"

const columns: { status: PostStatus; label: string; icon: typeof Lightbulb }[] = [
  { status: "idea", label: "Ideas", icon: Lightbulb },
  { status: "ready", label: "Ready to post", icon: Check },
]

function loadPosts() {
  try {
    const saved = localStorage.getItem(storageKey)
    return saved ? (JSON.parse(saved) as Post[]) : seedPosts
  } catch {
    return seedPosts
  }
}

export default function App() {
  const [posts, setPosts] = useState<Post[]>(loadPosts)
  const [profile, setProfile] = useState(loadProfile)
  const [platforms, setPlatforms] = useState<PlatformConfig[]>(loadPlatforms)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogPlatform, setDialogPlatform] = useState<Platform>(platforms[0]?.id ?? "linkedin")
  const [dialogContentType, setDialogContentType] = useState<ContentType | undefined>(undefined)
  const [addingPlatform, setAddingPlatform] = useState(false)
  const [newPlatformName, setNewPlatformName] = useState("")

  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(posts)), [posts])
  useEffect(() => saveProfile(profile), [profile])
  useEffect(() => localStorage.setItem(platformsStorageKey, JSON.stringify(platforms)), [platforms])

  const enabledPlatformIds = useMemo(() => platforms.map((platform) => platform.id), [platforms])

  const coverage = useMemo(
    () => computeCoverage(profile.vertical, posts, enabledPlatformIds),
    [profile.vertical, posts, enabledPlatformIds],
  )

  const filteredPosts = useMemo(() => {
    const term = search.toLowerCase().trim()
    return term ? posts.filter((post) => `${post.title} ${post.content}`.toLowerCase().includes(term)) : posts
  }, [posts, search])

  function openCreate(platform: Platform = platforms[0]?.id ?? "linkedin", contentType?: ContentType) {
    setDialogPlatform(platform)
    setDialogContentType(contentType)
    setDialogOpen(true)
  }

  function enableKnownPlatform(platform: PlatformId) {
    setPlatforms((current) => {
      if (current.some((item) => item.id === platform)) return current
      return [...current, platformConfigFor(platform)]
    })
  }

  function handleAddIdea(platform: PlatformId, contentType: ContentType) {
    enableKnownPlatform(platform)
    openCreate(platform, contentType)
  }

  function addPost(draft: PostDraft) {
    if (!platforms.some((item) => item.id === draft.platform)) {
      setPlatforms((current) => [...current, customPlatformConfig(draft.platform)])
    }
    setPosts((current) => [{ ...draft, id: crypto.randomUUID(), updatedAt: "Just now" }, ...current])
  }

  function movePost(post: Post) {
    setPosts((current) => current.map((item) => item.id === post.id ? { ...item, status: item.status === "idea" ? "ready" : "idea", updatedAt: "Just now" } : item))
  }

  function deletePost(id: string) {
    setPosts((current) => current.filter((post) => post.id !== id))
  }

  function handleProfileChange(next: BusinessProfile) {
    setProfile(next)
  }

  function handleWebsiteLoaded(url: string, pages: CrawlPage[]) {
    setProfile(profileFromCrawl(url, pages))
  }

  function addPlatform() {
    const name = newPlatformName.trim()
    if (!name) return
    const next = customPlatformConfig(name)
    if (platforms.some((platform) => platform.id === next.id || platform.name.toLowerCase() === name.toLowerCase())) return
    setPlatforms((current) => [...current, next])
    setNewPlatformName("")
    setAddingPlatform(false)
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-black/[0.06] bg-background/90 px-5 backdrop-blur md:px-8">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">V</div>
            <div>
              <div className="font-semibold leading-tight">VSBL</div>
              <div className="text-[11px] text-muted-foreground">Content workspace</div>
            </div>
          </div>
          <BusinessChip profile={profile} onProfileChange={handleProfileChange} />
          <Button variant="ghost" size="icon" aria-label="Settings"><Settings2 className="size-4" /></Button>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-5 py-8 md:px-8 md:py-10">
        <WebsiteContext onContextLoaded={handleWebsiteLoaded} />

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"><span className="h-px w-6 bg-muted-foreground/50" /> Content pipeline</div>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] md:text-4xl">Turn ideas into posts.</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Keep every platform moving, from the first spark to ready-to-publish copy.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/20 sm:w-56" placeholder="Search posts..." />
            </div>
            <Button onClick={() => openCreate()}><CirclePlus className="size-4" /> New post</Button>
          </div>
        </div>

        <div className="mt-8">
          <CoveragePanel
            profile={profile}
            coverage={coverage}
            enabledPlatforms={enabledPlatformIds}
            onAddIdea={handleAddIdea}
            onAddPlatform={enableKnownPlatform}
          />
        </div>

        <div className="mt-6 space-y-5">
          {platforms.map((meta, platformIndex) => {
            const platform = meta.id
            const platformPosts = filteredPosts.filter((post) => post.platform === platform)
            const exemplar = isPlatformId(platform) ? getExemplar(profile.vertical, platform) : undefined
            return (
              <section key={platform} className="animate-in overflow-hidden rounded-2xl border border-black/[0.07] bg-white/55 shadow-[0_1px_2px_rgba(24,34,28,0.03)]" style={{ animationDelay: `${platformIndex * 80}ms` }}>
                <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`grid size-9 place-items-center rounded-xl text-sm font-bold ${meta.color}`}>{meta.short}</div>
                    <div>
                      <h2 className="text-sm font-semibold">{meta.name}</h2>
                      <p className="text-xs text-muted-foreground">{platformPosts.length} {platformPosts.length === 1 ? "post" : "posts"} in pipeline</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => openCreate(platform)}><CirclePlus className="size-4" /> Add idea</Button>
                </div>

                <div className="grid md:grid-cols-2">
                  {columns.map(({ status, label, icon: Icon }, columnIndex) => {
                    const columnPosts = platformPosts.filter((post) => post.status === status)
                    return (
                      <div key={status} className={`min-h-48 p-4 md:p-5 ${columnIndex === 0 ? "md:border-r md:border-black/[0.06]" : ""}`}>
                        <div className="mb-4 flex items-center gap-2">
                          <Icon className="size-4 text-muted-foreground" />
                          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</h3>
                          <Badge variant="secondary" className="ml-1 min-w-6 justify-center px-1.5">{columnPosts.length}</Badge>
                        </div>
                        <div className="grid gap-3 xl:grid-cols-2">
                          {columnPosts.map((post) => <PostCard key={post.id} post={post} onMove={() => movePost(post)} onDelete={() => deletePost(post.id)} />)}
                          {columnPosts.length === 0 && (
                            <button onClick={() => openCreate(platform)} className="flex min-h-28 flex-col items-center justify-center rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground transition hover:border-foreground/25 hover:bg-white">
                              <ArrowUpRight className="mb-2 size-4" />
                              {search ? "No matching posts" : status === "idea" ? "Add the next idea" : "Move an idea here"}
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <details className="group border-t border-black/[0.06] bg-white/60">
                  <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-3.5 text-xs font-semibold text-muted-foreground transition hover:bg-white [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center gap-2"><Sparkles className="size-3.5" /> Best practices for {meta.name}</span>
                    <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="space-y-4 border-t border-black/[0.05] px-5 py-4">
                    {exemplar && (
                      <div className="rounded-xl border border-black/[0.06] bg-white p-3.5">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                          Who wins here
                        </div>
                        <div className="mt-1.5 text-xs font-medium text-foreground">
                          {exemplar.brands.join(" · ")}
                        </div>
                        <p className="mt-2 text-xs leading-5 text-muted-foreground">{exemplar.play}</p>
                        <p className="mt-2 text-[11px] leading-4 text-foreground/80">
                          <span className="font-medium">Pattern:</span> {exemplar.pattern}
                        </p>
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {exemplar.contentTypes.map((type) => (
                            <span key={type} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                              {CONTENT_TYPE_META[type].label}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="grid gap-2 sm:grid-cols-2">
                      {meta.bestPractices.map((practice) => (
                        <div key={practice} className="flex gap-2 text-xs leading-5 text-muted-foreground">
                          <Check className="mt-0.5 size-3.5 shrink-0 text-primary/70" />
                          <span>{practice}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>
              </section>
            )
          })}
        </div>

        <div className="mt-6">
          {addingPlatform ? (
            <div className="animate-in flex flex-col gap-3 rounded-2xl border border-dashed border-border bg-white/50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold">Add another platform</h3>
                <p className="mt-1 text-xs text-muted-foreground">Create a new swimlane for any channel you publish to.</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  autoFocus
                  value={newPlatformName}
                  onChange={(event) => setNewPlatformName(event.target.value)}
                  onKeyDown={(event) => { if (event.key === "Enter") addPlatform() }}
                  className="h-10 rounded-lg border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
                  placeholder="e.g. TikTok"
                />
                <Button onClick={addPlatform} disabled={!newPlatformName.trim()}>Add platform</Button>
                <Button variant="ghost" onClick={() => { setAddingPlatform(false); setNewPlatformName("") }}>Cancel</Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingPlatform(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-white/30 py-5 text-sm font-medium text-muted-foreground transition hover:border-foreground/25 hover:bg-white hover:text-foreground"
            >
              <Plus className="size-4" /> Add a platform
            </button>
          )}
        </div>
      </main>

      {dialogOpen && (
        <PostDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          defaultPlatform={dialogPlatform}
          defaultContentType={dialogContentType}
          platformOptions={platforms}
          onSave={addPost}
        />
      )}
    </div>
  )
}
