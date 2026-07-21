import type { Post } from "@/types"

export const seedPosts: Post[] = [
  {
    id: "li-1",
    platform: "linkedin",
    status: "idea",
    title: "What we learned shipping v1",
    content: "A transparent look at the three decisions that helped us launch faster.",
    updatedAt: "Today",
  },
  {
    id: "li-2",
    platform: "linkedin",
    status: "ready",
    title: "The case for smaller launches",
    content: "Big launches create pressure. Small launches create feedback loops.",
    updatedAt: "2h ago",
  },
  {
    id: "x-1",
    platform: "x",
    status: "idea",
    title: "Build in public thread",
    content: "5 observations from turning a rough workflow into a real product.",
    updatedAt: "Yesterday",
  },
  {
    id: "x-2",
    platform: "x",
    status: "idea",
    title: "Product insight",
    content: "Your MVP does not need more features. It needs a clearer promise.",
    updatedAt: "3h ago",
  },
  {
    id: "ig-1",
    platform: "instagram",
    status: "idea",
    title: "Behind the scenes carousel",
    content: "From sketch to shipped: seven slides showing the real process.",
    updatedAt: "Monday",
  },
  {
    id: "ig-2",
    platform: "instagram",
    status: "ready",
    title: "Weekly progress recap",
    content: "A simple visual recap of what moved forward this week.",
    updatedAt: "1h ago",
  },
]
