/**
 * Scribengine Knowledge Base
 *
 * This file contains comprehensive information about all Scribengine services,
 * their configurations, style options, and recommendation logic.
 *
 * IMPORTANT: When adding new pipelines, add them to the SERVICES object below
 * following the existing pattern. The Content Architect pipeline uses this
 * data to recommend appropriate services to users.
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export type QualityTier = 'budget' | 'standard' | 'premium'

export interface ServiceTierConfig {
  models: string[]
  features: string[]
  searchQueries?: number
  analysisDepth?: 'basic' | 'moderate' | 'deep'
  price: number
}

export interface ServiceRecommendation {
  goals: string[]
  challenges: string[]
  industries: string[]
  audienceTypes: string[]
  contentTypes: string[]
}

export interface ServiceConfig {
  id: string
  name: string
  icon: string
  category: 'content' | 'social' | 'email' | 'seo' | 'ads' | 'strategy'
  description: string
  shortDescription: string

  // Tier configurations
  tiers: {
    budget: ServiceTierConfig
    standard: ServiceTierConfig
    premium: ServiceTierConfig
  }

  // What this service delivers
  deliverables: string[]

  // Key features
  features: string[]

  // Style customization options (reference to style categories)
  styleCategories: string[]

  // When to recommend this service
  recommendWhen: ServiceRecommendation

  // When NOT to recommend
  avoidWhen?: string[]

  // Typical use cases with examples
  useCases: {
    title: string
    description: string
    exampleInput?: string
  }[]

  // Input requirements
  requiredInputs: string[]
  optionalInputs: string[]

  // For services with images
  supportsImages?: boolean
  imageOptions?: string[]

  // Pipeline stages (for transparency)
  pipelineStages: string[]

  // Estimated processing time in seconds
  estimatedTime: {
    budget: number
    standard: number
    premium: number
  }

  // Is this service currently available?
  available: boolean
  comingSoon?: boolean
}

// ============================================
// SCRIBENGINE SERVICES DATABASE
// ============================================

export const SERVICES: Record<string, ServiceConfig> = {
  'blog-post': {
    id: 'blog-post',
    name: 'Blog Content Pipeline',
    icon: '📝',
    category: 'content',
    description: 'SEO-optimized blog articles with multi-model AI generation, research, and quality assurance. Uses a sophisticated multi-stage pipeline with writing, critique, and revision stages.',
    shortDescription: 'SEO-optimized blog articles',

    tiers: {
      budget: {
        models: ['GPT-4o-mini', 'GPT-4o'],
        features: ['Basic research', '4 search queries', 'Quality review'],
        searchQueries: 4,
        analysisDepth: 'basic',
        price: 5, // Base price for standard length
      },
      standard: {
        models: ['GPT-4.1-nano', 'GPT-4.1', 'GPT-4o', 'Claude Sonnet'],
        features: ['Enhanced research', '7 search queries', 'Claude Sonnet revision', 'Style learning'],
        searchQueries: 7,
        analysisDepth: 'moderate',
        price: 10,
      },
      premium: {
        models: ['Claude Haiku', 'Claude Sonnet', 'Claude Opus'],
        features: ['Comprehensive research', 'Live web search', 'Claude Opus polish', 'Expert-level quality'],
        searchQueries: 10,
        analysisDepth: 'deep',
        price: 20,
      },
    },

    deliverables: [
      'Full article (1,000-7,000 words based on length tier)',
      'SEO meta description',
      'Alternative headline options',
      'Quality assurance report',
    ],

    features: [
      'Multi-model AI pipeline',
      'Style learning from samples',
      'SEO optimization',
      '18 style customization categories',
      'Automatic research and fact-finding',
      'Quality critique and revision',
    ],

    styleCategories: [
      'tone_of_voice',
      'writing_style',
      'audience_sophistication',
      'content_depth',
      'brand_personality',
      'emotional_appeal',
      'perspective_voice',
      'content_purpose',
      'opening_hook',
      'cta_style',
      'competitive_positioning',
      'formatting_preferences',
      'evidence_credibility',
      'humor_personality',
      'controversy_opinion',
      'seo_discoverability',
      'content_freshness',
      'industry_compliance',
    ],

    recommendWhen: {
      goals: ['seo_ranking', 'thought_leadership', 'lead_generation', 'brand_awareness', 'education'],
      challenges: ['low_organic_traffic', 'no_blog_presence', 'outdated_content', 'poor_seo', 'need_authority'],
      industries: ['all'], // Suitable for all industries
      audienceTypes: ['b2b', 'b2c', 'professional', 'consumer', 'technical', 'non_technical'],
      contentTypes: ['educational', 'how_to', 'listicle', 'opinion', 'case_study', 'comparison'],
    },

    useCases: [
      {
        title: 'SEO Content Strategy',
        description: 'Create cornerstone content to rank for target keywords',
        exampleInput: 'How to Choose the Right CRM for Small Business',
      },
      {
        title: 'Thought Leadership',
        description: 'Establish expertise with in-depth industry analysis',
        exampleInput: 'The Future of AI in Healthcare: 2025 Predictions',
      },
      {
        title: 'Product Education',
        description: 'Explain complex products or services to potential customers',
        exampleInput: 'Complete Guide to Cloud Migration for Enterprise',
      },
    ],

    requiredInputs: ['topic', 'company', 'audience'],
    optionalInputs: ['goals', 'sampleArticles', 'additionalInfo', 'keywords'],

    pipelineStages: [
      'Process additional info',
      'Infer style profile',
      'Learn from samples',
      'Prompt engineering',
      'Research phase',
      'Research summary',
      'Content writing',
      'Quality critique',
      'Final revision',
    ],

    estimatedTime: {
      budget: 60,
      standard: 90,
      premium: 120,
    },

    available: true,
  },

  'instagram': {
    id: 'instagram',
    name: 'Instagram Content Pipeline',
    icon: '📸',
    category: 'social',
    description: 'Complete Instagram content creation with captions, hashtags, alt text, and optional AI-generated images. Includes carousel support, hashtag research, and visual direction.',
    shortDescription: 'Instagram posts with captions & images',

    tiers: {
      budget: {
        models: ['GPT-4o-mini', 'GPT-4.1'],
        features: ['8-stage pipeline', 'AI-generated hashtags', 'DALL-E 3 images'],
        analysisDepth: 'basic',
        price: 12,
      },
      standard: {
        models: ['GPT-4o-mini', 'GPT-4.1', 'GPT-4o', 'Claude Sonnet'],
        features: ['10-stage pipeline', 'RiteTag API hashtags', 'Claude Sonnet captions', 'Enhanced visual prompts'],
        analysisDepth: 'moderate',
        price: 22,
      },
      premium: {
        models: ['GPT-4o', 'GPT-4.1', 'Claude Sonnet'],
        features: ['13-stage pipeline', 'Hook specialist agent', 'Ideogram for text slides', 'Visual director', 'Reference image analysis'],
        analysisDepth: 'deep',
        price: 45,
      },
    },

    deliverables: [
      'Optimized caption',
      'Strategic hashtag set',
      'Alt text for accessibility',
      'Carousel slide content (if applicable)',
      'AI-generated images (optional)',
      'Quality score and feedback',
    ],

    features: [
      'Multi-stage pipeline',
      'Real-time hashtag analytics (Standard+)',
      'AI image generation',
      'Reference image style matching',
      'SEO keyword integration',
      'Engagement optimization',
    ],

    styleCategories: [
      'caption_tone',
      'emoji_usage',
      'cta_style',
      'content_format',
      'hashtag_strategy',
      'hashtag_placement',
      'image_style',
      'image_mood',
      'color_scheme',
      'post_format',
    ],

    recommendWhen: {
      goals: ['brand_awareness', 'social_growth', 'engagement', 'community_building', 'product_showcase'],
      challenges: ['no_visual_content', 'inconsistent_posting', 'low_engagement', 'poor_hashtags', 'no_instagram_presence'],
      industries: ['fashion', 'food', 'beauty', 'fitness', 'travel', 'lifestyle', 'retail', 'real_estate', 'photography', 'art'],
      audienceTypes: ['b2c', 'consumer', 'younger_demographics', 'visual_learners'],
      contentTypes: ['carousel', 'single_post', 'reels_cover', 'story'],
    },

    avoidWhen: [
      'B2B enterprise with no consumer presence',
      'Purely technical/developer audience',
      'Text-only content requirement',
    ],

    useCases: [
      {
        title: 'Educational Carousel',
        description: 'Create informative multi-slide content that drives saves',
        exampleInput: '5 Tips for Better Sleep',
      },
      {
        title: 'Product Launch',
        description: 'Showcase new products with compelling visuals',
        exampleInput: 'Summer Collection 2025 Announcement',
      },
      {
        title: 'Behind the Scenes',
        description: 'Build connection with authentic content',
        exampleInput: 'A Day in Our Coffee Roastery',
      },
    ],

    requiredInputs: ['topic', 'company', 'audience'],
    optionalInputs: ['goals', 'contentType', 'imageOptions', 'additionalInfo'],

    supportsImages: true,
    imageOptions: ['photography', 'illustration', 'minimalist', '3d_render', 'flat_design', 'watercolor'],

    pipelineStages: [
      'Input processing',
      'Reference image analysis (optional)',
      'Research & strategy',
      'Content architecture',
      'Caption writing',
      'Hashtag & SEO optimization',
      'Visual prompt engineering',
      'Image generation (optional)',
      'Quality review',
      'Final polish',
    ],

    estimatedTime: {
      budget: 45,
      standard: 75,
      premium: 120,
    },

    available: true,
  },

  'social-pack': {
    id: 'social-pack',
    name: 'Social Media Package',
    icon: '📱',
    category: 'social',
    description: '30 social media posts across LinkedIn, Twitter/X, and Instagram. Includes hashtag strategy and content calendar recommendations.',
    shortDescription: '30 posts for LinkedIn, Twitter, Instagram',

    tiers: {
      budget: {
        models: ['GPT-4o-mini', 'GPT-4o'],
        features: ['Basic post generation', 'Standard hashtags'],
        price: 12,
      },
      standard: {
        models: ['GPT-4.1', 'GPT-4o', 'Claude Sonnet'],
        features: ['Platform-optimized posts', 'Hashtag research', 'Posting time recommendations'],
        price: 22,
      },
      premium: {
        models: ['Claude Sonnet', 'Claude Opus'],
        features: ['Expert copywriting', 'Full content calendar', 'A/B variants', 'Engagement optimization'],
        price: 45,
      },
    },

    deliverables: [
      '10 LinkedIn posts',
      '10 Twitter/X posts',
      '10 Instagram captions',
      'Hashtag strategy',
      'Content calendar suggestions',
    ],

    features: [
      'Multi-platform optimization',
      'Platform-specific formatting',
      'Hashtag strategy',
      'Best posting time recommendations',
    ],

    styleCategories: [
      'tone_of_voice',
      'brand_personality',
      'emotional_appeal',
      'cta_style',
    ],

    recommendWhen: {
      goals: ['social_growth', 'brand_awareness', 'engagement', 'consistent_posting'],
      challenges: ['no_time_for_social', 'inconsistent_posting', 'writer_block', 'need_content_variety'],
      industries: ['all'],
      audienceTypes: ['b2b', 'b2c', 'professional', 'consumer'],
      contentTypes: ['thought_leadership', 'tips', 'announcements', 'engagement_posts'],
    },

    useCases: [
      {
        title: 'Monthly Content',
        description: 'Fill your content calendar for the month',
        exampleInput: 'Tech startup targeting small business owners',
      },
    ],

    requiredInputs: ['company', 'industry', 'topics', 'audience'],
    optionalInputs: ['tone', 'cta', 'hashtags'],

    pipelineStages: [
      'Brand analysis',
      'Topic expansion',
      'LinkedIn post generation',
      'Twitter/X post generation',
      'Instagram caption generation',
      'Hashtag strategy',
      'Calendar optimization',
    ],

    estimatedTime: {
      budget: 60,
      standard: 90,
      premium: 120,
    },

    available: true,
  },

  'email-sequence': {
    id: 'email-sequence',
    name: 'Email Sequence',
    icon: '📧',
    category: 'email',
    description: 'High-converting 5-email nurture/sales sequence with subject lines, preview text, and strategic timing recommendations.',
    shortDescription: '5-email nurture/sales sequence',

    tiers: {
      budget: {
        models: ['GPT-4o-mini', 'GPT-4o'],
        features: ['Standard email copy', 'Subject line options'],
        price: 15,
      },
      standard: {
        models: ['GPT-4.1', 'GPT-4o', 'Claude Sonnet'],
        features: ['Conversion-optimized copy', 'Multiple subject lines', 'Preview text', 'Timing recommendations'],
        price: 28,
      },
      premium: {
        models: ['Claude Sonnet', 'Claude Opus'],
        features: ['Expert copywriting', 'A/B testing variants', 'Personalization tokens', 'Full sequence strategy'],
        price: 55,
      },
    },

    deliverables: [
      '5 complete emails',
      '3 subject line options per email',
      'Preview text suggestions',
      'CTA button text',
      'Send timing recommendations',
      'Sequence strategy notes',
    ],

    features: [
      'Conversion-focused copywriting',
      'Multiple subject line variants',
      'Strategic sequence planning',
      'Personalization guidance',
    ],

    styleCategories: [
      'tone_of_voice',
      'emotional_appeal',
      'cta_style',
      'brand_personality',
    ],

    recommendWhen: {
      goals: ['lead_nurturing', 'sales_conversion', 'onboarding', 'customer_retention', 'product_launch'],
      challenges: ['low_email_open_rates', 'poor_conversion', 'no_email_strategy', 'need_automation'],
      industries: ['saas', 'ecommerce', 'b2b_services', 'coaching', 'courses'],
      audienceTypes: ['leads', 'prospects', 'customers', 'subscribers'],
      contentTypes: ['welcome_sequence', 'sales_sequence', 'nurture_sequence', 'launch_sequence'],
    },

    useCases: [
      {
        title: 'Welcome Sequence',
        description: 'Onboard new subscribers and introduce your brand',
        exampleInput: 'SaaS free trial welcome sequence',
      },
      {
        title: 'Sales Sequence',
        description: 'Convert leads into customers',
        exampleInput: 'Course launch sales emails',
      },
    ],

    requiredInputs: ['goal', 'company', 'product', 'audience'],
    optionalInputs: ['painPoints', 'tone', 'cta'],

    pipelineStages: [
      'Audience analysis',
      'Sequence strategy',
      'Email 1: Hook/Introduction',
      'Email 2: Value/Education',
      'Email 3: Social proof',
      'Email 4: Objection handling',
      'Email 5: CTA/Close',
      'Subject line optimization',
    ],

    estimatedTime: {
      budget: 45,
      standard: 60,
      premium: 90,
    },

    available: true,
  },

  'seo-report': {
    id: 'seo-report',
    name: 'SEO Content Audit',
    icon: '📊',
    category: 'seo',
    description: 'Comprehensive content audit and strategy report with keyword opportunities, competitor analysis, and actionable recommendations.',
    shortDescription: 'Content strategy & SEO audit',

    tiers: {
      budget: {
        models: ['GPT-4o-mini', 'GPT-4o'],
        features: ['Basic audit', 'Keyword suggestions', '5 content recommendations'],
        price: 20,
      },
      standard: {
        models: ['GPT-4.1', 'GPT-4o', 'Claude Sonnet'],
        features: ['Detailed audit', 'Competitor analysis', '10 content recommendations', 'Content calendar'],
        price: 35,
      },
      premium: {
        models: ['Claude Sonnet', 'Claude Opus'],
        features: ['Comprehensive audit', 'Deep competitor analysis', 'Full content strategy', 'Technical SEO notes'],
        price: 65,
      },
    },

    deliverables: [
      'Executive summary',
      'Content audit findings',
      'Keyword opportunity analysis',
      'Competitor content analysis',
      'Recommended content strategy',
      'Content calendar recommendations',
      'Technical SEO recommendations',
      'Prioritized action items',
    ],

    features: [
      'Keyword research',
      'Competitor analysis',
      'Content gap identification',
      'Strategic recommendations',
    ],

    styleCategories: [],

    recommendWhen: {
      goals: ['seo_ranking', 'content_strategy', 'competitive_advantage', 'traffic_growth'],
      challenges: ['no_content_strategy', 'losing_to_competitors', 'dont_know_what_to_write', 'poor_rankings'],
      industries: ['all'],
      audienceTypes: ['all'],
      contentTypes: ['strategy', 'audit', 'planning'],
    },

    useCases: [
      {
        title: 'Content Strategy',
        description: 'Develop a data-driven content plan',
        exampleInput: 'Tech startup entering crowded market',
      },
    ],

    requiredInputs: ['website', 'company', 'industry', 'competitors'],
    optionalInputs: ['currentKeywords', 'goals'],

    pipelineStages: [
      'Website analysis',
      'Keyword research',
      'Competitor analysis',
      'Content gap identification',
      'Strategy formulation',
      'Recommendations',
    ],

    estimatedTime: {
      budget: 60,
      standard: 90,
      premium: 120,
    },

    available: true,
  },

  // ============================================
  // COMING SOON SERVICES (for reference)
  // ============================================

  'linkedin': {
    id: 'linkedin',
    name: 'LinkedIn Content Pipeline',
    icon: '💼',
    category: 'social',
    description: 'Complete LinkedIn content generation with text posts, carousels, articles/newsletters, and polls. Includes first comment generation, optional images, voice learning, and algorithm optimization. Posts follow LinkedIn best practices: 210-char hooks, links in first comments, 3-5 hashtags at end.',
    shortDescription: 'LinkedIn posts, carousels, articles & polls',

    tiers: {
      budget: {
        models: ['GPT-4o-mini', 'GPT-4o'],
        features: ['7-stage pipeline', 'First comment generation', 'Hashtag optimization', 'Posting calendar'],
        analysisDepth: 'basic',
        price: 4,
      },
      standard: {
        models: ['GPT-4o-mini', 'GPT-4.1', 'GPT-4o', 'Claude Sonnet'],
        features: ['7-stage pipeline', 'Trend research', 'Voice learning', 'Claude Sonnet critique', 'Algorithm scoring'],
        analysisDepth: 'moderate',
        price: 9,
      },
      premium: {
        models: ['GPT-4o-mini', 'Claude Sonnet', 'Claude Opus'],
        features: ['7-stage pipeline', 'Deep research', 'Full voice clone', 'Claude Opus polish', 'Content loop planning'],
        analysisDepth: 'deep',
        price: 15,
      },
    },

    deliverables: [
      'Text posts with first comments and hashtags',
      'Carousel slide scripts with visual directions',
      'Long-form articles with companion posts',
      'Polls with companion text and follow-up templates',
      'Posting calendar recommendations',
      'Quality and algorithm score report',
    ],

    features: [
      '7-stage AI pipeline per content type',
      'First comment generation (links, context, questions)',
      'Voice learning from sample posts',
      'LinkedIn algorithm optimization',
      '210-character hook optimization',
      'Content loop planning (polls → posts → articles)',
      'Optional image generation',
      'Reference image analysis',
    ],

    styleCategories: [
      'content_source',
      'voice_style',
      'platform_optimization',
      'engagement',
      'content_mix',
      'text_post',
      'carousel',
      'article',
      'poll',
    ],

    recommendWhen: {
      goals: ['thought_leadership', 'b2b_leads', 'professional_networking', 'brand_awareness', 'community_building'],
      challenges: ['no_linkedin_presence', 'low_engagement', 'inconsistent_posting', 'poor_content_quality', 'no_content_strategy'],
      industries: ['b2b', 'saas', 'consulting', 'professional_services', 'finance', 'technology', 'healthcare', 'education'],
      audienceTypes: ['b2b', 'professional', 'executives', 'founders', 'marketers', 'developers'],
      contentTypes: ['thought_leadership', 'industry_insights', 'company_updates', 'how_to', 'case_studies', 'polls', 'carousels'],
    },

    avoidWhen: [
      'B2C consumer audience with no professional angle',
      'Very young demographic (under 22)',
      'Content requiring real-time/live updates',
    ],

    useCases: [
      {
        title: 'Thought Leadership Program',
        description: 'Build executive presence with text posts and articles',
        exampleInput: 'Leadership lessons from scaling a SaaS to $10M ARR',
      },
      {
        title: 'Educational Carousel Series',
        description: 'Create shareable frameworks and guides as carousels',
        exampleInput: '7 Frameworks for Better Product Decisions',
      },
      {
        title: 'Engagement Polls',
        description: 'Drive discussion and gather industry insights with polls',
        exampleInput: 'Remote work vs hybrid vs office - what works best?',
      },
      {
        title: 'Newsletter Content',
        description: 'Write long-form articles with companion post promotion',
        exampleInput: 'The Future of AI in Enterprise Software',
      },
    ],

    requiredInputs: ['topic', 'company', 'industry', 'audience'],
    optionalInputs: ['samplePosts', 'brandGuidelines', 'sourceContent', 'keywords', 'additionalInfo', 'referenceImage'],

    supportsImages: true,
    imageOptions: ['minimal_professional', 'branded_graphic', 'infographic', 'photograph', 'illustration'],

    pipelineStages: [
      'Input processing',
      'LinkedIn intelligence research',
      'Voice learning (optional)',
      'Content strategy / architecture',
      'Content writing',
      'Harsh critique',
      'Final polish',
    ],

    estimatedTime: {
      budget: 45,
      standard: 75,
      premium: 120,
    },

    available: true,
  },

  'twitter': {
    id: 'twitter',
    name: 'X (Twitter) Content Pipeline',
    icon: '🐦',
    category: 'social',
    description: 'Complete X (Twitter) content generation with tweets, threads, and quote tweets. Includes 7-stage pipeline per content type with voice learning, trend research, algorithm optimization, harsh critique, and final polish. Text posts get 30% more engagement than videos on X.',
    shortDescription: 'X tweets, threads & quote tweets',

    tiers: {
      budget: {
        models: ['GPT-4o-mini', 'GPT-4o'],
        features: ['7-stage pipeline', 'Hashtag optimization', 'Algorithm scoring', 'Posting calendar'],
        analysisDepth: 'basic',
        price: 4,
      },
      standard: {
        models: ['GPT-4o-mini', 'GPT-4.1', 'GPT-4o', 'Claude Sonnet'],
        features: ['7-stage pipeline', 'Trend research', 'Voice learning', 'Claude Sonnet critique', 'Algorithm scoring'],
        analysisDepth: 'moderate',
        price: 9,
      },
      premium: {
        models: ['GPT-4o-mini', 'Claude Sonnet', 'Claude Opus'],
        features: ['7-stage pipeline', 'Deep research', 'Full voice clone', 'Claude Opus polish', 'Viral potential analysis'],
        analysisDepth: 'deep',
        price: 15,
      },
    },

    deliverables: [
      'Tweet pack (5-10 tweets with hashtags and posting times)',
      'Thread scripts (hook → body → CTA structure)',
      'Quote tweet responses with original commentary',
      'Posting calendar recommendations',
      'Quality and algorithm score report',
    ],

    features: [
      '7-stage AI pipeline per content type',
      'Voice learning from sample tweets',
      'X algorithm optimization (Tweepcred, engagement signals)',
      '70-100 character hook optimization',
      'Trend-aware content generation',
      '1-2 hashtag strategy (21% more engagement than 3+)',
      'Thread narrative arc planning',
      'Quote tweet angle analysis',
    ],

    styleCategories: [
      'content_source',
      'voice_style',
      'platform_optimization',
      'engagement',
      'tweet_generator',
      'thread_builder',
      'quote_tweet',
    ],

    recommendWhen: {
      goals: ['viral_content', 'brand_awareness', 'community_building', 'thought_leadership', 'audience_growth'],
      challenges: ['no_twitter_presence', 'low_engagement', 'inconsistent_posting', 'poor_content_quality', 'no_content_strategy'],
      industries: ['tech', 'media', 'entertainment', 'news', 'saas', 'crypto', 'finance', 'marketing'],
      audienceTypes: ['b2c', 'b2b', 'tech_savvy', 'younger_demographics', 'developers', 'founders'],
      contentTypes: ['threads', 'tweets', 'quote_tweets', 'engagement_posts', 'thought_leadership'],
    },

    avoidWhen: [
      'Very long-form only content needs (use Blog or LinkedIn Articles)',
      'Audiences primarily on LinkedIn/Facebook with no X presence',
      'Content requiring heavy visual/carousel formats (use Instagram)',
    ],

    useCases: [
      {
        title: 'Tweet Pack',
        description: 'Generate 5-10 optimized tweets around a topic with hashtags and posting times',
        exampleInput: '5 productivity tips for remote developers',
      },
      {
        title: 'Educational Thread',
        description: 'Create a multi-tweet thread that breaks down complex topics',
        exampleInput: 'How we scaled our SaaS from 0 to 10K users',
      },
      {
        title: 'Quote Tweet Commentary',
        description: 'Add unique perspective to trending tweets or industry news',
        exampleInput: 'React to the latest AI regulation announcement',
      },
      {
        title: 'Content Repurpose',
        description: 'Turn blog posts or newsletters into tweet threads',
        exampleInput: 'Convert our latest blog post on API design into a thread',
      },
    ],

    requiredInputs: ['topic', 'company', 'industry', 'audience'],
    optionalInputs: ['sampleTweets', 'brandGuidelines', 'sourceContent', 'keywords', 'additionalInfo'],

    supportsImages: false,

    pipelineStages: [
      'Input processing',
      'X intelligence research',
      'Voice learning (optional)',
      'Content strategy',
      'Content writing',
      'Harsh critique',
      'Final polish',
    ],

    estimatedTime: {
      budget: 30,
      standard: 50,
      premium: 80,
    },

    available: true,
  },

  'facebook': {
    id: 'facebook',
    name: 'Facebook Content Pipeline',
    icon: '👥',
    category: 'social',
    description: 'Facebook posts optimized for engagement and community building.',
    shortDescription: 'Facebook posts & engagement',

    tiers: {
      budget: { models: [], features: [], price: 10 },
      standard: { models: [], features: [], price: 18 },
      premium: { models: [], features: [], price: 35 },
    },

    deliverables: [],
    features: [],
    styleCategories: [],

    recommendWhen: {
      goals: ['community_building', 'brand_awareness', 'engagement'],
      challenges: ['no_facebook_presence', 'low_engagement'],
      industries: ['local_business', 'retail', 'community', 'events'],
      audienceTypes: ['b2c', 'local', 'community_focused'],
      contentTypes: ['community_posts', 'engagement_posts', 'announcements'],
    },

    useCases: [],
    requiredInputs: [],
    optionalInputs: [],
    pipelineStages: [],
    estimatedTime: { budget: 20, standard: 30, premium: 45 },

    available: false,
    comingSoon: true,
  },

  'facebook-ads': {
    id: 'facebook-ads',
    name: 'Facebook/Meta Ads Pipeline',
    icon: '🎯',
    category: 'ads',
    description: 'High-converting Facebook and Instagram ad copy with multiple variants.',
    shortDescription: 'Facebook & Instagram ad copy',

    tiers: {
      budget: { models: [], features: [], price: 25 },
      standard: { models: [], features: [], price: 45 },
      premium: { models: [], features: [], price: 85 },
    },

    deliverables: [],
    features: [],
    styleCategories: [],

    recommendWhen: {
      goals: ['paid_advertising', 'lead_generation', 'sales', 'app_installs'],
      challenges: ['poor_ad_performance', 'high_cpc', 'low_conversion'],
      industries: ['ecommerce', 'saas', 'local_business', 'apps'],
      audienceTypes: ['all'],
      contentTypes: ['ad_copy', 'ad_creative_briefs'],
    },

    useCases: [],
    requiredInputs: [],
    optionalInputs: [],
    pipelineStages: [],
    estimatedTime: { budget: 30, standard: 45, premium: 60 },

    available: false,
    comingSoon: true,
  },

  'google-ads': {
    id: 'google-ads',
    name: 'Google Ads Pipeline',
    icon: '🔍',
    category: 'ads',
    description: 'Google Search and Display ad copy with keyword optimization.',
    shortDescription: 'Google Search & Display ads',

    tiers: {
      budget: { models: [], features: [], price: 25 },
      standard: { models: [], features: [], price: 45 },
      premium: { models: [], features: [], price: 85 },
    },

    deliverables: [],
    features: [],
    styleCategories: [],

    recommendWhen: {
      goals: ['paid_advertising', 'lead_generation', 'sales', 'traffic'],
      challenges: ['poor_ad_performance', 'high_cpc', 'low_quality_score'],
      industries: ['all'],
      audienceTypes: ['all'],
      contentTypes: ['search_ads', 'display_ads', 'responsive_ads'],
    },

    useCases: [],
    requiredInputs: [],
    optionalInputs: [],
    pipelineStages: [],
    estimatedTime: { budget: 30, standard: 45, premium: 60 },

    available: false,
    comingSoon: true,
  },
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all available services
 */
export function getAvailableServices(): ServiceConfig[] {
  return Object.values(SERVICES).filter(s => s.available)
}

/**
 * Get all services including coming soon
 */
export function getAllServices(): ServiceConfig[] {
  return Object.values(SERVICES)
}

/**
 * Get service by ID
 */
export function getService(id: string): ServiceConfig | undefined {
  return SERVICES[id]
}

/**
 * Get services by category
 */
export function getServicesByCategory(category: ServiceConfig['category']): ServiceConfig[] {
  return Object.values(SERVICES).filter(s => s.category === category)
}

/**
 * Find services that match user goals
 */
export function findServicesForGoal(goal: string): ServiceConfig[] {
  const normalizedGoal = goal.toLowerCase().replace(/\s+/g, '_')
  return Object.values(SERVICES).filter(s =>
    s.available && s.recommendWhen.goals.some(g =>
      g.includes(normalizedGoal) || normalizedGoal.includes(g)
    )
  )
}

/**
 * Find services that address user challenges
 */
export function findServicesForChallenge(challenge: string): ServiceConfig[] {
  const normalizedChallenge = challenge.toLowerCase().replace(/\s+/g, '_')
  return Object.values(SERVICES).filter(s =>
    s.available && s.recommendWhen.challenges.some(c =>
      c.includes(normalizedChallenge) || normalizedChallenge.includes(c)
    )
  )
}

/**
 * Find services suitable for an industry
 */
export function findServicesForIndustry(industry: string): ServiceConfig[] {
  const normalizedIndustry = industry.toLowerCase().replace(/\s+/g, '_')
  return Object.values(SERVICES).filter(s =>
    s.available && (
      s.recommendWhen.industries.includes('all') ||
      s.recommendWhen.industries.some(i =>
        i.includes(normalizedIndustry) || normalizedIndustry.includes(i)
      )
    )
  )
}

/**
 * Generate a summary of all services for AI context
 * @param tier Optional tier to customize context for specific tier pricing
 */
export function generateServicesContextForAI(tier?: QualityTier): string {
  const availableServices = getAvailableServices()

  let context = `# Scribengine Services Overview\n\n`
  context += `Scribengine offers ${availableServices.length} content generation services.\n\n`

  for (const service of availableServices) {
    context += `## ${service.icon} ${service.name} (${service.id})\n`
    context += `${service.description}\n\n`

    context += `**Deliverables:** ${service.deliverables.join(', ')}\n\n`

    context += `**Pricing:**\n`
    context += `- Budget: $${service.tiers.budget.price} - ${service.tiers.budget.features.join(', ')}\n`
    context += `- Standard: $${service.tiers.standard.price} - ${service.tiers.standard.features.join(', ')}\n`
    context += `- Premium: $${service.tiers.premium.price} - ${service.tiers.premium.features.join(', ')}\n\n`

    context += `**Best for:**\n`
    context += `- Goals: ${service.recommendWhen.goals.join(', ')}\n`
    context += `- Challenges: ${service.recommendWhen.challenges.join(', ')}\n`
    context += `- Industries: ${service.recommendWhen.industries.join(', ')}\n\n`

    if (service.avoidWhen && service.avoidWhen.length > 0) {
      context += `**Avoid when:** ${service.avoidWhen.join(', ')}\n\n`
    }

    context += `**Required inputs:** ${service.requiredInputs.join(', ')}\n`
    context += `**Optional inputs:** ${service.optionalInputs.join(', ')}\n\n`

    if (service.supportsImages) {
      context += `**Image generation:** Supported (${service.imageOptions?.join(', ')})\n\n`
    }

    context += `---\n\n`
  }

  return context
}

/**
 * Generate style customization context for a specific service
 */
export function generateStyleContextForService(serviceId: string): string {
  const service = getService(serviceId)
  if (!service) return ''

  let context = `# Style Customization Options for ${service.name}\n\n`

  if (service.styleCategories.length === 0) {
    context += `This service does not have customizable style options.\n`
    return context
  }

  context += `This service supports ${service.styleCategories.length} style customization categories:\n\n`

  for (const categoryId of service.styleCategories) {
    context += `- **${categoryId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}**\n`
  }

  context += `\nRefer to the full style options documentation for detailed choices within each category.\n`

  return context
}

// ============================================
// CONTENT ARCHITECT SPECIFIC HELPERS
// ============================================

/**
 * Score a service's relevance to user needs (0-100)
 */
export function scoreServiceRelevance(
  service: ServiceConfig,
  userGoals: string[],
  userChallenges: string[],
  userIndustry: string,
  needsImages: boolean
): number {
  let score = 0
  const maxScore = 100

  // Goal matching (40 points max)
  const goalMatches = userGoals.filter(g =>
    service.recommendWhen.goals.some(sg =>
      sg.includes(g.toLowerCase()) || g.toLowerCase().includes(sg)
    )
  ).length
  score += Math.min(40, goalMatches * 15)

  // Challenge matching (30 points max)
  const challengeMatches = userChallenges.filter(c =>
    service.recommendWhen.challenges.some(sc =>
      sc.includes(c.toLowerCase()) || c.toLowerCase().includes(sc)
    )
  ).length
  score += Math.min(30, challengeMatches * 15)

  // Industry matching (15 points)
  if (service.recommendWhen.industries.includes('all')) {
    score += 10 // General services get partial credit
  } else if (service.recommendWhen.industries.some(i =>
    i.includes(userIndustry.toLowerCase()) || userIndustry.toLowerCase().includes(i)
  )) {
    score += 15
  }

  // Image capability matching (15 points)
  if (needsImages && service.supportsImages) {
    score += 15
  } else if (!needsImages) {
    score += 10 // Neutral if images not needed
  }

  return Math.min(maxScore, score)
}

/**
 * Get top recommended services based on user input
 */
export function getTopRecommendations(
  userGoals: string[],
  userChallenges: string[],
  userIndustry: string,
  needsImages: boolean,
  limit: number = 3
): Array<{ service: ServiceConfig; score: number; reasons: string[] }> {
  const availableServices = getAvailableServices()

  const scored = availableServices.map(service => {
    const score = scoreServiceRelevance(service, userGoals, userChallenges, userIndustry, needsImages)
    const reasons: string[] = []

    // Generate reasons
    userGoals.forEach(goal => {
      if (service.recommendWhen.goals.some(sg => sg.includes(goal.toLowerCase()))) {
        reasons.push(`Supports your goal: ${goal}`)
      }
    })

    userChallenges.forEach(challenge => {
      if (service.recommendWhen.challenges.some(sc => sc.includes(challenge.toLowerCase()))) {
        reasons.push(`Addresses your challenge: ${challenge}`)
      }
    })

    if (needsImages && service.supportsImages) {
      reasons.push('Includes AI image generation')
    }

    return { service, score, reasons }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
