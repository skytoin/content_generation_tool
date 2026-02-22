import Anthropic from '@anthropic-ai/sdk'
import { callOpenAI, OPENAI_MODELS } from './openai-client'
import { defaultStyleProfile } from './options'

// Anthropic client for Standard tier (Sonnet in final stage)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Claude model for Standard tier final revision
const CLAUDE_SONNET = 'claude-sonnet-4-5-20250929'

// ============================================
// SHARED SYSTEM PROMPTS
// ============================================

const WRITER_SYSTEM = `You are an elite content writer who creates exceptional, human-like content that engages readers and achieves business objectives.

## CRITICAL: Write Like a Human, Not a Machine

To ensure content reads as authentically human-written:

### 1. SENTENCE VARIATION (Burstiness)
- Mix short punchy sentences with longer complex ones
- Never write more than 2 sentences of similar length in a row
- Include rhetorical questions occasionally — they add natural rhythm
- Vary paragraph lengths: some 1-2 sentences, others 4-5 sentences
- Use contractions naturally (it's, don't, can't, you're) — humans almost always contract
- Sentence fragments are fine. For rhythm. For emphasis.
- Limit em dashes to 1-2 per article max — AI overuses them as a crutch

### 2. WORD CHOICE (Perplexity)
- Avoid these overused AI transitions: "Furthermore", "Moreover", "In conclusion", "Additionally"
- Always prefer the simpler word: "use" not "utilize", "help" not "facilitate", "start" not "embark", "show" not "showcase"
- If a 12-year-old wouldn't say it in conversation, think twice
- Use unexpected but natural word combinations
- Include occasional colloquialisms appropriate to the style and audience

### 3. PHRASES TO NEVER USE
- "In today's fast-paced world..."
- "It's important to note that..."
- "In conclusion..." / "To summarize..."
- "Let's dive in..." / "Let's explore..."
- "When it comes to..."
- "At the end of the day..."
- "Here's the thing..."
- "First and foremost..."
- "In an era where..."
- "Serves as a testament..."
- "Paving the way for..."

### 4. WORDS TO NEVER USE (AI Vocabulary Tells)
Replace with simpler alternatives:
delve, tapestry, landscape (as metaphor), realm, leverage (as verb), utilize, harness,
unlock, unleash, embark, foster, facilitate, streamline, orchestrate, showcase,
elucidate, navigate (as metaphor), optimize, elevate, revolutionize, paradigm, synergy,
holistic, robust, seamless, cutting-edge, groundbreaking, transformative, unprecedented,
pivotal, plethora, myriad

EXCEPTIONS — these override the banned words list:
1. INDUSTRY TERMS: If a banned word is a genuine technical term for the customer's topic (e.g., "optimize" in SEO, "leverage" in finance), use it in its precise technical context — never as generic filler.
2. CUSTOMER-SPECIFIED WORDS: If the customer explicitly requests specific words (SEO keywords, brand terms, must-include vocabulary), the customer's preference always takes priority. Include those words naturally. Never avoid or replace words the customer asked for.

### 5. SHOW, DON'T TELL
- Replace "many experts agree" with a named expert or specific source
- Replace "in recent years" with an actual year
- Replace "studies show" with a specific study or stat
- Use specific numbers, names, and dates — never vague gestures at evidence

### 6. AUTHENTICITY MARKERS
- Include specific details that only someone knowledgeable would know
- Reference real examples, not generic hypotheticals
- Show genuine opinion where appropriate
- Acknowledge tradeoffs honestly — not everything is universally positive
- Never announce structure ("First, I'll discuss X, then Y")
- Skip broad "context-setting" openers — start with something specific
- Leave in small imperfections: an aside, a fragment, an unusual word choice`

const CRITIC_SYSTEM = `You are a merciless editor with extraordinarily high standards. Your role is to rigorously evaluate content against quality standards and style profile compliance.

## YOUR EVALUATION FRAMEWORK

### 1. Quality Checklist Audit
- Grade each checklist item as PASS or FAIL
- Provide specific evidence for failures

### 2. Style Profile Compliance
- Verify each style setting is correctly implemented
- Mark as COMPLIANT or VIOLATION with evidence

### 3. Standard Quality Assessment
- Specificity: facts, names, numbers vs vague claims
- AI detection: scan for banned AI vocabulary (delve, leverage, utilize, harness, unlock, unleash, foster, facilitate, streamline, orchestrate, showcase, elevate, revolutionize, paradigm, synergy, holistic, robust, seamless, cutting-edge, groundbreaking, transformative, unprecedented, pivotal, plethora, myriad) and banned phrase patterns. Also check for: missing contractions, overused em dashes, vague evidence ("studies show", "many experts agree"). Any banned word = automatic FAIL unless (1) it is a genuine industry technical term, or (2) the customer explicitly requested that word as an SEO keyword or must-include item

## OUTPUT FORMAT

## OVERALL SCORE: [X/10]

## QUALITY CHECKLIST AUDIT
[Each item: PASS or FAIL]

## STYLE PROFILE COMPLIANCE
[Each setting: COMPLIANT or VIOLATION with evidence]

## SPECIFIC REWRITE DEMANDS
[Exact changes required]

## VERDICT
[Pass for publication or needs revision?]`

const ADDITIONAL_INFO_PROCESSOR_SYSTEM = `You are an expert content strategist who analyzes customer-provided additional information.

Return a JSON object:
{
  "routing": {
    "research_agent": {
      "links_to_fetch": [],
      "facts_to_verify": [],
      "topics_to_research": [],
      "search_queries": []
    },
    "writer_agent": {
      "must_include": [],
      "must_avoid": [],
      "tone_examples": [],
      "keywords_required": [],
      "specific_requests": []
    },
    "critic_agent": {
      "additional_checks": [],
      "success_criteria": []
    },
    "all_agents": {
      "context": ""
    }
  },
  "style_implications": {
    "inferred_options": {},
    "reasoning": ""
  },
  "analysis_summary": ""
}`

const STYLE_INFERENCE_SYSTEM = `You are an expert content strategist who infers optimal style settings based on customer context.

Return a JSON object with the COMPLETE style profile (all options filled):
{
  "complete_style_profile": {
    // All style options with values
  },
  "inferences_made": {},
  "confidence_level": "high | medium | low",
  "summary": ""
}`

const STYLE_LEARNING_SYSTEM = `You are an expert writing style analyst. Analyze sample articles and extract unique writing style patterns.

Return a JSON object:
{
  "style_analysis": {
    "voice_profile": {},
    "sentence_patterns": {},
    "vocabulary_profile": {},
    "structural_preferences": {},
    "unique_fingerprints": {}
  },
  "writing_instructions": "detailed instructions for mimicking this style",
  "sample_phrases_to_emulate": [],
  "patterns_to_avoid": [],
  "confidence_score": 0.0-1.0
}`

const PROMPT_ENGINEER_SYSTEM = `You are an elite prompt engineer. Transform customer inputs and style profiles into perfectly optimized prompts.

Output must be JSON with: enhanced_brief, research_queries, research_prompt, writer_prompt, quality_checklist`

// ============================================
// BUDGET TIER PIPELINE
// Uses: GPT-4o mini (stages 0A, 0B/0C, 1, 2) + GPT-4o (stages 2.5, 3, 4, 5)
// 4 web searches
// ============================================

export async function runBudgetPipeline(
  serviceId: string,
  formData: any,
  styleSelections: any,
  additionalInfo: string,
  wordCountLimits: { min: number; max: number } = { min: 1500, max: 2500 }
): Promise<{ content: string }> {
  console.log('💰 BUDGET TIER: Starting content generation...')

  // ========== STAGE 0A: PROCESS ADDITIONAL INFO (GPT-4o mini) ==========
  console.log('📋 Stage 0A: Processing additional information (GPT-4o mini)...')
  let additionalInfoResult: any = {
    routing: {
      research_agent: { links_to_fetch: [], facts_to_verify: [], topics_to_research: [], search_queries: [] },
      writer_agent: { must_include: [], must_avoid: [], tone_examples: [], keywords_required: [], specific_requests: [] },
      critic_agent: { additional_checks: [], success_criteria: [] },
      all_agents: { context: '' }
    },
    style_implications: { inferred_options: {}, reasoning: 'No additional info provided' },
    analysis_summary: 'No additional information was provided.'
  }

  if (additionalInfo && additionalInfo.trim() !== '') {
    const result = await callOpenAI(
      OPENAI_MODELS.GPT_4O_MINI,
      ADDITIONAL_INFO_PROCESSOR_SYSTEM,
      `<customer_request>\n${JSON.stringify(formData, null, 2)}\n</customer_request>\n\n<additional_information>\n${additionalInfo}\n</additional_information>\n\nAnalyze and return the JSON routing object.`,
      3000
    )
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      additionalInfoResult = JSON.parse(jsonMatch ? jsonMatch[0] : result)
    } catch {}
  }
  console.log('✅ Additional info processed')

  // ========== STAGE 0B: INFER STYLE PROFILE (GPT-4o mini) ==========
  console.log('🎨 Stage 0B: Inferring style profile (GPT-4o mini)...')
  let completeStyleProfile = { ...defaultStyleProfile, ...styleSelections }

  const requiredKeys = Object.keys(defaultStyleProfile)
  const providedKeys = Object.keys(styleSelections || {})
  const allOptionsProvided = requiredKeys.every(key => providedKeys.includes(key))

  if (!allOptionsProvided) {
    const styleResult = await callOpenAI(
      OPENAI_MODELS.GPT_4O_MINI,
      STYLE_INFERENCE_SYSTEM,
      `<customer_request>\n${JSON.stringify(formData, null, 2)}\n</customer_request>\n<service_type>${serviceId}</service_type>\n<explicit_selections>\n${JSON.stringify(styleSelections || {}, null, 2)}\n</explicit_selections>\n<defaults>\n${JSON.stringify(defaultStyleProfile, null, 2)}\n</defaults>\n\nReturn complete style profile JSON.`,
      4000
    )
    try {
      const jsonMatch = styleResult.match(/\{[\s\S]*\}/)
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : styleResult)
      completeStyleProfile = parsed.complete_style_profile || completeStyleProfile
    } catch {}
  }
  console.log('✅ Style profile complete')

  // ========== STAGE 0C: LEARN FROM SAMPLES (GPT-4o mini) ==========
  console.log('📚 Stage 0C: Analyzing sample articles (GPT-4o mini)...')
  let styleLearningResult: any = {
    style_analysis: null,
    writing_instructions: '',
    sample_phrases_to_emulate: [],
    patterns_to_avoid: [],
    confidence_score: 0,
    analysis_summary: 'No sample articles provided.'
  }

  const sampleArticles = formData.sampleArticles || ''
  if (sampleArticles && sampleArticles.trim().length >= 200) {
    const learnResult = await callOpenAI(
      OPENAI_MODELS.GPT_4O_MINI,
      STYLE_LEARNING_SYSTEM,
      `<sample_content>\n${sampleArticles}\n</sample_content>\n\nAnalyze and return the JSON style analysis.`,
      4000
    )
    try {
      const jsonMatch = learnResult.match(/\{[\s\S]*\}/)
      styleLearningResult = JSON.parse(jsonMatch ? jsonMatch[0] : learnResult)
      styleLearningResult.analysis_summary = `Style analyzed. Confidence: ${Math.round((styleLearningResult.confidence_score || 0.7) * 100)}%`
    } catch {}
  }
  console.log('✅ Style learning complete')

  // ========== STAGE 1: PROMPT ENGINEER (GPT-4o mini) ==========
  console.log('🧠 Stage 1: Prompt Engineer (GPT-4o mini)...')
  const blogDescription = `a ${wordCountLimits.min.toLocaleString()}-${wordCountLimits.max.toLocaleString()} word SEO-optimized blog article`
  const serviceContext: Record<string, string> = {
    'blog-basic': blogDescription,
    'blog-premium': blogDescription,
    'blog-post': blogDescription,
    'social-pack': '30 social media posts (10 LinkedIn, 10 Twitter/X, 10 Instagram)',
    'email-sequence': 'a 5-email nurture/sales sequence',
    'seo-report': 'a comprehensive SEO audit with actionable recommendations',
    'content-bundle': 'a complete content package'
  }

  const peResult = await callOpenAI(
    OPENAI_MODELS.GPT_4O_MINI,
    PROMPT_ENGINEER_SYSTEM,
    `<task>Create optimized prompts for generating ${serviceContext[serviceId] || 'premium content'}.</task>\n<customer_input>\n${JSON.stringify(formData, null, 2)}\n</customer_input>\n<style_profile>\n${JSON.stringify(completeStyleProfile, null, 2)}\n</style_profile>\n<routing>\n${JSON.stringify(additionalInfoResult.routing, null, 2)}\n</routing>\n\nReturn JSON with: enhanced_brief, research_queries, research_prompt, writer_prompt, quality_checklist`,
    5000
  )

  let peData: any
  try {
    const jsonMatch = peResult.match(/\{[\s\S]*\}/)
    peData = JSON.parse(jsonMatch ? jsonMatch[0] : peResult)
  } catch {
    peData = {
      enhanced_brief: { target_audience_profile: formData.audience || 'Target audience', content_objectives: ['Inform', 'Engage'], tone_and_voice: completeStyleProfile.professional_level },
      research_queries: [`${formData.topic || formData.company} statistics 2025`, `${formData.topic || formData.industry} trends`],
      research_prompt: `Research: ${JSON.stringify(formData)}`,
      writer_prompt: `Write content for: ${JSON.stringify(formData)}`,
      quality_checklist: ['Matches specified tone', 'Uses correct structure', 'Includes specific examples']
    }
  }
  console.log('✅ Prompts optimized')

  // ========== STAGE 2: RESEARCH (GPT-4o mini - limited searches) ==========
  console.log('🔍 Stage 2: Research (GPT-4o mini)...')
  const allQueries = [
    ...(peData.research_queries || []),
    ...(additionalInfoResult?.routing?.research_agent?.search_queries || [])
  ].slice(0, 4) // Budget tier: max 4 queries

  const research = await callOpenAI(
    OPENAI_MODELS.GPT_4O_MINI,
    'You are a research analyst. Provide factual information based on your training data. Focus on statistics, examples, and expert insights.',
    `Research these topics:\n${allQueries.map((q: string, i: number) => `${i + 1}. ${q}`).join('\n')}\n\n${peData.research_prompt}\n\nProvide research findings organized by:\n## KEY STATISTICS\n## EXPERT INSIGHTS\n## REAL-WORLD EXAMPLES\n## SOURCE REFERENCES`,
    6000
  )
  console.log('✅ Research complete')

  // ========== STAGE 2.5: SUMMARIZE RESEARCH (GPT-4o) ==========
  console.log('📝 Stage 2.5: Summarizing research (GPT-4o)...')
  const researchSummary = await callOpenAI(
    OPENAI_MODELS.GPT_4O,
    'Create a comprehensive summary preserving ALL statistics, quotes, and examples.',
    `Summarize this research, keeping all specific data:\n\n${research}`,
    2500
  )
  console.log('✅ Research summary complete')

  // ========== STAGE 3: WRITING (GPT-4o) ==========
  console.log('✍️ Stage 3: Writer (GPT-4o)...')
  const writerRouting = additionalInfoResult?.routing?.writer_agent || {}
  const hasStyleLearning = styleLearningResult?.confidence_score > 0.3

  let writerPrompt = `<research>\n${research}\n</research>\n\n<brief>\n${JSON.stringify(peData.enhanced_brief, null, 2)}\n</brief>\n\n<style_profile>\n${JSON.stringify(completeStyleProfile, null, 2)}\n</style_profile>\n\n`

  if (hasStyleLearning) {
    writerPrompt += `<learned_style>\n${styleLearningResult.writing_instructions}\n</learned_style>\n\n`
  }

  if (writerRouting.must_include?.length > 0) {
    writerPrompt += `<must_include>\n${writerRouting.must_include.join('\n')}\n</must_include>\n\n`
  }

  writerPrompt += peData.writer_prompt

  const draft = await callOpenAI(
    OPENAI_MODELS.GPT_4O,
    WRITER_SYSTEM,
    writerPrompt,
    12000
  )
  console.log('✅ Draft complete')

  // ========== STAGE 4: CRITIQUE (GPT-4o) ==========
  console.log('🔎 Stage 4: Critic (GPT-4o)...')
  // Ensure quality_checklist is an array
  const qualityChecklist = Array.isArray(peData.quality_checklist)
    ? peData.quality_checklist
    : (typeof peData.quality_checklist === 'string' ? [peData.quality_checklist] : ['Matches specified tone', 'Uses correct structure', 'Includes specific examples'])
  const additionalChecks = Array.isArray(additionalInfoResult?.routing?.critic_agent?.additional_checks)
    ? additionalInfoResult.routing.critic_agent.additional_checks
    : []
  const allChecks = [...qualityChecklist, ...additionalChecks]

  const critique = await callOpenAI(
    OPENAI_MODELS.GPT_4O,
    CRITIC_SYSTEM,
    `<content>\n${draft}\n</content>\n\n<brief>\n${JSON.stringify(peData.enhanced_brief, null, 2)}\n</brief>\n\n<style_profile>\n${JSON.stringify(completeStyleProfile, null, 2)}\n</style_profile>\n\n<checklist>\n${allChecks.join('\n')}\n</checklist>\n\nEvaluate this content.`,
    6000
  )
  console.log('✅ Critique complete')

  // ========== STAGE 5: REVISION (GPT-4o) ==========
  console.log('✨ Stage 5: Revision (GPT-4o)...')
  const final = await callOpenAI(
    OPENAI_MODELS.GPT_4O,
    'You are a master editor who transforms good content into exceptional content.',
    `<current_content>\n${draft}\n</current_content>\n\n<feedback>\n${critique}\n</feedback>\n\n<research>\n${researchSummary}\n</research>\n\n<brief>\n${JSON.stringify(peData.enhanced_brief, null, 2)}\n</brief>\n\n<style_profile>\n${JSON.stringify(completeStyleProfile, null, 2)}\n</style_profile>\n\nRewrite to address ALL feedback. Provide ONLY the final polished content.`,
    12000
  )
  console.log('✅ Complete!')

  // ========== BUILD RESPONSE ==========
  const response = `${final}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 BUDGET TIER QUALITY REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 ADDITIONAL INFO ANALYSIS
${additionalInfoResult.analysis_summary}

📚 STYLE LEARNING
${styleLearningResult.analysis_summary}

🎨 STYLE PROFILE APPLIED
${JSON.stringify(completeStyleProfile, null, 2)}

🧠 CONTENT BRIEF
${JSON.stringify(peData.enhanced_brief, null, 2)}

🔎 QUALITY REVIEW
${critique}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Built with: GPT-4o mini (Research) + GPT-4o (Writing & Revision)
Budget Tier Pipeline
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

  return { content: response }
}

// ============================================
// STANDARD TIER PIPELINE
// Uses: GPT-4.1 nano (0A, 2.5) + GPT-4.1 (0B/0C, 1, 4) + GPT-4o (2, 3) + Sonnet (5)
// 7 web searches
// ============================================

export async function runStandardPipeline(
  serviceId: string,
  formData: any,
  styleSelections: any,
  additionalInfo: string,
  wordCountLimits: { min: number; max: number } = { min: 1500, max: 2500 }
): Promise<{ content: string }> {
  console.log('⭐ STANDARD TIER: Starting content generation...')

  // ========== STAGE 0A: PROCESS ADDITIONAL INFO (GPT-4.1 nano) ==========
  console.log('📋 Stage 0A: Processing additional information (GPT-4.1 nano)...')
  let additionalInfoResult: any = {
    routing: {
      research_agent: { links_to_fetch: [], facts_to_verify: [], topics_to_research: [], search_queries: [] },
      writer_agent: { must_include: [], must_avoid: [], tone_examples: [], keywords_required: [], specific_requests: [] },
      critic_agent: { additional_checks: [], success_criteria: [] },
      all_agents: { context: '' }
    },
    style_implications: { inferred_options: {}, reasoning: 'No additional info provided' },
    analysis_summary: 'No additional information was provided.'
  }

  if (additionalInfo && additionalInfo.trim() !== '') {
    const result = await callOpenAI(
      OPENAI_MODELS.GPT_4_1_NANO,
      ADDITIONAL_INFO_PROCESSOR_SYSTEM,
      `<customer_request>\n${JSON.stringify(formData, null, 2)}\n</customer_request>\n\n<additional_information>\n${additionalInfo}\n</additional_information>\n\nAnalyze and return the JSON routing object.`,
      3000
    )
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      additionalInfoResult = JSON.parse(jsonMatch ? jsonMatch[0] : result)
    } catch {}
  }
  console.log('✅ Additional info processed')

  // ========== STAGE 0B: INFER STYLE PROFILE (GPT-4.1) ==========
  console.log('🎨 Stage 0B: Inferring style profile (GPT-4.1)...')
  let completeStyleProfile = { ...defaultStyleProfile, ...styleSelections }

  const requiredKeys = Object.keys(defaultStyleProfile)
  const providedKeys = Object.keys(styleSelections || {})
  const allOptionsProvided = requiredKeys.every(key => providedKeys.includes(key))

  if (!allOptionsProvided) {
    const styleResult = await callOpenAI(
      OPENAI_MODELS.GPT_4_1,
      STYLE_INFERENCE_SYSTEM,
      `<customer_request>\n${JSON.stringify(formData, null, 2)}\n</customer_request>\n<service_type>${serviceId}</service_type>\n<explicit_selections>\n${JSON.stringify(styleSelections || {}, null, 2)}\n</explicit_selections>\n<defaults>\n${JSON.stringify(defaultStyleProfile, null, 2)}\n</defaults>\n\nReturn complete style profile JSON.`,
      4000
    )
    try {
      const jsonMatch = styleResult.match(/\{[\s\S]*\}/)
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : styleResult)
      completeStyleProfile = parsed.complete_style_profile || completeStyleProfile
    } catch {}
  }
  console.log('✅ Style profile complete')

  // ========== STAGE 0C: LEARN FROM SAMPLES (GPT-4.1) ==========
  console.log('📚 Stage 0C: Analyzing sample articles (GPT-4.1)...')
  let styleLearningResult: any = {
    style_analysis: null,
    writing_instructions: '',
    sample_phrases_to_emulate: [],
    patterns_to_avoid: [],
    confidence_score: 0,
    analysis_summary: 'No sample articles provided.'
  }

  const sampleArticles = formData.sampleArticles || ''
  if (sampleArticles && sampleArticles.trim().length >= 200) {
    const learnResult = await callOpenAI(
      OPENAI_MODELS.GPT_4_1,
      STYLE_LEARNING_SYSTEM,
      `<sample_content>\n${sampleArticles}\n</sample_content>\n\nAnalyze and return the JSON style analysis.`,
      4000
    )
    try {
      const jsonMatch = learnResult.match(/\{[\s\S]*\}/)
      styleLearningResult = JSON.parse(jsonMatch ? jsonMatch[0] : learnResult)
      styleLearningResult.analysis_summary = `Style analyzed. Confidence: ${Math.round((styleLearningResult.confidence_score || 0.7) * 100)}%`
    } catch {}
  }
  console.log('✅ Style learning complete')

  // ========== STAGE 1: PROMPT ENGINEER (GPT-4.1) ==========
  console.log('🧠 Stage 1: Prompt Engineer (GPT-4.1)...')
  const blogDescription = `a ${wordCountLimits.min.toLocaleString()}-${wordCountLimits.max.toLocaleString()} word SEO-optimized blog article`
  const serviceContext: Record<string, string> = {
    'blog-basic': blogDescription,
    'blog-premium': blogDescription,
    'blog-post': blogDescription,
    'social-pack': '30 social media posts (10 LinkedIn, 10 Twitter/X, 10 Instagram)',
    'email-sequence': 'a 5-email nurture/sales sequence',
    'seo-report': 'a comprehensive SEO audit with actionable recommendations',
    'content-bundle': 'a complete content package'
  }

  const peResult = await callOpenAI(
    OPENAI_MODELS.GPT_4_1,
    PROMPT_ENGINEER_SYSTEM,
    `<task>Create optimized prompts for generating ${serviceContext[serviceId] || 'premium content'}.</task>\n<customer_input>\n${JSON.stringify(formData, null, 2)}\n</customer_input>\n<style_profile>\n${JSON.stringify(completeStyleProfile, null, 2)}\n</style_profile>\n<routing>\n${JSON.stringify(additionalInfoResult.routing, null, 2)}\n</routing>\n\nReturn JSON with: enhanced_brief, research_queries, research_prompt, writer_prompt, quality_checklist`,
    5000
  )

  let peData: any
  try {
    const jsonMatch = peResult.match(/\{[\s\S]*\}/)
    peData = JSON.parse(jsonMatch ? jsonMatch[0] : peResult)
  } catch {
    peData = {
      enhanced_brief: { target_audience_profile: formData.audience || 'Target audience', content_objectives: ['Inform', 'Engage'], tone_and_voice: completeStyleProfile.professional_level },
      research_queries: [`${formData.topic || formData.company} statistics 2025`, `${formData.topic || formData.industry} trends`],
      research_prompt: `Research: ${JSON.stringify(formData)}`,
      writer_prompt: `Write content for: ${JSON.stringify(formData)}`,
      quality_checklist: ['Matches specified tone', 'Uses correct structure', 'Includes specific examples']
    }
  }
  console.log('✅ Prompts optimized')

  // ========== STAGE 2: RESEARCH (GPT-4o - 7 searches) ==========
  console.log('🔍 Stage 2: Research (GPT-4o)...')
  const allQueries = [
    ...(peData.research_queries || []),
    ...(additionalInfoResult?.routing?.research_agent?.search_queries || [])
  ].slice(0, 7) // Standard tier: max 7 queries

  const research = await callOpenAI(
    OPENAI_MODELS.GPT_4O,
    'You are a world-class research analyst. Provide comprehensive, factual information. Focus on recent statistics, expert insights, and real-world examples.',
    `Research these topics thoroughly:\n${allQueries.map((q: string, i: number) => `${i + 1}. ${q}`).join('\n')}\n\n${peData.research_prompt}\n\nProvide detailed research findings:\n## KEY STATISTICS & DATA\n## EXPERT INSIGHTS\n## REAL-WORLD EXAMPLES\n## SURPRISING FINDINGS\n## SOURCE REFERENCES`,
    8000
  )
  console.log('✅ Research complete')

  // ========== STAGE 2.5: SUMMARIZE RESEARCH (GPT-4.1 nano) ==========
  console.log('📝 Stage 2.5: Summarizing research (GPT-4.1 nano)...')
  const researchSummary = await callOpenAI(
    OPENAI_MODELS.GPT_4_1_NANO,
    'Create a comprehensive summary preserving ALL statistics, expert quotes, company examples, and sources.',
    `Summarize this research:\n\n${research}`,
    2500
  )
  console.log('✅ Research summary complete')

  // ========== STAGE 3: WRITING (GPT-4o) ==========
  console.log('✍️ Stage 3: Writer (GPT-4o)...')
  const writerRouting = additionalInfoResult?.routing?.writer_agent || {}
  const hasStyleLearning = styleLearningResult?.confidence_score > 0.3

  let writerPrompt = `<research>\n${research}\n</research>\n\n<brief>\n${JSON.stringify(peData.enhanced_brief, null, 2)}\n</brief>\n\n<style_profile>\n${JSON.stringify(completeStyleProfile, null, 2)}\n</style_profile>\n\n`

  if (hasStyleLearning) {
    writerPrompt += `<learned_style>\n${styleLearningResult.writing_instructions}\n</learned_style>\n\n`
  }

  if (writerRouting.must_include?.length > 0) {
    writerPrompt += `<must_include>\n${writerRouting.must_include.join('\n')}\n</must_include>\n\n`
  }

  writerPrompt += peData.writer_prompt

  const draft = await callOpenAI(
    OPENAI_MODELS.GPT_4O,
    WRITER_SYSTEM,
    writerPrompt,
    12000
  )
  console.log('✅ Draft complete')

  // ========== STAGE 4: CRITIQUE (GPT-4.1) ==========
  console.log('🔎 Stage 4: Critic (GPT-4.1)...')
  // Ensure quality_checklist is an array
  const qualityChecklist = Array.isArray(peData.quality_checklist)
    ? peData.quality_checklist
    : (typeof peData.quality_checklist === 'string' ? [peData.quality_checklist] : ['Matches specified tone', 'Uses correct structure', 'Includes specific examples'])
  const additionalChecks = Array.isArray(additionalInfoResult?.routing?.critic_agent?.additional_checks)
    ? additionalInfoResult.routing.critic_agent.additional_checks
    : []
  const allChecks = [...qualityChecklist, ...additionalChecks]

  const critique = await callOpenAI(
    OPENAI_MODELS.GPT_4_1,
    CRITIC_SYSTEM,
    `<content>\n${draft}\n</content>\n\n<brief>\n${JSON.stringify(peData.enhanced_brief, null, 2)}\n</brief>\n\n<style_profile>\n${JSON.stringify(completeStyleProfile, null, 2)}\n</style_profile>\n\n<checklist>\n${allChecks.join('\n')}\n</checklist>\n\nEvaluate this content rigorously.`,
    6000
  )
  console.log('✅ Critique complete')

  // ========== STAGE 5: REVISION (Claude Sonnet) ==========
  console.log('✨ Stage 5: Revision (Claude Sonnet)...')
  const revisionResponse = await anthropic.messages.create({
    model: CLAUDE_SONNET,
    max_tokens: 12000,
    messages: [{
      role: 'user',
      content: `<role>
You are a master editor who transforms good content into exceptional content while ensuring perfect style compliance.
</role>

<current_content>
${draft}
</current_content>

<critic_feedback>
${critique}
</critic_feedback>

<original_research>
${researchSummary}
</original_research>

<content_brief>
${JSON.stringify(peData.enhanced_brief, null, 2)}
</content_brief>

<required_style_profile>
${JSON.stringify(completeStyleProfile, null, 2)}
</required_style_profile>

<task>
Rewrite to address ALL feedback:

1. Fix every FAILED quality check
2. Fix every style profile VIOLATION
3. Ensure all must-include items are present
4. Replace every vague phrase with specifics
5. Incorporate unused research
6. Perfect the opening hook (must be ${completeStyleProfile.hook_type})
7. Perfect the CTAs (must be ${completeStyleProfile.cta_approach}, ${completeStyleProfile.cta_frequency})
</task>

<output_instruction>
Provide ONLY the final polished content.
No preamble. No explanations. Just the finished piece.
</output_instruction>`
    }]
  })

  const final = revisionResponse.content[0].type === 'text' ? revisionResponse.content[0].text : ''
  console.log('✅ Complete!')

  // ========== BUILD RESPONSE ==========
  const response = `${final}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 STANDARD TIER QUALITY REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 ADDITIONAL INFO ANALYSIS
${additionalInfoResult.analysis_summary}

📚 STYLE LEARNING
${styleLearningResult.analysis_summary}

🎨 STYLE PROFILE APPLIED
${JSON.stringify(completeStyleProfile, null, 2)}

🧠 CONTENT BRIEF
${JSON.stringify(peData.enhanced_brief, null, 2)}

🔎 QUALITY REVIEW
${critique}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Built with: GPT-4.1 + GPT-4o (Research & Writing) + Claude Sonnet (Revision)
Standard Tier Pipeline
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

  return { content: response }
}
