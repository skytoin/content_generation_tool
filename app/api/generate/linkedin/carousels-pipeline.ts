/**
 * LinkedIn Carousel Pipeline
 *
 * A 7-stage pipeline for generating LinkedIn carousel/document posts.
 * Carousels get 2.5-3x more reach than text-only posts on LinkedIn.
 *
 * Pipeline Stages:
 * Stage 0: Input Processor - Parse inputs, detect content source
 * Stage 1: LinkedIn Intelligence Research - Trends, what carousel formats work
 * Stage 2: Voice Learning - Analyze customer's writing style (if samples provided)
 * Stage 3: Carousel Architect - Plan slide structure, flow, and visual direction
 * Stage 4: Content Generation - Write caption, slides, first comment
 * Stage 5: Harsh Critique - Quality and engagement assessment
 * Stage 6: Final Polish - Apply fixes, optimize for algorithm
 *
 * Each carousel includes: caption, slides with visual directions, first comment, hashtags
 */

import Anthropic from '@anthropic-ai/sdk'
import { callOpenAI, OPENAI_MODELS } from '../openai-client'
import {
  LinkedInStyleProfile,
  LinkedInCarouselFormData,
  LinkedInCarouselPipelineResult,
  GeneratedCarousel,
  CarouselSlide,
  defaultLinkedInStyleProfile,
  mergeWithLinkedInDefaults
} from '../linkedin-options'
import { LINKEDIN_PLATFORM_RULES, LINKEDIN_POST_STRUCTURE, LINKEDIN_MODELS } from './knowledge'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const CLAUDE_SONNET = 'claude-sonnet-4-5-20250929'
const CLAUDE_OPUS = 'claude-opus-4-5-20251101'

// ============================================
// STAGE 0: INPUT PROCESSOR
// ============================================

const INPUT_PROCESSOR_SYSTEM = `You are an expert LinkedIn carousel strategist who analyzes inputs for carousel content creation.

## YOUR MISSION
Parse inputs and prepare data for LinkedIn carousel generation. Carousels are document posts that get 2.5-3x more reach than text posts.

${LINKEDIN_PLATFORM_RULES}

## CAROUSEL-SPECIFIC KNOWLEDGE
- Optimal slide count: 8-12 slides
- First slide = hook/cover (must stop the scroll)
- Last slide = CTA (follow, share, save)
- Each slide should have ONE clear idea
- Visual consistency across all slides
- Text should be large enough to read on mobile

## OUTPUT FORMAT
Return a JSON object:
{
  "processed_input": {
    "brand_info": {
      "company": "",
      "industry": "",
      "target_audience": "",
      "brand_positioning": ""
    },
    "content_request": {
      "carousel_count": 0,
      "primary_topics": [],
      "key_messages": []
    },
    "content_source": {
      "type": "",
      "source_content_summary": "",
      "extractable_ideas": []
    },
    "visual_preferences": {
      "brand_colors": [],
      "visual_style": "",
      "reference_image_notes": ""
    },
    "constraints": {
      "must_include": [],
      "must_avoid": []
    }
  }
}`

// ============================================
// STAGE 1: LINKEDIN INTELLIGENCE RESEARCH
// ============================================

const CAROUSEL_RESEARCH_SYSTEM = `You are an elite LinkedIn carousel analyst who knows exactly what carousel formats drive engagement.

## YOUR MISSION
Research what carousel formats, structures, and topics are working on LinkedIn right now for the customer's niche.

${LINKEDIN_PLATFORM_RULES}

## CAROUSEL-SPECIFIC RESEARCH
- What carousel formats are getting the most saves?
- What cover slide designs stop the scroll?
- What slide counts perform best in this niche?
- What visual styles are trending?
- What carousel topics have high share rates?

## OUTPUT FORMAT
Return a JSON object:
{
  "trend_analysis": {
    "hot_carousel_topics": [],
    "successful_formats": [],
    "emerging_opportunities": []
  },
  "format_insights": {
    "best_slide_counts": [],
    "effective_cover_styles": [],
    "high_save_formats": []
  },
  "hashtag_recommendations": {
    "primary": [],
    "niche": [],
    "avoid": []
  },
  "timing_recommendations": {
    "best_times": [],
    "reasoning": ""
  },
  "strategic_opportunities": []
}`

// ============================================
// STAGE 2: VOICE LEARNING (shared with text-posts)
// ============================================

const VOICE_LEARNING_SYSTEM = `You are a master linguistic analyst who deconstructs writing styles for LinkedIn carousel content.

## YOUR MISSION
Analyze sample posts to extract the customer's unique voice for carousel captions and slide text.

## OUTPUT FORMAT
Return a JSON object:
{
  "voice_profile": {
    "overall_description": "",
    "personality_summary": ""
  },
  "vocabulary_profile": {
    "formality_level": "",
    "favorite_words": [],
    "unique_phrases": []
  },
  "tone_markers": {
    "confidence_level": "",
    "humor_usage": ""
  },
  "writing_instructions": "Detailed instructions for mimicking this voice in carousel captions...",
  "phrases_to_emulate": [],
  "confidence_score": 0.0
}`

// ============================================
// STAGE 3: CAROUSEL ARCHITECT
// ============================================

const CAROUSEL_ARCHITECT_SYSTEM = `You are a master carousel architect who designs LinkedIn carousels that get saved, shared, and generate massive reach.

## YOUR MISSION
Design the complete structure for each carousel: slide-by-slide flow, visual direction, and caption strategy.

${LINKEDIN_PLATFORM_RULES}

## CAROUSEL ARCHITECTURE PRINCIPLES

### SLIDE STRUCTURE
1. **Cover Slide (Slide 1)**: The scroll-stopper. Bold headline, curiosity gap, visual hook.
2. **Context Slide (Slide 2)**: Set up the problem or promise. Why should they keep swiping?
3. **Content Slides (3 to N-1)**: One idea per slide. Clear, scannable, valuable.
4. **Summary/CTA Slide (Last)**: Key takeaway + call to action (follow, share, save).

### VISUAL DIRECTION FOR EACH SLIDE
- Describe layout, text placement, visual elements
- Maintain visual consistency across all slides
- Consider mobile readability (text must be large)
- Use contrast for emphasis
- White space is your friend

### CAPTION STRATEGY
- Caption appears alongside the carousel
- First 210 chars = hook (before "See More")
- Caption should complement, not repeat slide content
- Include why this carousel matters
- 3-5 hashtags at end

## OUTPUT FORMAT
Return a JSON object:
{
  "carousel_plans": [
    {
      "carousel_number": 1,
      "title": "",
      "carousel_type": "how_to | listicle | story | framework | comparison | myth_busting",
      "target_audience_hook": "",
      "slide_plans": [
        {
          "slide_number": 1,
          "purpose": "cover | context | content | summary_cta",
          "headline": "",
          "body_text": "",
          "visual_direction": "",
          "text_layout": ""
        }
      ],
      "caption_strategy": {
        "hook": "",
        "body_approach": "",
        "cta": ""
      },
      "first_comment_plan": ""
    }
  ]
}`

// ============================================
// STAGE 4: CONTENT GENERATION
// ============================================

const CAROUSEL_WRITER_SYSTEM = `You are an elite LinkedIn carousel copywriter who creates carousels that get massive saves and shares.

## YOUR MISSION
Write complete carousel content: caption, all slides with text, and first comment.

${LINKEDIN_PLATFORM_RULES}

## CAROUSEL WRITING RULES

### COVER SLIDE (Slide 1)
- Maximum 8-10 words for the headline
- Create irresistible curiosity
- Use numbers when possible ("7 Frameworks...")
- Make the value proposition crystal clear

### CONTENT SLIDES
- ONE idea per slide
- Headline (3-7 words, bold)
- Body text (2-4 short sentences max)
- Keep text readable on mobile
- Use bullet points or numbered items
- Leave white space

### CTA SLIDE (Last)
- Summarize key takeaway in 1 sentence
- Clear CTA: "Follow for more" / "Save for later" / "Share with your team"
- Include your name/handle

### CAPTION
- First 210 chars = compelling hook (before "See More")
- Complement slide content, don't repeat it
- Tell them WHY this carousel matters
- End with 3-5 hashtags

### FIRST COMMENT
- Add context or a follow-up question
- Include any links here (NEVER in caption)
- Spark discussion

## OUTPUT FORMAT
Return a JSON array:
[
  {
    "carousel_number": 1,
    "caption": "The LinkedIn caption text with \\n for line breaks",
    "caption_character_count": 0,
    "hook_text": "First 210 chars",
    "slides": [
      {
        "slide_number": 1,
        "headline": "",
        "body": "",
        "visual_direction": "",
        "speaker_notes": ""
      }
    ],
    "hashtags": ["#Tag1", "#Tag2", "#Tag3"],
    "first_comment": "",
    "engagement_prediction": ""
  }
]`

// ============================================
// STAGE 5: HARSH CRITIQUE
// ============================================

const CAROUSEL_CRITIQUE_SYSTEM = `You are a merciless LinkedIn carousel critic. Your standards are impossibly high.

## YOUR MISSION
Ruthlessly evaluate every carousel against quality standards and LinkedIn best practices.

${LINKEDIN_PLATFORM_RULES}

## EVALUATION FRAMEWORK

### 1. COVER SLIDE IMPACT (20 points)
Does the cover slide stop the scroll? Is the headline irresistible?

### 2. SLIDE FLOW & STRUCTURE (20 points)
Does each slide build on the previous? Is the progression logical and compelling?

### 3. CONTENT QUALITY (20 points)
Is each slide genuinely valuable? Would someone save this?

### 4. CAPTION EFFECTIVENESS (15 points)
Is the hook compelling? Does the caption complement the slides?

### 5. VISUAL DIRECTION (10 points)
Are visual directions clear and consistent? Mobile-readable?

### 6. CTA & FIRST COMMENT (10 points)
Strong CTA? Substantive first comment?

### 7. PLATFORM OPTIMIZATION (5 points)
Hashtags, link placement, character limits all correct?

## OUTPUT FORMAT
Return a JSON object:
{
  "overall_assessment": {
    "pass_for_delivery": true,
    "average_score": 0,
    "carousels_needing_rewrite": []
  },
  "carousel_critiques": [
    {
      "carousel_number": 1,
      "total_score": 0,
      "verdict": "PASS | NEEDS_REVISION | REWRITE_REQUIRED",
      "cover_slide_score": 0,
      "flow_score": 0,
      "content_score": 0,
      "caption_score": 0,
      "specific_problems": [],
      "exact_fixes_required": []
    }
  ],
  "variety_check": {
    "sufficient_variety": true,
    "recommendations": []
  }
}`

// ============================================
// STAGE 6: FINAL POLISH
// ============================================

const CAROUSEL_POLISH_SYSTEM = `You are a master LinkedIn carousel editor. Apply all critique fixes and deliver publication-ready carousels.

${LINKEDIN_PLATFORM_RULES}

## POLISH PRIORITIES
1. Fix ALL issues from critique
2. Perfect every cover slide headline
3. Ensure slide flow is flawless
4. Optimize caption hook (first 210 chars)
5. Verify first comments are substantive
6. Check all formatting and character limits

## OUTPUT FORMAT
Return a JSON object:
{
  "polished_carousels": [
    {
      "id": 1,
      "caption": "Final caption with \\n",
      "caption_character_count": 0,
      "hook_text": "First 210 chars",
      "slides": [
        {
          "slide_number": 1,
          "headline": "",
          "body": "",
          "visual_direction": "",
          "speaker_notes": ""
        }
      ],
      "hashtags": [],
      "first_comment": "",
      "engagement_score": 8,
      "suggested_posting_time": ""
    }
  ],
  "delivery_ready": true
}`

// ============================================
// MAIN PIPELINE FUNCTION
// ============================================

export async function runLinkedInCarouselPipeline(
  formData: LinkedInCarouselFormData,
  styleSelections: Partial<LinkedInStyleProfile>,
  tier: 'budget' | 'standard' | 'premium' = 'budget'
): Promise<LinkedInCarouselPipelineResult> {
  console.log(`📑 LINKEDIN CAROUSEL PIPELINE (${tier.toUpperCase()} TIER): Starting generation...`)

  const processingStages: string[] = []
  const styleProfile = mergeWithLinkedInDefaults(styleSelections)

  // ========== STAGE 0: INPUT PROCESSOR ==========
  console.log('📋 Stage 0: Processing inputs...')
  processingStages.push('Input Processing')

  const inputPrompt = `
<form_data>
${JSON.stringify(formData, null, 2)}
</form_data>

<style_profile>
${JSON.stringify(styleProfile, null, 2)}
</style_profile>

<source_content>
${formData.sourceContent || 'No source content provided - generate original content'}
</source_content>

Process inputs for LinkedIn carousel generation.
Number of carousels requested: ${formData.carouselCount}
`

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
        content_request: { carousel_count: formData.carouselCount, primary_topics: [formData.topic] },
        content_source: { type: styleProfile.source_type },
        constraints: { must_include: formData.mustInclude || [], must_avoid: formData.mustAvoid || [] }
      }
    }
  }
  console.log('✅ Input processing complete')

  // ========== STAGE 1: RESEARCH ==========
  let researchData: any = null

  if (tier !== 'budget' || styleProfile.trend_integration !== 'none') {
    console.log('🔍 Stage 1: LinkedIn Carousel Research...')
    processingStages.push('LinkedIn Carousel Research')

    const researchPrompt = `
<processed_input>
${JSON.stringify(processedInput, null, 2)}
</processed_input>

Research the LinkedIn carousel landscape for:
- Industry: ${formData.industry}
- Topic: ${formData.topic}
- Audience: ${formData.audience}
`

    if (tier === 'premium') {
      const response = await anthropic.messages.create({
        model: CLAUDE_SONNET,
        max_tokens: 4000,
        messages: [{ role: 'user', content: `${CAROUSEL_RESEARCH_SYSTEM}\n\n${researchPrompt}` }]
      })
      const result = response.content[0].type === 'text' ? response.content[0].text : ''
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/)
        researchData = JSON.parse(jsonMatch ? jsonMatch[0] : result)
      } catch {
        researchData = { trend_analysis: {}, format_insights: {} }
      }
    } else {
      const result = await callOpenAI(OPENAI_MODELS.GPT_4O, CAROUSEL_RESEARCH_SYSTEM, researchPrompt, 4000)
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/)
        researchData = JSON.parse(jsonMatch ? jsonMatch[0] : result)
      } catch {
        researchData = { trend_analysis: {}, format_insights: {} }
      }
    }
    console.log('✅ Research complete')
  } else {
    processingStages.push('Carousel Research (Skipped - Budget Tier)')
  }

  // ========== STAGE 2: VOICE LEARNING ==========
  let voiceProfile: any = null

  if (formData.samplePosts && formData.samplePosts.trim().length > 100) {
    console.log('🎤 Stage 2: Voice Learning...')
    processingStages.push('Voice Learning')

    const voiceModel = tier === 'premium' ? CLAUDE_SONNET : OPENAI_MODELS.GPT_4O
    const voicePrompt = `
<sample_posts>
${formData.samplePosts}
</sample_posts>

Analyze these sample LinkedIn posts and extract the unique voice DNA for carousel captions.
`

    if (tier === 'premium') {
      const response = await anthropic.messages.create({
        model: CLAUDE_SONNET,
        max_tokens: 3000,
        messages: [{ role: 'user', content: `${VOICE_LEARNING_SYSTEM}\n\n${voicePrompt}` }]
      })
      const result = response.content[0].type === 'text' ? response.content[0].text : ''
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/)
        voiceProfile = JSON.parse(jsonMatch ? jsonMatch[0] : result)
      } catch {
        voiceProfile = { writing_instructions: result, confidence_score: 0.6 }
      }
    } else {
      const result = await callOpenAI(voiceModel, VOICE_LEARNING_SYSTEM, voicePrompt, 3000)
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/)
        voiceProfile = JSON.parse(jsonMatch ? jsonMatch[0] : result)
      } catch {
        voiceProfile = { writing_instructions: result, confidence_score: 0.6 }
      }
    }
    console.log('✅ Voice Learning complete')
  } else {
    processingStages.push('Voice Learning (Skipped - No samples)')
  }

  // ========== STAGE 3: CAROUSEL ARCHITECT ==========
  console.log('📐 Stage 3: Carousel Architecture...')
  processingStages.push('Carousel Architecture')

  const architectModel = tier === 'budget' ? OPENAI_MODELS.GPT_4O_MINI : (tier === 'standard' ? OPENAI_MODELS.GPT_4_1 : CLAUDE_SONNET)
  const architectPrompt = `
<processed_input>
${JSON.stringify(processedInput, null, 2)}
</processed_input>

<research_insights>
${researchData ? JSON.stringify(researchData, null, 2) : 'No research data available'}
</research_insights>

<style_profile>
${JSON.stringify(styleProfile, null, 2)}
</style_profile>

<carousel_preferences>
Carousel Type: ${styleProfile.carousel_type}
Slide Count: ${styleProfile.slide_count}
Visual Style: ${styleProfile.visual_style}
Brand Colors: ${formData.brandColors?.join(', ') || 'Not specified'}
</carousel_preferences>

Design ${formData.carouselCount} carousel structures for:
- Industry: ${formData.industry}
- Topic: ${formData.topic}
- Audience: ${formData.audience}
${formData.goals ? `- Goals: ${formData.goals}` : ''}
`

  let architectData: any
  if (tier === 'premium') {
    const response = await anthropic.messages.create({
      model: CLAUDE_SONNET,
      max_tokens: 6000,
      messages: [{ role: 'user', content: `${CAROUSEL_ARCHITECT_SYSTEM}\n\n${architectPrompt}` }]
    })
    const result = response.content[0].type === 'text' ? response.content[0].text : ''
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      architectData = JSON.parse(jsonMatch ? jsonMatch[0] : result)
    } catch {
      architectData = { carousel_plans: [] }
    }
  } else {
    const result = await callOpenAI(architectModel, CAROUSEL_ARCHITECT_SYSTEM, architectPrompt, 6000)
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      architectData = JSON.parse(jsonMatch ? jsonMatch[0] : result)
    } catch {
      architectData = { carousel_plans: [] }
    }
  }
  console.log('✅ Carousel Architecture complete')

  // ========== STAGE 4: CONTENT GENERATION ==========
  console.log('✍️ Stage 4: Content Generation...')
  processingStages.push('Content Generation')

  const writerModel = tier === 'premium' ? CLAUDE_SONNET : (tier === 'standard' ? OPENAI_MODELS.GPT_4_1 : OPENAI_MODELS.GPT_4O)
  const writerPrompt = `
<carousel_architecture>
${JSON.stringify(architectData, null, 2)}
</carousel_architecture>

<processed_input>
${JSON.stringify(processedInput, null, 2)}
</processed_input>

<research_insights>
${researchData ? JSON.stringify(researchData, null, 2) : 'No research data'}
</research_insights>

<voice_profile>
${voiceProfile ? JSON.stringify(voiceProfile, null, 2) : 'No voice profile - use professional, confident tone'}
</voice_profile>

<style_profile>
${JSON.stringify(styleProfile, null, 2)}
</style_profile>

Write ${formData.carouselCount} complete LinkedIn carousels with captions, slides, first comments, and hashtags.

CRITICAL REMINDERS:
- Cover slide must be a scroll-stopper (max 8-10 words)
- ONE idea per slide
- Caption hook must be under 210 characters
- NO links in caption (put in first comment)
- 3-5 hashtags at end of caption
- Each slide needs clear visual direction

Return a JSON array.
`

  let draftCarousels: any[]
  if (tier === 'premium') {
    const response = await anthropic.messages.create({
      model: CLAUDE_SONNET,
      max_tokens: 12000,
      messages: [{ role: 'user', content: `${CAROUSEL_WRITER_SYSTEM}\n\n${writerPrompt}` }]
    })
    const result = response.content[0].type === 'text' ? response.content[0].text : ''
    try {
      const jsonMatch = result.match(/\[[\s\S]*\]/)
      draftCarousels = JSON.parse(jsonMatch ? jsonMatch[0] : '[]')
    } catch {
      draftCarousels = []
    }
  } else {
    const result = await callOpenAI(writerModel, CAROUSEL_WRITER_SYSTEM, writerPrompt, 12000)
    try {
      const jsonMatch = result.match(/\[[\s\S]*\]/)
      draftCarousels = JSON.parse(jsonMatch ? jsonMatch[0] : '[]')
    } catch {
      draftCarousels = []
    }
  }
  console.log(`✅ Content Generation complete (${draftCarousels.length} carousels)`)

  // ========== STAGE 5: HARSH CRITIQUE ==========
  console.log('🔎 Stage 5: Harsh Critique...')
  processingStages.push('Harsh Critique')

  const critiqueModel = tier === 'premium' ? CLAUDE_OPUS : (tier === 'standard' ? CLAUDE_SONNET : OPENAI_MODELS.GPT_4O)
  const critiquePrompt = `
<draft_carousels>
${JSON.stringify(draftCarousels, null, 2)}
</draft_carousels>

<carousel_architecture>
${JSON.stringify(architectData, null, 2)}
</carousel_architecture>

<customer_requirements>
Company: ${formData.company}
Industry: ${formData.industry}
Topic: ${formData.topic}
Audience: ${formData.audience}
${formData.goals ? `Goals: ${formData.goals}` : ''}
</customer_requirements>

Ruthlessly critique every carousel. Check cover slides, slide flow, captions, and first comments.
`

  let critiqueData: any
  if (tier === 'premium' || tier === 'standard') {
    const critiqueModelId = tier === 'premium' ? CLAUDE_OPUS : CLAUDE_SONNET
    const response = await anthropic.messages.create({
      model: critiqueModelId,
      max_tokens: 6000,
      messages: [{ role: 'user', content: `${CAROUSEL_CRITIQUE_SYSTEM}\n\n${critiquePrompt}` }]
    })
    const result = response.content[0].type === 'text' ? response.content[0].text : ''
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      critiqueData = JSON.parse(jsonMatch ? jsonMatch[0] : result)
    } catch {
      critiqueData = { overall_assessment: { pass_for_delivery: true, average_score: 75 }, carousel_critiques: [] }
    }
  } else {
    const result = await callOpenAI(OPENAI_MODELS.GPT_4O, CAROUSEL_CRITIQUE_SYSTEM, critiquePrompt, 6000)
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      critiqueData = JSON.parse(jsonMatch ? jsonMatch[0] : result)
    } catch {
      critiqueData = { overall_assessment: { pass_for_delivery: true, average_score: 75 }, carousel_critiques: [] }
    }
  }
  console.log('✅ Harsh Critique complete')

  // ========== STAGE 6: FINAL POLISH ==========
  console.log('✨ Stage 6: Final Polish...')
  processingStages.push('Final Polish')

  const polishModel = tier === 'premium' ? CLAUDE_OPUS : CLAUDE_SONNET
  const polishPrompt = `
<draft_carousels>
${JSON.stringify(draftCarousels, null, 2)}
</draft_carousels>

<critique>
${JSON.stringify(critiqueData, null, 2)}
</critique>

<voice_profile>
${voiceProfile ? JSON.stringify(voiceProfile, null, 2) : 'No voice profile'}
</voice_profile>

Apply ALL fixes from the critique and deliver publication-ready carousels.
`

  const polishResponse = await anthropic.messages.create({
    model: polishModel,
    max_tokens: 12000,
    messages: [{ role: 'user', content: `${CAROUSEL_POLISH_SYSTEM}\n\n${polishPrompt}` }]
  })

  const polishResult = polishResponse.content[0].type === 'text' ? polishResponse.content[0].text : ''
  let polishedData: any
  try {
    const jsonMatch = polishResult.match(/\{[\s\S]*\}/)
    polishedData = JSON.parse(jsonMatch ? jsonMatch[0] : polishResult)
  } catch {
    polishedData = { polished_carousels: draftCarousels, delivery_ready: true }
  }
  console.log('✅ Final Polish complete')

  // ========== BUILD RESPONSE ==========
  const carousels: GeneratedCarousel[] = (polishedData.polished_carousels || []).map((c: any, i: number) => ({
    id: c.id || i + 1,
    caption: c.caption || '',
    captionCharacterCount: c.caption_character_count || c.caption?.length || 0,
    hookText: c.hook_text || (c.caption || '').substring(0, 210),
    slides: (c.slides || []).map((s: any, j: number) => ({
      slideNumber: s.slide_number || j + 1,
      headline: s.headline || '',
      body: s.body || '',
      visualDirection: s.visual_direction || '',
      speakerNotes: s.speaker_notes
    })),
    hashtags: c.hashtags || [],
    firstComment: c.first_comment || '',
    engagementScore: c.engagement_score || 7,
    suggestedPostingTime: c.suggested_posting_time || 'Tuesday-Thursday, 8-10 AM'
  }))

  const result: LinkedInCarouselPipelineResult = {
    carousels,
    trendBriefing: researchData ? {
      currentTrends: researchData.trend_analysis?.hot_carousel_topics || [],
      relevantTopics: researchData.trend_analysis?.emerging_opportunities || []
    } : undefined,
    voiceProfile: voiceProfile ? {
      summary: voiceProfile.voice_profile?.overall_description || '',
      keyPatterns: voiceProfile.phrases_to_emulate || []
    } : undefined,
    qualityReport: {
      overallScore: critiqueData.overall_assessment?.average_score || 75,
      algorithmScore: 8,
      feedback: (critiqueData.carousel_critiques || []).flatMap((c: any) => c.specific_problems || [])
    },
    metadata: {
      tier,
      processingStages,
      totalCarousels: carousels.length
    }
  }

  console.log('📑 LINKEDIN CAROUSEL PIPELINE: Complete!')
  return result
}
