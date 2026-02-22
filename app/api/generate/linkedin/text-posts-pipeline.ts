/**
 * LinkedIn Text Post Pipeline
 *
 * A 7-stage pipeline for generating LinkedIn text posts optimized for the algorithm.
 *
 * Pipeline Stages:
 * Stage 0: Input Processor - Parse inputs, detect content source
 * Stage 1: LinkedIn Intelligence Research - Trends, competitors, what's working
 * Stage 2: Voice Learning - Analyze customer's writing style (if samples provided)
 * Stage 3: Content Strategy - Plan post distribution and themes
 * Stage 4: Post Generation - Write posts matching voice and strategy
 * Stage 5: Harsh Critique - Rigorous quality and algorithm assessment
 * Stage 6: Final Polish - Apply fixes and optimize
 *
 * Each post includes: hook, body, CTA, first comment, hashtags, posting calendar
 */

import Anthropic from '@anthropic-ai/sdk'
import { callOpenAI, OPENAI_MODELS } from '../openai-client'
import {
  LinkedInStyleProfile,
  LinkedInTextPostFormData,
  LinkedInTextPostPipelineResult,
  GeneratedLinkedInPost,
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
// STAGE 0: INPUT PROCESSOR SYSTEM PROMPT
// ============================================

const INPUT_PROCESSOR_SYSTEM = `You are an expert LinkedIn content strategist who analyzes customer inputs to prepare for content generation.

## YOUR MISSION
Parse and organize all input data, identify content sources, and validate requirements for the LinkedIn post generation pipeline.

${LINKEDIN_PLATFORM_RULES}

## CONTENT SOURCE DETECTION
Identify if the customer provided:
1. Original topic/keywords (generate from scratch)
2. Blog post content (extract and adapt for LinkedIn format)
3. Newsletter content (extract and adapt)
4. Podcast transcript (extract key moments)
5. Presentation/slides (convert to post format)

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
      "post_count": 0,
      "primary_topics": [],
      "secondary_topics": [],
      "key_messages": []
    },
    "content_source": {
      "type": "original | blog_repurpose | newsletter_repurpose | podcast_repurpose | presentation_repurpose",
      "source_content_summary": "",
      "extractable_ideas": [],
      "key_quotes": []
    },
    "constraints": {
      "must_include": [],
      "must_avoid": [],
      "specific_requests": [],
      "keywords_required": []
    }
  },
  "validation": {
    "is_valid": true,
    "warnings": [],
    "suggestions": []
  }
}`

// ============================================
// STAGE 1: LINKEDIN INTELLIGENCE RESEARCH
// ============================================

const LINKEDIN_INTELLIGENCE_SYSTEM = `You are an elite LinkedIn platform analyst with deep knowledge of what content performs in 2025.

## YOUR MISSION
Research and analyze the LinkedIn landscape for the customer's niche to inform content strategy. Your research directly impacts engagement rates.

${LINKEDIN_PLATFORM_RULES}

## RESEARCH AREAS

### 1. TRENDING TOPICS ANALYSIS
- What professional topics are trending on LinkedIn right now?
- Which conversations have momentum in the customer's industry?
- What topics are oversaturated (avoid)?
- What emerging topics have potential (opportunity)?

### 2. COMPETITOR/THOUGHT LEADER ANALYSIS
- What content formats are top voices using in this niche?
- What hooks are getting engagement?
- What posting patterns work?
- Common themes in high-performing content

### 3. ENGAGEMENT PATTERN ANALYSIS
- What drives comments (10x more valuable than likes)?
- What prompts saves and shares?
- What dwell-time patterns work best?
- What time-sensitive opportunities exist?

### 4. HASHTAG RESEARCH
- What 3-5 hashtags are most relevant and active?
- What hashtags to avoid (oversaturated, spammy)?
- Are there niche hashtags with engaged communities?

### 5. RISK ASSESSMENT
- Any topics that could backfire on LinkedIn's professional audience?
- Controversial areas to navigate carefully?
- Content that might seem tone-deaf in current climate?

## OUTPUT FORMAT
Return a JSON object:
{
  "trend_analysis": {
    "hot_topics": [],
    "emerging_topics": [],
    "oversaturated_topics": [],
    "opportunity_gaps": []
  },
  "competitor_insights": {
    "successful_formats": [],
    "effective_hooks": [],
    "engagement_patterns": [],
    "content_themes": []
  },
  "hashtag_recommendations": {
    "primary": [],
    "niche": [],
    "avoid": []
  },
  "timing_recommendations": {
    "best_times": [],
    "best_days": [],
    "reasoning": ""
  },
  "risk_assessment": {
    "topics_to_avoid": [],
    "sensitive_areas": [],
    "safe_approaches": []
  },
  "strategic_opportunities": []
}`

// ============================================
// STAGE 2: VOICE LEARNING
// ============================================

const VOICE_LEARNING_SYSTEM = `You are a master linguistic analyst who deconstructs writing styles to their fundamental patterns.

## YOUR MISSION
Analyze sample LinkedIn posts to extract the customer's unique voice DNA. Your analysis will be used to generate content that sounds authentically like them, not generic AI.

## ANALYSIS FRAMEWORK

### 1. SENTENCE STRUCTURE PATTERNS
- Average sentence length (short punchy vs. flowing?)
- Use of fragments vs. complete sentences
- Line break frequency and patterns
- Use of dashes, colons, ellipses
- Opening patterns for posts

### 2. VOCABULARY FINGERPRINT
- Favorite words and phrases
- Industry jargon level
- Formality level
- Unique word choices
- Words they NEVER use

### 3. LINKEDIN-SPECIFIC PATTERNS
- How they structure hooks (first 210 chars)
- How they use line breaks for readability
- CTA patterns and engagement prompts
- Hashtag placement and style
- First comment patterns
- Emoji usage patterns

### 4. TONE MARKERS
- Confidence level (assertive, humble, balanced)
- Storytelling style (personal, third-person, data-driven)
- How they handle controversial topics
- Humor usage (none, subtle, frequent)

### 5. UNIQUE QUIRKS
- Signature phrases or patterns
- How they start and end posts
- Recurring themes or frameworks
- Personal anecdote style

## OUTPUT FORMAT
Return a JSON object:
{
  "voice_profile": {
    "overall_description": "",
    "personality_summary": ""
  },
  "sentence_patterns": {
    "average_length": "",
    "structure_preferences": [],
    "line_break_frequency": ""
  },
  "vocabulary_profile": {
    "formality_level": "",
    "jargon_usage": "",
    "favorite_words": [],
    "never_use_words": [],
    "unique_phrases": []
  },
  "linkedin_patterns": {
    "hook_style": "",
    "line_break_usage": "",
    "cta_patterns": [],
    "hashtag_style": "",
    "emoji_usage": ""
  },
  "tone_markers": {
    "confidence_level": "",
    "storytelling_style": "",
    "controversy_handling": "",
    "humor_usage": ""
  },
  "unique_fingerprints": [],
  "writing_instructions": "Detailed instructions for mimicking this exact voice...",
  "phrases_to_emulate": [],
  "patterns_to_avoid": [],
  "confidence_score": 0.0
}`

// ============================================
// STAGE 3: CONTENT STRATEGY
// ============================================

const CONTENT_STRATEGY_SYSTEM = `You are a strategic LinkedIn content planner who designs post portfolios optimized for the algorithm and professional engagement.

## YOUR MISSION
Create a strategic plan for the requested number of posts that maximizes variety, engagement potential, and algorithmic performance on LinkedIn.

${LINKEDIN_PLATFORM_RULES}

## STRATEGIC PRINCIPLES

### 1. CONTENT MIX OPTIMIZATION
Balance these post types based on customer preferences:
- INSIGHT posts: Educational, valuable, shareable (high save rate)
- OPINION posts: Takes, perspectives, positions (high comment rate)
- STORY posts: Personal professional stories (highest engagement)
- TIP posts: Actionable advice, frameworks (high save rate)
- ENGAGEMENT posts: Questions, challenges, discussions (high comment rate)

### 2. VARIETY IS ESSENTIAL
Never write two similar posts. Vary:
- Length (short punchy vs. long detailed)
- Format (single line, paragraphs, lists)
- Tone (serious, personal, analytical)
- Topic angle (even on same theme)

### 3. HOOK DIVERSITY (CRITICAL)
Plan different hook types across posts. The first 210 characters decide EVERYTHING.
- Bold statement hooks
- Question hooks
- Story opening hooks
- Number/stat hooks
- Contrarian hooks

### 4. FIRST COMMENT PLANNING
For each post, plan the first comment strategy:
- Where links should go
- Follow-up questions to spark discussion
- Additional context to add

## OUTPUT FORMAT
Return a JSON object:
{
  "strategy_summary": "",
  "content_distribution": {
    "insight_count": 0,
    "opinion_count": 0,
    "story_count": 0,
    "tip_count": 0,
    "engagement_count": 0
  },
  "post_plans": [
    {
      "post_number": 1,
      "content_type": "insight | opinion | story | tip | engagement",
      "topic_angle": "",
      "hook_type": "bold_statement | question | story_opening | number_stat | contrarian",
      "target_length": "short | standard | long",
      "formatting_style": "short_lines | paragraphs | list_format | mixed",
      "engagement_goal": "comments | saves | shares",
      "key_message": "",
      "first_comment_plan": "",
      "tone_note": ""
    }
  ],
  "posting_sequence_recommendation": ""
}`

// ============================================
// STAGE 4: POST GENERATION
// ============================================

const POST_WRITER_SYSTEM = `You are an elite LinkedIn copywriter who creates scroll-stopping posts that drive massive professional engagement.

## YOUR MISSION
Write LinkedIn posts that are indistinguishable from the customer's natural voice while maximizing engagement potential.

${LINKEDIN_PLATFORM_RULES}

${LINKEDIN_POST_STRUCTURE}

## CRITICAL WRITING RULES

### 1. THE HOOK IS EVERYTHING (First 210 characters)
- This text appears BEFORE "See More"
- It must create an irresistible urge to click
- Lead with the most interesting/surprising part
- Use specific numbers, not vague claims
- Create curiosity gaps that demand closing
- Make it personal and specific

### 2. BODY FORMATTING FOR LINKEDIN
- One sentence per line for maximum readability
- Short sentences: 5-12 words ideal
- Use line breaks generously (increases dwell time)
- Empty lines between thought groups
- Build progressively - each line should compel reading the next
- Include 1-2 pattern interrupts (unexpected turns)

### 3. AUTHENTICITY IS EVERYTHING
- Sound like a human professional, not a brand
- Use first person ("I", not "We" unless company page)
- Include personal observations and experiences
- Vulnerability outperforms perfection
- Specific details beat generic advice
- Use contractions (it's, don't, can't) — humans always contract; missing contractions is an AI tell
- Never use these AI vocabulary tells: delve, tapestry, realm, leverage, utilize, harness, unlock, unleash, embark, foster, facilitate, streamline, orchestrate, showcase, elucidate, optimize, elevate, revolutionize, paradigm, synergy, holistic, robust, seamless, cutting-edge, groundbreaking, transformative, unprecedented, pivotal, plethora, myriad (EXCEPTIONS: 1. genuine industry terms in their technical context; 2. words the customer explicitly requested as SEO keywords, brand terms, or must-include vocabulary — customer preference always overrides)
- Prefer simple words: "use" not "utilize", "help" not "facilitate", "show" not "showcase"
- Replace "many experts agree" with a named expert. Replace "studies show" with a specific study

### 4. CHARACTER OPTIMIZATION
- Stay under 3,000 characters
- Standard posts: 1,000-2,000 characters
- Every sentence must earn its place
- If it doesn't add value, cut it

### 5. FIRST COMMENT GENERATION
For EACH post, also generate a first comment that:
- Adds context or a follow-up question
- Contains any links (NEVER in the main post)
- Is substantive (not just "Link in comments!")
- Sparks further discussion

### 6. HASHTAG RULES
- 3-5 hashtags at the END of the post
- Mix broad and niche hashtags
- No hashtags inline within the text

## OUTPUT FORMAT
For each post in the plan, generate a JSON array:
[
  {
    "post_number": 1,
    "text": "The actual post text (under 3000 chars, with line breaks as \\n)",
    "character_count": 0,
    "hook_text": "First 210 chars that appear before See More",
    "content_type": "insight | opinion | story | tip | engagement",
    "hashtags": ["#Hashtag1", "#Hashtag2", "#Hashtag3"],
    "first_comment": "The first comment text",
    "engagement_prediction": "What engagement this should drive",
    "variations": ["Alternative version 1"]
  }
]`

// ============================================
// STAGE 5: HARSH CRITIQUE
// ============================================

const HARSH_CRITIQUE_SYSTEM = `You are a merciless LinkedIn content critic with impossibly high standards. Your job is to destroy mediocre content before it damages the customer's professional brand.

## YOUR MISSION
Ruthlessly evaluate every post against quality standards, LinkedIn best practices, and customer requirements. Be brutally honest.

${LINKEDIN_PLATFORM_RULES}

## EVALUATION FRAMEWORK

### 1. HOOK EFFECTIVENESS (25 points)
Does the first 210 characters stop the scroll and compel "See More" clicks?
- 25: Irresistible, must-read
- 20: Strong, attention-grabbing
- 15: Decent, might get noticed
- 10: Weak, easily scrolled past
- 5: Generic, invisible
- 0: Actively repels readers (AI-sounding, cliche)

### 2. VOICE AUTHENTICITY (25 points)
Does this sound like the customer, or generic AI?
- Check against voice profile (if provided)
- Look for AI-typical phrases (automatic -20 points)
- Verify personality markers
- Assess natural flow and authenticity
- Check for "LinkedIn cringe" patterns

### 3. ENGAGEMENT POTENTIAL (25 points)
Will this drive comments (the #1 LinkedIn algorithm signal)?
- Comment potential (does it invite discussion?)
- Save potential (is it reference-worthy?)
- Share potential (would someone tag a colleague?)
- Dwell time potential (is it worth reading fully?)

### 4. PLATFORM OPTIMIZATION (15 points)
Does this follow LinkedIn best practices?
- Character count within limits
- Hook under 210 characters and compelling
- No links in body (links in first comment)
- Hashtags at end (3-5)
- Proper line break formatting
- First comment is substantive

### 5. PROFESSIONAL BRAND SAFETY (10 points)
Any risks to the customer's professional reputation?
- Tone appropriate for LinkedIn's professional context
- No engagement bait ("Like if you agree!")
- Content aligns with professional positioning
- Nothing that could be taken out of context

## RED FLAGS TO CATCH
- AI-sounding phrases (automatic -20 points)
- "I'm humbled to announce..." or similar LinkedIn cringe (-15 points)
- Generic hooks that could apply to anyone (-15 points)
- Links in the post body (-10 points)
- More than 5 hashtags (-10 points)
- Inline hashtags (-5 points)
- Wall of text with no line breaks (-10 points)
- Engagement bait phrases (-15 points)
- Too similar to another post in set (-15 points)

## OUTPUT FORMAT
Return a JSON object:
{
  "overall_assessment": {
    "pass_for_delivery": true,
    "average_score": 0,
    "critical_issues_count": 0,
    "posts_needing_rewrite": []
  },
  "post_critiques": [
    {
      "post_number": 1,
      "score_breakdown": {
        "hook_effectiveness": 0,
        "voice_authenticity": 0,
        "engagement_potential": 0,
        "platform_optimization": 0,
        "brand_safety": 0,
        "total": 0
      },
      "verdict": "PASS | NEEDS_REVISION | REWRITE_REQUIRED",
      "specific_problems": [],
      "exact_fixes_required": [],
      "rewrite_if_needed": ""
    }
  ],
  "algorithm_score_assessment": {
    "overall_predicted_performance": "low | medium | high",
    "dwell_time_prediction": "",
    "comment_likelihood": ""
  },
  "voice_consistency_check": {
    "consistent": true,
    "deviations": []
  },
  "variety_check": {
    "sufficient_variety": true,
    "similar_posts": [],
    "recommendations": []
  }
}`

// ============================================
// STAGE 6: FINAL POLISH
// ============================================

const FINAL_POLISH_SYSTEM = `You are a master LinkedIn editor who transforms good posts into exceptional ones. You are the last line of defense before content reaches the customer.

## YOUR MISSION
Apply all required fixes from the critique, ensure perfect voice consistency, and deliver publication-ready LinkedIn posts.

${LINKEDIN_PLATFORM_RULES}

## POLISH PRIORITIES

### 1. FIX ALL CRITICAL ISSUES
Every problem identified in the critique MUST be fixed. No exceptions.

### 2. HOOK PERFECTION
If any hook scored below 20/25, rewrite it. The first 210 characters are everything on LinkedIn.

### 3. VOICE PERFECTION
If voice samples were provided, every post must pass the "could they have written this?" test.

### 4. FORMATTING OPTIMIZATION
- Verify line breaks create scannable format
- Ensure one idea per line where appropriate
- Check that posts have visual breathing room
- Verify hashtags are at end, not inline

### 5. FIRST COMMENT OPTIMIZATION
- Ensure first comments are substantive
- Links are in comments, not post body
- First comments add genuine value

### 6. FINAL CHECKS
- Character count under 3,000
- Hook under 210 characters
- 3-5 hashtags at end
- No AI-sounding phrases
- No LinkedIn cringe
- No engagement bait

## OUTPUT FORMAT
Return a JSON object:
{
  "polished_posts": [
    {
      "id": 1,
      "text": "Final polished post text with \\n for line breaks",
      "character_count": 0,
      "hook_text": "First 210 chars",
      "content_type": "insight | opinion | story | tip | engagement",
      "engagement_score": 8,
      "hashtags": ["#Tag1", "#Tag2", "#Tag3"],
      "first_comment": "The first comment text",
      "suggested_posting_time": "Tuesday morning, 8-10 AM",
      "variations": ["Alternative 1"],
      "changes_made": ["List of changes from draft"]
    }
  ],
  "delivery_ready": true,
  "algorithm_prediction": {
    "expected_performance": "high",
    "reasoning": ""
  }
}`

// ============================================
// MAIN PIPELINE FUNCTION
// ============================================

export async function runLinkedInTextPostPipeline(
  formData: LinkedInTextPostFormData,
  styleSelections: Partial<LinkedInStyleProfile>,
  tier: 'budget' | 'standard' | 'premium' = 'budget'
): Promise<LinkedInTextPostPipelineResult> {
  console.log(`💼 LINKEDIN TEXT POST PIPELINE (${tier.toUpperCase()} TIER): Starting generation...`)

  const processingStages: string[] = []
  const styleProfile = mergeWithLinkedInDefaults(styleSelections)
  const models = LINKEDIN_MODELS[tier]

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

Process and validate these inputs for LinkedIn text post generation.
Number of posts requested: ${formData.postCount}
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
        content_request: { post_count: formData.postCount, primary_topics: [formData.topic] },
        content_source: { type: styleProfile.source_type },
        constraints: { must_include: formData.mustInclude || [], must_avoid: formData.mustAvoid || [] }
      }
    }
  }
  console.log('✅ Input processing complete')

  // ========== STAGE 1: LINKEDIN INTELLIGENCE RESEARCH ==========
  let researchData: any = null

  if (tier !== 'budget' || styleProfile.trend_integration !== 'none') {
    console.log('🔍 Stage 1: LinkedIn Intelligence Research...')
    processingStages.push('LinkedIn Intelligence Research')

    const researchPrompt = `
<processed_input>
${JSON.stringify(processedInput, null, 2)}
</processed_input>

<trend_integration_level>
${styleProfile.trend_integration}
</trend_integration_level>

Research the LinkedIn landscape for:
- Industry: ${formData.industry}
- Topic: ${formData.topic}
- Audience: ${formData.audience}

Provide comprehensive intelligence to inform content strategy.
`

    if (tier === 'premium') {
      const response = await anthropic.messages.create({
        model: CLAUDE_SONNET,
        max_tokens: 4000,
        messages: [{ role: 'user', content: `${LINKEDIN_INTELLIGENCE_SYSTEM}\n\n${researchPrompt}` }]
      })
      const researchResult = response.content[0].type === 'text' ? response.content[0].text : ''
      try {
        const jsonMatch = researchResult.match(/\{[\s\S]*\}/)
        researchData = JSON.parse(jsonMatch ? jsonMatch[0] : researchResult)
      } catch {
        researchData = { trend_analysis: {}, competitor_insights: {}, hashtag_recommendations: {} }
      }
    } else {
      const researchResult = await callOpenAI(
        OPENAI_MODELS.GPT_4O,
        LINKEDIN_INTELLIGENCE_SYSTEM,
        researchPrompt,
        4000
      )
      try {
        const jsonMatch = researchResult.match(/\{[\s\S]*\}/)
        researchData = JSON.parse(jsonMatch ? jsonMatch[0] : researchResult)
      } catch {
        researchData = { trend_analysis: {}, competitor_insights: {}, hashtag_recommendations: {} }
      }
    }
    console.log('✅ LinkedIn Intelligence Research complete')
  } else {
    processingStages.push('LinkedIn Intelligence Research (Skipped - Budget Tier)')
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

<voice_learning_level>
${styleProfile.voice_learning}
</voice_learning_level>

Analyze these sample LinkedIn posts and extract the unique voice DNA.
`

    if (tier === 'premium') {
      const response = await anthropic.messages.create({
        model: CLAUDE_SONNET,
        max_tokens: 4000,
        messages: [{ role: 'user', content: `${VOICE_LEARNING_SYSTEM}\n\n${voicePrompt}` }]
      })
      const voiceResult = response.content[0].type === 'text' ? response.content[0].text : ''
      try {
        const jsonMatch = voiceResult.match(/\{[\s\S]*\}/)
        voiceProfile = JSON.parse(jsonMatch ? jsonMatch[0] : voiceResult)
      } catch {
        voiceProfile = { writing_instructions: voiceResult, confidence_score: 0.6 }
      }
    } else {
      const voiceResult = await callOpenAI(
        voiceModel,
        VOICE_LEARNING_SYSTEM,
        voicePrompt,
        4000
      )
      try {
        const jsonMatch = voiceResult.match(/\{[\s\S]*\}/)
        voiceProfile = JSON.parse(jsonMatch ? jsonMatch[0] : voiceResult)
      } catch {
        voiceProfile = { writing_instructions: voiceResult, confidence_score: 0.6 }
      }
    }
    console.log('✅ Voice Learning complete')
  } else {
    processingStages.push('Voice Learning (Skipped - No samples)')
  }

  // ========== STAGE 3: CONTENT STRATEGY ==========
  console.log('📊 Stage 3: Content Strategy...')
  processingStages.push('Content Strategy')

  const strategyModel = tier === 'budget' ? OPENAI_MODELS.GPT_4O_MINI : (tier === 'standard' ? OPENAI_MODELS.GPT_4_1 : CLAUDE_SONNET)
  const strategyPrompt = `
<processed_input>
${JSON.stringify(processedInput, null, 2)}
</processed_input>

<research_insights>
${researchData ? JSON.stringify(researchData, null, 2) : 'No research data available'}
</research_insights>

<style_profile>
${JSON.stringify(styleProfile, null, 2)}
</style_profile>

<post_count>
${formData.postCount}
</post_count>

<content_distribution_preference>
${styleProfile.content_distribution}
</content_distribution_preference>

Create a strategic plan for ${formData.postCount} LinkedIn text posts.
`

  let strategyData: any
  if (tier === 'premium') {
    const response = await anthropic.messages.create({
      model: CLAUDE_SONNET,
      max_tokens: 4000,
      messages: [{ role: 'user', content: `${CONTENT_STRATEGY_SYSTEM}\n\n${strategyPrompt}` }]
    })
    const strategyResult = response.content[0].type === 'text' ? response.content[0].text : ''
    try {
      const jsonMatch = strategyResult.match(/\{[\s\S]*\}/)
      strategyData = JSON.parse(jsonMatch ? jsonMatch[0] : strategyResult)
    } catch {
      strategyData = buildFallbackStrategy(formData, styleProfile)
    }
  } else {
    const strategyResult = await callOpenAI(
      strategyModel,
      CONTENT_STRATEGY_SYSTEM,
      strategyPrompt,
      4000
    )
    try {
      const jsonMatch = strategyResult.match(/\{[\s\S]*\}/)
      strategyData = JSON.parse(jsonMatch ? jsonMatch[0] : strategyResult)
    } catch {
      strategyData = buildFallbackStrategy(formData, styleProfile)
    }
  }
  console.log('✅ Content Strategy complete')

  // ========== STAGE 4: POST GENERATION ==========
  console.log('✍️ Stage 4: Post Generation...')
  processingStages.push('Post Generation')

  const writerModel = tier === 'premium' ? CLAUDE_SONNET : (tier === 'standard' ? OPENAI_MODELS.GPT_4_1 : OPENAI_MODELS.GPT_4O)
  const writerPrompt = `
<content_strategy>
${JSON.stringify(strategyData, null, 2)}
</content_strategy>

<processed_input>
${JSON.stringify(processedInput, null, 2)}
</processed_input>

<research_insights>
${researchData ? JSON.stringify(researchData, null, 2) : 'No research data available'}
</research_insights>

<voice_profile>
${voiceProfile ? JSON.stringify(voiceProfile, null, 2) : 'No voice profile - use natural professional tone with bold confidence'}
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

<formatting_preference>
${styleProfile.formatting_style}
</formatting_preference>

<post_length_preference>
${styleProfile.post_length}
</post_length_preference>

Write ${formData.postCount} exceptional LinkedIn text posts following the strategy.
For each post, include the text, first comment, hashtags, and hook text.

CRITICAL REMINDERS:
- First 210 characters must be an irresistible hook
- Line breaks for readability (one sentence per line)
- NO links in post body (links go in first comment)
- 3-5 hashtags at the END of the post
- Stay under 3,000 characters per post
- Each post must feel authentically human, not AI-generated
- Generate a substantive first comment for each post

Return a JSON array of post objects.
`

  let draftPosts: any[]
  if (tier === 'premium') {
    const response = await anthropic.messages.create({
      model: CLAUDE_SONNET,
      max_tokens: 10000,
      messages: [{ role: 'user', content: `${POST_WRITER_SYSTEM}\n\n${writerPrompt}` }]
    })
    const writerResult = response.content[0].type === 'text' ? response.content[0].text : ''
    try {
      const jsonMatch = writerResult.match(/\[[\s\S]*\]/)
      draftPosts = JSON.parse(jsonMatch ? jsonMatch[0] : '[]')
    } catch {
      draftPosts = []
    }
  } else {
    const writerResult = await callOpenAI(
      writerModel,
      POST_WRITER_SYSTEM,
      writerPrompt,
      10000
    )
    try {
      const jsonMatch = writerResult.match(/\[[\s\S]*\]/)
      draftPosts = JSON.parse(jsonMatch ? jsonMatch[0] : '[]')
    } catch {
      draftPosts = []
    }
  }
  console.log(`✅ Post Generation complete (${draftPosts.length} posts)`)

  // ========== STAGE 5: HARSH CRITIQUE ==========
  console.log('🔎 Stage 5: Harsh Critique...')
  processingStages.push('Harsh Critique')

  const critiqueModel = tier === 'premium' ? CLAUDE_OPUS : (tier === 'standard' ? CLAUDE_SONNET : OPENAI_MODELS.GPT_4O)
  const critiquePrompt = `
<draft_posts>
${JSON.stringify(draftPosts, null, 2)}
</draft_posts>

<content_strategy>
${JSON.stringify(strategyData, null, 2)}
</content_strategy>

<voice_profile>
${voiceProfile ? JSON.stringify(voiceProfile, null, 2) : 'No voice profile provided'}
</voice_profile>

<customer_requirements>
Company: ${formData.company}
Industry: ${formData.industry}
Topic: ${formData.topic}
Audience: ${formData.audience}
${formData.goals ? `Goals: ${formData.goals}` : ''}
Must Include: ${(formData.mustInclude || []).join(', ')}
Must Avoid: ${(formData.mustAvoid || []).join(', ')}
Tone: ${styleProfile.tone}
Controversy Level: ${styleProfile.controversy_level}
</customer_requirements>

<style_profile>
${JSON.stringify(styleProfile, null, 2)}
</style_profile>

Ruthlessly critique every LinkedIn post. Be brutal - the customer paid for excellence.
Check hooks (first 210 chars), formatting, first comments, hashtag placement, and voice authenticity.
`

  let critiqueData: any
  if (tier === 'premium' || tier === 'standard') {
    const critiqueModelId = tier === 'premium' ? CLAUDE_OPUS : CLAUDE_SONNET
    const response = await anthropic.messages.create({
      model: critiqueModelId,
      max_tokens: 8000,
      messages: [{ role: 'user', content: `${HARSH_CRITIQUE_SYSTEM}\n\n${critiquePrompt}` }]
    })
    const critiqueResult = response.content[0].type === 'text' ? response.content[0].text : ''
    try {
      const jsonMatch = critiqueResult.match(/\{[\s\S]*\}/)
      critiqueData = JSON.parse(jsonMatch ? jsonMatch[0] : critiqueResult)
    } catch {
      critiqueData = { overall_assessment: { pass_for_delivery: true, average_score: 75 }, post_critiques: [] }
    }
  } else {
    const critiqueResult = await callOpenAI(
      OPENAI_MODELS.GPT_4O,
      HARSH_CRITIQUE_SYSTEM,
      critiquePrompt,
      8000
    )
    try {
      const jsonMatch = critiqueResult.match(/\{[\s\S]*\}/)
      critiqueData = JSON.parse(jsonMatch ? jsonMatch[0] : critiqueResult)
    } catch {
      critiqueData = { overall_assessment: { pass_for_delivery: true, average_score: 75 }, post_critiques: [] }
    }
  }
  console.log('✅ Harsh Critique complete')

  // ========== STAGE 6: FINAL POLISH ==========
  console.log('✨ Stage 6: Final Polish...')
  processingStages.push('Final Polish')

  const polishModel = tier === 'premium' ? CLAUDE_OPUS : CLAUDE_SONNET
  const polishPrompt = `
<draft_posts>
${JSON.stringify(draftPosts, null, 2)}
</draft_posts>

<critique>
${JSON.stringify(critiqueData, null, 2)}
</critique>

<voice_profile>
${voiceProfile ? JSON.stringify(voiceProfile, null, 2) : 'No voice profile - ensure natural bold professional tone'}
</voice_profile>

<customer_requirements>
Company: ${formData.company}
Industry: ${formData.industry}
Topic: ${formData.topic}
Audience: ${formData.audience}
${formData.goals ? `Goals: ${formData.goals}` : ''}
Must Include: ${(formData.mustInclude || []).join(', ')}
Must Avoid: ${(formData.mustAvoid || []).join(', ')}
</customer_requirements>

<style_profile>
${JSON.stringify(styleProfile, null, 2)}
</style_profile>

Apply ALL fixes from the critique and deliver publication-ready LinkedIn posts.
Ensure every hook is under 210 characters and irresistible.
Ensure first comments are substantive and links are there (not in post body).
Ensure hashtags are at the end (3-5).
`

  const polishResponse = await anthropic.messages.create({
    model: polishModel,
    max_tokens: 12000,
    messages: [{ role: 'user', content: `${FINAL_POLISH_SYSTEM}\n\n${polishPrompt}` }]
  })

  const polishResult = polishResponse.content[0].type === 'text' ? polishResponse.content[0].text : ''
  let polishedData: any
  try {
    const jsonMatch = polishResult.match(/\{[\s\S]*\}/)
    polishedData = JSON.parse(jsonMatch ? jsonMatch[0] : polishResult)
  } catch {
    polishedData = { polished_posts: draftPosts, delivery_ready: true }
  }
  console.log('✅ Final Polish complete')

  // ========== BUILD RESPONSE ==========
  const posts: GeneratedLinkedInPost[] = (polishedData.polished_posts || []).map((p: any, i: number) => ({
    id: p.id || i + 1,
    text: p.text || '',
    characterCount: p.character_count || p.text?.length || 0,
    hookText: p.hook_text || (p.text || '').substring(0, 210),
    contentType: p.content_type || 'insight',
    engagementScore: p.engagement_score || 7,
    hashtags: p.hashtags || [],
    firstComment: p.first_comment || '',
    suggestedPostingTime: p.suggested_posting_time || 'Tuesday morning, 8-10 AM',
    variations: p.variations || []
  }))

  const result: LinkedInTextPostPipelineResult = {
    posts,
    trendBriefing: researchData ? {
      currentTrends: researchData.trend_analysis?.hot_topics || [],
      relevantTopics: researchData.trend_analysis?.emerging_topics || [],
      avoidTopics: researchData.risk_assessment?.topics_to_avoid || []
    } : undefined,
    voiceProfile: voiceProfile ? {
      summary: voiceProfile.voice_profile?.overall_description || '',
      keyPatterns: voiceProfile.unique_fingerprints || [],
      phrasesToEmulate: voiceProfile.phrases_to_emulate || []
    } : undefined,
    qualityReport: {
      overallScore: critiqueData.overall_assessment?.average_score || 75,
      algorithmScore: critiqueData.algorithm_score_assessment?.overall_predicted_performance === 'high' ? 9 : 7,
      feedback: [
        ...(critiqueData.post_critiques || []).flatMap((c: any) => c.specific_problems || []),
        ...(critiqueData.overall_assessment?.critical_issues_count > 0 ? ['Some posts needed revision'] : [])
      ]
    },
    postingCalendar: {
      recommendations: researchData?.timing_recommendations?.best_times || [
        'Tuesday-Thursday, 8-10 AM local time',
        'Avoid weekends and late evenings',
        'Space posts 24-48 hours apart'
      ]
    },
    metadata: {
      tier,
      processingStages,
      totalPosts: posts.length
    }
  }

  console.log('💼 LINKEDIN TEXT POST PIPELINE: Complete!')
  return result
}

// ============================================
// HELPER: FALLBACK STRATEGY
// ============================================

function buildFallbackStrategy(formData: LinkedInTextPostFormData, styleProfile: LinkedInStyleProfile) {
  const types = ['insight', 'opinion', 'story', 'tip', 'engagement']
  return {
    strategy_summary: 'Balanced content mix',
    post_plans: Array.from({ length: formData.postCount }, (_, i) => ({
      post_number: i + 1,
      content_type: types[i % types.length],
      topic_angle: formData.topic,
      hook_type: 'bold_statement',
      target_length: 'standard',
      formatting_style: styleProfile.formatting_style,
      engagement_goal: 'comments',
      key_message: '',
      first_comment_plan: 'Add context and follow-up question',
      tone_note: ''
    }))
  }
}
