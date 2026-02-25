/**
 * Analytics Client
 *
 * Unified analytics client that aggregates all available tools
 * with graceful degradation when tools are unavailable.
 *
 * Key principle: Pipeline ALWAYS works, even without any analytics tools.
 */

import {
  AnalyticsTool,
  AggregatedAnalytics,
  HashtagRecommendation,
  GoogleTrendsData,
  TrendsComparisonResult,
  PageSpeedResult,
} from './types'
import {
  getToolsForTier,
  isToolConfigured,
  calculateConfidence,
  getMissingToolsExplanation,
  updateToolHealth,
} from './tool-registry'
import { getTrendData, compareTrends, getRelatedKeywords } from './google-trends'
import { analyzePageSpeed, getPerformanceSummary } from './google-pagespeed'
import {
  isFacebookAdLibraryConfigured,
  analyzeCompetitorAds,
  type AdLibraryAnalysis,
} from './facebook-ad-library'
import { analyzeSEO, type SEOAnalysisRequest } from '@/lib/dataforseo/seo-analyzer'

// Import RiteTag client if available
let ritetagClient: typeof import('../analytics/ritetag-wrapper') | null = null
try {
  ritetagClient = require('./ritetag-wrapper')
} catch {
  // RiteTag wrapper not available
}

export interface AnalyticsRequest {
  topic: string
  keywords?: string[]
  competitorUrls?: string[]
  competitorNames?: string[]  // For Facebook Ad Library research
  targetPlatform?: 'instagram' | 'blog' | 'twitter' | 'facebook' | 'ads'
  contentType?: string
  userTier: 'budget' | 'standard' | 'premium'
  industry?: string
  companyName?: string
  companyType?: string
  businessDescription?: string
  userKeywords?: string[]
  goals?: string
  targetUrl?: string
  seoSeeds?: string[]
}

export interface AnalyticsResponse {
  success: boolean
  data: AggregatedAnalytics
  warnings: string[]
}

/**
 * Main analytics function - runs all available tools for the user's tier
 * ALWAYS returns a result, even if all tools fail
 */
export async function runAnalytics(
  request: AnalyticsRequest
): Promise<AnalyticsResponse> {
  const availableTools = getToolsForTier(request.userTier)
  const warnings: string[] = []
  const toolsUsed: AnalyticsTool[] = []
  const toolsUnavailable: AnalyticsTool[] = []

  // Initialize result with defaults
  const result: AggregatedAnalytics = {
    timestamp: new Date(),
    toolsUsed: [],
    toolsUnavailable: [],
    confidence: 'low',
    summary: '',
  }

  // Phase 1: Run Google Trends first to extract rising queries as seeds for DataForSEO
  let trendSeeds: string[] = []
  if (availableTools.includes('google-trends')) {
    try {
      const trendsResult = await getTrendData(request.topic)
      if (trendsResult.success && trendsResult.data) {
        result.trends = trendsResult.data
        toolsUsed.push('google-trends')
        trendSeeds = extractTrendSeeds(trendsResult.data)
        if (trendSeeds.length > 0) {
          console.log(`[Analytics] Trend seeds injected: ${trendSeeds.length} queries`)
        }
      } else {
        toolsUnavailable.push('google-trends')
        warnings.push(`Google Trends: ${trendsResult.error || 'unavailable'}`)
      }
    } catch (error) {
      toolsUnavailable.push('google-trends')
      warnings.push(`Google Trends error: ${error}`)
    }
  }

  // Phase 2: Run remaining tools in parallel
  const tasks: Promise<void>[] = []

  // PageSpeed - only if competitor URLs provided
  if (
    availableTools.includes('google-pagespeed') &&
    request.competitorUrls?.length
  ) {
    tasks.push(
      (async () => {
        try {
          const pageSpeedResult = await analyzePageSpeed(request.competitorUrls![0])
          if (pageSpeedResult.success && pageSpeedResult.data) {
            result.pageSpeed = pageSpeedResult.data
            toolsUsed.push('google-pagespeed')
          } else {
            toolsUnavailable.push('google-pagespeed')
            warnings.push(`PageSpeed: ${pageSpeedResult.error || 'unavailable'}`)
          }
        } catch (error) {
          toolsUnavailable.push('google-pagespeed')
          warnings.push(`PageSpeed error: ${error}`)
        }
      })()
    )
  }

  // RiteTag - for social platforms with hashtags
  if (
    availableTools.includes('ritetag') &&
    ['instagram', 'twitter'].includes(request.targetPlatform || '')
  ) {
    tasks.push(
      (async () => {
        try {
          if (ritetagClient && isToolConfigured('ritetag')) {
            const hashtagResult = await ritetagClient.getOptimalHashtags(
              request.topic,
              request.targetPlatform === 'instagram' ? 'engagement' : 'reach'
            )
            if (hashtagResult.success && hashtagResult.data) {
              result.hashtags = hashtagResult.data
              toolsUsed.push('ritetag')
            } else {
              toolsUnavailable.push('ritetag')
            }
          } else {
            toolsUnavailable.push('ritetag')
          }
        } catch (error) {
          toolsUnavailable.push('ritetag')
          warnings.push(`RiteTag error: ${error}`)
        }
      })()
    )
  }

  // Facebook Ad Library - for competitor ad research
  if (
    availableTools.includes('facebook-ad-library') &&
    (request.competitorNames?.length || request.targetPlatform === 'ads')
  ) {
    tasks.push(
      (async () => {
        try {
          if (isFacebookAdLibraryConfigured()) {
            // Use first competitor name or topic for ad research
            const searchTerm = request.competitorNames?.[0] || request.topic
            const adResult = await analyzeCompetitorAds(searchTerm)
            if (adResult.success && adResult.data) {
              result.adLibrary = adResult.data
              toolsUsed.push('facebook-ad-library')
            } else {
              toolsUnavailable.push('facebook-ad-library')
              if (adResult.error) {
                warnings.push(`Facebook Ad Library: ${adResult.error}`)
              }
            }
          } else {
            toolsUnavailable.push('facebook-ad-library')
          }
        } catch (error) {
          toolsUnavailable.push('facebook-ad-library')
          warnings.push(`Facebook Ad Library error: ${error}`)
        }
      })()
    )
  }

  // DataForSEO - keyword research and competitor analysis (standard/premium only)
  if (
    availableTools.includes('dataforseo') &&
    ['standard', 'premium'].includes(request.userTier)
  ) {
    tasks.push(
      (async () => {
        try {
          const mergedSeoSeeds = [...(request.seoSeeds || []), ...trendSeeds]
          const seoRequest: SEOAnalysisRequest = {
            description: request.topic,
            industry: request.industry,
            goals: request.goals,
            competitorUrls: request.competitorUrls,
            userKeywords: request.userKeywords || request.keywords,
            companyName: request.companyName,
            companyType: request.companyType,
            businessDescription: request.businessDescription,
            targetUrl: request.targetUrl,
            seoSeeds: mergedSeoSeeds.length > 0 ? mergedSeoSeeds : undefined,
          }
          const seoResult = await analyzeSEO(seoRequest)
          if (seoResult.dataSource === 'dataforseo') {
            result.seoAnalysis = seoResult
            toolsUsed.push('dataforseo')
          } else {
            toolsUnavailable.push('dataforseo')
          }
        } catch (error) {
          toolsUnavailable.push('dataforseo')
          warnings.push(`DataForSEO error: ${error}`)
        }
      })()
    )
  }

  // Wait for all tasks to complete
  await Promise.allSettled(tasks)

  // Update result metadata
  result.toolsUsed = toolsUsed
  result.toolsUnavailable = toolsUnavailable
  result.confidence = calculateConfidence(toolsUsed, availableTools)

  // Generate summary
  result.summary = generateAnalyticsSummary(result, request)

  // Add explanation if tools were unavailable
  if (toolsUnavailable.length > 0) {
    warnings.push(getMissingToolsExplanation(toolsUnavailable))
  }

  return {
    success: true, // Always succeeds, even with no tools
    data: result,
    warnings,
  }
}

/**
 * Generate a human-readable summary of analytics results
 */
function generateAnalyticsSummary(
  analytics: AggregatedAnalytics,
  request: AnalyticsRequest
): string {
  const parts: string[] = []

  // Topic trends
  if (analytics.trends) {
    const trend = analytics.trends
    const interestLevel =
      trend.interest >= 70 ? 'high' :
      trend.interest >= 40 ? 'moderate' : 'low'

    parts.push(
      `📊 Search interest for "${request.topic}" is ${interestLevel} (${trend.interest}/100).`
    )

    if (trend.relatedQueries.length > 0) {
      const risingQueries = trend.relatedQueries
        .filter(q => q.type === 'rising')
        .slice(0, 3)
        .map(q => q.query)

      if (risingQueries.length > 0) {
        parts.push(`Rising related searches: ${risingQueries.join(', ')}`)
      }
    }
  }

  // PageSpeed insights
  if (analytics.pageSpeed) {
    const score = analytics.pageSpeed.mobile.performanceScore
    const grade =
      score >= 90 ? 'A' :
      score >= 75 ? 'B' :
      score >= 50 ? 'C' : 'D'

    parts.push(
      `⚡ Competitor site performance: ${score}/100 (Grade ${grade})`
    )
  }

  // Hashtag recommendations
  if (analytics.hashtags) {
    const total =
      (analytics.hashtags.primary?.length || 0) +
      (analytics.hashtags.secondary?.length || 0) +
      (analytics.hashtags.niche?.length || 0)

    if (total > 0) {
      parts.push(
        `#️⃣ ${total} optimized hashtags recommended with ${formatNumber(analytics.hashtags.totalReach)} potential reach.`
      )
    }
  }

  // Facebook Ad Library insights
  if (analytics.adLibrary) {
    const { activeAds, totalAds, platforms, spendRange } = analytics.adLibrary

    if (totalAds > 0) {
      parts.push(
        `📢 Competitor ad analysis: ${activeAds} active ads (${totalAds} total) found.`
      )
      if (platforms.length > 0) {
        parts.push(`Platforms: ${platforms.join(', ')}`)
      }
      if (spendRange && spendRange.max > 0) {
        parts.push(
          `Est. ad spend: $${formatNumber(spendRange.min)}-$${formatNumber(spendRange.max)}`
        )
      }
    } else {
      parts.push(`📢 No active competitor ads found for this search.`)
    }
  }

  // SEO Analysis
  if (analytics.seoAnalysis) {
    const seo = analytics.seoAnalysis
    if (seo.suggestedKeywords.length > 0) {
      const topKw = seo.suggestedKeywords.slice(0, 3).map(k => k.keyword)
      parts.push(
        `🔍 SEO: ${seo.suggestedKeywords.length} keyword opportunities found. Top: ${topKw.join(', ')}`
      )
    }
    if (seo.discoveredCompetitors.length > 0) {
      parts.push(
        `🏢 ${seo.discoveredCompetitors.length} competitors analyzed`
      )
    }
    if (seo.contentGaps.length > 0) {
      parts.push(
        `📊 ${seo.contentGaps.length} content gaps identified`
      )
    }
    if (seo.flaggedKeywords.length > 0) {
      parts.push(
        `⚠️ ${seo.flaggedKeywords.length} keyword(s) flagged for low click-through`
      )
    }
  }

  // Confidence note
  if (analytics.confidence === 'low') {
    parts.push(
      '⚠️ Limited analytics data available. Recommendations based on general best practices.'
    )
  } else if (analytics.confidence === 'medium') {
    parts.push(
      'ℹ️ Some analytics tools unavailable. Core recommendations provided.'
    )
  }

  // Default message if no data
  if (parts.length === 0) {
    parts.push(
      `Analysis for "${request.topic}" complete. Recommendations based on industry best practices.`
    )
  }

  return parts.join('\n')
}

/**
 * Format large numbers for display
 */
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

/**
 * Extract rising queries from Google Trends data to use as DataForSEO discovery seeds.
 * Capped at 5 to avoid flooding the seed pool.
 * @internal Exported for testing
 */
export function extractTrendSeeds(trends: GoogleTrendsData): string[] {
  if (!trends?.relatedQueries?.length) {
    return []
  }
  return trends.relatedQueries
    .filter(q => q.type === 'rising')
    .map(q => q.query)
    .slice(0, 5)
}

/**
 * Quick keyword analysis for content planning
 */
export async function analyzeKeywords(
  keywords: string[],
  userTier: 'budget' | 'standard' | 'premium'
): Promise<{
  comparison: TrendsComparisonResult | null
  recommendations: string[]
  bestKeyword: string
}> {
  const recommendations: string[] = []

  // Try to get trends comparison
  let comparison: TrendsComparisonResult | null = null
  const availableTools = getToolsForTier(userTier)

  if (availableTools.includes('google-trends') && keywords.length >= 2) {
    const result = await compareTrends(keywords)
    if (result.success && result.data) {
      comparison = result.data
      recommendations.push(...result.data.insights)
    }
  }

  // Determine best keyword
  let bestKeyword = keywords[0]
  if (comparison) {
    bestKeyword = comparison.winner
  }

  // Add general recommendations if no trends data
  if (!comparison) {
    recommendations.push(
      `Consider testing "${keywords[0]}" vs variations to find optimal keywords`,
      'Use specific, long-tail keywords for better targeting',
      'Monitor search volume trends over time'
    )
  }

  return {
    comparison,
    recommendations,
    bestKeyword,
  }
}

/**
 * Get content optimization suggestions
 */
export async function getContentOptimizations(
  topic: string,
  platform: 'instagram' | 'blog' | 'twitter' | 'facebook',
  userTier: 'budget' | 'standard' | 'premium'
): Promise<{
  keywordSuggestions: string[]
  hashtagStrategy: HashtagRecommendation | null
  timingRecommendations: string[]
  formatRecommendations: string[]
}> {
  const availableTools = getToolsForTier(userTier)
  let keywordSuggestions: string[] = []
  let hashtagStrategy: HashtagRecommendation | null = null

  // Get related keywords from trends
  if (availableTools.includes('google-trends')) {
    const relatedResult = await getRelatedKeywords(topic)
    if (relatedResult.success && relatedResult.data) {
      keywordSuggestions = relatedResult.data.slice(0, 10)
    }
  }

  // Get hashtag strategy for social platforms
  if (
    availableTools.includes('ritetag') &&
    ritetagClient &&
    ['instagram', 'twitter'].includes(platform)
  ) {
    try {
      const hashtagResult = await ritetagClient.getOptimalHashtags(topic, 'engagement')
      if (hashtagResult.success && hashtagResult.data) {
        hashtagStrategy = hashtagResult.data
      }
    } catch {
      // Silently fail - hashtags are optional
    }
  }

  // Platform-specific recommendations
  const timingRecommendations = getTimingRecommendations(platform)
  const formatRecommendations = getFormatRecommendations(platform, topic)

  return {
    keywordSuggestions,
    hashtagStrategy,
    timingRecommendations,
    formatRecommendations,
  }
}

/**
 * Get posting time recommendations by platform
 */
function getTimingRecommendations(platform: string): string[] {
  const recommendations: Record<string, string[]> = {
    instagram: [
      'Best times: Tuesday-Friday, 11am-1pm and 7-9pm',
      'Avoid posting between 3-4am',
      'Reels perform best Wednesday-Friday mornings',
      'Stories: consistent daily posting builds audience',
    ],
    twitter: [
      'Best times: Tuesday-Thursday, 9am-12pm',
      'B2B content performs best during business hours',
      'Breaking news/trends: post immediately',
      'Thread engagement peaks in evenings',
    ],
    facebook: [
      'Best times: Tuesday-Thursday, 8am-12pm',
      'Video content performs best 1-4pm',
      'Avoid weekends for B2B content',
      'Groups are most active in evenings',
    ],
    blog: [
      'Publish Monday-Wednesday for maximum initial traffic',
      'Update older posts on slower days',
      'Consider your audience timezone',
      'Newsletter sends: Tuesday-Thursday mornings',
    ],
  }

  return recommendations[platform] || [
    'Test different posting times to find your optimal schedule',
    'Consistency matters more than perfect timing',
  ]
}

/**
 * Get content format recommendations by platform
 */
function getFormatRecommendations(platform: string, topic: string): string[] {
  const recommendations: Record<string, string[]> = {
    instagram: [
      'Carousel posts get 3x more engagement than single images',
      'Use 2-3 slides for educational content, 5-10 for storytelling',
      'Include a strong CTA on the last slide',
      'Reels: first 3 seconds are critical for retention',
    ],
    twitter: [
      'Threads outperform single tweets for complex topics',
      'Lead with the most compelling point',
      'Include relevant images or data visualizations',
      'Quote-tweet strategy builds authority',
    ],
    facebook: [
      'Native video gets 10x more reach than links',
      'Posts with questions drive 2x more comments',
      'Polls and interactive content boost engagement',
      'Keep text concise, expand in comments',
    ],
    blog: [
      'Long-form content (2000+ words) ranks better',
      'Use headers, bullets, and visuals to break up text',
      'Include 3-5 internal links per post',
      'Add FAQ sections for featured snippets',
    ],
  }

  return recommendations[platform] || [
    'Match content format to platform best practices',
    'A/B test different formats to find what resonates',
  ]
}
