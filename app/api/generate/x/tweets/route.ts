/**
 * X Tweet Generator API Route
 *
 * POST /api/generate/x/tweets
 * Generates a pack of standalone tweets using the X Tweet Pipeline.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { runXTweetPipeline } from '../../x-tweet-pipeline'
import { XTweetFormData, XStyleProfile, defaultXStyleProfile, mergeWithDefaults } from '../../x-options'

export async function GET() {
  return NextResponse.json({
    name: 'X Tweet Generator API',
    version: '1.0.0',
    description: 'Generate packs of standalone tweets optimized for X/Twitter engagement',
    endpoints: {
      POST: {
        description: 'Generate tweets',
        body: {
          tier: 'budget | standard | premium',
          formData: {
            company: 'string (required)',
            industry: 'string',
            topic: 'string (required)',
            audience: 'string (required)',
            tweetCount: 'number (7, 14, 30, 60)',
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
    if (!formData?.company || !formData?.topic || !formData?.audience) {
      return NextResponse.json(
        { error: 'Missing required fields: company, topic, audience' },
        { status: 400 }
      )
    }

    // Validate tier
    const validTiers = ['budget', 'standard', 'premium']
    const effectiveTier = validTiers.includes(tier) ? tier : 'budget'

    // Build form data with defaults
    const tweetFormData: XTweetFormData = {
      company: formData.company,
      industry: formData.industry || 'General',
      topic: formData.topic,
      audience: formData.audience,
      goals: formData.goals || '',
      tweetCount: formData.tweetCount || 7,
      sampleTweets: formData.sampleTweets,
      additionalInfo: additionalInfo,
    }

    // Merge style selections with defaults
    const mergedStyles = mergeWithDefaults(styleSelections)

    // Run the pipeline
    const result = await runXTweetPipeline(
      tweetFormData,
      mergedStyles,
      effectiveTier as 'budget' | 'standard' | 'premium'
    )

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error: any) {
    console.error('X Tweet Pipeline Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate tweets' },
      { status: 500 }
    )
  }
}
