/**
 * LinkedIn Text Post Generator API Route
 *
 * POST /api/generate/linkedin/text-posts
 * Generates LinkedIn text posts using the LinkedIn Text Post Pipeline.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { runLinkedInTextPostPipeline } from '../text-posts-pipeline'
import {
  LinkedInTextPostFormData,
  defaultLinkedInStyleProfile,
  mergeWithLinkedInDefaults
} from '../../linkedin-options'

export async function GET() {
  return NextResponse.json({
    name: 'LinkedIn Text Post Generator API',
    version: '1.0.0',
    description: 'Generate LinkedIn text posts optimized for the algorithm',
    endpoints: {
      POST: {
        description: 'Generate text posts',
        body: {
          tier: 'budget | standard | premium',
          formData: {
            company: 'string (required)',
            industry: 'string',
            topic: 'string (required)',
            audience: 'string (required)',
            postCount: 'number (5, 10, 20)',
            samplePosts: 'string (optional - for voice learning)',
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

    const textPostFormData: LinkedInTextPostFormData = {
      company: formData.company,
      industry: formData.industry || 'General',
      topic: formData.topic,
      audience: formData.audience,
      goals: formData.goals || '',
      postCount: formData.postCount || 5,
      samplePosts: formData.samplePosts,
      sourceContent: formData.sourceContent,
      additionalInfo: additionalInfo,
    }

    const mergedStyles = mergeWithLinkedInDefaults(styleSelections)

    const result = await runLinkedInTextPostPipeline(
      textPostFormData,
      mergedStyles,
      effectiveTier as 'budget' | 'standard' | 'premium'
    )

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error: any) {
    console.error('LinkedIn Text Post Pipeline Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate LinkedIn text posts' },
      { status: 500 }
    )
  }
}
