"use client"

import { type Prompt } from "@/lib/types"
import { getFrequentPrompts } from "@/lib/usage"
import { StarIcon } from "lucide-react"

export function FrequentChips({
  prompts,
  onSelect,
}: {
  prompts: Prompt[]
  onSelect: (prompt: Prompt) => void
}) {
  const frequent = getFrequentPrompts(prompts)
  if (frequent.length === 0) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <StarIcon className="h-3 w-3" aria-hidden="true" />
        Frequently Used
      </div>
      <div
        className="flex gap-2 overflow-x-auto pb-1 no-scrollbar"
        role="list"
      >
        {frequent.map((p) => (
          <button
            key={p.name}
            role="listitem"
            onClick={() => onSelect(p)}
            className="shrink-0 rounded-lg border bg-card px-3 py-1.5 text-xs font-medium text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  )
}
