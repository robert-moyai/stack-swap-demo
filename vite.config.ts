import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import type { IncomingMessage, ServerResponse } from "node:http"
import { defineConfig, loadEnv, type Plugin } from "vite"

const FIRECRAWL_API = "https://api.firecrawl.dev/v2"

function sendJson(response: ServerResponse, status: number, data: unknown) {
  response.statusCode = status
  response.setHeader("Content-Type", "application/json")
  response.end(JSON.stringify(data))
}

async function readBody(request: IncomingMessage) {
  const chunks: Buffer[] = []
  for await (const chunk of request) chunks.push(Buffer.from(chunk))
  return JSON.parse(Buffer.concat(chunks).toString() || "{}") as { url?: string }
}

function firecrawlProxy(apiKey: string): Plugin {
  return {
    name: "firecrawl-api-proxy",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const requestUrl = request.url ?? ""
        if (!requestUrl.startsWith("/api/firecrawl/crawl")) return next()

        if (!apiKey) {
          return sendJson(response, 500, { message: "FIRECRAWL_API_KEY is missing. Add it to your .env file and restart the dev server." })
        }

        try {
          let firecrawlUrl = `${FIRECRAWL_API}/crawl`
          let method = "POST"
          let body: string | undefined

          if (request.method === "POST" && requestUrl === "/api/firecrawl/crawl") {
            const { url } = await readBody(request)
            if (!url) return sendJson(response, 400, { message: "A website URL is required." })
            body = JSON.stringify({
              url,
              limit: 100,
              scrapeOptions: { formats: ["markdown"], onlyMainContent: true },
            })
          } else if (request.method === "GET") {
            const id = requestUrl.split("/").filter(Boolean).at(-1)
            if (!id || id === "crawl") return sendJson(response, 400, { message: "A crawl ID is required." })
            firecrawlUrl = `${FIRECRAWL_API}/crawl/${encodeURIComponent(id)}`
            method = "GET"
          } else {
            return sendJson(response, 405, { message: "Method not allowed." })
          }

          const headers = {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          }
          const upstream = await fetch(firecrawlUrl, { method, headers, body })
          const result = await upstream.json() as {
            status?: string
            data?: unknown[]
            next?: string | null
          }

          // Completed crawl results can be paginated. Collect every page before
          // returning so the generated archive never silently drops content.
          if (upstream.ok && method === "GET" && result.status === "completed") {
            const allPages = [...(result.data ?? [])]
            let next = result.next
            while (next) {
              const pageResponse = await fetch(next, { headers })
              if (!pageResponse.ok) break
              const page = await pageResponse.json() as { data?: unknown[]; next?: string | null }
              allPages.push(...(page.data ?? []))
              next = page.next
            }
            result.data = allPages
            result.next = null
          }

          sendJson(response, upstream.status, result)
        } catch (error) {
          sendJson(response, 500, { message: error instanceof Error ? error.message : "Firecrawl request failed." })
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  return {
    plugins: [react(), tailwindcss(), firecrawlProxy(env.FIRECRAWL_API_KEY)],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
