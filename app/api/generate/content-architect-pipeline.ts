/**
 * Content Architect Pipeline
 *
 * Provides strategic content recommendations based on user goals.
 * Uses the Scribengine Knowledge Base to recommend services and configurations.
 * Tier decisions are HARDCODED - not AI-decided.
 *
 * Key features:
 * - Works even without analytics tools (graceful degradation)
 * - Uses different AI models based on tier
 * - Provides clear, actionable output
 * - Easy to extend for new platforms (Instagram, Facebook, Twitter, Ads)
 */

import Anthropic from '@anthropic-ai/sdk'
import { callOpenAI, OPENAI_MODELS } from './openai-client'
import {
  generateServicesContextForAI,
  getTopRecommendations,
  getAvailableServices,
  SERVICES,
} from '@/lib/scribengine-knowledge-base'
import {
  runAnalytics,
  getAnalyticsCapabilities,
  type AnalyticsRequest,
  type AggregatedAnalytics,
} from '@/lib/analytics'
import { mapAnalysisToStyleRecommendations } from '@/lib/style-recommendations'

// Anthropic client for premium tier
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Model configurations by tier
const TIER_MODELS = {
  budget: {
    analyzer: OPENAI_MODELS.GPT_4O_MINI,
    strategist: OPENAI_MODELS.GPT_4O_MINI,
    recommender: OPENAI_MODELS.GPT_4O,
  },
  standard: {
    analyzer: OPENAI_MODELS.GPT_4_1_NANO,
    strategist: OPENAI_MODELS.GPT_4O,
    recommender: 'claude-sonnet-4-5-20250929',
  },
  premium: {
    analyzer: OPENAI_MODELS.GPT_4O,
    strategist: 'claude-sonnet-4-5-20250929',
    recommender: 'claude-opus-4-20250514',
  },
} as const

// System prompts
const ANALYZER_SYSTEM = `You are an expert content strategist who deeply analyzes user requirements.

Your task is to extract and structure information about:
1. Business context (industry, company, goals)
2. Target audience (demographics, pain points, needs)
3. Content goals (awareness, leads, sales, authority)
4. Platform preferences and constraints
5. Budget and timeline considerations
6. Competitive landscape hints
7. Brand voice and style preferences

Return a structured JSON analysis:
{
  "business_context": {
    "industry": "",
    "company_type": "",
    "business_model": "",
    "growth_stage": "",
    "primary_goals": []
  },
  "audience_profile": {
    "primary_demographic": "",
    "pain_points": [],
    "desired_outcomes": [],
    "content_preferences": [],
    "platforms_used": []
  },
  "content_needs": {
    "primary_purpose": "",
    "secondary_purposes": [],
    "frequency_needed": "",
    "urgency_level": "",
    "quality_priority": ""
  },
  "constraints": {
    "budget_level": "",
    "timeline": "",
    "resources_available": "",
    "technical_requirements": []
  },
  "strategy_hints": {
    "competitors_mentioned": [],
    "inspiration_sources": [],
    "avoid_patterns": [],
    "must_include": []
  }
}`

const STRATEGIST_SYSTEM = `You are a world-class content strategist with deep knowledge of digital marketing.

You have access to the Scribengine platform's full service catalog and capabilities.
Your role is to create a strategic content plan that:

1. Addresses the user's specific goals and challenges
2. Recommends the right mix of content services
3. Provides a clear execution roadmap
4. Includes platform-specific tactics
5. Anticipates ROI and success metrics

Be specific, actionable, and prioritize recommendations by impact.
Always explain WHY each recommendation matters for their specific situation.`

const RECOMMENDER_SYSTEM = `You are an expert at matching user needs with the perfect service configuration.

Based on the user's analysis and strategy, recommend:
1. Specific Scribengine services with exact configurations
2. Optimal tier selection for each service
3. Customization options that fit their needs
4. Implementation sequence and dependencies
5. Expected outcomes and success metrics

Be specific about:
- Which service options to select
- What customizations to apply
- How services complement each other
- What to prioritize first

Format your recommendations clearly with:
- Service name and tier
- Key configurations
- Why this matches their needs
- Expected impact`

/**
 * Content Architect Input Types
 */
export interface ContentArchitectRequest {
  // User's description of their needs
  description: string

  // Optional structured inputs
  businessInfo?: {
    industry?: string
    companyName?: string
    companyDescription?: string
    companySize?: string
    website?: string
  }

  // Content goals
  goals?: string[]

  // Target platforms
  platforms?: ('blog' | 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'email' | 'ads')[]

  // Budget indication
  budgetRange?: 'starter' | 'growing' | 'established' | 'enterprise'

  // Whether user wants image generation recommendations
  includeImages?: boolean

  // Competitor URLs for analysis
  competitorUrls?: string[]

  // Additional context
  additionalContext?: string
}

export interface ContentArchitectResponse {
  success: boolean
  tier: 'budget' | 'standard' | 'premium'

  // Analysis of user needs
  analysis: {
    summary: string
    businessContext: any
    audienceProfile: any
    contentNeeds: any
  }

  // Strategic recommendations
  strategy: {
    overview: string
    primaryFocus: string
    contentPillars: string[]
    platformStrategy: Record<string, string>
    contentCalendar?: string
  }

  // Service recommendations
  recommendations: Array<{
    serviceId: string
    serviceName: string
    recommendedTier: 'budget' | 'standard' | 'premium'
    priority: 'high' | 'medium' | 'low'
    reason: string
    configurations: Record<string, any>
    estimatedImpact: string
    estimatedPrice?: number
  }>

  // Analytics insights (if available)
  analyticsInsights?: {
    toolsUsed: string[]
    toolsUnavailable: string[]
    trendData?: any
    hashtagStrategy?: any
    competitorInsights?: any
    summary: string
  }

  // SEO Intelligence (if DataForSEO available)
  seoInsights?: {
    topKeywords: Array<{ keyword: string; volume: number; difficulty: number; clicks: number; intent: string }>
    competitorDomains: Array<{ domain: string; rank: number; traffic: number; keywords: number }>
    contentGaps: Array<{ keyword: string; competitorCount: number; avgVolume: number }>
    keywordWarnings: Array<{ keyword: string; reason: string; alternatives: string[] }>
    searchIntentBreakdown: Record<string, number>
  }

  // Style option recommendations derived from analysis
  styleRecommendations?: Record<string, string>

  // Image generation recommendations (if requested)
  imageRecommendations?: {
    needed: boolean
    suggestedTool: 'dalle' | 'ideogram'
    reason: string
    styleRecommendations: string[]
  }

  // Execution plan
  executionPlan: {
    phase1: string[]
    phase2: string[]
    phase3: string[]
    quickWins: string[]
  }

  // Metadata
  metadata: {
    generatedAt: string
    modelUsed: string
    analyticsConfidence: 'high' | 'medium' | 'low'
    warnings: string[]
  }
}

/**
 * Run the Content Architect Pipeline
 * Tier is HARDCODED based on user selection - not AI-decided
 */
export async function runContentArchitectPipeline(
  request: ContentArchitectRequest,
  tier: 'budget' | 'standard' | 'premium'
): Promise<ContentArchitectResponse> {
  console.log(`🏗️ CONTENT ARCHITECT [${tier.toUpperCase()} TIER]: Starting analysis...`)

  const warnings: string[] = []
  const models = TIER_MODELS[tier]

  // ========== STAGE 1: ANALYZE USER REQUIREMENTS ==========
  console.log('📊 Stage 1: Analyzing requirements...')

  const analysisPrompt = buildAnalysisPrompt(request)
  let analysis: any

  try {
    const analysisResult = await callOpenAI(
      models.analyzer,
      ANALYZER_SYSTEM,
      analysisPrompt,
      4000
    )

    const jsonMatch = analysisResult.match(/\{[\s\S]*\}/)
    analysis = JSON.parse(jsonMatch ? jsonMatch[0] : analysisResult)
  } catch (error) {
    console.error('Analysis parsing error:', error)
    analysis = buildFallbackAnalysis(request)
    warnings.push('Used simplified analysis due to parsing error')
  }

  console.log('✅ Analysis complete')

  // ========== STAGE 2: RUN ANALYTICS (with graceful degradation) ==========
  console.log('📈 Stage 2: Running analytics...')

  let analyticsData: AggregatedAnalytics | null = null
  const analyticsCapabilities = getAnalyticsCapabilities(tier)

  // Only run analytics for standard and premium tiers
  if (tier !== 'budget' && analyticsCapabilities.available.length > 0) {
    try {
      // Use AI analysis results (Stage 1) to build meaningful analytics queries
      // instead of naive word extraction from raw description/goals
      const analyzedIndustry = analysis.business_context?.industry
        || request.businessInfo?.industry || ''
      const analyzedCompanyType = analysis.business_context?.company_type || ''
      const companyName = request.businessInfo?.companyName || ''

      // Build a concise topic for SEO seed keyword generation.
      // Avoid long compounds like "MarTech AI content generation platform" which produce
      // generic seeds ("content generation") that DataForSEO expands into unrelated keywords.
      // If company_type is already descriptive (>2 words), use it alone instead of
      // prepending industry, which just makes the topic longer and more diluted.
      const companyTypeWords = analyzedCompanyType.split(/\s+/).filter((w: string) => w.length > 0)
      const analyticsTopic = analyzedIndustry
        ? companyTypeWords.length > 2
          ? analyzedCompanyType  // Already descriptive, e.g. "AI content generation platform"
          : `${analyzedIndustry} ${analyzedCompanyType || 'services'}`.trim()
        : request.description.slice(0, 200)

      // Build keywords from AI analysis (industry, pain points, audience)
      // instead of naive word extraction from goal text
      const intelligentKeywords = buildAnalyticsKeywords(analysis, request)

      // Generate AI-powered SEO seeds — these are customer search terms, not business jargon.
      // Critical for no-website case; also supplements site-based keywords when website exists.
      const seoSeeds = await generateSEOSeeds(analysis, request)

      const analyticsRequest: AnalyticsRequest = {
        topic: analyticsTopic,
        keywords: intelligentKeywords,
        competitorUrls: request.competitorUrls,
        targetPlatform: request.platforms?.[0] as any,
        userTier: tier,
        industry: analyzedIndustry || request.businessInfo?.industry,
        companyName: request.businessInfo?.companyName,
        companyType: analyzedCompanyType || undefined,
        businessDescription: request.businessInfo?.companyDescription || request.description,
        userKeywords: intelligentKeywords,
        goals: request.goals?.join(', '),
        targetUrl: request.businessInfo?.website || undefined,
        seoSeeds,
      }

      console.log(`[SEO] Target URL for keyword discovery: ${analyticsRequest.targetUrl || '(none - will use seed-based discovery)'}`)

      const analyticsResponse = await runAnalytics(analyticsRequest)
      analyticsData = analyticsResponse.data

      if (analyticsResponse.warnings.length > 0) {
        warnings.push(...analyticsResponse.warnings)
      }
    } catch (error) {
      console.warn('Analytics failed (continuing without):', error)
      warnings.push('Analytics unavailable - recommendations based on best practices')
    }
  } else if (tier === 'budget') {
    warnings.push('Analytics tools available in Standard and Premium tiers')
  }

  console.log('✅ Analytics complete')

  // ========== STAGE 3: GENERATE STRATEGY ==========
  console.log('🎯 Stage 3: Generating strategy...')

  const servicesContext = generateServicesContextForAI(tier)
  const strategyPrompt = buildStrategyPrompt(request, analysis, analyticsData, servicesContext)
  let strategy: any

  if (tier === 'premium' && models.strategist.includes('claude')) {
    // Use Claude for premium tier strategy
    const strategyResponse = await anthropic.messages.create({
      model: models.strategist as string,
      max_tokens: 6000,
      messages: [{
        role: 'user',
        content: `${STRATEGIST_SYSTEM}\n\n${strategyPrompt}`
      }]
    })
    strategy = parseStrategyResponse(
      strategyResponse.content[0].type === 'text' ? strategyResponse.content[0].text : ''
    )
  } else {
    // Use OpenAI for budget/standard
    const strategyResult = await callOpenAI(
      models.strategist as string,
      STRATEGIST_SYSTEM,
      strategyPrompt,
      6000
    )
    strategy = parseStrategyResponse(strategyResult)
  }

  console.log('✅ Strategy complete')

  // ========== STAGE 4: GENERATE SERVICE RECOMMENDATIONS ==========
  console.log('📦 Stage 4: Generating recommendations...')

  const recommendationsPrompt = buildRecommendationsPrompt(
    request,
    analysis,
    strategy,
    analyticsData,
    tier
  )
  let recommendations: any[]

  if (tier === 'premium' && models.recommender.includes('claude')) {
    // Use Claude Opus for premium recommendations
    const recResponse = await anthropic.messages.create({
      model: models.recommender as string,
      max_tokens: 8000,
      messages: [{
        role: 'user',
        content: `${RECOMMENDER_SYSTEM}\n\n${recommendationsPrompt}`
      }]
    })
    recommendations = parseRecommendations(
      recResponse.content[0].type === 'text' ? recResponse.content[0].text : ''
    )
  } else if (tier === 'standard' && models.recommender.includes('claude')) {
    // Use Claude Sonnet for standard
    const recResponse = await anthropic.messages.create({
      model: models.recommender as string,
      max_tokens: 6000,
      messages: [{
        role: 'user',
        content: `${RECOMMENDER_SYSTEM}\n\n${recommendationsPrompt}`
      }]
    })
    recommendations = parseRecommendations(
      recResponse.content[0].type === 'text' ? recResponse.content[0].text : ''
    )
  } else {
    // Use OpenAI for budget
    const recResult = await callOpenAI(
      models.recommender as string,
      RECOMMENDER_SYSTEM,
      recommendationsPrompt,
      6000
    )
    recommendations = parseRecommendations(recResult)
  }

  // Enrich recommendations with knowledge base data
  recommendations = enrichRecommendations(recommendations, tier)

  console.log('✅ Recommendations complete')

  // ========== STAGE 5: IMAGE RECOMMENDATIONS (if requested) ==========
  let imageRecommendations: ContentArchitectResponse['imageRecommendations'] = undefined

  if (request.includeImages) {
    console.log('🖼️ Stage 5: Analyzing image needs...')
    imageRecommendations = generateImageRecommendations(request, analysis, strategy)
    console.log('✅ Image recommendations complete')
  }

  // ========== STAGE 6: BUILD EXECUTION PLAN ==========
  console.log('📋 Stage 6: Building execution plan...')
  const executionPlan = buildExecutionPlan(recommendations, strategy, tier)
  console.log('✅ Execution plan complete')

  // ========== BUILD FINAL RESPONSE ==========
  console.log('🏗️ CONTENT ARCHITECT: Complete!')

  // Build SEO insights data
  const seoInsightsData = analyticsData?.seoAnalysis && analyticsData.seoAnalysis.dataSource === 'dataforseo' ? {
    topKeywords: analyticsData.seoAnalysis.suggestedKeywords.slice(0, 20).map(k => ({
      keyword: k.keyword,
      volume: k.searchVolume,
      difficulty: k.difficulty,
      clicks: k.clicks,
      intent: k.searchIntent,
    })),
    competitorDomains: analyticsData.seoAnalysis.discoveredCompetitors.map(c => ({
      domain: c.domain,
      rank: c.rank,
      traffic: c.organicTraffic,
      keywords: c.keywords,
    })),
    contentGaps: analyticsData.seoAnalysis.contentGaps.slice(0, 10),
    keywordWarnings: analyticsData.seoAnalysis.flaggedKeywords.map(f => ({
      keyword: f.keyword,
      reason: f.reason,
      alternatives: f.suggestedAlternatives.map(a => a.keyword),
    })),
    searchIntentBreakdown: analyticsData.seoAnalysis.searchIntentBreakdown,
  } : undefined

  // Derive style recommendations from analysis
  const styleRecommendations = mapAnalysisToStyleRecommendations(
    analysis,
    strategy,
    seoInsightsData
  )

  return {
    success: true,
    tier,
    analysis: {
      summary: analysis.content_needs?.primary_purpose || 'Content strategy analysis complete',
      businessContext: analysis.business_context || {},
      audienceProfile: analysis.audience_profile || {},
      contentNeeds: analysis.content_needs || {},
    },
    strategy: {
      overview: strategy.overview || 'Strategic plan generated',
      primaryFocus: strategy.primaryFocus || analysis.content_needs?.primary_purpose || '',
      contentPillars: strategy.contentPillars || [],
      platformStrategy: strategy.platformStrategy || {},
      contentCalendar: strategy.contentCalendar,
    },
    recommendations,
    analyticsInsights: analyticsData ? {
      toolsUsed: analyticsData.toolsUsed,
      toolsUnavailable: analyticsData.toolsUnavailable,
      trendData: analyticsData.trends,
      hashtagStrategy: analyticsData.hashtags,
      competitorInsights: analyticsData.pageSpeed,
      summary: analyticsData.summary,
    } : undefined,
    seoInsights: seoInsightsData,
    styleRecommendations: Object.keys(styleRecommendations).length > 0 ? styleRecommendations : undefined,
    imageRecommendations,
    executionPlan,
    metadata: {
      generatedAt: new Date().toISOString(),
      modelUsed: tier === 'premium' ? 'Claude Opus' : tier === 'standard' ? 'Claude Sonnet' : 'GPT-4o',
      analyticsConfidence: analyticsData?.confidence || 'low',
      warnings,
    },
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function buildAnalysisPrompt(request: ContentArchitectRequest): string {
  let prompt = `Analyze this content request and extract structured information.\n\n`
  prompt += `## User's Description\n${request.description}\n\n`

  if (request.businessInfo) {
    prompt += `## Business Information\n${JSON.stringify(request.businessInfo, null, 2)}\n\n`
  }

  if (request.goals?.length) {
    prompt += `## Stated Goals\n${request.goals.join(', ')}\n\n`
  }

  if (request.platforms?.length) {
    prompt += `## Target Platforms\n${request.platforms.join(', ')}\n\n`
  }

  if (request.budgetRange) {
    prompt += `## Budget Range\n${request.budgetRange}\n\n`
  }

  if (request.additionalContext) {
    prompt += `## Additional Context\n${request.additionalContext}\n\n`
  }

  prompt += `\nProvide your analysis as JSON.`
  return prompt
}

export function buildFallbackAnalysis(request: ContentArchitectRequest): any {
  return {
    business_context: {
      industry: request.businessInfo?.industry || 'General',
      company_type: request.businessInfo?.companySize || 'Small Business',
      company_description: request.businessInfo?.companyDescription || '',
      primary_goals: request.goals || ['content creation'],
    },
    audience_profile: {
      primary_demographic: 'General audience',
      platforms_used: request.platforms || ['blog'],
    },
    content_needs: {
      primary_purpose: 'content creation',
      quality_priority: 'balanced',
    },
    constraints: {
      budget_level: request.budgetRange || 'starter',
    },
    strategy_hints: {},
  }
}

/**
 * Build analytics keywords from AI analysis output instead of naive word extraction.
 *
 * The old extractKeywords() split goal text into individual words like "build", "local",
 * "awareness" which DataForSEO expanded into unrelated tech keywords. This function
 * uses the structured AI analysis to produce industry-relevant compound phrases.
 */
function buildAnalyticsKeywords(analysis: any, request: ContentArchitectRequest): string[] {
  const keywords: string[] = []
  const seen = new Set<string>()

  const addKeyword = (kw: string) => {
    const normalized = kw.toLowerCase().trim()
    if (normalized && normalized.length > 2 && !seen.has(normalized)) {
      seen.add(normalized)
      keywords.push(normalized)
    }
  }

  const bc = analysis.business_context || {}
  const ap = analysis.audience_profile || {}

  // Industry term (e.g., "finance")
  if (bc.industry) addKeyword(bc.industry)

  // Industry + company type compound (e.g., "finance consultancy")
  // Skip when company_type is already a long phrase (>3 words) to avoid
  // diluted compounds like "MarTech AI content generation platform"
  if (bc.industry && bc.company_type && bc.company_type !== bc.industry) {
    const typeWords = bc.company_type.split(/\s+/)
    if (typeWords.length <= 3) {
      addKeyword(`${bc.industry} ${bc.company_type}`)
    } else {
      // Long company_type: use it standalone (it's descriptive enough)
      addKeyword(bc.company_type)
    }
  }

  // Company description provides customer-facing context (e.g., "AI-powered tools for marketing teams")
  if (bc.company_description || request.businessInfo?.companyDescription) {
    const desc = (bc.company_description || request.businessInfo?.companyDescription || '').toLowerCase()
    // Extract meaningful 2-3 word phrases from the description
    const descWords = desc.replace(/[^\w\s-]/g, ' ').split(/\s+/).filter((w: string) => w.length > 3)
    const noiseWords = new Set(['that', 'with', 'from', 'this', 'does', 'your', 'what', 'they', 'their', 'have', 'been', 'also', 'into', 'more', 'than', 'very', 'just', 'like', 'make', 'help', 'each', 'such', 'tool', 'tools', 'platform', 'software', 'system', 'solution', 'product', 'powered', 'based'])
    const meaningful = descWords.filter((w: string) => !noiseWords.has(w))
    // Add up to 2 two-word phrases from adjacent meaningful words
    let added = 0
    for (let i = 0; i < meaningful.length - 1 && added < 2; i++) {
      addKeyword(`${meaningful[i]} ${meaningful[i + 1]}`)
      added++
    }
  }

  // Audience pain points (already extracted by the AI, e.g., "IRS audit", "tax planning")
  if (Array.isArray(ap.pain_points)) {
    for (const pp of ap.pain_points.slice(0, 5)) {
      addKeyword(pp)
    }
  }

  // Desired outcomes (e.g., "tax relief", "business formation")
  if (Array.isArray(ap.desired_outcomes)) {
    for (const outcome of ap.desired_outcomes.slice(0, 5)) {
      addKeyword(outcome)
    }
  }

  // Business model if meaningful
  if (bc.business_model) addKeyword(bc.business_model)

  // Fallback: use explicit industry from form data if AI analysis was empty
  if (keywords.length === 0 && request.businessInfo?.industry) {
    addKeyword(request.businessInfo.industry)
  }

  // Last resort: use company name as a keyword
  if (keywords.length === 0 && request.businessInfo?.companyName) {
    addKeyword(request.businessInfo.companyName)
  }

  return keywords.slice(0, 10)
}

/**
 * Generate SEO seed keywords using AI.
 *
 * The key insight: mechanical word extraction from business descriptions produces
 * INTERNAL business jargon ("AI content generation platform", "MarTech").
 * But SEO needs CUSTOMER search terms — what people actually type into Google
 * ("ai writing tool", "ai blog writer", "content creation software").
 *
 * This function uses a lightweight LLM call to bridge that gap.
 */
async function generateSEOSeeds(
  analysis: any,
  request: ContentArchitectRequest
): Promise<string[]> {
  const industry = analysis.business_context?.industry || request.businessInfo?.industry || ''
  const companyType = analysis.business_context?.company_type || ''
  const companyDesc = request.businessInfo?.companyDescription || request.description
  const painPoints = analysis.audience_profile?.pain_points || []

  const desiredOutcomes = analysis.audience_profile?.desired_outcomes || []

  const prompt = `Based on this business, generate 15 search terms (3-4 words each) that potential CUSTOMERS would type into Google to find products/services like this.

Business: ${companyDesc}
Industry: ${industry}
What the business offers: ${companyType}
Customer pain points: ${painPoints.slice(0, 3).join(', ')}
Desired outcomes: ${desiredOutcomes.slice(0, 3).join(', ')}

Rules:
- Each term should be 3-4 words, like real Google searches
- Focus on what CUSTOMERS search for, not internal business terminology
- Do NOT include the company name
- Do NOT include terms for DIFFERENT products/services even if they share similar words
  (e.g., if the business creates content, do NOT include terms about content detection)
- Do NOT include generic marketing terms like "digital marketing" unless that IS the product

Include a mix of:
- Problem-aware searches (people who have a problem this business solves)
- Solution-aware searches (people looking for this type of product/service)
- Comparison searches (people comparing options in this category)

Return ONLY a JSON array of strings, no explanation.`

  try {
    const result = await callOpenAI(
      OPENAI_MODELS.GPT_4O_MINI,
      'You are an SEO keyword researcher. Return only valid JSON.',
      prompt,
      500
    )
    const jsonMatch = result.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const seeds = JSON.parse(jsonMatch[0]) as string[]
      console.log(`[SEO] AI-generated seeds: ${seeds.join(', ')}`)
      return seeds.filter(s => typeof s === 'string' && s.length > 2).slice(0, 15)
    }
  } catch (error) {
    console.warn('[SEO] Failed to generate AI seeds:', error)
  }
  return []
}

function buildStrategyPrompt(
  request: ContentArchitectRequest,
  analysis: any,
  analytics: AggregatedAnalytics | null,
  servicesContext: string
): string {
  let prompt = `## Scribengine Services Available\n${servicesContext}\n\n`
  prompt += `## User Analysis\n${JSON.stringify(analysis, null, 2)}\n\n`
  prompt += `## User's Original Request\n${request.description}\n\n`

  if (analytics) {
    prompt += `## Analytics Insights\n${analytics.summary}\n\n`
    if (analytics.trends) {
      prompt += `### Trend Data\n${JSON.stringify(analytics.trends, null, 2)}\n\n`
    }

    if (analytics.seoAnalysis && analytics.seoAnalysis.dataSource === 'dataforseo') {
      const seo = analytics.seoAnalysis
      prompt += `## SEO Intelligence\n`

      if (seo.suggestedKeywords.length > 0) {
        prompt += `### Keyword Opportunities (with volume, difficulty, intent)\n`
        for (const kw of seo.suggestedKeywords.slice(0, 10)) {
          const clicksPart = kw.clicks > 0 ? `, Clicks: ${kw.clicks}` : ''
          prompt += `- "${kw.keyword}" — Vol: ${kw.searchVolume}, Diff: ${kw.difficulty}${clicksPart}, Intent: ${kw.searchIntent}\n`
        }
        prompt += `\n`
      }

      if (seo.discoveredCompetitors.length > 0) {
        prompt += `### Competitor Landscape\n`
        for (const c of seo.discoveredCompetitors) {
          prompt += `- ${c.domain} — Rank: ${c.rank}, Traffic: ${c.organicTraffic}, Keywords: ${c.keywords}\n`
        }
        prompt += `\n`
      }

      if (seo.contentGaps.length > 0) {
        prompt += `### Content Gaps (keywords competitors rank for but user doesn't)\n`
        for (const gap of seo.contentGaps.slice(0, 10)) {
          prompt += `- "${gap.keyword}" — ${gap.competitorCount} competitors, avg vol: ${gap.avgVolume}\n`
        }
        prompt += `\n`
      }

      if (seo.flaggedKeywords.length > 0) {
        prompt += `### Keyword Warnings\n`
        for (const flag of seo.flaggedKeywords) {
          prompt += `- "${flag.keyword}" — ${flag.reason}\n`
        }
        prompt += `\n`
      }
    }
  }

  prompt += `## Your Task
Create a comprehensive content strategy that:
1. Addresses their specific business goals
2. Recommends specific Scribengine services
3. Provides platform-specific tactics
4. Includes a phased execution plan

Format your response with these sections:
- OVERVIEW: 2-3 sentence strategic summary
- PRIMARY FOCUS: The #1 thing they should prioritize
- CONTENT PILLARS: 3-5 content themes to build around
- PLATFORM STRATEGY: Specific tactics for each relevant platform
- CONTENT CALENDAR: Recommended publishing cadence`

  return prompt
}

export function parseStrategyResponse(response: string): any {
  const strategy: any = {
    overview: '',
    primaryFocus: '',
    contentPillars: [],
    platformStrategy: {},
    contentCalendar: '',
  }

  // Use explicit section names as boundaries (no /i flag — section headers are always ALL CAPS)
  const SECTIONS = 'OVERVIEW|PRIMARY FOCUS|CONTENT PILLARS|PLATFORM STRATEGY|CONTENT CALENDAR'
  const boundary = `\\*{0,2}(?:${SECTIONS})\\*{0,2}`

  // Extract overview
  const overviewMatch = response.match(new RegExp(`\\*{0,2}OVERVIEW\\*{0,2}[:\\s]*([^\\n]+(?:\\n(?!${boundary})[^\\n]+)*)`))
  if (overviewMatch) strategy.overview = overviewMatch[1].trim()

  // Extract primary focus
  const focusMatch = response.match(new RegExp(`\\*{0,2}PRIMARY FOCUS\\*{0,2}[:\\s]*([^\\n]+(?:\\n(?!${boundary})[^\\n]+)*)`))
  if (focusMatch) strategy.primaryFocus = focusMatch[1].trim()

  // Extract content pillars
  const pillarsMatch = response.match(new RegExp(`\\*{0,2}CONTENT PILLARS\\*{0,2}[:\\s]*([\\s\\S]*?)(?=\\n${boundary}|$)`))
  if (pillarsMatch) {
    const pillarsText = pillarsMatch[1]
    const lines = pillarsText.split('\n')
    const pillars: string[] = []
    for (const line of lines) {
      if (!line.trim()) continue
      // Skip indented sub-bullets (lines starting with 2+ spaces then a dash/bullet)
      if (/^\s{2,}[-•*]/.test(line)) continue
      const trimmed = line.trim()
      // Match numbered items: "1. ...", "1) ...", or bullet items: "- ...", "• ...", "* ..."
      const numberedMatch = trimmed.match(/^\d+[.)]\s+(.+)/)
      const bulletMatch = trimmed.match(/^[-•*]\s+(.+)/)
      if (numberedMatch) {
        pillars.push(numberedMatch[1].replace(/^["\u201C]|["\u201D]$/g, '').trim())
      } else if (bulletMatch) {
        pillars.push(bulletMatch[1].replace(/^["\u201C]|["\u201D]$/g, '').trim())
      }
    }
    strategy.contentPillars = pillars
  }

  // Extract platform strategy — line-by-line parsing to avoid complex regex issues
  const platformMatch = response.match(new RegExp(`\\*{0,2}PLATFORM STRATEGY\\*{0,2}[:\\s]*([\\s\\S]*?)(?=\\n${boundary}|$)`))
  if (platformMatch) {
    const platformText = platformMatch[1]
    const knownPlatforms = ['blog', 'instagram', 'twitter', 'facebook', 'linkedin', 'email']
    const lines = platformText.split('\n')
    let currentPlatform: string | null = null
    const platformBlocks: Record<string, string[]> = {}

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue

      // Check if this line starts a new known platform
      let matchedPlatform: string | null = null
      let contentAfterName = ''

      for (const p of knownPlatforms) {
        const re = new RegExp(`^\\*{0,2}${p}\\*{0,2}\\s*:\\s*(.*)`, 'i')
        const m = trimmed.match(re)
        if (m) {
          matchedPlatform = p
          contentAfterName = m[1]
          break
        }
      }
      // Also check for X / X (Twitter)
      if (!matchedPlatform) {
        const xMatch = trimmed.match(/^\*{0,2}X\s*(?:\(Twitter\))?\*{0,2}\s*:\s*(.*)/i)
        if (xMatch) {
          matchedPlatform = 'twitter'
          contentAfterName = xMatch[1]
        }
      }

      if (matchedPlatform) {
        currentPlatform = matchedPlatform
        platformBlocks[currentPlatform] = contentAfterName ? [contentAfterName] : []
      } else if (currentPlatform) {
        platformBlocks[currentPlatform].push(trimmed)
      }
    }

    for (const [key, contentLines] of Object.entries(platformBlocks)) {
      if (contentLines.length > 0) {
        strategy.platformStrategy[key] = contentLines.join('\n')
      }
    }
  }

  // Extract content calendar
  const calendarMatch = response.match(new RegExp(`\\*{0,2}CONTENT CALENDAR\\*{0,2}[:\\s]*([\\s\\S]*?)(?=\\n${boundary}|$)`))
  if (calendarMatch) strategy.contentCalendar = calendarMatch[1].trim()

  return strategy
}

function buildRecommendationsPrompt(
  request: ContentArchitectRequest,
  analysis: any,
  strategy: any,
  analytics: AggregatedAnalytics | null,
  tier: 'budget' | 'standard' | 'premium'
): string {
  const availableServices = getAvailableServices()

  let prompt = `## Available Services\n`
  availableServices.forEach(serviceConfig => {
    prompt += `\n### ${serviceConfig.name} (${serviceConfig.id})\n`
    prompt += `${serviceConfig.description}\n`
    prompt += `Tiers: ${Object.keys(serviceConfig.tiers).join(', ')}\n`
    prompt += `Best for: ${serviceConfig.recommendWhen.goals.join(', ')}\n`
  })

  prompt += `\n## User Analysis\n${JSON.stringify(analysis, null, 2)}\n\n`
  prompt += `## Strategy\n${JSON.stringify(strategy, null, 2)}\n\n`
  prompt += `## User's Original Request\n${request.description}\n\n`
  prompt += `## User's Selected Tier: ${tier}\n\n`

  if (analytics?.hashtags) {
    prompt += `## Hashtag Strategy Available\nTotal reach: ${analytics.hashtags.totalReach}\n`
    prompt += `Strategy: ${analytics.hashtags.strategy}\n\n`
  }

  if (analytics?.seoAnalysis && analytics.seoAnalysis.dataSource === 'dataforseo') {
    const seo = analytics.seoAnalysis
    prompt += `## SEO Data Available\n`
    if (seo.suggestedKeywords.length > 0) {
      prompt += `Top keyword targets: ${seo.suggestedKeywords.slice(0, 5).map(k => `"${k.keyword}" (vol: ${k.searchVolume})`).join(', ')}\n`
    }
    if (seo.contentGaps.length > 0) {
      prompt += `Content gaps to fill: ${seo.contentGaps.slice(0, 5).map(g => `"${g.keyword}"`).join(', ')}\n`
    }
    if (Object.keys(seo.searchIntentBreakdown).length > 0) {
      prompt += `Search intent mix: ${JSON.stringify(seo.searchIntentBreakdown)}\n`
    }
    prompt += `\nUse this SEO data to suggest specific keyword targets for each service recommendation.\n\n`
  }

  prompt += `## Your Task
Recommend 3-5 Scribengine services with:
1. Service ID (exact match from available services)
2. Recommended tier (budget/standard/premium)
3. Priority (high/medium/low)
4. Specific reason why this service fits their needs
5. Key configurations to set
6. Expected impact

Format as JSON array:
[
  {
    "serviceId": "service-id",
    "serviceName": "Display Name",
    "recommendedTier": "standard",
    "priority": "high",
    "reason": "Because...",
    "configurations": { "key": "value" },
    "estimatedImpact": "Expected result..."
  }
]`

  return prompt
}

function parseRecommendations(response: string): any[] {
  try {
    // Try to extract JSON array
    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch {}

  // Fallback: return basic recommendations
  return [
    {
      serviceId: 'blog-post',
      serviceName: 'Blog Post',
      recommendedTier: 'standard',
      priority: 'high',
      reason: 'Core content for online presence',
      configurations: {},
      estimatedImpact: 'Improved SEO and authority',
    }
  ]
}

function enrichRecommendations(
  recommendations: any[],
  tier: 'budget' | 'standard' | 'premium'
): any[] {
  return recommendations.map(rec => {
    const serviceConfig = SERVICES[rec.serviceId]

    if (serviceConfig) {
      const tierConfig = serviceConfig.tiers[rec.recommendedTier as keyof typeof serviceConfig.tiers]
      return {
        ...rec,
        serviceName: serviceConfig.name,
        estimatedPrice: tierConfig?.price,
        features: tierConfig?.features || [],
      }
    }

    return rec
  })
}

function generateImageRecommendations(
  request: ContentArchitectRequest,
  analysis: any,
  strategy: any
): ContentArchitectResponse['imageRecommendations'] {
  const platforms = request.platforms || []
  const needsImages = platforms.some(p =>
    ['instagram', 'facebook', 'twitter'].includes(p)
  )

  if (!needsImages && !request.includeImages) {
    return {
      needed: false,
      suggestedTool: 'dalle',
      reason: 'No image-heavy platforms selected',
      styleRecommendations: [],
    }
  }

  // Determine best tool based on content type
  const hasTextOverlay = platforms.includes('instagram')
  const suggestedTool = hasTextOverlay ? 'ideogram' : 'dalle'

  const styleRecommendations: string[] = []

  if (platforms.includes('instagram')) {
    styleRecommendations.push('Use 4:5 aspect ratio for feed posts')
    styleRecommendations.push('9:16 for Stories and Reels')
    styleRecommendations.push('Consistent brand colors and fonts')
  }

  if (platforms.includes('blog')) {
    styleRecommendations.push('16:9 for featured images')
    styleRecommendations.push('Minimize text on images for blog')
  }

  return {
    needed: true,
    suggestedTool,
    reason: suggestedTool === 'ideogram'
      ? 'Ideogram excels at text overlays and graphic design'
      : 'DALL-E 3 provides photorealistic imagery',
    styleRecommendations,
  }
}

function buildExecutionPlan(
  recommendations: any[],
  strategy: any,
  tier: 'budget' | 'standard' | 'premium'
): ContentArchitectResponse['executionPlan'] {
  const highPriority = recommendations.filter(r => r.priority === 'high')
  const mediumPriority = recommendations.filter(r => r.priority === 'medium')
  const lowPriority = recommendations.filter(r => r.priority === 'low')

  return {
    phase1: highPriority.map(r => `Set up ${r.serviceName} (${r.recommendedTier} tier)`),
    phase2: mediumPriority.map(r => `Implement ${r.serviceName}`),
    phase3: lowPriority.map(r => `Expand with ${r.serviceName}`),
    quickWins: [
      'Audit existing content for optimization opportunities',
      'Set up content calendar',
      'Define brand voice guidelines',
      ...(tier !== 'budget' ? ['Configure analytics tracking'] : []),
    ],
  }
}

/**
 * Format the Content Architect response for display
 */
export function formatContentArchitectOutput(
  response: ContentArchitectResponse
): string {
  const sections: string[] = []

  // Header
  sections.push(`
╔══════════════════════════════════════════════════════════════════╗
║                    🏗️ CONTENT ARCHITECT                          ║
║                    Strategic Content Plan                        ║
╚══════════════════════════════════════════════════════════════════╝
`)

  // Analysis Summary
  const contextEntries = response.analysis.businessContext
    ? Object.entries(response.analysis.businessContext)
        .filter(([, v]) => v !== null && v !== undefined && v !== '')
        .map(([k, v]) => `• ${k.replace(/_/g, ' ')}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
        .join('\n')
    : ''
  sections.push(`
📊 ANALYSIS SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${response.analysis.summary}
${contextEntries ? `\nBusiness Context:\n${contextEntries}` : ''}
`)

  // Strategy
  sections.push(`
🎯 STRATEGIC OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${response.strategy.overview}

Primary Focus: ${response.strategy.primaryFocus}

Content Pillars:
${response.strategy.contentPillars.map((p, i) => `  ${i + 1}. ${p}`).join('\n')}
`)

  // Platform Strategy
  if (Object.keys(response.strategy.platformStrategy).length > 0) {
    sections.push(`
📱 PLATFORM STRATEGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${Object.entries(response.strategy.platformStrategy)
  .map(([platform, strategy]) => `${platform.toUpperCase()}: ${strategy}`)
  .join('\n\n')}
`)
  }

  // Recommendations
  sections.push(`
📦 SERVICE RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)

  response.recommendations.forEach((rec, index) => {
    const priorityEmoji = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢'
    sections.push(`
${index + 1}. ${rec.serviceName} ${priorityEmoji}
   Tier: ${rec.recommendedTier.toUpperCase()}
   ${rec.estimatedPrice ? `Price: $${rec.estimatedPrice}` : ''}

   Why: ${rec.reason}

   Impact: ${rec.estimatedImpact}
`)
  })

  // Analytics Insights
  if (response.analyticsInsights) {
    sections.push(`
📈 ANALYTICS INSIGHTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${response.analyticsInsights.summary}

Tools Used: ${response.analyticsInsights.toolsUsed.join(', ') || 'None'}
${response.analyticsInsights.toolsUnavailable.length > 0
  ? `\nNote: Some tools were unavailable (${response.analyticsInsights.toolsUnavailable.join(', ')})`
  : ''}
`)
  }

  // SEO Intelligence
  if (response.seoInsights) {
    const seo = response.seoInsights
    let seoContent = ''

    if (seo.topKeywords.length > 0) {
      seoContent += `Keyword Opportunities:\n`
      for (const kw of seo.topKeywords) {
        const hasClicks = kw.clicks > 0
        seoContent += `  ${kw.keyword} — Volume: ${kw.volume}, Difficulty: ${kw.difficulty}${hasClicks ? `, Clicks: ${kw.clicks}` : ''}, Intent: ${kw.intent}\n`
      }
      seoContent += '\n'
    }

    if (seo.competitorDomains.length > 0) {
      seoContent += `Competitor Domains:\n`
      for (const c of seo.competitorDomains) {
        seoContent += `  ${c.domain} — Rank: ${c.rank}, Traffic: ${c.traffic}, Keywords: ${c.keywords}\n`
      }
      seoContent += '\n'
    }

    if (seo.contentGaps.length > 0) {
      seoContent += `Content Gaps:\n`
      for (const gap of seo.contentGaps) {
        seoContent += `  "${gap.keyword}" — ${gap.competitorCount} competitors, Avg Volume: ${gap.avgVolume}\n`
      }
      seoContent += '\n'
    }

    if (seo.keywordWarnings.length > 0) {
      seoContent += `Keyword Warnings:\n`
      for (const w of seo.keywordWarnings) {
        seoContent += `  "${w.keyword}" — ${w.reason}\n`
        if (w.alternatives.length > 0) {
          seoContent += `    Alternatives: ${w.alternatives.join(', ')}\n`
        }
      }
      seoContent += '\n'
    }

    if (Object.keys(seo.searchIntentBreakdown).length > 0) {
      seoContent += `Search Intent Breakdown:\n`
      for (const [intent, count] of Object.entries(seo.searchIntentBreakdown)) {
        seoContent += `  ${intent}: ${count} keywords\n`
      }
    }

    if (seoContent) {
      sections.push(`
🔍 SEO INTELLIGENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${seoContent}`)
    }
  }

  // Image Recommendations
  if (response.imageRecommendations?.needed) {
    sections.push(`
🖼️ IMAGE RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Recommended Tool: ${response.imageRecommendations.suggestedTool.toUpperCase()}
Reason: ${response.imageRecommendations.reason}

Style Guidelines:
${response.imageRecommendations.styleRecommendations.map(s => `• ${s}`).join('\n')}
`)
  }

  // Execution Plan
  sections.push(`
📋 EXECUTION PLAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ QUICK WINS (Start Now):
${response.executionPlan.quickWins.map(w => `  • ${w}`).join('\n')}

📍 PHASE 1 (Priority):
${response.executionPlan.phase1.map(p => `  • ${p}`).join('\n') || '  • No high-priority items'}

📍 PHASE 2 (Build On Success):
${response.executionPlan.phase2.map(p => `  • ${p}`).join('\n') || '  • No medium-priority items'}

📍 PHASE 3 (Expand):
${response.executionPlan.phase3.map(p => `  • ${p}`).join('\n') || '  • No low-priority items'}
`)

  // Footer
  sections.push(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated: ${new Date(response.metadata.generatedAt).toLocaleString()}
Tier: ${response.tier.toUpperCase()} | Model: ${response.metadata.modelUsed}
Confidence: ${response.metadata.analyticsConfidence.toUpperCase()}
${response.metadata.warnings.length > 0 ? `\n⚠️ Notes: ${response.metadata.warnings.join('; ')}` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)

  return sections.join('\n')
}
