/**
 * Image Prompt Enhancer
 *
 * Improves image generation quality through:
 * - Quality modifiers (technical photography terms)
 * - Text spelling protocol (for accurate text rendering)
 * - Industry-specific templates
 * - Brand DNA extraction
 */

// ============================================
// QUALITY MODIFIERS
// ============================================

export const QUALITY_MODIFIERS = {
  photography: [
    'professional photography',
    'sharp focus',
    '8K resolution',
    'high detail',
    'professional studio lighting',
    'perfect exposure',
    'rich colors',
  ],
  lighting: [
    'soft diffused lighting',
    'dramatic rim lighting',
    'natural golden hour light',
    'professional three-point lighting',
    'subtle shadows for depth',
  ],
  composition: [
    'rule of thirds composition',
    'balanced visual weight',
    'clear focal point',
    'professional framing',
  ],
  finish: [
    'polished professional finish',
    'magazine quality',
    'premium aesthetic',
    'clean and crisp',
  ],
}

export const NEGATIVE_PROMPTS = {
  ideogram: 'blurry, out of focus, pixelated, jpeg artifacts, watermark, text cut off, misspelled words, typos, grammatical errors, low resolution, amateur, stock photo watermark, distorted, deformed, ugly, poorly drawn, bad anatomy, wrong anatomy, extra limbs, missing limbs, floating limbs, mutated hands, extra fingers, poorly drawn hands, poorly drawn face, mutation, ugly, disgusting, blurry, bad art',
  dalle: '', // DALL-E doesn't support negative prompts, handled via positive phrasing
}

// ============================================
// INDUSTRY TEMPLATES
// ============================================

export interface IndustryTemplate {
  keywords: string[]
  visualStyle: string
  subjects: string[]
  mood: string
  colorSuggestions: string
  avoid: string[]
  promptAdditions: string
}

export const INDUSTRY_TEMPLATES: Record<string, IndustryTemplate> = {
  tech: {
    keywords: ['technology', 'software', 'app', 'saas', 'tech', 'digital', 'startup', 'ai', 'device', 'gadget', 'electronics', 'earbuds', 'headphones', 'phone', 'laptop', 'computer'],
    visualStyle: 'minimalist product photography, Apple-style aesthetic, clean modern design',
    subjects: ['sleek devices', 'clean interfaces', 'modern workspaces', 'premium tech products'],
    mood: 'innovative, premium, cutting-edge, professional yet approachable',
    colorSuggestions: 'deep navy (#1a1a2e), electric blue (#0066ff), clean white, subtle gradients',
    avoid: ['cluttered backgrounds', 'cheap plastic look', 'outdated tech', 'generic stock photos'],
    promptAdditions: 'minimalist composition, subtle reflections on surface, premium tech aesthetic, clean lines, sophisticated',
  },
  food: {
    keywords: ['food', 'restaurant', 'cafe', 'cooking', 'recipe', 'meal', 'chef', 'cuisine', 'bakery', 'coffee'],
    visualStyle: 'professional food photography, Bon Appétit magazine style, appetizing presentation',
    subjects: ['beautifully plated dishes', 'fresh ingredients', 'cooking action shots', 'cozy dining settings'],
    mood: 'appetizing, warm, inviting, artisanal, fresh',
    colorSuggestions: 'warm earth tones, vibrant food colors, rustic wood (#8B7355), cream whites',
    avoid: ['unappetizing angles', 'harsh lighting', 'messy presentation', 'artificial looking food'],
    promptAdditions: 'natural window lighting, steam rising, garnish details visible, rustic wooden surface, mouth-watering presentation',
  },
  fitness: {
    keywords: ['fitness', 'gym', 'workout', 'health', 'wellness', 'exercise', 'training', 'sports', 'athletic'],
    visualStyle: 'dynamic action photography, Nike campaign aesthetic, powerful and inspiring',
    subjects: ['athletes in motion', 'workout equipment', 'active lifestyle moments', 'transformation journeys'],
    mood: 'empowering, energetic, determined, aspirational, strong',
    colorSuggestions: 'bold blacks, energetic oranges (#FF6B35), electric blues, high contrast',
    avoid: ['static poses', 'empty gym photos', 'unflattering angles', 'low energy'],
    promptAdditions: 'dramatic side lighting, motion capture, sweat droplets visible, powerful pose, athletic energy',
  },
  fashion: {
    keywords: ['fashion', 'clothing', 'style', 'apparel', 'boutique', 'designer', 'outfit', 'wear'],
    visualStyle: 'editorial fashion photography, Vogue magazine quality, high-end aesthetic',
    subjects: ['styled outfits', 'fashion details', 'lifestyle shots', 'confident poses'],
    mood: 'stylish, aspirational, confident, trendy, luxurious',
    colorSuggestions: 'depends on brand, typically neutral backgrounds with product color pop',
    avoid: ['amateur model poses', 'poor lighting', 'wrinkled clothes', 'distracting backgrounds'],
    promptAdditions: 'professional studio lighting, confident pose, high-fashion aesthetic, editorial quality, perfect styling',
  },
  beauty: {
    keywords: ['beauty', 'skincare', 'makeup', 'cosmetics', 'salon', 'spa', 'hair', 'nails'],
    visualStyle: 'clean beauty photography, glossy magazine aesthetic, flawless finish',
    subjects: ['product close-ups', 'application shots', 'before/after', 'ingredient highlights'],
    mood: 'luxurious, clean, fresh, radiant, pampered',
    colorSuggestions: 'soft pinks, clean whites, rose gold accents, pastel tones',
    avoid: ['harsh shadows on face', 'unflattering angles', 'dirty/messy application', 'low quality packaging shots'],
    promptAdditions: 'soft diffused lighting, dewy fresh skin, luxurious textures, spa-like atmosphere, flawless complexion',
  },
  business: {
    keywords: ['business', 'corporate', 'consulting', 'b2b', 'professional', 'enterprise', 'finance', 'marketing', 'agency'],
    visualStyle: 'professional corporate photography, LinkedIn-appropriate, trustworthy',
    subjects: ['professional settings', 'team collaboration', 'modern offices', 'success moments'],
    mood: 'professional, trustworthy, successful, collaborative, confident',
    colorSuggestions: 'corporate blues (#0077B5), clean whites, subtle grays, trust-building colors',
    avoid: ['overly casual', 'empty offices', 'generic handshake photos', 'dated corporate imagery'],
    promptAdditions: 'professional environment, natural confident expressions, modern office aesthetic, collaborative atmosphere',
  },
  lifestyle: {
    keywords: ['lifestyle', 'home', 'living', 'family', 'travel', 'adventure', 'experience'],
    visualStyle: 'authentic lifestyle photography, Instagram-worthy, relatable yet aspirational',
    subjects: ['real moments', 'beautiful spaces', 'adventures', 'meaningful connections'],
    mood: 'authentic, aspirational, warm, inspiring, relatable',
    colorSuggestions: 'warm natural tones, golden hour colors, cozy neutrals',
    avoid: ['overly staged', 'fake smiles', 'unrealistic scenarios', 'stock photo feel'],
    promptAdditions: 'natural lighting, candid moment, warm atmosphere, authentic emotion, lifestyle aesthetic',
  },
  education: {
    keywords: ['education', 'learning', 'course', 'training', 'school', 'teaching', 'tutorial', 'coaching'],
    visualStyle: 'clean educational imagery, approachable and inspiring',
    subjects: ['learning moments', 'achievement', 'growth visualization', 'knowledge sharing'],
    mood: 'inspiring, accessible, growth-oriented, empowering, clear',
    colorSuggestions: 'trustworthy blues, growth greens, clean whites, warm accents',
    avoid: ['boring classroom photos', 'dated imagery', 'condescending visuals', 'overly complex'],
    promptAdditions: 'bright optimistic lighting, sense of achievement, clear and accessible, inspiring learning environment',
  },
  ecommerce: {
    keywords: ['shop', 'store', 'product', 'retail', 'ecommerce', 'buy', 'sell', 'merchandise'],
    visualStyle: 'clean product photography, e-commerce optimized, conversion-focused',
    subjects: ['product hero shots', 'lifestyle context', 'detail close-ups', 'scale references'],
    mood: 'desirable, trustworthy, premium quality, must-have',
    colorSuggestions: 'clean white backgrounds, or lifestyle-appropriate settings',
    avoid: ['cluttered backgrounds', 'poor product angles', 'inconsistent lighting', 'amateur photos'],
    promptAdditions: 'clean white background, professional product photography, sharp detail, premium presentation, e-commerce quality',
  },
}

// ============================================
// BRAND DNA EXTRACTION
// ============================================

export interface BrandDNA {
  industry: string
  visualStyle: string
  colorPalette: string[]
  mood: string
  subjects: string[]
  avoid: string[]
  template: IndustryTemplate | null
}

/**
 * Extract brand visual DNA from company/industry information
 */
export function extractBrandDNA(
  company: string,
  industry: string,
  topic: string,
  audience: string,
  colorPreferences?: string[]
): BrandDNA {
  // Find matching industry template
  const combinedText = `${company} ${industry} ${topic} ${audience}`.toLowerCase()

  let matchedTemplate: IndustryTemplate | null = null
  let matchedIndustry = 'general'

  for (const [industryKey, template] of Object.entries(INDUSTRY_TEMPLATES)) {
    const matchCount = template.keywords.filter(keyword =>
      combinedText.includes(keyword.toLowerCase())
    ).length

    if (matchCount > 0 && (!matchedTemplate || matchCount > 2)) {
      matchedTemplate = template
      matchedIndustry = industryKey
    }
  }

  // Build brand DNA
  const brandDNA: BrandDNA = {
    industry: matchedIndustry,
    visualStyle: matchedTemplate?.visualStyle || 'professional, clean, modern aesthetic',
    colorPalette: colorPreferences?.length ? colorPreferences : [],
    mood: matchedTemplate?.mood || 'professional, engaging, high-quality',
    subjects: matchedTemplate?.subjects || ['relevant imagery', 'professional quality'],
    avoid: matchedTemplate?.avoid || ['generic stock photos', 'low quality', 'amateur look'],
    template: matchedTemplate,
  }

  return brandDNA
}

// ============================================
// TEXT SPELLING PROTOCOL
// ============================================

/**
 * Format text for accurate rendering in image generation
 * Uses triple-repetition and character spelling for accuracy
 */
export function formatTextForImageGeneration(
  text: string,
  placement: 'top' | 'center' | 'bottom' = 'center',
  style: 'bold' | 'elegant' | 'minimal' = 'bold'
): string {
  if (!text || text.trim().length === 0) {
    return ''
  }

  const cleanText = text.trim()

  // Spell out words character by character for words > 4 letters
  const words = cleanText.split(' ')
  const spelledOut = words
    .filter(word => word.length > 4)
    .map(word => `"${word}" spelled ${word.toUpperCase().split('').join('-')}`)
    .join(', ')

  // Determine font style
  const fontStyle = {
    bold: 'bold sans-serif font (similar to Helvetica Bold or SF Pro Display Bold)',
    elegant: 'elegant serif font (similar to Playfair Display or Times)',
    minimal: 'clean minimal sans-serif font (similar to Inter or Roboto)',
  }[style]

  // Determine placement
  const placementDesc = {
    top: 'positioned in the upper third of the image',
    center: 'centered in the image',
    bottom: 'positioned in the lower third of the image',
  }[placement]

  // Build text instruction with triple repetition
  return `
TEXT CONTENT (CRITICAL - MUST BE ACCURATE):
The image displays text that reads exactly: "${cleanText}"
The text "${cleanText}" must appear exactly as written, with correct spelling.
${spelledOut ? `Spelling verification: ${spelledOut}` : ''}
Display "${cleanText}" in ${fontStyle}, ${placementDesc}.
The text "${cleanText}" should be clearly legible with good contrast against the background.
Use a subtle drop shadow or outline if needed for readability.
`.trim()
}

// ============================================
// PROMPT ENHANCEMENT
// ============================================

export interface PromptEnhancementOptions {
  basePrompt: string
  slideNumber?: number
  slidePurpose?: 'hook' | 'content' | 'cta' | 'general'
  textContent?: string
  textPlacement?: 'top' | 'center' | 'bottom'
  brandDNA?: BrandDNA
  imageStyle?: string
  imageMood?: string
  colorPreferences?: string[]
  isIdeogram?: boolean
  aspectRatio?: 'square' | 'portrait' | 'landscape'
}

export interface EnhancedPrompt {
  prompt: string
  negativePrompt: string
  qualityScore: number
}

/**
 * Enhance an image prompt with quality modifiers, brand DNA, and text protocols
 */
export function enhanceImagePrompt(options: PromptEnhancementOptions): EnhancedPrompt {
  const {
    basePrompt,
    slidePurpose = 'general',
    textContent,
    textPlacement = 'center',
    brandDNA,
    imageStyle,
    imageMood,
    colorPreferences,
    isIdeogram = false,
    aspectRatio = 'square',
  } = options

  const promptParts: string[] = []
  let qualityScore = 0

  // 1. Start with format specification
  const formatSpec = {
    square: 'Instagram square format (1080x1080)',
    portrait: 'Instagram portrait format (1080x1350)',
    landscape: 'Instagram landscape format (1080x608)',
  }[aspectRatio]
  promptParts.push(`Professional image for ${formatSpec}.`)
  qualityScore += 5

  // 2. Add the base prompt
  promptParts.push(basePrompt)
  qualityScore += 10

  // 3. Add brand DNA if available
  if (brandDNA?.template) {
    promptParts.push(`\nVISUAL STYLE: ${brandDNA.visualStyle}`)
    promptParts.push(`MOOD: ${brandDNA.mood}`)
    if (brandDNA.template.promptAdditions) {
      promptParts.push(brandDNA.template.promptAdditions)
    }
    qualityScore += 20
  }

  // 4. Add image style and mood
  if (imageStyle) {
    promptParts.push(`\nSTYLE: ${imageStyle} photography/design`)
    qualityScore += 5
  }
  if (imageMood) {
    promptParts.push(`ATMOSPHERE: ${imageMood} feeling`)
    qualityScore += 5
  }

  // 5. Add color preferences
  if (colorPreferences && colorPreferences.length > 0) {
    promptParts.push(`\nCOLOR PALETTE: Incorporate these colors: ${colorPreferences.join(', ')}`)
    qualityScore += 10
  } else if (brandDNA?.colorPalette && brandDNA.colorPalette.length > 0) {
    promptParts.push(`\nCOLOR PALETTE: ${brandDNA.colorPalette.join(', ')}`)
    qualityScore += 5
  }

  // 6. Add slide-purpose specific instructions
  const purposeInstructions = {
    hook: 'COMPOSITION: Bold, attention-grabbing composition. High contrast. Clear focal point that stops the scroll. Dramatic impact.',
    content: 'COMPOSITION: Clean, informative layout. Space for text overlay if needed. Supporting visual that enhances understanding.',
    cta: 'COMPOSITION: Action-oriented energy. Clear visual hierarchy. Professional finish that inspires action.',
    general: 'COMPOSITION: Balanced, professional composition with clear focal point.',
  }
  promptParts.push(`\n${purposeInstructions[slidePurpose]}`)
  qualityScore += 10

  // 7. Add text content with spelling protocol (especially for Ideogram)
  if (textContent && textContent.trim().length > 0) {
    const textInstructions = formatTextForImageGeneration(
      textContent,
      textPlacement,
      slidePurpose === 'hook' ? 'bold' : slidePurpose === 'cta' ? 'bold' : 'minimal'
    )
    promptParts.push(`\n${textInstructions}`)
    qualityScore += 20
  }

  // 8. Add quality modifiers
  const qualityMods = [
    ...QUALITY_MODIFIERS.photography.slice(0, 3),
    ...QUALITY_MODIFIERS.lighting.slice(0, 2),
    ...QUALITY_MODIFIERS.finish.slice(0, 2),
  ]
  promptParts.push(`\nQUALITY: ${qualityMods.join(', ')}.`)
  qualityScore += 15

  // 9. Add things to avoid
  const avoidList = brandDNA?.avoid || ['generic stock photos', 'low quality', 'amateur look', 'blurry']
  promptParts.push(`\nAVOID: ${avoidList.join(', ')}.`)
  qualityScore += 5

  // 10. Add Ideogram-specific instructions
  if (isIdeogram && textContent) {
    promptParts.push(`\nIMPORTANT: This image contains text. Ensure all text is spelled correctly and clearly legible.`)
    qualityScore += 5
  }

  // Build final prompt
  const finalPrompt = promptParts.join('\n')

  // Get appropriate negative prompt
  const negativePrompt = isIdeogram ? NEGATIVE_PROMPTS.ideogram : NEGATIVE_PROMPTS.dalle

  return {
    prompt: finalPrompt,
    negativePrompt,
    qualityScore: Math.min(qualityScore, 100),
  }
}

/**
 * Quick enhance for simple cases - adds quality modifiers to any prompt
 */
export function quickEnhancePrompt(prompt: string, isIdeogram: boolean = false): string {
  const qualityAdditions = [
    'professional quality',
    'sharp focus',
    '8K detail',
    'perfect lighting',
    'polished finish',
  ].join(', ')

  return `${prompt}. ${qualityAdditions}.`
}
