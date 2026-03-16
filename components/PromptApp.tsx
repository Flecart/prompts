"use client"

import { useState, useEffect, useCallback } from "react"
import { type Prompt } from "@/lib/types"
import { sortByUsage } from "@/lib/usage"
import { PromptPalette } from "./PromptPalette"
import { PromptDetail } from "./PromptDetail"
import { FrequentChips } from "./FrequentChips"
import { ArrowLeftIcon, SparklesIcon } from "lucide-react"

export function PromptApp({ prompts }: { prompts: Prompt[] }) {
  const [selected, setSelected] = useState<Prompt | null>(null)
  const [sorted, setSorted] = useState<Prompt[]>(prompts)
  const [key, setKey] = useState(0)

  useEffect(() => {
    setSorted(sortByUsage(prompts))
  }, [prompts])

  const refreshSort = useCallback(() => {
    setSorted(sortByUsage(prompts))
    setKey((k) => k + 1)
  }, [prompts])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ctrl+K focuses search only when no prompt is open (PromptDetail handles it otherwise)
      if ((e.metaKey || e.ctrlKey) && e.key === "k" && !selected) {
        e.preventDefault()
        const input = document.querySelector<HTMLInputElement>(
          '[data-slot="command-input"]'
        )
        input?.focus()
      }
      if (e.key === "Escape" && selected) {
        setSelected(null)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [selected])

  return (
    <div className="min-h-dvh bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
        <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
          {selected && (
            <button
              onClick={() => setSelected(null)}
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md md:hidden"
              aria-label="Back to prompt list"
            >
              <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-primary" aria-hidden="true" />
            <h1 className="text-base font-semibold tracking-tight">Prompts</h1>
          </div>
          <div className="ml-auto text-xs text-muted-foreground">
            {prompts.length} prompts
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>
        <div className="flex min-h-[calc(100dvh-3.5rem)]">
          {/* Sidebar: always visible on desktop, hidden on mobile when detail is open */}
          <div
            className={`shrink-0 border-r md:block md:w-64 ${
              selected ? "hidden w-full md:block" : "w-full md:w-64"
            }`}
          >
            <div className="sticky top-14 h-[calc(100dvh-3.5rem)] overflow-y-auto no-scrollbar">
              <div className="p-4">
                <FrequentChips
                  key={key}
                  prompts={prompts}
                  onSelect={setSelected}
                />
              </div>
              <PromptPalette
                prompts={sorted}
                selected={selected}
                onSelect={setSelected}
              />
            </div>
          </div>

          {/* Detail panel */}
          <div
            className={`min-w-0 flex-1 ${
              selected ? "block" : "hidden md:block"
            }`}
          >
            {selected ? (
              <div className="flex h-full flex-col">
                <div className="border-b px-6 py-5">
                  <div className="mx-auto max-w-2xl">
                  <h2 className="text-lg font-semibold tracking-tight">
                    {selected.name}
                  </h2>
                  {selected.variables.length > 0 && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {selected.variables.length} variable
                      {selected.variables.length !== 1 ? "s" : ""} to fill in
                    </p>
                  )}
                  </div>
                </div>
                <PromptDetail prompt={selected} onCopied={refreshSort} />
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                <div className="rounded-xl border bg-card p-4">
                  <SparklesIcon
                    className="h-8 w-8 text-muted-foreground/50"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">
                    Select a Prompt
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground/60">
                    Choose from the list or press{" "}
                    <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">
                      Ctrl K
                    </kbd>{" "}
                    to search
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

    </div>
  )
}
