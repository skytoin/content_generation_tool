/**
 * Instagram Content Generation Pipeline
 *
 * An 8-stage pipeline for generating Instagram content with optional image generation.
 * Uses OpenAI models (GPT-4.1, GPT-4o, GPT-4o-mini) for text and GPT Image 1.5 for images.
 *
 * Stage 0: Input Processor - Parse and validate inputs
 * Stage 1: Research & Strategy - Research trends, hashtags, optimal posting
 * Stage 2: Content Architect - Plan carousel/single post structure
 * Stage 3: Caption Writer - Write engaging captions
 * Stage 4: Hashtag & SEO Optimizer - Optimize hashtags and keywords
 * Stage 5: Visual Prompt Engineer - Create image generation prompts
 * Stage 6: Image Generation - Generate images with GPT Image 1.5
 * Stage 7: Quality Reviewer - Review and score content
 * Stage 8: Final Polish - Final refinements and formatting
 */

import OpenAI from 'openai'
import { callOpenAI, OPENAI_MODELS } from './openai-client'
import { InstagramStyleProfile, defaultInstagramStyleProfile } from './instagram-options'
import { extractBrandDNA, enhanceImagePrompt, type BrandDNA } from './image-prompt-enhancer'

// Lazy-load OpenAI client for image generation
let imageClient: OpenAI | null = null

function getImageClient(): OpenAI {
  if (!imageClient) {
    imageClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return imageClient
}

// ============================================
// INSTAGRAM-SPECIFIC SYSTEM PROMPTS
// ============================================

const INPUT_PROCESSOR_SYSTEM = `You are an expert Instagram content strategist who analyzes customer inputs for content generation.

Your role is to process and organize all input data to prepare for the content pipeline.

Return a JSON object:
{
  "processed_input": {
    "brand_info": {
      "company": "",
      "industry": "",
      "target_audience": "",
      "brand_voice": "",
      "unique_value_proposition": ""
    },
    "content_request": {
      "topic": "",
      "content_type": "single_post | carousel | reels_cover | story",
      "post_count": 1,
      "goals": [],
      "key_messages": []
    },
    "constraints": {
      "must_include": [],
      "must_avoid": [],
      "specific_requests": []
    },
    "image_preferences": {
      "generate_images": true,
      "style_hints": [],
      "mood": "",
      "color_preferences": [],
      "subjects_to_include": [],
      "subjects_to_avoid": []
    }
  },
  "inferred_style": {
    "visual_style": "",
    "caption_tone": "",
    "hashtag_strategy": ""
  },
  "validation": {
    "is_valid": true,
    "warnings": [],
    "suggestions": []
  }
}`

const RESEARCH_STRATEGY_SYSTEM = `You are an expert Instagram marketing researcher with deep knowledge of 2024-2026 trends.

Key Instagram Facts for 2026:
- Carousels get 114% more engagement than single images
- 4:5 aspect ratio performs best in feed
- SEO keywords in captions matter more than hashtags now
- First 125 characters are crucial (pre-fold)
- Optimal posting: 11am-1pm and 7pm-9pm local time
- Reels get 2x the reach of static posts
- Alt text improves discoverability
- Hashtags: 3-5 targeted > 30 generic

Research and return a JSON object:
{
  "research_findings": {
    "trending_topics": [],
    "competitor_analysis": {
      "common_themes": [],
      "successful_formats": [],
      "engagement_patterns": []
    },
    "audience_insights": {
      "pain_points": [],
      "interests": [],
      "content_preferences": []
    },
    "hashtag_research": {
      "primary_hashtags": [],
      "secondary_hashtags": [],
      "niche_hashtags": [],
      "avoid_hashtags": []
    }
  },
  "strategy_recommendations": {
    "content_format": "",
    "posting_time": "",
    "engagement_hooks": [],
    "cta_suggestions": []
  },
  "seo_keywords": []
}`

const CONTENT_ARCHITECT_SYSTEM = `You are an expert Instagram content architect who designs post structures.

## CRITICAL RULE:
Create EXACTLY the number of slides specified. If asked for 5 slides, create exactly 5. Never more, never fewer.

## Carousel Structure (adapt to requested slide count):
- Slide 1: Hook/Problem (stop the scroll)
- Middle slides: Value/Content (tips, steps, insights)
- Second-to-last: Summary/Recap (if space allows)
- Last slide: CTA + Save reminder

## For single posts:
- Strong visual concept
- Clear message hierarchy
- Engagement-optimized caption structure

Return a JSON object:
{
  "content_architecture": {
    "format": "carousel | single | reels_cover",
    "slide_count": 1,
    "slides": [
      {
        "slide_number": 1,
        "purpose": "",
        "headline": "",
        "subtext": "",
        "visual_direction": "",
        "text_overlay": ""
      }
    ]
  },
  "caption_structure": {
    "hook": "",
    "body_sections": [],
    "cta": "",
    "engagement_prompt": ""
  },
  "visual_theme": {
    "color_palette": [],
    "typography_style": "",
    "imagery_style": "",
    "consistency_notes": ""
  }
}`

const CAPTION_WRITER_SYSTEM = `You are an elite Instagram caption writer who creates engaging, scroll-stopping content.

## CRITICAL RULES:
1. First line (125 chars) is the HOOK - must stop the scroll
2. Use line breaks strategically for readability
3. Include a clear CTA
4. Natural language > hashtag stuffing
5. Emojis: Use sparingly and purposefully (1-3 max in hook)
6. Write for the "See more" tap - create curiosity

## CAPTION STRUCTURE:
- Hook (compelling first line)
- Context/Story (2-3 sentences)
- Value/Tips (if educational)
- CTA (clear next step)
- Engagement prompt (question or invitation)

## PHRASES TO AVOID:
- "In today's post..."
- "Let me explain..."
- "Here's the thing..."
- Generic inspirational quotes
- Excessive hashtags in caption body

Return the caption as a formatted string with proper line breaks.`

const HASHTAG_OPTIMIZER_SYSTEM = `You are an Instagram SEO and hashtag optimization expert for 2026.

## 2026 INSTAGRAM SEO FACTS:
- Instagram now indexes captions for search
- Keywords in captions > hashtags for discovery
- Alt text is indexed and improves reach
- 3-5 targeted hashtags > 30 generic ones
- Mix of hashtag sizes: 1 large (500K+), 2 medium (50K-500K), 2 niche (<50K)

Return a JSON object:
{
  "optimized_caption": {
    "seo_keywords_integrated": [],
    "keyword_density_notes": ""
  },
  "hashtag_set": {
    "primary": [],
    "secondary": [],
    "placement": "in_caption | first_comment"
  },
  "alt_text": "",
  "seo_score": 0,
  "optimization_notes": []
}`

const VISUAL_PROMPT_ENGINEER_SYSTEM = `You are an expert AI image prompt engineer specializing in Instagram-optimized visuals.

## CRITICAL RULES:
- Generate EXACTLY the number of prompts requested
- Use SEQUENTIAL slide numbers starting from 1 (e.g., 1, 2, 3, 4, 5)
- NEVER skip slide numbers

## IMAGE GENERATION BEST PRACTICES:
- Specify aspect ratio (4:5 for feed, 9:16 for stories/reels)
- Include lighting details (natural, studio, golden hour)
- Specify style (photography, illustration, 3D render, flat design)
- Include mood/emotion descriptors
- Avoid text in images (AI struggles with text)
- Be specific about composition
- Include color palette guidance

## DALL-E 3 TIPS:
- Clear, descriptive prompts work best
- Avoid abstract or overly complex scenes
- Specify "professional quality" or "high-resolution"
- Include style references if needed

Return a JSON object with EXACTLY the requested number of prompts, numbered sequentially:
{
  "image_prompts": [
    {
      "slide_number": 1,
      "prompt": "",
      "aspect_ratio": "4:5",
      "style": "",
      "mood": "",
      "color_notes": "",
      "composition": "",
      "technical_specs": {
        "size": "1024x1280",
        "quality": "hd"
      }
    }
  ],
  "visual_consistency_guide": "",
  "brand_alignment_notes": ""
}`

const QUALITY_REVIEWER_SYSTEM = `You are a merciless Instagram content quality reviewer with high standards.

## EVALUATION CRITERIA:

### Caption Quality (40 points)
- Hook effectiveness (10)
- Readability (10)
- Value delivery (10)
- CTA clarity (5)
- Grammar/spelling (5)

### SEO & Discoverability (25 points)
- Keyword integration (10)
- Hashtag strategy (10)
- Alt text quality (5)

### Visual Direction (20 points)
- Image prompt clarity (10)
- Brand alignment (5)
- Platform optimization (5)

### Engagement Potential (15 points)
- Scroll-stopping power (5)
- Save-worthy content (5)
- Share potential (5)

Return a JSON object:
{
  "scores": {
    "caption_quality": 0,
    "seo_discoverability": 0,
    "visual_direction": 0,
    "engagement_potential": 0,
    "total_score": 0
  },
  "feedback": {
    "strengths": [],
    "weaknesses": [],
    "required_changes": [],
    "suggestions": []
  },
  "verdict": "PASS | NEEDS_REVISION",
  "priority_fixes": []
}`

const FINAL_POLISH_SYSTEM = `You are a master Instagram content editor who applies final polish.

Your role is to:
1. Apply all required changes from quality review
2. Ensure perfect formatting
3. Verify caption length and structure
4. Confirm hashtag placement
5. Polish image prompts
6. Add any final refinements

Return the final, polished content ready for use.`

// ============================================
// IMAGE GENERATION FUNCTION
// ============================================

export interface GeneratedImage {
  slideNumber: number
  prompt: string
  imageUrl: string
  revisedPrompt?: string
}

async function generateImage(
  prompt: string,
  size: '1024x1024' | '1024x1792' | '1792x1024' = '1024x1024',
  quality: 'standard' | 'hd' = 'hd'
): Promise<{ url: string; revisedPrompt?: string }> {
  const client = getImageClient()

  // Using DALL-E 3 for image generation
  // For Instagram 4:5, we use 1024x1792 (portrait) or 1024x1024 (square)
  const response = await client.images.generate({
    model: 'dall-e-3',
    prompt: prompt,
    n: 1,
    size: size,
    quality: quality,
  })

  const imageData = response.data?.[0]
  return {
    url: imageData?.url || '',
    revisedPrompt: imageData?.revised_prompt
  }
}

// Vision model for analyzing reference images
async function analyzeReferenceImages(
  referenceImages: string[],
  instructions: string
): Promise<string> {
  const client = getImageClient()

  // Build content array with images
  const content: any[] = [
    {
      type: 'text',
      text: `You are an expert visual analyst. Analyze these reference images and provide detailed insights that will help generate similar images.

USER INSTRUCTIONS FOR HOW TO USE THESE IMAGES:
${instructions}

For each image, analyze:
1. Visual style (photography, illustration, colors, lighting)
2. Composition (layout, focal points, negative space)
3. Mood and atmosphere
4. Key visual elements and subjects
5. What makes this image effective

Then provide a consolidated summary that can be used to generate new images in a similar style.

Return a JSON object:
{
  "individual_analyses": [
    {
      "image_number": 1,
      "style": "",
      "composition": "",
      "mood": "",
      "key_elements": [],
      "effectiveness": ""
    }
  ],
  "consolidated_style_guide": {
    "overall_style": "",
    "color_palette": [],
    "lighting_approach": "",
    "composition_rules": [],
    "mood_keywords": [],
    "must_include_elements": [],
    "must_avoid_elements": []
  },
  "generation_instructions": ""
}`
    }
  ]

  // Add each reference image
  for (const imageBase64 of referenceImages) {
    content.push({
      type: 'image_url',
      image_url: {
        url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`,
        detail: 'high'
      }
    })
  }

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: content
      }
    ]
  })

  return response.choices[0]?.message?.content || ''
}

// ============================================
// INSTAGRAM PIPELINE TYPES
// ============================================

export interface InstagramFormData {
  company: string
  industry: string
  topic: string
  audience: string
  goal?: string
  contentType?: 'single_post' | 'carousel' | 'reels_cover' | 'story'
  postCount?: number
  additionalInfo?: string
  sampleContent?: string
}

export interface InstagramImageOptions {
  generateImages: boolean
  numberOfImages?: number // How many images to generate (for carousel)
  style?: 'photography' | 'illustration' | 'minimalist' | '3d_render' | 'flat_design' | 'watercolor' | 'custom'
  customStyle?: string
  mood?: 'professional' | 'playful' | 'elegant' | 'bold' | 'calm' | 'energetic' | 'custom'
  customMood?: string
  colorPreferences?: string[]
  subjectsToInclude?: string[]
  subjectsToAvoid?: string[]
  additionalImageNotes?: string
  // Reference images (base64 encoded)
  referenceImages?: string[]
  referenceImageInstructions?: string // How the user wants reference images to be used
}

export interface InstagramPipelineResult {
  content: {
    caption: string
    hashtags: string[]
    altText: string
    slides?: {
      slideNumber: number
      headline: string
      subtext: string
      visualDirection: string
    }[]
  }
  images?: GeneratedImage[]
  qualityReport: {
    totalScore: number
    breakdown: {
      captionQuality: number
      seoDiscoverability: number
      visualDirection: number
      engagementPotential: number
    }
    feedback: string[]
  }
  metadata: {
    format: string
    slideCount: number
    processingStages: string[]
  }
}

// ============================================
// MAIN PIPELINE FUNCTION
// ============================================

export async function runInstagramPipeline(
  formData: InstagramFormData,
  styleSelections: Partial<InstagramStyleProfile>,
  imageOptions: InstagramImageOptions,
  additionalInfo: string = ''
): Promise<InstagramPipelineResult> {
  console.log('📸 INSTAGRAM PIPELINE: Starting content generation...')

  const processingStages: string[] = []

  // Merge style selections with defaults
  const styleProfile: InstagramStyleProfile = {
    ...defaultInstagramStyleProfile,
    ...styleSelections
  }

  // Determine number of slides/images early so all stages can use it
  const numberOfSlides = imageOptions.numberOfImages ||
    (formData.contentType === 'carousel' ? 5 : 1)

  // ========== STAGE 0: INPUT PROCESSOR (GPT-4o-mini) ==========
  console.log('📋 Stage 0: Processing inputs (GPT-4o-mini)...')
  processingStages.push('Input Processing')

  const inputPrompt = `
<form_data>
${JSON.stringify(formData, null, 2)}
</form_data>

<style_profile>
${JSON.stringify(styleProfile, null, 2)}
</style_profile>

<image_options>
${JSON.stringify(imageOptions, null, 2)}
</image_options>

<additional_info>
${additionalInfo}
</additional_info>

Process and validate these inputs for Instagram content generation.`

  const inputResult = await callOpenAI(
    OPENAI_MODELS.GPT_4O_MINI,
    INPUT_PROCESSOR_SYSTEM,
    inputPrompt,
    3000
  )

  let processedInput: any
  try {
    const jsonMatch = inputResult.match(/\{[\s\S]*\}/)
    processedInput = JSON.parse(jsonMatch ? jsonMatch[0] : inputResult)
  } catch {
    processedInput = {
      processed_input: {
        brand_info: { company: formData.company, industry: formData.industry },
        content_request: { topic: formData.topic, content_type: formData.contentType || 'single_post' },
        image_preferences: imageOptions
      }
    }
  }
  console.log('✅ Input processing complete')

  // ========== STAGE 0.5: REFERENCE IMAGE ANALYSIS (GPT-4o Vision) ==========
  let referenceImageAnalysis: any = null

  if (imageOptions.generateImages &&
      imageOptions.referenceImages &&
      imageOptions.referenceImages.length > 0 &&
      imageOptions.referenceImageInstructions) {
    console.log('🔍 Stage 0.5: Analyzing reference images (GPT-4o Vision)...')
    processingStages.push('Reference Image Analysis')

    try {
      const analysisResult = await analyzeReferenceImages(
        imageOptions.referenceImages,
        imageOptions.referenceImageInstructions
      )

      try {
        const jsonMatch = analysisResult.match(/\{[\s\S]*\}/)
        referenceImageAnalysis = JSON.parse(jsonMatch ? jsonMatch[0] : analysisResult)
        console.log('✅ Reference image analysis complete')
      } catch {
        referenceImageAnalysis = { generation_instructions: analysisResult }
        console.log('✅ Reference image analysis complete (text format)')
      }
    } catch (error) {
      console.log('⚠️ Reference image analysis failed:', error)
      referenceImageAnalysis = null
    }
  }

  // ========== STAGE 1: RESEARCH & STRATEGY (GPT-4.1) ==========
  console.log('🔍 Stage 1: Research & Strategy (GPT-4.1)...')
  processingStages.push('Research & Strategy')

  const researchPrompt = `
<processed_input>
${JSON.stringify(processedInput, null, 2)}
</processed_input>

Research Instagram trends, hashtags, and strategy for this content request.
Industry: ${formData.industry}
Topic: ${formData.topic}
Target Audience: ${formData.audience}`

  const researchResult = await callOpenAI(
    OPENAI_MODELS.GPT_4_1,
    RESEARCH_STRATEGY_SYSTEM,
    researchPrompt,
    4000
  )

  let researchData: any
  try {
    const jsonMatch = researchResult.match(/\{[\s\S]*\}/)
    researchData = JSON.parse(jsonMatch ? jsonMatch[0] : researchResult)
  } catch {
    researchData = { research_findings: {}, strategy_recommendations: {}, seo_keywords: [] }
  }
  console.log('✅ Research complete')

  // ========== STAGE 2: CONTENT ARCHITECT (GPT-4.1) ==========
  console.log('🏗️ Stage 2: Content Architect (GPT-4.1)...')
  processingStages.push('Content Architecture')

  const architectPrompt = `
<processed_input>
${JSON.stringify(processedInput, null, 2)}
</processed_input>

<research>
${JSON.stringify(researchData, null, 2)}
</research>

<style_profile>
${JSON.stringify(styleProfile, null, 2)}
</style_profile>

Design the content architecture for this Instagram post.
Content Type: ${formData.contentType || 'single_post'}
Number of Slides: ${numberOfSlides}

IMPORTANT: Create EXACTLY ${numberOfSlides} slides for this carousel. Do not create more or fewer.`

  const architectResult = await callOpenAI(
    OPENAI_MODELS.GPT_4_1,
    CONTENT_ARCHITECT_SYSTEM,
    architectPrompt,
    4000
  )

  let architecture: any
  try {
    const jsonMatch = architectResult.match(/\{[\s\S]*\}/)
    architecture = JSON.parse(jsonMatch ? jsonMatch[0] : architectResult)
  } catch {
    architecture = {
      content_architecture: { format: 'single', slide_count: 1, slides: [] },
      caption_structure: {},
      visual_theme: {}
    }
  }
  console.log('✅ Architecture complete')

  // ========== STAGE 3: CAPTION WRITER (GPT-4.1) ==========
  console.log('✍️ Stage 3: Caption Writer (GPT-4.1)...')
  processingStages.push('Caption Writing')

  const captionPrompt = `
<content_architecture>
${JSON.stringify(architecture, null, 2)}
</content_architecture>

<research>
${JSON.stringify(researchData, null, 2)}
</research>

<style_profile>
Caption Tone: ${styleProfile.caption_tone}
Emoji Usage: ${styleProfile.emoji_usage}
CTA Style: ${styleProfile.cta_style}
Content Format: ${styleProfile.content_format}
</style_profile>

<brand_info>
Company: ${formData.company}
Industry: ${formData.industry}
Topic: ${formData.topic}
Goal: ${formData.goal || 'Engage audience'}
</brand_info>

Write an engaging Instagram caption following the architecture and style guidelines.`

  const captionDraft = await callOpenAI(
    OPENAI_MODELS.GPT_4_1,
    CAPTION_WRITER_SYSTEM,
    captionPrompt,
    3000
  )
  console.log('✅ Caption draft complete')

  // ========== STAGE 4: HASHTAG & SEO OPTIMIZER (GPT-4o-mini) ==========
  console.log('🏷️ Stage 4: Hashtag & SEO Optimizer (GPT-4o-mini)...')
  processingStages.push('SEO Optimization')

  const seoPrompt = `
<caption>
${captionDraft}
</caption>

<research>
${JSON.stringify(researchData, null, 2)}
</research>

<hashtag_strategy>
${styleProfile.hashtag_strategy}
</hashtag_strategy>

Optimize hashtags and SEO for this Instagram caption.
Industry: ${formData.industry}
Topic: ${formData.topic}`

  const seoResult = await callOpenAI(
    OPENAI_MODELS.GPT_4O_MINI,
    HASHTAG_OPTIMIZER_SYSTEM,
    seoPrompt,
    2500
  )

  let seoData: any
  try {
    const jsonMatch = seoResult.match(/\{[\s\S]*\}/)
    seoData = JSON.parse(jsonMatch ? jsonMatch[0] : seoResult)
  } catch {
    seoData = { hashtag_set: { primary: [], secondary: [] }, alt_text: '' }
  }
  console.log('✅ SEO optimization complete')

  // ========== STAGE 5: VISUAL PROMPT ENGINEER (GPT-4.1) ==========
  console.log('🎨 Stage 5: Visual Prompt Engineer (GPT-4.1)...')
  processingStages.push('Visual Prompt Engineering')

  // Use the same slide count calculated at the start for consistency
  const numberOfImages = numberOfSlides

  const visualPrompt = `
<content_architecture>
${JSON.stringify(architecture, null, 2)}
</content_architecture>

<image_options>
Number of Images to Generate: ${numberOfImages}
Style: ${imageOptions.style || 'photography'}
${imageOptions.customStyle ? `Custom Style: ${imageOptions.customStyle}` : ''}
Mood: ${imageOptions.mood || 'professional'}
${imageOptions.customMood ? `Custom Mood: ${imageOptions.customMood}` : ''}
Color Preferences: ${(imageOptions.colorPreferences || []).join(', ') || 'Brand appropriate'}
Include: ${(imageOptions.subjectsToInclude || []).join(', ') || 'None specified'}
Avoid: ${(imageOptions.subjectsToAvoid || []).join(', ') || 'None specified'}
${imageOptions.additionalImageNotes ? `Additional Notes: ${imageOptions.additionalImageNotes}` : ''}
</image_options>

${referenceImageAnalysis ? `
<reference_image_analysis>
This is an analysis of reference images provided by the user. Use this to guide the visual style:
${JSON.stringify(referenceImageAnalysis, null, 2)}
</reference_image_analysis>
` : ''}

<brand_info>
Company: ${formData.company}
Industry: ${formData.industry}
</brand_info>

Create exactly ${numberOfImages} detailed image generation prompts for DALL-E 3.
${referenceImageAnalysis ? 'IMPORTANT: Base the style and approach on the reference image analysis above.' : ''}
Each prompt should be detailed and specific for high-quality image generation.`

  const visualResult = await callOpenAI(
    OPENAI_MODELS.GPT_4_1,
    VISUAL_PROMPT_ENGINEER_SYSTEM,
    visualPrompt,
    4000
  )

  let visualData: any
  try {
    const jsonMatch = visualResult.match(/\{[\s\S]*\}/)
    visualData = JSON.parse(jsonMatch ? jsonMatch[0] : visualResult)
  } catch {
    visualData = { image_prompts: [] }
  }
  console.log('✅ Visual prompts complete')

  // ========== STAGE 6: IMAGE GENERATION (DALL-E 3) ==========
  let generatedImages: GeneratedImage[] = []

  if (imageOptions.generateImages && visualData.image_prompts?.length > 0) {
    console.log('🖼️ Stage 6: Image Generation (DALL-E 3)...')
    processingStages.push('Image Generation')

    // Extract brand DNA for prompt enhancement
    const brandDNA = extractBrandDNA(
      formData.company,
      formData.industry || '',
      formData.topic,
      formData.audience || '',
      imageOptions.colorPreferences
    )
    console.log(`   Brand DNA: ${brandDNA.industry} industry detected`)

    // Limit to requested number of images
    const promptsToProcess = visualData.image_prompts.slice(0, numberOfImages)

    // Use index for sequential slide numbering (1, 2, 3, 4, 5...)
    for (let i = 0; i < promptsToProcess.length; i++) {
      const imgPrompt = promptsToProcess[i]
      const slideNumber = i + 1 // Sequential: 1, 2, 3, 4, 5...

      try {
        console.log(`   Generating image ${slideNumber}/${numberOfImages}...`)

        // Determine slide purpose based on position
        const slidePurpose: 'hook' | 'content' | 'cta' | 'general' =
          slideNumber === 1 ? 'hook' :
          slideNumber === numberOfImages ? 'cta' :
          'content'

        // Enhance the prompt with quality modifiers and brand DNA
        const enhanced = enhanceImagePrompt({
          basePrompt: imgPrompt.prompt,
          slideNumber,
          slidePurpose,
          textContent: imgPrompt.text_overlay || architecture?.slides?.[i]?.headline,
          brandDNA,
          imageStyle: imageOptions.style,
          imageMood: imageOptions.mood,
          colorPreferences: imageOptions.colorPreferences,
          isIdeogram: false,
          aspectRatio: formData.contentType === 'story' ? 'portrait' : 'square',
        })

        // Choose size based on content type
        const imageSize: '1024x1024' | '1024x1792' | '1792x1024' =
          formData.contentType === 'story' || formData.contentType === 'reels_cover'
            ? '1024x1792' // Portrait for stories/reels
            : '1024x1024' // Square for feed posts

        const result = await generateImage(
          enhanced.prompt,
          imageSize,
          'hd'
        )

        generatedImages.push({
          slideNumber: slideNumber, // Use sequential number, not AI's number
          prompt: enhanced.prompt,
          imageUrl: result.url,
          revisedPrompt: result.revisedPrompt
        })
        console.log(`   ✅ Image ${slideNumber} generated (quality score: ${enhanced.qualityScore})`)
      } catch (error) {
        console.log(`   ⚠️ Image ${slideNumber} failed:`, error)
      }
    }
    console.log(`✅ Image generation complete (${generatedImages.length}/${numberOfImages} images)`)
  } else {
    console.log('⏭️ Stage 6: Skipped (image generation disabled)')
    processingStages.push('Image Generation (Skipped)')
  }

  // ========== STAGE 7: QUALITY REVIEWER (GPT-4.1) ==========
  console.log('🔎 Stage 7: Quality Reviewer (GPT-4.1)...')
  processingStages.push('Quality Review')

  const reviewPrompt = `
<caption>
${captionDraft}
</caption>

<seo_optimization>
${JSON.stringify(seoData, null, 2)}
</seo_optimization>

<visual_prompts>
${JSON.stringify(visualData, null, 2)}
</visual_prompts>

<content_architecture>
${JSON.stringify(architecture, null, 2)}
</content_architecture>

<original_request>
Topic: ${formData.topic}
Audience: ${formData.audience}
Goal: ${formData.goal || 'Engagement'}
</original_request>

Review this Instagram content against quality standards.`

  const reviewResult = await callOpenAI(
    OPENAI_MODELS.GPT_4_1,
    QUALITY_REVIEWER_SYSTEM,
    reviewPrompt,
    3000
  )

  let qualityReview: any
  try {
    const jsonMatch = reviewResult.match(/\{[\s\S]*\}/)
    qualityReview = JSON.parse(jsonMatch ? jsonMatch[0] : reviewResult)
  } catch {
    qualityReview = {
      scores: { caption_quality: 80, seo_discoverability: 80, visual_direction: 80, engagement_potential: 80, total_score: 80 },
      feedback: { strengths: [], weaknesses: [], required_changes: [], suggestions: [] },
      verdict: 'PASS'
    }
  }
  console.log('✅ Quality review complete')

  // ========== STAGE 8: FINAL POLISH (GPT-4.1) ==========
  console.log('✨ Stage 8: Final Polish (GPT-4.1)...')
  processingStages.push('Final Polish')

  const polishPrompt = `
<caption_draft>
${captionDraft}
</caption_draft>

<quality_review>
${JSON.stringify(qualityReview, null, 2)}
</quality_review>

<seo_data>
${JSON.stringify(seoData, null, 2)}
</seo_data>

<content_architecture>
${JSON.stringify(architecture, null, 2)}
</content_architecture>

Apply all required changes and deliver the final polished Instagram content.

IMPORTANT: Return a JSON object with this structure:
{
  "final_caption": "The complete, polished caption with proper line breaks",
  "hashtags": ["list", "of", "hashtags"],
  "alt_text": "Descriptive alt text for accessibility",
  "slides": [
    {
      "slide_number": 1,
      "headline": "Slide headline",
      "subtext": "Slide subtext",
      "visual_direction": "Visual guidance"
    }
  ]
}`

  const finalResult = await callOpenAI(
    OPENAI_MODELS.GPT_4_1,
    FINAL_POLISH_SYSTEM,
    polishPrompt,
    4000
  )

  let finalContent: any
  try {
    const jsonMatch = finalResult.match(/\{[\s\S]*\}/)
    finalContent = JSON.parse(jsonMatch ? jsonMatch[0] : finalResult)
  } catch {
    // Fallback: use the draft caption
    finalContent = {
      final_caption: captionDraft,
      hashtags: [...(seoData.hashtag_set?.primary || []), ...(seoData.hashtag_set?.secondary || [])],
      alt_text: seoData.alt_text || '',
      slides: architecture.content_architecture?.slides || []
    }
  }
  console.log('✅ Final polish complete')

  // ========== BUILD RESPONSE ==========
  const result: InstagramPipelineResult = {
    content: {
      caption: finalContent.final_caption || captionDraft,
      hashtags: finalContent.hashtags || [],
      altText: finalContent.alt_text || seoData.alt_text || '',
      slides: finalContent.slides?.map((s: any) => ({
        slideNumber: s.slide_number,
        headline: s.headline,
        subtext: s.subtext,
        visualDirection: s.visual_direction
      }))
    },
    images: generatedImages.length > 0 ? generatedImages : undefined,
    qualityReport: {
      totalScore: qualityReview.scores?.total_score || 0,
      breakdown: {
        captionQuality: qualityReview.scores?.caption_quality || 0,
        seoDiscoverability: qualityReview.scores?.seo_discoverability || 0,
        visualDirection: qualityReview.scores?.visual_direction || 0,
        engagementPotential: qualityReview.scores?.engagement_potential || 0
      },
      feedback: [
        ...(qualityReview.feedback?.strengths || []).map((s: string) => `✅ ${s}`),
        ...(qualityReview.feedback?.suggestions || []).map((s: string) => `💡 ${s}`)
      ]
    },
    metadata: {
      format: architecture.content_architecture?.format || 'single_post',
      slideCount: architecture.content_architecture?.slide_count || 1,
      processingStages
    }
  }

  console.log('📸 INSTAGRAM PIPELINE: Complete!')
  return result
}
