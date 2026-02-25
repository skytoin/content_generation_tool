/**
 * SEO Analyzer - Intelligence Layer
 *
 * Uses DataForSEO to provide keyword research, competitor analysis,
 * content gap identification, and search intent mapping.
 * Gracefully degrades when DataForSEO is not configured.
 */

import { DataForSEOClient } from './client'
import { callOpenAI, OPENAI_MODELS } from '@/app/api/generate/openai-client'

// --- Public Types ---

export interface SEOAnalysisRequest {
  description: string
  industry?: string
  goals?: string
  competitorUrls?: string[]
  userKeywords?: string[]
  targetUrl?: string
  companyName?: string
  companyType?: string
  businessDescription?: string  // Full business description for AI relevance filtering
  seoSeeds?: string[]  // AI-generated customer search terms for keyword discovery
}

export interface KeywordData {
  keyword: string
  searchVolume: number
  difficulty: number
  cpc: number
  clicks: number
  searchIntent: 'informational' | 'navigational' | 'commercial' | 'transactional'
  competition: number
  relevanceScore?: number      // AI: 90=relevant, 50=maybe, undefined=unscored
  opportunityScore?: number    // Composite 0-100, higher=better opportunity
}

export interface CompetitorData {
  domain: string
  rank: number
  organicTraffic: number
  keywords: number
  commonKeywords: string[]
}

export interface KeywordWarning {
  keyword: string
  reason: string
  searchVolume: number
  actualClicks: number
  suggestedAlternatives: KeywordData[]
}

export interface SEOAnalysisResult {
  suggestedKeywords: KeywordData[]
  verifiedUserKeywords: KeywordData[]
  flaggedKeywords: KeywordWarning[]
  discoveredCompetitors: CompetitorData[]
  contentGaps: { keyword: string; competitorCount: number; avgVolume: number }[]
  searchIntentBreakdown: Record<string, number>
  dataSource: 'dataforseo' | 'none'
}

// --- Helpers ---

// Broad industry keywords — used ONLY as fallback when description yields nothing useful.
// Intentionally general so DataForSEO can expand into specific suggestions.
const INDUSTRY_FALLBACK_MAP: Record<string, string[]> = {
  finance: ['financial services', 'financial planning', 'financial advisor', 'accounting', 'tax planning'],
  technology: ['technology solutions', 'software company', 'IT solutions', 'tech company', 'software development'],
  healthcare: ['healthcare services', 'medical practice', 'healthcare provider', 'health clinic', 'medical services'],
  legal: ['legal services', 'law firm', 'attorney services', 'legal advice', 'lawyer'],
  marketing: ['marketing agency', 'digital marketing', 'marketing services', 'advertising agency', 'marketing company'],
  education: ['education services', 'training programs', 'online courses', 'tutoring', 'learning programs'],
  'real estate': ['real estate agency', 'property management', 'real estate services', 'realtor', 'real estate company'],
  retail: ['retail store', 'online shopping', 'e-commerce', 'retail business', 'product sales'],
  consulting: ['consulting services', 'business consulting', 'management consulting', 'advisory services', 'consulting firm'],
  construction: ['construction company', 'general contractor', 'building services', 'construction services', 'renovation'],
  restaurant: ['restaurant', 'catering services', 'food service', 'dining', 'restaurant business'],
  fitness: ['fitness center', 'gym', 'personal training', 'fitness services', 'health club'],
  beauty: ['beauty salon', 'spa services', 'beauty services', 'hair salon', 'skincare'],
  automotive: ['auto repair', 'car dealership', 'automotive services', 'mechanic', 'auto shop'],
  hospitality: ['hotel', 'hospitality services', 'lodging', 'resort', 'hotel management'],
  insurance: ['insurance services', 'insurance company', 'insurance agent', 'insurance broker', 'insurance coverage'],
  photography: ['photography services', 'photographer', 'photo studio', 'wedding photography', 'portrait photography'],
  cleaning: ['cleaning services', 'house cleaning', 'commercial cleaning', 'janitorial services', 'maid service'],
  plumbing: ['plumber', 'plumbing services', 'plumbing repair', 'plumbing company', 'drain cleaning'],
  landscaping: ['landscaping services', 'lawn care', 'landscape design', 'garden maintenance', 'landscaping company'],
}

function extractSeedKeywords(description: string, industry?: string, goals?: string, companyName?: string): string[] {
  const industryTerm = (industry || '').toLowerCase().trim()

  // Words about marketing goals — NOT about what the business actually does
  const goalStopWords = new Set([
    'build', 'establish', 'generate', 'create', 'increase', 'improve', 'grow',
    'boost', 'enhance', 'develop', 'expand', 'maximize', 'optimize', 'drive',
    'attract', 'convert', 'retain', 'engage', 'reach', 'achieve', 'launch',
    'raise', 'strengthen', 'maintain', 'sustain', 'foster', 'cultivate',
    'awareness', 'visibility', 'credibility', 'trust', 'presence', 'authority',
    'reputation', 'recognition', 'engagement', 'leads', 'inquiries', 'conversions',
    'traffic', 'revenue', 'growth', 'brand', 'branding', 'online', 'digital',
    'local', 'strong', 'steady', 'flow', 'stream', 'consistent', 'robust',
    'target', 'audience', 'market', 'share', 'position', 'positioning',
  ])

  // General stop words (common English words with no business meaning)
  const stopWords = new Set([
    // 2-letter words (needed since we allow length >= 2 to keep "ai")
    'is', 'an', 'to', 'of', 'in', 'on', 'at', 'or', 'by', 'if', 'it',
    'up', 'do', 'my', 'we', 'so', 'no', 'go', 'he', 'me', 'be', 'us', 'am',
    // 3+ letter words
    'about', 'would', 'could', 'should', 'their', 'there', 'these', 'those',
    'which', 'where', 'being', 'having', 'doing', 'during', 'before', 'after',
    'with', 'from', 'this', 'that', 'have', 'been', 'more', 'also', 'into',
    'want', 'need', 'like', 'make', 'help', 'just', 'over', 'such', 'take',
    'only', 'come', 'very', 'some', 'than', 'them', 'then', 'when', 'what',
    'will', 'each', 'much', 'many', 'well', 'back', 'even', 'the', 'and',
    'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was',
    'one', 'our', 'out', 'has', 'its', 'how', 'who', 'did', 'get', 'let',
    'new', 'big', 'top', 'use', 'way', 'own', 'any', 'best', 'most',
    'first', 'every', 'other', 'another', 'through', 'between', 'both',
  ])

  // Step 1: Extract business-relevant words from description
  // Allow length >= 2 to keep "ai" which is critical for tech/content companies
  const text = description.toLowerCase().replace(/[^\w\s-]/g, ' ')
  const words = text.split(/\s+/).filter(w => w.length >= 2)
  const isNoise = (w: string) => stopWords.has(w) || goalStopWords.has(w)
  const businessWords = words.filter(w => !isNoise(w))

  // Step 2: Build 2-word phrases from adjacent business words (HIGHEST VALUE — goes first)
  const descriptionKeywords: string[] = []
  for (let i = 0; i < words.length - 1; i++) {
    const w1 = words[i]
    const w2 = words[i + 1]
    if (!isNoise(w1) && !isNoise(w2) && w1.length >= 2 && w2.length >= 2) {
      descriptionKeywords.push(`${w1} ${w2}`)
    }
  }

  // Step 3: Build industry + business word compounds
  if (industryTerm && businessWords.length > 0) {
    for (const word of businessWords.slice(0, 3)) {
      if (word !== industryTerm) {
        descriptionKeywords.push(`${industryTerm} ${word}`)
      }
    }
  }

  // Step 4: Add standalone business words (only meaningful length)
  for (const word of businessWords.slice(0, 3)) {
    if (word.length > 4) descriptionKeywords.push(word)
  }

  // --- Check if description yielded enough keywords ---
  // If description was mostly goal/marketing text, fall back to industry-based keywords

  const keywords: string[] = []

  if (descriptionKeywords.length >= 3) {
    // Description had real business content — use it as primary source
    keywords.push(...descriptionKeywords)
    // Add industry as supplementary
    if (industryTerm) keywords.push(industryTerm)
  } else {
    // Description was mostly goal text — fall back to industry knowledge
    if (industryTerm) {
      // Try broader industry fallback map
      const matchedIndustry = Object.keys(INDUSTRY_FALLBACK_MAP).find(
        key => industryTerm.includes(key) || key.includes(industryTerm)
      )
      if (matchedIndustry) {
        keywords.push(...INDUSTRY_FALLBACK_MAP[matchedIndustry])
      }
      // Always include industry term itself
      keywords.push(industryTerm)
    }
    // Add whatever we got from description (even if few)
    keywords.push(...descriptionKeywords)
  }

  // Final fallback: if we still have very few, add basic industry variants
  if (keywords.length < 3 && industryTerm) {
    keywords.push(`${industryTerm} near me`, `${industryTerm} company`)
  }

  // Deduplicate and limit
  const final = [...new Set(keywords)].filter(k => k.length > 2).slice(0, 10)
  console.log(`[SEO] extractSeedKeywords v2 — industry: "${industryTerm}", descKeywords: [${descriptionKeywords.join(', ')}], final: [${final.join(', ')}]`)
  return final
}

function extractDomain(url: string): string {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`)
    return parsed.hostname.replace(/^www\./, '')
  } catch {
    return url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]
  }
}

function normalizeIntent(intent: string | undefined): KeywordData['searchIntent'] {
  const map: Record<string, KeywordData['searchIntent']> = {
    informational: 'informational',
    navigational: 'navigational',
    commercial: 'commercial',
    transactional: 'transactional',
  }
  return map[intent?.toLowerCase() || ''] || 'informational'
}

/**
 * Filter keyword suggestions for relevance to the user's actual industry/topic.
 *
 * DataForSEO's keyword_suggestions API often returns unrelated high-volume keywords
 * that share a generic word with the seed. For example, seed "financial services"
 * returns "us postal service" (both contain "service") and "yahoo finance" (contains
 * "finance"). These navigational brand queries are useless for content creation.
 *
 * Filtering strategy:
 * 1. Always remove navigational intent keywords (brand searches like "yahoo finance")
 * 2. Build a set of "topic words" from seeds + industry + user keywords
 * 3. Require each suggestion to share at least one topic word (excluding generic stop words)
 */
function filterSuggestionsForRelevance(
  suggestions: KeywordData[],
  seedKeywords: string[],
  industry?: string,
  userKeywords?: string[]
): KeywordData[] {
  // Words too generic to count as meaningful overlap — these appear across many industries
  // NOTE: This filter is now a FALLBACK — AI-based filtering is the primary method.
  // Only truly universal stop words remain; industry-specific words were removed so
  // this filter works for any business type (tax firm, restaurant, SaaS, etc.)
  const genericWords = new Set([
    'service', 'services', 'company', 'business', 'online', 'best', 'free',
    'near', 'top', 'how', 'what', 'new', 'cost', 'price', 'review', 'reviews',
    'number', 'phone', 'website', 'app', 'login', 'sign', 'jobs', 'job',
    'careers', 'salary', 'hours', 'location', 'locations', 'store', 'stores',
    'customer', 'support', 'tracking', 'track', 'order', 'status',
    'download', 'update', 'home', 'page', 'site', 'com', 'www',
    'the', 'and', 'for', 'with', 'from', 'that', 'this', 'are', 'your',
    'you', 'can', 'will', 'not', 'all', 'get', 'has', 'was', 'our',
    'professional', 'affordable', 'cheap', 'small', 'large', 'local',
  ])

  // Build topic words from seeds, industry, and user keywords
  const topicWords = new Set<string>()
  const allSources = [...seedKeywords, ...(userKeywords || [])]
  if (industry) allSources.push(industry)

  for (const phrase of allSources) {
    for (const word of phrase.toLowerCase().split(/\s+/)) {
      if (word.length >= 2 && !genericWords.has(word)) {
        topicWords.add(word)
      }
    }
  }

  if (topicWords.size === 0) return suggestions // No topic words = can't filter

  // Also keep the full seed phrases for phrase-level matching
  const seedPhrases = seedKeywords.map(s => s.toLowerCase())

  return suggestions.filter(kw => {
    // 1. Remove navigational intent — these are brand searches (e.g., "yahoo finance login")
    if (kw.searchIntent === 'navigational') return false

    const kwLower = kw.keyword.toLowerCase()
    const kwWords = kwLower.split(/\s+/)

    // 2. Best signal: keyword contains an entire seed phrase
    const containsSeedPhrase = seedPhrases.some(seed => kwLower.includes(seed))
    if (containsSeedPhrase) return true

    // 3. Count how many topic words overlap (require stronger overlap than just 1)
    const overlappingWords = kwWords.filter(w => topicWords.has(w))

    // Require at least 2 topic-word overlaps, OR 1 overlap if the keyword is short (<=3 words)
    if (overlappingWords.length >= 2) return true
    if (overlappingWords.length === 1 && kwWords.length <= 3) return true

    return false
  })
}

/**
 * AI-powered keyword relevance filter.
 *
 * Replaces hardcoded regex blacklists with an AI agent that evaluates keyword
 * relevance based on the actual business description. This works universally
 * for any business type — a tax firm, a restaurant, a SaaS startup — without
 * needing business-specific blacklists.
 *
 * The AI can understand that "ai content detector" is a different product than
 * "ai content creator" — something regex and word-matching can never do.
 */
async function filterKeywordsWithAI(
  keywords: KeywordData[],
  businessDescription: string,
  industry: string,
  companyType?: string
): Promise<KeywordData[]> {
  if (keywords.length === 0) return []

  // Build numbered keyword list for the prompt
  const keywordList = keywords
    .map((kw, i) => `${i + 1}. "${kw.keyword}" — ${kw.searchVolume}/mo`)
    .join('\n')

  const prompt = `You are an SEO analyst. Given a business description and candidate keywords, classify each keyword into one of three tiers.

Business: ${businessDescription}
Industry: ${industry}
${companyType ? `What the business offers: ${companyType}` : ''}

Candidate keywords (number — keyword — search volume):
${keywordList}

Classify each keyword:
- "relevant" — clearly about this business's products/services/use cases. Include: product category keywords, problem-solving queries, comparison keywords ("best X", "X vs Y"), use case keywords, broad industry terms. Aim for ~40-60% of candidates.
- "maybe" — tangentially related, could attract some relevant traffic. Include: adjacent topics, upstream/downstream keywords, industry trends. Aim for ~20-30%.
- "remove" — clearly irrelevant, navigational brand queries (e.g., "chatgpt login"), jobs/salary keywords, or about a DIFFERENT product (e.g., "content detector" when the business creates content). Aim for ~10-30%.

When in doubt, classify as "maybe" rather than "remove".

Return ONLY a JSON object mapping keyword numbers to classifications, e.g. {"1":"relevant","2":"maybe","3":"remove"}`

  try {
    const result = await callOpenAI(
      OPENAI_MODELS.GPT_4O_MINI,
      'You are an SEO keyword relevance analyst. Classify keywords into three tiers. Return only valid JSON.',
      prompt,
      3000
    )

    const jsonMatch = result.match(/\{[\s\S]*?\}/)
    if (jsonMatch) {
      const classifications = JSON.parse(jsonMatch[0]) as Record<string, string>
      const filtered: KeywordData[] = []

      for (const [numStr, tier] of Object.entries(classifications)) {
        const idx = parseInt(numStr, 10) - 1
        if (idx < 0 || idx >= keywords.length) continue

        const tierLower = tier.toLowerCase().trim()
        if (tierLower === 'relevant') {
          keywords[idx].relevanceScore = 90
          filtered.push(keywords[idx])
        } else if (tierLower === 'maybe') {
          keywords[idx].relevanceScore = 50
          filtered.push(keywords[idx])
        }
        // "remove" keywords are dropped
      }

      console.log(`[SEO] AI relevance filter: ${filtered.length}/${keywords.length} keywords selected (3-tier)`)
      return filtered
    }
  } catch (error) {
    console.warn('[SEO] AI keyword filter failed:', error)
  }

  // Fallback: light filter (remove navigational + zero volume), assign default relevance
  console.log('[SEO] AI filter failed, using light fallback')
  return keywords.filter(kw => {
    if (kw.searchIntent === 'navigational') return false
    if (kw.searchVolume <= 0) return false
    kw.relevanceScore = 70
    return true
  })
}

/**
 * Calculate a composite opportunity score for a keyword.
 *
 * Weights: ease 35%, relevance 30%, volume 25%, CPC 10%.
 * Surfaces low-difficulty, high-relevance keywords ("low-hanging fruit")
 * instead of just sorting by raw volume.
 */
function calculateOpportunityScore(kw: KeywordData): number {
  // Volume: log-scale (100 vs 200 matters more than 50K vs 50.1K)
  const volumeScore = Math.min(100, (Math.log10(Math.max(kw.searchVolume, 1)) / 5) * 100)

  // Ease: inverted difficulty (low difficulty = high ease)
  const easeScore = 100 - kw.difficulty

  // Relevance: from AI classification (90=relevant, 50=maybe, 70=default)
  const relevance = kw.relevanceScore ?? 70

  // CPC: commercial value signal, capped at $10
  const cpcScore = Math.min(100, (kw.cpc / 10) * 100)

  return Math.round(
    (volumeScore * 0.25) + (easeScore * 0.35) + (relevance * 0.30) + (cpcScore * 0.10)
  )
}

/**
 * Post-process keywords for quality and diversity.
 *
 * 1. Remove junk (stop-word-only phrases, special chars, numbers, repeated roots)
 * 2. Deduplicate similar keywords (keep highest-volume representative)
 *    e.g. "ai write", "ai writing", "write ai" → keep one
 * 3. Diversity cap — no more than MAX_PER_FAMILY keywords sharing the same root word
 */
function deduplicateAndDiversify(keywords: KeywordData[]): KeywordData[] {
  const WORD_FAMILY: Record<string, string> = {
    writing: 'write', written: 'write', writes: 'write', writer: 'write', writers: 'write',
    creating: 'create', created: 'create', creates: 'create', creator: 'create', creators: 'create', creation: 'create',
    generating: 'generate', generated: 'generate', generates: 'generate', generator: 'generate', generators: 'generate', generation: 'generate',
    automating: 'automate', automated: 'automate', automation: 'automate',
    optimizing: 'optimize', optimized: 'optimize', optimization: 'optimize',
    blogging: 'blog', blogs: 'blog', blogger: 'blog', bloggers: 'blog',
    posting: 'post', posts: 'post',
    emails: 'email',
    words: 'word',
    tools: 'tool',
    contents: 'content',
    copywriting: 'copywrite', copywriter: 'copywrite', copywriters: 'copywrite',
  }

  const STOP_WORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'for', 'with', 'in', 'on', 'to',
    'of', 'by', 'at', 'is', 'it', 'as', 'be', 'do', 'if', 'my', 'no',
    'so', 'up', 'we', 'he', 'me', 'us', 'am', 'our', 'are',
    'your', 'how', 'can', 'you', 'not', 'all', 'get', 'has', 'was',
    'what', 'who', 'this', 'that', 'will', 'just', 'very', 'best',
  ])

  function canon(word: string): string {
    const lower = word.toLowerCase()
    return WORD_FAMILY[lower] || lower
  }

  function getMeaningfulRoots(keyword: string): string[] {
    // Strip special chars like & # @ and hyphens, then split
    const words = keyword.toLowerCase().replace(/[&@#$%^*()+=\-]/g, ' ').split(/\s+/)
    return words
      .filter(w => !STOP_WORDS.has(w) && w.length >= 2 && !/^\d+$/.test(w))
      .map(canon)
  }

  function groupKey(keyword: string): string {
    const roots = getMeaningfulRoots(keyword)
    return [...new Set(roots)].sort().join('|')
  }

  // Step 1: Remove junk
  const cleaned = keywords.filter(kw => {
    const roots = getMeaningfulRoots(kw.keyword)

    // No meaningful words at all → "our we", "so how are you"
    if (roots.length === 0) return false

    // Only one meaningful word that's a number → "7000 words" (word mapped but 7000 removed)
    // Actually catch: only 1 root and keyword has 2+ raw words → likely filler
    const rawWords = kw.keyword.toLowerCase().replace(/[&@#$%^*()+=]/g, ' ').split(/\s+/).filter(w => w.length >= 2)
    if (roots.length === 1 && rawWords.length >= 3) return false

    // All meaningful words collapse to same root → "write and write", "style & style"
    const uniqueRoots = new Set(roots)
    if (roots.length > 1 && uniqueRoots.size === 1) return false

    return true
  })

  // Step 2: Deduplicate — group by canonical form, keep highest volume
  const groups = new Map<string, KeywordData>()
  for (const kw of cleaned) {
    const key = groupKey(kw.keyword)
    if (!key) continue
    const existing = groups.get(key)
    if (!existing || kw.searchVolume > existing.searchVolume) {
      groups.set(key, kw)
    }
  }

  // Step 3: Detect core roots — roots appearing in >50% of deduped keywords are exempt from cap
  const deduped = [...groups.values()]
  const rootAppearances = new Map<string, number>()
  for (const kw of deduped) {
    const roots = new Set(getMeaningfulRoots(kw.keyword))
    for (const r of roots) {
      rootAppearances.set(r, (rootAppearances.get(r) || 0) + 1)
    }
  }
  const coreRoots = new Set<string>()
  for (const [root, count] of rootAppearances) {
    if (count > deduped.length * 0.5) {
      coreRoots.add(root)
    }
  }
  if (coreRoots.size > 0) {
    console.log(`[SEO] Core roots (exempt from diversity cap): ${[...coreRoots].join(', ')}`)
  }

  // Step 4: Diversity cap — sort by volume, then cap per non-core word family
  const MAX_PER_FAMILY = 4
  const sorted = deduped.sort((a, b) => b.searchVolume - a.searchVolume)
  const familyCounts = new Map<string, number>()
  const diverse: KeywordData[] = []

  for (const kw of sorted) {
    const roots = getMeaningfulRoots(kw.keyword)
    // Only check cap for non-core roots
    const cappedOut = roots.some(w => !coreRoots.has(w) && (familyCounts.get(w) || 0) >= MAX_PER_FAMILY)
    if (cappedOut) continue

    diverse.push(kw)
    for (const w of roots) {
      familyCounts.set(w, (familyCounts.get(w) || 0) + 1)
    }
  }

  return diverse
}

function emptyResult(): SEOAnalysisResult {
  return {
    suggestedKeywords: [],
    verifiedUserKeywords: [],
    flaggedKeywords: [],
    discoveredCompetitors: [],
    contentGaps: [],
    searchIntentBreakdown: {},
    dataSource: 'none',
  }
}

// --- Main Analyzer ---

export async function analyzeSEO(request: SEOAnalysisRequest): Promise<SEOAnalysisResult> {
  // Check if DataForSEO is configured
  if (!process.env.DATAFORSEO_LOGIN || !process.env.DATAFORSEO_PASSWORD) {
    console.log('[SEO Analyzer] DataForSEO not configured, returning empty result')
    return emptyResult()
  }

  let client: DataForSEOClient
  try {
    client = new DataForSEOClient()
  } catch {
    console.log('[SEO Analyzer] Failed to create DataForSEO client')
    return emptyResult()
  }

  const result: SEOAnalysisResult = {
    suggestedKeywords: [],
    verifiedUserKeywords: [],
    flaggedKeywords: [],
    discoveredCompetitors: [],
    contentGaps: [],
    searchIntentBreakdown: {},
    dataSource: 'dataforseo',
  }

  // Step 1: Extract seed keywords
  const seedKeywords = extractSeedKeywords(request.description, request.industry, request.goals, request.companyName)
  console.log(`[SEO Analyzer] Seed keywords: ${seedKeywords.join(', ')}`)

  if (seedKeywords.length === 0) {
    return { ...emptyResult(), dataSource: 'dataforseo' }
  }

  // Step 2 & 3: Competitor analysis
  let competitorDomains: string[] = []

  if (request.competitorUrls?.length) {
    // User provided competitor URLs - analyze them directly
    competitorDomains = request.competitorUrls.slice(0, 3).map(extractDomain)

    // Auto-discover additional competitors using first provided domain
    console.log('[SEO Analyzer] Discovering competitors for provided domains...')
    const competitors = await client.getCompetitorsDomain(competitorDomains[0])
    if (competitors?.items?.length) {
      result.discoveredCompetitors = competitors.items.slice(0, 5).map(item => ({
        domain: item.domain,
        rank: item.full_domain_metrics?.rank || 0,
        organicTraffic: item.full_domain_metrics?.organic_traffic || 0,
        keywords: item.full_domain_metrics?.organic_keywords || 0,
        commonKeywords: [],
      }))
    }
  } else if (request.targetUrl) {
    // User provided their own URL - discover competitors from it
    const targetDomain = extractDomain(request.targetUrl)
    console.log(`[SEO Analyzer] Auto-discovering competitors for ${targetDomain}...`)
    const competitors = await client.getCompetitorsDomain(targetDomain)
    if (competitors?.items?.length) {
      competitorDomains = competitors.items
        .slice(0, 3)
        .map(item => item.domain)

      result.discoveredCompetitors = competitors.items.slice(0, 5).map(item => ({
        domain: item.domain,
        rank: item.full_domain_metrics?.rank || 0,
        organicTraffic: item.full_domain_metrics?.organic_traffic || 0,
        keywords: item.full_domain_metrics?.organic_keywords || 0,
        commonKeywords: [],
      }))
    }
  } else {
    // No domain provided - discover competitors by searching for seed keywords
    console.log('[SEO Analyzer] Discovering competitors from keyword SERP results...')
    const domainCounts = new Map<string, number>()

    // Search top 2 seed keywords to find who ranks for them
    for (const seedKw of seedKeywords.slice(0, 2)) {
      const serpResult = await client.discoverCompetitorsFromKeyword(seedKw)
      if (serpResult?.items) {
        for (const item of serpResult.items) {
          if (item.type === 'organic' && item.domain) {
            domainCounts.set(item.domain, (domainCounts.get(item.domain) || 0) + 1)
          }
        }
      }
    }

    // Rank by how many seed keywords each domain appears for
    const sortedDomains = [...domainCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    if (sortedDomains.length > 0) {
      competitorDomains = sortedDomains.slice(0, 3).map(([domain]) => domain)
      result.discoveredCompetitors = sortedDomains.map(([domain]) => ({
        domain,
        rank: 0,
        organicTraffic: 0,
        keywords: 0,
        commonKeywords: [],
      }))
    }
  }

  // Analyze competitor domains (keywords + rank)
  const competitorKeywordsMap = new Map<string, Set<string>>()
  const allCompetitorKeywords: KeywordData[] = []

  for (const domain of competitorDomains) {
    const [keywordsResult, rankResult] = await Promise.all([
      client.getKeywordsForSite(domain),
      client.getDomainRankOverview(domain),
    ])

    const domainKeywords = new Set<string>()

    if (keywordsResult?.items) {
      for (const item of keywordsResult.items) {
        domainKeywords.add(item.keyword)
        allCompetitorKeywords.push({
          keyword: item.keyword,
          searchVolume: item.keyword_info?.search_volume || 0,
          difficulty: item.keyword_properties?.keyword_difficulty || 0,
          cpc: item.keyword_info?.cpc || 0,
          clicks: item.impressions_info?.daily_clicks_count?.value || 0,
          searchIntent: normalizeIntent(item.search_intent_info?.main_intent),
          competition: item.keyword_info?.competition || 0,
        })
      }
    }

    competitorKeywordsMap.set(domain, domainKeywords)

    // Update or add competitor data with rank info
    if (rankResult?.items?.[0]) {
      const rankItem = rankResult.items[0]
      const existing = result.discoveredCompetitors.find(c => c.domain === domain)
      if (existing) {
        existing.rank = rankItem.rank || existing.rank
        existing.organicTraffic = rankItem.organic_traffic || existing.organicTraffic
        existing.keywords = rankItem.organic_keywords || existing.keywords
        existing.commonKeywords = [...domainKeywords].slice(0, 10)
      } else {
        result.discoveredCompetitors.push({
          domain,
          rank: rankItem.rank || 0,
          organicTraffic: rankItem.organic_traffic || 0,
          keywords: rankItem.organic_keywords || 0,
          commonKeywords: [...domainKeywords].slice(0, 10),
        })
      }
    }
  }

  // Step 4: Keyword discovery from multiple sources
  console.log('[SEO Analyzer] Starting keyword discovery...')
  const allSuggestions: KeywordData[] = []
  const seenKeywords = new Set<string>()

  // Primary source: Google Ads keywords_for_site — if we have the user's URL,
  // this is the BEST source. Uses Google's actual Keyword Planner data (same as
  // DataForSEO playground when you enter a URL). Returns highly relevant keywords.
  if (request.targetUrl) {
    const targetDomain = extractDomain(request.targetUrl)
    console.log(`[SEO Analyzer] Getting Google Ads keywords for site: ${targetDomain}`)
    const siteKeywords = await client.getKeywordsForSiteGoogleAds(targetDomain)
    if (siteKeywords && siteKeywords.length > 0) {
      for (const item of siteKeywords) {
        if (item.search_volume > 0 && !seenKeywords.has(item.keyword)) {
          seenKeywords.add(item.keyword)
          allSuggestions.push({
            keyword: item.keyword,
            searchVolume: item.search_volume,
            // Google Ads doesn't return keyword_difficulty — use competition_index as proxy
            difficulty: item.competition_index || 0,
            cpc: item.cpc || 0,
            clicks: 0, // Google Ads endpoint doesn't return click data
            // Google Ads doesn't return search intent — default to commercial
            searchIntent: 'commercial',
            competition: (item.competition_index || 0) / 100,
          })
        }
      }
      console.log(`[SEO Analyzer] Google Ads site keywords found: ${allSuggestions.length}`)
    }
  }

  // Build discovery seeds — prefer AI-generated seeds (customer search terms) over
  // mechanical extraction. AI seeds like "ai writing tool", "ai blog writer" produce
  // much better results than extracted jargon like "ai content generation platform".
  const shortUserKeywords = (request.userKeywords || [])
    .filter(kw => kw.split(/\s+/).length <= 4)
  const discoverySeeds = request.seoSeeds?.length
    ? [...new Set([...request.seoSeeds, ...seedKeywords.slice(0, 5)])].slice(0, 20)
    : [...new Set([...seedKeywords, ...shortUserKeywords])].slice(0, 20)
  console.log(`[SEO Analyzer] Discovery seeds (${request.seoSeeds?.length ? 'AI' : 'extracted'}): ${discoverySeeds.join(', ')}`)

  // If Google Ads returned enough site keywords, skip phrase-match and related-keywords
  // (which tend to produce generic results). But ALWAYS run keyword_ideas — it uses
  // Google Ads category matching and adds diverse, topically relevant keywords.
  const hasGoogleAdsResults = allSuggestions.length >= 30
  if (hasGoogleAdsResults) {
    console.log(`[SEO Analyzer] Google Ads returned ${allSuggestions.length} keywords, skipping phrase-match/related (keeping keyword_ideas)`)
  }

  // Always run keyword_ideas — category-based discovery produces diverse relevant keywords
  const ideas = await client.getKeywordIdeas(discoverySeeds)
  if (ideas?.items) {
    for (const item of ideas.items) {
      const kd = item.keyword_data
      if (kd?.keyword_info?.search_volume > 0 && !seenKeywords.has(kd.keyword)) {
        seenKeywords.add(kd.keyword)
        allSuggestions.push({
          keyword: kd.keyword,
          searchVolume: kd.keyword_info?.search_volume || 0,
          difficulty: kd.keyword_properties?.keyword_difficulty || 0,
          cpc: kd.keyword_info?.cpc || 0,
          clicks: kd.impressions_info?.daily_clicks_count?.value || 0,
          searchIntent: normalizeIntent(kd.search_intent_info?.main_intent),
          competition: kd.keyword_info?.competition || 0,
        })
      }
    }
  }

  // Supplementary 1: keyword_suggestions (phrase-match) — returns high-volume keywords
  // that contain the seed words. This is where keywords like "ai write" (22K vol),
  // "ai writing" (22K vol), "blog post" (8K vol) come from.
  // Use the shortest seeds (2-word phrases) for best phrase-match expansion.
  // NOTE: phrase-match is broad — the AI relevance filter handles removing irrelevant results.
  if (!hasGoogleAdsResults) {
    const shortSeeds = discoverySeeds
      .filter(s => s.split(/\s+/).length <= 2)
      .slice(0, 3)
    console.log(`[SEO Analyzer] Phrase-match seeds: ${shortSeeds.join(', ')}`)

    // Universal API-level filters only — business-specific filtering is now handled
    // by the AI relevance filter after all keywords are collected.
    const phraseMatchFilters: Array<unknown> = [
      ['keyword_info.search_volume', '>', 10],
    ]

    const suggestionResults = await Promise.all(
      shortSeeds.map(seed => client.getKeywordSuggestions(seed, 2840, 'en', phraseMatchFilters))
    )

    for (const suggestions of suggestionResults) {
      if (suggestions?.items) {
        for (const item of suggestions.items) {
          if (item.keyword_info?.search_volume > 0 && !seenKeywords.has(item.keyword)) {
            seenKeywords.add(item.keyword)
            allSuggestions.push({
              keyword: item.keyword,
              searchVolume: item.keyword_info?.search_volume || 0,
              difficulty: item.keyword_properties?.keyword_difficulty || 0,
              cpc: item.keyword_info?.cpc || 0,
              clicks: item.impressions_info?.daily_clicks_count?.value || 0,
              searchIntent: normalizeIntent(item.search_intent_info?.main_intent),
              competition: item.keyword_info?.competition || 0,
            })
          }
        }
      }
    }
  }

  // Supplementary 2: related_keywords — Google's "Searches related to" for semantic expansion
  // Call with up to 2 different seeds for broader coverage
  if (!hasGoogleAdsResults && discoverySeeds.length > 0) {
    // Pick the most specific (longest) seed, plus a second different one if available
    const sorted = [...discoverySeeds].sort((a, b) => b.split(/\s+/).length - a.split(/\s+/).length)
    const relatedSeeds = sorted.slice(0, 2)

    const relatedResults = await Promise.all(
      relatedSeeds.map(seed => client.getRelatedKeywords(seed))
    )

    for (const related of relatedResults) {
      if (related?.items) {
        for (const item of related.items) {
          const allRelated = [item.keyword_data, ...(item.related_keywords?.map(r => r.keyword_data) || [])]
          for (const kd of allRelated) {
            if (kd?.keyword_info?.search_volume > 0 && !seenKeywords.has(kd.keyword)) {
              seenKeywords.add(kd.keyword)
              allSuggestions.push({
                keyword: kd.keyword,
                searchVolume: kd.keyword_info?.search_volume || 0,
                difficulty: kd.keyword_properties?.keyword_difficulty || 0,
                cpc: kd.keyword_info?.cpc || 0,
                clicks: kd.impressions_info?.daily_clicks_count?.value || 0,
                searchIntent: normalizeIntent(kd.search_intent_info?.main_intent),
                competition: kd.keyword_info?.competition || 0,
              })
            }
          }
        }
      }
    }
  }

  // Primary filter: AI-based relevance filtering
  // The AI understands the business context and can distinguish between similar keywords
  // (e.g., "ai content creator" vs "ai content detector" for a content creation business)
  let relevantSuggestions = await filterKeywordsWithAI(
    allSuggestions,
    request.businessDescription || request.description,
    request.industry || '',
    request.companyType
  )
  console.log(`[SEO Analyzer] AI relevance filter: ${relevantSuggestions.length}/${allSuggestions.length} keywords survived`)

  // Fallback: if AI filter returned too few results, try word-overlap filter
  // We need at least ~25 to produce 20 after dedup/diversity
  if (relevantSuggestions.length < 25 && allSuggestions.length > relevantSuggestions.length) {
    console.log(`[SEO Analyzer] AI filter returned too few (${relevantSuggestions.length}), falling back to word-overlap filter`)
    const wordOverlapResults = filterSuggestionsForRelevance(
      allSuggestions,
      discoverySeeds,
      request.industry,
      request.userKeywords
    )
    // Merge: keep AI results + add word-overlap results that AI missed
    if (wordOverlapResults.length > relevantSuggestions.length) {
      const aiKeywords = new Set(relevantSuggestions.map(kw => kw.keyword))
      const additional = wordOverlapResults.filter(kw => !aiKeywords.has(kw.keyword))
      relevantSuggestions = [...relevantSuggestions, ...additional]
      console.log(`[SEO Analyzer] Merged: ${relevantSuggestions.length} keywords (AI + word-overlap)`)
    }
  }

  // Last resort: if still too few, use light filter
  if (relevantSuggestions.length < 15 && allSuggestions.length > relevantSuggestions.length) {
    console.log(`[SEO Analyzer] Still too few keywords (${relevantSuggestions.length}/${allSuggestions.length}), using light filter`)
    relevantSuggestions = allSuggestions.filter(kw => {
      if (kw.searchIntent === 'navigational') return false
      if (kw.searchVolume <= 0) return false
      return true
    })
  }

  // Deduplicate similar keywords and enforce diversity before final selection
  const diverseKeywords = deduplicateAndDiversify(relevantSuggestions)
  console.log(`[SEO Analyzer] After dedup/diversity: ${diverseKeywords.length} keywords (from ${relevantSuggestions.length} filtered)`)

  // Calculate opportunity score for each keyword and sort by it
  for (const kw of diverseKeywords) {
    kw.opportunityScore = calculateOpportunityScore(kw)
  }

  result.suggestedKeywords = diverseKeywords
    .sort((a, b) => (b.opportunityScore ?? 0) - (a.opportunityScore ?? 0))
    .slice(0, 20)

  console.log(`[SEO Analyzer] Final ${result.suggestedKeywords.length} keywords (by opportunity score):`)
  for (const kw of result.suggestedKeywords.slice(0, 5)) {
    console.log(`  ${kw.keyword}: opp=${kw.opportunityScore} vol=${kw.searchVolume} diff=${kw.difficulty} rel=${kw.relevanceScore ?? 'n/a'}`)
  }

  // Step 5: Verify user-provided keywords
  if (request.userKeywords?.length) {
    console.log('[SEO Analyzer] Verifying user keywords...')
    for (const userKw of request.userKeywords.slice(0, 5)) {
      const verification = await client.getKeywordSuggestions(userKw)

      // Look for the user's keyword in suggestions (exact or close match)
      const match = verification?.items?.find(
        item => item.keyword.toLowerCase() === userKw.toLowerCase()
      )

      if (match) {
        const kwData: KeywordData = {
          keyword: match.keyword,
          searchVolume: match.keyword_info?.search_volume || 0,
          difficulty: match.keyword_properties?.keyword_difficulty || 0,
          cpc: match.keyword_info?.cpc || 0,
          clicks: match.impressions_info?.daily_clicks_count?.value || 0,
          searchIntent: normalizeIntent(match.search_intent_info?.main_intent),
          competition: match.keyword_info?.competition || 0,
        }

        result.verifiedUserKeywords.push(kwData)

        // Flag keywords with low click-through relative to volume
        const volume = kwData.searchVolume
        const clicks = kwData.clicks
        if (volume > 100 && clicks < volume * 0.1) {
          // Find alternatives from suggestions
          const alternatives = result.suggestedKeywords
            .filter(sk => sk.clicks > clicks && sk.searchIntent === kwData.searchIntent)
            .slice(0, 3)

          result.flaggedKeywords.push({
            keyword: kwData.keyword,
            reason: `Low click-through rate: ${clicks} clicks for ${volume} monthly searches. Users may find answers directly in search results.`,
            searchVolume: volume,
            actualClicks: clicks,
            suggestedAlternatives: alternatives,
          })
        }
      } else {
        // Keyword not found in DataForSEO - flag as very low volume
        result.flaggedKeywords.push({
          keyword: userKw,
          reason: 'Very low or zero search volume detected.',
          searchVolume: 0,
          actualClicks: 0,
          suggestedAlternatives: result.suggestedKeywords.slice(0, 3),
        })
      }
    }
  }

  // Build content gaps: keywords competitors rank for that overlap with seed topic
  const contentGapMap = new Map<string, { count: number; volumes: number[] }>()

  for (const [, keywords] of competitorKeywordsMap) {
    for (const kw of keywords) {
      const existing = contentGapMap.get(kw)
      // Find volume from allCompetitorKeywords
      const kwInfo = allCompetitorKeywords.find(ck => ck.keyword === kw)
      const vol = kwInfo?.searchVolume || 0

      if (existing) {
        existing.count++
        existing.volumes.push(vol)
      } else {
        contentGapMap.set(kw, { count: 1, volumes: [vol] })
      }
    }
  }

  // Filter to keywords that multiple competitors target (content gaps)
  result.contentGaps = [...contentGapMap.entries()]
    .filter(([, data]) => data.count >= 2)
    .map(([keyword, data]) => ({
      keyword,
      competitorCount: data.count,
      avgVolume: Math.round(data.volumes.reduce((a, b) => a + b, 0) / data.volumes.length),
    }))
    .sort((a, b) => b.avgVolume - a.avgVolume)
    .slice(0, 15)

  // Build search intent breakdown
  const intentCounts: Record<string, number> = {}
  for (const kw of [...result.suggestedKeywords, ...result.verifiedUserKeywords]) {
    intentCounts[kw.searchIntent] = (intentCounts[kw.searchIntent] || 0) + 1
  }
  result.searchIntentBreakdown = intentCounts

  console.log(`[SEO Analyzer] Complete. Session cost: $${client.getTotalCost().toFixed(4)}`)

  return result
}
