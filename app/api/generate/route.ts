import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { defaultStyleProfile } from './options'
import { getCurrentUser } from '@/lib/auth-utils'
import { runBudgetPipeline, runStandardPipeline } from './tiered-pipelines'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// ============================================
// MODEL STRATEGY
// ============================================
const MODELS = {
  HAIKU: 'claude-haiku-4-5-20251001',     // Haiku for simple parsing/routing
  SONNET: 'claude-sonnet-4-5-20250929',   // Sonnet for structured tasks
  OPUS: 'claude-opus-4-5-20251101'        // Opus for final revision only
}

// ============================================
// CACHED SYSTEM PROMPTS (Static across all requests)
// These are cached by Anthropic to reduce token costs
// ============================================

const WRITER_SYSTEM_CACHED = `You are an elite content writer who creates exceptional, human-like content that engages readers and achieves business objectives.

## CRITICAL: Write Like a Human, Not a Machine

To ensure content reads as authentically human-written:

### 1. SENTENCE VARIATION (Burstiness)
- Mix short punchy sentences with longer complex ones
- Never write more than 2 sentences of similar length in a row
- Include rhetorical questions occasionally — they add natural rhythm
- Vary paragraph lengths: some 1-2 sentences, others 4-5 sentences
- Don't always follow the same paragraph structure
- Sometimes start with the conclusion, sometimes build to it

### 2. WORD CHOICE (Perplexity)
- Avoid these overused AI transitions: "Furthermore", "Moreover", "In conclusion", "Additionally", "It's important to note", "In today's fast-paced world"
- Use unexpected but natural word combinations
- Include occasional colloquialisms appropriate to the style and audience
- Replace generic adjectives with specific, vivid ones
- Don't always choose the most "safe" or common word

### 3. TONE SHIFTS
- Allow natural tone shifts within the piece
- Be more conversational in some sections, more authoritative in others
- Include occasional personal perspective or opinion markers
- Don't maintain robotic consistency throughout
- Let enthusiasm or emphasis vary naturally

### 4. STRUCTURE UNPREDICTABILITY
- Alternate between different structural approaches within the piece
- Don't follow a rigid template for every section
- Mix bullet points with prose, but not in a predictable pattern
- Occasionally break "rules" for emphasis or effect

### 5. PHRASES TO NEVER USE
These trigger AI detection and sound robotic:
- "In today's fast-paced world..."
- "It's important to note that..."
- "In conclusion..." / "To summarize..."
- "Let's dive in..." / "Let's explore..."
- "When it comes to..."
- "At the end of the day..."
- "This is where X comes in..."
- "The reality is..."
- "Here's the thing..."
- "First and foremost..."
- "Last but not least..."
- "Without further ado..."
- Starting multiple sentences with "This"
- "It is worth mentioning that..."
- "One of the most important..."

### 6. AUTHENTICITY MARKERS
- Include specific details that only someone knowledgeable would know
- Reference real examples, not generic hypotheticals
- Show genuine opinion where appropriate
- Acknowledge complexity and nuance rather than oversimplifying
- Include occasional hedging language humans naturally use ("often", "typically", "in many cases")`

const CRITIC_SYSTEM_CACHED = `You are a merciless editor with extraordinarily high standards. Your role is to rigorously evaluate content against quality standards and style profile compliance.

## YOUR EVALUATION FRAMEWORK

### 1. Quality Checklist Audit
- Grade each checklist item as PASS ✓ or FAIL ✗
- Provide specific evidence for failures

### 2. Style Profile Compliance
- Verify each style setting is correctly implemented
- Mark as COMPLIANT ✓ or VIOLATION ✗ with evidence

### 3. Customer Requirements
- Confirm all must-include items are present
- Confirm all must-avoid items are absent
- Verify required keywords are used naturally

### 4. Standard Quality Assessment
- Specificity: facts, names, numbers vs vague claims
- Research utilization: what valuable research wasn't used?
- AI detection: any generic AI language patterns?

## OUTPUT FORMAT

## OVERALL SCORE: [X/10]

## QUALITY CHECKLIST AUDIT
[Each item: PASS ✓ or FAIL ✗]

## STYLE PROFILE COMPLIANCE
[Each setting: COMPLIANT ✓ or VIOLATION ✗ with evidence]

## CUSTOMER REQUIREMENTS CHECK
[Must-include: ✓/✗, Must-avoid: ✓/✗, Keywords: ✓/✗]

## SPECIFICITY ANALYSIS
[Vague phrases that need specific replacements]

## UNUSED RESEARCH
[What valuable research wasn't incorporated?]

## SPECIFIC REWRITE DEMANDS
[Exact changes required]

## VERDICT
[Pass for publication or needs revision?]

Be thorough and ruthless in your evaluation.`

// ============================================
// STAGE 0A: ADDITIONAL INFO PROCESSOR (Opus)
// ============================================
const additionalInfoProcessorSystem = `You are an expert content strategist who analyzes customer-provided additional information and determines how it should influence content creation.

Your job is to parse free-form additional information and route it to the appropriate agents in a content creation pipeline.

<pipeline_stages>
1. Research Agent - Gathers facts, statistics, examples from the web
2. Writer Agent - Creates the actual content
3. Critic Agent - Reviews content for quality
4. All Agents - Context everyone needs
</pipeline_stages>

<output_format>
Return a JSON object:
{
  "routing": {
    "research_agent": {
      "links_to_fetch": ["any URLs the customer provided that should be researched"],
      "facts_to_verify": ["specific claims the customer made that should be fact-checked"],
      "topics_to_research": ["additional topics to research based on customer info"],
      "search_queries": ["specific search queries derived from customer needs"]
    },
    "writer_agent": {
      "must_include": ["specific points, facts, or messages that MUST appear in the content"],
      "must_avoid": ["topics, competitors, phrases to NOT include"],
      "tone_examples": ["any example text the customer provided as style reference"],
      "keywords_required": ["specific keywords that must be used"],
      "specific_requests": ["any other specific writing instructions"]
    },
    "critic_agent": {
      "additional_checks": ["custom quality checks based on customer requirements"],
      "success_criteria": ["specific criteria the customer defined for success"]
    },
    "all_agents": {
      "context": "important background information all agents should know"
    }
  },
  "style_implications": {
    "inferred_options": {
      "option_name": "inferred_value"
    },
    "reasoning": "explanation of why these style options were inferred from the additional info"
  },
  "analysis_summary": "brief summary of what was found in the additional info"
}
</output_format>

<instructions>
1. Carefully read all additional information provided
2. Extract URLs, links, resources → route to research_agent
3. Extract facts, statistics, claims → route to research_agent for verification
4. Extract requirements, constraints → route to writer_agent
5. Extract quality criteria, success metrics → route to critic_agent
6. Extract background context → route to all_agents
7. Infer any style options from tone examples or explicit style requests
8. If no additional info provided, return minimal routing with empty arrays
</instructions>`

const processAdditionalInfo = async (additionalInfo: string, customerInput: any) => {
  if (!additionalInfo || additionalInfo.trim() === '') {
    return {
      routing: {
        research_agent: { links_to_fetch: [], facts_to_verify: [], topics_to_research: [], search_queries: [] },
        writer_agent: { must_include: [], must_avoid: [], tone_examples: [], keywords_required: [], specific_requests: [] },
        critic_agent: { additional_checks: [], success_criteria: [] },
        all_agents: { context: '' }
      },
      style_implications: { inferred_options: {}, reasoning: 'No additional info provided' },
      analysis_summary: 'No additional information was provided by the customer.'
    }
  }

  const response = await anthropic.messages.create({
    model: MODELS.HAIKU,
    max_tokens: 3000,
    system: [
      {
        type: "text",
        text: additionalInfoProcessorSystem,
        cache_control: { type: "ephemeral" }
      }
    ] as any,
    messages: [{
      role: 'user',
      content: `<customer_request>
${JSON.stringify(customerInput, null, 2)}
</customer_request>

<additional_information>
${additionalInfo}
</additional_information>

Analyze this additional information and determine how it should influence each stage of content creation. Return the JSON routing object.`
    }]
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
  
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    return JSON.parse(jsonMatch ? jsonMatch[0] : text)
  } catch {
    return {
      routing: {
        research_agent: { links_to_fetch: [], facts_to_verify: [], topics_to_research: [], search_queries: [] },
        writer_agent: { must_include: [], must_avoid: [], tone_examples: [], keywords_required: [], specific_requests: [additionalInfo] },
        critic_agent: { additional_checks: [], success_criteria: [] },
        all_agents: { context: additionalInfo }
      },
      style_implications: { inferred_options: {}, reasoning: 'Could not parse, treating as general context' },
      analysis_summary: 'Additional info provided as general context.'
    }
  }
}

// ============================================
// STAGE 0B: STYLE INFERENCE AGENT (Opus)
// ============================================
const styleInferenceSystem = `You are an expert content strategist who infers optimal style settings based on customer context.

You will receive:
1. Customer's basic request (topic, company, audience, goals)
2. Customer's explicitly selected style options (may be none, some, or all)
3. Style implications from additional info analysis
4. The service type they ordered

Your job is to fill in ALL unselected style options with intelligent inferences based on context.

<style_options_schema>
{
  // Tone of Voice
  "professional_level": "corporate_formal | business_professional | smart_casual | approachable_expert | friendly_professional",
  "energy_level": "calm_reassuring | balanced_steady | energetic_enthusiastic | bold_confident | urgent_action",
  "personality": "authoritative_leader | helpful_mentor | trusted_advisor | innovative_disruptor | relatable_friend | wise_teacher | passionate_advocate",
  "emotional_tone": "empathetic | inspiring | thought_provoking | humorous_witty | serious_straightforward | optimistic | realistic",
  
  // Writing Style
  "narrative_approach": "storytelling | data_driven | conversational | journalistic | academic | editorial_opinion",
  "structure_style": "listicle | how_to_guide | problem_solution | myth_vs_reality | before_after | comparison | deep_dive | quick_overview | faq | interview_qa",
  "sentence_style": "short_punchy | flowing_eloquent | mixed_variety | question_heavy | direct_declarative",
  
  // Audience
  "knowledge_level": "complete_beginner | some_familiarity | intermediate | advanced_practitioner | expert_specialist",
  "reading_level": "simple_8th_grade | standard_high_school | advanced_college | technical_academic",
  "time_availability": "skimmers | moderate_readers | deep_readers | researchers",
  
  // Content Depth
  "depth": "surface_overview | moderate_depth | comprehensive | exhaustive_deep_dive",
  "detail_level": "high_level_strategic | tactical_practical | step_by_step_detailed | technical_implementation",
  "example_density": "minimal | moderate | heavy | case_study_focused",
  
  // Brand Personality
  "archetype": "sage | hero | creator | caregiver | explorer | rebel | magician | everyman | ruler | jester | lover | innocent",
  "positioning": "market_leader | challenger | specialist | innovator | value_provider | premium_luxury | accessible",
  
  // Emotional Appeal
  "primary_appeal": "logic_facts | emotion_story | fomo_urgency | aspiration_dreams | pain_problem | social_proof | authority_expertise | curiosity_intrigue",
  "motivation_focus": "gain_pleasure | avoid_pain | save_time | save_money | make_money | gain_status | reduce_risk | simplify_life",
  
  // Perspective
  "point_of_view": "first_person_singular | first_person_plural | second_person | third_person | mixed_we_you",
  "author_persona": "anonymous_brand | named_expert | team_collective | customer_perspective | industry_observer",
  
  // Content Purpose
  "primary_goal": "educate | persuade | convert | entertain | inspire | inform | build_trust | generate_leads | nurture | retain",
  "funnel_stage": "awareness | consideration | decision | purchase | retention | advocacy",
  
  // Opening Hook
  "hook_type": "surprising_statistic | bold_contrarian | relatable_problem | intriguing_question | story_anecdote | expert_quote | controversial_opinion | future_prediction | myth_bust | direct_promise",
  
  // CTA Style
  "cta_approach": "soft_suggestion | direct_command | question_based | value_focused | urgency_driven | risk_reversal | social_proof_cta | curiosity_cta",
  "cta_frequency": "single_end | multiple_throughout | subtle_embedded | no_hard_sell",
  
  // Competitive Positioning
  "competitor_mention": "never | without_naming | name_directly | head_to_head | acknowledge_differentiate",
  "positioning_stance": "we_are_best | we_are_different | we_are_for_specific_people | we_are_alternative | we_complement",
  
  // Formatting
  "visual_structure": "minimal_prose | header_heavy | bullet_rich | numbered_lists | mixed_formatting | pull_quotes | callout_boxes",
  "paragraph_style": "short_2_3 | medium_4_5 | long_narrative | single_sentence_impact",
  "white_space": "dense | moderate | airy",
  
  // Evidence & Credibility
  "citation_style": "heavy_academic | moderate_key_claims | light_occasional | none_opinion",
  "evidence_types": ["statistics", "expert_quotes", "case_studies", "testimonials", "research_studies", "personal_experience", "industry_reports", "historical_examples"],
  "source_preference": "academic | industry_publications | news | company_data | expert_interviews | mixed",
  
  // Humor
  "humor_level": "none_serious | subtle_wit | moderate_light | heavy_entertainment",
  "humor_style": "dry_deadpan | self_deprecating | observational | wordplay_puns | pop_culture | industry_jokes",
  
  // Controversy & Opinion
  "opinion_strength": "neutral_balanced | mild_opinion | clear_position | bold_provocative | controversial",
  "risk_tolerance": "play_safe | moderate_risk | bold | edgy",
  
  // SEO
  "seo_priority": "seo_first | reader_first | balanced | social_first",
  "keyword_approach": "exact_match | semantic_natural | question_featured | long_tail",
  
  // Content Freshness
  "timeliness": "evergreen | timely_trends | news_pegged | seasonal | predictive_future",
  "update_expectation": "one_time | regularly_updated | living_document",
  
  // Industry Compliance
  "compliance_awareness": "general_none | healthcare_hipaa | finance_disclaimer | legal_careful | education_accessibility | government_formal",
  "jargon_level": "no_jargon | light_common | industry_standard | heavy_technical"
}
</style_options_schema>

<inference_rules>
- B2B SaaS → business_professional, sage archetype, logic_facts appeal
- B2C/E-commerce → friendly_professional, emotion_story appeal
- Healthcare → healthcare_hipaa compliance, calm_reassuring energy, play_safe risk
- Finance → finance_disclaimer compliance, moderate_risk, data_driven
- Startups → smart_casual, challenger/innovator positioning, bold energy
- Enterprise → corporate_formal, market_leader positioning
- "Beginners" audience → complete_beginner knowledge, simple reading, no_jargon
- "Executives" audience → skimmers time, high_level_strategic detail
- "Developers" audience → heavy_technical jargon, step_by_step detail
- "Generate leads" goal → awareness/consideration funnel, multiple CTAs
- "Sales" goal → decision funnel, urgency_driven CTA
- "Thought leadership" → bold_provocative opinion, editorial approach
- "SEO blog" → seo_first priority, evergreen timeliness
- "How to" topic → how_to_guide structure, step_by_step detail
- "Case study" → case_study_focused examples, storytelling approach
</inference_rules>

<output_format>
Return a JSON object with the COMPLETE style profile (all options filled):
{
  "complete_style_profile": {
    // All style options with values
  },
  "inferences_made": {
    "option_name": {
      "value": "inferred_value",
      "reasoning": "why this was inferred"
    }
  },
  "confidence_level": "high | medium | low",
  "summary": "brief description of the overall style direction"
}
</output_format>`

const inferStyleProfile = async (
  customerInput: any, 
  explicitSelections: any, 
  styleImplications: any,
  serviceId: string
) => {
  // Get all required style option keys from defaultStyleProfile
  const requiredKeys = Object.keys(defaultStyleProfile)
  const providedKeys = Object.keys(explicitSelections || {})
  
  // Check if all style options are explicitly provided
  const allOptionsProvided = requiredKeys.every(key => providedKeys.includes(key))
  
  // If all options are provided, skip the API call and merge with defaults
  if (allOptionsProvided) {
    console.log('   ⏭️ Skipping inference - all style options explicitly provided')
    return { ...defaultStyleProfile, ...explicitSelections }
  }
  
  const response = await anthropic.messages.create({
    model: MODELS.SONNET,
    max_tokens: 4000,
    system: [
      {
        type: "text",
        text: styleInferenceSystem,
        cache_control: { type: "ephemeral" }
      }
    ] as any,
    messages: [{
      role: 'user',
      content: `<customer_request>
${JSON.stringify(customerInput, null, 2)}
</customer_request>

<service_type>${serviceId}</service_type>

<explicit_style_selections>
${JSON.stringify(explicitSelections || {}, null, 2)}
</explicit_style_selections>

<style_implications_from_additional_info>
${JSON.stringify(styleImplications || {}, null, 2)}
</style_implications_from_additional_info>

<default_values>
${JSON.stringify(defaultStyleProfile, null, 2)}
</default_values>

Analyze all inputs and return a COMPLETE style profile with all options filled.
- Use explicit selections where provided
- Apply style implications from additional info
- Infer remaining options based on context
- Fall back to defaults only when no better inference can be made`
    }]
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
  
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const result = JSON.parse(jsonMatch ? jsonMatch[0] : text)
    return result.complete_style_profile || { ...defaultStyleProfile, ...explicitSelections }
  } catch {
    return { ...defaultStyleProfile, ...explicitSelections }
  }
}

// ============================================
// STAGE 0C: STYLE LEARNING AGENT (Opus)
// ============================================
const styleLearningSystem = `You are an expert writing style analyst. Your job is to analyze sample articles/content provided by a customer and extract their unique writing style patterns.

You will receive sample content (articles, posts, emails) that represent the customer's desired voice and style. Analyze these deeply to identify:

1. **Voice & Personality**
   - Level of formality
   - Warmth vs. distance
   - Authority vs. relatability
   - Humor usage
   - Energy level

2. **Sentence Patterns**
   - Average sentence length
   - Sentence variety (short/long mix)
   - Use of questions
   - Use of fragments
   - Transition styles

3. **Vocabulary Patterns**
   - Technical vs. simple language
   - Industry jargon usage
   - Power words and phrases
   - Signature expressions or phrases
   - Word sophistication level

4. **Structural Patterns**
   - Paragraph length preferences
   - Use of headers/subheaders
   - List vs. prose preference
   - Opening styles (how they start articles)
   - Closing styles (how they end)

5. **Unique Fingerprints**
   - Recurring phrases or expressions
   - Preferred metaphors or analogies
   - Storytelling approaches
   - Data/evidence presentation style
   - Call-to-action style

<output_format>
Return a JSON object:
{
  "style_analysis": {
    "voice_profile": {
      "formality_level": "description and examples from samples",
      "personality_traits": ["trait1", "trait2"],
      "energy_description": "description",
      "humor_style": "description or 'none'"
    },
    "sentence_patterns": {
      "average_length": "short/medium/long",
      "variety_style": "description",
      "notable_patterns": ["pattern1", "pattern2"]
    },
    "vocabulary_profile": {
      "complexity_level": "simple/moderate/sophisticated",
      "jargon_usage": "none/light/heavy",
      "signature_phrases": ["phrase1", "phrase2"],
      "power_words": ["word1", "word2"]
    },
    "structural_preferences": {
      "paragraph_style": "description",
      "formatting_preferences": "description",
      "opening_style": "how they typically start",
      "closing_style": "how they typically end"
    },
    "unique_fingerprints": {
      "recurring_elements": ["element1", "element2"],
      "storytelling_approach": "description",
      "evidence_style": "description"
    }
  },
  "writing_instructions": "A detailed paragraph of specific instructions for a writer to perfectly mimic this style. Be very specific about word choices, sentence structures, and patterns to use or avoid.",
  "sample_phrases_to_emulate": ["phrase1 from samples", "phrase2 from samples"],
  "patterns_to_avoid": ["things this writer never does"],
  "confidence_score": 0.0-1.0
}
</output_format>

<instructions>
1. Analyze ALL provided samples thoroughly
2. Look for PATTERNS, not one-off occurrences
3. Extract specific examples from the samples to illustrate each point
4. The "writing_instructions" should be detailed enough that another AI could perfectly mimic this style
5. If samples are too short or inconsistent, note lower confidence
6. Focus on what makes this writing DISTINCTIVE
</instructions>`

const learnFromSampleArticles = async (sampleArticles: string) => {
  if (!sampleArticles || sampleArticles.trim() === '' || sampleArticles.trim().length < 200) {
    return {
      style_analysis: null,
      writing_instructions: '',
      sample_phrases_to_emulate: [],
      patterns_to_avoid: [],
      confidence_score: 0,
      analysis_summary: 'No sample articles provided or samples too short for meaningful analysis.'
    }
  }

  const response = await anthropic.messages.create({
    model: MODELS.SONNET,
    max_tokens: 4000,
    system: [
      {
        type: "text",
        text: styleLearningSystem,
        cache_control: { type: "ephemeral" }
      }
    ] as any,
    messages: [{
      role: 'user',
      content: `<sample_content>
${sampleArticles}
</sample_content>

Analyze these writing samples and extract the unique style patterns. Return the JSON analysis.`
    }]
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
  
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const result = JSON.parse(jsonMatch ? jsonMatch[0] : text)
    return {
      ...result,
      analysis_summary: `Style analyzed from ${sampleArticles.split(/\n\n+/).length} sample(s). Confidence: ${Math.round((result.confidence_score || 0.7) * 100)}%`
    }
  } catch {
    return {
      style_analysis: null,
      writing_instructions: sampleArticles.substring(0, 500) + '... [Use this as style reference]',
      sample_phrases_to_emulate: [],
      patterns_to_avoid: [],
      confidence_score: 0.3,
      analysis_summary: 'Could not fully parse samples, treating as general style reference.'
    }
  }
}

// ============================================
// STAGE 1: PROMPT ENGINEER (Opus)
// ============================================
const createPromptEngineerTask = (
  serviceId: string, 
  customerInput: any, 
  styleProfile: any,
  additionalInfoRouting: any
) => {
  const serviceContext: Record<string, string> = {
    'blog-basic': 'a 1600-2000 word SEO-optimized blog article',
    'blog-premium': 'a 3000-4000 word in-depth, authoritative blog article',
    'social-pack': '30 social media posts (10 LinkedIn, 10 Twitter/X, 10 Instagram)',
    'email-sequence': 'a 5-email nurture/sales sequence',
    'seo-report': 'a comprehensive SEO audit with actionable recommendations',
    'content-bundle': 'a complete content package (4 blogs at 3000-4000 words each + 30 social posts + email sequence)'
  }

  return `<task>
Create optimized prompts for generating ${serviceContext[serviceId] || 'premium content'}.
</task>

<customer_input>
${JSON.stringify(customerInput, null, 2)}
</customer_input>

<complete_style_profile>
${JSON.stringify(styleProfile, null, 2)}
</complete_style_profile>

<additional_info_routing>
${JSON.stringify(additionalInfoRouting, null, 2)}
</additional_info_routing>

<instructions>
Create prompts that incorporate:
1. ALL style profile settings (tone, structure, depth, etc.)
2. Customer's specific requirements from additional info
3. Must-include and must-avoid items
4. Quality criteria and success metrics

Output JSON:
{
  "enhanced_brief": {
    "target_audience_profile": "detailed description incorporating style settings",
    "content_objectives": ["objective 1", "objective 2"],
    "tone_and_voice": "precise description based on style profile",
    "key_messages": ["from customer requirements"],
    "unique_angle": "derived from positioning and approach",
    "success_criteria": ["from style + additional info"]
  },
  "research_queries": ["query 1", "query 2", "query 3"],
  "research_prompt": "detailed prompt incorporating style and routing",
  "writer_prompt": "detailed prompt with ALL style settings embedded",
  "quality_checklist": ["style-specific check 1", "check 2", "..."]
}
</instructions>`
}

const promptEngineerSystem = `You are an elite prompt engineer. Transform customer inputs and style profiles into perfectly optimized prompts.

Your prompts must explicitly incorporate EVERY aspect of the style profile:
- Tone settings affect word choice examples
- Structure settings affect output format
- Audience settings affect complexity and jargon
- Hook type affects opening instructions
- CTA settings affect closing instructions
- All other settings shape the writing instructions

Output must be JSON with: enhanced_brief, research_queries, research_prompt, writer_prompt, quality_checklist`

// ============================================
// STAGE 2: RESEARCH AGENT (Sonnet + Web Search)
// ============================================
const executeResearch = async (
  researchPrompt: string, 
  searchQueries: string[],
  additionalInfoRouting: any
) => {
  // Combine generated queries with any from additional info
  const allQueries = [
    ...searchQueries,
    ...(additionalInfoRouting?.research_agent?.search_queries || [])
  ]
  
  const linksToFetch = additionalInfoRouting?.research_agent?.links_to_fetch || []
  const factsToVerify = additionalInfoRouting?.research_agent?.facts_to_verify || []
  const topicsToResearch = additionalInfoRouting?.research_agent?.topics_to_research || []

  const response = await anthropic.messages.create({
    model: MODELS.SONNET,
    max_tokens: 8000,
    tools: [{
      type: 'web_search_20250305',
      name: 'web_search',
      max_uses: 7  // More searches for thorough research
    }] as any,
    messages: [{ 
      role: 'user', 
      content: `<role>
You are a world-class research analyst. Use web search to find specific, current information.
</role>

<search_queries>
${allQueries.map((q, i) => `${i + 1}. ${q}`).join('\n')}
</search_queries>

${linksToFetch.length > 0 ? `<customer_provided_links>
Research these specific URLs the customer provided:
${linksToFetch.map((l: string) => `- ${l}`).join('\n')}
</customer_provided_links>` : ''}

${factsToVerify.length > 0 ? `<facts_to_verify>
The customer provided these facts - verify them:
${factsToVerify.map((f: string) => `- ${f}`).join('\n')}
</facts_to_verify>` : ''}

${topicsToResearch.length > 0 ? `<additional_topics>
Also research these topics from customer requirements:
${topicsToResearch.map((t: string) => `- ${t}`).join('\n')}
</additional_topics>` : ''}

<research_task>
${researchPrompt}
</research_task>

<instructions>
1. Use web search to find current, specific information
2. Focus on finding:
   - Recent statistics with specific numbers and sources
   - Expert quotes from named individuals
   - Real company/product examples
   - Surprising or counterintuitive insights
3. If customer provided links, extract key information from them
4. Verify any facts the customer claimed
5. Include source URLs for key claims
</instructions>

<output_format>
## KEY STATISTICS & DATA
[Specific numbers with sources]

## EXPERT INSIGHTS  
[Named experts and their perspectives]

## REAL-WORLD EXAMPLES
[Specific companies, products, case studies]

## SURPRISING FINDINGS
[Counterintuitive facts]

## CUSTOMER-PROVIDED INFO VERIFICATION
[Status of any facts/links customer provided]

## SOURCE REFERENCES
[URLs]
</output_format>

Conduct thorough research now.`
    }]
  })
  
  let researchText = ''
  for (const block of response.content) {
    if (block.type === 'text') {
      researchText += block.text + '\n'
    }
  }
  return researchText
}

// ============================================
// RESEARCH SUMMARIZER (Haiku - for cost optimization)
// Creates a comprehensive summary for Critic and Revision stages
// ============================================
const summarizeResearch = async (fullResearch: string): Promise<string> => {
  // If research is short, don't summarize
  if (!fullResearch || fullResearch.trim().length < 1000) {
    return fullResearch
  }

  const response = await anthropic.messages.create({
    model: MODELS.HAIKU,
    max_tokens: 2500,
    messages: [{
      role: 'user',
      content: `Create a comprehensive summary of this research for content writers.

CRITICAL - You MUST preserve:
- ALL specific statistics with exact numbers and their sources
- ALL expert quotes with the person's name and title
- ALL company/product examples with specific details
- ALL surprising or counterintuitive findings
- ALL source URLs for verification
- Key industry trends and insights

Remove ONLY:
- Redundant repetitions of the same information
- Verbose explanations that don't add facts
- Generic filler text

<research>
${fullResearch}
</research>

Return a well-organized summary that gives writers everything they need to create factual, well-sourced content. Format with clear sections.`
    }]
  })

  return response.content[0].type === 'text' ? response.content[0].text : fullResearch
}

// ============================================
// STAGE 3: WRITER AGENT (Sonnet - optimized for cost)
// ============================================
const executeWriting = async (
  writerPrompt: string,
  research: string,
  enhancedBrief: any,
  styleProfile: any,
  additionalInfoRouting: any,
  styleLearningResult?: any
) => {
  const writerRouting = additionalInfoRouting?.writer_agent || {}
  const hasStyleLearning = styleLearningResult?.confidence_score > 0.3 && styleLearningResult?.writing_instructions

  const response = await anthropic.messages.create({
    model: MODELS.SONNET,
    max_tokens: 12000,
    system: [
      {
        type: "text",
        text: WRITER_SYSTEM_CACHED,
        cache_control: { type: "ephemeral" }
      }
    ] as any,
    messages: [{
      role: 'user',
      content: `<research_findings>
${research}
</research_findings>

<content_brief>
${JSON.stringify(enhancedBrief, null, 2)}
</content_brief>

<complete_style_profile>
${JSON.stringify(styleProfile, null, 2)}
</complete_style_profile>

${hasStyleLearning ? `<learned_style_from_samples>
## CRITICAL: Match the Customer's Writing Style

The customer provided sample articles. We analyzed them and extracted their unique style. 
YOU MUST CLOSELY MIMIC THIS STYLE.

### Writing Instructions (from sample analysis):
${styleLearningResult.writing_instructions}

### Phrases to Emulate (use similar patterns):
${styleLearningResult.sample_phrases_to_emulate?.map((p: string) => `- "${p}"`).join('\n') || 'N/A'}

### Patterns to Avoid (the customer never does these):
${styleLearningResult.patterns_to_avoid?.map((p: string) => `- ${p}`).join('\n') || 'N/A'}

### Voice Profile:
${JSON.stringify(styleLearningResult.style_analysis?.voice_profile || {}, null, 2)}

### Sentence Patterns:
${JSON.stringify(styleLearningResult.style_analysis?.sentence_patterns || {}, null, 2)}

### Vocabulary Profile:
${JSON.stringify(styleLearningResult.style_analysis?.vocabulary_profile || {}, null, 2)}

IMPORTANT: The learned style from samples takes PRIORITY over generic style settings.
Match the customer's actual voice, not just the style profile categories.
</learned_style_from_samples>` : ''}

${writerRouting.must_include?.length > 0 ? `<must_include>
These points MUST appear in the content:
${writerRouting.must_include.map((m: string) => `- ${m}`).join('\n')}
</must_include>` : ''}

${writerRouting.must_avoid?.length > 0 ? `<must_avoid>
Do NOT include these in the content:
${writerRouting.must_avoid.map((m: string) => `- ${m}`).join('\n')}
</must_avoid>` : ''}

${writerRouting.keywords_required?.length > 0 ? `<required_keywords>
Must use these keywords naturally:
${writerRouting.keywords_required.map((k: string) => `- ${k}`).join('\n')}
</required_keywords>` : ''}

${writerRouting.tone_examples?.length > 0 ? `<tone_examples>
Match this tone/style from customer examples:
${writerRouting.tone_examples.map((t: string) => `"${t}"`).join('\n')}
</tone_examples>` : ''}

${writerRouting.specific_requests?.length > 0 ? `<specific_requests>
Customer's specific writing requests:
${writerRouting.specific_requests.map((r: string) => `- ${r}`).join('\n')}
</specific_requests>` : ''}

${writerPrompt}

<style_implementation_checklist>
Before writing, confirm you will:
- Use ${styleProfile.professional_level} professional level
- Maintain ${styleProfile.energy_level} energy
- Adopt ${styleProfile.personality} personality
- Apply ${styleProfile.narrative_approach} narrative approach
- Structure as ${styleProfile.structure_style}
- Use ${styleProfile.sentence_style} sentences
- Write for ${styleProfile.knowledge_level} knowledge level
- Open with ${styleProfile.hook_type} hook
- Include ${styleProfile.cta_frequency} CTAs using ${styleProfile.cta_approach} approach
- Apply ${styleProfile.humor_level} humor
- Take ${styleProfile.opinion_strength} opinion stance
${hasStyleLearning ? '- MATCH THE LEARNED STYLE FROM CUSTOMER SAMPLES (highest priority!)' : ''}
</style_implementation_checklist>

Write the content now, implementing ALL style settings AND the human-like writing guidelines from your system instructions.`
    }]
  })
  
  return response.content[0].type === 'text' ? response.content[0].text : ''
}

// ============================================
// STAGE 4: CRITIC AGENT (Sonnet with cached system prompt)
// ============================================
const executeCritique = async (
  content: string,
  qualityChecklist: string[],
  enhancedBrief: any,
  research: string,
  styleProfile: any,
  additionalInfoRouting: any
) => {
  const criticRouting = additionalInfoRouting?.critic_agent || {}
  const allChecks = [
    ...qualityChecklist,
    ...(criticRouting.additional_checks || [])
  ]

  const response = await anthropic.messages.create({
    model: MODELS.SONNET,
    max_tokens: 6000,
    system: [
      {
        type: "text",
        text: CRITIC_SYSTEM_CACHED,
        cache_control: { type: "ephemeral" }
      }
    ] as any,
    messages: [{
      role: 'user',
      content: `<content_to_critique>
${content}
</content_to_critique>

<original_brief>
${JSON.stringify(enhancedBrief, null, 2)}
</original_brief>

<required_style_profile>
${JSON.stringify(styleProfile, null, 2)}
</required_style_profile>

<research_summary>
${research}
</research_summary>

<quality_checklist>
${allChecks.map((item, i) => `${i + 1}. ${item}`).join('\n')}
</quality_checklist>

${criticRouting.success_criteria?.length > 0 ? `<customer_success_criteria>
Customer defined these success criteria:
${criticRouting.success_criteria.map((c: string) => `- ${c}`).join('\n')}
</customer_success_criteria>` : ''}

<style_settings_to_verify>
- Professional level: "${styleProfile.professional_level}"
- Energy level: "${styleProfile.energy_level}"
- Hook type: "${styleProfile.hook_type}"
- Structure style: "${styleProfile.structure_style}"
- Humor level: "${styleProfile.humor_level}"
- Opinion strength: "${styleProfile.opinion_strength}"
</style_settings_to_verify>

Perform your evaluation now using the framework from your system instructions.`
    }]
  })

  return response.content[0].type === 'text' ? response.content[0].text : ''
}

// ============================================
// STAGE 5: REVISION AGENT (Opus)
// ============================================
const executeRevision = async (
  content: string, 
  critique: string, 
  research: string,
  enhancedBrief: any,
  styleProfile: any,
  additionalInfoRouting: any
) => {
  const response = await anthropic.messages.create({
    model: MODELS.OPUS,
    max_tokens: 12000,
    messages: [{ 
      role: 'user', 
      content: `<role>
You are a master editor who transforms good content into exceptional content while ensuring perfect style compliance.
</role>

<current_content>
${content}
</current_content>

<critic_feedback>
${critique}
</critic_feedback>

<original_research>
${research}
</original_research>

<content_brief>
${JSON.stringify(enhancedBrief, null, 2)}
</content_brief>

<required_style_profile>
${JSON.stringify(styleProfile, null, 2)}
</required_style_profile>

<task>
Rewrite to address ALL feedback:

1. Fix every FAILED quality check
2. Fix every style profile VIOLATION
3. Ensure all customer must-include items are present
4. Ensure all must-avoid items are removed
5. Replace every vague phrase with specifics
6. Incorporate unused research
7. Perfect the opening hook (must be ${styleProfile.hook_type})
8. Perfect the CTAs (must be ${styleProfile.cta_approach}, ${styleProfile.cta_frequency})
</task>

<output_instruction>
Provide ONLY the final polished content.
No preamble. No explanations. Just the finished piece.
</output_instruction>`
    }]
  })
  
  return response.content[0].type === 'text' ? response.content[0].text : ''
}

// ============================================
// MAIN API HANDLER
// ============================================
export async function POST(req: NextRequest) {
  try {
    const { serviceId, formData, styleSelections, additionalInfo, tier = 'premium' } = await req.json()

    // Check if user is authenticated and is admin for free usage
    const user = await getCurrentUser()
    const isAdmin = user?.isAdmin ?? false

    // For non-admin users, payment verification would happen here
    // Admin users can use services for free
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    console.log(`🚀 Starting content generation for ${isAdmin ? 'ADMIN' : 'user'}: ${user.email}`)
    console.log(`📦 Tier selected: ${tier.toUpperCase()}`)

    // ============================================
    // TIER ROUTING - Route to appropriate pipeline
    // ============================================
    if (tier === 'budget') {
      // Budget tier uses OpenAI models only
      const openaiKey = process.env.OPENAI_API_KEY
      if (!openaiKey) {
        return NextResponse.json({ error: 'OPENAI_API_KEY not configured for Budget tier' }, { status: 400 })
      }
      const result = await runBudgetPipeline(serviceId, formData, styleSelections, additionalInfo)
      return NextResponse.json(result)
    }

    if (tier === 'standard') {
      // Standard tier uses mix of OpenAI and Claude Sonnet
      const openaiKey = process.env.OPENAI_API_KEY
      const anthropicKey = process.env.ANTHROPIC_API_KEY
      if (!openaiKey) {
        return NextResponse.json({ error: 'OPENAI_API_KEY not configured for Standard tier' }, { status: 400 })
      }
      if (!anthropicKey || anthropicKey === 'sk-ant-dummy') {
        return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured for Standard tier' }, { status: 400 })
      }
      const result = await runStandardPipeline(serviceId, formData, styleSelections, additionalInfo)
      return NextResponse.json(result)
    }

    // ============================================
    // PREMIUM TIER - Original pipeline (unchanged)
    // ============================================
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey || apiKey === 'sk-ant-dummy') {
      return NextResponse.json({ error: 'Add real ANTHROPIC_API_KEY to .env.local' }, { status: 400 })
    }

    console.log('👑 PREMIUM TIER: Starting premium pipeline...')

    // ========== STAGE 0A: PROCESS ADDITIONAL INFO ==========
    console.log('📋 Stage 0A: Processing additional information...')
    const additionalInfoResult = await processAdditionalInfo(additionalInfo || '', formData)
    console.log('✅ Additional info processed')
    console.log('   Summary:', additionalInfoResult.analysis_summary)

    // ========== STAGE 0B: INFER STYLE PROFILE ==========
    console.log('🎨 Stage 0B: Inferring complete style profile...')
    const completeStyleProfile = await inferStyleProfile(
      formData,
      styleSelections || {},
      additionalInfoResult.style_implications,
      serviceId
    )
    console.log('✅ Style profile complete')

    // ========== STAGE 0C: LEARN FROM SAMPLE ARTICLES ==========
    console.log('📚 Stage 0C: Analyzing sample articles for style learning...')
    const sampleArticles = formData.sampleArticles || ''
    const styleLearningResult = await learnFromSampleArticles(sampleArticles)
    console.log('✅ Style learning complete')
    console.log('   Summary:', styleLearningResult.analysis_summary)

    // ========== STAGE 1: PROMPT ENGINEER ==========
    console.log('🧠 Stage 1: Prompt Engineer (Sonnet)...')
    const peResponse = await anthropic.messages.create({
      model: MODELS.SONNET,
      max_tokens: 5000,
      system: [
        {
          type: "text",
          text: promptEngineerSystem,
          cache_control: { type: "ephemeral" }
        }
      ] as any,
      messages: [{
        role: 'user',
        content: createPromptEngineerTask(serviceId, formData, completeStyleProfile, additionalInfoResult.routing)
      }]
    })
    
    let peResult: any
    const peText = peResponse.content[0].type === 'text' ? peResponse.content[0].text : '{}'
    
    try {
      const jsonMatch = peText.match(/\{[\s\S]*\}/)
      peResult = JSON.parse(jsonMatch ? jsonMatch[0] : peText)
    } catch {
      peResult = {
        enhanced_brief: {
          target_audience_profile: formData.audience || 'Target audience',
          content_objectives: ['Inform', 'Engage'],
          tone_and_voice: completeStyleProfile.professional_level,
          key_messages: ['Key value'],
          unique_angle: 'Fresh perspective',
          success_criteria: ['Matches style profile']
        },
        research_queries: [
          `${formData.topic || formData.company} statistics 2025`,
          `${formData.topic || formData.industry} trends`,
          `${formData.topic || formData.company} examples`
        ],
        research_prompt: `Research: ${JSON.stringify(formData)}`,
        writer_prompt: `Write content for: ${JSON.stringify(formData)}`,
        quality_checklist: [
          'Matches specified tone',
          'Uses correct structure',
          'Appropriate for audience level',
          'Includes specific examples',
          'Has compelling hook',
          'Includes appropriate CTA'
        ]
      }
    }
    console.log('✅ Prompts optimized')

    // ========== STAGE 2: RESEARCH ==========
    console.log('🔍 Stage 2: Research (Sonnet + Web Search)...')
    const research = await executeResearch(
      peResult.research_prompt,
      peResult.research_queries || [],
      additionalInfoResult.routing
    )
    console.log('✅ Research complete')

    // ========== STAGE 2.5: SUMMARIZE RESEARCH (for cost optimization) ==========
    console.log('📝 Stage 2.5: Summarizing research for downstream stages...')
    const researchSummary = await summarizeResearch(research)
    console.log('✅ Research summary complete')

    // ========== STAGE 3: WRITING ==========
    console.log('✍️ Stage 3: Writer (Sonnet)...')
    const draft = await executeWriting(
      peResult.writer_prompt,
      research,  // Writer gets FULL research for best quality
      peResult.enhanced_brief,
      completeStyleProfile,
      additionalInfoResult.routing,
      styleLearningResult
    )
    console.log('✅ Draft complete')

    // ========== STAGE 4: CRITIQUE ==========
    console.log('🔎 Stage 4: Critic (Sonnet)...')
    const critique = await executeCritique(
      draft,
      peResult.quality_checklist || [],
      peResult.enhanced_brief,
      researchSummary,  // Critic gets summary (cost optimization)
      completeStyleProfile,
      additionalInfoResult.routing
    )
    console.log('✅ Critique complete')

    // ========== STAGE 5: REVISION ==========
    console.log('✨ Stage 5: Revision (Opus)...')
    const final = await executeRevision(
      draft,
      critique,
      researchSummary,  // Revision gets summary (cost optimization)
      peResult.enhanced_brief,
      completeStyleProfile,
      additionalInfoResult.routing
    )
    console.log('✅ Complete!')

    // ========== BUILD RESPONSE ==========
    const response = `${final}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 PREMIUM QUALITY ASSURANCE REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 ADDITIONAL INFO ANALYSIS
${additionalInfoResult.analysis_summary}

📚 STYLE LEARNING FROM SAMPLES
${styleLearningResult.analysis_summary}
${styleLearningResult.confidence_score > 0.3 ? `Writing instructions applied: ${styleLearningResult.writing_instructions?.substring(0, 200)}...` : 'No sample articles provided - using style profile settings.'}

🎨 STYLE PROFILE APPLIED
${JSON.stringify(completeStyleProfile, null, 2)}

🧠 CONTENT BRIEF
${JSON.stringify(peResult.enhanced_brief, null, 2)}

🔍 RESEARCH (Sonnet + Web Search)
Live web search gathered current facts and statistics.

🔎 QUALITY REVIEW
${critique}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Built with: Claude Sonnet 4.5 (Writing) + Opus 4.5 (Revision) + Live Web Search
Cost-Optimized Premium Pipeline with Prompt Caching
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

    return NextResponse.json({ content: response })

  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
