/**
 * LinkedIn Article Generator API Route
 *
 * POST /api/generate/linkedin/articles
 * Generates LinkedIn articles/newsletters using the LinkedIn Article Pipeline.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { runLinkedInArticlePipeline } from '../articles-pipeline'
import {
  LinkedInArticleFormData,
  mergeWithLinkedInDefaults
} from '../../linkedin-options'

export async function GET() {
  return NextResponse.json({
    name: 'LinkedIn Article Generator API',
    version: '1.0.0',
    description: 'Generate LinkedIn long-form articles and newsletters',
    endpoints: {
      POST: {
        description: 'Generate articles',
        body: {
          tier: 'budget | standard | premium',
          formData: {
            company: 'string (required)',
            industry: 'string',
            topic: 'string (required)',
            audience: 'string (required)',
            articleCount: 'number (1, 3)',
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

    const articleFormData: LinkedInArticleFormData = {
      company: formData.company,
      industry: formData.industry || 'General',
      topic: formData.topic,
      audience: formData.audience,
      goals: formData.goals || '',
      articleCount: formData.articleCount || 1,
      samplePosts: formData.samplePosts,
      sourceContent: formData.sourceContent,
      additionalInfo: additionalInfo,
    }

    const mergedStyles = mergeWithLinkedInDefaults(styleSelections)

    const result = await runLinkedInArticlePipeline(
      articleFormData,
      mergedStyles,
      effectiveTier as 'budget' | 'standard' | 'premium'
    )

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error: any) {
    console.error('LinkedIn Article Pipeline Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate LinkedIn articles' },
      { status: 500 }
    )
  }
}
