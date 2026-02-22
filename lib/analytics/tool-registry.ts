/**
 * Analytics Tool Registry
 *
 * Central registry for all analytics tools with availability checking
 * and graceful degradation support.
 */

import { AnalyticsTool, ToolConfig, ToolHealthCheck, ToolStatus } from './types'

// Tool configurations
export const TOOL_CONFIGS: Record<AnalyticsTool, ToolConfig> = {
  'google-trends': {
    id: 'google-trends',
    name: 'Google Trends',
    description: 'Search trend analysis and keyword comparison',
    tier: 'freemium', // Requires SerpAPI ($75+/month)
    requiredEnvVars: ['SERPAPI_API_KEY'],
    monthlyCost: 75,
    rateLimit: { requests: 5000, period: 'month' },
  },
  'google-pagespeed': {
    id: 'google-pagespeed',
    name: 'Google PageSpeed Insights',
    description: 'Website performance analysis',
    tier: 'free',
    requiredEnvVars: ['GOOGLE_PAGESPEED_API_KEY'], // Optional but recommended
    rateLimit: { requests: 25000, period: 'day' },
  },
  'ritetag': {
    id: 'ritetag',
    name: 'RiteTag',
    description: 'Real-time hashtag analytics and suggestions',
    tier: 'freemium',
    requiredEnvVars: ['RITEKIT_CLIENT_ID'],
    monthlyCost: 49, // Pro plan
    rateLimit: { requests: 500, period: 'month' },
  },
  'semrush': {
    id: 'semrush',
    name: 'SEMrush',
    description: 'Comprehensive SEO and competitor analysis',
    tier: 'paid',
    requiredEnvVars: ['SEMRUSH_API_KEY'],
    monthlyCost: 449.95, // Business plan required for API access
    rateLimit: { requests: 10000, period: 'month' },
  },
  'spyfu': {
    id: 'spyfu',
    name: 'SpyFu',
    description: 'Competitor keyword and PPC research',
    tier: 'paid',
    requiredEnvVars: ['SPYFU_API_KEY'],
    monthlyCost: 89, // Pro+ plan required for API
    rateLimit: { requests: 10000, period: 'month' },
  },
  'sparktoro': {
    id: 'sparktoro',
    name: 'SparkToro',
    description: 'Audience research and influencer discovery (API Coming Soon)',
    tier: 'paid',
    requiredEnvVars: ['SPARKTORO_API_KEY'],
    monthlyCost: 50,
    rateLimit: { requests: 500, period: 'month' },
    // NOTE: SparkToro API is not yet publicly available - in beta testing
  },
  'facebook-ad-library': {
    id: 'facebook-ad-library',
    name: 'Facebook Ad Library',
    description: 'Competitor ad research and creative analysis',
    tier: 'free',
    requiredEnvVars: ['FACEBOOK_ACCESS_TOKEN'],
    rateLimit: { requests: 200, period: 'hour' },
  },
  'dataforseo': {
    id: 'dataforseo',
    name: 'DataForSEO',
    description: 'Keyword research, competitor analysis, search intent, and content gap identification',
    tier: 'paid',
    requiredEnvVars: ['DATAFORSEO_LOGIN', 'DATAFORSEO_PASSWORD'],
    monthlyCost: 50,
    rateLimit: { requests: 30000, period: 'month' },
  },
}

// Health check cache
const healthCache = new Map<AnalyticsTool, ToolHealthCheck>()
const HEALTH_CACHE_TTL = 5 * 60 * 1000 // 5 minutes

/**
 * Check if a tool is configured (has required env vars)
 */
export function isToolConfigured(tool: AnalyticsTool): boolean {
  const config = TOOL_CONFIGS[tool]
  if (!config.requiredEnvVars.length) return true
  return config.requiredEnvVars.every(envVar => !!process.env[envVar])
}

/**
 * Get all configured tools
 */
export function getConfiguredTools(): AnalyticsTool[] {
  return Object.keys(TOOL_CONFIGS).filter(
    tool => isToolConfigured(tool as AnalyticsTool)
  ) as AnalyticsTool[]
}

/**
 * Get all available free tools (configured or not needing config)
 */
export function getFreeTool(): AnalyticsTool[] {
  return Object.entries(TOOL_CONFIGS)
    .filter(([_, config]) => config.tier === 'free')
    .map(([id]) => id as AnalyticsTool)
}

/**
 * Get tools by tier
 */
export function getToolsByTier(tier: 'free' | 'freemium' | 'paid'): AnalyticsTool[] {
  return Object.entries(TOOL_CONFIGS)
    .filter(([_, config]) => config.tier === tier)
    .map(([id]) => id as AnalyticsTool)
}

/**
 * Get tool health from cache or perform check
 */
export function getToolHealth(tool: AnalyticsTool): ToolHealthCheck | null {
  const cached = healthCache.get(tool)
  if (cached && Date.now() - cached.lastChecked.getTime() < HEALTH_CACHE_TTL) {
    return cached
  }
  return null
}

/**
 * Update tool health status
 */
export function updateToolHealth(
  tool: AnalyticsTool,
  status: ToolStatus,
  message?: string,
  responseTimeMs?: number
): ToolHealthCheck {
  const health: ToolHealthCheck = {
    tool,
    status,
    message,
    lastChecked: new Date(),
    responseTimeMs,
  }
  healthCache.set(tool, health)
  return health
}

/**
 * Get all tools available for a specific tier level
 */
export function getToolsForTier(
  userTier: 'budget' | 'standard' | 'premium'
): AnalyticsTool[] {
  const configuredTools = getConfiguredTools()

  switch (userTier) {
    case 'budget':
      // Budget tier: only free tools that are configured
      return configuredTools.filter(
        tool => TOOL_CONFIGS[tool].tier === 'free'
      )

    case 'standard':
      // Standard tier: free + freemium tools
      return configuredTools.filter(
        tool => ['free', 'freemium'].includes(TOOL_CONFIGS[tool].tier)
      )

    case 'premium':
      // Premium tier: all configured tools
      return configuredTools

    default:
      return []
  }
}

/**
 * Get tool information for display
 */
export function getToolInfo(tool: AnalyticsTool): ToolConfig & { configured: boolean } {
  return {
    ...TOOL_CONFIGS[tool],
    configured: isToolConfigured(tool),
  }
}

/**
 * Get all tools with their status for admin/debug view
 */
export function getAllToolsStatus(): Array<ToolConfig & {
  configured: boolean
  health: ToolHealthCheck | null
}> {
  return Object.keys(TOOL_CONFIGS).map(tool => ({
    ...TOOL_CONFIGS[tool as AnalyticsTool],
    configured: isToolConfigured(tool as AnalyticsTool),
    health: getToolHealth(tool as AnalyticsTool),
  }))
}

/**
 * Calculate confidence level based on available tools
 */
export function calculateConfidence(
  usedTools: AnalyticsTool[],
  requestedTools: AnalyticsTool[]
): 'high' | 'medium' | 'low' {
  if (requestedTools.length === 0) return 'medium'

  const ratio = usedTools.length / requestedTools.length

  if (ratio >= 0.8) return 'high'
  if (ratio >= 0.4) return 'medium'
  return 'low'
}

/**
 * Get missing tools explanation for user feedback
 */
export function getMissingToolsExplanation(
  unavailableTools: AnalyticsTool[]
): string {
  if (unavailableTools.length === 0) return ''

  const explanations = unavailableTools.map(tool => {
    const config = TOOL_CONFIGS[tool]
    if (config.tier === 'paid') {
      return `${config.name} (premium feature)`
    }
    return `${config.name} (not configured)`
  })

  return `Some analytics tools were unavailable: ${explanations.join(', ')}. ` +
    'Results are based on available data sources.'
}
