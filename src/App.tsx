import { ArrowUpRight, Check, CirclePlus, Lightbulb, Search, Settings2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { PostCard } from "@/components/PostCard"
import { PostDialog } from "@/components/PostDialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { seedPosts } from "@/data/seed"
import type { Platform, Post, PostDraft, PostStatus } from "@/types"

const storageKey = "postflow-posts-v1"

const platformMeta: Record<Platform, { name: string; short: string; color: string; dot: string }> = {
  linkedin: { name: "LinkedIn", short: "in", color: "bg-[#e8f3ff] text-[#0a66c2]", dot: "bg-[#0a66c2]" },
  x: { name: "X / Twitter", short: "X", color: "bg-[#eceeed] text-[#111]", dot: "bg-[#111]" },
  instagram: { name: "Instagram", short: "◎", color: "bg-[#fff0f3] text-[#c13584]", dot: "bg-[#c13584]" },
}

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
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogPlatform, setDialogPlatform] = useState<Platform>("linkedin")

  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(posts)), [posts])

  const filteredPosts = useMemo(() => {
    const term = search.toLowerCase().trim()
    return term ? posts.filter((post) => `${post.title} ${post.content}`.toLowerCase().includes(term)) : posts
  }, [posts, search])

  function openCreate(platform: Platform = "linkedin") {
    setDialogPlatform(platform)
    setDialogOpen(true)
  }

  function addPost(draft: PostDraft) {
    setPosts((current) => [{ ...draft, id: crypto.randomUUID(), updatedAt: "Just now" }, ...current])
  }

  function movePost(post: Post) {
    setPosts((current) => current.map((item) => item.id === post.id ? { ...item, status: item.status === "idea" ? "ready" : "idea", updatedAt: "Just now" } : item))
  }

  function deletePost(id: string) {
    setPosts((current) => current.filter((post) => post.id !== id))
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
          <div className="hidden items-center gap-1 rounded-lg border bg-white p-1 shadow-sm md:flex">
            <Button variant="ghost" size="sm" className="bg-muted">Board</Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">Analytics</Button>
          </div>
          <Button variant="ghost" size="icon" aria-label="Settings"><Settings2 className="size-4" /></Button>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-5 py-8 md:px-8 md:py-10">
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

        <div className="mt-8 space-y-5">
          {(Object.keys(platformMeta) as Platform[]).map((platform, platformIndex) => {
            const meta = platformMeta[platform]
            const platformPosts = filteredPosts.filter((post) => post.platform === platform)
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
              </section>
            )
          })}
        </div>
      </main>

      {dialogOpen && <PostDialog open={dialogOpen} onOpenChange={setDialogOpen} defaultPlatform={dialogPlatform} onSave={addPost} />}
    </div>
  )
}
