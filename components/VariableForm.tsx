"use client"

import { Input } from "@/components/ui/input"
import { VariableIcon } from "lucide-react"

export function VariableForm({
  variables,
  values,
  onChange,
}: {
  variables: string[]
  values: Record<string, string>
  onChange: (values: Record<string, string>) => void
}) {
  if (variables.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <VariableIcon className="h-4 w-4" aria-hidden="true" />
        Variables
      </div>
      <div className="space-y-3">
        {variables.map((v) => (
          <div key={v} className="space-y-1.5">
            <label
              htmlFor={`var-${v}`}
              className="block text-sm font-medium"
            >
              {v}
            </label>
            <Input
              id={`var-${v}`}
              name={`var-${v}`}
              placeholder={`Enter ${v.toLowerCase()}…`}
              value={values[v] || ""}
              onChange={(e) => onChange({ ...values, [v]: e.target.value })}
              autoComplete="off"
              spellCheck={false}
              className="transition-colors"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
