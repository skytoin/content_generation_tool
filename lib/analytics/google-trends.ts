/**
 * Google Trends Integration via SerpAPI
 *
 * Google does NOT have an official public Trends API.
 * We use SerpAPI as a reliable third-party provider.
 *
 * To get API credentials:
 * 1. Sign up at https://serpapi.com/
 * 2. Get your API key from the dashboard
 * 3. Set SERPAPI_API_KEY in your environment
 *
 * Pricing: $75-275/month depending on plan
 * See: https://serpapi.com/pricing
 */

import {
  GoogleTrendsData,
  TrendsComparisonResult,
  AnalyticsToolResult,
} from './types'
import { updateToolHealth } from './tool-registry'

const SERPAPI_BASE_URL = 'https://serpapi.com/search'

/**
 * Check if SerpAPI is configured
 */
export function isSerpApiConfigured(): boolean {
  return !!process.env.SERPAPI_API_KEY
}

/**
 * Get API key with clear error
 */
function getApiKey(): string {
  const apiKey = process.env.SERPAPI_API_KEY
  if (!apiKey) {
    throw new Error(
      'SERPAPI_API_KEY is not configured. ' +
      'Google Trends requires SerpAPI. ' +
      'Get your key at https://serpapi.com/ ($75/month minimum)'
    )
  }
  return apiKey
}

/**
 * Check if Google Trends (via SerpAPI) is available
 */
export async function checkTrendsAvailability(): Promise<boolean> {
  if (!isSerpApiConfigured()) {
    updateToolHealth(
      'google-trends',
      'unavailable',
      'SERPAPI_API_KEY not configured. Get key at https://serpapi.com/'
    )
    return false
  }

  try {
    const start = Date.now()
    const apiKey = getApiKey()

    // Test with a simple query
    const url = new URL(SERPAPI_BASE_URL)
    url.searchParams.set('engine', 'google_trends')
    url.searchParams.set('q', 'test')
    url.searchParams.set('api_key', apiKey)
    url.searchParams.set('data_type', 'TIMESERIES')

    const response = await fetch(url.toString(), {
      method: 'GET',
      signal: AbortSignal.timeout(10000),
    })

    const responseTime = Date.now() - start

    if (response.ok) {
      updateToolHealth('google-trends', 'available', undefined, responseTime)
      return true
    }

    const errorData = await response.json().catch(() => ({}))

    if (response.status === 401) {
      updateToolHealth(
        'google-trends',
        'error',
        'SerpAPI authentication failed. Check your API key.'
      )
    } else if (response.status === 429) {
      updateToolHealth(
        'google-trends',
        'rate-limited',
        'SerpAPI rate limit reached. Check your plan limits.'
      )
    } else {
      updateToolHealth(
        'google-trends',
        'error',
        `SerpAPI error: ${errorData.error || response.statusText}`
      )
    }

    return false
  } catch (error) {
    updateToolHealth(
      'google-trends',
      'error',
      `Connection failed: ${error instanceof Error ? error.message : String(error)}`
    )
    return false
  }
}

/**
 * Get trend data for a keyword using SerpAPI
 */
export async function getTrendData(
  keyword: string,
  options: {
    geo?: string // Country code (e.g., 'US')
    timeRange?: 'now 1-H' | 'now 4-H' | 'now 1-d' | 'now 7-d' | 'today 1-m' | 'today 3-m' | 'today 12-m' | 'today 5-y'
  } = {}
): Promise<AnalyticsToolResult<GoogleTrendsData>> {
  // Check configuration first
  if (!isSerpApiConfigured()) {
    return {
      tool: 'google-trends',
      success: false,
      error: 'Google Trends requires SerpAPI. Set SERPAPI_API_KEY in your environment. Get key at https://serpapi.com/',
      timestamp: new Date(),
    }
  }

  try {
    const apiKey = getApiKey()

    // Build SerpAPI request
    const url = new URL(SERPAPI_BASE_URL)
    url.searchParams.set('engine', 'google_trends')
    url.searchParams.set('q', keyword)
    url.searchParams.set('api_key', apiKey)
    url.searchParams.set('data_type', 'TIMESERIES')

    if (options.geo) {
      url.searchParams.set('geo', options.geo)
    }
    if (options.timeRange) {
      url.searchParams.set('date', options.timeRange)
    }

    console.log(`📊 Google Trends: Fetching data for "${keyword}"...`)

    const response = await fetch(url.toString(), {
      method: 'GET',
      signal: AbortSignal.timeout(30000),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.error || response.statusText

      if (response.status === 401) {
        throw new Error('SerpAPI authentication failed. Verify your API key at https://serpapi.com/manage-api-key')
      }
      if (response.status === 429) {
        throw new Error('SerpAPI rate limit exceeded. Check your plan at https://serpapi.com/plan')
      }
      throw new Error(`SerpAPI error: ${errorMessage}`)
    }

    const data = await response.json()

    // Parse SerpAPI response into our format
    const trendsData = parseSerpApiResponse(keyword, data)

    updateToolHealth('google-trends', 'available')

    return {
      tool: 'google-trends',
      success: true,
      data: trendsData,
      cached: false,
      timestamp: new Date(),
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('📊 Google Trends error:', errorMessage)
    updateToolHealth('google-trends', 'error', errorMessage)

    return {
      tool: 'google-trends',
      success: false,
      error: errorMessage,
      timestamp: new Date(),
    }
  }
}

/**
 * Parse SerpAPI Google Trends response into our format
 */
function parseSerpApiResponse(keyword: string, data: any): GoogleTrendsData {
  // Extract interest over time
  const timelineData = data.interest_over_time?.timeline_data || []
  const formattedTimeline = timelineData.map((point: any) => ({
    date: point.date || '',
    value: point.values?.[0]?.extracted_value || 0,
  }))

  // Calculate average interest
  const values = formattedTimeline.map((t: any) => t.value)
  const averageInterest = values.length > 0
    ? Math.round(values.reduce((a: number, b: number) => a + b, 0) / values.length)
    : 0

  // Extract related queries
  const relatedQueries = data.related_queries?.rising || []
  const topQueries = data.related_queries?.top || []
  const formattedQueries = [
    ...relatedQueries.slice(0, 4).map((q: any) => ({
      query: q.query || '',
      type: 'rising' as const,
      value: q.value || 0,
    })),
    ...topQueries.slice(0, 4).map((q: any) => ({
      query: q.query || '',
      type: 'top' as const,
      value: q.value || 0,
    })),
  ]

  // Extract related topics
  const relatedTopics = data.related_topics?.rising || []
  const topTopics = data.related_topics?.top || []
  const formattedTopics = [
    ...relatedTopics.slice(0, 4).map((t: any) => ({
      topic: t.topic?.title || '',
      type: 'rising' as const,
      value: t.value || 0,
    })),
    ...topTopics.slice(0, 4).map((t: any) => ({
      topic: t.topic?.title || '',
      type: 'top' as const,
      value: t.value || 0,
    })),
  ]

  return {
    keyword,
    interest: averageInterest,
    relatedTopics: formattedTopics,
    relatedQueries: formattedQueries,
    timelineData: formattedTimeline,
  }
}

/**
 * Compare multiple keywords for trend analysis
 */
export async function compareTrends(
  keywords: string[],
  options: {
    geo?: string
    timeRange?: 'now 1-H' | 'now 4-H' | 'now 1-d' | 'now 7-d' | 'today 1-m' | 'today 3-m' | 'today 12-m' | 'today 5-y'
  } = {}
): Promise<AnalyticsToolResult<TrendsComparisonResult>> {
  if (!isSerpApiConfigured()) {
    return {
      tool: 'google-trends',
      success: false,
      error: 'Google Trends requires SerpAPI. Set SERPAPI_API_KEY in your environment.',
      timestamp: new Date(),
    }
  }

  try {
    if (keywords.length < 2) {
      throw new Error('At least 2 keywords required for comparison')
    }

    if (keywords.length > 5) {
      keywords = keywords.slice(0, 5) // SerpAPI limits to 5
    }

    const apiKey = getApiKey()

    // SerpAPI allows comparing multiple keywords in one request
    const url = new URL(SERPAPI_BASE_URL)
    url.searchParams.set('engine', 'google_trends')
    url.searchParams.set('q', keywords.join(','))
    url.searchParams.set('api_key', apiKey)
    url.searchParams.set('data_type', 'TIMESERIES')

    if (options.geo) {
      url.searchParams.set('geo', options.geo)
    }
    if (options.timeRange) {
      url.searchParams.set('date', options.timeRange)
    }

    console.log(`📊 Google Trends: Comparing "${keywords.join('" vs "')}"...`)

    const response = await fetch(url.toString(), {
      method: 'GET',
      signal: AbortSignal.timeout(30000),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`SerpAPI error: ${errorData.error || response.statusText}`)
    }

    const data = await response.json()

    // Parse comparison data
    const comparison = parseComparisonResponse(keywords, data)

    return {
      tool: 'google-trends',
      success: true,
      data: comparison,
      timestamp: new Date(),
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('📊 Google Trends comparison error:', errorMessage)

    return {
      tool: 'google-trends',
      success: false,
      error: errorMessage,
      timestamp: new Date(),
    }
  }
}

/**
 * Parse comparison response from SerpAPI
 */
function parseComparisonResponse(keywords: string[], data: any): TrendsComparisonResult {
  const timelineData = data.interest_over_time?.timeline_data || []

  const comparison = keywords.map((keyword, index) => {
    const values = timelineData.map((point: any) =>
      point.values?.[index]?.extracted_value || 0
    )

    const avgInterest = values.length > 0
      ? Math.round(values.reduce((a: number, b: number) => a + b, 0) / values.length)
      : 0
    const peakInterest = values.length > 0 ? Math.max(...values) : 0

    // Determine trend direction
    let trend: 'rising' | 'stable' | 'declining' = 'stable'
    if (values.length >= 4) {
      const recent = values.slice(-2).reduce((a: number, b: number) => a + b, 0) / 2
      const earlier = values.slice(0, 2).reduce((a: number, b: number) => a + b, 0) / 2
      if (recent > earlier * 1.2) trend = 'rising'
      else if (recent < earlier * 0.8) trend = 'declining'
    }

    return {
      keyword,
      averageInterest: avgInterest,
      peakInterest,
      trend,
    }
  })

  // Find winner
  const winner = comparison.reduce((a, b) =>
    a.averageInterest > b.averageInterest ? a : b
  ).keyword

  // Generate insights
  const insights = generateTrendInsights(comparison)

  return {
    keywords,
    comparison,
    winner,
    insights,
  }
}

/**
 * Generate human-readable insights from trend comparison
 */
function generateTrendInsights(
  comparison: Array<{
    keyword: string
    averageInterest: number
    peakInterest: number
    trend: 'rising' | 'stable' | 'declining'
  }>
): string[] {
  const insights: string[] = []

  // Winner insight
  const winner = comparison.reduce((a, b) =>
    a.averageInterest > b.averageInterest ? a : b
  )
  insights.push(
    `"${winner.keyword}" has the highest search interest (${winner.averageInterest}/100 avg)`
  )

  // Rising trends
  const rising = comparison.filter(c => c.trend === 'rising')
  if (rising.length > 0) {
    insights.push(
      `📈 Rising interest: ${rising.map(r => `"${r.keyword}"`).join(', ')}`
    )
  }

  // Declining trends warning
  const declining = comparison.filter(c => c.trend === 'declining')
  if (declining.length > 0) {
    insights.push(
      `📉 Declining interest: ${declining.map(d => `"${d.keyword}"`).join(', ')}`
    )
  }

  // Competitive insight
  const sorted = [...comparison].sort((a, b) => b.averageInterest - a.averageInterest)
  if (sorted.length >= 2) {
    const diff = sorted[0].averageInterest - sorted[1].averageInterest
    if (diff < 10) {
      insights.push(
        `"${sorted[0].keyword}" and "${sorted[1].keyword}" have similar popularity - consider testing both`
      )
    }
  }

  return insights
}

/**
 * Get related keywords for content ideation
 */
export async function getRelatedKeywords(
  keyword: string
): Promise<AnalyticsToolResult<string[]>> {
  const trendData = await getTrendData(keyword)

  if (!trendData.success || !trendData.data) {
    return {
      tool: 'google-trends',
      success: false,
      error: trendData.error || 'Failed to get trend data',
      timestamp: new Date(),
    }
  }

  const related = [
    ...trendData.data.relatedQueries.map(q => q.query),
    ...trendData.data.relatedTopics.map(t => t.topic),
  ].filter(Boolean)

  // Remove duplicates
  const uniqueKeywords = [...new Set(related)]

  return {
    tool: 'google-trends',
    success: true,
    data: uniqueKeywords,
    timestamp: new Date(),
  }
}
