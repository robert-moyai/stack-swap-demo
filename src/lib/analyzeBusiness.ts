import type { BusinessProfile } from "@/types"

export async function analyzeBusinessFromUrl(url: string): Promise<BusinessProfile> {
  const response = await fetch("/api/analyze-business", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  })

  const payload = (await response.json()) as { profile?: BusinessProfile; error?: string }
  if (!response.ok || !payload.profile) {
    throw new Error(payload.error || `Could not analyze URL (${response.status})`)
  }
  return payload.profile
}
