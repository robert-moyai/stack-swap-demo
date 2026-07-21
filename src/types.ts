export const platforms = ["linkedin", "x", "instagram"] as const
export const statuses = ["idea", "ready"] as const

export type Platform = (typeof platforms)[number]
export type PostStatus = (typeof statuses)[number]

export type Post = {
  id: string
  platform: Platform
  status: PostStatus
  title: string
  content: string
  updatedAt: string
}

export type PostDraft = Pick<Post, "platform" | "status" | "title" | "content">
