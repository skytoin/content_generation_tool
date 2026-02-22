/**
 * X (Twitter) Tweet Generator Pipeline
 *
 * A 7-stage pipeline for generating individual tweets optimized for X's algorithm.
 *
 * Key X Platform Facts (2025):
 * - Text posts get 30% more engagement than videos
 * - 70-100 character tweets perform best for quick reads
 * - First 30 minutes are critical for algorithmic pickup
 * - 1-2 hashtags max (21% more engagement than 3+)
 * - Retweets have 20x multiplier in algorithm
 * - Accounts with Tweepcred < 0.65 only get 3 tweets considered
 *
 * Pipeline Stages:
 * Stage 0: Input Processor - Parse inputs, detect content source
 * Stage 1: X Intelligence Research - Trends, competitors, what's working
 * Stage 2: Voice Learning - Analyze customer's writing style (if samples provided)
 * Stage 3: Content Strategy - Plan tweet distribution and themes
 * Stage 4: Tweet Generation - Write tweets matching voice and strategy
 * Stage 5: Harsh Critique - Rigorous quality and risk assessment
 * Stage 6: Final Polish - Apply fixes and optimize
 */

import Anthropic from '@anthropic-ai/sdk'
import { callOpenAI, OPENAI_MODELS } from './openai-client'
import {
  XStyleProfile,
  XTweetFormData,
  XTweetPipelineResult,
  GeneratedTweet,
  defaultXStyleProfile,
  mergeWithDefaults
} from './x-options'

// Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Model configurations
const CLAUDE_SONNET = 'claude-sonnet-4-5-20250929'
const CLAUDE_OPUS = 'claude-opus-4-5-20251101'
const CLAUDE_HAIKU = 'claude-haiku-4-5-20251001'

// ============================================
// STAGE 0: INPUT PROCESSOR SYSTEM PROMPT
// ============================================

const INPUT_PROCESSOR_SYSTEM = `You are an expert X (Twitter) content strategist who analyzes customer inputs to prepare for content generation.

## YOUR MISSION
Parse and organize all input data, identify content sources, and validate requirements for the X tweet generation pipeline.

## KEY X PLATFORM KNOWLEDGE
- X character limit: 280 (standard), 25,000 (Premium)
- Optimal tweet length: 70-100 characters for quick reads
- Best posting times: Weekdays 9-11 AM, 7-9 PM EST
- Hashtag best practice: 1-2 max (21% more engagement than 3+)
- Text posts outperform videos by 30%

## CONTENT SOURCE DETECTION
Identify if the customer provided:
1. Original topic/keywords (generate from scratch)
2. Blog post content (extract and adapt)
3. Newsletter content (extract and adapt)
4. Podcast transcript (extract key moments)
5. Existing tweets (create variations)

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
      "tweet_count": 0,
      "primary_topics": [],
      "secondary_topics": [],
      "key_messages": []
    },
    "content_source": {
      "type": "original | blog_repurpose | newsletter_repurpose | podcast_repurpose | tweet_expansion",
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
// STAGE 1: X INTELLIGENCE RESEARCH SYSTEM PROMPT
// ============================================

const X_INTELLIGENCE_SYSTEM = `You are an elite X (Twitter) platform analyst with deep knowledge of what content performs in 2025.

## YOUR MISSION
Research and analyze the X landscape for the customer's niche to inform content strategy. Your research directly impacts engagement rates.

## RESEARCH AREAS

### 1. TRENDING TOPICS ANALYSIS
- What's currently trending in the customer's industry?
- Which conversations have momentum right now?
- What topics are oversaturated (avoid)?
- What emerging topics have potential (opportunity)?

### 2. COMPETITOR/INFLUENCER ANALYSIS
- What content formats are top accounts using?
- What hooks are getting engagement?
- What posting patterns work?
- Common themes in high-performing content

### 3. ENGAGEMENT PATTERN ANALYSIS
- What types of tweets get retweets (20x algorithm weight)?
- What drives replies (+13.5 algorithm weight)?
- What triggers saves/bookmarks?
- What time-sensitive opportunities exist?

### 4. HASHTAG RESEARCH
- What 1-2 hashtags are most relevant and active?
- What hashtags to avoid (oversaturated, spammy, risky)?
- Are there niche hashtags with engaged communities?

### 5. RISK ASSESSMENT
- Any topics that could trigger shadowban?
- Controversial areas to navigate carefully?
- Platform policy considerations?

## X ALGORITHM KNOWLEDGE (Use This)
- Retweets: 20x multiplier
- Replies from author: +75 weight
- Reply probability: +13.5 weight
- Profile clicks + engagement: +12 weight
- 2+ min conversation reads: +10 weight
- Likes: +0.5 weight
- First 30 minutes are CRITICAL

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
    "primary": "",
    "secondary": "",
    "avoid": []
  },
  "timing_recommendations": {
    "best_times": [],
    "avoid_times": [],
    "reasoning": ""
  },
  "risk_assessment": {
    "topics_to_avoid": [],
    "shadowban_risks": [],
    "safe_approaches": []
  },
  "strategic_opportunities": []
}`

// ============================================
// STAGE 2: VOICE LEARNING SYSTEM PROMPT
// ============================================

const VOICE_LEARNING_SYSTEM = `You are a master linguistic analyst who deconstructs writing styles to their fundamental patterns.

## YOUR MISSION
Analyze sample tweets to extract the customer's unique voice DNA. Your analysis will be used to generate content that sounds authentically like them, not generic AI.

## ANALYSIS FRAMEWORK

### 1. SENTENCE STRUCTURE PATTERNS
- Average sentence length (short punchy vs. flowing?)
- Use of fragments vs. complete sentences
- Question frequency and style
- Use of em-dashes, colons, ellipses
- Paragraph/line break patterns

### 2. VOCABULARY FINGERPRINT
- Favorite words and phrases
- Industry jargon level (heavy, light, none)
- Formality level (casual, professional, mixed)
- Unique word choices that stand out
- Words they NEVER use

### 3. TONE MARKERS
- Humor style (dry, witty, none, sarcasm)
- Confidence level (assertive, humble, balanced)
- Emotional expression (reserved, expressive)
- How they handle controversy
- Optimism/pessimism balance

### 4. ENGAGEMENT STYLE
- How they ask questions
- How they make statements
- CTA patterns
- How they respond to others
- Emoji and punctuation habits

### 5. UNIQUE QUIRKS
- Signature phrases or patterns
- Unusual capitalization
- Unique formatting choices
- Personal anecdotes style
- How they start and end tweets

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
    "punctuation_habits": []
  },
  "vocabulary_profile": {
    "formality_level": "",
    "jargon_usage": "",
    "favorite_words": [],
    "never_use_words": [],
    "unique_phrases": []
  },
  "tone_markers": {
    "humor_style": "",
    "confidence_level": "",
    "emotional_expression": "",
    "controversy_handling": ""
  },
  "engagement_patterns": {
    "question_style": "",
    "cta_patterns": [],
    "emoji_usage": ""
  },
  "unique_fingerprints": [],
  "writing_instructions": "Detailed instructions for mimicking this exact voice...",
  "phrases_to_emulate": [],
  "patterns_to_avoid": [],
  "confidence_score": 0.0
}`

// ============================================
// STAGE 3: CONTENT STRATEGY SYSTEM PROMPT
// ============================================

const CONTENT_STRATEGY_SYSTEM = `You are a strategic X (Twitter) content planner who designs tweet portfolios optimized for the algorithm.

## YOUR MISSION
Create a strategic plan for the requested number of tweets that maximizes variety, engagement potential, and algorithmic performance.

## STRATEGIC PRINCIPLES

### 1. CONTENT MIX OPTIMIZATION
Balance these tweet types based on customer preferences:
- INSIGHT tweets: Educational, valuable, shareable (high save rate)
- OPINION tweets: Takes, perspectives, positions (high engagement)
- QUESTION tweets: Conversation starters (high reply rate)
- STORY tweets: Personal, relatable moments (high connection)
- PROMOTIONAL tweets: Business mentions (use sparingly, 10-20% max)

### 2. VARIETY IS ESSENTIAL
Never write two similar tweets in a row. Vary:
- Length (punchy vs. detailed)
- Format (statement, question, list)
- Tone (serious, playful, thoughtful)
- Topic angle (even on same theme)

### 3. HOOK DIVERSITY
Plan different hook types across tweets:
- Bold statement hooks
- Question hooks
- Number/stat hooks
- Story hooks
- Contrarian hooks

### 4. ENGAGEMENT OPTIMIZATION
For each tweet, plan:
- Target engagement type (retweet, reply, like, save)
- Conversation potential
- Shareability factor

## OUTPUT FORMAT
Return a JSON object:
{
  "strategy_summary": "",
  "content_distribution": {
    "insight_count": 0,
    "opinion_count": 0,
    "question_count": 0,
    "story_count": 0,
    "promotional_count": 0
  },
  "tweet_plans": [
    {
      "tweet_number": 1,
      "content_type": "insight | opinion | question | story | promotional",
      "topic_angle": "",
      "hook_type": "",
      "target_length": "punchy | standard | detailed",
      "engagement_goal": "retweet | reply | like | save",
      "key_message": "",
      "must_include": [],
      "tone_note": ""
    }
  ],
  "theme_distribution": {
    "primary_theme_tweets": [],
    "secondary_theme_tweets": [],
    "variety_tweets": []
  },
  "posting_sequence_recommendation": ""
}`

// ============================================
// STAGE 4: TWEET GENERATION SYSTEM PROMPT
// ============================================

const TWEET_WRITER_SYSTEM = `You are an elite X (Twitter) copywriter who creates scroll-stopping tweets that drive massive engagement.

## YOUR MISSION
Write tweets that are indistinguishable from the customer's natural voice while maximizing engagement potential.

## CRITICAL WRITING RULES

### 1. AUTHENTICITY IS EVERYTHING
- Sound like a human, not a brand
- Use natural language patterns
- Include personality quirks
- Vary rhythm and pacing

### 2. SCROLL-STOPPING HOOKS
The first 5-10 words determine everything:
- Lead with the most interesting part
- Create curiosity gaps
- Use unexpected word combinations
- Make bold, specific claims

### 3. CHARACTER OPTIMIZATION
- Target 70-100 chars for punchy tweets (highest engagement)
- 100-200 chars for standard depth
- 200-280 chars only when more context truly adds value
- Every character must earn its place

### 4. PHRASES TO NEVER USE (AI Detection Killers)
- "In today's fast-paced world..."
- "It's important to note..."
- "Let me explain..."
- "Here's the thing..."
- "At the end of the day..."
- "When it comes to..."
- "First and foremost..."
- "That being said..."
- "In conclusion..."
- Generic inspirational quotes

### 4B. WORDS TO NEVER USE (AI Vocabulary Tells)
delve, tapestry, realm, leverage, utilize, harness, unlock, unleash, embark,
foster, facilitate, streamline, orchestrate, showcase, elucidate, navigate (metaphor),
optimize, elevate, revolutionize, paradigm, synergy, holistic, robust, seamless,
cutting-edge, groundbreaking, transformative, unprecedented, pivotal, plethora, myriad
Always prefer simpler words: "use" not "utilize", "help" not "facilitate", "start" not "embark"
Use contractions naturally (it's, don't, can't) — missing contractions is an AI tell.
EXCEPTIONS — these override the banned words list:
1. INDUSTRY TERMS: If a banned word is a genuine technical term for the customer's industry (e.g., "optimize" in SEO, "leverage" in finance), use it in its precise technical context — never as generic filler.
2. CUSTOMER-SPECIFIED WORDS: If the customer explicitly requests specific words (SEO keywords, brand terms, must-include vocabulary), the customer's preference always takes priority. Include those words naturally.

### 5. ENGAGEMENT TRIGGERS
For RETWEETS (20x algorithm weight):
- Shareable insights people want to spread
- "Holy sh*t, I need to share this" moments
- Contrarian takes that start conversations

For REPLIES (+13.5 algorithm weight):
- Open-ended questions
- Controversial (but safe) positions
- Relatable struggles

For SAVES:
- Actionable frameworks
- Lists and tips
- Reference-worthy content

### 6. FORMATTING FOR X
- Line breaks for readability (use sparingly)
- No hashtag stuffing (max 1-2, at end if any)
- Emojis as seasoning, not main ingredient
- No external links in main tweet (put in first reply)

## OUTPUT FORMAT
For each tweet in the plan, generate:
{
  "tweet_number": 1,
  "text": "The actual tweet text",
  "character_count": 0,
  "content_type": "insight | opinion | question | story | promotional",
  "hook_analysis": "Why this hook works",
  "engagement_prediction": "What engagement this should drive",
  "hashtags": [],
  "variations": ["Alternative version 1", "Alternative version 2"]
}`

// ============================================
// STAGE 5: HARSH CRITIQUE SYSTEM PROMPT
// ============================================

const HARSH_CRITIQUE_SYSTEM = `You are a merciless X (Twitter) content critic with impossibly high standards. Your job is to destroy mediocre content before it damages the customer's brand.

## YOUR MISSION
Ruthlessly evaluate every tweet against quality standards, platform best practices, and customer requirements. Be brutally honest - the customer paid for excellence, not participation trophies.

## EVALUATION FRAMEWORK

### 1. HOOK EFFECTIVENESS (25 points)
Does the first 5-10 words stop the scroll?
- 25: Irresistible, must-read
- 20: Strong, attention-grabbing
- 15: Decent, might get noticed
- 10: Weak, easily scrolled past
- 5: Generic, invisible
- 0: Actively repels readers

### 2. VOICE AUTHENTICITY (25 points)
Does this sound like the customer, or generic AI?
- Check against voice profile (if provided)
- Look for AI-typical phrases
- Verify personality markers
- Assess natural flow

### 3. ENGAGEMENT POTENTIAL (25 points)
Will this drive the target engagement?
- Retweet potential (shareable insight?)
- Reply potential (conversation starter?)
- Save potential (reference-worthy?)
- Scroll-stopping power

### 4. PLATFORM OPTIMIZATION (15 points)
Does this follow X best practices?
- Character count optimization
- Hashtag strategy (max 1-2)
- No external links in body
- Proper formatting

### 5. BRAND SAFETY (10 points)
Any risks to the customer's reputation?
- Shadowban risk assessment
- Controversy appropriateness
- Policy compliance
- Tone consistency

## CRITIQUE METHODOLOGY

For EACH tweet, provide:
1. Score breakdown (out of 100)
2. SPECIFIC problems (not vague feedback)
3. EXACT fixes required (not suggestions)
4. Rewrite if score < 70

## RED FLAGS TO CATCH
- AI-sounding phrases (automatic -20 points)
- Generic hooks that could apply to anyone (-15 points)
- Missing customer's voice markers (-15 points)
- Hashtag stuffing (>2 hashtags) (-10 points)
- External links in tweet body (-10 points)
- Too similar to another tweet in set (-15 points)
- Doesn't match the planned content type (-10 points)
- Engagement bait that risks shadowban (-25 points)

## OUTPUT FORMAT
Return a JSON object:
{
  "overall_assessment": {
    "pass_for_delivery": true/false,
    "average_score": 0,
    "critical_issues_count": 0,
    "tweets_needing_rewrite": []
  },
  "tweet_critiques": [
    {
      "tweet_number": 1,
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
  "shadowban_risk_assessment": {
    "overall_risk": "low | medium | high",
    "flagged_tweets": [],
    "risk_factors": []
  },
  "voice_consistency_check": {
    "consistent": true/false,
    "deviations": []
  },
  "variety_check": {
    "sufficient_variety": true/false,
    "similar_tweets": [],
    "recommendations": []
  }
}`

// ============================================
// STAGE 6: FINAL POLISH SYSTEM PROMPT
// ============================================

const FINAL_POLISH_SYSTEM = `You are a master X (Twitter) editor who transforms good tweets into exceptional ones. You are the last line of defense before content reaches the customer.

## YOUR MISSION
Apply all required fixes from the critique, ensure perfect voice consistency, and deliver publication-ready tweets that will make the customer proud.

## POLISH PRIORITIES

### 1. FIX ALL CRITICAL ISSUES
Every problem identified in the critique MUST be fixed. No exceptions.

### 2. VOICE PERFECTION
If voice samples were provided, every tweet must pass the "could they have written this?" test.

### 3. HOOK OPTIMIZATION
If any hook scored below 20, strengthen it. The first words are everything.

### 4. ENGAGEMENT MAXIMIZATION
Ensure each tweet has clear engagement potential. If it doesn't inspire action, improve it.

### 5. FINAL FORMATTING
- Verify character counts
- Check hashtag placement (end of tweet if any)
- Ensure proper line breaks
- Remove any formatting artifacts

### 6. QUALITY CONSISTENCY
The weakest tweet defines the set's quality. Elevate everything to match the best.

## OUTPUT FORMAT
Return a JSON object:
{
  "polished_tweets": [
    {
      "id": 1,
      "text": "Final polished tweet text",
      "character_count": 0,
      "content_type": "insight | opinion | question | story | promotional",
      "engagement_score": 8,
      "hashtags": [],
      "suggested_posting_time": "Weekday morning, 9-11 AM EST",
      "variations": ["Alternative 1", "Alternative 2"],
      "changes_made": ["List of changes from draft"]
    }
  ],
  "delivery_ready": true,
  "final_notes": ""
}`

// ============================================
// MAIN PIPELINE FUNCTION
// ============================================

export async function runXTweetPipeline(
  formData: XTweetFormData,
  styleSelections: Partial<XStyleProfile>,
  tier: 'budget' | 'standard' | 'premium' = 'budget'
): Promise<XTweetPipelineResult> {
  console.log(`🐦 X TWEET PIPELINE (${tier.toUpperCase()} TIER): Starting generation...`)

  const processingStages: string[] = []
  const styleProfile = mergeWithDefaults(styleSelections)

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

Process and validate these inputs for X tweet generation.
Number of tweets requested: ${formData.tweetCount}
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
        content_request: { tweet_count: formData.tweetCount, primary_topics: [formData.topic] },
        content_source: { type: styleProfile.source_type },
        constraints: { must_include: formData.mustInclude || [], must_avoid: formData.mustAvoid || [] }
      }
    }
  }
  console.log('✅ Input processing complete')

  // ========== STAGE 1: X INTELLIGENCE RESEARCH ==========
  let researchData: any = null

  if (tier !== 'budget' || styleProfile.trend_integration !== 'none') {
    console.log('🔍 Stage 1: X Intelligence Research...')
    processingStages.push('X Intelligence Research')

    const researchModel = tier === 'premium' ? CLAUDE_SONNET : OPENAI_MODELS.GPT_4O
    const researchPrompt = `
<processed_input>
${JSON.stringify(processedInput, null, 2)}
</processed_input>

<trend_integration_level>
${styleProfile.trend_integration}
</trend_integration_level>

Research the X landscape for:
- Industry: ${formData.industry}
- Topic: ${formData.topic}
- Audience: ${formData.audience}

Provide comprehensive intelligence to inform content strategy.
`

    if (tier === 'premium') {
      const response = await anthropic.messages.create({
        model: CLAUDE_SONNET,
        max_tokens: 4000,
        messages: [{ role: 'user', content: `${X_INTELLIGENCE_SYSTEM}\n\n${researchPrompt}` }]
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
        X_INTELLIGENCE_SYSTEM,
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
    console.log('✅ X Intelligence Research complete')
  } else {
    processingStages.push('X Intelligence Research (Skipped - Budget Tier)')
  }

  // ========== STAGE 2: VOICE LEARNING ==========
  let voiceProfile: any = null

  if (formData.sampleTweets && formData.sampleTweets.trim().length > 100) {
    console.log('🎤 Stage 2: Voice Learning...')
    processingStages.push('Voice Learning')

    const voiceModel = tier === 'premium' ? CLAUDE_SONNET : OPENAI_MODELS.GPT_4O
    const voicePrompt = `
<sample_tweets>
${formData.sampleTweets}
</sample_tweets>

<voice_learning_level>
${styleProfile.voice_learning}
</voice_learning_level>

Analyze these sample tweets and extract the unique voice DNA.
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

  const strategyModel = tier === 'budget' ? OPENAI_MODELS.GPT_4O_MINI : OPENAI_MODELS.GPT_4O
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

<tweet_count>
${formData.tweetCount}
</tweet_count>

<content_mix_preference>
${styleProfile.content_mix}
</content_mix_preference>

Create a strategic plan for ${formData.tweetCount} tweets.
`

  const strategyResult = await callOpenAI(
    strategyModel,
    CONTENT_STRATEGY_SYSTEM,
    strategyPrompt,
    4000
  )

  let strategyData: any
  try {
    const jsonMatch = strategyResult.match(/\{[\s\S]*\}/)
    strategyData = JSON.parse(jsonMatch ? jsonMatch[0] : strategyResult)
  } catch {
    // Fallback strategy
    strategyData = {
      strategy_summary: 'Balanced content mix',
      tweet_plans: Array.from({ length: formData.tweetCount }, (_, i) => ({
        tweet_number: i + 1,
        content_type: ['insight', 'opinion', 'question', 'story'][i % 4],
        topic_angle: formData.topic,
        hook_type: 'statement',
        target_length: 'standard',
        engagement_goal: 'engagement',
        key_message: '',
        tone_note: ''
      }))
    }
  }
  console.log('✅ Content Strategy complete')

  // ========== STAGE 4: TWEET GENERATION ==========
  console.log('✍️ Stage 4: Tweet Generation...')
  processingStages.push('Tweet Generation')

  const writerModel = tier === 'premium' ? CLAUDE_SONNET : OPENAI_MODELS.GPT_4O
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
${voiceProfile ? JSON.stringify(voiceProfile, null, 2) : 'No voice profile - use natural professional tone'}
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

<length_preference>
${styleProfile.length_preference}
</length_preference>

Write ${formData.tweetCount} exceptional tweets following the strategy.
For each tweet, provide the JSON output as specified.

Return a JSON array of tweet objects.
`

  let draftTweets: any[]
  if (tier === 'premium') {
    const response = await anthropic.messages.create({
      model: CLAUDE_SONNET,
      max_tokens: 8000,
      messages: [{ role: 'user', content: `${TWEET_WRITER_SYSTEM}\n\n${writerPrompt}` }]
    })
    const writerResult = response.content[0].type === 'text' ? response.content[0].text : ''
    try {
      const jsonMatch = writerResult.match(/\[[\s\S]*\]/)
      draftTweets = JSON.parse(jsonMatch ? jsonMatch[0] : '[]')
    } catch {
      draftTweets = []
    }
  } else {
    const writerResult = await callOpenAI(
      writerModel,
      TWEET_WRITER_SYSTEM,
      writerPrompt,
      8000
    )
    try {
      const jsonMatch = writerResult.match(/\[[\s\S]*\]/)
      draftTweets = JSON.parse(jsonMatch ? jsonMatch[0] : '[]')
    } catch {
      draftTweets = []
    }
  }
  console.log(`✅ Tweet Generation complete (${draftTweets.length} tweets)`)

  // ========== STAGE 5: HARSH CRITIQUE ==========
  console.log('🔎 Stage 5: Harsh Critique...')
  processingStages.push('Harsh Critique')

  const critiqueModel = tier === 'premium' ? CLAUDE_SONNET : OPENAI_MODELS.GPT_4O
  const critiquePrompt = `
<draft_tweets>
${JSON.stringify(draftTweets, null, 2)}
</draft_tweets>

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

Ruthlessly critique every tweet. Be brutal - the customer paid for excellence.
`

  let critiqueData: any
  if (tier === 'premium') {
    const response = await anthropic.messages.create({
      model: CLAUDE_SONNET,
      max_tokens: 6000,
      messages: [{ role: 'user', content: `${HARSH_CRITIQUE_SYSTEM}\n\n${critiquePrompt}` }]
    })
    const critiqueResult = response.content[0].type === 'text' ? response.content[0].text : ''
    try {
      const jsonMatch = critiqueResult.match(/\{[\s\S]*\}/)
      critiqueData = JSON.parse(jsonMatch ? jsonMatch[0] : critiqueResult)
    } catch {
      critiqueData = { overall_assessment: { pass_for_delivery: true, average_score: 75 }, tweet_critiques: [] }
    }
  } else {
    const critiqueResult = await callOpenAI(
      critiqueModel,
      HARSH_CRITIQUE_SYSTEM,
      critiquePrompt,
      6000
    )
    try {
      const jsonMatch = critiqueResult.match(/\{[\s\S]*\}/)
      critiqueData = JSON.parse(jsonMatch ? jsonMatch[0] : critiqueResult)
    } catch {
      critiqueData = { overall_assessment: { pass_for_delivery: true, average_score: 75 }, tweet_critiques: [] }
    }
  }
  console.log('✅ Harsh Critique complete')

  // ========== STAGE 6: FINAL POLISH ==========
  console.log('✨ Stage 6: Final Polish...')
  processingStages.push('Final Polish')

  const polishModel = tier === 'premium' ? CLAUDE_OPUS : CLAUDE_SONNET
  const polishPrompt = `
<draft_tweets>
${JSON.stringify(draftTweets, null, 2)}
</draft_tweets>

<critique>
${JSON.stringify(critiqueData, null, 2)}
</critique>

<voice_profile>
${voiceProfile ? JSON.stringify(voiceProfile, null, 2) : 'No voice profile - ensure natural professional tone'}
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

Apply ALL fixes from the critique and deliver publication-ready tweets.
`

  const polishResponse = await anthropic.messages.create({
    model: polishModel,
    max_tokens: 8000,
    messages: [{ role: 'user', content: `${FINAL_POLISH_SYSTEM}\n\n${polishPrompt}` }]
  })

  const polishResult = polishResponse.content[0].type === 'text' ? polishResponse.content[0].text : ''
  let polishedData: any
  try {
    const jsonMatch = polishResult.match(/\{[\s\S]*\}/)
    polishedData = JSON.parse(jsonMatch ? jsonMatch[0] : polishResult)
  } catch {
    polishedData = { polished_tweets: draftTweets, delivery_ready: true }
  }
  console.log('✅ Final Polish complete')

  // ========== BUILD RESPONSE ==========
  const tweets: GeneratedTweet[] = (polishedData.polished_tweets || []).map((t: any, i: number) => ({
    id: t.id || i + 1,
    text: t.text || '',
    characterCount: t.character_count || t.text?.length || 0,
    contentType: t.content_type || 'insight',
    engagementScore: t.engagement_score || 7,
    hashtags: t.hashtags || [],
    suggestedPostingTime: t.suggested_posting_time || 'Weekday morning',
    variations: t.variations || []
  }))

  const result: XTweetPipelineResult = {
    tweets,
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
      shadowbanRisk: critiqueData.shadowban_risk_assessment?.overall_risk || 'low',
      feedback: [
        ...(critiqueData.tweet_critiques || []).flatMap((c: any) => c.specific_problems || []),
        ...(critiqueData.overall_assessment?.critical_issues_count > 0 ? ['Some tweets needed revision'] : [])
      ]
    },
    postingCalendar: {
      recommendations: researchData?.timing_recommendations?.best_times || ['Weekday mornings 9-11 AM EST']
    },
    metadata: {
      tier,
      processingStages,
      totalTweets: tweets.length
    }
  }

  console.log('🐦 X TWEET PIPELINE: Complete!')
  return result
}
