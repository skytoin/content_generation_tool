/**
 * DataForSEO REST Client
 *
 * Thin wrapper around the DataForSEO v3 API.
 * Uses Basic Auth, POST-only endpoints, and includes
 * in-memory caching with TTL and cost tracking.
 */

const BASE_URL = 'https://api.dataforseo.com/v3'

// Cache TTLs
const KEYWORD_CACHE_TTL = 6 * 60 * 60 * 1000   // 6 hours
const DOMAIN_CACHE_TTL = 24 * 60 * 60 * 1000    // 24 hours

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

interface DataForSEOResponse<T = unknown> {
  version: string
  status_code: number
  status_message: string
  time: string
  cost: number
  tasks_count: number
  tasks_error: number
  tasks: Array<{
    id: string
    status_code: number
    status_message: string
    time: string
    cost: number
    result_count: number
    path: string[]
    data: unknown
    result: Array<T>
  }>
}

export class DataForSEOClient {
  private authHeader: string
  private cache = new Map<string, CacheEntry<unknown>>()
  private totalCost = 0

  constructor() {
    const login = process.env.DATAFORSEO_LOGIN
    const password = process.env.DATAFORSEO_PASSWORD

    if (!login || !password) {
      throw new Error('DataForSEO credentials not configured: DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD required')
    }

    this.authHeader = 'Basic ' + Buffer.from(`${login}:${password}`).toString('base64')
  }

  /**
   * POST to a DataForSEO v3 endpoint.
   * All endpoints accept an array of task objects.
   */
  async post<T = unknown>(
    endpoint: string,
    data: Record<string, unknown>,
    cacheTtl?: number
  ): Promise<T | null> {
    // Check cache
    const cacheKey = `${endpoint}:${JSON.stringify(data)}`
    const cached = this.getFromCache<T>(cacheKey)
    if (cached !== null) {
      console.log(`[DataForSEO] Cache hit: ${endpoint}`)
      return cached
    }

    try {
      const response = await fetch(`${BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': this.authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([data]),
      })

      if (!response.ok) {
        console.error(`[DataForSEO] HTTP ${response.status}: ${response.statusText}`)
        return null
      }

      const json = (await response.json()) as DataForSEOResponse<T>

      // Track cost
      if (json.tasks?.[0]?.cost) {
        this.totalCost += json.tasks[0].cost
        console.log(`[DataForSEO] Cost: $${json.tasks[0].cost.toFixed(4)} (total: $${this.totalCost.toFixed(4)})`)
      }

      // Check for task-level errors
      if (json.tasks?.[0]?.status_code !== 20000) {
        console.error(`[DataForSEO] Task error: ${json.tasks?.[0]?.status_message}`)
        return null
      }

      const result = json.tasks?.[0]?.result?.[0] ?? null
      if (result === null) return null

      // Cache the result
      if (cacheTtl) {
        this.setCache(cacheKey, result, cacheTtl)
      }

      return result
    } catch (error) {
      console.error(`[DataForSEO] Request failed for ${endpoint}:`, error)
      return null
    }
  }

  /** Get keyword suggestions with search volume, clicks, and intent (phrase-match expansion) */
  async getKeywordSuggestions(
    keyword: string,
    locationCode = 2840,  // US
    languageCode = 'en',
    filters?: Array<unknown>
  ) {
    return this.post<KeywordSuggestionsResult>(
      'dataforseo_labs/google/keyword_suggestions/live',
      {
        keyword,
        location_code: locationCode,
        language_code: languageCode,
        include_clickstream_data: true,
        limit: 50,
        ...(filters && { filters }),
      },
      KEYWORD_CACHE_TTL
    )
  }

  /**
   * Get keyword ideas using Google Ads category-based relevance matching.
   * Unlike keyword_suggestions (phrase-match), this finds keywords in the SAME
   * product/service category as the seeds — much more topically relevant.
   * Accepts up to 200 seed keywords in a single call.
   */
  async getKeywordIdeas(
    keywords: string[],
    locationCode = 2840,
    languageCode = 'en'
  ) {
    return this.post<KeywordIdeasResult>(
      'dataforseo_labs/google/keyword_ideas/live',
      {
        keywords: keywords.slice(0, 20), // Keep cost reasonable
        location_code: locationCode,
        language_code: languageCode,
        include_clickstream_data: true,
        limit: 100,
        // Exclude navigational intent and very low volume at the API level
        filters: [
          ['search_intent_info.main_intent', '<>', 'navigational'],
          'and',
          ['keyword_info.search_volume', '>', 10],
        ],
        order_by: ['keyword_info.search_volume,desc'],
      },
      KEYWORD_CACHE_TTL
    )
  }

  /**
   * Get semantically related keywords based on Google's "Searches related to" feature.
   * Uses depth-first crawling of Google's related searches graph.
   * More expensive at higher depths but produces topically coherent results.
   */
  async getRelatedKeywords(
    keyword: string,
    locationCode = 2840,
    languageCode = 'en'
  ) {
    return this.post<RelatedKeywordsResult>(
      'dataforseo_labs/google/related_keywords/live',
      {
        keyword,
        location_code: locationCode,
        language_code: languageCode,
        include_clickstream_data: true,
        depth: 1, // ~8 results, good balance of cost and relevance
        limit: 40,
      },
      KEYWORD_CACHE_TTL
    )
  }

  /** Get keywords that a specific domain ranks for or is relevant to */
  async getKeywordsForSite(
    target: string,
    locationCode = 2840,
    languageCode = 'en',
    limit = 100
  ) {
    return this.post<KeywordsForSiteResult>(
      'dataforseo_labs/google/keywords_for_site/live',
      {
        target,
        location_code: locationCode,
        language_code: languageCode,
        include_clickstream_data: true,
        limit,
      },
      KEYWORD_CACHE_TTL
    )
  }

  /** Get domain rank overview */
  async getDomainRankOverview(
    target: string,
    locationCode = 2840,
    languageCode = 'en'
  ) {
    return this.post<DomainRankResult>(
      'dataforseo_labs/google/domain_rank_overview/live',
      {
        target,
        location_code: locationCode,
        language_code: languageCode,
      },
      DOMAIN_CACHE_TTL
    )
  }

  /** Auto-discover competitors for a given domain */
  async getCompetitorsDomain(
    target: string,
    locationCode = 2840,
    languageCode = 'en'
  ) {
    return this.post<CompetitorsDomainResult>(
      'dataforseo_labs/google/competitors_domain/live',
      {
        target,
        location_code: locationCode,
        language_code: languageCode,
        limit: 10,
      },
      DOMAIN_CACHE_TTL
    )
  }

  /** Discover competitors by searching Google for a keyword and extracting top-ranking domains */
  async discoverCompetitorsFromKeyword(
    keyword: string,
    locationCode = 2840,
    languageCode = 'en'
  ) {
    return this.post<SerpOrganicResult>(
      'serp/google/organic/live/advanced',
      {
        keyword,
        location_code: locationCode,
        language_code: languageCode,
        depth: 10,
        device: 'desktop',
      },
      DOMAIN_CACHE_TTL
    )
  }

  /**
   * Get keywords for a site using Google Ads Keyword Planner data.
   * This is the SAME endpoint that DataForSEO's playground uses when you enter a URL.
   * Returns much better results than the DataForSEO Labs version because it uses
   * Google's actual keyword planner relevance matching.
   *
   * Path: keywords_data/google_ads/keywords_for_site/live
   * (NOT dataforseo_labs/google/keywords_for_site/live)
   *
   * NOTE: This endpoint returns results as a flat array in `result[]`,
   * not wrapped in `{ items: [...] }` like Labs endpoints. Uses postArray().
   */
  async getKeywordsForSiteGoogleAds(
    target: string,
    locationCode = 2840,
    languageCode = 'en',
    limit = 200
  ) {
    return this.postArray<GoogleAdsKeywordsForSiteResult>(
      'keywords_data/google_ads/keywords_for_site/live',
      {
        target,
        location_code: locationCode,
        language_code: languageCode,
        sort_by: 'search_volume',
        limit,
      },
      KEYWORD_CACHE_TTL
    )
  }

  /** Get total API cost for this session */
  getTotalCost(): number {
    return this.totalCost
  }

  /**
   * POST to a DataForSEO endpoint that returns results as a flat array.
   * Google Ads endpoints (keywords_data/) return `result: [item, item, ...]`
   * instead of the Labs pattern `result: [{ items: [...] }]`.
   */
  async postArray<T = unknown>(
    endpoint: string,
    data: Record<string, unknown>,
    cacheTtl?: number
  ): Promise<T[] | null> {
    const cacheKey = `${endpoint}:${JSON.stringify(data)}`
    const cached = this.getFromCache<T[]>(cacheKey)
    if (cached !== null) {
      console.log(`[DataForSEO] Cache hit: ${endpoint}`)
      return cached
    }

    try {
      const response = await fetch(`${BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': this.authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([data]),
      })

      if (!response.ok) {
        console.error(`[DataForSEO] HTTP ${response.status}: ${response.statusText}`)
        return null
      }

      const json = (await response.json()) as DataForSEOResponse<T>

      if (json.tasks?.[0]?.cost) {
        this.totalCost += json.tasks[0].cost
        console.log(`[DataForSEO] Cost: $${json.tasks[0].cost.toFixed(4)} (total: $${this.totalCost.toFixed(4)})`)
      }

      if (json.tasks?.[0]?.status_code !== 20000) {
        console.error(`[DataForSEO] Task error: ${json.tasks?.[0]?.status_message}`)
        return null
      }

      const result = (json.tasks?.[0]?.result as T[]) ?? null
      if (!result || result.length === 0) return null

      if (cacheTtl) {
        this.setCache(cacheKey, result, cacheTtl)
      }

      return result
    } catch (error) {
      console.error(`[DataForSEO] Request failed for ${endpoint}:`, error)
      return null
    }
  }

  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined
    if (!entry) return null
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }
    return entry.data
  }

  private setCache<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, { data, expiresAt: Date.now() + ttl })
  }
}

// DataForSEO API response types (subset of fields we use)

interface KeywordSuggestionsResult {
  seed_keywords: string[]
  items_count: number
  items: Array<{
    keyword: string
    keyword_info: {
      search_volume: number
      competition: number
      competition_level: string
      cpc: number
      monthly_searches: Array<{ year: number; month: number; search_volume: number }>
    }
    clickstream_keyword_info?: {
      search_volume: number
      gender_distribution?: { male: number; female: number }
    }
    keyword_properties?: {
      keyword_difficulty: number
    }
    search_intent_info?: {
      main_intent: string
      foreign_intent: string[]
    }
    impressions_info?: {
      monthly_impressions_count?: { value: number }
      daily_clicks_count?: { value: number }
    }
  }>
}

interface KeywordsForSiteResult {
  target: string
  items_count: number
  items: Array<{
    keyword: string
    keyword_info: {
      search_volume: number
      competition: number
      cpc: number
    }
    keyword_properties?: {
      keyword_difficulty: number
    }
    search_intent_info?: {
      main_intent: string
    }
    impressions_info?: {
      daily_clicks_count?: { value: number }
    }
  }>
}

interface DomainRankResult {
  target: string
  items_count: number
  items: Array<{
    domain: string
    rank: number
    organic_traffic: number
    organic_keywords: number
    estimated_paid_traffic_cost: number
  }>
}

interface CompetitorsDomainResult {
  items_count: number
  items: Array<{
    domain: string
    avg_position: number
    sum_position: number
    intersections: number
    full_domain_metrics: {
      organic_traffic: number
      organic_keywords: number
      rank: number
    }
  }>
}

// keyword_ideas endpoint: keyword data is nested under keyword_data
interface KeywordIdeasResult {
  seed_keywords: string[]
  items_count: number
  items: Array<{
    keyword_data: {
      keyword: string
      keyword_info: {
        search_volume: number
        competition: number
        competition_level: string
        cpc: number
        monthly_searches: Array<{ year: number; month: number; search_volume: number }>
      }
      clickstream_keyword_info?: {
        search_volume: number
      }
      keyword_properties?: {
        keyword_difficulty: number
      }
      search_intent_info?: {
        main_intent: string
        foreign_intent: string[]
      }
      impressions_info?: {
        monthly_impressions_count?: { value: number }
        daily_clicks_count?: { value: number }
      }
    }
  }>
}

// related_keywords endpoint: items contain keyword_data + related_keywords array
interface RelatedKeywordsResult {
  seed_keyword: string
  items_count: number
  items: Array<{
    keyword_data: {
      keyword: string
      keyword_info: {
        search_volume: number
        competition: number
        cpc: number
      }
      keyword_properties?: {
        keyword_difficulty: number
      }
      search_intent_info?: {
        main_intent: string
      }
      impressions_info?: {
        daily_clicks_count?: { value: number }
      }
    }
    related_keywords?: Array<{
      keyword_data: {
        keyword: string
        keyword_info: {
          search_volume: number
          competition: number
          cpc: number
        }
        keyword_properties?: {
          keyword_difficulty: number
        }
        search_intent_info?: {
          main_intent: string
        }
        impressions_info?: {
          daily_clicks_count?: { value: number }
        }
      }
    }>
  }>
}

interface SerpOrganicResult {
  keyword: string
  check_url: string
  datetime: string
  items_count: number
  items: Array<{
    type: string
    domain: string
    url: string
    title: string
    description: string
    position: number
    rank_group: number
    rank_absolute: number
  }>
}

// Google Ads keywords_for_site — flat structure (no nesting under keyword_info)
// This is the endpoint the DataForSEO playground uses when you give it a URL
interface GoogleAdsKeywordsForSiteResult {
  keyword: string
  location_code: number
  language_code: string
  search_partners: boolean
  competition: string  // "LOW", "MEDIUM", "HIGH"
  competition_index: number  // 0-100
  search_volume: number
  cpc: number
  low_top_of_page_bid: number
  high_top_of_page_bid: number
  monthly_searches: Array<{ year: number; month: number; search_volume: number }>
  keyword_annotations?: {
    concepts?: Array<{
      name: string
      concept_group?: { name: string; type: string }
    }>
  }
}

export type {
  KeywordSuggestionsResult,
  KeywordIdeasResult,
  RelatedKeywordsResult,
  KeywordsForSiteResult,
  DomainRankResult,
  CompetitorsDomainResult,
  SerpOrganicResult,
  GoogleAdsKeywordsForSiteResult,
}
