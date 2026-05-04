import { describe, expect, it } from "vitest"
import { type Prompt } from "@/lib/types"
import {
  findPromptByFragmentId,
  promptNameToFragmentId,
} from "@/lib/promptSlug"

describe("promptNameToFragmentId", () => {
  it("maps the Master's Course note-taker example", () => {
    expect(
      promptNameToFragmentId(
        'System Prompt: The "Master\'s Course" Note-Taker'
      )
    ).toBe("system-prompt-the-masters-course-note-taker")
  })

  it("uses Unicode curly double quotes like the title", () => {
    const withCurly = "System Prompt: The \u201cMaster\u2019s Course\u201d Note-Taker"
    expect(promptNameToFragmentId(withCurly)).toBe(
      "system-prompt-the-masters-course-note-taker"
    )
  })

  it("preserves intentional hyphens inside words", () => {
    expect(promptNameToFragmentId("Note-Taker")).toBe("note-taker")
    expect(promptNameToFragmentId("Foo  Bar")).toBe("foo-bar")
  })

  it("trims and collapses separators", () => {
    expect(promptNameToFragmentId("  A  :  B  ")).toBe("a-b")
    expect(promptNameToFragmentId("a---b")).toBe("a-b")
  })

  it("strips apostrophe-like characters before kebab rules", () => {
    expect(promptNameToFragmentId("it's")).toBe("its")
    expect(promptNameToFragmentId("O\u2019Brien")).toBe("obrien")
  })

  it("NFKC-normalizes compatibility characters", () => {
    // Fullwidth digit １ (U+FF11) → ASCII 1 after NFKC
    expect(promptNameToFragmentId("Prompt １")).toBe("prompt-1")
  })

  it("returns empty string when nothing alphanumeric remains", () => {
    expect(promptNameToFragmentId("")).toBe("")
    expect(promptNameToFragmentId("   ")).toBe("")
    expect(promptNameToFragmentId("… — « »")).toBe("")
  })

  it("handles slashes and parentheses", () => {
    expect(promptNameToFragmentId("Foo/Bar (v2)")).toBe("foo-bar-v2")
  })
})

describe("findPromptByFragmentId", () => {
  const prompts: Prompt[] = [
    {
      name: 'System Prompt: The "Master\'s Course" Note-Taker',
      content: "x",
      variables: [],
    },
    { name: "Other", content: "y", variables: [] },
  ]

  it("finds by exact slug", () => {
    const p = findPromptByFragmentId(
      prompts,
      "system-prompt-the-masters-course-note-taker"
    )
    expect(p?.name).toBe(prompts[0].name)
  })

  it("matches case-insensitively on the fragment", () => {
    const p = findPromptByFragmentId(
      prompts,
      "SYSTEM-PROMPT-THE-MASTERS-COURSE-NOTE-TAKER"
    )
    expect(p?.name).toBe(prompts[0].name)
  })

  it("decodes percent-encoded fragments", () => {
    const slug = "system-prompt-the-masters-course-note-taker"
    const p = findPromptByFragmentId(prompts, encodeURIComponent(slug))
    expect(p?.name).toBe(prompts[0].name)
  })

  it("trims whitespace in the fragment", () => {
    const p = findPromptByFragmentId(prompts, "  other  ")
    expect(p?.name).toBe("Other")
  })

  it("returns undefined for unknown fragments", () => {
    expect(findPromptByFragmentId(prompts, "nope")).toBeUndefined()
  })

  it("returns undefined for empty or whitespace-only fragment", () => {
    expect(findPromptByFragmentId(prompts, "")).toBeUndefined()
    expect(findPromptByFragmentId(prompts, "   ")).toBeUndefined()
  })

  it("returns the first prompt when two names collide after slugify", () => {
    const dup: Prompt[] = [
      { name: "Hello World", content: "a", variables: [] },
      { name: "Hello  World", content: "b", variables: [] },
    ]
    const p = findPromptByFragmentId(dup, "hello-world")
    expect(p?.content).toBe("a")
  })
})
