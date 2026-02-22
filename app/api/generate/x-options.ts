/**
 * X (Twitter) Content Style Options
 *
 * Comprehensive customization options for X content generation.
 * Covers all three pipelines: Tweet Generator, Thread Builder, Quote Tweet Crafter.
 *
 * Based on 2025 X platform research:
 * - Text posts get 30% more engagement than videos
 * - 70-100 character tweets perform best for quick reads
 * - Threads get 3x engagement of single tweets
 * - Quote tweets get 2x engagement of regular tweets
 * - First 30 minutes are critical for algorithmic pickup
 * - 1-2 hashtags max (21% more engagement than 3+)
 */

// ============================================
// STYLE OPTION TYPES
// ============================================

export interface XStyleOption {
  id: string
  label: string
  hint: string
  options: { value: string; label: string; hint?: string }[]
}

export interface XStyleCategory {
  id: string
  name: string
  description: string
  options: XStyleOption[]
}

// ============================================
// CONTENT SOURCE OPTIONS
// ============================================

export const contentSourceCategory: XStyleCategory = {
  id: 'content_source',
  name: 'Content Source',
  description: 'Where the content ideas come from',
  options: [
    {
      id: 'source_type',
      label: 'Content Source',
      hint: 'Generate from scratch or repurpose existing content',
      options: [
        { value: 'original', label: 'Original Topic', hint: 'Generate fresh content from topic/keywords you provide.' },
        { value: 'blog_repurpose', label: 'Blog Post Repurpose', hint: 'Extract tweets from your blog articles.' },
        { value: 'newsletter_repurpose', label: 'Newsletter Repurpose', hint: 'Turn newsletter issues into tweet content.' },
        { value: 'podcast_repurpose', label: 'Podcast Transcript', hint: 'Extract key moments from podcast transcripts.' },
        { value: 'tweet_expansion', label: 'Existing Tweet Expansion', hint: 'Create variations of your best-performing tweets.' }
      ]
    }
  ]
}

// ============================================
// VOICE & STYLE OPTIONS
// ============================================

export const voiceStyleCategory: XStyleCategory = {
  id: 'voice_style',
  name: 'Voice & Style',
  description: 'How your X content should sound',
  options: [
    {
      id: 'voice_learning',
      label: 'Voice Learning',
      hint: 'Should AI learn from your existing content?',
      options: [
        { value: 'none', label: 'No Learning', hint: 'Use default professional tone. Fast, no samples needed.' },
        { value: 'basic', label: 'Basic Voice Match', hint: 'Light style adaptation from 5-10 sample tweets.' },
        { value: 'full_clone', label: 'Full Voice Clone', hint: 'Deep style replication from 20-50 sample tweets.' },
        { value: 'brand_guide', label: 'Brand Guidelines', hint: 'Follow your brand voice document.' }
      ]
    },
    {
      id: 'tone',
      label: 'Tone',
      hint: 'The overall voice of your content',
      options: [
        { value: 'professional', label: 'Professional', hint: 'Business-appropriate, authoritative. B2B, consultants.' },
        { value: 'conversational', label: 'Conversational', hint: 'Friendly, approachable, like talking to a friend.' },
        { value: 'witty', label: 'Witty/Clever', hint: 'Humor, wordplay, memorable. Entertainment, lifestyle.' },
        { value: 'bold', label: 'Bold/Provocative', hint: 'Strong opinions, challenges norms. Thought leadership.' },
        { value: 'educational', label: 'Educational', hint: 'Teaching, explaining, informative. Experts, educators.' },
        { value: 'storytelling', label: 'Storytelling', hint: 'Narrative, personal, relatable. Personal brands.' }
      ]
    },
    {
      id: 'controversy_level',
      label: 'Opinion/Controversy Level',
      hint: 'How strong should opinions be? (Controversial content gets 24% more engagement)',
      options: [
        { value: 'safe', label: 'Safe', hint: 'Neutral, universally agreeable. Zero risk.' },
        { value: 'mild_opinion', label: 'Mild Opinion', hint: 'Light takes, soft positions. Very low risk.' },
        { value: 'clear_position', label: 'Clear Position', hint: 'Definite stance, may disagree with some. Low risk.' },
        { value: 'spicy', label: 'Spicy', hint: 'Contrarian, challenges conventional thinking. Medium risk, higher engagement.' },
        { value: 'very_spicy', label: 'Very Spicy', hint: 'Bold, potentially polarizing. Higher engagement, higher risk.' }
      ]
    },
    {
      id: 'emoji_usage',
      label: 'Emoji Usage',
      hint: 'How many emojis to include',
      options: [
        { value: 'none', label: 'None', hint: 'Clean, text-only. Professional, minimalist.' },
        { value: 'minimal', label: 'Minimal (1-2)', hint: 'Strategic accent. Professional but approachable.' },
        { value: 'moderate', label: 'Moderate (3-4)', hint: 'Expressive but not overwhelming.' },
        { value: 'heavy', label: 'Heavy (5+)', hint: 'Very expressive. Youth-focused, playful brands.' }
      ]
    }
  ]
}

// ============================================
// PLATFORM OPTIMIZATION OPTIONS
// ============================================

export const platformOptimizationCategory: XStyleCategory = {
  id: 'platform_optimization',
  name: 'Platform Optimization',
  description: 'X algorithm and platform-specific settings',
  options: [
    {
      id: 'trend_integration',
      label: 'Trend Integration',
      hint: 'How much to incorporate current X trends',
      options: [
        { value: 'none', label: 'None (Evergreen)', hint: 'Timeless content only. No trend research.' },
        { value: 'light', label: 'Light', hint: 'Reference current themes if naturally relevant.' },
        { value: 'active', label: 'Active', hint: 'Actively incorporate trending topics in your niche.' },
        { value: 'trend_first', label: 'Trend-First', hint: 'Build content around what\'s trending now. Real-time relevance.' }
      ]
    },
    {
      id: 'hashtag_strategy',
      label: 'Hashtag Strategy',
      hint: 'X best practice: 1-2 hashtags max (21% more engagement than 3+)',
      options: [
        { value: 'none', label: 'No Hashtags', hint: 'Clean, no hashtags. Works well for established accounts.' },
        { value: 'minimal', label: 'Minimal (1)', hint: 'Single most relevant hashtag. Best practice.' },
        { value: 'standard', label: 'Standard (2)', hint: 'Two strategic hashtags. Optimal for discovery.' },
        { value: 'research_based', label: 'Research-Based', hint: 'AI researches optimal hashtags for your niche.' }
      ]
    },
    {
      id: 'length_preference',
      label: 'Tweet Length Preference',
      hint: '70-100 characters performs best for quick reads',
      options: [
        { value: 'punchy', label: 'Punchy (50-100 chars)', hint: 'Maximum impact, minimal words. Scroll-stopping.' },
        { value: 'standard', label: 'Standard (100-200 chars)', hint: 'Balanced. Room for context.' },
        { value: 'detailed', label: 'Detailed (200-280 chars)', hint: 'Full thoughts. More context and nuance.' },
        { value: 'premium_long', label: 'Premium Long (280+ chars)', hint: 'For X Premium users. Extended format.' }
      ]
    }
  ]
}

// ============================================
// ENGAGEMENT OPTIONS
// ============================================

export const engagementCategory: XStyleCategory = {
  id: 'engagement',
  name: 'Engagement Strategy',
  description: 'How to drive engagement with your content',
  options: [
    {
      id: 'engagement_style',
      label: 'Engagement Style',
      hint: 'How to prompt interaction',
      options: [
        { value: 'broadcast', label: 'Broadcast', hint: 'Statements, insights, value delivery. Authority building.' },
        { value: 'conversational', label: 'Conversational', hint: 'Questions, invitations to reply. Community building.' },
        { value: 'mixed', label: 'Mixed', hint: 'Balance of both. Versatile content.' }
      ]
    },
    {
      id: 'cta_approach',
      label: 'Call-to-Action Approach',
      hint: 'How to ask for action',
      options: [
        { value: 'none', label: 'No CTA', hint: 'Let content speak for itself. Subtle approach.' },
        { value: 'soft', label: 'Soft', hint: 'Gentle suggestions. "Worth considering..."' },
        { value: 'direct', label: 'Direct', hint: 'Clear asks. "Follow for more", "Save this"' },
        { value: 'engagement_prompt', label: 'Engagement Prompt', hint: 'Reply prompts. "What do you think?", "Agree or disagree?"' }
      ]
    }
  ]
}

// ============================================
// TWEET GENERATOR SPECIFIC OPTIONS
// ============================================

export const tweetGeneratorCategory: XStyleCategory = {
  id: 'tweet_generator',
  name: 'Tweet Generator Settings',
  description: 'Settings specific to individual tweet generation',
  options: [
    {
      id: 'content_mix',
      label: 'Content Mix',
      hint: 'Balance of content types in your tweet pack',
      options: [
        { value: 'insight_heavy', label: 'Insight Heavy', hint: '60% insights, 20% opinions, 20% engagement.' },
        { value: 'balanced', label: 'Balanced', hint: '40% insights, 25% opinions, 20% engagement, 15% story.' },
        { value: 'engagement_focused', label: 'Engagement Focused', hint: '30% insights, 20% opinions, 40% engagement, 10% story.' },
        { value: 'storytelling', label: 'Storytelling', hint: '30% insights, 15% opinions, 15% engagement, 40% story.' }
      ]
    },
    {
      id: 'variation_style',
      label: 'Variation Style',
      hint: 'How different should tweets be from each other?',
      options: [
        { value: 'diverse', label: 'Diverse', hint: 'Each tweet feels unique. Maximum variety.' },
        { value: 'thematic', label: 'Thematic', hint: 'Tweets connect around central themes.' },
        { value: 'series', label: 'Series', hint: 'Numbered or connected tweets (not a thread).' }
      ]
    }
  ]
}

// ============================================
// THREAD BUILDER SPECIFIC OPTIONS
// ============================================

export const threadBuilderCategory: XStyleCategory = {
  id: 'thread_builder',
  name: 'Thread Builder Settings',
  description: 'Settings specific to thread generation (5-15 tweets)',
  options: [
    {
      id: 'thread_type',
      label: 'Thread Type',
      hint: 'The structure and format of the thread',
      options: [
        { value: 'how_to', label: 'How-To/Tutorial', hint: 'Step-by-step instructions. Teaching skills, processes.' },
        { value: 'listicle', label: 'Listicle', hint: 'Numbered tips/points. Quick value, highly scannable.' },
        { value: 'story', label: 'Story/Case Study', hint: 'Narrative arc. Personal brand, lessons learned.' },
        { value: 'contrarian', label: 'Contrarian/Hot Take', hint: 'Challenge → Evidence → Conclusion. Thought leadership.' },
        { value: 'breakdown', label: 'Breakdown/Analysis', hint: 'Deep analysis of topic/trend. Industry expertise.' },
        { value: 'lessons_learned', label: 'Lessons Learned', hint: 'Experience-based insights. Authenticity, relatability.' },
        { value: 'myth_busting', label: 'Myth Busting', hint: 'Common beliefs → Reality. Education, authority.' },
        { value: 'comparison', label: 'Comparison', hint: 'X vs Y analysis. Decision help, clarity.' },
        { value: 'behind_scenes', label: 'Behind the Scenes', hint: 'Process/journey reveal. Transparency, connection.' },
        { value: 'prediction', label: 'Prediction/Trend', hint: 'Future-focused analysis. Thought leadership.' }
      ]
    },
    {
      id: 'hook_style',
      label: 'Hook Style (First Tweet)',
      hint: 'First 3 seconds are critical for stopping the scroll',
      options: [
        { value: 'bold_statement', label: 'Bold Statement', hint: 'Controversial or surprising claim. Stops the scroll.' },
        { value: 'question', label: 'Question', hint: 'Thought-provoking question. Engages curiosity.' },
        { value: 'number_stat', label: 'Number/Stat', hint: 'Data-driven hook. "I analyzed 1,000 tweets..."' },
        { value: 'story_opening', label: 'Story Opening', hint: 'Narrative hook. "Last year I made a mistake..."' },
        { value: 'promise', label: 'Promise', hint: 'Value promise. "Here\'s how to X in Y steps"' },
        { value: 'contrarian', label: 'Contrarian', hint: 'Challenge common belief. "Everyone is wrong about..."' }
      ]
    },
    {
      id: 'final_tweet_style',
      label: 'Final Tweet Style',
      hint: 'How to end the thread',
      options: [
        { value: 'summary', label: 'Summary', hint: 'Recap key points. Clear takeaway.' },
        { value: 'cta', label: 'CTA', hint: 'Clear call to action. Follow, share, save.' },
        { value: 'question', label: 'Question', hint: 'Engagement prompt. Invites replies.' },
        { value: 'teaser', label: 'Teaser', hint: 'Hint at future content. Builds anticipation.' },
        { value: 'resource', label: 'Resource Link', hint: 'Link placement note (for first reply).' }
      ]
    },
    {
      id: 'visual_breaks',
      label: 'Visual Breaks',
      hint: 'Strategic breaks every 3-4 tweets increase completion by 45%',
      options: [
        { value: 'none', label: 'None', hint: 'Text only throughout.' },
        { value: 'suggested', label: 'Suggested', hint: 'Indicate where images would help.' },
        { value: 'emoji_dividers', label: 'Emoji Dividers', hint: 'Use emojis to break up text visually.' }
      ]
    }
  ]
}

// ============================================
// QUOTE TWEET CRAFTER SPECIFIC OPTIONS
// ============================================

export const quoteTweetCategory: XStyleCategory = {
  id: 'quote_tweet',
  name: 'Quote Tweet Settings',
  description: 'Settings specific to quote tweet generation (2x engagement of regular tweets)',
  options: [
    {
      id: 'input_mode',
      label: 'Input Mode',
      hint: 'What to generate quote tweets for',
      options: [
        { value: 'target_accounts', label: 'Target Accounts', hint: 'Create responses for specific accounts you want to engage.' },
        { value: 'trends', label: 'Trend Response', hint: 'Create responses to trending topics in your niche.' },
        { value: 'content_types', label: 'Content Type Templates', hint: 'Templates for responding to common post types.' }
      ]
    },
    {
      id: 'quote_type_mix',
      label: 'Quote Tweet Type Mix',
      hint: 'Types of responses to generate',
      options: [
        { value: 'value_focused', label: 'Value-Focused', hint: 'Mostly "Add Value" and "Expand" responses.' },
        { value: 'supportive', label: 'Supportive', hint: 'Mostly "Agree + Amplify" responses.' },
        { value: 'thought_leadership', label: 'Thought Leadership', hint: 'Mix of positions including respectful disagreement.' },
        { value: 'balanced', label: 'Balanced', hint: 'Even mix of all quote tweet types.' }
      ]
    },
    {
      id: 'relationship_intent',
      label: 'Relationship Intent',
      hint: 'What you want to achieve',
      options: [
        { value: 'visibility', label: 'Get Visibility', hint: 'Get noticed by large accounts.' },
        { value: 'networking', label: 'Build Relationships', hint: 'Genuine relationship building.' },
        { value: 'authority', label: 'Establish Authority', hint: 'Position as expert in space.' },
        { value: 'community', label: 'Community Engagement', hint: 'Engage with peers and community.' }
      ]
    }
  ]
}

// ============================================
// ALL X STYLE CATEGORIES
// ============================================

export const allXStyleCategories: XStyleCategory[] = [
  contentSourceCategory,
  voiceStyleCategory,
  platformOptimizationCategory,
  engagementCategory,
  tweetGeneratorCategory,
  threadBuilderCategory,
  quoteTweetCategory
]

// ============================================
// X STYLE PROFILE TYPES
// ============================================

export interface XStyleProfile {
  // Content Source
  source_type: string

  // Voice & Style
  voice_learning: string
  tone: string
  controversy_level: string
  emoji_usage: string

  // Platform Optimization
  trend_integration: string
  hashtag_strategy: string
  length_preference: string

  // Engagement
  engagement_style: string
  cta_approach: string

  // Tweet Generator Specific
  content_mix: string
  variation_style: string

  // Thread Builder Specific
  thread_type: string
  hook_style: string
  final_tweet_style: string
  visual_breaks: string

  // Quote Tweet Specific
  input_mode: string
  quote_type_mix: string
  relationship_intent: string
}

// ============================================
// DEFAULT X STYLE PROFILE
// ============================================

export const defaultXStyleProfile: XStyleProfile = {
  // Content Source
  source_type: 'original',

  // Voice & Style
  voice_learning: 'none',
  tone: 'conversational',
  controversy_level: 'mild_opinion',
  emoji_usage: 'minimal',

  // Platform Optimization
  trend_integration: 'light',
  hashtag_strategy: 'minimal',
  length_preference: 'standard',

  // Engagement
  engagement_style: 'mixed',
  cta_approach: 'soft',

  // Tweet Generator Specific
  content_mix: 'balanced',
  variation_style: 'diverse',

  // Thread Builder Specific
  thread_type: 'listicle',
  hook_style: 'promise',
  final_tweet_style: 'cta',
  visual_breaks: 'suggested',

  // Quote Tweet Specific
  input_mode: 'target_accounts',
  quote_type_mix: 'balanced',
  relationship_intent: 'networking'
}

// ============================================
// FORM DATA INTERFACES
// ============================================

export interface XTweetFormData {
  // Basic Info
  company: string
  industry: string
  topic: string
  audience: string
  goals?: string

  // Content Configuration
  tweetCount: number

  // Optional Content Sources
  sourceContent?: string // Blog, newsletter, podcast transcript
  sampleTweets?: string // For voice learning
  brandGuidelines?: string // Brand voice document

  // Additional Context
  additionalInfo?: string
  keywords?: string[]
  mustInclude?: string[]
  mustAvoid?: string[]
}

export interface XThreadFormData {
  // Basic Info
  company: string
  industry: string
  topic: string
  audience: string
  goals?: string

  // Thread Configuration
  threadLength: number // 3-15 tweets

  // Optional Content Sources
  sourceContent?: string
  sampleTweets?: string
  brandGuidelines?: string

  // Additional Context
  additionalInfo?: string
  keywords?: string[]
  mustInclude?: string[]
  mustAvoid?: string[]
}

export interface XQuoteTweetFormData {
  // Basic Info
  company: string
  industry: string
  audience: string
  goals?: string

  // Quote Tweet Configuration
  quoteTweetCount: number

  // Target Accounts (for target_accounts mode)
  targetAccounts?: string[] // @usernames

  // Trend Topics (for trends mode)
  trendTopics?: string[]

  // Optional Voice Learning
  sampleTweets?: string
  brandGuidelines?: string

  // Additional Context
  additionalInfo?: string
}

// ============================================
// PIPELINE RESULT INTERFACES
// ============================================

export interface GeneratedTweet {
  id: number
  text: string
  characterCount: number
  contentType: 'insight' | 'opinion' | 'question' | 'story' | 'promotional'
  engagementScore: number // 1-10
  hashtags?: string[]
  suggestedPostingTime?: string
  variations?: string[] // Alternative versions
}

export interface XTweetPipelineResult {
  tweets: GeneratedTweet[]
  trendBriefing?: {
    currentTrends: string[]
    relevantTopics: string[]
    avoidTopics: string[]
  }
  voiceProfile?: {
    summary: string
    keyPatterns: string[]
    phrasesToEmulate: string[]
  }
  qualityReport: {
    overallScore: number
    shadowbanRisk: 'low' | 'medium' | 'high'
    feedback: string[]
  }
  postingCalendar?: {
    recommendations: string[]
  }
  metadata: {
    tier: string
    processingStages: string[]
    totalTweets: number
  }
}

export interface GeneratedThreadTweet {
  position: number
  text: string
  characterCount: number
  purpose: string // 'hook' | 'point_1' | 'point_2' | ... | 'conclusion'
  visualBreakSuggestion?: string
}

export interface XThreadPipelineResult {
  thread: GeneratedThreadTweet[]
  hookVariations: string[] // 2-3 alternative hooks
  threadSummary: string
  firstReplyContent?: string // For link placement
  qualityReport: {
    overallScore: number
    hookScore: number
    flowScore: number
    engagementPrediction: number
    shadowbanRisk: 'low' | 'medium' | 'high'
    feedback: string[]
  }
  metadata: {
    tier: string
    processingStages: string[]
    threadType: string
    tweetCount: number
  }
}

export interface GeneratedQuoteTweet {
  id: number
  responseText: string
  characterCount: number
  targetContext: string // "When @user posts about X" or "When trending topic Y"
  quoteType: 'add_value' | 'agree_amplify' | 'respectful_disagree' | 'personal_experience' | 'ask_deeper' | 'summarize' | 'connect_dots' | 'humor'
  toneLabel: string
  expectedEngagementType: string
  timingGuidance: string
}

export interface XQuoteTweetPipelineResult {
  quoteTweets: GeneratedQuoteTweet[]
  targetBriefings?: {
    account: string
    recentThemes: string[]
    engagementTips: string[]
  }[]
  trendSummary?: {
    currentTrends: string[]
    opportunityAnalysis: string
  }
  strategyNotes: string
  qualityReport: {
    overallScore: number
    authenticityScore: number
    valueAddScore: number
    shadowbanRisk: 'low' | 'medium' | 'high'
    feedback: string[]
  }
  metadata: {
    tier: string
    processingStages: string[]
    inputMode: string
    quoteTweetCount: number
  }
}

// ============================================
// PRICING CONFIGURATION
// ============================================

export const X_PRICING = {
  tweetGenerator: {
    budget: {
      7: 2.50,   // 7 tweets
      14: 4.00,  // 14 tweets
      30: 7.50,  // 30 tweets
      60: 12.50, // 60 tweets
    },
    standard: {
      7: 6.00,
      14: 9.00,
      30: 17.50,
      60: 27.50,
    },
    premium: {
      7: 10.00,
      14: 17.50,
      30: 32.50,
      60: 50.00,
    }
  },
  threadBuilder: {
    budget: {
      mini: 3.00,     // 3-4 tweets
      standard: 5.00, // 5-7 tweets
      deep: 7.50,     // 8-10 tweets
      ultimate: 11.00 // 11-15 tweets
    },
    standard: {
      mini: 7.50,
      standard: 11.00,
      deep: 16.00,
      ultimate: 22.50
    },
    premium: {
      mini: 12.50,
      standard: 20.00,
      deep: 30.00,
      ultimate: 42.50
    }
  },
  quoteTweetCrafter: {
    budget: {
      10: 4.00,
      20: 7.00,
      30: 10.00
    },
    standard: {
      10: 9.00,
      20: 15.00,
      30: 21.00
    },
    premium: {
      10: 17.50,
      20: 27.50,
      30: 37.50
    }
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getStyleOptionByValue(
  categoryId: string,
  optionId: string,
  value: string
): { label: string; hint?: string } | undefined {
  const category = allXStyleCategories.find(c => c.id === categoryId)
  if (!category) return undefined

  const option = category.options.find(o => o.id === optionId)
  if (!option) return undefined

  return option.options.find(o => o.value === value)
}

export function validateStyleProfile(profile: Partial<XStyleProfile>): {
  isValid: boolean
  missingFields: string[]
  invalidValues: string[]
} {
  const requiredFields = Object.keys(defaultXStyleProfile)
  const missingFields: string[] = []
  const invalidValues: string[] = []

  for (const field of requiredFields) {
    if (!(field in profile) || profile[field as keyof XStyleProfile] === undefined) {
      missingFields.push(field)
    }
  }

  return {
    isValid: missingFields.length === 0 && invalidValues.length === 0,
    missingFields,
    invalidValues
  }
}

export function mergeWithDefaults(
  selections: Partial<XStyleProfile>
): XStyleProfile {
  return {
    ...defaultXStyleProfile,
    ...selections
  }
}
