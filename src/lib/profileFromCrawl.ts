import { verticals, type BusinessProfile, type Vertical } from "@/types"

type CrawlPage = {
  markdown?: string
  metadata?: { title?: string; description?: string; sourceURL?: string; url?: string }
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

/**
 * Derive a BusinessProfile from Firecrawl crawl pages so coverage recommendations
 * update as soon as website onboarding finishes — without a second API call.
 */
export function profileFromCrawl(url: string, pages: CrawlPage[]): BusinessProfile {
  const home = pages[0]
  const text = pages
    .slice(0, 12)
    .map((page) => [page.metadata?.title, page.metadata?.description, page.markdown?.slice(0, 2500)].filter(Boolean).join("\n"))
    .join("\n\n")

  return {
    vertical: classifyVertical(text),
    companyName: home?.metadata?.title?.trim() || companyFromUrl(url),
    url,
    summary: home?.metadata?.description?.trim() || home?.markdown?.trim().slice(0, 180) || undefined,
    source: "url_onboarding",
  }
}
