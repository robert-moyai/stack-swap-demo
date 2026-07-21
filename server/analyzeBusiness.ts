import type { IncomingMessage, ServerResponse } from "node:http"

import { verticals, type BusinessProfile, type Vertical } from "../src/types"

const FIRECRAWL_SCRAPE_URL = "https://api.firecrawl.dev/v2/scrape"

type FirecrawlJsonResult = {
  companyName?: string
  vertical?: string
  summary?: string
  audience?: string
}

type FirecrawlScrapeResponse = {
  success?: boolean
  error?: string
  data?: {
    markdown?: string
    summary?: string
    metadata?: {
      title?: string
      description?: string
      sourceURL?: string
    }
    json?: FirecrawlJsonResult
  }
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)))
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
    req.on("error", reject)
  })
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify(body))
}

function normalizeUrl(raw: string): string | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    const url = new URL(withProtocol)
    if (url.protocol !== "http:" && url.protocol !== "https:") return null
    return url.toString()
  } catch {
    return null
  }
}

function getApiKey(): string | undefined {
  return process.env.FIRECRAWL_API_KEY || process.env.firecrawl_api_key
}

function isVertical(value: string | undefined): value is Vertical {
  return !!value && (verticals as readonly string[]).includes(value)
}

const keywordScores: Record<Vertical, string[]> = {
  ecommerce: ["shop", "cart", "checkout", "shipping", "product", "store", "buy now", "add to cart", "sku"],
  saas: ["saas", "software", "platform", "api", "dashboard", "subscription", "free trial", "integrations", "b2b"],
  fintech: ["fintech", "banking", "payments", "finance", "invest", "crypto", "lending", "wallet", "insurance"],
  agency: ["agency", "clients", "creative", "branding", "marketing services", "case studies", "retainer", "studio"],
  local_services: ["book now", "appointment", "near me", "local", "hours", "visit us", "salon", "clinic", "plumber"],
}

function classifyVertical(text: string): Vertical {
  const haystack = text.toLowerCase()
  let best: Vertical = "agency"
  let bestScore = 0
  for (const vertical of verticals) {
    const score = keywordScores[vertical].reduce(
      (total, keyword) => total + (haystack.includes(keyword) ? 1 : 0),
      0,
    )
    if (score > bestScore) {
      best = vertical
      bestScore = score
    }
  }
  return best
}

function companyFromUrl(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "")
    const label = host.split(".")[0] ?? host
    return label.charAt(0).toUpperCase() + label.slice(1)
  } catch {
    return "Your company"
  }
}

export async function handleAnalyzeBusiness(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  if (req.url !== "/api/analyze-business" || req.method !== "POST") return false

  const apiKey = getApiKey()
  if (!apiKey) {
    sendJson(res, 503, {
      error: "FIRECRAWL_API_KEY is not configured. Add it to stack-swap-demo/.env",
    })
    return true
  }

  let parsedUrl: string | undefined
  try {
    const parsed = JSON.parse(await readBody(req)) as { url?: string }
    parsedUrl = typeof parsed.url === "string" ? parsed.url : undefined
  } catch {
    sendJson(res, 400, { error: "Invalid JSON body" })
    return true
  }

  const url = parsedUrl ? normalizeUrl(parsedUrl) : null
  if (!url) {
    sendJson(res, 400, { error: "A valid http(s) URL is required" })
    return true
  }

  try {
    const response = await fetch(FIRECRAWL_SCRAPE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        formats: [
          "markdown",
          "summary",
          {
            type: "json",
            schema: {
              type: "object",
              properties: {
                companyName: { type: "string" },
                vertical: {
                  type: "string",
                  enum: [...verticals],
                  description: "Best-fit business vertical for content strategy",
                },
                summary: { type: "string", description: "One-sentence description of the business" },
                audience: { type: "string", description: "Primary audience or customer segment" },
              },
              required: ["companyName", "vertical", "summary"],
            },
          },
        ],
        onlyMainContent: true,
      }),
    })

    const payload = (await response.json()) as FirecrawlScrapeResponse
    if (!response.ok || !payload.success || !payload.data) {
      sendJson(res, response.status >= 400 ? response.status : 502, {
        error: payload.error || `Firecrawl scrape failed (${response.status})`,
      })
      return true
    }

    const extracted = payload.data.json ?? {}
    const markdown = payload.data.markdown ?? ""
    const summaryText = [
      extracted.summary,
      payload.data.summary,
      payload.data.metadata?.description,
      payload.data.metadata?.title,
      markdown.slice(0, 4000),
    ]
      .filter(Boolean)
      .join("\n")

    const vertical = isVertical(extracted.vertical) ? extracted.vertical : classifyVertical(summaryText)
    const profile: BusinessProfile = {
      vertical,
      companyName: extracted.companyName?.trim() || payload.data.metadata?.title?.trim() || companyFromUrl(url),
      url,
      summary: extracted.summary?.trim() || payload.data.summary?.trim() || payload.data.metadata?.description?.trim(),
      audience: extracted.audience?.trim() || undefined,
      source: "url_onboarding",
    }

    sendJson(res, 200, { profile })
  } catch (error) {
    sendJson(res, 502, {
      error: error instanceof Error ? error.message : "Failed to analyze business URL",
    })
  }

  return true
}
