# VSBL Project Context

## Project Name

Visible

## North Star

Visible exists to create visibility.

The product helps a company understand where it shows up across important public platforms, which platforms matter most for visibility and ranking, what actions can improve that position, and how performance changes over time.

## Core Problem

Visibility is shaped by multiple external platforms, not one owned channel. A company may be present on review sites, social platforms, search, media, and its own website, but it is hard to know:

- Which platforms are currently determining visibility.
- Which platform is leading or most important for ranking.
- What concrete actions are needed to move higher.
- How current performance compares to the desired state.
- What can be improved next.

## Product

Visible MVP

## MVP Goal

Create a lightweight visibility dashboard that gives each platform a clear score, status, best-practice guidance, and action workflow.

The MVP should stay focused on visibility operations:

- Show platform coverage.
- Score platform presence from 0 to 100.
- Surface best practices per platform.
- Track whether a platform is active.
- Manage platform-specific to-dos in a Kanban flow.

Analytics and competitor benchmarking belong to Phase 2 unless they are needed as simple placeholders for the MVP.

## Platform Scope

### Standard Platforms

The MVP should support six standard platforms:

- Trustpilot
- LinkedIn
- X
- Google
- Website
- Media

### Recommended Platforms

The product should also be able to recommend additional relevant platforms based on the company context.

Initial recommended platform examples:

- G2
- Other high-impact platforms to be defined per company or segment.

## Platform Model

Each platform should have:

- Rank score: 0 to 100.
- Best practices.
- Status: active when there are at least 3 posts, reviews, mentions, or relevant visibility signals.
- To-dos: Kanban workflow for actions that improve visibility.
- Phase 2 analytics placeholder.
- Phase 2 competitor placeholder.

## GEO Best Practices

GEO means Generative Engine Optimization: showing up when ChatGPT, Perplexity, Google AI Overviews, Gemini, Claude, and similar systems recommend companies.

The product should not assume one single winning platform. AI engines pull recommendations from a mix of third-party sources, owned content, review platforms, social authority, media, and fresh crawlable facts.

### Ranking Signals To Care About

Visible should score and explain signals like:

- Citations and share of voice across AI engines.
- YouTube mentions and transcript presence.
- Listicles, "best X" roundups, and comparison pages.
- Review platform strength, volume, recency, and response quality.
- Reddit and community mentions, while treating them as volatile.
- LinkedIn authority for professional and B2B queries.
- Wikipedia or encyclopedic anchors where realistic.
- E-E-A-T signals: author credentials, firsthand proof, transparent sourcing, and consistent brand facts.
- Content freshness, especially substantive updates within the last quarter.
- Source diversity across platforms instead of dependence on one channel.

Visible should avoid scoring old SEO proxy signals as core GEO drivers:

- Domain Authority.
- Backlink count by itself.
- llms.txt adoption by itself.
- JSON-LD/schema by itself.

These can support discoverability, but they should not be treated as primary GEO rank drivers unless real performance data proves otherwise.

### Scoring Principle

Build per-engine scores before a blended score. ChatGPT, Perplexity, Google AI Overviews, Gemini, and Claude may cite different domains and sources. A blended number can hide the actual gap.

Rank scores shown in the MVP are placeholders until the product computes them from real signals.

## Platform Best Practices

### Website

Best practices:

- Server-side render important content so AI crawlers can read it.
- Allow GPTBot, PerplexityBot, ClaudeBot, Google-Extended, and relevant search crawlers in robots.txt when citation is desired.
- Build comparison pages, "[competitor] alternative" pages, FAQ blocks, and original research pages.
- Publish original statistics or research that third parties can cite.
- Use clear factual sentences, visible dates, and source references.
- Refresh pages with substantive updates, not cosmetic date changes.

Kanban to-dos:

- Allow AI crawlers.
- Add comparison and alternative pages.
- Add FAQ blocks.
- Publish one data or research piece.
- Set quarterly freshness refresh.

Phase 2 analytics:

- GA4 AI-referral tracking from domains like chatgpt.com and perplexity.ai.
- Crawler log analysis.

### G2 / Clutch

Use G2 as the default SaaS review anchor and Clutch as the default agency review anchor.

Best practices:

- Complete the profile to 100 percent.
- Choose the right categories.
- Drive steady review velocity instead of one review burst.
- Respond to every review.
- Keep recent reviews flowing because recency influences review grids and AI "best software" answers.

Kanban to-dos:

- Complete profile.
- Fix categories.
- Launch review-ask flow.
- Respond to all reviews.
- Target at least two new reviews per month.

Phase 2 analytics:

- Native G2 or Clutch analytics such as profile views, buyer intent, and category rank.

### Trustpilot

Best practices:

- Automate review invites after purchase, delivery, or service completion.
- Keep TrustScore high with review volume and recency.
- Respond to negative reviews quickly and publicly.
- Verify the domain.

Kanban to-dos:

- Verify domain.
- Automate invites.
- Set negative-review SLA.
- Reply to backlog.
- Aim for steady weekly reviews.

Phase 2 analytics:

- Trustpilot Business analytics such as invite conversion and star trend.

### Google

Google covers Business Profile, reviews, local/entity trust, and search visibility.

Best practices:

- Fully complete the Google Business Profile.
- Drive steady genuine reviews that include natural relevant language.
- Reply to all reviews.
- Keep NAP details identical everywhere. NAP means name, address, and phone.
- Post profile updates monthly.

Kanban to-dos:

- Complete profile.
- Set review-ask flow.
- Reply to all reviews.
- Fix NAP consistency.
- Post updates monthly.

Phase 2 analytics:

- Google Business Profile insights such as searches, actions, and review trend.

### LinkedIn

Best practices:

- Post 3-5 times per week from the founder, not only the company page.
- Share frameworks, results, point of view, and proof.
- Complete founder and company pages.
- Keep brand facts consistent in bios.
- Engage in-niche daily.

Kanban to-dos:

- Optimize founder and company profiles.
- Set 3x/week cadence.
- Publish one framework or point-of-view piece.
- Engage in-niche daily.
- Align bio facts everywhere.

Phase 2 analytics:

- LinkedIn analytics such as impressions, followers, and post engagement.

### Reddit

Best practices:

- Participate organically in niche subreddits.
- Never hard-sell.
- Answer questions genuinely and mention the brand only when relevant.
- Build karma before using the account for brand-sensitive activity.
- Treat Reddit as high-reward and volatile; diversify beyond it.

Kanban to-dos:

- Map 3-5 target subreddits.
- Build account karma.
- Answer three threads per week.
- Host or join an AMA when credible.
- Monitor brand mentions.

Phase 2 analytics:

- Reddit mention tracking and subreddit share of voice.

### X

Best practices:

- Post consistently.
- Join niche conversations.
- Build in public where relevant.
- Use founder voice more than brand voice.
- Treat X as useful for Grok and real-time visibility signals.

Kanban to-dos:

- Optimize bio.
- Set posting cadence.
- Reply in niche threads daily.
- Share results and build-in-public updates.
- Track mentions.

Phase 2 analytics:

- X native analytics such as impressions, engagement, and follower growth.

### GitHub

GitHub is relevant for SaaS, dev-tools, technical audiences, and open-source proof. It should not be forced into every customer plan.

Best practices:

- Write a strong README with clear positioning.
- Get into relevant "awesome" lists.
- Grow stars through useful open-source work.
- Open-source a genuinely useful piece when it supports the business.
- Add docs that coding agents can parse, such as llms-full.txt where useful.

Kanban to-dos:

- Polish README.
- Submit to awesome lists.
- Ship a useful open-source repo.
- Add coding-agent-readable docs.
- Encourage stars without gimmicks.

Phase 2 analytics:

- GitHub insights such as traffic, clones, and stars over time.

### Media / Digital PR

Best practices:

- Earn mentions in trade press that AI systems actually cite.
- Run data studies journalists can reference.
- Provide expert quotes.
- Pursue niche podcasts and listicles.
- Aim for a Wikipedia-worthy footprint over time.
- Keep brand facts consistent across every mention.

Kanban to-dos:

- Build a media target list.
- Ship one data study.
- Set up expert-quote pitching.
- Pursue niche podcasts.
- Audit brand-fact consistency.

Phase 2 analytics:

- Media monitoring for mention volume, source quality, and sentiment.

## Prioritized GEO To-Do Order

When the product needs a default action order, use this sequence:

1. Reviews foundation: G2 or Clutch, Trustpilot, and Google profiles, review velocity, and review responses.
2. Website GEO: AI crawler access, comparison/FAQ pages, and one original data study.
3. YouTube presence: get the brand into videos and transcripts because this is a strong AI recommendation signal.
4. Founder social: LinkedIn and X cadence with authority-building content.
5. Reddit and media: organic community presence and first PR/data placements.
6. Freshness loop: quarterly substantive content refresh.

## GEO Competitor Method

Phase 2 competitor analysis should be repeatable per customer:

1. Define 10-20 buying-intent prompts for the customer's category, such as "best [category] agency" or "best [category] tool".
2. Run them across ChatGPT, Perplexity, Google AI Overviews, Gemini, and other relevant engines.
3. Count mention rate and share of voice for the customer versus the top 3-5 competitors.
4. Map where each competitor appears across G2, Trustpilot, LinkedIn, X, Reddit, website, media, YouTube, and other relevant sources.
5. Output a gap list showing platforms and queries where competitors win and the customer is absent.

Competitor tools to track as market context:

- Profound: enterprise, multi-engine citation tracking, category leader.
- Peec AI, Otterly.ai, Scrunch AI: SMB and mid-market AI visibility trackers.
- Ahrefs Brand Radar and Semrush AI toolkit: SEO incumbents adding AI visibility.

Visible's product wedge should be a simple per-platform 0-100 score with Kanban to-dos for agencies and SaaS, with YouTube mention tracking as a possible differentiated signal.

## Future Skills For Visible

The Visible repo team should eventually build:

- Per-platform audit skill: scores one platform from 0 to 100 and returns Kanban to-dos.
- Review-response skill: drafts on-brand replies to reviews.
- Content-freshness checker: flags pages needing substantive updates.
- AI-citation checker: runs prompt sets across engines and returns share of voice.
- Competitor-gap skill: applies the competitor method above.

## MVP Views

The current product direction is a platform overview backed by custom website scraping and manually usable platform data.

The main experience should help the user answer:

- Where are we visible?
- Which platform matters most right now?
- What is our current score per platform?
- What should we do next to improve?
- Which work is already active, in progress, or ready?

## Kanban Intent

The Kanban board is not just a content calendar. It is the operational workflow for improving visibility.

To-dos can include:

- Publish posts.
- Request reviews.
- Improve profile completeness.
- Add missing company details.
- Respond to reviews.
- Create proof points.
- Improve website content.
- Claim or optimize listings.
- Gather media mentions.

## Phase 2

Phase 2 expands the MVP with analytics and competitor analysis.

### Analytics

Analytics should answer:

- How is each platform performing?
- What changed since the last period?
- Which actions improved score or presence?
- Where is performance weak?
- What can be improved next?

### Competitor Analysis

Competitor analysis should compare:

- Presence across platforms.
- Performance across platforms.
- Ranking position where available.
- Activity levels.
- Review and reputation signals.
- Content or media visibility.

## Scope Guardrails

Keep the MVP narrow:

- Prioritize clarity over automation.
- Prefer simple platform scoring before complex ranking logic.
- Make recommendations actionable, not abstract.
- Keep Phase 2 analytics and competitor analysis visible as future direction, but do not let them dominate the first build.
- Use scraped or manually seeded platform data until a more robust data pipeline is justified.

## Agent Instructions

When revisiting this project, use this document as the scope north star before proposing or implementing changes.

Default product interpretation:

- The product is about visibility, not generic social media planning.
- Platforms are first-class entities.
- Scores, best practices, and to-dos are the core MVP objects.
- The Kanban flow exists to improve platform visibility.
- Competitor analysis and analytics are Phase 2 unless explicitly pulled forward.
