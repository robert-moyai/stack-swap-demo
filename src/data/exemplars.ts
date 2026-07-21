import type { ContentType, PlatformId, Vertical } from "@/types"

export type PlatformExemplar = {
  /** Category brands that typically win on this platform for the vertical — not claimed as the user's exact rivals. */
  brands: string[]
  /** What those brands do that works. */
  play: string
  /** Content types that carry the play. */
  contentTypes: ContentType[]
  /** Cadence / format hint. */
  pattern: string
}

/** Top scoring platforms per vertical get 2–3 exemplar cards. */
export const VERTICAL_EXEMPLARS: Record<Vertical, Partial<Record<PlatformId, PlatformExemplar>>> = {
  ecommerce: {
    trustpilot: {
      brands: ["Allbirds", "Away", "Glossier"],
      play: "They treat reviews as a product surface: ask after delivery, reply in public, and remix the best quotes into ads and PDPs.",
      contentTypes: ["store_review", "testimonial"],
      pattern: "Ask within 48h of delivery → reply to every review → weekly highlight reel of 5-star stories",
    },
    instagram: {
      brands: ["Gymshark", "Liquid Death", "Skiin"],
      play: "Customer UGC and creator demos outperform brand-only product shots. Captions stay short; the visual does the selling.",
      contentTypes: ["ugc", "offer", "product_demo"],
      pattern: "3–5 feed posts/week + Stories that stitch customer clips to a single CTA",
    },
    tiktok: {
      brands: ["e.l.f. Beauty", "Duolingo Shop", "Rhode"],
      play: "Native, slightly imperfect demos and POV unboxings beat polished ads. Hooks in the first second, product payoff by second five.",
      contentTypes: ["product_demo", "ugc"],
      pattern: "Daily-or-near-daily short demos; one clear product moment per clip",
    },
  },
  saas: {
    g2: {
      brands: ["Notion", "HubSpot", "Figma"],
      play: "Category leaders keep profiles dense with verified reviews, use-case filters, and comparison pages — then quote wins on LinkedIn.",
      contentTypes: ["testimonial", "case_study"],
      pattern: "Review asks after activation milestones → monthly profile refresh → win quotes into sales enablement",
    },
    linkedin: {
      brands: ["Linear", "Stripe", "Amplitude"],
      play: "Operator-led posts with a single sharp lesson outperform feature dumps. Case studies are framed as decisions, not press releases.",
      contentTypes: ["case_study", "thought_leadership"],
      pattern: "2–4 founder/PM posts per week; one customer outcome story every other week",
    },
    product_hunt: {
      brands: ["Raycast", "Arc", "Cal.com"],
      play: "Launches win when the first comment shows the product working and makers stay in-thread all day.",
      contentTypes: ["product_demo"],
      pattern: "One crisp one-liner + live demo GIF + maker AMA for 12 hours",
    },
  },
  fintech: {
    linkedin: {
      brands: ["Brex", "Mercury", "Plaid"],
      play: "Trust is the product. They publish clear operator takes and customer outcomes, rarely hype — compliance-friendly and specific.",
      contentTypes: ["thought_leadership", "case_study"],
      pattern: "Weekly insight posts + monthly customer outcome stories with hard numbers",
    },
    x: {
      brands: ["Wise", "Ramp", "Revolut"],
      play: "Short educational explainers and product status transparency build credibility faster than promo threads.",
      contentTypes: ["educational", "thought_leadership"],
      pattern: "Daily useful one-liners; threads only when teaching a full concept",
    },
    trustpilot: {
      brands: ["Revolut", "N26", "TransferWise era brands"],
      play: "They treat support recovery as marketing: fast, specific replies to critical reviews and featured verified wins.",
      contentTypes: ["testimonial"],
      pattern: "Reply SLA under 24h + monthly public summary of improvements",
    },
  },
  agency: {
    linkedin: {
      brands: ["Pentagram", "Instrument", "Huge"],
      play: "Proof over pitch: process breakdowns and before/after outcomes. Personal voices from principals outperform brand pages.",
      contentTypes: ["case_study", "thought_leadership"],
      pattern: "2–3 process/insight posts weekly; one deep case study monthly",
    },
    instagram: {
      brands: ["Buck", "Oddfellows", "Collins"],
      play: "Craft-forward carousels and studio process UGC. Less hard sell, more taste signal that attracts the right RFPs.",
      contentTypes: ["ugc", "case_study"],
      pattern: "Carousel case frames + Stories from the studio floor",
    },
    x: {
      brands: ["VaynerMedia", "Wieden+", "Anomaly"],
      play: "Hot takes that teach a principle, tied back to real client work — not vague motivation.",
      contentTypes: ["thought_leadership"],
      pattern: "Short opinionated posts; link deeper work only when asked",
    },
  },
  local_services: {
    google_reviews: {
      brands: ["Top local dentists", "HVAC leaders", "Boutique gyms"],
      play: "Category winners make review requests frictionless on mobile and reply to every review — especially the bad ones.",
      contentTypes: ["store_review", "testimonial"],
      pattern: "QR/SMS ask after service → reply same day → monthly photo updates on the profile",
    },
    instagram: {
      brands: ["Neighborhood cafes", "Salons", "Home service brands"],
      play: "Before/after and offer posts with location tags. Consistency beats production value.",
      contentTypes: ["offer", "ugc"],
      pattern: "3 posts/week: proof, offer, community/UGC",
    },
    trustpilot: {
      brands: ["Multi-location service brands"],
      play: "They centralize review asks after jobs and escalate complaint themes into ops fixes — then say so publicly.",
      contentTypes: ["testimonial", "store_review"],
      pattern: "Post-job ask flow + weekly ops review of 1-star themes",
    },
  },
}

export function getExemplar(vertical: Vertical, platform: PlatformId): PlatformExemplar | undefined {
  return VERTICAL_EXEMPLARS[vertical][platform]
}

export function exemplarsForVertical(vertical: Vertical): Array<{ platform: PlatformId; exemplar: PlatformExemplar }> {
  return (Object.entries(VERTICAL_EXEMPLARS[vertical]) as [PlatformId, PlatformExemplar][]).map(
    ([platform, exemplar]) => ({ platform, exemplar }),
  )
}
