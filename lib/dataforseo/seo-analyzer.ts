/**
 * SEO Analyzer - Intelligence Layer
 *
 * Uses DataForSEO to provide keyword research, competitor analysis,
 * content gap identification, and search intent mapping.
 * Gracefully degrades when DataForSEO is not configured.
 */

import { DataForSEOClient } from './client'

// --- Public Types ---

export interface SEOAnalysisRequest {
  description: string
  industry?: string
  goals?: string
  competitorUrls?: string[]
  userKeywords?: string[]
  targetUrl?: string
  companyName?: string
}

export interface KeywordData {
  keyword: string
  searchVolume: number
  difficulty: number
  cpc: number
  clicks: number
  searchIntent: 'informational' | 'navigational' | 'commercial' | 'transactional'
  competition: number
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
  const text = description.toLowerCase().replace(/[^\w\s-]/g, ' ')
  const words = text.split(/\s+/).filter(w => w.length > 2)
  const businessWords = words.filter(
    w => !stopWords.has(w) && !goalStopWords.has(w)
  )

  // Step 2: Build 2-word phrases from adjacent business words (HIGHEST VALUE — goes first)
  const descriptionKeywords: string[] = []
  for (let i = 0; i < words.length - 1; i++) {
    const w1 = words[i]
    const w2 = words[i + 1]
    if (!stopWords.has(w1) && !goalStopWords.has(w1) &&
        !stopWords.has(w2) && !goalStopWords.has(w2) &&
        w1.length > 2 && w2.length > 2) {
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
    'preparation', 'management', 'consulting', 'solutions', 'strategies',
    'planning', 'guide', 'tips', 'advice', 'help', 'resources',
    'document', 'documents', 'legal', 'individual', 'personal',
    'exam', 'civil', 'people', 'outsourcing', 'outsourced',
  ])

  // Build topic words from seeds, industry, and user keywords
  const topicWords = new Set<string>()
  const allSources = [...seedKeywords, ...(userKeywords || [])]
  if (industry) allSources.push(industry)

  for (const phrase of allSources) {
    for (const word of phrase.toLowerCase().split(/\s+/)) {
      if (word.length > 2 && !genericWords.has(word)) {
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

  // Step 4: Get keyword suggestions from seed keywords (top 3 for cost efficiency)
  console.log('[SEO Analyzer] Getting keyword suggestions...')
  const allSuggestions: KeywordData[] = []
  const seenKeywords = new Set<string>()

  for (const seedKw of seedKeywords.slice(0, 3)) {
    const suggestions = await client.getKeywordSuggestions(seedKw)
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

  // Filter suggestions for relevance to the actual industry/topic
  // DataForSEO often returns unrelated high-volume keywords that share a generic word
  // (e.g., "postal service" when seed was "financial services" — both contain "service")
  const relevantSuggestions = filterSuggestionsForRelevance(
    allSuggestions,
    seedKeywords,
    request.industry,
    request.userKeywords
  )

  result.suggestedKeywords = relevantSuggestions
    .sort((a, b) => b.searchVolume - a.searchVolume)
    .slice(0, 20)

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
