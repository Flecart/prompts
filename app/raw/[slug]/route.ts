import { promptNameToFragmentId } from "@/lib/promptSlug"
import { type Prompt } from "@/lib/types"
import promptsData from "@/data/prompts.json"

const prompts = promptsData.prompts as Prompt[]

// Prerender one static markdown file per prompt at build time. The slug matches
// the UI fragment id, so `/#language-learning` maps to `/raw/language-learning`.
export const dynamic = "force-static"

export function generateStaticParams() {
  return prompts.map((p) => ({ slug: promptNameToFragmentId(p.name) }))
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const key = decodeURIComponent(slug).trim().toLowerCase()
  const prompt = prompts.find((p) => promptNameToFragmentId(p.name) === key)

  if (!prompt) {
    return new Response(`# Not found\n\nNo prompt matches "${key}".\n`, {
      status: 404,
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    })
  }

  const body = `# ${prompt.name}\n\n${prompt.content}\n`
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  })
}
