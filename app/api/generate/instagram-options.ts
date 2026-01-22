/**
 * Instagram Content Style Options
 *
 * Customization options specific to Instagram content generation.
 * Includes both caption/content style and image generation preferences.
 */

// ============================================
// INSTAGRAM STYLE OPTION TYPES
// ============================================

export interface InstagramStyleOption {
  id: string
  label: string
  hint: string
  options: { value: string; label: string; hint?: string }[]
}

export interface InstagramStyleCategory {
  id: string
  name: string
  description: string
  options: InstagramStyleOption[]
}

// ============================================
// CAPTION & CONTENT STYLE
// ============================================

export const captionStyle: InstagramStyleCategory = {
  id: 'caption_style',
  name: 'Caption Style',
  description: 'How your Instagram captions should sound and feel',
  options: [
    {
      id: 'caption_tone',
      label: 'Caption Tone',
      hint: 'The overall voice of your captions',
      options: [
        { value: 'professional', label: 'Professional', hint: 'Polished, business-appropriate. For B2B, corporate brands.' },
        { value: 'friendly', label: 'Friendly & Approachable', hint: 'Warm, conversational. For most consumer brands.' },
        { value: 'witty', label: 'Witty & Playful', hint: 'Clever, humorous. For lifestyle, entertainment brands.' },
        { value: 'inspirational', label: 'Inspirational', hint: 'Motivating, uplifting. For coaches, wellness, personal brands.' },
        { value: 'educational', label: 'Educational', hint: 'Informative, value-packed. For thought leaders, experts.' },
        { value: 'bold', label: 'Bold & Direct', hint: 'Confident, no-nonsense. For challenger brands.' },
        { value: 'storytelling', label: 'Storytelling', hint: 'Narrative-driven, personal. For personal brands, creators.' }
      ]
    },
    {
      id: 'emoji_usage',
      label: 'Emoji Usage',
      hint: 'How many emojis to include in captions',
      options: [
        { value: 'none', label: 'None', hint: 'Clean, text-only. For luxury, minimalist brands.' },
        { value: 'minimal', label: 'Minimal (1-2)', hint: 'Strategic accent. Professional but approachable.' },
        { value: 'moderate', label: 'Moderate (3-5)', hint: 'Balanced use. Standard for most brands.' },
        { value: 'heavy', label: 'Heavy (5+)', hint: 'Expressive, fun. For playful, youth-focused brands.' }
      ]
    },
    {
      id: 'cta_style',
      label: 'Call-to-Action Style',
      hint: 'How to prompt engagement and action',
      options: [
        { value: 'question', label: 'Question-Based', hint: '"What do you think?" - Invites comments.' },
        { value: 'direct', label: 'Direct Command', hint: '"Save this post!" - Clear instruction.' },
        { value: 'soft', label: 'Soft Suggestion', hint: '"Feel free to share..." - Gentle nudge.' },
        { value: 'value', label: 'Value-Focused', hint: '"Tap the link for more..." - Benefit-driven.' },
        { value: 'none', label: 'No Hard CTA', hint: 'Let content speak for itself.' }
      ]
    },
    {
      id: 'content_format',
      label: 'Content Format',
      hint: 'The structure of your caption content',
      options: [
        { value: 'tips_list', label: 'Tips/List Format', hint: 'Numbered tips or bullet points. High save rate.' },
        { value: 'story', label: 'Story/Narrative', hint: 'Personal story or case study. High engagement.' },
        { value: 'educational', label: 'Educational Breakdown', hint: 'Teach something valuable. Authority builder.' },
        { value: 'behind_scenes', label: 'Behind the Scenes', hint: 'Show the process. Builds connection.' },
        { value: 'announcement', label: 'Announcement/News', hint: 'Share updates, launches. Generates excitement.' },
        { value: 'quote_commentary', label: 'Quote + Commentary', hint: 'Share wisdom with your take. Shareable.' }
      ]
    }
  ]
}

// ============================================
// HASHTAG STRATEGY
// ============================================

export const hashtagStrategy: InstagramStyleCategory = {
  id: 'hashtag_strategy',
  name: 'Hashtag Strategy',
  description: 'How to approach hashtag optimization',
  options: [
    {
      id: 'hashtag_strategy',
      label: 'Hashtag Approach',
      hint: '2026 best practice: Quality over quantity',
      options: [
        { value: 'minimal', label: 'Minimal (3-5)', hint: 'Highly targeted. Best for SEO-focused strategy.' },
        { value: 'moderate', label: 'Moderate (5-10)', hint: 'Balanced approach. Good mix of reach and relevance.' },
        { value: 'comprehensive', label: 'Comprehensive (10-15)', hint: 'Broader reach. Mix of sizes.' },
        { value: 'maximum', label: 'Maximum (20-30)', hint: 'Aggressive reach. Use with caution.' }
      ]
    },
    {
      id: 'hashtag_placement',
      label: 'Hashtag Placement',
      hint: 'Where to put hashtags',
      options: [
        { value: 'in_caption', label: 'In Caption', hint: 'Integrated into the caption. More natural.' },
        { value: 'end_caption', label: 'End of Caption', hint: 'After line breaks at bottom. Clean separation.' },
        { value: 'first_comment', label: 'First Comment', hint: 'Posted as first comment. Cleanest caption.' }
      ]
    }
  ]
}

// ============================================
// VISUAL STYLE
// ============================================

export const visualStyle: InstagramStyleCategory = {
  id: 'visual_style',
  name: 'Visual Style',
  description: 'Image generation style preferences',
  options: [
    {
      id: 'image_style',
      label: 'Image Style',
      hint: 'The visual aesthetic for generated images',
      options: [
        { value: 'photography', label: 'Photography', hint: 'Realistic photos. Professional, authentic.' },
        { value: 'illustration', label: 'Illustration', hint: 'Hand-drawn or digital art style. Creative, unique.' },
        { value: 'minimalist', label: 'Minimalist', hint: 'Clean, simple visuals. Modern, sophisticated.' },
        { value: '3d_render', label: '3D Render', hint: 'Three-dimensional graphics. Tech-forward, striking.' },
        { value: 'flat_design', label: 'Flat Design', hint: 'Simple shapes, bold colors. Modern, accessible.' },
        { value: 'watercolor', label: 'Watercolor', hint: 'Soft, artistic feel. Creative, organic.' },
        { value: 'collage', label: 'Collage/Mixed Media', hint: 'Combined elements. Creative, trendy.' }
      ]
    },
    {
      id: 'image_mood',
      label: 'Image Mood',
      hint: 'The emotional feel of images',
      options: [
        { value: 'professional', label: 'Professional', hint: 'Clean, polished, corporate-friendly.' },
        { value: 'playful', label: 'Playful', hint: 'Fun, energetic, vibrant.' },
        { value: 'elegant', label: 'Elegant', hint: 'Sophisticated, refined, luxurious.' },
        { value: 'bold', label: 'Bold', hint: 'Strong, impactful, attention-grabbing.' },
        { value: 'calm', label: 'Calm', hint: 'Peaceful, serene, soothing.' },
        { value: 'energetic', label: 'Energetic', hint: 'Dynamic, exciting, high-energy.' },
        { value: 'authentic', label: 'Authentic', hint: 'Real, genuine, unpolished.' }
      ]
    },
    {
      id: 'color_scheme',
      label: 'Color Scheme',
      hint: 'Color preferences for images',
      options: [
        { value: 'brand_colors', label: 'Brand Colors', hint: 'Use brand color palette.' },
        { value: 'neutral', label: 'Neutral/Muted', hint: 'Soft, understated colors.' },
        { value: 'vibrant', label: 'Vibrant/Bold', hint: 'Bright, saturated colors.' },
        { value: 'pastel', label: 'Pastel', hint: 'Soft, light colors.' },
        { value: 'monochrome', label: 'Monochrome', hint: 'Single color variations.' },
        { value: 'earth_tones', label: 'Earth Tones', hint: 'Natural, warm colors.' },
        { value: 'cool_tones', label: 'Cool Tones', hint: 'Blues, greens, purples.' }
      ]
    }
  ]
}

// ============================================
// CONTENT TYPE
// ============================================

export const contentType: InstagramStyleCategory = {
  id: 'content_type',
  name: 'Content Type',
  description: 'The type of Instagram content to create',
  options: [
    {
      id: 'post_format',
      label: 'Post Format',
      hint: 'The type of Instagram post',
      options: [
        { value: 'single_post', label: 'Single Image Post', hint: 'One image with caption. Simple, focused.' },
        { value: 'carousel', label: 'Carousel (Multi-slide)', hint: 'Up to 10 slides. 114% more engagement.' },
        { value: 'reels_cover', label: 'Reels Cover', hint: 'Cover image for Reels. 9:16 aspect ratio.' },
        { value: 'story', label: 'Story', hint: 'Ephemeral content. 9:16 aspect ratio.' }
      ]
    },
    {
      id: 'carousel_slides',
      label: 'Carousel Slides',
      hint: 'Number of slides for carousel posts',
      options: [
        { value: '3', label: '3 Slides', hint: 'Quick value. Fast consumption.' },
        { value: '5', label: '5 Slides', hint: 'Balanced depth. Good engagement.' },
        { value: '7', label: '7 Slides', hint: 'Comprehensive. High save rate.' },
        { value: '10', label: '10 Slides', hint: 'Maximum depth. Ultimate guide format.' }
      ]
    }
  ]
}

// ============================================
// ALL INSTAGRAM CATEGORIES
// ============================================

export const allInstagramStyleCategories: InstagramStyleCategory[] = [
  captionStyle,
  hashtagStrategy,
  visualStyle,
  contentType
]

// ============================================
// INSTAGRAM STYLE PROFILE TYPE
// ============================================

export interface InstagramStyleProfile {
  // Caption Style
  caption_tone: string
  emoji_usage: string
  cta_style: string
  content_format: string

  // Hashtag Strategy
  hashtag_strategy: string
  hashtag_placement: string

  // Visual Style
  image_style: string
  image_mood: string
  color_scheme: string

  // Content Type
  post_format: string
  carousel_slides: string
}

// ============================================
// DEFAULT INSTAGRAM STYLE PROFILE
// ============================================

export const defaultInstagramStyleProfile: InstagramStyleProfile = {
  // Caption Style
  caption_tone: 'friendly',
  emoji_usage: 'moderate',
  cta_style: 'question',
  content_format: 'tips_list',

  // Hashtag Strategy
  hashtag_strategy: 'minimal',
  hashtag_placement: 'first_comment',

  // Visual Style
  image_style: 'photography',
  image_mood: 'professional',
  color_scheme: 'brand_colors',

  // Content Type
  post_format: 'carousel',
  carousel_slides: '5'
}

// ============================================
// IMAGE GENERATION OPTIONS INTERFACE
// ============================================

export interface ImageGenerationOptions {
  generateImages: boolean
  style: 'photography' | 'illustration' | 'minimalist' | '3d_render' | 'flat_design' | 'watercolor' | 'custom'
  customStyle?: string
  mood: 'professional' | 'playful' | 'elegant' | 'bold' | 'calm' | 'energetic' | 'custom'
  customMood?: string
  colorPreferences: string[]
  subjectsToInclude: string[]
  subjectsToAvoid: string[]
  additionalImageNotes: string
}

export const defaultImageGenerationOptions: ImageGenerationOptions = {
  generateImages: false, // Off by default to save costs
  style: 'photography',
  mood: 'professional',
  colorPreferences: [],
  subjectsToInclude: [],
  subjectsToAvoid: [],
  additionalImageNotes: ''
}
