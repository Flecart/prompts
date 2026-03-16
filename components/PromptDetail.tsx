"use client"

import { useState, useEffect } from "react"
import { type Prompt } from "@/lib/types"
import { fillPrompt } from "@/lib/variables"
import { VariableForm } from "./VariableForm"
import { CopyButton } from "./CopyButton"
import { ChevronDownIcon, EyeIcon } from "lucide-react"

export function PromptDetail({
  prompt,
  onCopied,
}: {
  prompt: Prompt
  onCopied?: () => void
}) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [previewOpen, setPreviewOpen] = useState(true)

  useEffect(() => {
    setValues({})
    setPreviewOpen(true)
  }, [prompt.name])

  const filled = fillPrompt(prompt.content, values)
  const hasValues = Object.values(values).some((v) => v.trim())

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl space-y-6 p-6">
          {prompt.variables.length > 0 && (
            <VariableForm
              variables={prompt.variables}
              values={values}
              onChange={setValues}
            />
          )}

          <div className="space-y-3">
            <button
              onClick={() => setPreviewOpen(!previewOpen)}
              className="flex w-full items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring rounded-md"
              aria-expanded={previewOpen}
            >
              <EyeIcon className="h-4 w-4" aria-hidden="true" />
              Preview
              <ChevronDownIcon
                className={`ml-auto h-4 w-4 transition-transform duration-200 ${
                  previewOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
            {previewOpen && (
              <div className="rounded-xl border bg-card p-4">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-card-foreground">
                  {filled}
                </pre>
                {hasValues && (
                  <div className="mt-3 flex items-center gap-1.5 border-t pt-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    <span className="text-xs text-muted-foreground">
                      Variables filled
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 border-t bg-background/80 p-4 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl">
          <CopyButton text={filled} promptName={prompt.name} onCopied={onCopied} />
        </div>
        </div>
    </div>
  )
}
