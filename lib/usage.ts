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
  return prompts
    .filter((p) => (usage[p.name]?.count || 0) > 0)
    .sort((a, b) => (usage[b.name]?.count || 0) - (usage[a.name]?.count || 0))
    .slice(0, limit)
}
