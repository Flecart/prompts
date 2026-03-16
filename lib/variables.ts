export function extractVariables(content: string): string[] {
  // Strip fenced code blocks
  const stripped = content.replace(/```[\s\S]*?```/g, "")
  const vars: string[] = []
  const regex = /(?<!\\)\[([^\]]+)\](?!\()/g
  let match
  while ((match = regex.exec(stripped)) !== null) {
    if (!vars.includes(match[1])) {
      vars.push(match[1])
    }
  }
  return vars
}

export function fillPrompt(
  content: string,
  values: Record<string, string>
): string {
  let result = content
  for (const [key, value] of Object.entries(values)) {
    if (value.trim()) {
      result = result.replaceAll(`[${key}]`, value)
    }
  }
  return result
}
