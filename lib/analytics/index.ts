/**
 * Analytics Module - Main Export
 *
 * Modular analytics tools with graceful degradation.
 * All exports work even when individual tools are unavailable.
 */

// Types
export * from './types'

// Tool Registry
export {
  TOOL_CONFIGS,
  isToolConfigured,
  getConfiguredTools,
  getFreeTool,
  getToolsByTier,
  getToolHealth,
  updateToolHealth,
  getToolsForTier,
  getToolInfo,
  getAllToolsStatus,
  calculateConfidence,
  getMissingToolsExplanation,
} from './tool-registry'

// Main Analytics Client
export {
  runAnalytics,
  analyzeKeywords,
  getContentOptimizations,
  type AnalyticsRequest,
  type AnalyticsResponse,
} from './analytics-client'

// Google Trends
export {
  checkTrendsAvailability,
  getTrendData,
  compareTrends,
  getRelatedKeywords,
} from './google-trends'

// Google PageSpeed
export {
  checkPageSpeedAvailability,
  analyzePageSpeed,
  getPerformanceSummary,
  comparePageSpeeds,
} from './google-pagespeed'

// RiteTag Wrapper
export {
  isRiteTagReady,
  getOptimalHashtags,
  validateHashtags,
  getSuggestedHashtags,
} from './ritetag-wrapper'

// Facebook Ad Library
export {
  isFacebookAdLibraryConfigured,
  checkFacebookAdLibraryAvailability,
  searchAds,
  analyzeCompetitorAds,
} from './facebook-ad-library'

/**
 * Quick health check for all configured tools
 */
export async function checkAllToolsHealth(): Promise<{
  healthy: string[]
  unhealthy: string[]
  unconfigured: string[]
}> {
  const { getConfiguredTools, getToolHealth } = await import('./tool-registry')
  const { checkTrendsAvailability } = await import('./google-trends')
  const { checkPageSpeedAvailability } = await import('./google-pagespeed')

  const configuredTools = getConfiguredTools()
  const healthy: string[] = []
  const unhealthy: string[] = []
  const unconfigured: string[] = []

  // Check Google Trends
  if (configuredTools.includes('google-trends')) {
    const trendsOk = await checkTrendsAvailability()
    if (trendsOk) healthy.push('google-trends')
    else unhealthy.push('google-trends')
  } else {
    unconfigured.push('google-trends')
  }

  // Check PageSpeed (only if API key is set for reliable checks)
  if (configuredTools.includes('google-pagespeed')) {
    const pageSpeedOk = await checkPageSpeedAvailability()
    if (pageSpeedOk) healthy.push('google-pagespeed')
    else unhealthy.push('google-pagespeed')
  } else {
    // PageSpeed works without API key too
    healthy.push('google-pagespeed')
  }

  // Check RiteTag
  const { isRiteTagReady } = await import('./ritetag-wrapper')
  if (isRiteTagReady()) {
    healthy.push('ritetag')
  } else if (process.env.RITEKIT_CLIENT_ID) {
    unhealthy.push('ritetag')
  } else {
    unconfigured.push('ritetag')
  }

  // Check Facebook Ad Library
  const { checkFacebookAdLibraryAvailability } = await import('./facebook-ad-library')
  if (configuredTools.includes('facebook-ad-library')) {
    const adLibraryOk = await checkFacebookAdLibraryAvailability()
    if (adLibraryOk) healthy.push('facebook-ad-library')
    else unhealthy.push('facebook-ad-library')
  } else {
    unconfigured.push('facebook-ad-library')
  }

  // Mark other tools as unconfigured
  const allTools = ['semrush', 'spyfu', 'sparktoro']
  for (const tool of allTools) {
    if (!configuredTools.includes(tool as any)) {
      unconfigured.push(tool)
    }
  }

  return { healthy, unhealthy, unconfigured }
}

/**
 * Get a summary of available analytics capabilities
 */
export function getAnalyticsCapabilities(
  userTier: 'budget' | 'standard' | 'premium'
): {
  available: string[]
  unavailable: string[]
  description: string
} {
  const { getToolsForTier, TOOL_CONFIGS } = require('./tool-registry')
  const availableTools = getToolsForTier(userTier)

  const available = availableTools.map(
    (tool: string) => TOOL_CONFIGS[tool]?.name || tool
  )

  const allToolNames = Object.values(TOOL_CONFIGS).map((c: any) => c.name)
  const unavailable = allToolNames.filter((name: string) => !available.includes(name))

  let description = ''
  if (available.length === 0) {
    description = 'Basic content recommendations based on industry best practices.'
  } else if (available.length <= 2) {
    description = `Analytics powered by ${available.join(' and ')}.`
  } else {
    description = `Full analytics suite: ${available.slice(0, -1).join(', ')}, and ${available.slice(-1)}.`
  }

  return { available, unavailable, description }
}
