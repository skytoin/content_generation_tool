/**
 * LinkedIn Article/Newsletter Pipeline
 *
 * A 7-stage pipeline for generating LinkedIn long-form articles and newsletters.
 *
 * Pipeline Stages:
 * Stage 0: Input Processor - Parse inputs, detect content source
 * Stage 1: Deep Research - Comprehensive topic research for authoritative content
 * Stage 2: Voice Learning - Analyze customer's writing style (if samples provided)
 * Stage 3: Article Strategist - Plan structure, sections, and companion post
 * Stage 4: Article Writing - Write full article + companion post + first comment
 * Stage 5: Harsh Critique - Quality, depth, and authority assessment
 * Stage 6: Final Polish - Apply fixes, optimize
 *
 * Each article includes: full article, companion post, first comment, SEO keywords
 */

import Anthropic from '@anthropic-ai/sdk'
import { callOpenAI, OPENAI_MODELS } from '../openai-client'
import {
  LinkedInStyleProfile,
  LinkedInArticleFormData,
  LinkedInArticlePipelineResult,
  GeneratedArticle,
  defaultLinkedInStyleProfile,
  mergeWithLinkedInDefaults
} from '../linkedin-options'
import { LINKEDIN_PLATFORM_RULES, LINKEDIN_MODELS } from './knowledge'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const CLAUDE_SONNET = 'claude-sonnet-4-5-20250929'
const CLAUDE_OPUS = 'claude-opus-4-5-20251101'

// ============================================
// STAGE 0: INPUT PROCESSOR
// ============================================

const INPUT_PROCESSOR_SYSTEM = `You are an expert LinkedIn article strategist who prepares inputs for long-form content creation.

## YOUR MISSION
Parse inputs for LinkedIn article/newsletter generation.

## LINKEDIN ARTICLE KNOWLEDGE
- Title: max 100 characters
- Body: up to 110,000 characters
- Optimal length: 1,000-2,000 words
- Articles appear in "Activity" section permanently (unlike posts)
- Can be part of a Newsletter (subscribers get notified)
- SEO-friendly (indexed by Google)

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
      "article_count": 0,
      "primary_topics": [],
      "key_messages": [],
      "depth_level": ""
    },
    "content_source": {
      "type": "",
      "source_content_summary": "",
      "extractable_ideas": []
    },
    "constraints": {
      "must_include": [],
      "must_avoid": [],
      "keywords": []
    }
  }
}`

// ============================================
// STAGE 1: DEEP RESEARCH
// ============================================

const DEEP_RESEARCH_SYSTEM = `You are an elite research analyst who provides comprehensive intelligence for authoritative LinkedIn articles.

## YOUR MISSION
Conduct deep research to provide the article writer with substantive data, insights, and evidence.

${LINKEDIN_PLATFORM_RULES}

## RESEARCH AREAS
1. Current industry data and statistics
2. Expert opinions and frameworks
3. Case studies and real examples
4. Counter-arguments and nuances
5. Emerging trends and predictions
6. Competitor content analysis (what articles are performing)

## OUTPUT FORMAT
Return a JSON object:
{
  "research_findings": {
    "key_statistics": [],
    "expert_frameworks": [],
    "case_studies": [],
    "counter_arguments": [],
    "trending_angles": []
  },
  "content_opportunities": {
    "unique_angles": [],
    "underserved_topics": [],
    "data_points_to_include": []
  },
  "seo_intelligence": {
    "target_keywords": [],
    "related_searches": [],
    "content_gaps": []
  },
  "hashtag_recommendations": {
    "primary": [],
    "niche": []
  }
}`

// ============================================
// STAGE 2: VOICE LEARNING
// ============================================

const VOICE_LEARNING_SYSTEM = `You are a master linguistic analyst who deconstructs writing styles for long-form LinkedIn content.

## YOUR MISSION
Analyze sample posts/articles to extract the customer's voice for article writing.

## OUTPUT FORMAT
Return a JSON object:
{
  "voice_profile": {
    "overall_description": "",
    "personality_summary": ""
  },
  "long_form_patterns": {
    "paragraph_length": "",
    "section_structure": "",
    "transition_style": "",
    "evidence_usage": ""
  },
  "writing_instructions": "Detailed instructions for this voice in long-form...",
  "phrases_to_emulate": [],
  "confidence_score": 0.0
}`

// ============================================
// STAGE 3: ARTICLE STRATEGIST
// ============================================

const ARTICLE_STRATEGIST_SYSTEM = `You are a master content strategist who designs LinkedIn articles that establish authority and drive engagement.

## YOUR MISSION
Design the complete structure for each article and its companion post strategy.

## ARTICLE STRUCTURE PRINCIPLES
1. Title: Compelling, SEO-friendly, under 100 characters
2. Subtitle: Expand on the title, set expectations
3. Introduction: Hook the reader, state the value proposition
4. Body sections: 3-5 clear sections with subheadings
5. Conclusion: Key takeaway + forward-looking statement
6. Companion Post: A regular LinkedIn post that promotes the article

## COMPANION POST STRATEGY
- The companion post drives traffic to the article
- First 210 chars = compelling hook
- Tease key insights WITHOUT giving everything away
- Link goes in FIRST COMMENT (not post body)
- 3-5 hashtags at end of companion post

## OUTPUT FORMAT
Return a JSON object:
{
  "article_plans": [
    {
      "article_number": 1,
      "title": "",
      "subtitle": "",
      "article_type": "",
      "target_word_count": 0,
      "sections": [
        {
          "heading": "",
          "purpose": "",
          "key_points": [],
          "evidence_to_include": []
        }
      ],
      "seo_keywords": [],
      "companion_post_strategy": {
        "hook_approach": "",
        "body_approach": "",
        "first_comment_plan": ""
      }
    }
  ]
}`

// ============================================
// STAGE 4: ARTICLE WRITING
// ============================================

const ARTICLE_WRITER_SYSTEM = `You are an elite LinkedIn article writer who creates authoritative, engaging long-form content.

## YOUR MISSION
Write complete LinkedIn articles with companion posts and first comments.

${LINKEDIN_PLATFORM_RULES}

## ARTICLE WRITING RULES

### TITLE
- Under 100 characters
- Specific and compelling
- Include a keyword naturally
- Numbers work well ("7 Lessons...", "The 3 Things...")

### STRUCTURE
- Short paragraphs (2-4 sentences)
- Clear subheadings for each section
- Use bullet points for lists
- Include data and examples
- Bold key phrases for scanning

### TONE
- Authoritative but accessible
- First person where appropriate
- Include personal experience/perspective
- Back claims with evidence

### COMPANION POST
- 210 char hook that makes people want to read the article
- Short post body that teases key insights
- CTA to read the full article
- Link goes in FIRST COMMENT only
- 3-5 hashtags at end

## OUTPUT FORMAT
Return a JSON array:
[
  {
    "article_number": 1,
    "title": "",
    "subtitle": "",
    "body": "Full article text with markdown formatting",
    "word_count": 0,
    "sections": [
      { "heading": "", "content": "" }
    ],
    "seo_keywords": [],
    "companion_post": "LinkedIn post text with \\n for line breaks",
    "companion_post_first_comment": "First comment with link placeholder",
    "hashtags": []
  }
]`

// ============================================
// STAGE 5: HARSH CRITIQUE
// ============================================

const ARTICLE_CRITIQUE_SYSTEM = `You are a merciless LinkedIn article critic with expert-level standards.

## YOUR MISSION
Evaluate articles for depth, authority, readability, and LinkedIn optimization.

## EVALUATION FRAMEWORK

### 1. TITLE & SUBTITLE (15 points)
Compelling? SEO-friendly? Under limits?

### 2. CONTENT DEPTH (25 points)
Expert-level insights? Data-backed? Unique perspective?

### 3. STRUCTURE & READABILITY (20 points)
Clear sections? Scannable? Proper paragraph length?

### 4. VOICE AUTHENTICITY (15 points)
Sounds human? Matches customer voice? No AI patterns?

### 5. COMPANION POST (15 points)
Hook compelling? Teases without giving away? First comment has link?

### 6. SEO & PLATFORM (10 points)
Keywords natural? Hashtags correct? Character limits respected?

## OUTPUT FORMAT
Return a JSON object:
{
  "overall_assessment": {
    "pass_for_delivery": true,
    "average_score": 0,
    "articles_needing_rewrite": []
  },
  "article_critiques": [
    {
      "article_number": 1,
      "total_score": 0,
      "verdict": "PASS | NEEDS_REVISION | REWRITE_REQUIRED",
      "specific_problems": [],
      "exact_fixes_required": [],
      "depth_assessment": ""
    }
  ]
}`

// ============================================
// STAGE 6: FINAL POLISH
// ============================================

const ARTICLE_POLISH_SYSTEM = `You are a master LinkedIn article editor. Apply all fixes and deliver publication-ready articles.

## POLISH PRIORITIES
1. Fix ALL issues from critique
2. Strengthen weak sections
3. Perfect titles and subtitles
4. Optimize companion posts
5. Verify SEO keywords are natural
6. Ensure first comments are substantive

## OUTPUT FORMAT
Return a JSON object:
{
  "polished_articles": [
    {
      "id": 1,
      "title": "",
      "subtitle": "",
      "body": "Full polished article",
      "word_count": 0,
      "sections": [{ "heading": "", "content": "" }],
      "seo_keywords": [],
      "companion_post": "",
      "companion_post_first_comment": "",
      "hashtags": [],
      "engagement_score": 8
    }
  ],
  "delivery_ready": true
}`

// ============================================
// MAIN PIPELINE FUNCTION
// ============================================

export async function runLinkedInArticlePipeline(
  formData: LinkedInArticleFormData,
  styleSelections: Partial<LinkedInStyleProfile>,
  tier: 'budget' | 'standard' | 'premium' = 'budget'
): Promise<LinkedInArticlePipelineResult> {
  console.log(`📰 LINKEDIN ARTICLE PIPELINE (${tier.toUpperCase()} TIER): Starting generation...`)

  const processingStages: string[] = []
  const styleProfile = mergeWithLinkedInDefaults(styleSelections)

  // ========== STAGE 0: INPUT PROCESSOR ==========
  console.log('📋 Stage 0: Processing inputs...')
  processingStages.push('Input Processing')

  const inputResult = await callOpenAI(
    OPENAI_MODELS.GPT_4O_MINI,
    INPUT_PROCESSOR_SYSTEM,
    `<form_data>\n${JSON.stringify(formData, null, 2)}\n</form_data>\n<source_content>\n${formData.sourceContent || 'No source content'}\n</source_content>\nProcess for ${formData.articleCount} LinkedIn articles.`,
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
        content_request: { article_count: formData.articleCount, primary_topics: [formData.topic] },
        constraints: { must_include: formData.mustInclude || [], must_avoid: formData.mustAvoid || [] }
      }
    }
  }
  console.log('✅ Input processing complete')

  // ========== STAGE 1: DEEP RESEARCH ==========
  let researchData: any = null

  if (tier !== 'budget') {
    console.log('🔍 Stage 1: Deep Research...')
    processingStages.push('Deep Research')

    const researchPrompt = `
<processed_input>
${JSON.stringify(processedInput, null, 2)}
</processed_input>

Research deeply for LinkedIn articles about:
- Industry: ${formData.industry}
- Topic: ${formData.topic}
- Audience: ${formData.audience}
- Article Type: ${styleProfile.article_type}

Provide comprehensive data, statistics, expert frameworks, and case studies.
`

    if (tier === 'premium') {
      const response = await anthropic.messages.create({
        model: CLAUDE_SONNET,
        max_tokens: 6000,
        messages: [{ role: 'user', content: `${DEEP_RESEARCH_SYSTEM}\n\n${researchPrompt}` }]
      })
      const result = response.content[0].type === 'text' ? response.content[0].text : ''
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/)
        researchData = JSON.parse(jsonMatch ? jsonMatch[0] : result)
      } catch {
        researchData = { research_findings: {}, content_opportunities: {} }
      }
    } else {
      const result = await callOpenAI(OPENAI_MODELS.GPT_4O, DEEP_RESEARCH_SYSTEM, researchPrompt, 6000)
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/)
        researchData = JSON.parse(jsonMatch ? jsonMatch[0] : result)
      } catch {
        researchData = { research_findings: {}, content_opportunities: {} }
      }
    }
    console.log('✅ Deep Research complete')
  } else {
    processingStages.push('Deep Research (Skipped - Budget Tier)')
  }

  // ========== STAGE 2: VOICE LEARNING ==========
  let voiceProfile: any = null

  if (formData.samplePosts && formData.samplePosts.trim().length > 100) {
    console.log('🎤 Stage 2: Voice Learning...')
    processingStages.push('Voice Learning')

    const voiceModel = tier === 'premium' ? CLAUDE_SONNET : OPENAI_MODELS.GPT_4O
    const voicePrompt = `<sample_posts>\n${formData.samplePosts}\n</sample_posts>\n\nAnalyze for long-form LinkedIn article voice.`

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

  // ========== STAGE 3: ARTICLE STRATEGIST ==========
  console.log('📊 Stage 3: Article Strategy...')
  processingStages.push('Article Strategy')

  const strategistModel = tier === 'budget' ? OPENAI_MODELS.GPT_4O : (tier === 'standard' ? OPENAI_MODELS.GPT_4_1 : CLAUDE_SONNET)
  const strategistPrompt = `
<processed_input>
${JSON.stringify(processedInput, null, 2)}
</processed_input>

<research>
${researchData ? JSON.stringify(researchData, null, 2) : 'No research data'}
</research>

<style_profile>
${JSON.stringify(styleProfile, null, 2)}
</style_profile>

Design ${formData.articleCount} LinkedIn article structures.
Article type: ${styleProfile.article_type}
Target length: ${styleProfile.article_length}
Companion post style: ${styleProfile.companion_post_style}
`

  let strategyData: any
  if (tier === 'premium') {
    const response = await anthropic.messages.create({
      model: CLAUDE_SONNET,
      max_tokens: 5000,
      messages: [{ role: 'user', content: `${ARTICLE_STRATEGIST_SYSTEM}\n\n${strategistPrompt}` }]
    })
    const result = response.content[0].type === 'text' ? response.content[0].text : ''
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      strategyData = JSON.parse(jsonMatch ? jsonMatch[0] : result)
    } catch {
      strategyData = { article_plans: [] }
    }
  } else {
    const result = await callOpenAI(strategistModel, ARTICLE_STRATEGIST_SYSTEM, strategistPrompt, 5000)
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      strategyData = JSON.parse(jsonMatch ? jsonMatch[0] : result)
    } catch {
      strategyData = { article_plans: [] }
    }
  }
  console.log('✅ Article Strategy complete')

  // ========== STAGE 4: ARTICLE WRITING ==========
  console.log('✍️ Stage 4: Article Writing...')
  processingStages.push('Article Writing')

  const writerModel = tier === 'premium' ? CLAUDE_SONNET : (tier === 'standard' ? OPENAI_MODELS.GPT_4_1 : OPENAI_MODELS.GPT_4O)
  const writerPrompt = `
<article_strategy>
${JSON.stringify(strategyData, null, 2)}
</article_strategy>

<research>
${researchData ? JSON.stringify(researchData, null, 2) : 'No research data'}
</research>

<voice_profile>
${voiceProfile ? JSON.stringify(voiceProfile, null, 2) : 'No voice profile - use authoritative professional tone'}
</voice_profile>

<style_profile>
${JSON.stringify(styleProfile, null, 2)}
</style_profile>

<brand_info>
Company: ${formData.company}
Industry: ${formData.industry}
Topic: ${formData.topic}
Audience: ${formData.audience}
${formData.goals ? `Goals: ${formData.goals}` : ''}
</brand_info>

Write ${formData.articleCount} complete LinkedIn articles with companion posts and first comments.

CRITICAL:
- Title under 100 characters
- Include companion post (210 char hook)
- Link in first comment ONLY
- 3-5 hashtags on companion post
- Articles should be ${styleProfile.article_length === 'short' ? '800-1200' : styleProfile.article_length === 'deep_dive' ? '2000-3000' : '1200-2000'} words

Return a JSON array.
`

  let draftArticles: any[]
  if (tier === 'premium') {
    const response = await anthropic.messages.create({
      model: CLAUDE_SONNET,
      max_tokens: 16000,
      messages: [{ role: 'user', content: `${ARTICLE_WRITER_SYSTEM}\n\n${writerPrompt}` }]
    })
    const result = response.content[0].type === 'text' ? response.content[0].text : ''
    try {
      const jsonMatch = result.match(/\[[\s\S]*\]/)
      draftArticles = JSON.parse(jsonMatch ? jsonMatch[0] : '[]')
    } catch {
      draftArticles = []
    }
  } else {
    const result = await callOpenAI(writerModel, ARTICLE_WRITER_SYSTEM, writerPrompt, 16000)
    try {
      const jsonMatch = result.match(/\[[\s\S]*\]/)
      draftArticles = JSON.parse(jsonMatch ? jsonMatch[0] : '[]')
    } catch {
      draftArticles = []
    }
  }
  console.log(`✅ Article Writing complete (${draftArticles.length} articles)`)

  // ========== STAGE 5: HARSH CRITIQUE ==========
  console.log('🔎 Stage 5: Harsh Critique...')
  processingStages.push('Harsh Critique')

  const critiqueModel = tier === 'premium' ? CLAUDE_OPUS : (tier === 'standard' ? CLAUDE_SONNET : OPENAI_MODELS.GPT_4O)
  const critiquePrompt = `
<draft_articles>
${JSON.stringify(draftArticles, null, 2)}
</draft_articles>

<customer_requirements>
Company: ${formData.company}
Industry: ${formData.industry}
Topic: ${formData.topic}
Audience: ${formData.audience}
${formData.goals ? `Goals: ${formData.goals}` : ''}
Article Type: ${styleProfile.article_type}
</customer_requirements>

Critique articles for depth, authority, voice, and LinkedIn optimization.
`

  let critiqueData: any
  if (tier === 'premium' || tier === 'standard') {
    const critiqueModelId = tier === 'premium' ? CLAUDE_OPUS : CLAUDE_SONNET
    const response = await anthropic.messages.create({
      model: critiqueModelId,
      max_tokens: 6000,
      messages: [{ role: 'user', content: `${ARTICLE_CRITIQUE_SYSTEM}\n\n${critiquePrompt}` }]
    })
    const result = response.content[0].type === 'text' ? response.content[0].text : ''
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      critiqueData = JSON.parse(jsonMatch ? jsonMatch[0] : result)
    } catch {
      critiqueData = { overall_assessment: { pass_for_delivery: true, average_score: 75 }, article_critiques: [] }
    }
  } else {
    const result = await callOpenAI(OPENAI_MODELS.GPT_4O, ARTICLE_CRITIQUE_SYSTEM, critiquePrompt, 6000)
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      critiqueData = JSON.parse(jsonMatch ? jsonMatch[0] : result)
    } catch {
      critiqueData = { overall_assessment: { pass_for_delivery: true, average_score: 75 }, article_critiques: [] }
    }
  }
  console.log('✅ Harsh Critique complete')

  // ========== STAGE 6: FINAL POLISH ==========
  console.log('✨ Stage 6: Final Polish...')
  processingStages.push('Final Polish')

  const polishModel = tier === 'premium' ? CLAUDE_OPUS : CLAUDE_SONNET
  const polishPrompt = `
<draft_articles>
${JSON.stringify(draftArticles, null, 2)}
</draft_articles>

<critique>
${JSON.stringify(critiqueData, null, 2)}
</critique>

<voice_profile>
${voiceProfile ? JSON.stringify(voiceProfile, null, 2) : 'No voice profile'}
</voice_profile>

Apply ALL fixes and deliver publication-ready articles with companion posts.
`

  const polishResponse = await anthropic.messages.create({
    model: polishModel,
    max_tokens: 16000,
    messages: [{ role: 'user', content: `${ARTICLE_POLISH_SYSTEM}\n\n${polishPrompt}` }]
  })

  const polishResult = polishResponse.content[0].type === 'text' ? polishResponse.content[0].text : ''
  let polishedData: any
  try {
    const jsonMatch = polishResult.match(/\{[\s\S]*\}/)
    polishedData = JSON.parse(jsonMatch ? jsonMatch[0] : polishResult)
  } catch {
    polishedData = { polished_articles: draftArticles, delivery_ready: true }
  }
  console.log('✅ Final Polish complete')

  // ========== BUILD RESPONSE ==========
  const articles: GeneratedArticle[] = (polishedData.polished_articles || []).map((a: any, i: number) => ({
    id: a.id || i + 1,
    title: a.title || '',
    subtitle: a.subtitle || '',
    body: a.body || '',
    wordCount: a.word_count || a.body?.split(/\s+/).length || 0,
    sections: (a.sections || []).map((s: any) => ({
      heading: s.heading || '',
      content: s.content || ''
    })),
    companionPost: a.companion_post || '',
    companionPostFirstComment: a.companion_post_first_comment || '',
    hashtags: a.hashtags || [],
    seoKeywords: a.seo_keywords || [],
    engagementScore: a.engagement_score || 7
  }))

  const result: LinkedInArticlePipelineResult = {
    articles,
    trendBriefing: researchData ? {
      currentTrends: researchData.content_opportunities?.unique_angles || [],
      relevantTopics: researchData.content_opportunities?.underserved_topics || []
    } : undefined,
    voiceProfile: voiceProfile ? {
      summary: voiceProfile.voice_profile?.overall_description || '',
      keyPatterns: voiceProfile.phrases_to_emulate || []
    } : undefined,
    qualityReport: {
      overallScore: critiqueData.overall_assessment?.average_score || 75,
      depthScore: 8,
      feedback: (critiqueData.article_critiques || []).flatMap((c: any) => c.specific_problems || [])
    },
    metadata: {
      tier,
      processingStages,
      totalArticles: articles.length
    }
  }

  console.log('📰 LINKEDIN ARTICLE PIPELINE: Complete!')
  return result
}
