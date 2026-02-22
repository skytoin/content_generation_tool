/**
 * LinkedIn Carousel Generator API Route
 *
 * POST /api/generate/linkedin/carousels
 * Generates LinkedIn carousel/document posts using the LinkedIn Carousel Pipeline.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { runLinkedInCarouselPipeline } from '../carousels-pipeline'
import {
  LinkedInCarouselFormData,
  mergeWithLinkedInDefaults
} from '../../linkedin-options'

export async function GET() {
  return NextResponse.json({
    name: 'LinkedIn Carousel Generator API',
    version: '1.0.0',
    description: 'Generate LinkedIn carousel posts (2.5-3x more reach than text)',
    endpoints: {
      POST: {
        description: 'Generate carousels',
        body: {
          tier: 'budget | standard | premium',
          formData: {
            company: 'string (required)',
            industry: 'string',
            topic: 'string (required)',
            audience: 'string (required)',
            carouselCount: 'number (1, 3, 5)',
            slideCount: 'number (5-15)',
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

    const carouselFormData: LinkedInCarouselFormData = {
      company: formData.company,
      industry: formData.industry || 'General',
      topic: formData.topic,
      audience: formData.audience,
      goals: formData.goals || '',
      carouselCount: formData.carouselCount || 1,
      samplePosts: formData.samplePosts,
      sourceContent: formData.sourceContent,
      additionalInfo: additionalInfo,
    }

    const mergedStyles = mergeWithLinkedInDefaults(styleSelections)

    const result = await runLinkedInCarouselPipeline(
      carouselFormData,
      mergedStyles,
      effectiveTier as 'budget' | 'standard' | 'premium'
    )

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error: any) {
    console.error('LinkedIn Carousel Pipeline Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate LinkedIn carousels' },
      { status: 500 }
    )
  }
}
