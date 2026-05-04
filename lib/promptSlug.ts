import { type Prompt } from "@/lib/types"

/**
 * Stable URL fragment id from a prompt display name: lowercase kebab-case,
 * punctuation and quotes stripped (apostrophes removed so possessives stay
 * readable, e.g. Master's → masters).
 */
export function promptNameToFragmentId(name: string): string {
  let s = name.normalize("NFKC").trim().toLowerCase()
  // Double quotes and guillemets (ASCII and common Unicode)
  s = s.replace(/[\u201c\u201d\u201e\u201f\u2033\u2036\u00ab\u00bb"]/g, "")
  // Apostrophe / single-quote variants — remove before splitting on punctuation
  // so "Master's" → masters, not master-s
  s = s.replace(/[\u2018\u2019\u201a\u201b\u2032\u2035\u0060\u00b4']/g, "")
  s = s.replace(/[^a-z0-9]+/g, "-")
  s = s.replace(/-+/g, "-")
  s = s.replace(/^-|-$/g, "")
  return s
}

/** Resolve `#fragment` to a prompt; first match wins if names collide after slugify. */
export function findPromptByFragmentId(
  prompts: Prompt[],
  fragment: string
): Prompt | undefined {
  const key = decodeURIComponent(fragment).trim().toLowerCase()
  if (!key) return undefined
  return prompts.find((p) => promptNameToFragmentId(p.name) === key)
}
