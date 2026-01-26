/**
 * Instagram Content Generation API Route
 *
 * POST /api/generate/instagram
 *
 * Generates Instagram content (captions, hashtags, and optionally images)
 * using tiered Instagram pipelines:
 * - Budget: GPT-4.1 based (8 stages)
 * - Standard: Claude Sonnet + RiteTag (10 stages)
 * - Premium: Claude Sonnet + Hook Specialist + Ideogram (13 stages)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { runInstagramPipeline, InstagramFormData, InstagramImageOptions } from '../instagram-pipeline'
import { runStandardInstagramPipeline, runPremiumInstagramPipeline } from '../instagram-tiered-pipelines'
import { InstagramStyleProfile } from '../instagram-options'

type InstagramTier = 'budget' | 'standard' | 'premium'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()

    const {
      tier = 'budget', // Default to budget tier
      formData,
      styleSelections,
      imageOptions,
      additionalInfo
    }: {
      tier?: InstagramTier
      formData: InstagramFormData
      styleSelections?: Partial<InstagramStyleProfile>
      imageOptions?: Partial<InstagramImageOptions>
      additionalInfo?: string
    } = body

    // Validate required fields
    if (!formData) {
      return NextResponse.json(
        { error: 'formData is required' },
        { status: 400 }
      )
    }

    if (!formData.company || !formData.topic) {
      return NextResponse.json(
        { error: 'company and topic are required in formData' },
        { status: 400 }
      )
    }

    // Build image options with defaults
    const finalImageOptions: InstagramImageOptions = {
      generateImages: imageOptions?.generateImages ?? false,
      numberOfImages: imageOptions?.numberOfImages,
      style: imageOptions?.style || 'photography',
      customStyle: imageOptions?.customStyle,
      mood: imageOptions?.mood || 'professional',
      customMood: imageOptions?.customMood,
      colorPreferences: imageOptions?.colorPreferences || [],
      subjectsToInclude: imageOptions?.subjectsToInclude || [],
      subjectsToAvoid: imageOptions?.subjectsToAvoid || [],
      additionalImageNotes: imageOptions?.additionalImageNotes || '',
      referenceImages: imageOptions?.referenceImages || [],
      referenceImageInstructions: imageOptions?.referenceImageInstructions || ''
    }

    // Validate tier
    const validTiers: InstagramTier[] = ['budget', 'standard', 'premium']
    const selectedTier: InstagramTier = validTiers.includes(tier) ? tier : 'budget'

    const pipelineStages: Record<InstagramTier, number> = {
      budget: 8,
      standard: 10,
      premium: 13,
    }

    console.log('📸 Instagram API: Starting generation...')
    console.log(`   Tier: ${selectedTier} (${pipelineStages[selectedTier]}-stage pipeline)`)
    console.log(`   Company: ${formData.company}`)
    console.log(`   Topic: ${formData.topic}`)
    console.log(`   Image Generation: ${finalImageOptions.generateImages ? 'Enabled' : 'Disabled'}`)

    // Run the appropriate Instagram pipeline based on tier
    let result
    switch (selectedTier) {
      case 'premium':
        console.log('   Using Premium Pipeline: Claude Sonnet + Hook Specialist + Ideogram + Visual Director')
        result = await runPremiumInstagramPipeline(
          formData,
          styleSelections || {},
          finalImageOptions,
          additionalInfo || ''
        )
        break

      case 'standard':
        console.log('   Using Standard Pipeline: Claude Sonnet + RiteTag + DALL-E 3')
        result = await runStandardInstagramPipeline(
          formData,
          styleSelections || {},
          finalImageOptions,
          additionalInfo || ''
        )
        break

      case 'budget':
      default:
        console.log('   Using Budget Pipeline: GPT-4.1 + DALL-E 3')
        result = await runInstagramPipeline(
          formData,
          styleSelections || {},
          finalImageOptions,
          additionalInfo || ''
        )
        break
    }

    console.log('📸 Instagram API: Generation complete!')
    console.log(`   Quality Score: ${result.qualityReport.totalScore}/100`)
    console.log(`   Images Generated: ${result.images?.length || 0}`)

    return NextResponse.json({
      success: true,
      content: result.content,
      images: result.images,
      qualityReport: result.qualityReport,
      metadata: result.metadata
    })

  } catch (error) {
    console.error('Instagram API Error:', error)

    // Check for specific error types
    if (error instanceof Error) {
      // OpenAI API errors
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'API configuration error. Please contact support.' },
          { status: 500 }
        )
      }

      // Rate limiting
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again in a few minutes.' },
          { status: 429 }
        )
      }

      // Image generation errors
      if (error.message.includes('image')) {
        return NextResponse.json(
          {
            error: 'Image generation failed. Content was generated successfully.',
            details: error.message
          },
          { status: 206 } // Partial success
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate Instagram content. Please try again.' },
      { status: 500 }
    )
  }
}

// GET method for API info
export async function GET() {
  return NextResponse.json({
    name: 'Instagram Content Generation API',
    version: '2.0.0',
    description: 'Generate Instagram content with AI using tiered pipelines',
    tiers: {
      budget: {
        stages: 8,
        description: 'GPT-4.1 based pipeline with basic hashtag generation',
        features: ['AI-generated hashtags', 'DALL-E 3 images'],
      },
      standard: {
        stages: 10,
        description: 'Claude Sonnet + RiteTag for enhanced content and real hashtag data',
        features: ['Claude Sonnet captions', 'RiteTag API hashtags', 'Hashtag strategist agent', 'DALL-E 3 images'],
      },
      premium: {
        stages: 13,
        description: 'Full premium pipeline with specialized agents and Ideogram',
        features: ['Hook specialist agent', 'Visual director agent', 'Claude Sonnet creative writing', 'Ideogram for text slides', 'DALL-E 3 for photo slides'],
      },
    },
    endpoints: {
      POST: {
        description: 'Generate Instagram content',
        body: {
          tier: 'budget | standard | premium (default: budget)',
          formData: {
            company: 'string (required)',
            industry: 'string',
            topic: 'string (required)',
            audience: 'string',
            goal: 'string',
            contentType: 'single_post | carousel | reels_cover | story',
            postCount: 'number',
            additionalInfo: 'string',
            sampleContent: 'string'
          },
          styleSelections: {
            caption_tone: 'professional | friendly | witty | inspirational | educational | bold | storytelling',
            emoji_usage: 'none | minimal | moderate | heavy',
            cta_style: 'question | direct | soft | value | none',
            content_format: 'tips_list | story | educational | behind_scenes | announcement | quote_commentary',
            hashtag_strategy: 'minimal | moderate | comprehensive | maximum',
            hashtag_placement: 'in_caption | end_caption | first_comment',
            image_style: 'photography | illustration | minimalist | 3d_render | flat_design | watercolor',
            image_mood: 'professional | playful | elegant | bold | calm | energetic | authentic',
            color_scheme: 'brand_colors | neutral | vibrant | pastel | monochrome | earth_tones | cool_tones',
            post_format: 'single_post | carousel | reels_cover | story',
            carousel_slides: '3 | 5 | 7 | 10'
          },
          imageOptions: {
            generateImages: 'boolean (default: false)',
            style: 'photography | illustration | minimalist | 3d_render | flat_design | watercolor | custom',
            customStyle: 'string (when style is custom)',
            mood: 'professional | playful | elegant | bold | calm | energetic | custom',
            customMood: 'string (when mood is custom)',
            colorPreferences: 'string[]',
            subjectsToInclude: 'string[]',
            subjectsToAvoid: 'string[]',
            additionalImageNotes: 'string'
          },
          additionalInfo: 'string'
        },
        response: {
          success: 'boolean',
          content: {
            caption: 'string',
            hashtags: 'string[]',
            altText: 'string',
            slides: 'array (for carousels)'
          },
          images: 'array (when generateImages is true)',
          qualityReport: {
            totalScore: 'number',
            breakdown: 'object',
            feedback: 'string[]'
          },
          metadata: {
            format: 'string',
            slideCount: 'number',
            processingStages: 'string[]'
          }
        }
      }
    }
  })
}
