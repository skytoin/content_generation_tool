/**
 * X Thread Builder API Route
 *
 * POST /api/generate/x/threads
 * Generates multi-tweet threads using the X Thread Pipeline.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { runXThreadPipeline } from '../../x-thread-pipeline'
import { XThreadFormData, XStyleProfile, defaultXStyleProfile, mergeWithDefaults } from '../../x-options'

export async function GET() {
  return NextResponse.json({
    name: 'X Thread Builder API',
    version: '1.0.0',
    description: 'Generate multi-tweet threads optimized for X/Twitter engagement (3x engagement of single tweets)',
    endpoints: {
      POST: {
        description: 'Generate a thread',
        body: {
          tier: 'budget | standard | premium',
          formData: {
            company: 'string (required)',
            industry: 'string',
            topic: 'string (required)',
            audience: 'string (required)',
            threadLength: 'number (3-15)',
            sampleTweets: 'string (optional - for voice learning)',
          },
          styleSelections: 'Partial<XStyleProfile> (optional)',
          additionalInfo: 'string (optional)',
        },
      },
    },
    tiers: {
      budget: { stages: 8, model: 'GPT-4o-mini', description: 'Fast & affordable' },
      standard: { stages: 8, model: 'GPT-4o', description: 'Balanced quality' },
      premium: { stages: 8, model: 'Claude Sonnet + Opus', description: 'Highest quality' },
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
    const threadFormData: XThreadFormData = {
      company: formData.company,
      industry: formData.industry || 'General',
      topic: formData.topic,
      audience: formData.audience,
      goals: formData.goals || '',
      threadLength: Math.min(Math.max(formData.threadLength || 5, 3), 15), // Clamp 3-15
      sampleTweets: formData.sampleTweets,
      additionalInfo: additionalInfo,
    }

    // Merge style selections with defaults
    const mergedStyles = mergeWithDefaults(styleSelections)

    // Run the pipeline
    const result = await runXThreadPipeline(
      threadFormData,
      mergedStyles,
      effectiveTier as 'budget' | 'standard' | 'premium'
    )

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error: any) {
    console.error('X Thread Pipeline Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate thread' },
      { status: 500 }
    )
  }
}
