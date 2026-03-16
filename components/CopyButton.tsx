"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ClipboardIcon, CheckIcon } from "lucide-react"
import { toast } from "sonner"
import { recordUsage } from "@/lib/usage"

export function CopyButton({
  text,
  promptName,
  onCopied,
}: {
  text: string
  promptName: string
  onCopied?: () => void
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    recordUsage(promptName)
    setCopied(true)
    toast.success("Copied to clipboard!")
    onCopied?.()
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      onClick={handleCopy}
      size="lg"
      className="w-full transition-all active:scale-[0.98]"
      aria-label={copied ? "Copied to clipboard" : "Copy prompt to clipboard"}
    >
      {copied ? (
        <>
          <CheckIcon className="mr-2 h-4 w-4" aria-hidden="true" />
          Copied!
        </>
      ) : (
        <>
          <ClipboardIcon className="mr-2 h-4 w-4" aria-hidden="true" />
          Copy Prompt
        </>
      )}
    </Button>
  )
}
