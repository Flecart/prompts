"use client"

import { useState, useEffect, useCallback } from "react"
import { type Prompt } from "@/lib/types"
import { sortByUsage } from "@/lib/usage"
import {
  findPromptByFragmentId,
  promptNameToFragmentId,
} from "@/lib/promptSlug"
import { PromptPalette } from "./PromptPalette"
import { PromptDetail } from "./PromptDetail"
import { FrequentChips } from "./FrequentChips"
import {
  ArrowLeftIcon,
  CheckIcon,
  CopyIcon,
  Link2Icon,
  SparklesIcon,
} from "lucide-react"
import { toast } from "sonner"

export function PromptApp({ prompts }: { prompts: Prompt[] }) {
  const [selected, setSelected] = useState<Prompt | null>(null)
  const [sorted, setSorted] = useState<Prompt[]>(prompts)
  const [key, setKey] = useState(0)
  const [linkCopied, setLinkCopied] = useState(false)

  useEffect(() => {
    setSorted(sortByUsage(prompts))
  }, [prompts])

  useEffect(() => {
    setLinkCopied(false)
  }, [selected?.name])

  const syncHashToPrompt = useCallback((prompt: Prompt | null) => {
    if (typeof window === "undefined") return
    const path = window.location.pathname || "/"
    if (!prompt) {
      window.history.replaceState(null, "", path)
      return
    }
    const id = promptNameToFragmentId(prompt.name)
    if (!id) return
    window.history.replaceState(null, "", `${path}#${id}`)
  }, [])

  const selectPrompt = useCallback(
    (prompt: Prompt | null) => {
      setSelected(prompt)
      syncHashToPrompt(prompt)
    },
    [syncHashToPrompt]
  )

  useEffect(() => {
    function syncSelectionFromHash() {
      const raw = window.location.hash.slice(1).trim()
      if (!raw) {
        setSelected(null)
        return
      }
      const match = findPromptByFragmentId(prompts, raw)
      if (match) setSelected(match)
    }

    syncSelectionFromHash()

    function onHashChange() {
      syncSelectionFromHash()
    }
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
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
        selectPrompt(null)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [selected, selectPrompt])

  const selectedFragmentId = selected
    ? promptNameToFragmentId(selected.name)
    : ""

  const copyRelativePromptLink = useCallback(async () => {
    if (!selectedFragmentId || typeof window === "undefined") return
    const rel = `${window.location.pathname}${window.location.search}#${selectedFragmentId}`
    await navigator.clipboard.writeText(rel)
    toast.success("Copied link")
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }, [selectedFragmentId])

  return (
    <div className="min-h-dvh bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
        <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
          {selected && (
            <button
              onClick={() => selectPrompt(null)}
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
                  onSelect={selectPrompt}
                />
              </div>
              <PromptPalette
                prompts={sorted}
                selected={selected}
                onSelect={selectPrompt}
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
                  <div className="flex items-start gap-2">
                    <h2
                      id={selectedFragmentId || undefined}
                      className="min-w-0 flex-1 text-lg font-semibold tracking-tight"
                    >
                      {selected.name}
                    </h2>
                    {selectedFragmentId ? (
                      <div className="mt-0.5 flex shrink-0 items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => void copyRelativePromptLink()}
                          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                          title="Copy relative link to this prompt"
                          aria-label={
                            linkCopied
                              ? "Link copied"
                              : "Copy relative link to this prompt"
                          }
                        >
                          {linkCopied ? (
                            <CheckIcon
                              className="h-4 w-4 text-green-600 dark:text-green-500"
                              aria-hidden="true"
                            />
                          ) : (
                            <CopyIcon className="h-4 w-4" aria-hidden="true" />
                          )}
                        </button>
                        <a
                          href={`#${selectedFragmentId}`}
                          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                          title="Fragment link to this prompt"
                          aria-label="Fragment link to this prompt"
                        >
                          <Link2Icon className="h-4 w-4" aria-hidden="true" />
                        </a>
                      </div>
                    ) : null}
                  </div>
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
