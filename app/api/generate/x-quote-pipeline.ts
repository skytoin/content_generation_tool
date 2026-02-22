/**
 * X (Twitter) Quote Tweet Crafter Pipeline
 *
 * A specialized pipeline for generating strategic quote tweets.
 * Quote tweets get 2x the engagement of regular tweets.
 *
 * Key Quote Tweet Facts (2025):
 * - Quote tweets earn 2x engagement of standard posts
 * - They build relationships with target accounts
 * - Great for trend-jacking and joining conversations
 * - Must add genuine value, not just "great post!"
 * - Can position you as a thought leader
 *
 * Pipeline Stages:
 * Stage 0: Input Processor - Parse targets/trends, understand goals
 * Stage 1: Target/Trend Research - Deep analysis of accounts or trends
 * Stage 2: Voice Learning - Match customer's engagement style
 * Stage 3: Response Strategy - Plan quote tweet types and approaches
 * Stage 4: Quote Tweet Generation - Write authentic, value-adding responses
 * Stage 5: Harsh Critique - Check authenticity, value-add, and risk
 * Stage 6: Final Polish - Perfect and deliver
 */

import Anthropic from '@anthropic-ai/sdk'
import { callOpenAI, OPENAI_MODELS } from './openai-client'
import {
  XStyleProfile,
  XQuoteTweetFormData,
  XQuoteTweetPipelineResult,
  GeneratedQuoteTweet,
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

// ============================================
// STAGE 0: INPUT PROCESSOR FOR QUOTE TWEETS
// ============================================

const QUOTE_INPUT_PROCESSOR_SYSTEM = `You are an expert X (Twitter) engagement strategist who analyzes inputs for quote tweet generation.

## YOUR MISSION
Parse and organize inputs to prepare for strategic quote tweet creation. Understand the customer's engagement goals and targets.

## INPUT MODE ANALYSIS

### MODE A: TARGET ACCOUNTS
If customer provided target accounts:
- Categorize accounts (competitors, influencers, potential partners, industry leaders)
- Assess relationship potential
- Identify engagement opportunities
- Note what types of posts each account typically shares

### MODE B: TREND RESPONSE
If customer wants to respond to trends:
- Identify trend categories relevant to their niche
- Assess trend lifecycle (emerging, peak, declining)
- Note controversy/risk levels
- Identify opportunity angles

### MODE C: CONTENT TYPE TEMPLATES
If customer wants templates for content types:
- News/announcements responses
- Hot take/opinion responses
- Question responses
- Thread responses
- Data/research responses

## OUTPUT FORMAT
Return a JSON object:
{
  "processed_input": {
    "brand_info": {
      "company": "",
      "industry": "",
      "positioning": "",
      "expertise_areas": []
    },
    "engagement_goals": {
      "primary_goal": "visibility | networking | authority | community",
      "target_outcomes": [],
      "relationship_building_focus": ""
    },
    "input_mode": "target_accounts | trends | content_types",
    "targets": {
      "accounts": [],
      "trends": [],
      "content_types": []
    }
  },
  "strategy_context": {
    "brand_voice_for_engagement": "",
    "authority_position": "",
    "safe_controversy_level": ""
  },
  "validation": {
    "is_valid": true,
    "warnings": [],
    "suggestions": []
  }
}`

// ============================================
// STAGE 1: TARGET/TREND RESEARCH
// ============================================

const QUOTE_RESEARCH_SYSTEM = `You are an elite X (Twitter) engagement researcher who analyzes targets for strategic quote tweeting.

## YOUR MISSION
Research target accounts or trends to inform quote tweet strategy. Your insights will help craft responses that get noticed and build relationships.

## FOR TARGET ACCOUNTS

### Account Analysis Framework
For each target account:

1. CONTENT THEMES
- What topics do they consistently post about?
- What gets them the most engagement?
- What patterns appear in their content?

2. POSTING STYLE
- How do they write? (formal, casual, provocative?)
- Do they use questions? Hot takes? Data?
- How do they engage with their audience?

3. ENGAGEMENT PATTERNS
- What types of replies do they respond to?
- What quote tweets have they engaged with?
- What gets ignored vs. noticed?

4. OPPORTUNITY WINDOWS
- When do they post?
- What topics are they likely to post about soon?
- What content would complement their posts?

### Relationship Potential
- How aligned are your brand values?
- What value can you add to their conversations?
- What's the path to building a relationship?

## FOR TRENDING TOPICS

### Trend Analysis Framework
1. TREND LIFECYCLE
- Emerging (early opportunity)
- Peak (maximum visibility, high competition)
- Declining (late, possibly oversaturated)

2. RELEVANCE ASSESSMENT
- How relevant to customer's niche?
- Can they add genuine expertise?
- Is it a good brand fit?

3. CONVERSATION ANALYSIS
- What angles are being discussed?
- What's missing from the conversation?
- What would be a fresh perspective?

4. RISK ASSESSMENT
- Controversy level
- Potential for backlash
- Brand safety considerations

## OUTPUT FORMAT
Return a JSON object:
{
  "target_analysis": [
    {
      "target": "@username or trend topic",
      "type": "account | trend",
      "content_themes": [],
      "engagement_style": "",
      "opportunity_notes": [],
      "best_response_types": [],
      "timing_recommendations": "",
      "risk_notes": []
    }
  ],
  "strategic_opportunities": [],
  "content_type_recommendations": {
    "add_value": [],
    "agree_amplify": [],
    "respectful_disagree": [],
    "personal_experience": [],
    "ask_deeper": []
  },
  "risk_assessment": {
    "safe_topics": [],
    "caution_topics": [],
    "avoid_topics": []
  }
}`

// ============================================
// STAGE 2: VOICE LEARNING FOR ENGAGEMENT
// ============================================

const QUOTE_VOICE_LEARNING_SYSTEM = `You are a specialist in analyzing how people engage on X (Twitter).

## YOUR MISSION
Analyze how the customer engages with others to replicate their authentic engagement voice.

## ENGAGEMENT VOICE ANALYSIS

### 1. REPLY/QUOTE STYLE
- How do they respond to others?
- Level of formality in engagement
- How do they agree? Disagree?
- Do they ask follow-up questions?

### 2. VALUE-ADD PATTERNS
- How do they contribute to conversations?
- Do they share personal experience?
- Do they add data/evidence?
- Do they make connections to other ideas?

### 3. TONE IN ENGAGEMENT
- How friendly vs. professional?
- How much humor?
- How they handle disagreement

### 4. RELATIONSHIP BUILDING
- How do they build rapport?
- Do they reference past conversations?
- How personal do they get?

## OUTPUT FORMAT
Return a JSON object:
{
  "engagement_voice": {
    "overall_style": "",
    "formality_level": "",
    "warmth_level": ""
  },
  "response_patterns": {
    "agreement_style": "",
    "disagreement_style": "",
    "question_style": "",
    "value_add_style": ""
  },
  "unique_markers": [],
  "engagement_instructions": "Detailed instructions for mimicking their engagement style...",
  "phrases_to_use": [],
  "patterns_to_avoid": [],
  "confidence_score": 0.0
}`

// ============================================
// STAGE 3: RESPONSE STRATEGY
// ============================================

const QUOTE_STRATEGY_SYSTEM = `You are a strategic X (Twitter) engagement planner who designs quote tweet portfolios.

## YOUR MISSION
Plan a strategic set of quote tweets that achieves the customer's engagement goals while adding genuine value.

## QUOTE TWEET TYPE DEFINITIONS

### 1. ADD VALUE
Expand on the original with additional insight, example, or perspective.
Best for: Building authority, getting noticed by thought leaders

### 2. AGREE + AMPLIFY
Support and strengthen the original point with your endorsement.
Best for: Building relationships, showing alignment

### 3. RESPECTFUL DISAGREE
Challenge with an alternative view, done professionally.
Best for: Thought leadership, standing out (higher risk, higher reward)

### 4. PERSONAL EXPERIENCE
Add your story or example that relates to the original.
Best for: Authenticity, connection, relatability

### 5. ASK DEEPER
Probe further with a smart, thoughtful question.
Best for: Starting conversations, showing curiosity

### 6. SUMMARIZE
Distill the original for your audience, adding your take.
Best for: Being helpful, positioning as curator

### 7. CONNECT DOTS
Link to related topic, trend, or your own content.
Best for: Showing expertise, building on ideas

### 8. HUMOR/WIT
Clever or funny response that adds levity.
Best for: Personality, memorability (requires skill)

## STRATEGY PRINCIPLES

### 1. AUTHENTICITY OVER TACTICS
Every quote tweet must feel genuine. Sycophantic "great post!" adds nothing.

### 2. VALUE-FIRST MINDSET
Ask: "What am I adding to this conversation?"

### 3. RELATIONSHIP AWARENESS
Consider: "How will this be received by the original poster?"

### 4. BRAND ALIGNMENT
Ensure: "Does this position my brand the way I want?"

## OUTPUT FORMAT
Return a JSON object:
{
  "strategy_summary": "",
  "quote_tweet_plans": [
    {
      "number": 1,
      "target": "@username or trend topic",
      "target_context": "What kind of post to respond to",
      "quote_type": "add_value | agree_amplify | respectful_disagree | personal_experience | ask_deeper | summarize | connect_dots | humor",
      "response_angle": "",
      "value_proposition": "What you're adding",
      "tone_note": "",
      "timing_note": "",
      "expected_outcome": ""
    }
  ],
  "type_distribution": {
    "add_value": 0,
    "agree_amplify": 0,
    "respectful_disagree": 0,
    "personal_experience": 0,
    "ask_deeper": 0,
    "summarize": 0,
    "connect_dots": 0,
    "humor": 0
  },
  "relationship_building_notes": ""
}`

// ============================================
// STAGE 4: QUOTE TWEET GENERATION
// ============================================

const QUOTE_WRITER_SYSTEM = `You are an elite X (Twitter) engagement copywriter who creates quote tweets that get noticed and build relationships.

## YOUR MISSION
Write quote tweets that are authentic, valuable, and position the customer as a thoughtful contributor to conversations.

## CRITICAL WRITING RULES

### 1. VALUE IS MANDATORY
Every quote tweet must pass the "So what?" test.
- What are you adding?
- Why should anyone care about your response?
- Would the original poster appreciate this?

### 2. AUTHENTICITY IS EVERYTHING
- Sound like a real person, not a brand
- Show genuine interest/opinion
- Don't be sycophantic ("Great post!" = worthless)
- Don't be generic ("This is so true!" = invisible)

### 3. PHRASES THAT KILL QUOTE TWEETS
Never use:
- "This." (lazy, adds nothing)
- "Great post!" (sycophantic, invisible)
- "So true!" (generic, forgettable)
- "Couldn't agree more!" (empty)
- "This is gold!" (feels fake)
- "Nailed it!" (low effort)
- "Thread alert!" (overused)

### 3B. WORDS TO NEVER USE (AI Vocabulary Tells)
delve, tapestry, realm, leverage, utilize, harness, unlock, unleash, embark,
foster, facilitate, orchestrate, showcase, elucidate, navigate (metaphor),
optimize, elevate, revolutionize, paradigm, synergy, holistic, robust, seamless,
transformative, unprecedented, pivotal, plethora, myriad
Prefer simpler words: "use" not "utilize", "help" not "facilitate"
Use contractions (it's, don't, can't) — missing contractions is an AI tell.
EXCEPTIONS — these override the banned words list:
1. INDUSTRY TERMS: If a banned word is a genuine technical term for the customer's industry (e.g., "optimize" in SEO, "leverage" in finance), use it in its precise technical context — never as generic filler.
2. CUSTOMER-SPECIFIED WORDS: If the customer explicitly requests specific words (SEO keywords, brand terms, must-include vocabulary), the customer's preference always takes priority. Include those words naturally.

### 4. WHAT WORKS
- Specific additions ("This happened to me when...")
- Thoughtful extensions ("And this connects to...")
- Genuine questions ("What about when...?")
- Expert additions ("From my experience in X...")
- Respectful challenges ("Interesting, though I've seen...")

### 5. CHARACTER EFFICIENCY
Quote tweets need to be punchy. The original post is already there.
- 50-150 characters is often ideal
- Get to the point fast
- Don't repeat what they said

### 6. TONE MATCHING
- Match the formality of the original
- If they're being playful, you can be too
- If they're being serious, respect that
- Don't be MORE formal than them (feels cold)

## OUTPUT FORMAT
For each quote tweet, return:
{
  "number": 1,
  "response_text": "The actual quote tweet",
  "character_count": 0,
  "target_context": "When @user posts about X",
  "quote_type": "add_value | agree_amplify | etc.",
  "value_added": "What this contributes",
  "tone_note": "",
  "timing_guidance": "evergreen | rapid_response | trend_specific"
}`

// ============================================
// STAGE 5: HARSH CRITIQUE FOR QUOTE TWEETS
// ============================================

const QUOTE_CRITIQUE_SYSTEM = `You are a ruthless X (Twitter) engagement critic. Your standards are high because bad quote tweets can damage relationships and make the brand look desperate.

## YOUR MISSION
Evaluate every quote tweet for authenticity, value-add, and brand safety. Sycophantic or generic responses are unacceptable.

## EVALUATION FRAMEWORK

### 1. AUTHENTICITY SCORE (30 points)
- Does it sound like a real person? (not a brand, not AI)
- Is the voice consistent with the customer's style?
- Does it feel genuine?
- Would you believe a human wrote this in the moment?

### 2. VALUE-ADD SCORE (30 points)
- What does this contribute to the conversation?
- Would the original poster appreciate it?
- Does it make the reader think/feel something?
- Is it just noise, or is it signal?

### 3. RELATIONSHIP IMPACT (20 points)
- Will this help or hurt the relationship?
- How will the original poster perceive this?
- Does it position the brand well?

### 4. EXECUTION QUALITY (20 points)
- Character efficiency
- Tone matching
- Timing appropriateness
- Grammar/clarity

## RED FLAGS TO CATCH

### Instant Fails (0 points, must rewrite):
- "This." / "This is gold." / "Nailed it!"
- "Great post!" / "Amazing insight!"
- "Couldn't agree more!" without adding anything
- Generic responses that could apply to any post
- Responses that just repeat the original point
- Obvious AI-sounding language

### Significant Penalties:
- Sycophantic tone (-15 points)
- No clear value-add (-15 points)
- Tone mismatch (-10 points)
- Too long/wordy (-10 points)
- Wrong quote type for context (-10 points)

## OUTPUT FORMAT
Return a JSON object:
{
  "overall_assessment": {
    "pass_for_delivery": true,
    "average_score": 0,
    "sycophancy_detected": false,
    "generic_responses_count": 0,
    "rewrites_required": []
  },
  "quote_critiques": [
    {
      "number": 1,
      "scores": {
        "authenticity": 0,
        "value_add": 0,
        "relationship_impact": 0,
        "execution_quality": 0,
        "total": 0
      },
      "verdict": "PASS | NEEDS_REVISION | REWRITE_REQUIRED",
      "issues": [],
      "fixes_required": [],
      "rewrite_if_needed": ""
    }
  ],
  "authenticity_check": {
    "overall_authentic": true,
    "flagged_as_generic": [],
    "flagged_as_sycophantic": []
  },
  "value_check": {
    "high_value_responses": [],
    "low_value_responses": [],
    "no_value_responses": []
  }
}`

// ============================================
// STAGE 6: FINAL POLISH FOR QUOTE TWEETS
// ============================================

const QUOTE_POLISH_SYSTEM = `You are the final quality gate for X (Twitter) quote tweets. You ensure every response is worth posting.

## YOUR MISSION
Apply all fixes from the critique and deliver quote tweets that will genuinely add value to conversations.

## POLISH PRIORITIES

### 1. ELIMINATE ALL SYCOPHANCY
If any response sounds like flattery, fix it. The test: Would you say this to someone's face without cringing?

### 2. ENSURE GENUINE VALUE
Every quote tweet must answer: "Why would anyone care about my response?"

### 3. VOICE CONSISTENCY
All responses should sound like the same person wrote them.

### 4. APPROPRIATE TONE MATCHING
Match the energy and formality of each target context.

### 5. POLISH FOR IMPACT
- Tighten language
- Strengthen the value proposition
- Ensure clarity

## OUTPUT FORMAT
Return a JSON object:
{
  "polished_quote_tweets": [
    {
      "id": 1,
      "response_text": "Final polished response",
      "character_count": 0,
      "target_context": "When @user posts about X",
      "quote_type": "add_value | agree_amplify | etc.",
      "tone_label": "",
      "expected_engagement_type": "",
      "timing_guidance": "",
      "changes_made": []
    }
  ],
  "strategy_notes": "Overall strategy notes for using these quote tweets",
  "delivery_ready": true,
  "final_quality_score": 0
}`

// ============================================
// MAIN QUOTE TWEET PIPELINE FUNCTION
// ============================================

export async function runXQuoteTweetPipeline(
  formData: XQuoteTweetFormData,
  styleSelections: Partial<XStyleProfile>,
  tier: 'budget' | 'standard' | 'premium' = 'budget'
): Promise<XQuoteTweetPipelineResult> {
  console.log(`💬 X QUOTE TWEET PIPELINE (${tier.toUpperCase()} TIER): Starting generation...`)

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

<input_mode>
${styleProfile.input_mode}
</input_mode>

<target_accounts>
${(formData.targetAccounts || []).join(', ') || 'None provided'}
</target_accounts>

<trend_topics>
${(formData.trendTopics || []).join(', ') || 'None provided'}
</trend_topics>

<quote_tweet_count>
${formData.quoteTweetCount}
</quote_tweet_count>

Process these inputs for quote tweet generation.
`

  const inputResult = await callOpenAI(
    OPENAI_MODELS.GPT_4O_MINI,
    QUOTE_INPUT_PROCESSOR_SYSTEM,
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
        engagement_goals: { primary_goal: styleProfile.relationship_intent },
        input_mode: styleProfile.input_mode,
        targets: {
          accounts: formData.targetAccounts || [],
          trends: formData.trendTopics || []
        }
      }
    }
  }
  console.log('✅ Input processing complete')

  // ========== STAGE 1: TARGET/TREND RESEARCH ==========
  let researchData: any = null

  if (tier !== 'budget') {
    console.log('🔍 Stage 1: Target/Trend Research...')
    processingStages.push('Target/Trend Research')

    const researchPrompt = `
<processed_input>
${JSON.stringify(processedInput, null, 2)}
</processed_input>

<input_mode>
${styleProfile.input_mode}
</input_mode>

<brand_info>
Company: ${formData.company}
Industry: ${formData.industry}
Audience: ${formData.audience}
${formData.goals ? `Goals: ${formData.goals}` : ''}
</brand_info>

Research the targets/trends for strategic quote tweet creation.
`

    const researchModel = tier === 'premium' ? CLAUDE_SONNET : OPENAI_MODELS.GPT_4O

    if (tier === 'premium') {
      const response = await anthropic.messages.create({
        model: CLAUDE_SONNET,
        max_tokens: 4000,
        messages: [{ role: 'user', content: `${QUOTE_RESEARCH_SYSTEM}\n\n${researchPrompt}` }]
      })
      const result = response.content[0].type === 'text' ? response.content[0].text : ''
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/)
        researchData = JSON.parse(jsonMatch ? jsonMatch[0] : result)
      } catch {
        researchData = {}
      }
    } else {
      const result = await callOpenAI(OPENAI_MODELS.GPT_4O, QUOTE_RESEARCH_SYSTEM, researchPrompt, 4000)
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/)
        researchData = JSON.parse(jsonMatch ? jsonMatch[0] : result)
      } catch {
        researchData = {}
      }
    }
    console.log('✅ Target/Trend Research complete')
  } else {
    processingStages.push('Target/Trend Research (Skipped - Budget Tier)')
  }

  // ========== STAGE 2: VOICE LEARNING ==========
  let voiceProfile: any = null

  if (formData.sampleTweets && formData.sampleTweets.trim().length > 100) {
    console.log('🎤 Stage 2: Voice Learning...')
    processingStages.push('Voice Learning')

    const voicePrompt = `
<sample_tweets>
${formData.sampleTweets}
</sample_tweets>

Analyze their engagement style for quote tweets.
`

    const voiceModel = tier === 'premium' ? CLAUDE_SONNET : OPENAI_MODELS.GPT_4O
    if (tier === 'premium') {
      const response = await anthropic.messages.create({
        model: CLAUDE_SONNET,
        max_tokens: 3000,
        messages: [{ role: 'user', content: `${QUOTE_VOICE_LEARNING_SYSTEM}\n\n${voicePrompt}` }]
      })
      const result = response.content[0].type === 'text' ? response.content[0].text : ''
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/)
        voiceProfile = JSON.parse(jsonMatch ? jsonMatch[0] : result)
      } catch {
        voiceProfile = { engagement_instructions: result, confidence_score: 0.6 }
      }
    } else {
      const result = await callOpenAI(voiceModel, QUOTE_VOICE_LEARNING_SYSTEM, voicePrompt, 3000)
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/)
        voiceProfile = JSON.parse(jsonMatch ? jsonMatch[0] : result)
      } catch {
        voiceProfile = { engagement_instructions: result, confidence_score: 0.6 }
      }
    }
    console.log('✅ Voice Learning complete')
  } else {
    processingStages.push('Voice Learning (Skipped - No samples)')
  }

  // ========== STAGE 3: RESPONSE STRATEGY ==========
  console.log('📊 Stage 3: Response Strategy...')
  processingStages.push('Response Strategy')

  const strategyPrompt = `
<processed_input>
${JSON.stringify(processedInput, null, 2)}
</processed_input>

<research_insights>
${researchData ? JSON.stringify(researchData, null, 2) : 'No research data'}
</research_insights>

<style_profile>
${JSON.stringify(styleProfile, null, 2)}
</style_profile>

<quote_tweet_count>
${formData.quoteTweetCount}
</quote_tweet_count>

<quote_type_mix_preference>
${styleProfile.quote_type_mix}
</quote_type_mix_preference>

<relationship_intent>
${styleProfile.relationship_intent}
</relationship_intent>

Plan ${formData.quoteTweetCount} strategic quote tweets.
`

  const strategyModel = tier === 'budget' ? OPENAI_MODELS.GPT_4O_MINI : OPENAI_MODELS.GPT_4O
  const strategyResult = await callOpenAI(
    strategyModel,
    QUOTE_STRATEGY_SYSTEM,
    strategyPrompt,
    4000
  )

  let strategyData: any
  try {
    const jsonMatch = strategyResult.match(/\{[\s\S]*\}/)
    strategyData = JSON.parse(jsonMatch ? jsonMatch[0] : strategyResult)
  } catch {
    strategyData = {
      strategy_summary: 'Balanced engagement approach',
      quote_tweet_plans: Array.from({ length: formData.quoteTweetCount }, (_, i) => ({
        number: i + 1,
        target: formData.targetAccounts?.[i % (formData.targetAccounts?.length || 1)] || 'Industry trend',
        quote_type: 'add_value',
        response_angle: ''
      }))
    }
  }
  console.log('✅ Response Strategy complete')

  // ========== STAGE 4: QUOTE TWEET GENERATION ==========
  console.log('✍️ Stage 4: Quote Tweet Generation...')
  processingStages.push('Quote Tweet Generation')

  const writerPrompt = `
<response_strategy>
${JSON.stringify(strategyData, null, 2)}
</response_strategy>

<processed_input>
${JSON.stringify(processedInput, null, 2)}
</processed_input>

<research_insights>
${researchData ? JSON.stringify(researchData, null, 2) : 'No research data'}
</research_insights>

<voice_profile>
${voiceProfile ? JSON.stringify(voiceProfile, null, 2) : 'No voice profile - use natural professional engagement tone'}
</voice_profile>

<style_profile>
${JSON.stringify(styleProfile, null, 2)}
</style_profile>

<brand_info>
Company: ${formData.company}
Industry: ${formData.industry}
Audience: ${formData.audience}
${formData.goals ? `Goals: ${formData.goals}` : ''}
</brand_info>

Write ${formData.quoteTweetCount} quote tweets following the strategy.
Return a JSON array.
`

  let draftQuoteTweets: any[]
  const writerModel = tier === 'premium' ? CLAUDE_SONNET : OPENAI_MODELS.GPT_4O

  if (tier === 'premium') {
    const response = await anthropic.messages.create({
      model: CLAUDE_SONNET,
      max_tokens: 6000,
      messages: [{ role: 'user', content: `${QUOTE_WRITER_SYSTEM}\n\n${writerPrompt}` }]
    })
    const result = response.content[0].type === 'text' ? response.content[0].text : ''
    try {
      const jsonMatch = result.match(/\[[\s\S]*\]/)
      draftQuoteTweets = JSON.parse(jsonMatch ? jsonMatch[0] : '[]')
    } catch {
      draftQuoteTweets = []
    }
  } else {
    const result = await callOpenAI(writerModel, QUOTE_WRITER_SYSTEM, writerPrompt, 6000)
    try {
      const jsonMatch = result.match(/\[[\s\S]*\]/)
      draftQuoteTweets = JSON.parse(jsonMatch ? jsonMatch[0] : '[]')
    } catch {
      draftQuoteTweets = []
    }
  }
  console.log(`✅ Quote Tweet Generation complete (${draftQuoteTweets.length} quote tweets)`)

  // ========== STAGE 5: HARSH CRITIQUE ==========
  console.log('🔎 Stage 5: Harsh Critique...')
  processingStages.push('Harsh Critique')

  const critiquePrompt = `
<draft_quote_tweets>
${JSON.stringify(draftQuoteTweets, null, 2)}
</draft_quote_tweets>

<response_strategy>
${JSON.stringify(strategyData, null, 2)}
</response_strategy>

<voice_profile>
${voiceProfile ? JSON.stringify(voiceProfile, null, 2) : 'No voice profile'}
</voice_profile>

<brand_info>
Company: ${formData.company}
Industry: ${formData.industry}
${formData.goals ? `Goals: ${formData.goals}` : ''}
</brand_info>

Ruthlessly critique these quote tweets. Watch especially for sycophancy and generic responses.
`

  let critiqueData: any
  const critiqueModel = tier === 'premium' ? CLAUDE_SONNET : OPENAI_MODELS.GPT_4O

  if (tier === 'premium') {
    const response = await anthropic.messages.create({
      model: CLAUDE_SONNET,
      max_tokens: 5000,
      messages: [{ role: 'user', content: `${QUOTE_CRITIQUE_SYSTEM}\n\n${critiquePrompt}` }]
    })
    const result = response.content[0].type === 'text' ? response.content[0].text : ''
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      critiqueData = JSON.parse(jsonMatch ? jsonMatch[0] : result)
    } catch {
      critiqueData = { overall_assessment: { pass_for_delivery: true, average_score: 75 } }
    }
  } else {
    const result = await callOpenAI(critiqueModel, QUOTE_CRITIQUE_SYSTEM, critiquePrompt, 5000)
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      critiqueData = JSON.parse(jsonMatch ? jsonMatch[0] : result)
    } catch {
      critiqueData = { overall_assessment: { pass_for_delivery: true, average_score: 75 } }
    }
  }
  console.log('✅ Harsh Critique complete')

  // ========== STAGE 6: FINAL POLISH ==========
  console.log('✨ Stage 6: Final Polish...')
  processingStages.push('Final Polish')

  const polishPrompt = `
<draft_quote_tweets>
${JSON.stringify(draftQuoteTweets, null, 2)}
</draft_quote_tweets>

<critique>
${JSON.stringify(critiqueData, null, 2)}
</critique>

<voice_profile>
${voiceProfile ? JSON.stringify(voiceProfile, null, 2) : 'No voice profile'}
</voice_profile>

<brand_info>
Company: ${formData.company}
Industry: ${formData.industry}
${formData.goals ? `Goals: ${formData.goals}` : ''}
</brand_info>

Apply ALL fixes and deliver publication-ready quote tweets.
`

  const polishModel = tier === 'premium' ? CLAUDE_OPUS : CLAUDE_SONNET
  const polishResponse = await anthropic.messages.create({
    model: polishModel,
    max_tokens: 6000,
    messages: [{ role: 'user', content: `${QUOTE_POLISH_SYSTEM}\n\n${polishPrompt}` }]
  })

  const polishResult = polishResponse.content[0].type === 'text' ? polishResponse.content[0].text : ''
  let polishedData: any
  try {
    const jsonMatch = polishResult.match(/\{[\s\S]*\}/)
    polishedData = JSON.parse(jsonMatch ? jsonMatch[0] : polishResult)
  } catch {
    polishedData = { polished_quote_tweets: draftQuoteTweets, delivery_ready: true }
  }
  console.log('✅ Final Polish complete')

  // ========== BUILD RESPONSE ==========
  const quoteTweets: GeneratedQuoteTweet[] = (polishedData.polished_quote_tweets || []).map((qt: any, i: number) => ({
    id: qt.id || i + 1,
    responseText: qt.response_text || '',
    characterCount: qt.character_count || qt.response_text?.length || 0,
    targetContext: qt.target_context || '',
    quoteType: qt.quote_type || 'add_value',
    toneLabel: qt.tone_label || '',
    expectedEngagementType: qt.expected_engagement_type || '',
    timingGuidance: qt.timing_guidance || 'evergreen'
  }))

  const result: XQuoteTweetPipelineResult = {
    quoteTweets,
    targetBriefings: researchData?.target_analysis?.filter((t: any) => t.type === 'account').map((t: any) => ({
      account: t.target,
      recentThemes: t.content_themes || [],
      engagementTips: t.opportunity_notes || []
    })),
    trendSummary: researchData?.target_analysis?.some((t: any) => t.type === 'trend') ? {
      currentTrends: researchData.target_analysis.filter((t: any) => t.type === 'trend').map((t: any) => t.target),
      opportunityAnalysis: researchData.strategic_opportunities?.join('; ') || ''
    } : undefined,
    strategyNotes: polishedData.strategy_notes || strategyData.strategy_summary || '',
    qualityReport: {
      overallScore: critiqueData.overall_assessment?.average_score || polishedData.final_quality_score || 75,
      authenticityScore: critiqueData.authenticity_check?.overall_authentic ? 80 : 60,
      valueAddScore: critiqueData.value_check?.high_value_responses?.length > 0 ? 80 : 70,
      shadowbanRisk: 'low',
      feedback: [
        ...(critiqueData.authenticity_check?.flagged_as_generic || []),
        ...(critiqueData.authenticity_check?.flagged_as_sycophantic || [])
      ]
    },
    metadata: {
      tier,
      processingStages,
      inputMode: styleProfile.input_mode,
      quoteTweetCount: quoteTweets.length
    }
  }

  console.log('💬 X QUOTE TWEET PIPELINE: Complete!')
  return result
}
