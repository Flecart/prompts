import { PromptApp } from "@/components/PromptApp"
import promptsData from "@/data/prompts.json"

export default function Home() {
  return <PromptApp prompts={promptsData.prompts} />
}
