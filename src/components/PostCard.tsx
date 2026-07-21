import { ArrowLeft, ArrowRight, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CONTENT_TYPE_META } from "@/data/playbooks"
import type { Post } from "@/types"

export function PostCard({ post, onMove, onDelete }: { post: Post; onMove: () => void; onDelete: () => void }) {
  const isIdea = post.status === "idea"
  return (
    <Card className="group border-black/[0.07] bg-card transition hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary" className="bg-muted font-medium text-muted-foreground">{post.updatedAt}</Badge>
            {post.contentType && (
              <Badge variant="outline" className="font-medium">{CONTENT_TYPE_META[post.contentType].label}</Badge>
            )}
          </div>
          <div className="relative">
            <Button variant="ghost" size="icon" className="-mr-2 -mt-2 size-8 text-muted-foreground" aria-label="Delete to-do" onClick={onDelete} title="Delete to-do">
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
        <h3 className="mt-3 text-[15px] font-semibold leading-snug">{post.title}</h3>
        {post.content && <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{post.content}</p>}
        <Button variant="ghost" size="sm" onClick={onMove} className="mt-4 -ml-2 text-muted-foreground hover:text-foreground">
          {isIdea ? <>Post <ArrowRight className="size-3.5" /></> : <><ArrowLeft className="size-3.5" /> Back to ideas</>}
        </Button>
      </CardContent>
    </Card>
  )
}
