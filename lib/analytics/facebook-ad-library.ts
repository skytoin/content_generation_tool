/**
 * Facebook Ad Library API Client
 *
 * Provides competitor ad research through Meta's Ad Library API.
 *
 * To get API credentials:
 * 1. Create app at https://developers.facebook.com/apps/
 * 2. Complete ID verification (required)
 * 3. Generate access token at https://developers.facebook.com/tools/explorer/
 * 4. Extend token to 3 months for longevity
 *
 * Environment variable required: FACEBOOK_ACCESS_TOKEN
 *
 * See: docs/ANALYTICS_TOOLS_SETUP.md for detailed setup instructions
 */

import { AnalyticsToolResult } from './types'
import { updateToolHealth } from './tool-registry'

const GRAPH_API_BASE = 'https://graph.facebook.com/v18.0'

export interface FacebookAd {
  id: string
  ad_creation_time: string
  ad_creative_bodies?: string[]
  ad_creative_link_captions?: string[]
  ad_creative_link_descriptions?: string[]
  ad_creative_link_titles?: string[]
  ad_delivery_start_time?: string
  ad_delivery_stop_time?: string
  ad_snapshot_url?: string
  page_id: string
  page_name: string
  publisher_platforms?: string[]
  spend?: {
    lower_bound: string
    upper_bound: string
  }
  impressions?: {
    lower_bound: string
    upper_bound: string
  }
}

export interface AdLibrarySearchResult {
  ads: FacebookAd[]
  totalCount: number
  hasMore: boolean
}

export interface AdLibraryAnalysis {
  competitorName: string
  totalAds: number
  activeAds: number
  platforms: string[]
  topCreatives: Array<{
    headline: string
    body: string
    callToAction?: string
  }>
  spendRange?: {
    min: number
    max: number
  }
  commonThemes: string[]
  insights: string[]
}

/**
 * Check if Facebook Ad Library API is configured
 */
export function isFacebookAdLibraryConfigured(): boolean {
  return !!process.env.FACEBOOK_ACCESS_TOKEN
}

/**
 * Get access token with clear error
 */
function getAccessToken(): string {
  const token = process.env.FACEBOOK_ACCESS_TOKEN
  if (!token) {
    throw new Error(
      'FACEBOOK_ACCESS_TOKEN is not configured. ' +
      'Get your token at https://developers.facebook.com/tools/explorer/ ' +
      '(ID verification required). See docs/ANALYTICS_TOOLS_SETUP.md'
    )
  }
  return token
}

/**
 * Check if Facebook Ad Library API is available
 */
export async function checkFacebookAdLibraryAvailability(): Promise<boolean> {
  if (!isFacebookAdLibraryConfigured()) {
    updateToolHealth(
      'facebook-ad-library',
      'unavailable',
      'FACEBOOK_ACCESS_TOKEN not configured. See docs/ANALYTICS_TOOLS_SETUP.md'
    )
    return false
  }

  try {
    const start = Date.now()
    const token = getAccessToken()

    // Test with a simple search
    const url = new URL(`${GRAPH_API_BASE}/ads_archive`)
    url.searchParams.set('access_token', token)
    url.searchParams.set('ad_reached_countries', 'US')
    url.searchParams.set('search_terms', 'test')
    url.searchParams.set('limit', '1')
    url.searchParams.set('fields', 'id')

    const response = await fetch(url.toString(), {
      method: 'GET',
      signal: AbortSignal.timeout(10000),
    })

    const responseTime = Date.now() - start

    if (response.ok) {
      updateToolHealth('facebook-ad-library', 'available', undefined, responseTime)
      return true
    }

    const errorData = await response.json().catch(() => ({}))

    if (response.status === 400 && errorData.error?.code === 190) {
      updateToolHealth(
        'facebook-ad-library',
        'error',
        'Access token expired. Generate a new token at https://developers.facebook.com/tools/explorer/'
      )
    } else if (response.status === 400 && errorData.error?.code === 10) {
      updateToolHealth(
        'facebook-ad-library',
        'error',
        'ID verification required. Complete verification in your Facebook Developer account.'
      )
    } else if (response.status === 429) {
      updateToolHealth(
        'facebook-ad-library',
        'rate-limited',
        'Rate limit reached. Try again later.'
      )
    } else {
      updateToolHealth(
        'facebook-ad-library',
        'error',
        `API error: ${errorData.error?.message || response.statusText}`
      )
    }

    return false
  } catch (error) {
    updateToolHealth(
      'facebook-ad-library',
      'error',
      `Connection failed: ${error instanceof Error ? error.message : String(error)}`
    )
    return false
  }
}

/**
 * Search ads by keyword or page name
 */
export async function searchAds(
  searchTerm: string,
  options: {
    country?: string
    limit?: number
    adType?: 'ALL' | 'POLITICAL_AND_ISSUE_ADS'
  } = {}
): Promise<AnalyticsToolResult<AdLibrarySearchResult>> {
  if (!isFacebookAdLibraryConfigured()) {
    return {
      tool: 'facebook-ad-library',
      success: false,
      error: 'Facebook Ad Library requires access token. See docs/ANALYTICS_TOOLS_SETUP.md',
      timestamp: new Date(),
    }
  }

  try {
    const token = getAccessToken()
    const country = options.country || 'US'
    const limit = options.limit || 25

    const url = new URL(`${GRAPH_API_BASE}/ads_archive`)
    url.searchParams.set('access_token', token)
    url.searchParams.set('ad_reached_countries', country)
    url.searchParams.set('search_terms', searchTerm)
    url.searchParams.set('limit', String(limit))
    url.searchParams.set('ad_type', options.adType || 'ALL')
    url.searchParams.set('fields', [
      'id',
      'ad_creation_time',
      'ad_creative_bodies',
      'ad_creative_link_captions',
      'ad_creative_link_descriptions',
      'ad_creative_link_titles',
      'ad_delivery_start_time',
      'ad_delivery_stop_time',
      'ad_snapshot_url',
      'page_id',
      'page_name',
      'publisher_platforms',
      'spend',
      'impressions',
    ].join(','))

    console.log(`📢 Facebook Ad Library: Searching for "${searchTerm}"...`)

    const response = await fetch(url.toString(), {
      method: 'GET',
      signal: AbortSignal.timeout(30000),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.error?.message || response.statusText

      if (errorData.error?.code === 190) {
        throw new Error('Access token expired. Generate new token at https://developers.facebook.com/tools/explorer/')
      }
      throw new Error(`Facebook API error: ${errorMessage}`)
    }

    const data = await response.json()

    updateToolHealth('facebook-ad-library', 'available')

    return {
      tool: 'facebook-ad-library',
      success: true,
      data: {
        ads: data.data || [],
        totalCount: data.data?.length || 0,
        hasMore: !!data.paging?.next,
      },
      timestamp: new Date(),
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('📢 Facebook Ad Library error:', errorMessage)
    updateToolHealth('facebook-ad-library', 'error', errorMessage)

    return {
      tool: 'facebook-ad-library',
      success: false,
      error: errorMessage,
      timestamp: new Date(),
    }
  }
}

/**
 * Analyze competitor's ad strategy
 */
export async function analyzeCompetitorAds(
  competitorName: string,
  options: {
    country?: string
    limit?: number
  } = {}
): Promise<AnalyticsToolResult<AdLibraryAnalysis>> {
  const searchResult = await searchAds(competitorName, {
    country: options.country,
    limit: options.limit || 50,
  })

  if (!searchResult.success || !searchResult.data) {
    return {
      tool: 'facebook-ad-library',
      success: false,
      error: searchResult.error || 'Failed to fetch ads',
      timestamp: new Date(),
    }
  }

  const ads = searchResult.data.ads

  if (ads.length === 0) {
    return {
      tool: 'facebook-ad-library',
      success: true,
      data: {
        competitorName,
        totalAds: 0,
        activeAds: 0,
        platforms: [],
        topCreatives: [],
        commonThemes: [],
        insights: [`No ads found for "${competitorName}". Try a different search term or check spelling.`],
      },
      timestamp: new Date(),
    }
  }

  // Count active ads (no stop time or stop time in future)
  const now = new Date()
  const activeAds = ads.filter(ad => {
    if (!ad.ad_delivery_stop_time) return true
    return new Date(ad.ad_delivery_stop_time) > now
  }).length

  // Get unique platforms
  const platforms = [...new Set(
    ads.flatMap(ad => ad.publisher_platforms || [])
  )]

  // Extract top creatives
  const topCreatives = ads.slice(0, 5).map(ad => ({
    headline: ad.ad_creative_link_titles?.[0] || '',
    body: ad.ad_creative_bodies?.[0] || '',
    callToAction: ad.ad_creative_link_captions?.[0],
  })).filter(c => c.headline || c.body)

  // Calculate spend range
  let spendRange: { min: number; max: number } | undefined
  const spends = ads
    .filter(ad => ad.spend)
    .map(ad => ({
      lower: parseInt(ad.spend!.lower_bound) || 0,
      upper: parseInt(ad.spend!.upper_bound) || 0,
    }))

  if (spends.length > 0) {
    spendRange = {
      min: Math.min(...spends.map(s => s.lower)),
      max: Math.max(...spends.map(s => s.upper)),
    }
  }

  // Extract common themes from ad copy
  const allText = ads
    .flatMap(ad => [
      ...(ad.ad_creative_bodies || []),
      ...(ad.ad_creative_link_titles || []),
    ])
    .join(' ')
    .toLowerCase()

  const commonThemes = extractCommonThemes(allText)

  // Generate insights
  const insights = generateAdInsights(ads, activeAds, platforms, spendRange)

  return {
    tool: 'facebook-ad-library',
    success: true,
    data: {
      competitorName,
      totalAds: ads.length,
      activeAds,
      platforms,
      topCreatives,
      spendRange,
      commonThemes,
      insights,
    },
    timestamp: new Date(),
  }
}

/**
 * Extract common themes from ad copy
 */
function extractCommonThemes(text: string): string[] {
  const themes: string[] = []

  // Common marketing themes to look for
  const themePatterns: Record<string, RegExp> = {
    'Urgency/Scarcity': /limited|hurry|last chance|ends soon|only \d+|don't miss/i,
    'Social Proof': /trusted by|customers|reviews|rated|awards|featured/i,
    'Free Offer': /free|no cost|complimentary|bonus/i,
    'Discount': /\d+% off|save|discount|deal|sale/i,
    'Money-back Guarantee': /guarantee|risk.?free|refund/i,
    'Problem-Solution': /struggling|tired of|finally|solution/i,
    'Benefits Focus': /get|achieve|transform|improve|boost/i,
    'Questions': /\?|are you|do you|want to/i,
  }

  for (const [theme, pattern] of Object.entries(themePatterns)) {
    if (pattern.test(text)) {
      themes.push(theme)
    }
  }

  return themes
}

/**
 * Generate insights from ad analysis
 */
function generateAdInsights(
  ads: FacebookAd[],
  activeAds: number,
  platforms: string[],
  spendRange?: { min: number; max: number }
): string[] {
  const insights: string[] = []

  // Activity level
  if (activeAds === 0) {
    insights.push('⚠️ No currently active ads - competitor may have paused campaigns')
  } else if (activeAds > 10) {
    insights.push(`🔥 Very active advertiser with ${activeAds} running ads`)
  } else {
    insights.push(`📊 ${activeAds} active ads currently running`)
  }

  // Platform strategy
  if (platforms.includes('facebook') && platforms.includes('instagram')) {
    insights.push('📱 Running cross-platform campaigns on Facebook & Instagram')
  } else if (platforms.includes('instagram')) {
    insights.push('📸 Focused primarily on Instagram')
  } else if (platforms.includes('facebook')) {
    insights.push('👥 Focused primarily on Facebook')
  }

  // Spend insights
  if (spendRange) {
    if (spendRange.max > 10000) {
      insights.push(`💰 High ad spend: $${spendRange.min.toLocaleString()}-$${spendRange.max.toLocaleString()}`)
    } else if (spendRange.max > 1000) {
      insights.push(`💵 Moderate ad spend: $${spendRange.min.toLocaleString()}-$${spendRange.max.toLocaleString()}`)
    } else {
      insights.push(`📉 Low ad spend: $${spendRange.min}-$${spendRange.max}`)
    }
  }

  // Volume insights
  if (ads.length >= 50) {
    insights.push('📈 High volume of ads - likely testing many creatives')
  }

  return insights
}
