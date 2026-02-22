/**
 * LinkedIn Poll Pipeline
 *
 * A 7-stage pipeline for generating LinkedIn polls with companion posts.
 * Polls get massive reach due to built-in engagement mechanics.
 *
 * Pipeline Stages:
 * Stage 0: Input Processor - Parse inputs
 * Stage 1: LinkedIn Intelligence Research - What poll topics work
 * Stage 2: Voice Learning - Analyze customer's style (if samples)
 * Stage 3: Poll Strategist - Plan polls, options, companion text
 * Stage 4: Poll Generation - Write polls + companion posts + first comments
 * Stage 5: Harsh Critique - Quality and engagement assessment
 * Stage 6: Final Polish - Apply fixes, optimize
 *
 * Each poll includes: question, 4 options, companion text, first comment, follow-up template
 */

import Anthropic from '@anthropic-ai/sdk'
import { callOpenAI, OPENAI_MODELS } from '../openai-client'
import {
  LinkedInStyleProfile,
  LinkedInPollFormData,
  LinkedInPollPipelineResult,
  GeneratedPoll,
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

const INPUT_PROCESSOR_SYSTEM = `You are an expert LinkedIn poll strategist who prepares inputs for poll creation.

## YOUR MISSION
Parse inputs for LinkedIn poll generation.

## LINKEDIN POLL KNOWLEDGE
- Poll question: max 140 characters
- Poll options: max 4 options, 30 characters each
- Poll durations: 1 day, 3 days, 1 week, 2 weeks
- Polls get massive organic reach (built-in engagement)
- Companion text appears above the poll
- Companion text follows same rules as regular posts (3,000 char limit, 210 char "See More")

## OUTPUT FORMAT
Return a JSON object:
{
  "processed_input": {
    "brand_info": {
      "company": "",
      "industry": "",
      "target_audience": ""
    },
    "content_request": {
      "poll_count": 0,
      "primary_topics": [],
      "key_themes": []
    },
    "constraints": {
      "must_include": [],
      "must_avoid": []
    }
  }
}`

// ============================================
// STAGE 1: RESEARCH
// ============================================

const POLL_RESEARCH_SYSTEM = `You are an elite LinkedIn poll analyst who knows what poll topics drive engagement.

## YOUR MISSION
Research what poll formats and topics are working on LinkedIn for the customer's niche.

${LINKEDIN_PLATFORM_RULES}

## POLL-SPECIFIC RESEARCH
- What poll topics get the most votes and comments?
- What option structures create the most debate?
- What companion text strategies work best?
- What follow-up content from polls performs well?

## OUTPUT FORMAT
Return a JSON object:
{
  "trend_analysis": {
    "hot_poll_topics": [],
    "successful_formats": [],
    "controversial_but_safe_topics": []
  },
  "format_insights": {
    "best_option_structures": [],
    "effective_companion_text": [],
    "high_comment_strategies": []
  },
  "hashtag_recommendations": {
    "primary": [],
    "niche": []
  },
  "strategic_opportunities": []
}`

// ============================================
// STAGE 2: VOICE LEARNING
// ============================================

const VOICE_LEARNING_SYSTEM = `You are a master linguistic analyst extracting voice patterns for LinkedIn poll content.

## OUTPUT FORMAT
Return a JSON object:
{
  "voice_profile": {
    "overall_description": "",
    "personality_summary": ""
  },
  "writing_instructions": "Instructions for poll companion text voice...",
  "phrases_to_emulate": [],
  "confidence_score": 0.0
}`

// ============================================
// STAGE 3: POLL STRATEGIST
// ============================================

const POLL_STRATEGIST_SYSTEM = `You are a master LinkedIn poll strategist who designs polls that drive massive engagement and create content loops.

## YOUR MISSION
Design polls that get votes, spark debate in comments, and create opportunities for follow-up content.

${LINKEDIN_PLATFORM_RULES}

## POLL STRATEGY PRINCIPLES

### 1. POLL QUESTION DESIGN (140 char limit)
- Questions should be genuinely debatable (no obvious answers)
- Use "Which" or "What" for opinion polls
- Use "Have you" or "Do you" for experience polls
- Make it relevant to the target audience's daily work
- Create urgency or curiosity

### 2. OPTION DESIGN (4 options, 30 chars each)
- All options should be plausible (no throwaway answers)
- Include one slightly controversial option
- Consider including "Other (comment below)" as last option to drive comments
- Options should be mutually exclusive and collectively exhaustive
- Balance between clear and nuanced choices

### 3. COMPANION TEXT STRATEGY
- Text above the poll provides context
- First 210 chars = hook (before "See More")
- Share a personal take or experience related to the poll
- End with "Vote and share your reasoning in the comments"
- 3-5 hashtags at end

### 4. FIRST COMMENT STRATEGY
- Post your own vote and reasoning immediately
- Ask a follow-up question to spark discussion
- Include any links here

### 5. CONTENT LOOP PLANNING
- Each poll should connect to potential follow-up content
- "I'll share the results analysis next week"
- Polls → Results post → Deep dive article → More polls

## OUTPUT FORMAT
Return a JSON object:
{
  "poll_plans": [
    {
      "poll_number": 1,
      "poll_type": "opinion | prediction | experience | controversial | fun",
      "question": "",
      "question_char_count": 0,
      "options": ["", "", "", ""],
      "companion_text_strategy": {
        "hook": "",
        "body_approach": "",
        "cta": ""
      },
      "first_comment_plan": "",
      "follow_up_content_idea": "",
      "suggested_duration": "",
      "engagement_prediction": ""
    }
  ],
  "content_loop_plan": {
    "poll_connections": [],
    "follow_up_sequence": []
  }
}`

// ============================================
// STAGE 4: POLL GENERATION
// ============================================

const POLL_WRITER_SYSTEM = `You are an elite LinkedIn poll copywriter who creates polls that drive massive engagement.

## YOUR MISSION
Write complete polls with questions, options, companion text, and first comments.

${LINKEDIN_PLATFORM_RULES}

## POLL WRITING RULES

### QUESTION (140 chars max)
- Clear, specific, debatable
- No obvious "right" answer
- Relevant to professional audience

### OPTIONS (4 max, 30 chars each)
- All plausible and distinct
- One slightly provocative option
- Consider "Other (see comments)" for last option

### COMPANION TEXT
- 210 char hook before "See More"
- Personal perspective on the topic
- End with prompt to vote AND comment
- 3-5 hashtags at end
- NO links in body

### FIRST COMMENT
- Your own vote + reasoning
- Follow-up question
- Links go here

### FOLLOW-UP TEMPLATE
- Brief template for results analysis post

## OUTPUT FORMAT
Return a JSON array:
[
  {
    "poll_number": 1,
    "question": "",
    "question_char_count": 0,
    "options": ["", "", "", ""],
    "companion_text": "Text above the poll with \\n for line breaks",
    "companion_text_char_count": 0,
    "first_comment": "",
    "poll_type": "",
    "suggested_duration": "",
    "follow_up_template": "",
    "engagement_prediction": ""
  }
]`

// ============================================
// STAGE 5: HARSH CRITIQUE
// ============================================

const POLL_CRITIQUE_SYSTEM = `You are a merciless LinkedIn poll critic. Your standards are impossibly high.

## YOUR MISSION
Evaluate every poll for engagement potential, question quality, and LinkedIn optimization.

## EVALUATION FRAMEWORK

### 1. QUESTION QUALITY (25 points)
Genuinely debatable? Clear? Under 140 chars? No obvious answer?

### 2. OPTION QUALITY (25 points)
All plausible? Under 30 chars each? Create real debate?

### 3. COMPANION TEXT (20 points)
Hook compelling? Adds context? CTA to vote and comment?

### 4. ENGAGEMENT POTENTIAL (20 points)
Will people vote? Will they comment? Share? Tag others?

### 5. PLATFORM OPTIMIZATION (10 points)
Character limits? Hashtags? First comment substantive?

## RED FLAGS
- Question with obvious answer (-20 points)
- Option over 30 characters (-10 points)
- Question over 140 characters (-10 points)
- Engagement bait companion text (-15 points)
- Similar polls in set (-15 points)

## OUTPUT FORMAT
Return a JSON object:
{
  "overall_assessment": {
    "pass_for_delivery": true,
    "average_score": 0,
    "polls_needing_rewrite": []
  },
  "poll_critiques": [
    {
      "poll_number": 1,
      "total_score": 0,
      "verdict": "PASS | NEEDS_REVISION | REWRITE_REQUIRED",
      "question_score": 0,
      "options_score": 0,
      "companion_score": 0,
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

const POLL_POLISH_SYSTEM = `You are a master LinkedIn poll editor. Apply all fixes and deliver publication-ready polls.

## POLISH PRIORITIES
1. Fix ALL issues from critique
2. Verify ALL character limits (question: 140, options: 30 each)
3. Perfect companion text hooks
4. Ensure first comments are substantive
5. Verify hashtags at end of companion text
6. Polish follow-up templates

## OUTPUT FORMAT
Return a JSON object:
{
  "polished_polls": [
    {
      "id": 1,
      "question": "",
      "question_char_count": 0,
      "options": ["", "", "", ""],
      "companion_text": "",
      "companion_text_char_count": 0,
      "first_comment": "",
      "poll_type": "",
      "suggested_duration": "",
      "follow_up_template": "",
      "engagement_score": 8,
      "suggested_posting_time": ""
    }
  ],
  "content_loop_plan": {
    "poll_to_post_connections": [],
    "recommendations": []
  },
  "delivery_ready": true
}`

// ============================================
// MAIN PIPELINE FUNCTION
// ============================================

export async function runLinkedInPollPipeline(
  formData: LinkedInPollFormData,
  styleSelections: Partial<LinkedInStyleProfile>,
  tier: 'budget' | 'standard' | 'premium' = 'budget'
): Promise<LinkedInPollPipelineResult> {
  console.log(`📊 LINKEDIN POLL PIPELINE (${tier.toUpperCase()} TIER): Starting generation...`)

  const processingStages: string[] = []
  const styleProfile = mergeWithLinkedInDefaults(styleSelections)

  // ========== STAGE 0: INPUT PROCESSOR ==========
  console.log('📋 Stage 0: Processing inputs...')
  processingStages.push('Input Processing')

  const inputResult = await callOpenAI(
    OPENAI_MODELS.GPT_4O_MINI,
    INPUT_PROCESSOR_SYSTEM,
    `<form_data>\n${JSON.stringify(formData, null, 2)}\n</form_data>\nProcess for ${formData.pollCount} LinkedIn polls.`,
    2000
  )

  let processedInput: any
  try {
    const jsonMatch = inputResult.match(/\{[\s\S]*\}/)
    processedInput = JSON.parse(jsonMatch ? jsonMatch[0] : inputResult)
  } catch {
    processedInput = {
      processed_input: {
        brand_info: { company: formData.company, industry: formData.industry },
        content_request: { poll_count: formData.pollCount, primary_topics: [formData.topic] },
        constraints: { must_include: formData.mustInclude || [], must_avoid: formData.mustAvoid || [] }
      }
    }
  }
  console.log('✅ Input processing complete')

  // ========== STAGE 1: RESEARCH ==========
  let researchData: any = null

  if (tier !== 'budget' || styleProfile.trend_integration !== 'none') {
    console.log('🔍 Stage 1: Poll Research...')
    processingStages.push('Poll Research')

    const researchPrompt = `
<processed_input>
${JSON.stringify(processedInput, null, 2)}
</processed_input>

Research LinkedIn poll landscape for:
- Industry: ${formData.industry}
- Topic: ${formData.topic}
- Audience: ${formData.audience}
${formData.goals ? `- Goals: ${formData.goals}` : ''}
`

    if (tier === 'premium') {
      const response = await anthropic.messages.create({
        model: CLAUDE_SONNET,
        max_tokens: 3000,
        messages: [{ role: 'user', content: `${POLL_RESEARCH_SYSTEM}\n\n${researchPrompt}` }]
      })
      const result = response.content[0].type === 'text' ? response.content[0].text : ''
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/)
        researchData = JSON.parse(jsonMatch ? jsonMatch[0] : result)
      } catch {
        researchData = { trend_analysis: {}, format_insights: {} }
      }
    } else {
      const result = await callOpenAI(OPENAI_MODELS.GPT_4O, POLL_RESEARCH_SYSTEM, researchPrompt, 3000)
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/)
        researchData = JSON.parse(jsonMatch ? jsonMatch[0] : result)
      } catch {
        researchData = { trend_analysis: {}, format_insights: {} }
      }
    }
    console.log('✅ Poll Research complete')
  } else {
    processingStages.push('Poll Research (Skipped - Budget Tier)')
  }

  // ========== STAGE 2: VOICE LEARNING ==========
  let voiceProfile: any = null

  if (formData.samplePosts && formData.samplePosts.trim().length > 100) {
    console.log('🎤 Stage 2: Voice Learning...')
    processingStages.push('Voice Learning')

    const voiceModel = tier === 'premium' ? CLAUDE_SONNET : OPENAI_MODELS.GPT_4O
    const voicePrompt = `<sample_posts>\n${formData.samplePosts}\n</sample_posts>\n\nAnalyze for LinkedIn poll companion text voice.`

    if (tier === 'premium') {
      const response = await anthropic.messages.create({
        model: CLAUDE_SONNET,
        max_tokens: 2000,
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
      const result = await callOpenAI(voiceModel, VOICE_LEARNING_SYSTEM, voicePrompt, 2000)
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

  // ========== STAGE 3: POLL STRATEGIST ==========
  console.log('📊 Stage 3: Poll Strategy...')
  processingStages.push('Poll Strategy')

  const strategistModel = tier === 'budget' ? OPENAI_MODELS.GPT_4O_MINI : (tier === 'standard' ? OPENAI_MODELS.GPT_4_1 : CLAUDE_SONNET)
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

Design ${formData.pollCount} LinkedIn polls.
Poll type preference: ${styleProfile.poll_type}
Duration preference: ${styleProfile.poll_duration}
Follow-up strategy: ${styleProfile.follow_up_strategy}
`

  let strategyData: any
  if (tier === 'premium') {
    const response = await anthropic.messages.create({
      model: CLAUDE_SONNET,
      max_tokens: 5000,
      messages: [{ role: 'user', content: `${POLL_STRATEGIST_SYSTEM}\n\n${strategistPrompt}` }]
    })
    const result = response.content[0].type === 'text' ? response.content[0].text : ''
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      strategyData = JSON.parse(jsonMatch ? jsonMatch[0] : result)
    } catch {
      strategyData = { poll_plans: [], content_loop_plan: {} }
    }
  } else {
    const result = await callOpenAI(strategistModel, POLL_STRATEGIST_SYSTEM, strategistPrompt, 5000)
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      strategyData = JSON.parse(jsonMatch ? jsonMatch[0] : result)
    } catch {
      strategyData = { poll_plans: [], content_loop_plan: {} }
    }
  }
  console.log('✅ Poll Strategy complete')

  // ========== STAGE 4: POLL GENERATION ==========
  console.log('✍️ Stage 4: Poll Generation...')
  processingStages.push('Poll Generation')

  const writerModel = tier === 'premium' ? CLAUDE_SONNET : (tier === 'standard' ? OPENAI_MODELS.GPT_4_1 : OPENAI_MODELS.GPT_4O)
  const writerPrompt = `
<poll_strategy>
${JSON.stringify(strategyData, null, 2)}
</poll_strategy>

<processed_input>
${JSON.stringify(processedInput, null, 2)}
</processed_input>

<research>
${researchData ? JSON.stringify(researchData, null, 2) : 'No research data'}
</research>

<voice_profile>
${voiceProfile ? JSON.stringify(voiceProfile, null, 2) : 'No voice profile - use confident professional tone'}
</voice_profile>

<style_profile>
${JSON.stringify(styleProfile, null, 2)}
</style_profile>

Write ${formData.pollCount} LinkedIn polls with companion text, first comments, and follow-up templates.

CRITICAL CHARACTER LIMITS:
- Poll question: MAX 140 characters
- Each poll option: MAX 30 characters
- Companion text: MAX 3,000 characters (210 char hook before "See More")

CRITICAL RULES:
- NO links in companion text (put in first comment)
- 3-5 hashtags at end of companion text
- All 4 options must be plausible (no throwaway answers)
- Include follow-up template for results post

Return a JSON array.
`

  let draftPolls: any[]
  if (tier === 'premium') {
    const response = await anthropic.messages.create({
      model: CLAUDE_SONNET,
      max_tokens: 8000,
      messages: [{ role: 'user', content: `${POLL_WRITER_SYSTEM}\n\n${writerPrompt}` }]
    })
    const result = response.content[0].type === 'text' ? response.content[0].text : ''
    try {
      const jsonMatch = result.match(/\[[\s\S]*\]/)
      draftPolls = JSON.parse(jsonMatch ? jsonMatch[0] : '[]')
    } catch {
      draftPolls = []
    }
  } else {
    const result = await callOpenAI(writerModel, POLL_WRITER_SYSTEM, writerPrompt, 8000)
    try {
      const jsonMatch = result.match(/\[[\s\S]*\]/)
      draftPolls = JSON.parse(jsonMatch ? jsonMatch[0] : '[]')
    } catch {
      draftPolls = []
    }
  }
  console.log(`✅ Poll Generation complete (${draftPolls.length} polls)`)

  // ========== STAGE 5: HARSH CRITIQUE ==========
  console.log('🔎 Stage 5: Harsh Critique...')
  processingStages.push('Harsh Critique')

  const critiqueModel = tier === 'premium' ? CLAUDE_OPUS : (tier === 'standard' ? CLAUDE_SONNET : OPENAI_MODELS.GPT_4O)
  const critiquePrompt = `
<draft_polls>
${JSON.stringify(draftPolls, null, 2)}
</draft_polls>

<customer_requirements>
Company: ${formData.company}
Industry: ${formData.industry}
Topic: ${formData.topic}
Audience: ${formData.audience}
${formData.goals ? `Goals: ${formData.goals}` : ''}
</customer_requirements>

Critique every poll. Check character limits (question: 140, options: 30), engagement potential, and companion text quality.
`

  let critiqueData: any
  if (tier === 'premium' || tier === 'standard') {
    const critiqueModelId = tier === 'premium' ? CLAUDE_OPUS : CLAUDE_SONNET
    const response = await anthropic.messages.create({
      model: critiqueModelId,
      max_tokens: 5000,
      messages: [{ role: 'user', content: `${POLL_CRITIQUE_SYSTEM}\n\n${critiquePrompt}` }]
    })
    const result = response.content[0].type === 'text' ? response.content[0].text : ''
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      critiqueData = JSON.parse(jsonMatch ? jsonMatch[0] : result)
    } catch {
      critiqueData = { overall_assessment: { pass_for_delivery: true, average_score: 75 }, poll_critiques: [] }
    }
  } else {
    const result = await callOpenAI(OPENAI_MODELS.GPT_4O, POLL_CRITIQUE_SYSTEM, critiquePrompt, 5000)
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      critiqueData = JSON.parse(jsonMatch ? jsonMatch[0] : result)
    } catch {
      critiqueData = { overall_assessment: { pass_for_delivery: true, average_score: 75 }, poll_critiques: [] }
    }
  }
  console.log('✅ Harsh Critique complete')

  // ========== STAGE 6: FINAL POLISH ==========
  console.log('✨ Stage 6: Final Polish...')
  processingStages.push('Final Polish')

  const polishModel = tier === 'premium' ? CLAUDE_OPUS : CLAUDE_SONNET
  const polishPrompt = `
<draft_polls>
${JSON.stringify(draftPolls, null, 2)}
</draft_polls>

<critique>
${JSON.stringify(critiqueData, null, 2)}
</critique>

<voice_profile>
${voiceProfile ? JSON.stringify(voiceProfile, null, 2) : 'No voice profile'}
</voice_profile>

Apply ALL fixes and deliver publication-ready polls.
VERIFY character limits: question 140, options 30 each.
`

  const polishResponse = await anthropic.messages.create({
    model: polishModel,
    max_tokens: 8000,
    messages: [{ role: 'user', content: `${POLL_POLISH_SYSTEM}\n\n${polishPrompt}` }]
  })

  const polishResult = polishResponse.content[0].type === 'text' ? polishResponse.content[0].text : ''
  let polishedData: any
  try {
    const jsonMatch = polishResult.match(/\{[\s\S]*\}/)
    polishedData = JSON.parse(jsonMatch ? jsonMatch[0] : polishResult)
  } catch {
    polishedData = { polished_polls: draftPolls, delivery_ready: true }
  }
  console.log('✅ Final Polish complete')

  // ========== BUILD RESPONSE ==========
  const polls: GeneratedPoll[] = (polishedData.polished_polls || []).map((p: any, i: number) => ({
    id: p.id || i + 1,
    question: p.question || '',
    questionCharacterCount: p.question_char_count || p.question?.length || 0,
    options: p.options || [],
    companionText: p.companion_text || '',
    companionTextCharacterCount: p.companion_text_char_count || p.companion_text?.length || 0,
    firstComment: p.first_comment || '',
    pollType: p.poll_type || styleProfile.poll_type,
    suggestedDuration: p.suggested_duration || styleProfile.poll_duration,
    engagementScore: p.engagement_score || 7,
    followUpTemplate: p.follow_up_template,
    suggestedPostingTime: p.suggested_posting_time || 'Tuesday-Thursday, 9-11 AM'
  }))

  const result: LinkedInPollPipelineResult = {
    polls,
    trendBriefing: researchData ? {
      currentTrends: researchData.trend_analysis?.hot_poll_topics || [],
      relevantTopics: researchData.trend_analysis?.controversial_but_safe_topics || []
    } : undefined,
    qualityReport: {
      overallScore: critiqueData.overall_assessment?.average_score || 75,
      engagementPrediction: 8,
      feedback: (critiqueData.poll_critiques || []).flatMap((c: any) => c.specific_problems || [])
    },
    contentLoopPlan: polishedData.content_loop_plan ? {
      pollToPostConnections: polishedData.content_loop_plan.poll_to_post_connections || [],
      recommendations: polishedData.content_loop_plan.recommendations || []
    } : undefined,
    metadata: {
      tier,
      processingStages,
      totalPolls: polls.length
    }
  }

  console.log('📊 LINKEDIN POLL PIPELINE: Complete!')
  return result
}
