/**
 * Content Architect Options Schema
 *
 * Configuration options for the Content Architect pipeline.
 * These options help users specify their content needs clearly.
 */

export interface ContentArchitectOption {
  id: string
  label: string
  hint: string
  options: { value: string; label: string; hint?: string }[]
}

export interface ContentArchitectCategory {
  id: string
  name: string
  description: string
  options: ContentArchitectOption[]
}

// ============================================
// 1. BUSINESS CONTEXT
// ============================================
export const businessContext: ContentArchitectCategory = {
  id: 'business_context',
  name: 'Business Context',
  description: 'Help us understand your business to provide better recommendations',
  options: [
    {
      id: 'industry',
      label: 'Industry',
      hint: 'Your primary industry helps us tailor content strategies and recommendations.',
      options: [
        { value: 'technology', label: 'Technology & SaaS', hint: 'Software, apps, tech services, IT' },
        { value: 'ecommerce', label: 'E-commerce & Retail', hint: 'Online stores, products, shopping' },
        { value: 'healthcare', label: 'Healthcare & Wellness', hint: 'Medical, fitness, mental health' },
        { value: 'finance', label: 'Finance & Fintech', hint: 'Banking, investing, insurance, crypto' },
        { value: 'education', label: 'Education & Training', hint: 'Courses, coaching, learning platforms' },
        { value: 'marketing', label: 'Marketing & Agency', hint: 'Digital marketing, creative agencies' },
        { value: 'professional_services', label: 'Professional Services', hint: 'Consulting, legal, accounting' },
        { value: 'real_estate', label: 'Real Estate', hint: 'Property, construction, architecture' },
        { value: 'food_beverage', label: 'Food & Beverage', hint: 'Restaurants, food products, hospitality' },
        { value: 'entertainment', label: 'Entertainment & Media', hint: 'Content creation, gaming, media' },
        { value: 'nonprofit', label: 'Nonprofit & Social Impact', hint: 'Charities, foundations, social causes' },
        { value: 'other', label: 'Other', hint: 'We\'ll ask for more details' },
      ]
    },
    {
      id: 'company_size',
      label: 'Company Size',
      hint: 'Helps us recommend strategies appropriate to your resources.',
      options: [
        { value: 'solo', label: 'Solo / Freelancer', hint: 'One-person operation' },
        { value: 'small', label: 'Small (2-10 people)', hint: 'Small team, limited resources' },
        { value: 'medium', label: 'Medium (11-50 people)', hint: 'Growing team, some content resources' },
        { value: 'large', label: 'Large (51-200 people)', hint: 'Established with dedicated marketing' },
        { value: 'enterprise', label: 'Enterprise (200+)', hint: 'Full marketing department, complex needs' },
      ]
    },
    {
      id: 'business_model',
      label: 'Business Model',
      hint: 'Your revenue model affects content strategy significantly.',
      options: [
        { value: 'b2b', label: 'B2B (Business to Business)', hint: 'Selling to other businesses' },
        { value: 'b2c', label: 'B2C (Business to Consumer)', hint: 'Selling directly to consumers' },
        { value: 'b2b2c', label: 'B2B2C (Both)', hint: 'Mix of business and consumer' },
        { value: 'saas', label: 'SaaS / Subscription', hint: 'Recurring revenue model' },
        { value: 'marketplace', label: 'Marketplace / Platform', hint: 'Connecting buyers and sellers' },
        { value: 'creator', label: 'Creator / Influencer', hint: 'Personal brand, audience monetization' },
      ]
    },
    {
      id: 'growth_stage',
      label: 'Growth Stage',
      hint: 'Different stages need different content strategies.',
      options: [
        { value: 'idea', label: 'Idea / Pre-launch', hint: 'Building MVP, validating concept' },
        { value: 'early', label: 'Early Stage', hint: 'Finding product-market fit' },
        { value: 'growth', label: 'Growth Stage', hint: 'Scaling what works' },
        { value: 'established', label: 'Established', hint: 'Stable, optimizing performance' },
        { value: 'enterprise', label: 'Enterprise / Market Leader', hint: 'Defending and expanding position' },
      ]
    },
  ]
}

// ============================================
// 2. CONTENT GOALS
// ============================================
export const contentGoals: ContentArchitectCategory = {
  id: 'content_goals',
  name: 'Content Goals',
  description: 'What do you want your content to achieve?',
  options: [
    {
      id: 'primary_goal',
      label: 'Primary Goal',
      hint: 'Your #1 objective determines the entire content strategy.',
      options: [
        { value: 'brand_awareness', label: 'Brand Awareness', hint: 'Get your name out there, build recognition' },
        { value: 'lead_generation', label: 'Lead Generation', hint: 'Capture emails, demo requests, inquiries' },
        { value: 'sales', label: 'Direct Sales', hint: 'Drive purchases and conversions' },
        { value: 'thought_leadership', label: 'Thought Leadership', hint: 'Establish expertise and authority' },
        { value: 'seo_traffic', label: 'SEO & Organic Traffic', hint: 'Rank higher, get more organic visitors' },
        { value: 'community', label: 'Community Building', hint: 'Build engaged audience, foster loyalty' },
        { value: 'education', label: 'Customer Education', hint: 'Help customers succeed with your product' },
        { value: 'retention', label: 'Customer Retention', hint: 'Keep existing customers engaged' },
      ]
    },
    {
      id: 'secondary_goals',
      label: 'Secondary Goals',
      hint: 'Additional objectives that matter to you.',
      options: [
        { value: 'newsletter_growth', label: 'Newsletter Growth', hint: 'Build email subscriber base' },
        { value: 'social_engagement', label: 'Social Engagement', hint: 'Likes, shares, comments, follows' },
        { value: 'backlinks', label: 'Backlink Building', hint: 'Earn links from other sites' },
        { value: 'authority', label: 'Industry Authority', hint: 'Be seen as the go-to expert' },
        { value: 'recruitment', label: 'Talent Attraction', hint: 'Attract job candidates' },
        { value: 'partnership', label: 'Partnership Opportunities', hint: 'Attract business partners' },
        { value: 'pr', label: 'PR & Media Coverage', hint: 'Get featured in publications' },
      ]
    },
    {
      id: 'content_frequency',
      label: 'Content Frequency',
      hint: 'How often do you want to publish content?',
      options: [
        { value: 'daily', label: 'Daily', hint: 'Social media, news, high-engagement' },
        { value: 'few_per_week', label: 'Few times per week', hint: 'Active presence, consistent engagement' },
        { value: 'weekly', label: 'Weekly', hint: 'Sustainable for most businesses' },
        { value: 'biweekly', label: 'Bi-weekly', hint: 'Quality over quantity approach' },
        { value: 'monthly', label: 'Monthly', hint: 'Limited resources, focus on quality' },
        { value: 'as_needed', label: 'As needed', hint: 'Campaign-based, reactive' },
      ]
    },
  ]
}

// ============================================
// 3. TARGET PLATFORMS
// ============================================
export const targetPlatforms: ContentArchitectCategory = {
  id: 'target_platforms',
  name: 'Target Platforms',
  description: 'Where do you want to publish content?',
  options: [
    {
      id: 'primary_platform',
      label: 'Primary Platform',
      hint: 'Your main content hub - where you\'ll focus most effort.',
      options: [
        { value: 'blog', label: 'Blog / Website', hint: 'Owned content hub, SEO foundation' },
        { value: 'linkedin', label: 'LinkedIn', hint: 'B2B networking, thought leadership' },
        { value: 'instagram', label: 'Instagram', hint: 'Visual content, lifestyle brands, B2C' },
        { value: 'twitter', label: 'Twitter / X', hint: 'Real-time engagement, tech, news' },
        { value: 'youtube', label: 'YouTube', hint: 'Video content, tutorials, education' },
        { value: 'tiktok', label: 'TikTok', hint: 'Short-form video, younger audience' },
        { value: 'facebook', label: 'Facebook', hint: 'Community, groups, older demographic' },
        { value: 'email', label: 'Email / Newsletter', hint: 'Direct communication, owned audience' },
        { value: 'podcast', label: 'Podcast', hint: 'Audio content, deep engagement' },
      ]
    },
    {
      id: 'secondary_platforms',
      label: 'Secondary Platforms',
      hint: 'Additional platforms to distribute content.',
      options: [
        { value: 'linkedin', label: 'LinkedIn', hint: 'Professional network' },
        { value: 'instagram', label: 'Instagram', hint: 'Visual social' },
        { value: 'twitter', label: 'Twitter / X', hint: 'Real-time social' },
        { value: 'facebook', label: 'Facebook', hint: 'Social network' },
        { value: 'pinterest', label: 'Pinterest', hint: 'Visual discovery' },
        { value: 'medium', label: 'Medium', hint: 'Content republishing' },
        { value: 'quora', label: 'Quora', hint: 'Q&A authority building' },
        { value: 'reddit', label: 'Reddit', hint: 'Community engagement' },
        { value: 'newsletter', label: 'Email Newsletter', hint: 'Direct subscriber communication' },
      ]
    },
    {
      id: 'content_format_preference',
      label: 'Preferred Content Formats',
      hint: 'What types of content resonate with your audience?',
      options: [
        { value: 'long_form', label: 'Long-form Articles', hint: 'In-depth blog posts, guides' },
        { value: 'short_form', label: 'Short-form Posts', hint: 'Quick tips, updates, social posts' },
        { value: 'visual', label: 'Visual Content', hint: 'Infographics, images, carousels' },
        { value: 'video', label: 'Video Content', hint: 'Tutorials, vlogs, reels' },
        { value: 'audio', label: 'Audio Content', hint: 'Podcasts, audio snippets' },
        { value: 'interactive', label: 'Interactive Content', hint: 'Quizzes, calculators, tools' },
        { value: 'mixed', label: 'Mixed / Multi-format', hint: 'Repurpose across formats' },
      ]
    },
  ]
}

// ============================================
// 4. BUDGET & RESOURCES
// ============================================
export const budgetResources: ContentArchitectCategory = {
  id: 'budget_resources',
  name: 'Budget & Resources',
  description: 'Help us recommend solutions that fit your situation',
  options: [
    {
      id: 'budget_range',
      label: 'Content Budget',
      hint: 'Your monthly content investment determines what\'s realistic.',
      options: [
        { value: 'starter', label: 'Starter ($0-$500/mo)', hint: 'Limited budget, DIY + occasional help' },
        { value: 'growing', label: 'Growing ($500-$2K/mo)', hint: 'Room for regular content creation' },
        { value: 'established', label: 'Established ($2K-$5K/mo)', hint: 'Consistent investment in content' },
        { value: 'scaling', label: 'Scaling ($5K-$10K/mo)', hint: 'Aggressive content strategy' },
        { value: 'enterprise', label: 'Enterprise ($10K+/mo)', hint: 'Full-scale content operation' },
      ]
    },
    {
      id: 'timeline',
      label: 'Timeline',
      hint: 'When do you need results?',
      options: [
        { value: 'urgent', label: 'Urgent (< 1 month)', hint: 'Need content ASAP' },
        { value: 'short', label: 'Short-term (1-3 months)', hint: 'Quick wins, campaign-based' },
        { value: 'medium', label: 'Medium-term (3-6 months)', hint: 'Building sustainable presence' },
        { value: 'long', label: 'Long-term (6+ months)', hint: 'Playing the long game' },
        { value: 'ongoing', label: 'Ongoing / Evergreen', hint: 'Continuous content operation' },
      ]
    },
    {
      id: 'existing_content',
      label: 'Existing Content',
      hint: 'Do you have content to work with or starting fresh?',
      options: [
        { value: 'none', label: 'Starting Fresh', hint: 'No existing content to leverage' },
        { value: 'some', label: 'Some Content', hint: 'A few blog posts, social presence' },
        { value: 'moderate', label: 'Moderate Library', hint: 'Regular publishing, established presence' },
        { value: 'extensive', label: 'Extensive Library', hint: 'Large content archive to optimize' },
      ]
    },
    {
      id: 'team_resources',
      label: 'Team Resources',
      hint: 'Who handles content in your organization?',
      options: [
        { value: 'solo_no_time', label: 'Solo, No Time', hint: 'Need everything done for you' },
        { value: 'solo_some_time', label: 'Solo, Some Time', hint: 'Can edit and customize' },
        { value: 'small_team', label: 'Small Marketing Team', hint: '1-2 people on marketing' },
        { value: 'content_team', label: 'Dedicated Content Team', hint: 'Writers, designers, strategists' },
        { value: 'agency_partner', label: 'Work with Agencies', hint: 'Outsource content creation' },
      ]
    },
  ]
}

// ============================================
// 5. CONTENT PREFERENCES
// ============================================
export const contentPreferences: ContentArchitectCategory = {
  id: 'content_preferences',
  name: 'Content Preferences',
  description: 'Style and approach preferences',
  options: [
    {
      id: 'brand_voice',
      label: 'Brand Voice',
      hint: 'How should your brand come across?',
      options: [
        { value: 'professional', label: 'Professional & Authoritative', hint: 'Expert, trustworthy, credible' },
        { value: 'friendly', label: 'Friendly & Approachable', hint: 'Warm, welcoming, personable' },
        { value: 'innovative', label: 'Innovative & Bold', hint: 'Cutting-edge, forward-thinking' },
        { value: 'educational', label: 'Educational & Helpful', hint: 'Teacher, guide, mentor' },
        { value: 'entertaining', label: 'Entertaining & Fun', hint: 'Engaging, humorous, memorable' },
        { value: 'inspirational', label: 'Inspirational & Motivating', hint: 'Uplifting, empowering' },
      ]
    },
    {
      id: 'content_depth',
      label: 'Content Depth',
      hint: 'How detailed should content be?',
      options: [
        { value: 'comprehensive', label: 'Comprehensive & Detailed', hint: 'In-depth, thorough coverage' },
        { value: 'balanced', label: 'Balanced', hint: 'Good coverage without overwhelming' },
        { value: 'concise', label: 'Concise & Actionable', hint: 'Quick to consume, action-oriented' },
        { value: 'skimmable', label: 'Skimmable & Scannable', hint: 'Easy to scan, bullet-focused' },
      ]
    },
    {
      id: 'visual_needs',
      label: 'Visual Content Needs',
      hint: 'Do you need images and graphics?',
      options: [
        { value: 'yes_extensive', label: 'Yes, Extensively', hint: 'Images for every piece of content' },
        { value: 'yes_some', label: 'Yes, Some', hint: 'Featured images, occasional graphics' },
        { value: 'minimal', label: 'Minimal', hint: 'Stock photos are fine' },
        { value: 'no', label: 'No / Text Only', hint: 'Don\'t need custom visuals' },
      ]
    },
  ]
}

// ============================================
// ALL CATEGORIES EXPORT
// ============================================
export const contentArchitectCategories: ContentArchitectCategory[] = [
  businessContext,
  contentGoals,
  targetPlatforms,
  budgetResources,
  contentPreferences,
]

// ============================================
// DEFAULT VALUES
// ============================================
export const defaultContentArchitectOptions = {
  industry: 'technology',
  company_size: 'small',
  business_model: 'b2b',
  growth_stage: 'growth',
  primary_goal: 'lead_generation',
  secondary_goals: ['seo_traffic', 'thought_leadership'],
  content_frequency: 'weekly',
  primary_platform: 'blog',
  secondary_platforms: ['linkedin', 'twitter'],
  content_format_preference: 'mixed',
  budget_range: 'growing',
  timeline: 'medium',
  existing_content: 'some',
  team_resources: 'solo_some_time',
  brand_voice: 'professional',
  content_depth: 'balanced',
  visual_needs: 'yes_some',
}

// ============================================
// TIER DESCRIPTIONS
// ============================================
export const contentArchitectTiers = {
  budget: {
    name: 'Budget',
    price: 19,
    description: 'Essential strategic guidance',
    features: [
      'Business & audience analysis',
      'Service recommendations',
      'Basic content strategy',
      'Platform-specific tips',
      'Execution plan',
    ],
    limitations: [
      'No analytics integration',
      'Basic AI models',
    ],
    bestFor: 'Startups and solopreneurs getting started with content',
  },
  standard: {
    name: 'Standard',
    price: 49,
    description: 'Comprehensive strategic planning',
    features: [
      'Everything in Budget',
      'Analytics integration (when available)',
      'Trend analysis',
      'Hashtag optimization',
      'Competitor insights',
      'Detailed content calendar',
      'Premium AI analysis',
    ],
    limitations: [
      'Some premium analytics may not be available',
    ],
    bestFor: 'Growing businesses ready to scale their content',
  },
  premium: {
    name: 'Premium',
    price: 99,
    description: 'Executive-level strategic consulting',
    features: [
      'Everything in Standard',
      'Full analytics suite',
      'AI-powered audience research',
      'Competitive intelligence',
      'ROI projections',
      'Custom recommendations',
      'Priority processing',
      'Claude Opus-powered insights',
    ],
    limitations: [],
    bestFor: 'Established businesses seeking comprehensive content strategy',
  },
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get option label by value
 */
export function getOptionLabel(categoryId: string, optionId: string, value: string): string {
  const category = contentArchitectCategories.find(c => c.id === categoryId)
  if (!category) return value

  const option = category.options.find(o => o.id === optionId)
  if (!option) return value

  const optionValue = option.options.find(o => o.value === value)
  return optionValue?.label || value
}

/**
 * Validate options
 */
export function validateContentArchitectOptions(options: Record<string, any>): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Required fields
  if (!options.primary_goal) {
    errors.push('Primary goal is required')
  }
  if (!options.primary_platform) {
    errors.push('Primary platform is required')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Map budget range to tier recommendation
 */
export function recommendTierForBudget(budgetRange: string): 'budget' | 'standard' | 'premium' {
  switch (budgetRange) {
    case 'starter':
      return 'budget'
    case 'growing':
    case 'established':
      return 'standard'
    case 'scaling':
    case 'enterprise':
      return 'premium'
    default:
      return 'standard'
  }
}
