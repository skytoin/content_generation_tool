import OpenAI from 'openai'

// Lazy-load OpenAI client to avoid build-time initialization
let openaiClient: OpenAI | null = null

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openaiClient
}

// OpenAI Model IDs
export const OPENAI_MODELS = {
  GPT_4O: 'gpt-4o',
  GPT_4O_MINI: 'gpt-4o-mini',
  GPT_4_1: 'gpt-4.1',
  GPT_4_1_MINI: 'gpt-4.1-mini',
  GPT_4_1_NANO: 'gpt-4.1-nano',
}

// Helper function to call OpenAI API
export async function callOpenAI(
  model: string,
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = 4000
): Promise<string> {
  const client = getOpenAIClient()
  const response = await client.chat.completions.create({
    model,
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]
  })

  return response.choices[0]?.message?.content || ''
}

// Helper function for OpenAI with web search (using responses API)
export async function callOpenAIWithSearch(
  model: string,
  systemPrompt: string,
  userPrompt: string,
  maxSearches: number = 4,
  maxTokens: number = 8000
): Promise<string> {
  // OpenAI doesn't have built-in web search like Anthropic
  // We'll use the standard completion for now
  // In production, you'd integrate with a search API like Serper, Tavily, or Bing
  const client = getOpenAIClient()
  const response = await client.chat.completions.create({
    model,
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]
  })

  return response.choices[0]?.message?.content || ''
}
