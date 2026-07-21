import JSZip from "jszip"
import { useEffect, useRef, useState } from "react"

import type { CrawlPage } from "@/components/WebsiteContext"

export type CrawlStatus = "idle" | "crawling" | "loaded" | "error"
export type LoadedContext = { url: string; pages: number; fileName: string; size: string; downloadUrl: string }
type CrawlResponse = { status: "scraping" | "completed" | "failed" | "cancelled"; completed?: number; total?: number; data?: CrawlPage[]; error?: string }

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

export function useWebsiteCrawl(onContextLoaded?: (url: string, pages: CrawlPage[]) => void) {
  const [status, setStatus] = useState<CrawlStatus>("idle")
  const [progress, setProgress] = useState({ completed: 0, total: 0 })
  const [context, setContext] = useState<LoadedContext | null>(null)
  const [error, setError] = useState("")
  const downloadUrl = useRef<string | null>(null)

  useEffect(() => () => {
    if (downloadUrl.current) URL.revokeObjectURL(downloadUrl.current)
  }, [])

  async function poll(id: string) {
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const response = await fetch(`/api/firecrawl/crawl/${id}`)
      const result = await response.json() as CrawlResponse & { message?: string }
      if (!response.ok) throw new Error(result.message ?? result.error ?? "Could not check crawl status.")
      setProgress({ completed: result.completed ?? result.data?.length ?? 0, total: result.total ?? 0 })
      if (result.status === "completed") return result.data ?? []
      if (result.status === "failed" || result.status === "cancelled") throw new Error(result.error ?? `Crawl ${result.status}.`)
      await wait(1800)
    }
    throw new Error("The crawl timed out. Please try again.")
  }

  async function start(rawUrl: string) {
    setError("")
    let sourceUrl: string
    try {
      sourceUrl = new URL(rawUrl.match(/^https?:\/\//i) ? rawUrl : `https://${rawUrl}`).toString()
    } catch {
      setStatus("error")
      setError("Enter a valid website URL.")
      throw new Error("Enter a valid website URL.")
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
      onContextLoaded?.(sourceUrl, pages)
      return sourceUrl
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "The website could not be loaded."
      setStatus("error")
      setError(message)
      throw caught
    }
  }

  function reset() {
    if (downloadUrl.current) URL.revokeObjectURL(downloadUrl.current)
    downloadUrl.current = null
    setStatus("idle")
    setContext(null)
    setProgress({ completed: 0, total: 0 })
    setError("")
  }

  return { status, progress, context, error, start, reset }
}
