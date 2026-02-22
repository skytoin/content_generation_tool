/**
 * Analytics Tools Type Definitions
 *
 * Modular analytics tool architecture with graceful degradation.
 * Pipeline works even when tools are unavailable.
 */

export type AnalyticsTool =
  | 'google-trends'
  | 'google-pagespeed'
  | 'ritetag'
  | 'semrush'
  | 'spyfu'
  | 'sparktoro'
  | 'facebook-ad-library'
  | 'dataforseo'

export type ToolStatus = 'available' | 'unavailable' | 'error' | 'rate-limited'

export interface ToolHealthCheck {
  tool: AnalyticsTool
  status: ToolStatus
  message?: string
  lastChecked: Date
  responseTimeMs?: number
}

export interface AnalyticsToolResult<T = unknown> {
  tool: AnalyticsTool
  success: boolean
  data?: T
  error?: string
  cached?: boolean
  timestamp: Date
}

export interface ToolConfig {
  id: AnalyticsTool
  name: string
  description: string
  tier: 'free' | 'freemium' | 'paid'
  requiredEnvVars: string[]
  monthlyCost?: number
  rateLimit?: {
    requests: number
    period: 'minute' | 'hour' | 'day' | 'month'
  }
}

// Google Trends Types
export interface GoogleTrendsData {
  keyword: string
  interest: number  // 0-100 relative interest
  relatedTopics: Array<{
    topic: string
    type: 'rising' | 'top'
    value: string | number
  }>
  relatedQueries: Array<{
    query: string
    type: 'rising' | 'top'
    value: string | number
  }>
  timelineData?: Array<{
    date: string
    value: number
  }>
}

export interface TrendsComparisonResult {
  keywords: string[]
  comparison: Array<{
    keyword: string
    averageInterest: number
    peakInterest: number
    trend: 'rising' | 'stable' | 'declining'
  }>
  winner: string
  insights: string[]
}

// Google PageSpeed Types
export interface PageSpeedMetrics {
  performanceScore: number  // 0-100
  firstContentfulPaint: number  // ms
  largestContentfulPaint: number  // ms
  totalBlockingTime: number  // ms
  cumulativeLayoutShift: number
  speedIndex: number  // ms
}

export interface PageSpeedResult {
  url: string
  mobile: PageSpeedMetrics
  desktop: PageSpeedMetrics
  opportunities: Array<{
    title: string
    description: string
    savings?: string
  }>
  diagnostics: Array<{
    title: string
    description: string
  }>
}

// Hashtag Analytics Types (RiteTag compatible)
export interface HashtagAnalytics {
  hashtag: string
  postsPerHour: number
  exposure: number
  engagement: number
  quality: 'hot' | 'good' | 'cold' | 'overused'
  imagesPercent: number
  linksPercent: number
}

export interface HashtagRecommendation {
  primary: HashtagAnalytics[]
  secondary: HashtagAnalytics[]
  niche: HashtagAnalytics[]
  totalReach: number
  strategy: string
}

// Competitor Analysis Types (SEMrush/SpyFu compatible)
export interface CompetitorKeyword {
  keyword: string
  position: number
  searchVolume: number
  difficulty: number
  cpc: number
  url: string
}

export interface CompetitorAnalysis {
  domain: string
  organicKeywords: number
  organicTraffic: number
  topKeywords: CompetitorKeyword[]
  contentGaps: string[]
  opportunities: string[]
}

// Audience Analysis Types (SparkToro compatible)
export interface AudienceInsight {
  demographic: {
    age?: string[]
    gender?: string
    location?: string[]
  }
  interests: string[]
  websites: string[]
  podcasts: string[]
  youtubeChannels: string[]
  socialAccounts: string[]
  hashtags: string[]
}

// Facebook Ad Library Types
export interface FacebookAdAnalysis {
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

// SEO Analysis Types (DataForSEO)
export type { SEOAnalysisResult, KeywordData, CompetitorData, KeywordWarning } from '@/lib/dataforseo/seo-analyzer'

// Aggregated Analytics Result
export interface AggregatedAnalytics {
  timestamp: Date
  toolsUsed: AnalyticsTool[]
  toolsUnavailable: AnalyticsTool[]
  trends?: GoogleTrendsData
  pageSpeed?: PageSpeedResult
  hashtags?: HashtagRecommendation
  competitors?: CompetitorAnalysis
  audience?: AudienceInsight
  adLibrary?: FacebookAdAnalysis
  seoAnalysis?: import('@/lib/dataforseo/seo-analyzer').SEOAnalysisResult
  confidence: 'high' | 'medium' | 'low'
  summary: string
}
