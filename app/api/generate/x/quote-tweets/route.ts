/**
 * X Quote Tweet Crafter API Route
 *
 * POST /api/generate/x/quote-tweets
 * Generates strategic quote tweets using the X Quote Tweet Pipeline.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { runXQuoteTweetPipeline } from '../../x-quote-pipeline'
import { XQuoteTweetFormData, XStyleProfile, defaultXStyleProfile, mergeWithDefaults } from '../../x-options'

export async function GET() {
  return NextResponse.json({
    name: 'X Quote Tweet Crafter API',
    version: '1.0.0',
    description: 'Generate strategic quote tweets for relationship building and visibility (2x engagement of regular tweets)',
    endpoints: {
      POST: {
        description: 'Generate quote tweets',
        body: {
          tier: 'budget | standard | premium',
          formData: {
            company: 'string (required)',
            industry: 'string',
            audience: 'string (required)',
            quoteTweetCount: 'number (10, 20, 30)',
            targetAccounts: 'string[] (optional - @usernames)',
            trendTopics: 'string[] (optional)',
            sampleTweets: 'string (optional - for voice learning)',
          },
          styleSelections: 'Partial<XStyleProfile> (optional)',
          additionalInfo: 'string (optional)',
        },
      },
    },
    tiers: {
      budget: { stages: 7, model: 'GPT-4o-mini', description: 'Fast & affordable' },
      standard: { stages: 7, model: 'GPT-4o', description: 'Balanced quality' },
      premium: { stages: 7, model: 'Claude Sonnet + Opus', description: 'Highest quality' },
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { tier = 'budget', formData, styleSelections = {}, additionalInfo } = body

    // Validate required fields
    if (!formData?.company || !formData?.audience) {
      return NextResponse.json(
        { error: 'Missing required fields: company, audience' },
        { status: 400 }
      )
    }

    // Validate tier
    const validTiers = ['budget', 'standard', 'premium']
    const effectiveTier = validTiers.includes(tier) ? tier : 'budget'

    // Build form data with defaults
    const quoteFormData: XQuoteTweetFormData = {
      company: formData.company,
      industry: formData.industry || 'General',
      audience: formData.audience,
      goals: formData.goals || '',
      quoteTweetCount: formData.quoteTweetCount || 10,
      targetAccounts: formData.targetAccounts || [],
      trendTopics: formData.trendTopics || [],
      sampleTweets: formData.sampleTweets,
      additionalInfo: additionalInfo,
    }

    // Merge style selections with defaults
    const mergedStyles = mergeWithDefaults(styleSelections)

    // Run the pipeline
    const result = await runXQuoteTweetPipeline(
      quoteFormData,
      mergedStyles,
      effectiveTier as 'budget' | 'standard' | 'premium'
    )

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error: any) {
    console.error('X Quote Tweet Pipeline Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate quote tweets' },
      { status: 500 }
    )
  }
}
