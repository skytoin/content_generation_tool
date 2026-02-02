/**
 * RiteTag Wrapper
 *
 * Wraps the existing RiteTag client for use with the analytics module.
 * Provides graceful degradation if RiteTag is not configured.
 */

import {
  HashtagRecommendation,
  HashtagAnalytics,
  AnalyticsToolResult,
} from './types'
import { isToolConfigured, updateToolHealth } from './tool-registry'

// Try to import the main RiteTag client
let ritetagAvailable = false
let ritetagFunctions: {
  isRiteTagConfigured: () => boolean
  getHashtagSuggestions: (text: string) => Promise<any>
  selectOptimalMix: (hashtags: any[], goal: string, count?: number) => any
  filterByQuality: (hashtags: any[], options?: any) => any[]
} | null = null

try {
  const ritetag = require('../api/generate/ritetag-client')
  ritetagFunctions = {
    isRiteTagConfigured: ritetag.isRiteTagConfigured,
    getHashtagSuggestions: ritetag.getHashtagSuggestions,
    selectOptimalMix: ritetag.selectOptimalMix,
    filterByQuality: ritetag.filterByQuality,
  }
  ritetagAvailable = true
} catch {
  console.log('RiteTag client not available')
}

/**
 * Check if RiteTag is configured and working
 */
export function isRiteTagReady(): boolean {
  return ritetagAvailable && ritetagFunctions?.isRiteTagConfigured() === true
}

/**
 * Convert RiteTag color code to quality string
 */
function colorToQuality(color: number): 'hot' | 'good' | 'cold' | 'overused' {
  switch (color) {
    case 3: return 'hot'
    case 2: return 'good'
    case 1: return 'cold'
    case 0: return 'overused'
    default: return 'good'
  }
}

/**
 * Convert RiteTag hashtag to our analytics format
 */
function convertHashtag(rtHashtag: any): HashtagAnalytics {
  return {
    hashtag: rtHashtag.hashtag || rtHashtag.tag,
    postsPerHour: rtHashtag.tweets || 0,
    exposure: rtHashtag.exposure || 0,
    engagement: rtHashtag.retweets || 0,
    quality: colorToQuality(rtHashtag.color),
    imagesPercent: rtHashtag.images || 0,
    linksPercent: rtHashtag.links || 0,
  }
}

/**
 * Get optimal hashtags for a topic
 */
export async function getOptimalHashtags(
  topic: string,
  goal: 'reach' | 'engagement' | 'saves' = 'engagement',
  count: number = 15
): Promise<AnalyticsToolResult<HashtagRecommendation>> {
  // Check if RiteTag is available
  if (!isRiteTagReady() || !ritetagFunctions) {
    updateToolHealth('ritetag', 'unavailable', 'Not configured')
    return {
      tool: 'ritetag',
      success: false,
      error: 'RiteTag is not configured. Set RITEKIT_CLIENT_ID in environment.',
      timestamp: new Date(),
    }
  }

  try {
    const start = Date.now()

    // Get suggestions from RiteTag
    const response = await ritetagFunctions.getHashtagSuggestions(topic)

    if (!response.result || !response.data || response.data.length === 0) {
      throw new Error('No hashtag suggestions returned')
    }

    // Get optimal mix based on goal
    const optimalMix = ritetagFunctions.selectOptimalMix(
      response.data,
      goal,
      count
    )

    const recommendation: HashtagRecommendation = {
      primary: optimalMix.primary.map(convertHashtag),
      secondary: optimalMix.secondary.map(convertHashtag),
      niche: optimalMix.niche.map(convertHashtag),
      totalReach: optimalMix.totalReach,
      strategy: generateHashtagStrategy(goal, optimalMix),
    }

    const responseTime = Date.now() - start
    updateToolHealth('ritetag', 'available', undefined, responseTime)

    return {
      tool: 'ritetag',
      success: true,
      data: recommendation,
      timestamp: new Date(),
    }
  } catch (error) {
    console.error('RiteTag error:', error)
    updateToolHealth('ritetag', 'error', String(error))

    return {
      tool: 'ritetag',
      success: false,
      error: String(error),
      timestamp: new Date(),
    }
  }
}

/**
 * Generate hashtag strategy explanation
 */
function generateHashtagStrategy(
  goal: 'reach' | 'engagement' | 'saves',
  mix: any
): string {
  const primaryCount = mix.primary?.length || 0
  const secondaryCount = mix.secondary?.length || 0
  const nicheCount = mix.niche?.length || 0
  const total = primaryCount + secondaryCount + nicheCount

  const strategies: Record<string, string> = {
    reach: `Optimized for maximum reach: ${primaryCount} high-exposure hashtags, ${secondaryCount} medium-reach, ${nicheCount} niche tags. Mix ensures visibility across audience sizes.`,
    engagement: `Optimized for engagement: ${primaryCount} trending hashtags, ${secondaryCount} community hashtags, ${nicheCount} niche-specific tags. Balance drives quality interactions.`,
    saves: `Optimized for saves/bookmarks: ${primaryCount} discovery hashtags, ${secondaryCount} educational hashtags, ${nicheCount} specialized niche tags. Targets users who save valuable content.`,
  }

  return strategies[goal] || `${total} hashtags selected for optimal performance.`
}

/**
 * Validate hashtags against quality standards
 */
export async function validateHashtags(
  hashtags: string[]
): Promise<AnalyticsToolResult<Array<HashtagAnalytics & { recommended: boolean }>>> {
  if (!isRiteTagReady() || !ritetagFunctions) {
    return {
      tool: 'ritetag',
      success: false,
      error: 'RiteTag is not configured',
      timestamp: new Date(),
    }
  }

  try {
    // Get stats for each hashtag
    const results = await Promise.all(
      hashtags.slice(0, 20).map(async tag => {
        try {
          const response = await ritetagFunctions!.getHashtagSuggestions(tag)
          const matchingTag = response.data?.find(
            (h: any) => h.tag?.toLowerCase() === tag.toLowerCase().replace('#', '')
          )

          if (matchingTag) {
            const analytics = convertHashtag(matchingTag)
            return {
              ...analytics,
              recommended: ['hot', 'good'].includes(analytics.quality),
            }
          }

          return {
            hashtag: tag,
            postsPerHour: 0,
            exposure: 0,
            engagement: 0,
            quality: 'cold' as const,
            imagesPercent: 0,
            linksPercent: 0,
            recommended: false,
          }
        } catch {
          return {
            hashtag: tag,
            postsPerHour: 0,
            exposure: 0,
            engagement: 0,
            quality: 'cold' as const,
            imagesPercent: 0,
            linksPercent: 0,
            recommended: false,
          }
        }
      })
    )

    return {
      tool: 'ritetag',
      success: true,
      data: results,
      timestamp: new Date(),
    }
  } catch (error) {
    return {
      tool: 'ritetag',
      success: false,
      error: String(error),
      timestamp: new Date(),
    }
  }
}

/**
 * Get hashtag suggestions without full optimization
 */
export async function getSuggestedHashtags(
  topic: string,
  limit: number = 30
): Promise<string[]> {
  if (!isRiteTagReady() || !ritetagFunctions) {
    return []
  }

  try {
    const response = await ritetagFunctions.getHashtagSuggestions(topic)

    if (!response.data) return []

    // Filter to quality hashtags and return just the tag names
    const quality = ritetagFunctions.filterByQuality(response.data, {
      includeHot: true,
      includeSteady: true,
    })

    return quality.slice(0, limit).map((h: any) => h.tag || h.hashtag)
  } catch {
    return []
  }
}
