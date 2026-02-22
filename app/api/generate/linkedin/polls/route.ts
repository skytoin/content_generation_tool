/**
 * LinkedIn Poll Generator API Route
 *
 * POST /api/generate/linkedin/polls
 * Generates LinkedIn polls with companion posts using the LinkedIn Poll Pipeline.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { runLinkedInPollPipeline } from '../polls-pipeline'
import {
  LinkedInPollFormData,
  mergeWithLinkedInDefaults
} from '../../linkedin-options'

export async function GET() {
  return NextResponse.json({
    name: 'LinkedIn Poll Generator API',
    version: '1.0.0',
    description: 'Generate LinkedIn polls with companion posts for maximum reach',
    endpoints: {
      POST: {
        description: 'Generate polls',
        body: {
          tier: 'budget | standard | premium',
          formData: {
            company: 'string (required)',
            industry: 'string',
            topic: 'string (required)',
            audience: 'string (required)',
            pollCount: 'number (3, 5, 10)',
            samplePosts: 'string (optional)',
          },
          styleSelections: 'Partial<LinkedInStyleProfile> (optional)',
          additionalInfo: 'string (optional)',
        },
      },
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { tier = 'budget', formData, styleSelections = {}, additionalInfo } = body

    if (!formData?.company || !formData?.topic || !formData?.audience) {
      return NextResponse.json(
        { error: 'Missing required fields: company, topic, audience' },
        { status: 400 }
      )
    }

    const validTiers = ['budget', 'standard', 'premium']
    const effectiveTier = validTiers.includes(tier) ? tier : 'budget'

    const pollFormData: LinkedInPollFormData = {
      company: formData.company,
      industry: formData.industry || 'General',
      topic: formData.topic,
      audience: formData.audience,
      goals: formData.goals || '',
      pollCount: formData.pollCount || 3,
      samplePosts: formData.samplePosts,
      additionalInfo: additionalInfo,
    }

    const mergedStyles = mergeWithLinkedInDefaults(styleSelections)

    const result = await runLinkedInPollPipeline(
      pollFormData,
      mergedStyles,
      effectiveTier as 'budget' | 'standard' | 'premium'
    )

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error: any) {
    console.error('LinkedIn Poll Pipeline Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate LinkedIn polls' },
      { status: 500 }
    )
  }
}
