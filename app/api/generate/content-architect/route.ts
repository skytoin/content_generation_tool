import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-utils'
import {
  runContentArchitectPipeline,
  formatContentArchitectOutput,
  type ContentArchitectRequest,
  type ContentArchitectResponse,
} from '../content-architect-pipeline'
import {
  validateContentArchitectOptions,
  contentArchitectTiers,
} from '../content-architect-options'

export const maxDuration = 120 // 2 minutes max for API route

/**
 * POST /api/generate/content-architect
 *
 * Generate strategic content recommendations using the Content Architect pipeline.
 * Tier is determined by user selection (hardcoded, not AI-decided).
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const {
      description,
      businessInfo,
      goals,
      platforms,
      budgetRange,
      includeImages,
      competitorUrls,
      additionalContext,
      options,
      tier,
    } = body

    // Validate required fields
    if (!description || description.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please provide a description of your content needs (minimum 10 characters)' },
        { status: 400 }
      )
    }

    // Validate tier - HARDCODED, not AI-decided
    const validTiers = ['budget', 'standard', 'premium'] as const
    const selectedTier: 'budget' | 'standard' | 'premium' = validTiers.includes(tier)
      ? tier
      : 'standard' // Default to standard if invalid

    // Validate options if provided
    if (options) {
      const validation = validateContentArchitectOptions(options)
      if (!validation.valid) {
        return NextResponse.json(
          { error: `Invalid options: ${validation.errors.join(', ')}` },
          { status: 400 }
        )
      }
    }

    // Build request
    const architectRequest: ContentArchitectRequest = {
      description: description.trim(),
      businessInfo: businessInfo || {
        industry: options?.industry,
        companyName: options?.company_name,
        companySize: options?.company_size,
      },
      goals: goals || (options?.primary_goal ? [options.primary_goal, ...(options.secondary_goals || [])] : undefined),
      platforms: platforms || (options?.primary_platform
        ? [options.primary_platform, ...(options.secondary_platforms || [])]
        : undefined),
      budgetRange: budgetRange || options?.budget_range,
      includeImages: includeImages ?? (options?.visual_needs !== 'no'),
      competitorUrls: competitorUrls,
      additionalContext: additionalContext,
    }

    console.log(`🏗️ Content Architect [${selectedTier.toUpperCase()}] - Starting for user: ${user.id}`)
    console.log(`   Description: ${description.slice(0, 100)}...`)

    // Run the pipeline with selected tier (HARDCODED)
    const result = await runContentArchitectPipeline(architectRequest, selectedTier)

    // Format output for display
    const formattedOutput = formatContentArchitectOutput(result)

    console.log(`✅ Content Architect complete - ${result.recommendations.length} recommendations`)

    // Return both structured data and formatted output
    return NextResponse.json({
      success: true,
      tier: selectedTier,
      tierInfo: contentArchitectTiers[selectedTier],

      // Structured data for programmatic use
      data: result,

      // Formatted output for display
      formattedOutput,

      // Quick summary
      summary: {
        recommendationCount: result.recommendations.length,
        primaryFocus: result.strategy.primaryFocus,
        analyticsConfidence: result.metadata.analyticsConfidence,
        warnings: result.metadata.warnings,
      },
    })
  } catch (error) {
    console.error('Content Architect error:', error)

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Service temporarily busy. Please try again in a moment.' },
          { status: 429 }
        )
      }

      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Service configuration error. Please contact support.' },
          { status: 503 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate recommendations. Please try again.' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/generate/content-architect
 *
 * Get Content Architect service information and options.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const infoType = searchParams.get('info')

    // Return tier information
    if (infoType === 'tiers') {
      return NextResponse.json({
        tiers: contentArchitectTiers,
      })
    }

    // Return full service information
    return NextResponse.json({
      service: 'content-architect',
      name: 'Content Architect',
      description: 'Strategic content planning and service recommendations',
      tiers: contentArchitectTiers,
      features: [
        'Business & audience analysis',
        'Strategic content planning',
        'Service recommendations with configurations',
        'Platform-specific strategies',
        'Execution roadmap',
        'Analytics integration (Standard/Premium)',
        'Image generation recommendations',
      ],
      inputRequirements: {
        required: ['description'],
        optional: [
          'businessInfo',
          'goals',
          'platforms',
          'budgetRange',
          'includeImages',
          'competitorUrls',
          'additionalContext',
        ],
      },
    })
  } catch (error) {
    console.error('Content Architect GET error:', error)
    return NextResponse.json(
      { error: 'Failed to get service information' },
      { status: 500 }
    )
  }
}
