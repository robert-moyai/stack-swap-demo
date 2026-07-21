import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import type { Platform, PostDraft, PostStatus } from "@/types"

const platformLabels: Record<Platform, string> = {
  linkedin: "LinkedIn",
  x: "X / Twitter",
  instagram: "Instagram",
}

export function PostDialog({
  open,
  onOpenChange,
  defaultPlatform,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultPlatform: Platform
  onSave: (post: PostDraft) => void
}) {
  const [platform, setPlatform] = useState<Platform>(defaultPlatform)
  const [status, setStatus] = useState<PostStatus>("idea")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")


  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!title.trim()) return
    onSave({ platform, status, title: title.trim(), content: content.trim() })
    onOpenChange(false)
  }

  const inputClass = "mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-foreground/40 focus:ring-2 focus:ring-ring/20"

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-card p-6 shadow-2xl outline-none">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-xl font-semibold tracking-tight">Create a post</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted-foreground">Capture the idea now. Refine it as it moves through the board.</Dialog.Description>
            </div>
            <Dialog.Close asChild><Button variant="ghost" size="icon" aria-label="Close"><X className="size-4" /></Button></Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <label className="text-sm font-medium">Platform
                <select className={inputClass} value={platform} onChange={(e) => setPlatform(e.target.value as Platform)}>
                  {Object.entries(platformLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium">Stage
                <select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value as PostStatus)}>
                  <option value="idea">Idea</option>
                  <option value="ready">Ready to post</option>
                </select>
              </label>
            </div>
            <label className="block text-sm font-medium">Title
              <input autoFocus className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give the post a working title" />
            </label>
            <label className="block text-sm font-medium">Draft or note
              <textarea className={`${inputClass} min-h-28 resize-none`} value={content} onChange={(e) => setContent(e.target.value)} placeholder="What do you want to say?" />
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <Dialog.Close asChild><Button type="button" variant="outline">Cancel</Button></Dialog.Close>
              <Button type="submit">Add to board</Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
