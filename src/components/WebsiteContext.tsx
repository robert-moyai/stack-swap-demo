import { CheckCircle2, Download, FileArchive, Globe2, LoaderCircle, RotateCcw } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SectionCard } from "@/components/ui/section"
import type { CrawlStatus, LoadedContext } from "@/hooks/useWebsiteCrawl"

export type CrawlPage = {
  markdown?: string
  metadata?: { title?: string; description?: string; sourceURL?: string; url?: string }
}

export function WebsiteContext({
  status,
  progress,
  context,
  error,
  onReset,
}: {
  status: CrawlStatus
  progress: { completed: number; total: number }
  context: LoadedContext | null
  error: string
  onReset: () => void
}) {
  return (
    <SectionCard
      title={status === "loaded" ? "Website context loaded" : status === "crawling" ? "Loading website context" : "Website context"}
      description={
        status === "loaded" && context
          ? `${context.pages} pages ready as markdown`
          : status === "crawling"
            ? `${progress.completed}${progress.total ? ` / ${progress.total}` : ""} pages crawled`
            : "Use the website control in the header to help your workspace understand your brand"
      }
      icon={status === "loaded" ? <CheckCircle2 className="size-4 text-emerald-700" /> : status === "crawling" ? <LoaderCircle className="size-4 animate-spin" /> : <Globe2 className="size-4" />}
      badge={
        status === "loaded" ? (
          <Badge variant="secondary" className="bg-emerald-50 text-[11px] text-emerald-700">Ready</Badge>
        ) : status === "crawling" ? (
          <Badge variant="secondary" className="text-[11px]">Crawling…</Badge>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between md:p-6">
        {status === "loaded" && context ? (
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <div className="flex min-w-0 items-center gap-3 rounded-lg border bg-background px-3 py-2">
              <FileArchive className="size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="max-w-48 truncate text-xs font-medium">{context.fileName}</p>
                <p className="text-[11px] text-muted-foreground">{context.size}</p>
              </div>
            </div>
            <Button asChild>
              <a href={context.downloadUrl} download={context.fileName}>
                <Download className="size-4" /> Download ZIP
              </a>
            </Button>
            <Button variant="ghost" size="icon" onClick={onReset} aria-label="Load another website">
              <RotateCcw className="size-4" />
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {status === "crawling" ? "Your site is being crawled. You can keep working while it loads." : "Click the business profile in the header to load website context."}
          </p>
        )}
      </div>
      {status === "crawling" && (
        <div className="h-1 bg-muted">
          <div
            className="h-full animate-pulse bg-[#df5b36] transition-all duration-300"
            style={{ width: progress.total ? `${Math.max(8, Math.min(95, (progress.completed / progress.total) * 100))}%` : "12%" }}
          />
        </div>
      )}
      {status === "error" && (
        <div className="border-t border-red-100 bg-red-50 px-5 py-3 text-xs text-red-700">
          <strong>Couldn’t load this website.</strong> {error}
        </div>
      )}
    </SectionCard>
  )
}
