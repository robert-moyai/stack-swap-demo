import { ChevronDown } from "lucide-react"
import type { ReactNode } from "react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

export function SectionCard({
  title,
  description,
  icon,
  badge,
  defaultOpen = true,
  open,
  onOpenChange,
  className,
  children,
}: {
  title: string
  description?: string
  icon?: ReactNode
  badge?: ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  children: ReactNode
}) {
  return (
    <Collapsible
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      className={cn(
        "group/section animate-in overflow-hidden rounded-2xl border border-black/[0.07] bg-white/70 shadow-[0_1px_2px_rgba(24,34,28,0.03)]",
        className,
      )}
    >
      <CollapsibleTrigger className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-white/80 md:px-6">
        {icon && (
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
            {badge}
          </div>
          {description && <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{description}</p>}
        </div>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]/section:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="border-t border-black/[0.06]">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function NestedCollapsible({
  title,
  count,
  defaultOpen = false,
  children,
}: {
  title: string
  count?: number
  defaultOpen?: boolean
  children: ReactNode
}) {
  return (
    <Collapsible defaultOpen={defaultOpen} className="group/nested border-t border-black/[0.06]">
      <CollapsibleTrigger className="flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-white md:px-6">
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {title}
          {typeof count === "number" && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold normal-case tracking-normal text-muted-foreground">
              {count}
            </span>
          )}
        </span>
        <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]/nested:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-5 pb-5 md:px-6 md:pb-6">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  )
}
