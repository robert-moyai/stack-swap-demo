import * as Dialog from "@radix-ui/react-dialog"
import { Check, ChevronDown, LoaderCircle, Sparkles, X } from "lucide-react"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import type { CrawlPage } from "@/components/WebsiteContext"
import type { Post } from "@/types"

export function PreparePostDialog({ open, onOpenChange, post, platformName, bestPractices, contextPages, onComplete }: {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: Post
  platformName: string
  bestPractices: string[]
  contextPages: CrawlPage[]
  onComplete: (content: string) => void
}) {
  const [generated, setGenerated] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const websiteContext = useMemo(() => contextPages.map((page) => `# ${page.metadata?.title || page.metadata?.sourceURL || "Website page"}\n${page.markdown || ""}`).join("\n\n---\n\n"), [contextPages])

  async function generate() {
    setLoading(true); setError("")
    try {
      const response = await fetch("/api/ai/generate-post", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ platform: platformName, title: post.title, idea: post.content, bestPractices, websiteContext }) })
      const result = await response.json() as { text?: string; message?: string }
      if (!response.ok || !result.text) throw new Error(result.message || "The AI did not return a post.")
      setGenerated(result.text)
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Generation failed.") }
    finally { setLoading(false) }
  }

  const accordion = "group rounded-xl border border-border bg-background"
  return <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px]" />
      <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border bg-card p-6 shadow-2xl outline-none">
        <div className="flex items-start justify-between gap-4"><div><Dialog.Title className="text-xl font-semibold">Prepare post with AI</Dialog.Title><Dialog.Description className="mt-1 text-sm text-muted-foreground">Review the inputs sent to the AI, then generate platform-ready copy.</Dialog.Description></div><Dialog.Close asChild><Button variant="ghost" size="icon"><X className="size-4" /></Button></Dialog.Close></div>
        <div className="mt-6 space-y-3">
          <details className={accordion}><summary className="flex cursor-pointer list-none items-center justify-between p-4 text-sm font-semibold [&::-webkit-details-marker]:hidden"><span>Company URL context <span className="ml-2 text-xs font-normal text-muted-foreground">{contextPages.length} pages</span></span><ChevronDown className="size-4 transition group-open:rotate-180" /></summary><div className="max-h-64 overflow-auto whitespace-pre-wrap border-t p-4 text-xs leading-5 text-muted-foreground">{websiteContext || "No website context is loaded. Add a company URL at the top of the board first."}</div></details>
          <details className={accordion} open><summary className="flex cursor-pointer list-none items-center justify-between p-4 text-sm font-semibold [&::-webkit-details-marker]:hidden"><span>{platformName} best practices</span><ChevronDown className="size-4 transition group-open:rotate-180" /></summary><div className="grid gap-2 border-t p-4 sm:grid-cols-2">{bestPractices.map((item) => <div key={item} className="flex gap-2 text-xs leading-5 text-muted-foreground"><Check className="mt-0.5 size-3.5 shrink-0 text-primary" />{item}</div>)}</div></details>
          <details className={accordion} open><summary className="flex cursor-pointer list-none items-center justify-between p-4 text-sm font-semibold [&::-webkit-details-marker]:hidden"><span>Post idea</span><ChevronDown className="size-4 transition group-open:rotate-180" /></summary><div className="border-t p-4"><h3 className="text-sm font-semibold">{post.title}</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{post.content || "No brainstorming notes added."}</p></div></details>
        </div>
        {generated && <div className="mt-5"><label className="text-sm font-semibold">AI-generated post</label><textarea value={generated} onChange={(event) => setGenerated(event.target.value)} className="mt-2 min-h-48 w-full resize-y rounded-xl border bg-background p-4 text-sm leading-6 outline-none focus:ring-2 focus:ring-ring/20" /></div>}
        {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="mt-6 flex justify-end gap-2"><Dialog.Close asChild><Button variant="outline">Cancel</Button></Dialog.Close>{generated ? <Button onClick={() => onComplete(generated.trim())} disabled={!generated.trim()}>Save & move to ready</Button> : <Button onClick={generate} disabled={loading || !contextPages.length}>{loading ? <><LoaderCircle className="size-4 animate-spin" /> Generating</> : <><Sparkles className="size-4" /> Generate post</>}</Button>}</div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
}
