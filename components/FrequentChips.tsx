"use client"

import { type Prompt } from "@/lib/types"
import { getFrequentPrompts, getUsage } from "@/lib/usage"
import { StarIcon } from "lucide-react"

export function FrequentChips({
  prompts,
  onSelect,
}: {
  prompts: Prompt[]
  onSelect: (prompt: Prompt) => void
}) {
  const usage = getUsage()
  const frequent = getFrequentPrompts(prompts, prompts.length)
  if (frequent.length === 0) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <StarIcon className="h-3 w-3" aria-hidden="true" />
        Important Prompts
      </div>
      <ol className="max-h-56 space-y-1 overflow-y-auto pr-1">
        {frequent.map((p, index) => (
          <li key={p.name}>
            <button
              onClick={() => onSelect(p)}
              className="flex w-full items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2 text-left text-xs font-medium text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="min-w-0 truncate">
                {index + 1}. {p.name}
              </span>
              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] tabular-nums text-muted-foreground">
                {usage[p.name]?.count || 0}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
