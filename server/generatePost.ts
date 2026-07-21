import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"
import type { IncomingMessage, ServerResponse } from "node:http"

type GenerateBody = {
  platform?: string
  title?: string
  idea?: string
  bestPractices?: string[]
  websiteContext?: string
}

async function readJson(request: IncomingMessage) {
  const chunks: Buffer[] = []
  for await (const chunk of request) chunks.push(Buffer.from(chunk))
  return JSON.parse(Buffer.concat(chunks).toString() || "{}") as GenerateBody
}

function send(response: ServerResponse, status: number, data: unknown) {
  response.statusCode = status
  response.setHeader("Content-Type", "application/json")
  response.end(JSON.stringify(data))
}

export async function handleGeneratePost(request: IncomingMessage, response: ServerResponse) {
  if (request.url !== "/api/ai/generate-post") return false
  if (request.method !== "POST") {
    send(response, 405, { message: "Method not allowed." })
    return true
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    send(response, 500, { message: "OPENAI_API_KEY is missing. Add it to .env and restart the dev server." })
    return true
  }

  try {
    const body = await readJson(request)
    if (!body.platform || !body.title) {
      send(response, 400, { message: "Platform and post title are required." })
      return true
    }

    const openai = createOpenAI({ apiKey })
    const { text } = await generateText({
      model: openai(process.env.OPENAI_MODEL || "gpt-4o-mini"),
      system: "You are an expert social media copywriter. Write polished, specific copy grounded only in the supplied company context. Do not invent company claims. Return only the final post copy, without commentary or labels.",
      prompt: [
        `Platform: ${body.platform}`,
        `Idea title: ${body.title}`,
        `Idea notes: ${body.idea || "No additional notes."}`,
        `Platform best practices:\n${(body.bestPractices || []).map((item) => `- ${item}`).join("\n")}`,
        `Company website context:\n${(body.websiteContext || "No website context loaded.").slice(0, 120_000)}`,
        "Create one ready-to-publish post. Preserve the core idea and match the platform's conventions.",
      ].join("\n\n"),
    })

    send(response, 200, { text })
  } catch (error) {
    send(response, 500, { message: error instanceof Error ? error.message : "AI generation failed." })
  }
  return true
}
