/**
 * LinkedIn Content Style Options
 *
 * Comprehensive customization options for LinkedIn content generation.
 * Covers all four pipelines: Text Posts, Carousels, Articles/Newsletters, Polls.
 *
 * Based on 2025 LinkedIn platform research:
 * - 3,000 character limit for posts (including spaces)
 * - First 210 characters visible before "See More" (the hook zone)
 * - No native bold/italic - use Unicode sparingly
 * - 3-5 hashtags optimal (placed at end)
 * - Links in body kill reach by 40-50% - use first comment instead
 * - Algorithm favors dwell time, comments > reactions
 * - 24-hour post lifecycle (first 90 minutes critical)
 * - Document/carousel posts get 2.5-3x more reach than text
 */

// ============================================
// STYLE OPTION TYPES
// ============================================

export interface LinkedInStyleOption {
  id: string
  label: string
  hint: string
  options: { value: string; label: string; hint?: string }[]
}

export interface LinkedInStyleCategory {
  id: string
  name: string
  description: string
  options: LinkedInStyleOption[]
}

// ============================================
// CONTENT SOURCE OPTIONS
// ============================================

export const contentSourceCategory: LinkedInStyleCategory = {
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
        { value: 'blog_repurpose', label: 'Blog Post Repurpose', hint: 'Extract LinkedIn posts from your blog articles.' },
        { value: 'newsletter_repurpose', label: 'Newsletter Repurpose', hint: 'Turn newsletter issues into LinkedIn content.' },
        { value: 'podcast_repurpose', label: 'Podcast Transcript', hint: 'Extract key moments from podcast transcripts.' },
        { value: 'presentation_repurpose', label: 'Presentation Repurpose', hint: 'Convert slide decks into LinkedIn posts/carousels.' }
      ]
    }
  ]
}

// ============================================
// VOICE & STYLE OPTIONS
// ============================================

export const voiceStyleCategory: LinkedInStyleCategory = {
  id: 'voice_style',
  name: 'Voice & Style',
  description: 'How your LinkedIn content should sound',
  options: [
    {
      id: 'voice_learning',
      label: 'Voice Learning',
      hint: 'Should AI learn from your existing content?',
      options: [
        { value: 'none', label: 'No Learning', hint: 'Use default professional tone. Fast, no samples needed.' },
        { value: 'basic', label: 'Basic Voice Match', hint: 'Light style adaptation from 5-10 sample posts.' },
        { value: 'full_clone', label: 'Full Voice Clone', hint: 'Deep style replication from 20-50 sample posts.' },
        { value: 'brand_guide', label: 'Brand Guidelines', hint: 'Follow your brand voice document.' }
      ]
    },
    {
      id: 'tone',
      label: 'Tone',
      hint: 'The overall voice of your content',
      options: [
        { value: 'professional', label: 'Professional', hint: 'Business-appropriate, authoritative. B2B, consultants.' },
        { value: 'conversational', label: 'Conversational', hint: 'Friendly, approachable, like talking to a colleague.' },
        { value: 'bold_confident', label: 'Bold & Confident', hint: 'Strong opinions, challenges norms. Thought leadership.' },
        { value: 'educational', label: 'Educational', hint: 'Teaching, explaining, informative. Experts, educators.' },
        { value: 'storytelling', label: 'Storytelling', hint: 'Narrative, personal, relatable. Personal brands.' },
        { value: 'inspirational', label: 'Inspirational', hint: 'Motivating, uplifting. Leadership content.' }
      ]
    },
    {
      id: 'controversy_level',
      label: 'Opinion/Controversy Level',
      hint: 'How strong should opinions be? (Strong takes drive comments on LinkedIn)',
      options: [
        { value: 'safe', label: 'Safe', hint: 'Neutral, universally agreeable. Zero risk.' },
        { value: 'mild_opinion', label: 'Mild Opinion', hint: 'Light takes, soft positions. Very low risk.' },
        { value: 'clear_position', label: 'Clear Position', hint: 'Definite stance, may disagree with some. Low risk.' },
        { value: 'spicy', label: 'Spicy', hint: 'Contrarian, challenges conventional thinking. Higher engagement.' }
      ]
    },
    {
      id: 'emoji_usage',
      label: 'Emoji Usage',
      hint: 'How many emojis to include (LinkedIn prefers restrained usage)',
      options: [
        { value: 'none', label: 'None', hint: 'Clean, text-only. Corporate, executive.' },
        { value: 'minimal', label: 'Minimal (1-3)', hint: 'Strategic accent. Professional but approachable.' },
        { value: 'moderate', label: 'Moderate (4-6)', hint: 'Expressive, visual structure. Coaches, creators.' },
        { value: 'heavy', label: 'Heavy (7+)', hint: 'Very expressive. Personal brands, motivational.' }
      ]
    }
  ]
}

// ============================================
// PLATFORM OPTIMIZATION OPTIONS
// ============================================

export const platformOptimizationCategory: LinkedInStyleCategory = {
  id: 'platform_optimization',
  name: 'Platform Optimization',
  description: 'LinkedIn algorithm and platform-specific settings',
  options: [
    {
      id: 'trend_integration',
      label: 'Trend Integration',
      hint: 'How much to incorporate current LinkedIn trends',
      options: [
        { value: 'none', label: 'None (Evergreen)', hint: 'Timeless content only. No trend research.' },
        { value: 'light', label: 'Light', hint: 'Reference current themes if naturally relevant.' },
        { value: 'active', label: 'Active', hint: 'Actively incorporate trending topics in your niche.' }
      ]
    },
    {
      id: 'hashtag_strategy',
      label: 'Hashtag Strategy',
      hint: 'LinkedIn best practice: 3-5 hashtags at end of post',
      options: [
        { value: 'none', label: 'No Hashtags', hint: 'Clean, no hashtags. Works for established accounts.' },
        { value: 'minimal', label: 'Minimal (3)', hint: 'Three strategic hashtags. Professional approach.' },
        { value: 'standard', label: 'Standard (5)', hint: 'Five strategic hashtags. Optimal for discovery.' },
        { value: 'research_based', label: 'Research-Based', hint: 'AI researches optimal hashtags for your niche.' }
      ]
    },
    {
      id: 'post_length',
      label: 'Post Length Preference',
      hint: 'Longer posts with line breaks get more dwell time on LinkedIn',
      options: [
        { value: 'short_punchy', label: 'Short & Punchy (500-1000 chars)', hint: 'Quick reads. Tips, observations.' },
        { value: 'standard', label: 'Standard (1000-2000 chars)', hint: 'Balanced. Room for depth.' },
        { value: 'long_form', label: 'Long Form (2000-3000 chars)', hint: 'Maximum depth. Stories, frameworks.' }
      ]
    }
  ]
}

// ============================================
// ENGAGEMENT OPTIONS
// ============================================

export const engagementCategory: LinkedInStyleCategory = {
  id: 'engagement',
  name: 'Engagement Strategy',
  description: 'How to drive engagement with your content',
  options: [
    {
      id: 'engagement_style',
      label: 'Engagement Style',
      hint: 'How to prompt interaction (comments > reactions on LinkedIn)',
      options: [
        { value: 'broadcast', label: 'Broadcast', hint: 'Statements, insights, value delivery. Authority building.' },
        { value: 'conversational', label: 'Conversational', hint: 'Questions, invitations to comment. Community building.' },
        { value: 'mixed', label: 'Mixed', hint: 'Balance of both. Versatile content.' }
      ]
    },
    {
      id: 'cta_approach',
      label: 'Call-to-Action Approach',
      hint: 'How to ask for action',
      options: [
        { value: 'none', label: 'No CTA', hint: 'Let content speak for itself.' },
        { value: 'soft', label: 'Soft', hint: 'Gentle suggestions. "Worth considering..."' },
        { value: 'direct', label: 'Direct', hint: 'Clear asks. "Follow for more", "Save this post"' },
        { value: 'engagement_prompt', label: 'Engagement Prompt', hint: 'Comment prompts. "What do you think?", "Share your experience"' }
      ]
    },
    {
      id: 'first_comment_strategy',
      label: 'First Comment Strategy',
      hint: 'First comment boosts algorithm + is where links go',
      options: [
        { value: 'link_drop', label: 'Link Drop', hint: 'Place links in first comment to protect reach.' },
        { value: 'context_add', label: 'Add Context', hint: 'Expand on the post with additional insights.' },
        { value: 'question', label: 'Question', hint: 'Ask a follow-up question to spark discussion.' },
        { value: 'resource', label: 'Resource List', hint: 'Share related resources and tools.' }
      ]
    }
  ]
}

// ============================================
// CONTENT MIX OPTIONS
// ============================================

export const contentMixCategory: LinkedInStyleCategory = {
  id: 'content_mix',
  name: 'Content Mix',
  description: 'Balance of content types in your LinkedIn post pack',
  options: [
    {
      id: 'content_distribution',
      label: 'Content Distribution',
      hint: 'What types of posts to include',
      options: [
        { value: 'thought_leadership', label: 'Thought Leadership Heavy', hint: '60% insights, 20% stories, 20% engagement.' },
        { value: 'balanced', label: 'Balanced', hint: '30% insights, 25% stories, 25% engagement, 20% tips.' },
        { value: 'engagement_focused', label: 'Engagement Focused', hint: '20% insights, 20% stories, 40% engagement, 20% tips.' },
        { value: 'storytelling', label: 'Storytelling', hint: '20% insights, 50% stories, 15% engagement, 15% tips.' }
      ]
    },
    {
      id: 'hook_style',
      label: 'Hook Style',
      hint: 'First 210 characters must stop the scroll (before "See More")',
      options: [
        { value: 'bold_statement', label: 'Bold Statement', hint: 'Controversial or surprising claim. Stops the scroll.' },
        { value: 'question', label: 'Question', hint: 'Thought-provoking question. Engages curiosity.' },
        { value: 'number_stat', label: 'Number/Stat', hint: 'Data-driven hook. "I analyzed 1,000 companies..."' },
        { value: 'story_opening', label: 'Story Opening', hint: 'Narrative hook. "3 years ago I was fired..."' },
        { value: 'contrarian', label: 'Contrarian', hint: 'Challenge common belief. "Stop doing X..."' },
        { value: 'mixed', label: 'Mixed', hint: 'Vary hook types across posts for diversity.' }
      ]
    }
  ]
}

// ============================================
// TEXT POST SPECIFIC OPTIONS
// ============================================

export const textPostCategory: LinkedInStyleCategory = {
  id: 'text_post',
  name: 'Text Post Settings',
  description: 'Settings specific to LinkedIn text post generation',
  options: [
    {
      id: 'formatting_style',
      label: 'Formatting Style',
      hint: 'How to structure the post visually (line breaks matter on LinkedIn)',
      options: [
        { value: 'short_lines', label: 'Short Lines', hint: 'One sentence per line. Maximum readability, dwell time.' },
        { value: 'paragraphs', label: 'Short Paragraphs', hint: '2-3 sentence paragraphs. More traditional, professional.' },
        { value: 'mixed', label: 'Mixed', hint: 'Combine single lines and short paragraphs strategically.' },
        { value: 'list_format', label: 'List Format', hint: 'Numbered/bulleted key points. High save rate.' }
      ]
    },
    {
      id: 'variation_style',
      label: 'Variation Style',
      hint: 'How different should posts be from each other?',
      options: [
        { value: 'diverse', label: 'Diverse', hint: 'Each post feels unique. Maximum variety.' },
        { value: 'thematic', label: 'Thematic', hint: 'Posts connect around central themes.' },
        { value: 'series', label: 'Series', hint: 'Connected posts that build on each other.' }
      ]
    }
  ]
}

// ============================================
// CAROUSEL SPECIFIC OPTIONS
// ============================================

export const carouselCategory: LinkedInStyleCategory = {
  id: 'carousel',
  name: 'Carousel Settings',
  description: 'Settings specific to LinkedIn carousel/document posts (2.5-3x more reach)',
  options: [
    {
      id: 'carousel_type',
      label: 'Carousel Type',
      hint: 'The structure and format of the carousel',
      options: [
        { value: 'how_to', label: 'How-To/Tutorial', hint: 'Step-by-step instructions. Teaching skills.' },
        { value: 'listicle', label: 'Listicle', hint: 'Numbered tips/points. Quick value, scannable.' },
        { value: 'story', label: 'Story/Case Study', hint: 'Narrative arc across slides. Personal brand.' },
        { value: 'framework', label: 'Framework/Model', hint: 'Present a mental model or decision framework.' },
        { value: 'comparison', label: 'Comparison', hint: 'X vs Y analysis across slides.' },
        { value: 'myth_busting', label: 'Myth Busting', hint: 'Common beliefs vs reality. Education.' }
      ]
    },
    {
      id: 'slide_count',
      label: 'Slide Count',
      hint: 'Optimal carousel length (8-12 slides perform best)',
      options: [
        { value: 'short', label: 'Short (5-7 slides)', hint: 'Quick read. Single concept.' },
        { value: 'standard', label: 'Standard (8-10 slides)', hint: 'Optimal length. Good depth and engagement.' },
        { value: 'long', label: 'Long (11-15 slides)', hint: 'Deep dives. Maximum dwell time.' }
      ]
    },
    {
      id: 'visual_style',
      label: 'Visual Style Direction',
      hint: 'Art direction for carousel slides',
      options: [
        { value: 'clean_minimal', label: 'Clean & Minimal', hint: 'White space, clear typography. Professional.' },
        { value: 'bold_graphic', label: 'Bold & Graphic', hint: 'Strong colors, large text. Eye-catching.' },
        { value: 'branded', label: 'Brand-Consistent', hint: 'Match your brand colors and style.' },
        { value: 'infographic', label: 'Infographic', hint: 'Data visualization, charts, icons.' }
      ]
    }
  ]
}

// ============================================
// ARTICLE/NEWSLETTER SPECIFIC OPTIONS
// ============================================

export const articleCategory: LinkedInStyleCategory = {
  id: 'article',
  name: 'Article/Newsletter Settings',
  description: 'Settings for LinkedIn long-form articles and newsletters',
  options: [
    {
      id: 'article_type',
      label: 'Article Type',
      hint: 'The structure and purpose of the article',
      options: [
        { value: 'thought_leadership', label: 'Thought Leadership', hint: 'Original perspectives, industry vision.' },
        { value: 'how_to', label: 'How-To Guide', hint: 'Step-by-step tutorial with depth.' },
        { value: 'analysis', label: 'Industry Analysis', hint: 'Data-driven breakdown of trends.' },
        { value: 'case_study', label: 'Case Study', hint: 'Real-world success story with lessons.' },
        { value: 'opinion', label: 'Opinion/Essay', hint: 'Personal perspective on industry topic.' }
      ]
    },
    {
      id: 'article_length',
      label: 'Article Length',
      hint: 'LinkedIn articles perform best at 1,000-2,000 words',
      options: [
        { value: 'short', label: 'Short (800-1,200 words)', hint: 'Focused piece. Single argument.' },
        { value: 'standard', label: 'Standard (1,200-2,000 words)', hint: 'Optimal length. Good depth.' },
        { value: 'deep_dive', label: 'Deep Dive (2,000-3,000 words)', hint: 'Comprehensive analysis. Expert audience.' }
      ]
    },
    {
      id: 'companion_post_style',
      label: 'Companion Post Style',
      hint: 'The LinkedIn post that promotes the article',
      options: [
        { value: 'teaser', label: 'Teaser', hint: 'Tease key insights to drive clicks.' },
        { value: 'summary', label: 'Summary', hint: 'Key takeaways with link to full article.' },
        { value: 'story_hook', label: 'Story Hook', hint: 'Personal story that leads to article.' },
        { value: 'question', label: 'Question', hint: 'Provocative question answered in article.' }
      ]
    }
  ]
}

// ============================================
// POLL SPECIFIC OPTIONS
// ============================================

export const pollCategory: LinkedInStyleCategory = {
  id: 'poll',
  name: 'Poll Settings',
  description: 'Settings for LinkedIn polls (high engagement, algorithm-favored)',
  options: [
    {
      id: 'poll_type',
      label: 'Poll Type',
      hint: 'What kind of poll to create',
      options: [
        { value: 'opinion', label: 'Opinion Poll', hint: 'Which approach/tool/method is best?' },
        { value: 'prediction', label: 'Prediction', hint: 'What will happen in the industry? Future-focused.' },
        { value: 'experience', label: 'Experience', hint: 'Have you experienced X? Reality check.' },
        { value: 'controversial', label: 'Controversial', hint: 'Divisive topic where people disagree. High engagement.' },
        { value: 'fun', label: 'Fun/Lighthearted', hint: 'Relatable workplace humor. Community building.' }
      ]
    },
    {
      id: 'poll_duration',
      label: 'Poll Duration',
      hint: 'How long the poll should run',
      options: [
        { value: '1_day', label: '1 Day', hint: 'Quick engagement burst. Time-sensitive topics.' },
        { value: '3_days', label: '3 Days', hint: 'Standard duration. Good balance.' },
        { value: '1_week', label: '1 Week', hint: 'Maximum reach. Evergreen topics.' },
        { value: '2_weeks', label: '2 Weeks', hint: 'Extended reach. Industry surveys.' }
      ]
    },
    {
      id: 'follow_up_strategy',
      label: 'Follow-Up Strategy',
      hint: 'How to leverage poll results after it ends',
      options: [
        { value: 'results_post', label: 'Results Analysis Post', hint: 'Share insights from the poll results.' },
        { value: 'carousel', label: 'Results Carousel', hint: 'Turn results into a visual carousel.' },
        { value: 'article', label: 'Deep Dive Article', hint: 'Write an article expanding on the topic.' },
        { value: 'none', label: 'No Follow-Up', hint: 'Standalone poll.' }
      ]
    }
  ]
}

// ============================================
// ALL LINKEDIN STYLE CATEGORIES
// ============================================

export const allLinkedInStyleCategories: LinkedInStyleCategory[] = [
  contentSourceCategory,
  voiceStyleCategory,
  platformOptimizationCategory,
  engagementCategory,
  contentMixCategory,
  textPostCategory,
  carouselCategory,
  articleCategory,
  pollCategory
]

// ============================================
// LINKEDIN STYLE PROFILE TYPES
// ============================================

export interface LinkedInStyleProfile {
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
  post_length: string

  // Engagement
  engagement_style: string
  cta_approach: string
  first_comment_strategy: string

  // Content Mix
  content_distribution: string
  hook_style: string

  // Text Post Specific
  formatting_style: string
  variation_style: string

  // Carousel Specific
  carousel_type: string
  slide_count: string
  visual_style: string

  // Article Specific
  article_type: string
  article_length: string
  companion_post_style: string

  // Poll Specific
  poll_type: string
  poll_duration: string
  follow_up_strategy: string
}

// ============================================
// DEFAULT LINKEDIN STYLE PROFILE
// ============================================

export const defaultLinkedInStyleProfile: LinkedInStyleProfile = {
  // Content Source
  source_type: 'original',

  // Voice & Style
  voice_learning: 'none',
  tone: 'bold_confident',
  controversy_level: 'clear_position',
  emoji_usage: 'minimal',

  // Platform Optimization
  trend_integration: 'light',
  hashtag_strategy: 'minimal',
  post_length: 'standard',

  // Engagement
  engagement_style: 'mixed',
  cta_approach: 'engagement_prompt',
  first_comment_strategy: 'context_add',

  // Content Mix
  content_distribution: 'balanced',
  hook_style: 'mixed',

  // Text Post Specific
  formatting_style: 'short_lines',
  variation_style: 'diverse',

  // Carousel Specific
  carousel_type: 'listicle',
  slide_count: 'standard',
  visual_style: 'clean_minimal',

  // Article Specific
  article_type: 'thought_leadership',
  article_length: 'standard',
  companion_post_style: 'teaser',

  // Poll Specific
  poll_type: 'opinion',
  poll_duration: '3_days',
  follow_up_strategy: 'results_post'
}

// ============================================
// FORM DATA INTERFACES
// ============================================

export interface LinkedInTextPostFormData {
  company: string
  industry: string
  topic: string
  audience: string
  goals?: string
  postCount: number
  sourceContent?: string
  samplePosts?: string
  brandGuidelines?: string
  additionalInfo?: string
  keywords?: string[]
  mustInclude?: string[]
  mustAvoid?: string[]
  generateImages?: boolean
  referenceImageUrl?: string
  referenceImageExplanation?: string
}

export interface LinkedInCarouselFormData {
  company: string
  industry: string
  topic: string
  audience: string
  goals?: string
  carouselCount: number
  sourceContent?: string
  samplePosts?: string
  brandGuidelines?: string
  additionalInfo?: string
  keywords?: string[]
  mustInclude?: string[]
  mustAvoid?: string[]
  generateImages?: boolean
  referenceImageUrl?: string
  referenceImageExplanation?: string
  brandColors?: string[]
}

export interface LinkedInArticleFormData {
  company: string
  industry: string
  topic: string
  audience: string
  goals?: string
  articleCount: number
  sourceContent?: string
  samplePosts?: string
  brandGuidelines?: string
  additionalInfo?: string
  keywords?: string[]
  mustInclude?: string[]
  mustAvoid?: string[]
  generateImages?: boolean
  referenceImageUrl?: string
  referenceImageExplanation?: string
}

export interface LinkedInPollFormData {
  company: string
  industry: string
  topic: string
  audience: string
  goals?: string
  pollCount: number
  samplePosts?: string
  brandGuidelines?: string
  additionalInfo?: string
  keywords?: string[]
  mustInclude?: string[]
  mustAvoid?: string[]
}

// ============================================
// PIPELINE RESULT INTERFACES
// ============================================

export interface GeneratedLinkedInPost {
  id: number
  text: string
  characterCount: number
  hookText: string
  contentType: 'insight' | 'opinion' | 'story' | 'tip' | 'engagement' | 'promotional'
  engagementScore: number
  hashtags: string[]
  firstComment: string
  suggestedPostingTime: string
  variations?: string[]
}

export interface LinkedInTextPostPipelineResult {
  posts: GeneratedLinkedInPost[]
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
    algorithmScore: number
    feedback: string[]
  }
  postingCalendar: {
    recommendations: string[]
  }
  metadata: {
    tier: string
    processingStages: string[]
    totalPosts: number
  }
}

export interface CarouselSlide {
  slideNumber: number
  headline: string
  body: string
  visualDirection: string
  speakerNotes?: string
}

export interface GeneratedCarousel {
  id: number
  caption: string
  captionCharacterCount: number
  hookText: string
  slides: CarouselSlide[]
  hashtags: string[]
  firstComment: string
  engagementScore: number
  suggestedPostingTime: string
}

export interface LinkedInCarouselPipelineResult {
  carousels: GeneratedCarousel[]
  trendBriefing?: {
    currentTrends: string[]
    relevantTopics: string[]
  }
  voiceProfile?: {
    summary: string
    keyPatterns: string[]
  }
  qualityReport: {
    overallScore: number
    algorithmScore: number
    feedback: string[]
  }
  metadata: {
    tier: string
    processingStages: string[]
    totalCarousels: number
  }
}

export interface GeneratedArticle {
  id: number
  title: string
  subtitle: string
  body: string
  wordCount: number
  sections: { heading: string; content: string }[]
  companionPost: string
  companionPostFirstComment: string
  hashtags: string[]
  seoKeywords: string[]
  engagementScore: number
}

export interface LinkedInArticlePipelineResult {
  articles: GeneratedArticle[]
  trendBriefing?: {
    currentTrends: string[]
    relevantTopics: string[]
  }
  voiceProfile?: {
    summary: string
    keyPatterns: string[]
  }
  qualityReport: {
    overallScore: number
    depthScore: number
    feedback: string[]
  }
  metadata: {
    tier: string
    processingStages: string[]
    totalArticles: number
  }
}

export interface GeneratedPoll {
  id: number
  question: string
  questionCharacterCount: number
  options: string[]
  companionText: string
  companionTextCharacterCount: number
  firstComment: string
  pollType: string
  suggestedDuration: string
  engagementScore: number
  followUpTemplate?: string
  suggestedPostingTime: string
}

export interface LinkedInPollPipelineResult {
  polls: GeneratedPoll[]
  trendBriefing?: {
    currentTrends: string[]
    relevantTopics: string[]
  }
  qualityReport: {
    overallScore: number
    engagementPrediction: number
    feedback: string[]
  }
  contentLoopPlan?: {
    pollToPostConnections: string[]
    recommendations: string[]
  }
  metadata: {
    tier: string
    processingStages: string[]
    totalPolls: number
  }
}

// ============================================
// PRICING CONFIGURATION
// ============================================

export const LINKEDIN_PRICING = {
  textPosts: {
    budget: {
      5: 4.00,
      10: 7.00,
      15: 10.00,
      30: 17.50
    },
    standard: {
      5: 9.00,
      10: 15.00,
      15: 22.00,
      30: 37.50
    },
    premium: {
      5: 15.00,
      10: 27.50,
      15: 40.00,
      30: 65.00
    }
  },
  carousels: {
    budget: {
      1: 5.00,
      3: 12.00,
      5: 18.00
    },
    standard: {
      1: 10.00,
      3: 25.00,
      5: 40.00
    },
    premium: {
      1: 18.00,
      3: 45.00,
      5: 70.00
    }
  },
  articles: {
    budget: {
      1: 8.00,
      2: 14.00,
      3: 20.00
    },
    standard: {
      1: 18.00,
      2: 32.00,
      3: 45.00
    },
    premium: {
      1: 30.00,
      2: 55.00,
      3: 75.00
    }
  },
  polls: {
    budget: {
      5: 3.00,
      10: 5.00,
      15: 7.50
    },
    standard: {
      5: 7.00,
      10: 12.00,
      15: 17.50
    },
    premium: {
      5: 12.00,
      10: 22.00,
      15: 32.00
    }
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getLinkedInStyleOptionByValue(
  categoryId: string,
  optionId: string,
  value: string
): { label: string; hint?: string } | undefined {
  const category = allLinkedInStyleCategories.find(c => c.id === categoryId)
  if (!category) return undefined

  const option = category.options.find(o => o.id === optionId)
  if (!option) return undefined

  return option.options.find(o => o.value === value)
}

export function validateLinkedInStyleProfile(profile: Partial<LinkedInStyleProfile>): {
  isValid: boolean
  missingFields: string[]
  invalidValues: string[]
} {
  const requiredFields = Object.keys(defaultLinkedInStyleProfile)
  const missingFields: string[] = []
  const invalidValues: string[] = []

  for (const field of requiredFields) {
    if (!(field in profile) || profile[field as keyof LinkedInStyleProfile] === undefined) {
      missingFields.push(field)
    }
  }

  return {
    isValid: missingFields.length === 0 && invalidValues.length === 0,
    missingFields,
    invalidValues
  }
}

export function mergeWithLinkedInDefaults(
  selections: Partial<LinkedInStyleProfile>
): LinkedInStyleProfile {
  return {
    ...defaultLinkedInStyleProfile,
    ...selections
  }
}
