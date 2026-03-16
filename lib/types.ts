export interface Prompt {
  name: string
  content: string
  variables: string[]
}

export interface PromptsData {
  prompts: Prompt[]
  generatedAt: string
}

export interface UsageRecord {
  [name: string]: { count: number; lastUsed: string }
}
