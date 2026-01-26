/**
 * RiteTag API Client
 *
 * Provides real-time hashtag data for Instagram content optimization.
 * API Documentation: https://github.com/RiteKit/api-docs
 *
 * To get API credentials:
 * 1. Sign up at https://ritekit.com
 * 2. Go to Developer Dashboard
 * 3. Click "Create a token"
 * 4. Get your Client ID
 *
 * Environment variable required: RITEKIT_CLIENT_ID
 */

const RITETAG_BASE_URL = 'https://api.ritekit.com/v1'

export interface RiteTagHashtag {
  hashtag: string
  tag: string
  tweets: number        // Posts per hour
  exposure: number      // Potential reach
  retweets: number      // Engagement indicator
  images: number        // % with images
  links: number         // % with links
  mentions: number      // % with mentions
  color: number         // 0=overused, 1=cold, 2=unused, 3=hot/good
}

export interface HashtagSuggestionsResponse {
  result: boolean
  code: number
  message: string
  hashtag?: string
  data: RiteTagHashtag[]
}

export interface TrendingHashtagsResponse {
  result: boolean
  code: number
  message: string
  tags: RiteTagHashtag[]
}

export interface HashtagStatsResponse {
  result: boolean
  code: number
  message: string
  stats: RiteTagHashtag[]
}

/**
 * Color code meanings:
 * 0 = GREY (Overused) - Your post will get buried
 * 1 = RED (Cold) - Low engagement, avoid
 * 2 = BLUE (Unused) - Long-term value, steady performance
 * 3 = GREEN (Hot) - Use immediately, good engagement
 */
export const HASHTAG_COLOR_CODES = {
  OVERUSED: 0,
  COLD: 1,
  UNUSED: 2,
  HOT: 3,
} as const

export type HashtagColorCode = typeof HASHTAG_COLOR_CODES[keyof typeof HASHTAG_COLOR_CODES]

/**
 * Get the RiteKit client ID from environment
 */
function getClientId(): string {
  const clientId = process.env.RITEKIT_CLIENT_ID
  if (!clientId) {
    throw new Error('RITEKIT_CLIENT_ID environment variable is not set. Get your API key at https://ritekit.com')
  }
  return clientId
}

/**
 * Check if RiteTag API is configured
 */
export function isRiteTagConfigured(): boolean {
  return !!process.env.RITEKIT_CLIENT_ID
}

/**
 * Get hashtag suggestions for a topic or text
 *
 * @param text - Topic or text (up to 1000 characters)
 * @returns Hashtag suggestions with engagement metrics
 */
export async function getHashtagSuggestions(text: string): Promise<HashtagSuggestionsResponse> {
  const clientId = getClientId()

  // Truncate to 1000 chars max
  const truncatedText = text.slice(0, 1000)

  const url = new URL(`${RITETAG_BASE_URL}/stats/hashtag-suggestions`)
  url.searchParams.set('text', truncatedText)
  url.searchParams.set('client_id', clientId)

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`RiteTag API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Get currently trending hashtags
 *
 * Note: This endpoint may not be available on all RiteTag plans.
 * Falls back to empty result if unavailable.
 *
 * @param options - Filter options
 * @returns Trending hashtags with metrics (or empty if unavailable)
 */
export async function getTrendingHashtags(options: {
  green?: boolean  // Filter to non-overused (hot) tags only
  latin?: boolean  // Restrict to Latin characters only
} = {}): Promise<TrendingHashtagsResponse> {
  const clientId = getClientId()

  // Try the trending endpoint (may not be available on all plans)
  const url = new URL(`${RITETAG_BASE_URL}/search/trending`)
  url.searchParams.set('client_id', clientId)

  if (options.green) {
    url.searchParams.set('green', 'true')
  }
  if (options.latin) {
    url.searchParams.set('latin', 'true')
  }

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      // Return empty result instead of throwing - trending is optional
      console.warn(`RiteTag trending endpoint unavailable: ${response.status}`)
      return {
        result: true,
        code: 200,
        message: 'Trending unavailable - using suggestions instead',
        tags: [],
      }
    }

    return response.json()
  } catch (error) {
    // Return empty result on network errors
    console.warn('RiteTag trending fetch failed:', error)
    return {
      result: true,
      code: 200,
      message: 'Trending unavailable',
      tags: [],
    }
  }
}

/**
 * Get stats for multiple specific hashtags
 *
 * @param hashtags - Array of hashtags (without # symbol, up to 100)
 * @returns Stats for each hashtag
 */
export async function getHashtagStats(hashtags: string[]): Promise<HashtagStatsResponse> {
  const clientId = getClientId()

  // Remove # symbols and limit to 100 hashtags
  const cleanedHashtags = hashtags
    .map(h => h.replace(/^#/, ''))
    .slice(0, 100)

  const url = new URL(`${RITETAG_BASE_URL}/stats/multiple-hashtags`)
  url.searchParams.set('tags', cleanedHashtags.join(','))
  url.searchParams.set('client_id', clientId)

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`RiteTag API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Categorize hashtags by size (reach potential)
 */
export function categorizeBySize(hashtags: RiteTagHashtag[]): {
  large: RiteTagHashtag[]   // exposure > 1M
  medium: RiteTagHashtag[]  // exposure 100K-1M
  small: RiteTagHashtag[]   // exposure < 100K
} {
  return {
    large: hashtags.filter(h => h.exposure > 1000000),
    medium: hashtags.filter(h => h.exposure >= 100000 && h.exposure <= 1000000),
    small: hashtags.filter(h => h.exposure < 100000),
  }
}

/**
 * Filter hashtags by quality (color code)
 */
export function filterByQuality(hashtags: RiteTagHashtag[], options: {
  includeHot?: boolean      // color 3
  includeSteady?: boolean   // color 2
  includeCold?: boolean     // color 1
  includeOverused?: boolean // color 0
} = { includeHot: true, includeSteady: true }): RiteTagHashtag[] {
  const allowedColors: number[] = []

  if (options.includeHot) allowedColors.push(HASHTAG_COLOR_CODES.HOT)
  if (options.includeSteady) allowedColors.push(HASHTAG_COLOR_CODES.UNUSED)
  if (options.includeCold) allowedColors.push(HASHTAG_COLOR_CODES.COLD)
  if (options.includeOverused) allowedColors.push(HASHTAG_COLOR_CODES.OVERUSED)

  return hashtags.filter(h => allowedColors.includes(h.color))
}

/**
 * Sort hashtags by engagement potential
 */
export function sortByEngagement(hashtags: RiteTagHashtag[]): RiteTagHashtag[] {
  return [...hashtags].sort((a, b) => {
    // Prioritize hot tags, then by engagement ratio
    if (a.color !== b.color) {
      return b.color - a.color // Higher color = better
    }
    // Calculate engagement ratio (retweets per exposure)
    const ratioA = a.tweets > 0 ? a.retweets / a.tweets : 0
    const ratioB = b.tweets > 0 ? b.retweets / b.tweets : 0
    return ratioB - ratioA
  })
}

/**
 * Get optimal hashtag mix for a goal
 *
 * @param allHashtags - All available hashtags
 * @param goal - Content goal
 * @param count - Total hashtags to return (default 15)
 */
export function selectOptimalMix(
  allHashtags: RiteTagHashtag[],
  goal: 'reach' | 'engagement' | 'saves',
  count: number = 15
): {
  primary: RiteTagHashtag[]
  secondary: RiteTagHashtag[]
  niche: RiteTagHashtag[]
  totalReach: number
} {
  // Filter out overused hashtags
  const qualityHashtags = filterByQuality(allHashtags, {
    includeHot: true,
    includeSteady: true,
    includeCold: false,
    includeOverused: false,
  })

  const categorized = categorizeBySize(qualityHashtags)
  const sorted = {
    large: sortByEngagement(categorized.large),
    medium: sortByEngagement(categorized.medium),
    small: sortByEngagement(categorized.small),
  }

  let primary: RiteTagHashtag[] = []
  let secondary: RiteTagHashtag[] = []
  let niche: RiteTagHashtag[] = []

  switch (goal) {
    case 'reach':
      // 2 large, 5 medium, 3 small (prioritize exposure)
      primary = sorted.large.slice(0, 2)
      secondary = sorted.medium.slice(0, Math.min(5, count - primary.length))
      niche = sorted.small.slice(0, Math.min(3, count - primary.length - secondary.length))
      break

    case 'engagement':
      // 1 large, 4 medium, 5 small (prioritize engagement ratio)
      primary = sorted.large.slice(0, 1)
      secondary = sorted.medium.slice(0, Math.min(4, count - primary.length))
      niche = sorted.small.slice(0, Math.min(5, count - primary.length - secondary.length))
      break

    case 'saves':
      // 1 large, 3 medium, 6 small (prioritize niche communities)
      primary = sorted.large.slice(0, 1)
      secondary = sorted.medium.slice(0, Math.min(3, count - primary.length))
      niche = sorted.small.slice(0, Math.min(6, count - primary.length - secondary.length))
      break
  }

  const totalReach = [...primary, ...secondary, ...niche]
    .reduce((sum, h) => sum + h.exposure, 0)

  return { primary, secondary, niche, totalReach }
}
