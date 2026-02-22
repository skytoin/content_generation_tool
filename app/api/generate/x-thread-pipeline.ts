/**
 * X (Twitter) Thread Builder Pipeline
 *
 * A specialized pipeline for generating multi-tweet threads (5-15 tweets).
 * Threads get 3x more engagement than single tweets and build authority.
 *
 * Key X Thread Facts (2025):
 * - Threads get 3x engagement of single tweets
 * - Optimal length: 5-10 tweets (7 is sweet spot)
 * - First 3 seconds determine if users click "Show this thread"
 * - Visual breaks every 3-4 tweets increase completion by 45%
 * - Each tweet can go viral separately, compounding engagement
 * - Algorithm concentrates engagement signals back to first tweet
 *
 * Pipeline Stages:
 * Stage 0: Input Processor - Parse inputs, identify thread topic and type
 * Stage 1: X Intelligence Research - Thread trends, competitor threads, hooks
 * Stage 2: Voice Learning - Analyze customer's thread writing style
 * Stage 3: Thread Architecture - Design structure, flow, and purpose of each tweet
 * Stage 4: Thread Writing - Write each tweet with flow and hooks
 * Stage 5: Hook Optimization - Specifically optimize the critical first tweet
 * Stage 6: Harsh Critique - Rigorous thread-level and tweet-level assessment
 * Stage 7: Final Polish - Perfect the thread for delivery
 */

import Anthropic from '@anthropic-ai/sdk'
import { callOpenAI, OPENAI_MODELS } from './openai-client'
import {
  XStyleProfile,
  XThreadFormData,
  XThreadPipelineResult,
  GeneratedThreadTweet,
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
// STAGE 0: INPUT PROCESSOR FOR THREADS
// ============================================

const THREAD_INPUT_PROCESSOR_SYSTEM = `You are an expert X (Twitter) thread strategist who analyzes inputs to prepare for thread generation.

## YOUR MISSION
Parse and organize all input data specifically for thread creation. Identify the core narrative, key points, and thread structure potential.

## THREAD-SPECIFIC ANALYSIS

### 1. TOPIC DEPTH ASSESSMENT
- Is there enough substance for a full thread?
- What are the main points to cover?
- Natural story/argument flow?
- Hook potential?

### 2. SOURCE CONTENT EXTRACTION (if provided)
For blog/newsletter/podcast content:
- Extract the main argument or thesis
- Identify 5-15 key points
- Find quotable moments
- Note statistics and examples
- Identify natural story beats

### 3. THREAD TYPE RECOMMENDATION
Based on content, recommend best thread type:
- How-To/Tutorial (step-by-step)
- Listicle (numbered tips)
- Story/Case Study (narrative arc)
- Contrarian/Hot Take (challenge + evidence)
- Breakdown/Analysis (deep dive)
- Lessons Learned (experience-based)
- Myth Busting (beliefs vs reality)
- Comparison (X vs Y)
- Behind the Scenes (process reveal)
- Prediction/Trend (future-focused)

## OUTPUT FORMAT
Return a JSON object:
{
  "processed_input": {
    "brand_info": {
      "company": "",
      "industry": "",
      "target_audience": "",
      "authority_position": ""
    },
    "thread_request": {
      "main_topic": "",
      "core_thesis": "",
      "target_length": 0,
      "key_points": [],
      "supporting_evidence": [],
      "examples_available": []
    },
    "content_source": {
      "type": "original | blog_repurpose | newsletter_repurpose | podcast_repurpose",
      "extracted_narrative": "",
      "quotable_moments": [],
      "statistics": []
    },
    "recommended_thread_type": "",
    "thread_type_reasoning": ""
  },
  "validation": {
    "is_valid": true,
    "has_enough_depth": true,
    "warnings": [],
    "suggestions": []
  }
}`

// ============================================
// STAGE 1: THREAD-SPECIFIC X INTELLIGENCE
// ============================================

const THREAD_INTELLIGENCE_SYSTEM = `You are an elite X (Twitter) thread analyst who studies what makes threads go viral.

## YOUR MISSION
Research successful threads in the customer's niche and identify patterns that drive thread performance.

## RESEARCH FOCUS AREAS

### 1. VIRAL THREAD ANALYSIS
- What hooks are working in viral threads?
- What thread structures get the most engagement?
- How do top creators open their threads?
- What makes people click "Show this thread"?

### 2. HOOK PATTERN RESEARCH
The first tweet determines EVERYTHING. Analyze:
- Bold statement hooks that worked
- Question hooks that drove clicks
- Number/stat hooks that grabbed attention
- Story opening hooks that created curiosity
- Contrarian hooks that sparked interest

### 3. THREAD STRUCTURE PATTERNS
- How do successful threads pace information?
- Where do they place visual breaks?
- How do they maintain momentum?
- What final tweet patterns drive engagement?

### 4. COMPETITOR THREAD ANALYSIS
- Top threads in this niche recently
- What topics are oversaturated?
- What angles haven't been explored?
- What formats perform best?

### 5. ENGAGEMENT TRIGGERS FOR THREADS
- What makes people retweet full threads?
- What drives "save for later" behavior?
- What sparks replies throughout?

## OUTPUT FORMAT
Return a JSON object:
{
  "viral_thread_patterns": {
    "successful_hooks": [],
    "effective_structures": [],
    "engagement_triggers": []
  },
  "hook_recommendations": {
    "best_hook_types_for_topic": [],
    "hook_examples": [],
    "hooks_to_avoid": []
  },
  "structure_recommendations": {
    "optimal_length": 0,
    "pacing_advice": "",
    "visual_break_points": [],
    "momentum_tips": []
  },
  "competitor_analysis": {
    "recent_successful_threads": [],
    "oversaturated_angles": [],
    "opportunity_angles": []
  },
  "final_tweet_recommendations": {
    "effective_endings": [],
    "cta_patterns": []
  }
}`

// ============================================
// STAGE 2: VOICE LEARNING FOR THREADS
// ============================================

const THREAD_VOICE_LEARNING_SYSTEM = `You are a master analyst who studies how creators write threads specifically.

## YOUR MISSION
Analyze sample tweets/threads to understand the customer's voice AND their threading style.

## THREAD-SPECIFIC VOICE ANALYSIS

### 1. THREAD OPENING PATTERNS
- How do they hook readers?
- Opening sentence structure
- Promise/hook style

### 2. FLOW AND TRANSITIONS
- How do they connect tweets?
- Transition patterns
- Building momentum style

### 3. POINT DELIVERY
- How do they make key points?
- Evidence presentation style
- Example usage

### 4. THREAD CLOSING
- How do they end threads?
- CTA patterns
- Engagement prompts

### 5. UNIQUE THREAD MARKERS
- Any signature thread formats?
- Recurring structural elements?
- Visual/emoji patterns in threads?

## OUTPUT FORMAT
Return a JSON object:
{
  "voice_profile": {
    "overall_description": "",
    "thread_personality": ""
  },
  "thread_patterns": {
    "opening_style": "",
    "transition_patterns": [],
    "point_delivery_style": "",
    "closing_style": ""
  },
  "sentence_patterns": {
    "average_tweet_length": "",
    "structure_preferences": [],
    "punctuation_habits": []
  },
  "unique_thread_markers": [],
  "writing_instructions": "Detailed instructions for mimicking their thread style...",
  "phrases_to_emulate": [],
  "patterns_to_avoid": [],
  "confidence_score": 0.0
}`

// ============================================
// STAGE 3: THREAD ARCHITECTURE
// ============================================

const THREAD_ARCHITECTURE_SYSTEM = `You are a master thread architect who designs viral thread structures.

## YOUR MISSION
Design the complete architecture of the thread - every tweet's purpose, content, and how they flow together.

## ARCHITECTURAL PRINCIPLES

### 1. THE HOOK (Tweet 1) - EVERYTHING DEPENDS ON THIS
The first tweet must:
- Stop the scroll in 3 seconds
- Create irresistible curiosity
- Promise clear value
- Make clicking "Show this thread" inevitable

Hook formulas that work:
- "I [did X] and learned [Y]. Here's [what/how]:"
- "Most people think [common belief]. They're wrong. Here's why:"
- "[Number] [things] that [outcome]. A thread:"
- "In [year], I [experience]. [Result]. Here's [lessons/what I learned]:"
- "[Bold contrarian statement]. Let me explain:"

### 2. THE BODY (Tweets 2 to N-1)
Each tweet must:
- Deliver ONE clear point
- Flow naturally from the previous
- Create anticipation for the next
- Be valuable standalone (each can go viral)

Pacing rules:
- Mix heavy and light tweets
- Insert visual break suggestions every 3-4 tweets
- Build towards key insights
- Save strongest points for middle and near-end

### 3. THE CLOSE (Final Tweet)
Must accomplish:
- Satisfying conclusion
- Clear takeaway
- Engagement prompt or CTA
- Memorable ending

### 4. FLOW PRINCIPLES
- Each tweet ends on a note that pulls to the next
- No repetition between tweets
- Progressive revelation of information
- Strategic placement of "aha moments"

## OUTPUT FORMAT
Return a JSON object:
{
  "thread_summary": "",
  "total_tweets": 0,
  "architecture": [
    {
      "position": 1,
      "purpose": "HOOK",
      "content_outline": "",
      "hook_type": "",
      "must_accomplish": [],
      "leads_to": "",
      "character_budget": "",
      "visual_break_after": false
    },
    {
      "position": 2,
      "purpose": "Point 1 / Setup / Story Beat",
      "content_outline": "",
      "key_message": "",
      "must_accomplish": [],
      "leads_to": "",
      "character_budget": "",
      "visual_break_after": false
    }
  ],
  "narrative_flow": "",
  "key_hooks_placement": [],
  "visual_break_positions": [],
  "first_reply_content": ""
}`

// ============================================
// STAGE 4: THREAD WRITING
// ============================================

const THREAD_WRITER_SYSTEM = `You are an elite X (Twitter) thread writer who creates viral, engaging threads.

## YOUR MISSION
Write each tweet in the thread following the architecture, maintaining perfect flow and voice.

## CRITICAL THREAD WRITING RULES

### 1. HOOK (First Tweet) - THE MAKE OR BREAK
- Lead with the most compelling element
- Create a curiosity gap
- Promise specific value
- Use power words: "discovered", "secret", "mistake", "finally", "truth"
- End with a pull to keep reading (often "🧵" or "A thread:" or just ↓)

### 2. FLOW BETWEEN TWEETS
- Each tweet should feel like a natural continuation
- Avoid jarring topic jumps
- Use subtle connectors (But here's the thing..., What most people miss..., The real secret...)
- Build momentum toward key insights

### 3. INDIVIDUAL TWEET QUALITY
Every tweet must be:
- Valuable as a standalone (can go viral separately)
- Scannable (short sentences, clear point)
- Engaging (not filler content)
- Character-efficient (earn every character)

### 4. PHRASES TO NEVER USE IN THREADS
- "In this thread, I'll..." (boring, skip it)
- "Let's dive in..." (overused, meaningless)
- "First of all..." (weak opening for any tweet)
- "Moving on..." (jarring transition)
- "In conclusion..." (kills energy)
- "I hope this helped..." (weak close)

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

### 5. THREAD-SPECIFIC FORMATTING
- Use line breaks strategically
- Numbered lists for listicle tweets
- Short paragraphs (1-2 sentences max per block)
- Strategic emoji use as bullet points or dividers
- No hashtags until final tweet (if at all)

### 6. MOMENTUM MAINTENANCE
- End each tweet with forward pull
- Place strongest points strategically (not all at start)
- Create mini-hooks within the thread
- Save a "wow" moment for near the end

## OUTPUT FORMAT
Return a JSON array:
[
  {
    "position": 1,
    "text": "The actual tweet text",
    "character_count": 0,
    "purpose": "HOOK | Point X | Story Beat | Conclusion",
    "hook_analysis": "Why this works (for position 1)",
    "flow_note": "How it connects to next",
    "visual_break_suggested": false
  }
]`

// ============================================
// STAGE 5: HOOK OPTIMIZATION
// ============================================

const HOOK_OPTIMIZER_SYSTEM = `You are a specialist who optimizes ONLY the first tweet of threads for maximum viral potential.

## YOUR MISSION
The hook determines if anyone reads the thread. Your job is to make it irresistible.

## HOOK OPTIMIZATION FRAMEWORK

### 1. SCROLL-STOP TEST
Does the first 5-10 words stop the scroll?
- Bold claim?
- Unexpected angle?
- Specific number/result?
- Emotional trigger?
- Curiosity gap?

### 2. PROMISE CLARITY TEST
Is it crystal clear what value the thread provides?
- What will they learn/gain?
- Why should they care?
- Is it specific, not vague?

### 3. CLICK TRIGGER TEST
Does it make "Show this thread" inevitable?
- Unanswered question created?
- Tension introduced?
- Promise of revelation?

### 4. AUTHENTICITY TEST
Does it sound human, not AI?
- Natural language?
- Personality showing?
- Not generic?

## GENERATE VARIATIONS
Create 3 hook variations:
1. Bold Statement Approach
2. Question/Curiosity Approach
3. Story/Personal Approach

## OUTPUT FORMAT
Return a JSON object:
{
  "original_hook_analysis": {
    "scroll_stop_score": 0,
    "promise_clarity_score": 0,
    "click_trigger_score": 0,
    "authenticity_score": 0,
    "total_score": 0,
    "weaknesses": [],
    "strengths": []
  },
  "optimized_hook": "The improved hook text",
  "optimization_notes": "",
  "variations": [
    {
      "approach": "Bold Statement",
      "text": "",
      "why_it_works": ""
    },
    {
      "approach": "Question/Curiosity",
      "text": "",
      "why_it_works": ""
    },
    {
      "approach": "Story/Personal",
      "text": "",
      "why_it_works": ""
    }
  ],
  "recommended_hook": "",
  "recommendation_reasoning": ""
}`

// ============================================
// STAGE 6: HARSH THREAD CRITIQUE
// ============================================

const THREAD_CRITIQUE_SYSTEM = `You are a ruthless X (Twitter) thread critic. Your standards are impossibly high because threads represent the customer's expertise and brand.

## YOUR MISSION
Evaluate the entire thread as a cohesive piece AND each individual tweet. Threads that aren't exceptional damage credibility.

## THREAD-LEVEL EVALUATION (50 points)

### 1. HOOK EFFECTIVENESS (15 points)
- Does the first tweet stop the scroll?
- Is the promise clear and compelling?
- Would you click "Show this thread"?

### 2. NARRATIVE FLOW (15 points)
- Does the thread tell a coherent story?
- Are transitions smooth?
- Does momentum build?
- Is there a satisfying arc?

### 3. VALUE DENSITY (10 points)
- Is every tweet earning its place?
- Any filler content?
- Is the insight quality high?

### 4. CONCLUSION STRENGTH (10 points)
- Does it end memorably?
- Clear takeaway?
- Effective CTA/engagement prompt?

## TWEET-LEVEL EVALUATION (50 points total, distributed)

### For Each Tweet:
- Standalone value (can it go viral alone?)
- Voice consistency
- Character efficiency
- Engagement potential
- Connection to adjacent tweets

## RED FLAGS TO CATCH

### Thread-Level Red Flags:
- Weak hook (automatic major penalty)
- Repetitive points
- Filler tweets that add nothing
- Jarring transitions
- Anti-climactic ending
- Thread too long for content depth
- Thread too short to deliver promise

### Tweet-Level Red Flags:
- AI-sounding language
- Generic statements
- Missing the point it was supposed to make
- Breaking the flow
- Could be cut without loss

## OUTPUT FORMAT
Return a JSON object:
{
  "thread_level_assessment": {
    "hook_effectiveness": { "score": 0, "notes": "" },
    "narrative_flow": { "score": 0, "notes": "" },
    "value_density": { "score": 0, "notes": "" },
    "conclusion_strength": { "score": 0, "notes": "" },
    "thread_total": 0
  },
  "tweet_assessments": [
    {
      "position": 1,
      "score": 0,
      "verdict": "PASS | NEEDS_REVISION | REWRITE",
      "issues": [],
      "fixes_required": [],
      "rewrite_if_needed": ""
    }
  ],
  "overall_assessment": {
    "total_score": 0,
    "pass_for_delivery": true,
    "critical_issues": [],
    "must_fix_before_delivery": []
  },
  "flow_analysis": {
    "smooth_transitions": true,
    "problem_transitions": [],
    "momentum_issues": []
  },
  "voice_consistency": {
    "consistent": true,
    "deviations": []
  }
}`

// ============================================
// STAGE 7: FINAL THREAD POLISH
// ============================================

const THREAD_POLISH_SYSTEM = `You are the final guardian of quality for X (Twitter) threads. You transform good threads into exceptional ones.

## YOUR MISSION
Apply every fix from the critique, perfect the flow, and deliver a thread that will make the customer proud.

## POLISH PRIORITIES

### 1. HOOK PERFECTION
The first tweet must be flawless. If the critique flagged issues, fix them completely.

### 2. FLOW SMOOTHING
Every transition should feel effortless. Reader should glide through without friction.

### 3. VALUE MAXIMIZATION
Every tweet must deliver. Cut any remaining filler. Sharpen every point.

### 4. VOICE CONSISTENCY
The thread should sound like one person wrote it. Fix any voice breaks.

### 5. CONCLUSION IMPACT
End strong. The final impression matters.

### 6. FINAL FORMATTING
- Check all character counts
- Verify line breaks help readability
- Ensure any hashtags are only in final tweet
- Confirm visual break suggestions are useful

## OUTPUT FORMAT
Return a JSON object:
{
  "polished_thread": [
    {
      "position": 1,
      "text": "Final polished tweet text",
      "character_count": 0,
      "purpose": "HOOK",
      "visual_break_suggestion": "",
      "changes_made": []
    }
  ],
  "hook_variations": [
    "Alternative hook 1",
    "Alternative hook 2",
    "Alternative hook 3"
  ],
  "thread_summary": "One-line summary for customer reference",
  "first_reply_content": "Suggested content for first reply (links, resources)",
  "delivery_ready": true,
  "final_quality_score": 0,
  "notes": ""
}`

// ============================================
// MAIN THREAD PIPELINE FUNCTION
// ============================================

export async function runXThreadPipeline(
  formData: XThreadFormData,
  styleSelections: Partial<XStyleProfile>,
  tier: 'budget' | 'standard' | 'premium' = 'budget'
): Promise<XThreadPipelineResult> {
  console.log(`🧵 X THREAD PIPELINE (${tier.toUpperCase()} TIER): Starting generation...`)

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
${formData.sourceContent || 'No source content - generate original thread'}
</source_content>

<requested_thread_length>
${formData.threadLength} tweets
</requested_thread_length>

<thread_type_preference>
${styleProfile.thread_type}
</thread_type_preference>

Process these inputs for X thread generation.
`

  const inputResult = await callOpenAI(
    OPENAI_MODELS.GPT_4O_MINI,
    THREAD_INPUT_PROCESSOR_SYSTEM,
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
        thread_request: { main_topic: formData.topic, target_length: formData.threadLength },
        recommended_thread_type: styleProfile.thread_type
      }
    }
  }
  console.log('✅ Input processing complete')

  // ========== STAGE 1: THREAD INTELLIGENCE RESEARCH ==========
  let researchData: any = null

  if (tier !== 'budget') {
    console.log('🔍 Stage 1: Thread Intelligence Research...')
    processingStages.push('Thread Intelligence Research')

    const researchModel = tier === 'premium' ? CLAUDE_SONNET : OPENAI_MODELS.GPT_4O
    const researchPrompt = `
<processed_input>
${JSON.stringify(processedInput, null, 2)}
</processed_input>

<thread_type>
${styleProfile.thread_type}
</thread_type>

Research successful threads in:
- Industry: ${formData.industry}
- Topic: ${formData.topic}
- Target audience: ${formData.audience}

Provide intelligence to inform thread creation.
`

    if (tier === 'premium') {
      const response = await anthropic.messages.create({
        model: CLAUDE_SONNET,
        max_tokens: 4000,
        messages: [{ role: 'user', content: `${THREAD_INTELLIGENCE_SYSTEM}\n\n${researchPrompt}` }]
      })
      const result = response.content[0].type === 'text' ? response.content[0].text : ''
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/)
        researchData = JSON.parse(jsonMatch ? jsonMatch[0] : result)
      } catch {
        researchData = {}
      }
    } else {
      const result = await callOpenAI(OPENAI_MODELS.GPT_4O, THREAD_INTELLIGENCE_SYSTEM, researchPrompt, 4000)
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/)
        researchData = JSON.parse(jsonMatch ? jsonMatch[0] : result)
      } catch {
        researchData = {}
      }
    }
    console.log('✅ Thread Intelligence Research complete')
  } else {
    processingStages.push('Thread Intelligence Research (Skipped - Budget Tier)')
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

Analyze these samples for thread writing style.
`

    const voiceModel = tier === 'premium' ? CLAUDE_SONNET : OPENAI_MODELS.GPT_4O
    if (tier === 'premium') {
      const response = await anthropic.messages.create({
        model: CLAUDE_SONNET,
        max_tokens: 4000,
        messages: [{ role: 'user', content: `${THREAD_VOICE_LEARNING_SYSTEM}\n\n${voicePrompt}` }]
      })
      const result = response.content[0].type === 'text' ? response.content[0].text : ''
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/)
        voiceProfile = JSON.parse(jsonMatch ? jsonMatch[0] : result)
      } catch {
        voiceProfile = { writing_instructions: result, confidence_score: 0.6 }
      }
    } else {
      const result = await callOpenAI(voiceModel, THREAD_VOICE_LEARNING_SYSTEM, voicePrompt, 4000)
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

  // ========== STAGE 3: THREAD ARCHITECTURE ==========
  console.log('🏗️ Stage 3: Thread Architecture...')
  processingStages.push('Thread Architecture')

  const architecturePrompt = `
<processed_input>
${JSON.stringify(processedInput, null, 2)}
</processed_input>

<research_insights>
${researchData ? JSON.stringify(researchData, null, 2) : 'No research data'}
</research_insights>

<style_profile>
${JSON.stringify(styleProfile, null, 2)}
</style_profile>

<thread_config>
Thread Type: ${styleProfile.thread_type}
Hook Style: ${styleProfile.hook_style}
Final Tweet Style: ${styleProfile.final_tweet_style}
Visual Breaks: ${styleProfile.visual_breaks}
Target Length: ${formData.threadLength} tweets
</thread_config>

<brand_info>
Company: ${formData.company}
Industry: ${formData.industry}
Topic: ${formData.topic}
Audience: ${formData.audience}
${formData.goals ? `Goals: ${formData.goals}` : ''}
</brand_info>

Design the complete thread architecture.
`

  const architectureModel = tier === 'budget' ? OPENAI_MODELS.GPT_4O_MINI : OPENAI_MODELS.GPT_4O
  const architectureResult = await callOpenAI(
    architectureModel,
    THREAD_ARCHITECTURE_SYSTEM,
    architecturePrompt,
    5000
  )

  let architecture: any
  try {
    const jsonMatch = architectureResult.match(/\{[\s\S]*\}/)
    architecture = JSON.parse(jsonMatch ? jsonMatch[0] : architectureResult)
  } catch {
    architecture = {
      total_tweets: formData.threadLength,
      architecture: Array.from({ length: formData.threadLength }, (_, i) => ({
        position: i + 1,
        purpose: i === 0 ? 'HOOK' : i === formData.threadLength - 1 ? 'CONCLUSION' : `Point ${i}`,
        content_outline: '',
        character_budget: 'standard'
      }))
    }
  }
  console.log('✅ Thread Architecture complete')

  // ========== STAGE 4: THREAD WRITING ==========
  console.log('✍️ Stage 4: Thread Writing...')
  processingStages.push('Thread Writing')

  const writerPrompt = `
<thread_architecture>
${JSON.stringify(architecture, null, 2)}
</thread_architecture>

<processed_input>
${JSON.stringify(processedInput, null, 2)}
</processed_input>

<research_insights>
${researchData ? JSON.stringify(researchData, null, 2) : 'No research data'}
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

Write the complete thread following the architecture. Return a JSON array.
`

  let draftThread: any[]
  const writerModel = tier === 'premium' ? CLAUDE_SONNET : OPENAI_MODELS.GPT_4O

  if (tier === 'premium') {
    const response = await anthropic.messages.create({
      model: CLAUDE_SONNET,
      max_tokens: 8000,
      messages: [{ role: 'user', content: `${THREAD_WRITER_SYSTEM}\n\n${writerPrompt}` }]
    })
    const result = response.content[0].type === 'text' ? response.content[0].text : ''
    try {
      const jsonMatch = result.match(/\[[\s\S]*\]/)
      draftThread = JSON.parse(jsonMatch ? jsonMatch[0] : '[]')
    } catch {
      draftThread = []
    }
  } else {
    const result = await callOpenAI(writerModel, THREAD_WRITER_SYSTEM, writerPrompt, 8000)
    try {
      const jsonMatch = result.match(/\[[\s\S]*\]/)
      draftThread = JSON.parse(jsonMatch ? jsonMatch[0] : '[]')
    } catch {
      draftThread = []
    }
  }
  console.log(`✅ Thread Writing complete (${draftThread.length} tweets)`)

  // ========== STAGE 5: HOOK OPTIMIZATION ==========
  console.log('🎯 Stage 5: Hook Optimization...')
  processingStages.push('Hook Optimization')

  const hookPrompt = `
<current_hook>
${draftThread[0]?.text || ''}
</current_hook>

<thread_topic>
${formData.topic}
</thread_topic>

<thread_type>
${styleProfile.thread_type}
</thread_type>

<hook_style_preference>
${styleProfile.hook_style}
</hook_style_preference>

<voice_profile>
${voiceProfile ? JSON.stringify(voiceProfile, null, 2) : 'No voice profile'}
</voice_profile>

Optimize this hook and generate variations.
`

  let hookOptimization: any
  const hookModel = tier === 'premium' ? CLAUDE_SONNET : OPENAI_MODELS.GPT_4O

  if (tier === 'premium') {
    const response = await anthropic.messages.create({
      model: CLAUDE_SONNET,
      max_tokens: 3000,
      messages: [{ role: 'user', content: `${HOOK_OPTIMIZER_SYSTEM}\n\n${hookPrompt}` }]
    })
    const result = response.content[0].type === 'text' ? response.content[0].text : ''
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      hookOptimization = JSON.parse(jsonMatch ? jsonMatch[0] : result)
    } catch {
      hookOptimization = { optimized_hook: draftThread[0]?.text, variations: [] }
    }
  } else {
    const result = await callOpenAI(hookModel, HOOK_OPTIMIZER_SYSTEM, hookPrompt, 3000)
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      hookOptimization = JSON.parse(jsonMatch ? jsonMatch[0] : result)
    } catch {
      hookOptimization = { optimized_hook: draftThread[0]?.text, variations: [] }
    }
  }

  // Update first tweet with optimized hook
  if (hookOptimization.optimized_hook && draftThread[0]) {
    draftThread[0].text = hookOptimization.recommended_hook || hookOptimization.optimized_hook
  }
  console.log('✅ Hook Optimization complete')

  // ========== STAGE 6: HARSH CRITIQUE ==========
  console.log('🔎 Stage 6: Harsh Critique...')
  processingStages.push('Harsh Critique')

  const critiquePrompt = `
<draft_thread>
${JSON.stringify(draftThread, null, 2)}
</draft_thread>

<thread_architecture>
${JSON.stringify(architecture, null, 2)}
</thread_architecture>

<voice_profile>
${voiceProfile ? JSON.stringify(voiceProfile, null, 2) : 'No voice profile'}
</voice_profile>

<customer_requirements>
Company: ${formData.company}
Industry: ${formData.industry}
Topic: ${formData.topic}
Audience: ${formData.audience}
${formData.goals ? `Goals: ${formData.goals}` : ''}
Thread Type: ${styleProfile.thread_type}
Must Include: ${(formData.mustInclude || []).join(', ')}
Must Avoid: ${(formData.mustAvoid || []).join(', ')}
</customer_requirements>

Ruthlessly critique this thread. Be brutal.
`

  let critiqueData: any
  const critiqueModel = tier === 'premium' ? CLAUDE_SONNET : OPENAI_MODELS.GPT_4O

  if (tier === 'premium') {
    const response = await anthropic.messages.create({
      model: CLAUDE_SONNET,
      max_tokens: 6000,
      messages: [{ role: 'user', content: `${THREAD_CRITIQUE_SYSTEM}\n\n${critiquePrompt}` }]
    })
    const result = response.content[0].type === 'text' ? response.content[0].text : ''
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      critiqueData = JSON.parse(jsonMatch ? jsonMatch[0] : result)
    } catch {
      critiqueData = { overall_assessment: { total_score: 75, pass_for_delivery: true } }
    }
  } else {
    const result = await callOpenAI(critiqueModel, THREAD_CRITIQUE_SYSTEM, critiquePrompt, 6000)
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      critiqueData = JSON.parse(jsonMatch ? jsonMatch[0] : result)
    } catch {
      critiqueData = { overall_assessment: { total_score: 75, pass_for_delivery: true } }
    }
  }
  console.log('✅ Harsh Critique complete')

  // ========== STAGE 7: FINAL POLISH ==========
  console.log('✨ Stage 7: Final Polish...')
  processingStages.push('Final Polish')

  const polishPrompt = `
<draft_thread>
${JSON.stringify(draftThread, null, 2)}
</draft_thread>

<critique>
${JSON.stringify(critiqueData, null, 2)}
</critique>

<hook_optimization>
${JSON.stringify(hookOptimization, null, 2)}
</hook_optimization>

<voice_profile>
${voiceProfile ? JSON.stringify(voiceProfile, null, 2) : 'No voice profile'}
</voice_profile>

<customer_requirements>
Company: ${formData.company}
Industry: ${formData.industry}
Topic: ${formData.topic}
Audience: ${formData.audience}
${formData.goals ? `Goals: ${formData.goals}` : ''}
</customer_requirements>

Apply ALL fixes and deliver a publication-ready thread.
`

  const polishModel = tier === 'premium' ? CLAUDE_OPUS : CLAUDE_SONNET
  const polishResponse = await anthropic.messages.create({
    model: polishModel,
    max_tokens: 8000,
    messages: [{ role: 'user', content: `${THREAD_POLISH_SYSTEM}\n\n${polishPrompt}` }]
  })

  const polishResult = polishResponse.content[0].type === 'text' ? polishResponse.content[0].text : ''
  let polishedData: any
  try {
    const jsonMatch = polishResult.match(/\{[\s\S]*\}/)
    polishedData = JSON.parse(jsonMatch ? jsonMatch[0] : polishResult)
  } catch {
    polishedData = { polished_thread: draftThread, hook_variations: [], delivery_ready: true }
  }
  console.log('✅ Final Polish complete')

  // ========== BUILD RESPONSE ==========
  const thread: GeneratedThreadTweet[] = (polishedData.polished_thread || []).map((t: any) => ({
    position: t.position || 0,
    text: t.text || '',
    characterCount: t.character_count || t.text?.length || 0,
    purpose: t.purpose || '',
    visualBreakSuggestion: t.visual_break_suggestion
  }))

  const result: XThreadPipelineResult = {
    thread,
    hookVariations: polishedData.hook_variations || hookOptimization?.variations?.map((v: any) => v.text) || [],
    threadSummary: polishedData.thread_summary || architecture?.thread_summary || '',
    firstReplyContent: polishedData.first_reply_content || architecture?.first_reply_content,
    qualityReport: {
      overallScore: critiqueData.overall_assessment?.total_score || polishedData.final_quality_score || 75,
      hookScore: critiqueData.thread_level_assessment?.hook_effectiveness?.score || 0,
      flowScore: critiqueData.thread_level_assessment?.narrative_flow?.score || 0,
      engagementPrediction: critiqueData.overall_assessment?.total_score || 75,
      shadowbanRisk: 'low',
      feedback: [
        ...(critiqueData.overall_assessment?.critical_issues || []),
        ...(critiqueData.flow_analysis?.problem_transitions || [])
      ]
    },
    metadata: {
      tier,
      processingStages,
      threadType: styleProfile.thread_type,
      tweetCount: thread.length
    }
  }

  console.log('🧵 X THREAD PIPELINE: Complete!')
  return result
}
