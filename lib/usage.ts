import { type Prompt, type UsageRecord } from "./types"

const STORAGE_KEY = "prompt-usage"

export function getUsage(): UsageRecord {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function recordUsage(name: string): void {
  const usage = getUsage()
  const existing = usage[name] || { count: 0, lastUsed: "" }
  usage[name] = {
    count: existing.count + 1,
    lastUsed: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usage))
}

export function sortByUsage(prompts: Prompt[]): Prompt[] {
  const usage = getUsage()
  return [...prompts].sort((a, b) => {
    const aCount = usage[a.name]?.count || 0
    const bCount = usage[b.name]?.count || 0
    if (bCount !== aCount) return bCount - aCount
    return a.name.localeCompare(b.name)
  })
}

export function getFrequentPrompts(prompts: Prompt[], limit = 5): Prompt[] {
  const usage = getUsage()
  const maxItems = limit > 0 ? limit : Number.POSITIVE_INFINITY

  return prompts
    .filter((p) => (usage[p.name]?.count || 0) > 0)
    .sort((a, b) => {
      const aUsage = usage[a.name]
      const bUsage = usage[b.name]
      const aCount = aUsage?.count || 0
      const bCount = bUsage?.count || 0

      if (bCount !== aCount) return bCount - aCount

      const aLastUsed = aUsage?.lastUsed ? Date.parse(aUsage.lastUsed) : 0
      const bLastUsed = bUsage?.lastUsed ? Date.parse(bUsage.lastUsed) : 0

      if (bLastUsed !== aLastUsed) return bLastUsed - aLastUsed

      return a.name.localeCompare(b.name)
    })
    .slice(0, maxItems)
}
