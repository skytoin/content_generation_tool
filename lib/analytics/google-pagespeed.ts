/**
 * Google PageSpeed Insights Integration
 *
 * Provides website performance analysis using Google's free API.
 * API key optional but recommended for higher rate limits.
 */

import {
  PageSpeedResult,
  PageSpeedMetrics,
  AnalyticsToolResult,
} from './types'
import { updateToolHealth, isToolConfigured } from './tool-registry'

const PAGESPEED_API_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'

/**
 * Check if PageSpeed API is available
 */
export async function checkPageSpeedAvailability(): Promise<boolean> {
  try {
    const start = Date.now()
    // Test with a simple, fast-loading URL
    const testUrl = 'https://www.google.com'
    const apiUrl = buildApiUrl(testUrl, 'mobile')

    const response = await fetch(apiUrl, {
      method: 'GET',
      signal: AbortSignal.timeout(10000),
    })

    const responseTime = Date.now() - start

    if (response.ok) {
      updateToolHealth('google-pagespeed', 'available', undefined, responseTime)
      return true
    }

    if (response.status === 429) {
      updateToolHealth('google-pagespeed', 'rate-limited', 'Rate limit exceeded')
      return false
    }

    updateToolHealth('google-pagespeed', 'unavailable', `HTTP ${response.status}`)
    return false
  } catch (error) {
    updateToolHealth('google-pagespeed', 'error', String(error))
    return false
  }
}

/**
 * Build PageSpeed API URL
 */
function buildApiUrl(
  url: string,
  strategy: 'mobile' | 'desktop'
): string {
  const params = new URLSearchParams({
    url,
    strategy,
    category: 'performance',
  })

  // Add API key if configured (increases rate limits)
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY
  if (apiKey) {
    params.set('key', apiKey)
  }

  return `${PAGESPEED_API_URL}?${params.toString()}`
}

/**
 * Parse Lighthouse metrics from API response
 */
function parseMetrics(lighthouseResult: any): PageSpeedMetrics {
  const audits = lighthouseResult?.audits || {}

  return {
    performanceScore: Math.round(
      (lighthouseResult?.categories?.performance?.score || 0) * 100
    ),
    firstContentfulPaint: parseMetricValue(audits['first-contentful-paint']),
    largestContentfulPaint: parseMetricValue(audits['largest-contentful-paint']),
    totalBlockingTime: parseMetricValue(audits['total-blocking-time']),
    cumulativeLayoutShift: parseFloat(
      audits['cumulative-layout-shift']?.numericValue?.toFixed(3) || '0'
    ),
    speedIndex: parseMetricValue(audits['speed-index']),
  }
}

function parseMetricValue(audit: any): number {
  return Math.round(audit?.numericValue || 0)
}

/**
 * Parse opportunities from audit results
 */
function parseOpportunities(audits: any): Array<{
  title: string
  description: string
  savings?: string
}> {
  const opportunityAudits = [
    'render-blocking-resources',
    'unused-css-rules',
    'unused-javascript',
    'modern-image-formats',
    'uses-optimized-images',
    'uses-text-compression',
    'uses-responsive-images',
    'efficient-animated-content',
  ]

  return opportunityAudits
    .map(id => audits[id])
    .filter(audit => audit && audit.score !== null && audit.score < 1)
    .map(audit => ({
      title: audit.title,
      description: audit.description,
      savings: audit.displayValue,
    }))
    .slice(0, 5) // Top 5 opportunities
}

/**
 * Parse diagnostics from audit results
 */
function parseDiagnostics(audits: any): Array<{
  title: string
  description: string
}> {
  const diagnosticAudits = [
    'mainthread-work-breakdown',
    'bootup-time',
    'dom-size',
    'critical-request-chains',
  ]

  return diagnosticAudits
    .map(id => audits[id])
    .filter(audit => audit && audit.score !== null && audit.score < 0.9)
    .map(audit => ({
      title: audit.title,
      description: audit.displayValue || audit.description,
    }))
}

/**
 * Analyze a URL's performance
 */
export async function analyzePageSpeed(
  url: string,
  options: {
    includeDesktop?: boolean // Also test desktop (doubles API calls)
  } = {}
): Promise<AnalyticsToolResult<PageSpeedResult>> {
  try {
    // Validate URL
    let validUrl: URL
    try {
      validUrl = new URL(url)
    } catch {
      throw new Error('Invalid URL format')
    }

    // Always get mobile results (primary for most users)
    const mobileResponse = await fetch(buildApiUrl(validUrl.toString(), 'mobile'), {
      signal: AbortSignal.timeout(60000), // PageSpeed can be slow
    })

    if (!mobileResponse.ok) {
      if (mobileResponse.status === 429) {
        updateToolHealth('google-pagespeed', 'rate-limited')
        throw new Error('PageSpeed API rate limit exceeded')
      }
      throw new Error(`PageSpeed API error: ${mobileResponse.status}`)
    }

    const mobileData = await mobileResponse.json()
    const mobileMetrics = parseMetrics(mobileData.lighthouseResult)

    // Get desktop results if requested
    let desktopMetrics: PageSpeedMetrics = {
      performanceScore: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      totalBlockingTime: 0,
      cumulativeLayoutShift: 0,
      speedIndex: 0,
    }

    if (options.includeDesktop) {
      const desktopResponse = await fetch(
        buildApiUrl(validUrl.toString(), 'desktop'),
        { signal: AbortSignal.timeout(60000) }
      )

      if (desktopResponse.ok) {
        const desktopData = await desktopResponse.json()
        desktopMetrics = parseMetrics(desktopData.lighthouseResult)
      }
    }

    const result: PageSpeedResult = {
      url: validUrl.toString(),
      mobile: mobileMetrics,
      desktop: desktopMetrics,
      opportunities: parseOpportunities(mobileData.lighthouseResult?.audits),
      diagnostics: parseDiagnostics(mobileData.lighthouseResult?.audits),
    }

    updateToolHealth('google-pagespeed', 'available')

    return {
      tool: 'google-pagespeed',
      success: true,
      data: result,
      timestamp: new Date(),
    }
  } catch (error) {
    console.error('PageSpeed error:', error)
    updateToolHealth('google-pagespeed', 'error', String(error))

    return {
      tool: 'google-pagespeed',
      success: false,
      error: String(error),
      timestamp: new Date(),
    }
  }
}

/**
 * Get a performance summary for content recommendations
 */
export async function getPerformanceSummary(
  url: string
): Promise<{
  score: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  summary: string
  recommendations: string[]
}> {
  const result = await analyzePageSpeed(url)

  if (!result.success || !result.data) {
    return {
      score: 0,
      grade: 'F',
      summary: 'Unable to analyze page performance',
      recommendations: ['Ensure the URL is accessible'],
    }
  }

  const score = result.data.mobile.performanceScore

  let grade: 'A' | 'B' | 'C' | 'D' | 'F'
  if (score >= 90) grade = 'A'
  else if (score >= 75) grade = 'B'
  else if (score >= 50) grade = 'C'
  else if (score >= 25) grade = 'D'
  else grade = 'F'

  const recommendations: string[] = []

  // Add specific recommendations based on metrics
  if (result.data.mobile.largestContentfulPaint > 2500) {
    recommendations.push('Improve LCP: Optimize images, use CDN, preload critical resources')
  }
  if (result.data.mobile.totalBlockingTime > 200) {
    recommendations.push('Reduce TBT: Split long tasks, defer non-critical JavaScript')
  }
  if (result.data.mobile.cumulativeLayoutShift > 0.1) {
    recommendations.push('Fix CLS: Set image dimensions, avoid inserting content above existing')
  }

  // Add opportunities
  result.data.opportunities.slice(0, 3).forEach(opp => {
    recommendations.push(`${opp.title}${opp.savings ? ` (potential: ${opp.savings})` : ''}`)
  })

  return {
    score,
    grade,
    summary: `Performance score: ${score}/100 (Grade ${grade})`,
    recommendations: recommendations.slice(0, 5),
  }
}

/**
 * Compare multiple URLs for competitive analysis
 */
export async function comparePageSpeeds(
  urls: string[]
): Promise<
  AnalyticsToolResult<
    Array<{
      url: string
      score: number
      grade: string
    }>
  >
> {
  try {
    const results = await Promise.all(
      urls.slice(0, 3).map(async url => {
        const analysis = await analyzePageSpeed(url)
        const score = analysis.data?.mobile.performanceScore || 0

        let grade: string
        if (score >= 90) grade = 'A'
        else if (score >= 75) grade = 'B'
        else if (score >= 50) grade = 'C'
        else if (score >= 25) grade = 'D'
        else grade = 'F'

        return { url, score, grade }
      })
    )

    return {
      tool: 'google-pagespeed',
      success: true,
      data: results,
      timestamp: new Date(),
    }
  } catch (error) {
    return {
      tool: 'google-pagespeed',
      success: false,
      error: String(error),
      timestamp: new Date(),
    }
  }
}
