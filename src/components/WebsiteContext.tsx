import JSZip from "jszip"
import { CheckCircle2, Download, FileArchive, Globe2, LoaderCircle, RotateCcw } from "lucide-react"
import { FormEvent, useRef, useState } from "react"

import { Button } from "@/components/ui/button"

type CrawlPage = { markdown?: string; metadata?: { title?: string; sourceURL?: string; url?: string } }
type CrawlStatus = { status: "scraping" | "completed" | "failed" | "cancelled"; completed?: number; total?: number; data?: CrawlPage[]; error?: string }
type LoadedContext = { url: string; pages: number; fileName: string; size: string; downloadUrl: string }

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function fileNameFor(page: CrawlPage, index: number) {
  const source = page.metadata?.sourceURL ?? page.metadata?.url
  if (!source) return `page-${index + 1}.md`
  try {
    const path = new URL(source).pathname
    const name = (path === "/" ? "home" : path).replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9-_]+/gi, "-") || "home"
    return `${String(index + 1).padStart(2, "0")}-${name}.md`
  } catch { return `page-${index + 1}.md` }
}

function formatBytes(bytes: number) {
  return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function WebsiteContext() {
  const [url, setUrl] = useState("")
  const [status, setStatus] = useState<"idle" | "crawling" | "loaded" | "error">("idle")
  const [progress, setProgress] = useState({ completed: 0, total: 0 })
  const [context, setContext] = useState<LoadedContext | null>(null)
  const [error, setError] = useState("")
  const downloadUrl = useRef<string | null>(null)

  async function poll(id: string) {
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const response = await fetch(`/api/firecrawl/crawl/${id}`)
      const result = await response.json() as CrawlStatus & { message?: string }
      if (!response.ok) throw new Error(result.message ?? result.error ?? "Could not check crawl status.")
      setProgress({ completed: result.completed ?? result.data?.length ?? 0, total: result.total ?? 0 })
      if (result.status === "completed") return result.data ?? []
      if (result.status === "failed" || result.status === "cancelled") throw new Error(result.error ?? `Crawl ${result.status}.`)
      await wait(1800)
    }
    throw new Error("The crawl timed out. Please try again.")
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError("")
    let sourceUrl: string
    try {
      sourceUrl = new URL(url.match(/^https?:\/\//i) ? url : `https://${url}`).toString()
      setUrl(sourceUrl)
    } catch {
      setStatus("error"); setError("Enter a valid website URL."); return
    }

    setStatus("crawling")
    setProgress({ completed: 0, total: 0 })
    try {
      const response = await fetch("/api/firecrawl/crawl", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: sourceUrl }) })
      const result = await response.json() as { id?: string; message?: string; error?: string }
      if (!response.ok || !result.id) throw new Error(result.message ?? result.error ?? "Could not start the crawl.")
      const pages = await poll(result.id)
      if (!pages.length) throw new Error("No markdown pages were returned.")

      const zip = new JSZip()
      pages.forEach((page, index) => {
        const title = page.metadata?.title ? `# ${page.metadata.title}\n\n` : ""
        const source = page.metadata?.sourceURL ?? page.metadata?.url
        zip.file(fileNameFor(page, index), `${title}${source ? `> Source: ${source}\n\n` : ""}${page.markdown ?? ""}`)
      })
      const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" })
      if (downloadUrl.current) URL.revokeObjectURL(downloadUrl.current)
      downloadUrl.current = URL.createObjectURL(blob)
      const fileName = `${new URL(sourceUrl).hostname.replace(/^www\./, "")}-context.zip`
      setContext({ url: sourceUrl, pages: pages.length, fileName, size: formatBytes(blob.size), downloadUrl: downloadUrl.current })
      setStatus("loaded")
    } catch (caught) {
      setStatus("error")
      setError(caught instanceof Error ? caught.message : "The website could not be loaded.")
    }
  }

  function reset() {
    if (downloadUrl.current) URL.revokeObjectURL(downloadUrl.current)
    downloadUrl.current = null
    setStatus("idle"); setContext(null); setProgress({ completed: 0, total: 0 }); setError("")
  }

  return (
    <section className="mb-8 overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-[0_6px_24px_rgba(24,34,28,0.05)]">
      <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between lg:p-6">
        <div className="flex items-start gap-3.5">
          <div className={`grid size-10 shrink-0 place-items-center rounded-xl ${status === "loaded" ? "bg-emerald-50 text-emerald-700" : "bg-[#fff0e9] text-[#df5b36]"}`}>
            {status === "loaded" ? <CheckCircle2 className="size-5" /> : <Globe2 className="size-5" />}
          </div>
          <div>
            <h2 className="text-sm font-semibold">{status === "loaded" ? "Website context loaded" : "Add your website context"}</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{status === "loaded" && context ? `${context.pages} pages are ready as markdown.` : "Crawl your site so your content workspace understands your brand."}</p>
          </div>
        </div>

        {status === "loaded" && context ? (
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex min-w-0 items-center gap-3 rounded-lg border bg-background px-3 py-2">
              <FileArchive className="size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0"><p className="max-w-48 truncate text-xs font-medium">{context.fileName}</p><p className="text-[11px] text-muted-foreground">{context.size}</p></div>
            </div>
            <Button asChild><a href={context.downloadUrl} download={context.fileName}><Download className="size-4" /> Download ZIP</a></Button>
            <Button variant="ghost" size="icon" onClick={reset} aria-label="Load another website"><RotateCcw className="size-4" /></Button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-xl">
            <div className="relative flex-1">
              <Globe2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input value={url} onChange={(event) => setUrl(event.target.value)} disabled={status === "crawling"} className="h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/20" placeholder="https://yourwebsite.com" />
            </div>
            <Button disabled={!url.trim() || status === "crawling"}>{status === "crawling" ? <><LoaderCircle className="size-4 animate-spin" /> {progress.completed}{progress.total ? ` / ${progress.total}` : ""} pages</> : "Load context"}</Button>
          </form>
        )}
      </div>
      {status === "crawling" && <div className="h-1 bg-muted"><div className="h-full animate-pulse bg-[#df5b36] transition-all" style={{ width: progress.total ? `${Math.max(8, Math.min(95, progress.completed / progress.total * 100))}%` : "12%" }} /></div>}
      {status === "error" && <div className="border-t border-red-100 bg-red-50 px-5 py-3 text-xs text-red-700"><strong>Couldn’t load this website.</strong> {error}</div>}
    </section>
  )
}
