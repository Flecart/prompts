"use client"

import { type Prompt } from "@/lib/types"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import { FileTextIcon } from "lucide-react"

export function PromptPalette({
  prompts,
  selected,
  onSelect,
}: {
  prompts: Prompt[]
  selected: Prompt | null
  onSelect: (prompt: Prompt) => void
}) {
  return (
    <Command className="border-none bg-transparent" shouldFilter={true}>
      <div className="px-4 pb-3">
        <CommandInput placeholder="Search prompts…" />
      </div>
      <CommandList className="max-h-none px-2">
        <CommandEmpty>
          <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
            <FileTextIcon className="h-8 w-8 opacity-40" aria-hidden="true" />
            <p>No prompts found.</p>
          </div>
        </CommandEmpty>
        <CommandGroup>
          {prompts.map((p) => (
            <CommandItem
              key={p.name}
              value={p.name}
              onSelect={() => onSelect(p)}
              className={`mb-0.5 rounded-lg px-3 py-2.5 ${
                selected?.name === p.name
                  ? "bg-accent text-accent-foreground"
                  : ""
              }`}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <span className="min-w-0 truncate text-sm font-medium">
                  {p.name}
                </span>
                {p.variables.length > 0 && (
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
                    {p.variables.length}
                  </span>
                )}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
