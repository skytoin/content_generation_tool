/**
 * Instagram Tiered Pipelines (Standard & Premium)
 *
 * Standard Tier: 10 stages with Claude Sonnet for creative tasks + RiteTag API
 * Premium Tier: 13 stages with Hook Specialist, Visual Director, and Ideogram
 *
 * Budget Tier is the existing instagram-pipeline.ts (unchanged)
 */

import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { callOpenAI, OPENAI_MODELS } from './openai-client'
import { InstagramStyleProfile, defaultInstagramStyleProfile } from './instagram-options'
import {
  getHashtagSuggestions,
  getTrendingHashtags,
  selectOptimalMix,
  isRiteTagConfigured,
  RiteTagHashtag,
} from './ritetag-client'
import {
  generateInstagramImage as generateIdeogramImage,
  mapStyleToPreset,
  recommendImageGenerator,
  isIdeogramConfigured,
} from './ideogram-client'
import {
  extractBrandDNA,
  enhanceImagePrompt,
  type BrandDNA,
} from './image-prompt-enhancer'

// ============================================
// CLIENT SETUP
// ============================================

// Anthropic client for Claude Sonnet
let anthropicClient: Anthropic | null = null

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  }
  return anthropicClient
}

// OpenAI client for image generation
let openaiImageClient: OpenAI | null = null

function getOpenAIImageClient(): OpenAI {
  if (!openaiImageClient) {
    openaiImageClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openaiImageClient
}

// Model constants
const CLAUDE_SONNET = 'claude-sonnet-4-5-20250929'

// ============================================
// HELPER FUNCTIONS
// ============================================

async function callClaude(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = 4000
): Promise<string> {
  const client = getAnthropicClient()
  const response = await client.messages.create({
    model: CLAUDE_SONNET,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const textBlock = response.content.find((block) => block.type === 'text')
  return textBlock?.type === 'text' ? textBlock.text : ''
}

async function generateDalleImage(
  prompt: string,
  size: '1024x1024' | '1024x1792' | '1792x1024' = '1024x1024',
  quality: 'standard' | 'hd' = 'hd'
): Promise<{ url: string; revisedPrompt?: string }> {
  const client = getOpenAIImageClient()

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
    revisedPrompt: imageData?.revised_prompt,
  }
}

// Vision analysis for reference images
async function analyzeReferenceImages(
  referenceImages: string[],
  instructions: string
): Promise<any> {
  const client = getOpenAIImageClient()

  const content: any[] = [
    {
      type: 'text',
      text: `You are an expert visual analyst extracting a reusable style template.

USER INSTRUCTIONS: ${instructions}

Analyze these reference images and extract a comprehensive style template that can be applied to ALL slides in a carousel.

Return a JSON object:
{
  "style_template": {
    "color_palette": {
      "primary": "#hex",
      "secondary": "#hex",
      "accent": "#hex",
      "background": "#hex",
      "text": "#hex"
    },
    "typography": {
      "style": "modern sans-serif",
      "weight": "bold for headlines",
      "case": "mixed"
    },
    "composition": {
      "layout": "centered",
      "text_zones": "bottom third",
      "negative_space": "generous"
    },
    "mood": {
      "primary_feeling": "professional",
      "energy": "calm",
      "lighting": "soft, even"
    },
    "recurring_elements": []
  },
  "prompt_modifiers": "Include these in all prompts",
  "things_to_avoid": [],
  "confidence_score": 0.85
}`,
    },
  ]

  for (const imageBase64 of referenceImages) {
    content.push({
      type: 'image_url',
      image_url: {
        url: imageBase64.startsWith('data:')
          ? imageBase64
          : `data:image/jpeg;base64,${imageBase64}`,
        detail: 'high',
      },
    })
  }

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 4000,
    messages: [{ role: 'user', content: content }],
  })

  const result = response.choices[0]?.message?.content || ''
  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/)
    return JSON.parse(jsonMatch ? jsonMatch[0] : result)
  } catch {
    return { generation_instructions: result }
  }
}

// ============================================
// SYSTEM PROMPTS
// ============================================

const INPUT_PROCESSOR_SYSTEM = `You are an expert Instagram content strategist who analyzes customer inputs.

Return a concise JSON object:
{
  "brand": {
    "company": "",
    "industry": "",
    "audience": "",
    "voice": ""
  },
  "request": {
    "topic": "",
    "format": "carousel | single_post | story",
    "slideCount": 5,
    "goals": []
  },
  "constraints": {
    "mustInclude": [],
    "mustAvoid": []
  },
  "imageConfig": {
    "generate": true,
    "style": "",
    "mood": ""
  }
}`

const RESEARCH_STRATEGY_SYSTEM = `You are an expert Instagram marketing researcher.

Research current trends and strategy for the given topic and industry.

Return a CONCISE JSON object (under 500 tokens):
{
  "trendingAngles": ["angle1", "angle2"],
  "audienceHooks": ["pain point", "desire"],
  "contentStructure": "carousel with tips",
  "seoKeywords": ["keyword1", "keyword2"],
  "engagementPatterns": {
    "bestCtaType": "question",
    "optimalLength": "medium"
  }
}`

const CONTENT_ARCHITECT_SYSTEM_CLAUDE = `You are a master Instagram content architect who designs scroll-stopping carousels.

## YOUR CREATIVE PHILOSOPHY
- Every slide must earn its place
- The first slide decides if anyone sees slide 2
- Value density > word count
- Visual hierarchy guides the eye

## CAROUSEL PSYCHOLOGY
- Slide 1: HOOK - Pattern interrupt, stop the scroll
- Slides 2-N-1: VALUE - Each slide = one clear idea
- Final Slide: CTA - Clear next step + save reminder

## OUTPUT FORMAT
{
  "narrativeArc": "problem → solution → transformation",
  "slides": [
    {
      "number": 1,
      "purpose": "hook",
      "headline": "5 words max",
      "subtext": "optional",
      "visualConcept": "description",
      "textOnImage": true
    }
  ],
  "captionDirection": {
    "hookAngle": "what makes them stop",
    "valueSummary": "key takeaway",
    "ctaType": "question"
  },
  "visualConsistency": {
    "style": "minimalist",
    "colorMood": "warm",
    "typography": "modern"
  }
}`

const CAPTION_WRITER_SYSTEM_CLAUDE = `You are an elite Instagram copywriter known for captions that feel human, not AI-generated.

## YOUR WRITING SIGNATURE
- First line = scroll stopper (125 chars visible)
- Short sentences punch. Longer ones flow.
- You write like you talk to a friend who happens to need this info
- Emojis are seasoning, not the meal (2-3 max)

## WHAT YOU NEVER DO
- Start with "In today's..." or "Have you ever..."
- Use "Let me explain" or "Here's the thing"
- Write generic inspirational fluff
- Stuff hashtags into the caption body
- Sound like ChatGPT

## OUTPUT
Return ONLY the caption text with proper line breaks. No JSON wrapper.
Make it sound human, not AI.`

const HASHTAG_STRATEGIST_SYSTEM = `You are a hashtag strategist. Select optimal hashtags from the provided RiteTag data.

## HASHTAG COLOR CODES FROM RITETAG
- Color 3 (GREEN): Hot - use immediately, good engagement
- Color 2 (BLUE): Long-term value, steady performance
- Color 1 (RED): Cold - low engagement, avoid
- Color 0 (GREY): Overused - your post will get buried

## OUTPUT FORMAT
{
  "selectedHashtags": {
    "primary": ["tag1", "tag2"],
    "secondary": ["tag3", "tag4"],
    "niche": ["tag5"]
  },
  "placement": "first_comment",
  "strategyNotes": "explanation",
  "totalPotentialReach": 1234567
}`

const VISUAL_PROMPT_ENGINEER_SYSTEM = `You are a visual prompt engineer specializing in Instagram-optimized images.

## DALL-E 3 BEST PRACTICES
- Be specific: "professional woman, 30s" > "person"
- Include lighting: "soft natural light"
- Specify style: "editorial photography"
- Add mood: "clean, modern"
- Composition: "centered subject, space for text"
- NO text in images (DALL-E struggles with text)

## OUTPUT FORMAT
{
  "imagePrompts": [
    {
      "slideNumber": 1,
      "prompt": "detailed prompt, 50-100 words",
      "hasTextOverlay": true,
      "textSafeZone": "right third",
      "aspectRatio": "1:1",
      "size": "1024x1024",
      "generator": "dalle"
    }
  ],
  "styleConsistency": "notes"
}`

const QUALITY_REVIEWER_SYSTEM = `You are a merciless Instagram content reviewer.

## SCORING CRITERIA (100 points)
- Hook Power (25): scroll-stop, value prop, curiosity
- Caption Quality (25): human voice, structure, grammar
- Hashtag Strategy (20): mix, relevance, no banned
- Visual Direction (15): specific prompts, consistency
- Engagement Potential (15): save/share/comment worthy

## OUTPUT FORMAT
{
  "totalScore": 85,
  "breakdown": {
    "hookPower": 22,
    "captionQuality": 23,
    "hashtagStrategy": 18,
    "visualDirection": 12,
    "engagementPotential": 10
  },
  "verdict": "PASS",
  "criticalFixes": [],
  "suggestions": []
}`

const FINAL_POLISH_SYSTEM_CLAUDE = `You are the final editor. Polish this Instagram content to perfection.

Apply all required changes from the quality review while maintaining the human voice.

## OUTPUT FORMAT
{
  "finalCaption": "polished caption with line breaks",
  "finalHashtags": ["tag1", "tag2"],
  "hashtagPlacement": "first_comment",
  "finalSlides": [
    {
      "number": 1,
      "headline": "polished",
      "subtext": "polished",
      "visualDirection": "refined"
    }
  ],
  "altText": "accessible description",
  "changesMade": ["change1"]
}`

// Premium-only prompts
const HOOK_SPECIALIST_SYSTEM = `You are a hook specialist. The first slide/line determines 90% of engagement.

Generate 5 hook variations using different psychological triggers:

1. QUESTION HOOK - Curiosity gap
2. STATISTIC HOOK - Social proof
3. CONTROVERSY HOOK - Pattern interrupt
4. STORY HOOK - Narrative curiosity
5. PROMISE HOOK - Desire for outcome

## SCORING (1-10 each)
- Scroll-stop power
- Relevance
- Specificity
- Emotional pull
- Audience match

## OUTPUT FORMAT
{
  "hooks": [
    {
      "type": "question",
      "headline": "5 words max",
      "captionOpener": "first 125 chars",
      "scores": {
        "scrollStop": 8,
        "relevance": 9,
        "specificity": 7,
        "emotionalPull": 8,
        "audienceMatch": 9
      },
      "totalScore": 41,
      "reasoning": "why this works"
    }
  ],
  "recommendedHook": 1,
  "recommendedReason": "explanation",
  "abTestSuggestion": {
    "primary": 1,
    "alternative": 3,
    "hypothesis": "test explanation"
  }
}`

const VISUAL_DIRECTOR_SYSTEM = `You are a Visual Director creating complete art direction for an Instagram carousel.

## YOUR DELIVERABLES
1. Visual Identity Guide - consistent look
2. Slide-by-Slide Art Direction - specific per slide
3. Text Overlay Strategy - which slides need text
4. Image Generation Routing - DALL-E (photo) vs Ideogram (text)

## OUTPUT FORMAT
{
  "visualIdentity": {
    "overallStyle": "minimalist editorial",
    "colorPalette": {
      "primary": "#2E86AB",
      "secondary": "#F5F5F5",
      "accent": "#FF6B6B",
      "textOnImage": "#FFFFFF"
    },
    "typography": {
      "headlineStyle": "bold, uppercase, sans-serif",
      "maxWordsPerSlide": 10
    },
    "compositionRules": ["centered subject", "30% negative space"],
    "moodKeywords": ["clean", "confident"],
    "consistencyElements": ["blue gradient", "rounded corners"]
  },
  "slideDirections": [
    {
      "slideNumber": 1,
      "purpose": "hook",
      "imageGenerator": "ideogram",
      "reasoning": "needs text overlay",
      "textContent": {
        "headline": "The 5-Second Rule",
        "subtext": "optional",
        "placement": "center",
        "style": "bold white on gradient"
      },
      "backgroundConcept": "abstract gradient",
      "subject": null,
      "composition": "text-focused"
    }
  ],
  "generatorCounts": {
    "dalle": 3,
    "ideogram": 2
  }
}`

// ============================================
// TYPES
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
  numberOfImages?: number
  style?: string
  customStyle?: string
  mood?: string
  customMood?: string
  colorPreferences?: string[]
  subjectsToInclude?: string[]
  subjectsToAvoid?: string[]
  additionalImageNotes?: string
  referenceImages?: string[]
  referenceImageInstructions?: string
}

export interface GeneratedImage {
  slideNumber: number
  prompt: string
  imageUrl: string
  revisedPrompt?: string
  generator?: 'dalle' | 'ideogram'
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
    tier: 'standard' | 'premium'
    format: string
    slideCount: number
    processingStages: string[]
    hashtagSource?: string
    imageGenerators?: string[]
  }
}

// ============================================
// STANDARD TIER PIPELINE
// ============================================

export async function runStandardInstagramPipeline(
  formData: InstagramFormData,
  styleSelections: Partial<InstagramStyleProfile>,
  imageOptions: InstagramImageOptions,
  additionalInfo: string = ''
): Promise<InstagramPipelineResult> {
  console.log('⭐ STANDARD INSTAGRAM PIPELINE: Starting...')

  const processingStages: string[] = []
  const styleProfile = { ...defaultInstagramStyleProfile, ...styleSelections }
  const numberOfSlides = imageOptions.numberOfImages || (formData.contentType === 'carousel' ? 5 : 1)

  // ========== STAGE 0: INPUT PROCESSOR (GPT-4o-mini) ==========
  console.log('📋 Stage 0: Processing inputs (GPT-4o-mini)...')
  processingStages.push('Input Processing')

  const inputPrompt = `
<form_data>${JSON.stringify(formData, null, 2)}</form_data>
<style_profile>${JSON.stringify(styleProfile, null, 2)}</style_profile>
<image_options>${JSON.stringify(imageOptions, null, 2)}</image_options>
<additional_info>${additionalInfo}</additional_info>

Process these inputs for Instagram content generation.`

  const inputResult = await callOpenAI(OPENAI_MODELS.GPT_4O_MINI, INPUT_PROCESSOR_SYSTEM, inputPrompt, 2000)
  let processedInput: any
  try {
    const jsonMatch = inputResult.match(/\{[\s\S]*\}/)
    processedInput = JSON.parse(jsonMatch ? jsonMatch[0] : inputResult)
  } catch {
    processedInput = {
      brand: { company: formData.company, industry: formData.industry },
      request: { topic: formData.topic, format: formData.contentType || 'single_post', slideCount: numberOfSlides },
    }
  }
  console.log('✅ Input processing complete')

  // ========== STAGE 0.5: REFERENCE IMAGE ANALYSIS (if provided) ==========
  let styleTemplate: any = null
  if (imageOptions.generateImages && imageOptions.referenceImages?.length && imageOptions.referenceImageInstructions) {
    console.log('🔍 Stage 0.5: Analyzing reference images (GPT-4o Vision)...')
    processingStages.push('Reference Image Analysis')
    try {
      styleTemplate = await analyzeReferenceImages(imageOptions.referenceImages, imageOptions.referenceImageInstructions)
      console.log('✅ Reference image analysis complete')
    } catch (error) {
      console.log('⚠️ Reference image analysis failed:', error)
    }
  }

  // ========== STAGE 1: RESEARCH & STRATEGY (GPT-4.1) ==========
  console.log('🔍 Stage 1: Research & Strategy (GPT-4.1)...')
  processingStages.push('Research & Strategy')

  const researchPrompt = `
Industry: ${formData.industry}
Topic: ${formData.topic}
Audience: ${formData.audience}
Goal: ${formData.goal || 'engagement'}

Research Instagram trends and strategy for this content.`

  const researchResult = await callOpenAI(OPENAI_MODELS.GPT_4_1, RESEARCH_STRATEGY_SYSTEM, researchPrompt, 2000)
  let researchData: any
  try {
    const jsonMatch = researchResult.match(/\{[\s\S]*\}/)
    researchData = JSON.parse(jsonMatch ? jsonMatch[0] : researchResult)
  } catch {
    researchData = { trendingAngles: [], audienceHooks: [], seoKeywords: [] }
  }
  console.log('✅ Research complete')

  // ========== STAGE 2: CONTENT ARCHITECT (Claude Sonnet) ==========
  console.log('🏗️ Stage 2: Content Architect (Claude Sonnet)...')
  processingStages.push('Content Architecture (Claude)')

  const architectPrompt = `
Topic: ${formData.topic}
Audience: ${formData.audience}
Industry: ${formData.industry}
Format: ${formData.contentType || 'carousel'}
Number of Slides: ${numberOfSlides}
Brand Voice: ${processedInput.brand?.voice || 'professional'}

Research Insights:
${JSON.stringify(researchData, null, 2)}

Design a ${numberOfSlides}-slide carousel. Create EXACTLY ${numberOfSlides} slides.`

  const architectResult = await callClaude(CONTENT_ARCHITECT_SYSTEM_CLAUDE, architectPrompt, 3000)
  let architecture: any
  try {
    const jsonMatch = architectResult.match(/\{[\s\S]*\}/)
    architecture = JSON.parse(jsonMatch ? jsonMatch[0] : architectResult)
  } catch {
    architecture = { slides: [], captionDirection: {}, visualConsistency: {} }
  }
  console.log('✅ Architecture complete')

  // ========== STAGE 3: CAPTION WRITER (Claude Sonnet) ==========
  console.log('✍️ Stage 3: Caption Writer (Claude Sonnet)...')
  processingStages.push('Caption Writing (Claude)')

  const captionPrompt = `
Topic: ${formData.topic}
Company: ${formData.company}
Industry: ${formData.industry}
Audience: ${formData.audience}
Goal: ${formData.goal || 'engagement'}
Brand Voice: ${styleProfile.caption_tone}
Emoji Usage: ${styleProfile.emoji_usage}
CTA Style: ${styleProfile.cta_style}

Content Architecture:
${JSON.stringify(architecture, null, 2)}

Write an engaging Instagram caption following the architecture.`

  const captionDraft = await callClaude(CAPTION_WRITER_SYSTEM_CLAUDE, captionPrompt, 2000)
  console.log('✅ Caption draft complete')

  // ========== STAGE 4: HASHTAG STRATEGIST (GPT-4o-mini + RiteTag API) ==========
  console.log('🏷️ Stage 4: Hashtag Strategist (GPT-4o-mini + RiteTag)...')
  processingStages.push('Hashtag Strategy (RiteTag)')

  let hashtagData: any = { selectedHashtags: { primary: [], secondary: [], niche: [] }, placement: 'first_comment' }
  let hashtagSource = 'llm_fallback'

  // Try RiteTag API first
  if (isRiteTagConfigured()) {
    try {
      // Step 1: Extract keywords
      const keywordPrompt = `Extract 5-7 seed keywords from this content for hashtag research:
Caption: ${captionDraft}
Topic: ${formData.topic}
Industry: ${formData.industry}

Return JSON array only: ["keyword1", "keyword2", ...]`

      const keywordResult = await callOpenAI(OPENAI_MODELS.GPT_4O_MINI, 'Extract keywords as JSON array.', keywordPrompt, 500)
      let keywords: string[] = []
      try {
        keywords = JSON.parse(keywordResult.match(/\[[\s\S]*\]/)?.[0] || '[]')
      } catch {
        keywords = [formData.topic, formData.industry]
      }

      // Step 2: Query RiteTag for each keyword
      const allHashtags: RiteTagHashtag[] = []
      for (const keyword of keywords.slice(0, 5)) {
        try {
          const suggestions = await getHashtagSuggestions(keyword)
          if (suggestions.data) {
            allHashtags.push(...suggestions.data)
          }
        } catch (e) {
          console.log(`⚠️ RiteTag query failed for "${keyword}":`, e)
        }
      }

      // Step 3: Get optimal mix
      const goal = (formData.goal?.toLowerCase().includes('reach') ? 'reach' :
        formData.goal?.toLowerCase().includes('save') ? 'saves' : 'engagement') as 'reach' | 'engagement' | 'saves'

      const optimalMix = selectOptimalMix(allHashtags, goal, 15)

      hashtagData = {
        selectedHashtags: {
          primary: optimalMix.primary.map(h => h.hashtag),
          secondary: optimalMix.secondary.map(h => h.hashtag),
          niche: optimalMix.niche.map(h => h.hashtag),
        },
        placement: 'first_comment',
        totalPotentialReach: optimalMix.totalReach,
      }
      hashtagSource = 'ritetag_api'
      console.log(`✅ RiteTag: Found ${allHashtags.length} hashtags, selected optimal mix`)
    } catch (error) {
      console.log('⚠️ RiteTag API failed, using LLM fallback:', error)
    }
  }

  // Fallback to LLM if RiteTag failed or not configured
  if (hashtagSource === 'llm_fallback') {
    const hashtagPrompt = `
Caption: ${captionDraft}
Topic: ${formData.topic}
Industry: ${formData.industry}
Goal: ${formData.goal || 'engagement'}

Select 10-15 optimal hashtags. Mix sizes (2 large 500K+, 5 medium 50K-500K, 5 niche <50K).

Return JSON:
{
  "selectedHashtags": {
    "primary": ["tag1", "tag2"],
    "secondary": ["tag3", "tag4", "tag5"],
    "niche": ["tag6", "tag7"]
  },
  "placement": "first_comment"
}`

    const hashtagResult = await callOpenAI(OPENAI_MODELS.GPT_4O_MINI, HASHTAG_STRATEGIST_SYSTEM, hashtagPrompt, 1500)
    try {
      const jsonMatch = hashtagResult.match(/\{[\s\S]*\}/)
      hashtagData = JSON.parse(jsonMatch ? jsonMatch[0] : hashtagResult)
    } catch {
      hashtagData = { selectedHashtags: { primary: [], secondary: [], niche: [] }, placement: 'first_comment' }
    }
  }
  console.log(`✅ Hashtag strategy complete (source: ${hashtagSource})`)

  // ========== STAGE 5: VISUAL PROMPT ENGINEER (GPT-4o) ==========
  console.log('🎨 Stage 5: Visual Prompt Engineer (GPT-4o)...')
  processingStages.push('Visual Prompt Engineering')

  const visualPrompt = `
Architecture:
${JSON.stringify(architecture, null, 2)}

Image Options:
Style: ${imageOptions.style || 'photography'}
Mood: ${imageOptions.mood || 'professional'}
Number of Images: ${numberOfSlides}
${styleTemplate ? `\nReference Style Template:\n${JSON.stringify(styleTemplate, null, 2)}` : ''}

Create ${numberOfSlides} detailed DALL-E 3 prompts.`

  const visualResult = await callOpenAI(OPENAI_MODELS.GPT_4O, VISUAL_PROMPT_ENGINEER_SYSTEM, visualPrompt, 3000)
  let visualData: any
  try {
    const jsonMatch = visualResult.match(/\{[\s\S]*\}/)
    visualData = JSON.parse(jsonMatch ? jsonMatch[0] : visualResult)
  } catch {
    visualData = { imagePrompts: [] }
  }
  console.log('✅ Visual prompts complete')

  // ========== STAGE 6: IMAGE GENERATION (DALL-E 3) ==========
  let generatedImages: GeneratedImage[] = []

  if (imageOptions.generateImages && visualData.imagePrompts?.length > 0) {
    console.log('🖼️ Stage 6: Image Generation (DALL-E 3)...')
    processingStages.push('Image Generation (DALL-E 3)')

    // Extract brand DNA for prompt enhancement
    const brandDNA = extractBrandDNA(
      formData.company,
      formData.industry || '',
      formData.topic,
      formData.audience || '',
      imageOptions.colorPreferences
    )

    const promptsToProcess = visualData.imagePrompts.slice(0, numberOfSlides)

    for (let i = 0; i < promptsToProcess.length; i++) {
      const imgPrompt = promptsToProcess[i]
      const slideNumber = i + 1
      const slidePurpose = architecture?.slides?.[i]?.purpose || (i === 0 ? 'hook' : i === numberOfSlides - 1 ? 'cta' : 'content')

      try {
        console.log(`   Generating image ${slideNumber}/${numberOfSlides}...`)

        // Enhance the prompt with quality modifiers and brand DNA
        const enhanced = enhanceImagePrompt({
          basePrompt: imgPrompt.prompt,
          slideNumber,
          slidePurpose: slidePurpose as 'hook' | 'content' | 'cta' | 'general',
          textContent: imgPrompt.text_overlay || architecture?.slides?.[i]?.headline,
          brandDNA,
          imageStyle: imageOptions.style,
          imageMood: imageOptions.mood,
          colorPreferences: imageOptions.colorPreferences,
          isIdeogram: false,
          aspectRatio: formData.contentType === 'story' ? 'portrait' : 'square',
        })

        const imageSize: '1024x1024' | '1024x1792' | '1792x1024' =
          formData.contentType === 'story' || formData.contentType === 'reels_cover'
            ? '1024x1792'
            : '1024x1024'

        const result = await generateDalleImage(enhanced.prompt, imageSize, 'hd')

        generatedImages.push({
          slideNumber,
          prompt: enhanced.prompt,
          imageUrl: result.url,
          revisedPrompt: result.revisedPrompt,
          generator: 'dalle',
        })
        console.log(`   ✅ Image ${slideNumber} generated (quality score: ${enhanced.qualityScore})`)
      } catch (error) {
        console.log(`   ⚠️ Image ${slideNumber} failed:`, error)
      }
    }
    console.log(`✅ Image generation complete (${generatedImages.length}/${numberOfSlides})`)
  }

  // ========== STAGE 7: QUALITY REVIEWER (GPT-4o) ==========
  console.log('🔎 Stage 7: Quality Reviewer (GPT-4o)...')
  processingStages.push('Quality Review')

  const reviewPrompt = `
Caption: ${captionDraft}
Hashtags: ${JSON.stringify(hashtagData.selectedHashtags)}
Architecture: ${JSON.stringify(architecture, null, 2)}
Visual Prompts: ${JSON.stringify(visualData.imagePrompts?.slice(0, 3), null, 2)}

Topic: ${formData.topic}
Audience: ${formData.audience}
Goal: ${formData.goal || 'engagement'}

Review this content.`

  const reviewResult = await callOpenAI(OPENAI_MODELS.GPT_4O, QUALITY_REVIEWER_SYSTEM, reviewPrompt, 2000)
  let qualityReview: any
  try {
    const jsonMatch = reviewResult.match(/\{[\s\S]*\}/)
    qualityReview = JSON.parse(jsonMatch ? jsonMatch[0] : reviewResult)
  } catch {
    qualityReview = { totalScore: 80, breakdown: {}, verdict: 'PASS', criticalFixes: [] }
  }
  console.log('✅ Quality review complete')

  // ========== STAGE 8: FINAL POLISH (Claude Sonnet) ==========
  console.log('✨ Stage 8: Final Polish (Claude Sonnet)...')
  processingStages.push('Final Polish (Claude)')

  const polishPrompt = `
Caption: ${captionDraft}
Hashtags: ${JSON.stringify(hashtagData.selectedHashtags)}
Architecture: ${JSON.stringify(architecture, null, 2)}

Quality Review:
${JSON.stringify(qualityReview, null, 2)}

Apply all fixes and polish the content.`

  const finalResult = await callClaude(FINAL_POLISH_SYSTEM_CLAUDE, polishPrompt, 3000)
  let finalContent: any
  try {
    const jsonMatch = finalResult.match(/\{[\s\S]*\}/)
    finalContent = JSON.parse(jsonMatch ? jsonMatch[0] : finalResult)
  } catch {
    const allHashtags = [
      ...(hashtagData.selectedHashtags?.primary || []),
      ...(hashtagData.selectedHashtags?.secondary || []),
      ...(hashtagData.selectedHashtags?.niche || []),
    ]
    finalContent = {
      finalCaption: captionDraft,
      finalHashtags: allHashtags,
      finalSlides: architecture.slides || [],
      altText: `${formData.topic} - ${formData.company}`,
    }
  }
  console.log('✅ Final polish complete')

  // ========== BUILD RESPONSE ==========
  const result: InstagramPipelineResult = {
    content: {
      caption: finalContent.finalCaption || captionDraft,
      hashtags: finalContent.finalHashtags || [],
      altText: finalContent.altText || '',
      slides: (finalContent.finalSlides || architecture.slides || []).map((s: any, i: number) => ({
        slideNumber: s.number || s.slideNumber || i + 1,
        headline: s.headline || '',
        subtext: s.subtext || '',
        visualDirection: s.visualDirection || s.visualConcept || '',
      })),
    },
    images: generatedImages.length > 0 ? generatedImages : undefined,
    qualityReport: {
      totalScore: qualityReview.totalScore || 0,
      breakdown: {
        captionQuality: qualityReview.breakdown?.captionQuality || 0,
        seoDiscoverability: qualityReview.breakdown?.hashtagStrategy || 0,
        visualDirection: qualityReview.breakdown?.visualDirection || 0,
        engagementPotential: qualityReview.breakdown?.engagementPotential || 0,
      },
      feedback: [
        ...(qualityReview.criticalFixes || []).map((f: string) => `🔧 ${f}`),
        ...(qualityReview.suggestions || []).map((s: string) => `💡 ${s}`),
      ],
    },
    metadata: {
      tier: 'standard',
      format: formData.contentType || 'single_post',
      slideCount: numberOfSlides,
      processingStages,
      hashtagSource,
      imageGenerators: ['dalle'],
    },
  }

  console.log('⭐ STANDARD INSTAGRAM PIPELINE: Complete!')
  return result
}

// ============================================
// PREMIUM TIER PIPELINE
// ============================================

export async function runPremiumInstagramPipeline(
  formData: InstagramFormData,
  styleSelections: Partial<InstagramStyleProfile>,
  imageOptions: InstagramImageOptions,
  additionalInfo: string = ''
): Promise<InstagramPipelineResult> {
  console.log('👑 PREMIUM INSTAGRAM PIPELINE: Starting...')

  const processingStages: string[] = []
  const styleProfile = { ...defaultInstagramStyleProfile, ...styleSelections }
  const numberOfSlides = imageOptions.numberOfImages || (formData.contentType === 'carousel' ? 5 : 1)

  // ========== STAGE 0: INPUT PROCESSOR (GPT-4o-mini) ==========
  console.log('📋 Stage 0: Processing inputs (GPT-4o-mini)...')
  processingStages.push('Input Processing')

  const inputResult = await callOpenAI(
    OPENAI_MODELS.GPT_4O_MINI,
    INPUT_PROCESSOR_SYSTEM,
    `<form_data>${JSON.stringify(formData)}</form_data><style>${JSON.stringify(styleProfile)}</style><images>${JSON.stringify(imageOptions)}</images><additional>${additionalInfo}</additional>`,
    2000
  )
  let processedInput: any
  try {
    processedInput = JSON.parse(inputResult.match(/\{[\s\S]*\}/)?.[0] || '{}')
  } catch {
    processedInput = { brand: { company: formData.company }, request: { topic: formData.topic, slideCount: numberOfSlides } }
  }
  console.log('✅ Input processing complete')

  // ========== STAGE 0.5: ENHANCED REFERENCE STYLE EXTRACTION (Premium) ==========
  let styleTemplate: any = null
  if (imageOptions.generateImages && imageOptions.referenceImages?.length && imageOptions.referenceImageInstructions) {
    console.log('🔍 Stage 0.5: Enhanced Style Extraction (GPT-4o Vision)...')
    processingStages.push('Enhanced Style Extraction (Premium)')
    try {
      styleTemplate = await analyzeReferenceImages(imageOptions.referenceImages, imageOptions.referenceImageInstructions)
      console.log('✅ Style template extracted')
    } catch (error) {
      console.log('⚠️ Style extraction failed:', error)
    }
  }

  // ========== STAGE 1: RESEARCH & STRATEGY + TRENDING (GPT-4.1) ==========
  console.log('🔍 Stage 1: Research & Strategy + Trending (GPT-4.1)...')
  processingStages.push('Research & Strategy + Trending')

  // Also fetch trending hashtags for premium
  let trendingData: any = null
  if (isRiteTagConfigured()) {
    try {
      const trending = await getTrendingHashtags({ green: true, latin: true })
      trendingData = trending.tags?.slice(0, 10) || []
      console.log(`   📈 Fetched ${trendingData.length} trending hashtags`)
    } catch (e) {
      console.log('   ⚠️ Trending fetch failed:', e)
    }
  }

  const researchResult = await callOpenAI(
    OPENAI_MODELS.GPT_4_1,
    RESEARCH_STRATEGY_SYSTEM,
    `Industry: ${formData.industry}\nTopic: ${formData.topic}\nAudience: ${formData.audience}\nGoal: ${formData.goal}\n${trendingData ? `Trending: ${trendingData.map((t: any) => t.hashtag).join(', ')}` : ''}`,
    2000
  )
  let researchData: any
  try {
    researchData = JSON.parse(researchResult.match(/\{[\s\S]*\}/)?.[0] || '{}')
  } catch {
    researchData = { trendingAngles: [], seoKeywords: [] }
  }
  console.log('✅ Research complete')

  // ========== STAGE 2: CONTENT ARCHITECT (Claude Sonnet) ==========
  console.log('🏗️ Stage 2: Content Architect (Claude Sonnet)...')
  processingStages.push('Content Architecture (Claude)')

  const architectResult = await callClaude(
    CONTENT_ARCHITECT_SYSTEM_CLAUDE,
    `Topic: ${formData.topic}\nAudience: ${formData.audience}\nFormat: ${formData.contentType}\nSlides: ${numberOfSlides}\nVoice: ${styleProfile.caption_tone}\nResearch: ${JSON.stringify(researchData)}`,
    3000
  )
  let architecture: any
  try {
    architecture = JSON.parse(architectResult.match(/\{[\s\S]*\}/)?.[0] || '{}')
  } catch {
    architecture = { slides: [], captionDirection: {}, visualConsistency: {} }
  }
  console.log('✅ Architecture complete')

  // ========== STAGE 2.5: HOOK SPECIALIST (Premium - Claude Sonnet) ==========
  console.log('🎯 Stage 2.5: Hook Specialist (Claude Sonnet)...')
  processingStages.push('Hook Specialist (Premium)')

  const hookResult = await callClaude(
    HOOK_SPECIALIST_SYSTEM,
    `Topic: ${formData.topic}\nAudience: ${formData.audience}\nIndustry: ${formData.industry}\nGoal: ${formData.goal}\nContent Type: ${formData.contentType}\n\nArchitecture:\n${JSON.stringify(architecture, null, 2)}`,
    3000
  )
  let hookData: any
  try {
    hookData = JSON.parse(hookResult.match(/\{[\s\S]*\}/)?.[0] || '{}')
  } catch {
    hookData = { hooks: [], recommendedHook: 0 }
  }

  // Get the winning hook
  const winningHook = hookData.hooks?.[hookData.recommendedHook - 1] || hookData.hooks?.[0] || null
  console.log(`✅ Hook specialist complete (recommended: ${hookData.recommendedHook || 1})`)

  // ========== STAGE 3: CAPTION WRITER with Hook (Claude Sonnet) ==========
  console.log('✍️ Stage 3: Caption Writer with Hook (Claude Sonnet)...')
  processingStages.push('Caption Writing with Hook (Claude)')

  const captionPrompt = `
Topic: ${formData.topic}
Company: ${formData.company}
Audience: ${formData.audience}
Goal: ${formData.goal}
Voice: ${styleProfile.caption_tone}
Emoji: ${styleProfile.emoji_usage}

${winningHook ? `WINNING HOOK TO USE:
Headline: ${winningHook.headline}
Caption Opener: ${winningHook.captionOpener}
Hook Type: ${winningHook.type}

START the caption with this hook.` : ''}

Architecture:
${JSON.stringify(architecture.captionDirection, null, 2)}`

  const captionDraft = await callClaude(CAPTION_WRITER_SYSTEM_CLAUDE, captionPrompt, 2000)
  console.log('✅ Caption draft complete')

  // ========== STAGE 4: HASHTAG STRATEGIST (Premium with full RiteTag) ==========
  console.log('🏷️ Stage 4: Hashtag Strategist (GPT-4o-mini + Full RiteTag)...')
  processingStages.push('Hashtag Strategy (Full RiteTag)')

  let hashtagData: any = { selectedHashtags: { primary: [], secondary: [], niche: [] }, placement: 'first_comment' }
  let hashtagSource = 'llm_fallback'

  if (isRiteTagConfigured()) {
    try {
      // Extract more keywords for premium
      const keywordResult = await callOpenAI(
        OPENAI_MODELS.GPT_4O_MINI,
        'Extract keywords as JSON array.',
        `Extract 7-10 seed keywords:\nCaption: ${captionDraft}\nTopic: ${formData.topic}\nIndustry: ${formData.industry}\nReturn: ["keyword1", ...]`,
        500
      )
      let keywords: string[] = []
      try {
        keywords = JSON.parse(keywordResult.match(/\[[\s\S]*\]/)?.[0] || '[]')
      } catch {
        keywords = [formData.topic, formData.industry]
      }

      const allHashtags: RiteTagHashtag[] = []
      for (const keyword of keywords.slice(0, 7)) {
        try {
          const suggestions = await getHashtagSuggestions(keyword)
          if (suggestions.data) allHashtags.push(...suggestions.data)
        } catch {}
      }

      // Add trending for premium
      if (trendingData?.length) {
        allHashtags.push(...trendingData)
      }

      const goal = (formData.goal?.toLowerCase().includes('reach') ? 'reach' :
        formData.goal?.toLowerCase().includes('save') ? 'saves' : 'engagement') as 'reach' | 'engagement' | 'saves'

      const optimalMix = selectOptimalMix(allHashtags, goal, 18)

      hashtagData = {
        selectedHashtags: {
          primary: optimalMix.primary.map(h => h.hashtag),
          secondary: optimalMix.secondary.map(h => h.hashtag),
          niche: optimalMix.niche.map(h => h.hashtag),
        },
        placement: 'first_comment',
        totalPotentialReach: optimalMix.totalReach,
      }
      hashtagSource = 'ritetag_api_premium'
      console.log(`✅ RiteTag Premium: ${allHashtags.length} hashtags analyzed`)
    } catch (error) {
      console.log('⚠️ RiteTag failed:', error)
    }
  }

  if (hashtagSource === 'llm_fallback') {
    const hashtagResult = await callOpenAI(
      OPENAI_MODELS.GPT_4O_MINI,
      HASHTAG_STRATEGIST_SYSTEM,
      `Caption: ${captionDraft}\nTopic: ${formData.topic}\nIndustry: ${formData.industry}\nGoal: ${formData.goal}\n\nSelect 15-18 optimal hashtags.`,
      1500
    )
    try {
      hashtagData = JSON.parse(hashtagResult.match(/\{[\s\S]*\}/)?.[0] || '{}')
    } catch {}
  }
  console.log(`✅ Hashtag strategy complete (source: ${hashtagSource})`)

  // ========== STAGE 5: VISUAL DIRECTOR (Premium - GPT-4o) ==========
  console.log('🎬 Stage 5: Visual Director (GPT-4o)...')
  processingStages.push('Visual Director (Premium)')

  const visualDirectorPrompt = `
Company: ${formData.company}
Industry: ${formData.industry}
Topic: ${formData.topic}
Mood: ${imageOptions.mood || 'professional'}
Style: ${imageOptions.style || 'minimalist'}
Number of Slides: ${numberOfSlides}

Architecture:
${JSON.stringify(architecture, null, 2)}

${styleTemplate ? `Reference Style Template:\n${JSON.stringify(styleTemplate, null, 2)}` : ''}

Create complete art direction. Decide which slides use DALL-E (photos) vs Ideogram (text).`

  const visualDirectorResult = await callOpenAI(OPENAI_MODELS.GPT_4O, VISUAL_DIRECTOR_SYSTEM, visualDirectorPrompt, 4000)
  let visualDirection: any
  try {
    visualDirection = JSON.parse(visualDirectorResult.match(/\{[\s\S]*\}/)?.[0] || '{}')
  } catch {
    visualDirection = { visualIdentity: {}, slideDirections: [] }
  }
  console.log('✅ Visual direction complete')

  // ========== STAGE 6: VISUAL PROMPT ENGINEER (GPT-4o) ==========
  console.log('🎨 Stage 6: Visual Prompt Engineer (GPT-4o)...')
  processingStages.push('Visual Prompt Engineering')

  const promptEngineerPrompt = `
Visual Direction:
${JSON.stringify(visualDirection, null, 2)}

Create detailed image prompts based on the Visual Director's guidance.
For slides marked "ideogram", include text content in the prompt.
For slides marked "dalle", focus on photorealistic imagery with space for text overlay.`

  const visualResult = await callOpenAI(OPENAI_MODELS.GPT_4O, VISUAL_PROMPT_ENGINEER_SYSTEM, promptEngineerPrompt, 3500)
  let visualData: any
  try {
    visualData = JSON.parse(visualResult.match(/\{[\s\S]*\}/)?.[0] || '{}')
  } catch {
    visualData = { imagePrompts: [] }
  }
  console.log('✅ Visual prompts complete')

  // ========== STAGE 7: IMAGE GENERATION (DALL-E 3 + Ideogram) ==========
  let generatedImages: GeneratedImage[] = []
  const imageGenerators: string[] = []

  if (imageOptions.generateImages) {
    console.log('🖼️ Stage 7: Image Generation (DALL-E 3 + Ideogram)...')
    processingStages.push('Image Generation (DALL-E 3 + Ideogram)')

    // Extract brand DNA for prompt enhancement
    const brandDNA = extractBrandDNA(
      formData.company,
      formData.industry || '',
      formData.topic,
      formData.audience || '',
      imageOptions.colorPreferences
    )

    // Merge prompts with visual direction
    const slideDirections = visualDirection.slideDirections || []
    const imagePrompts = visualData.imagePrompts || []

    for (let i = 0; i < numberOfSlides; i++) {
      const slideNumber = i + 1
      const direction = slideDirections[i] || {}
      const prompt = imagePrompts[i] || {}
      const generator = direction.imageGenerator || prompt.generator || 'dalle'
      const slidePurpose = direction.purpose || (i === 0 ? 'hook' : i === numberOfSlides - 1 ? 'cta' : 'content')

      try {
        console.log(`   Generating image ${slideNumber}/${numberOfSlides} with ${generator}...`)

        // Enhance the prompt with quality modifiers and brand DNA
        const textContent = direction.textContent?.headline || prompt.text_overlay || architecture?.slides?.[i]?.headline
        const enhanced = enhanceImagePrompt({
          basePrompt: prompt.prompt || `Slide about ${formData.topic}`,
          slideNumber,
          slidePurpose: slidePurpose as 'hook' | 'content' | 'cta' | 'general',
          textContent: textContent,
          textPlacement: direction.textContent?.placement || 'center',
          brandDNA,
          imageStyle: imageOptions.style,
          imageMood: imageOptions.mood,
          colorPreferences: imageOptions.colorPreferences,
          isIdeogram: generator === 'ideogram',
          aspectRatio: formData.contentType === 'story' ? 'portrait' : 'square',
        })

        if (generator === 'ideogram' && isIdeogramConfigured()) {
          // Use Ideogram for text-heavy slides with enhanced prompt
          const result = await generateIdeogramImage(
            enhanced.prompt,
            {
              format: formData.contentType === 'story' ? 'story' : 'square',
              includeText: !!textContent,
              textContent: textContent,
              style: mapStyleToPreset(imageOptions.style || 'minimalist'),
              mood: imageOptions.mood,
              colorPalette: imageOptions.colorPreferences,
            }
          )

          generatedImages.push({
            slideNumber,
            prompt: enhanced.prompt,
            imageUrl: result.url,
            revisedPrompt: result.revisedPrompt,
            generator: 'ideogram',
          })
          if (!imageGenerators.includes('ideogram')) imageGenerators.push('ideogram')
        } else {
          // Use DALL-E for photorealistic slides with enhanced prompt
          const imageSize: '1024x1024' | '1024x1792' | '1792x1024' =
            formData.contentType === 'story' ? '1024x1792' : '1024x1024'

          const result = await generateDalleImage(enhanced.prompt, imageSize, 'hd')

          generatedImages.push({
            slideNumber,
            prompt: enhanced.prompt,
            imageUrl: result.url,
            revisedPrompt: result.revisedPrompt,
            generator: 'dalle',
          })
          if (!imageGenerators.includes('dalle')) imageGenerators.push('dalle')
        }
        console.log(`   ✅ Image ${slideNumber} generated (${generator}, quality score: ${enhanced.qualityScore})`)
      } catch (error) {
        console.log(`   ⚠️ Image ${slideNumber} failed:`, error)
        // Fallback to DALL-E if Ideogram fails
        if (generator === 'ideogram') {
          try {
            const fallbackEnhanced = enhanceImagePrompt({
              basePrompt: prompt.prompt || `Slide ${slideNumber}`,
              slideNumber,
              slidePurpose: slidePurpose as 'hook' | 'content' | 'cta' | 'general',
              brandDNA,
              isIdeogram: false,
            })
            const result = await generateDalleImage(fallbackEnhanced.prompt, '1024x1024', 'hd')
            generatedImages.push({
              slideNumber,
              prompt: fallbackEnhanced.prompt,
              imageUrl: result.url,
              generator: 'dalle',
            })
            console.log(`   ✅ Image ${slideNumber} fallback to DALL-E`)
          } catch {}
        }
      }
    }
    console.log(`✅ Image generation complete (${generatedImages.length}/${numberOfSlides})`)
  }

  // ========== STAGE 8: QUALITY REVIEWER (GPT-4o) ==========
  console.log('🔎 Stage 8: Quality Reviewer (GPT-4o)...')
  processingStages.push('Quality Review')

  const reviewResult = await callOpenAI(
    OPENAI_MODELS.GPT_4O,
    QUALITY_REVIEWER_SYSTEM,
    `Caption: ${captionDraft}\nHashtags: ${JSON.stringify(hashtagData.selectedHashtags)}\nHook: ${JSON.stringify(winningHook)}\nArchitecture: ${JSON.stringify(architecture)}\n\nTopic: ${formData.topic}\nGoal: ${formData.goal}`,
    2000
  )
  let qualityReview: any
  try {
    qualityReview = JSON.parse(reviewResult.match(/\{[\s\S]*\}/)?.[0] || '{}')
  } catch {
    qualityReview = { totalScore: 85, verdict: 'PASS', criticalFixes: [], suggestions: [] }
  }
  console.log('✅ Quality review complete')

  // ========== STAGE 9: FINAL POLISH (Claude Sonnet) ==========
  console.log('✨ Stage 9: Final Polish (Claude Sonnet)...')
  processingStages.push('Final Polish (Claude)')

  const finalResult = await callClaude(
    FINAL_POLISH_SYSTEM_CLAUDE,
    `Caption: ${captionDraft}\nHashtags: ${JSON.stringify(hashtagData.selectedHashtags)}\nArchitecture: ${JSON.stringify(architecture)}\nHook Used: ${JSON.stringify(winningHook)}\n\nQuality Review:\n${JSON.stringify(qualityReview)}\n\nApply fixes and polish.`,
    3000
  )
  let finalContent: any
  try {
    finalContent = JSON.parse(finalResult.match(/\{[\s\S]*\}/)?.[0] || '{}')
  } catch {
    const allHashtags = [
      ...(hashtagData.selectedHashtags?.primary || []),
      ...(hashtagData.selectedHashtags?.secondary || []),
      ...(hashtagData.selectedHashtags?.niche || []),
    ]
    finalContent = {
      finalCaption: captionDraft,
      finalHashtags: allHashtags,
      finalSlides: architecture.slides || [],
      altText: `${formData.topic} by ${formData.company}`,
    }
  }
  console.log('✅ Final polish complete')

  // ========== BUILD RESPONSE ==========
  const result: InstagramPipelineResult = {
    content: {
      caption: finalContent.finalCaption || captionDraft,
      hashtags: finalContent.finalHashtags || [],
      altText: finalContent.altText || '',
      slides: (finalContent.finalSlides || architecture.slides || []).map((s: any, i: number) => ({
        slideNumber: s.number || s.slideNumber || i + 1,
        headline: s.headline || '',
        subtext: s.subtext || '',
        visualDirection: s.visualDirection || s.visualConcept || '',
      })),
    },
    images: generatedImages.length > 0 ? generatedImages : undefined,
    qualityReport: {
      totalScore: qualityReview.totalScore || 0,
      breakdown: {
        captionQuality: qualityReview.breakdown?.captionQuality || 0,
        seoDiscoverability: qualityReview.breakdown?.hashtagStrategy || 0,
        visualDirection: qualityReview.breakdown?.visualDirection || 0,
        engagementPotential: qualityReview.breakdown?.engagementPotential || 0,
      },
      feedback: [
        ...(qualityReview.criticalFixes || []).map((f: string) => `🔧 ${f}`),
        ...(qualityReview.suggestions || []).map((s: string) => `💡 ${s}`),
        hookData.hooks?.length > 0 ? `🎯 Hook options: ${hookData.hooks.map((h: any) => h.type).join(', ')}` : '',
      ].filter(Boolean),
    },
    metadata: {
      tier: 'premium',
      format: formData.contentType || 'single_post',
      slideCount: numberOfSlides,
      processingStages,
      hashtagSource,
      imageGenerators,
    },
  }

  console.log('👑 PREMIUM INSTAGRAM PIPELINE: Complete!')
  return result
}
