/**
 * Ideogram API Client
 *
 * Provides high-quality AI image generation with excellent text rendering.
 * API Documentation: https://developer.ideogram.ai/
 *
 * To get API credentials:
 * 1. Sign up at https://ideogram.ai (Google or Apple account)
 * 2. Click Profile icon → API Beta
 * 3. Accept Developer API Agreement
 * 4. Add payment ($10 minimum)
 * 5. Create API key at https://ideogram.ai/manage-api
 *
 * Environment variable required: IDEOGRAM_API_KEY
 */

const IDEOGRAM_BASE_URL = 'https://api.ideogram.ai'

export type IdeogramAspectRatio =
  | 'ASPECT_1_1'    // 1:1 Square
  | 'ASPECT_16_9'   // 16:9 Landscape
  | 'ASPECT_9_16'   // 9:16 Portrait (Stories/Reels)
  | 'ASPECT_4_3'    // 4:3
  | 'ASPECT_3_4'    // 3:4
  | 'ASPECT_3_2'    // 3:2
  | 'ASPECT_2_3'    // 2:3
  | 'ASPECT_16_10'  // 16:10
  | 'ASPECT_10_16'  // 10:16
  | 'ASPECT_4_5'    // 4:5 Instagram Feed optimal

export type IdeogramRenderingSpeed =
  | 'TURBO'   // Fastest, lower quality
  | 'FLASH'   // Fast
  | 'DEFAULT' // Balanced
  | 'QUALITY' // Highest quality, slower

export type IdeogramStyleType =
  | 'AUTO'
  | 'GENERAL'
  | 'REALISTIC'
  | 'DESIGN'
  | 'FICTION'

export type IdeogramStylePreset =
  | 'AUTO'
  | 'OIL_PAINTING'
  | 'WATERCOLOR'
  | 'DIGITAL_ART'
  | 'CINEMATIC'
  | 'PHOTOGRAPHY'
  | 'MINIMALIST'
  | 'FLAT_DESIGN'
  | '3D_RENDER'
  | 'ANIME'
  | 'COMIC_BOOK'
  | 'VINTAGE'
  | 'NEON'
  | 'PASTEL'
  | 'MONOCHROME'
  | 'GEOMETRIC'
  | 'ISOMETRIC'
  | 'LOW_POLY'
  | 'PSYCHEDELIC'
  | 'SYNTHWAVE'

export type IdeogramMagicPrompt = 'AUTO' | 'ON' | 'OFF'

export interface IdeogramGenerateRequest {
  prompt: string
  aspect_ratio?: IdeogramAspectRatio
  resolution?: string  // e.g., "1024x1024"
  rendering_speed?: IdeogramRenderingSpeed
  magic_prompt?: IdeogramMagicPrompt
  negative_prompt?: string
  num_images?: number
  seed?: number
  style_type?: IdeogramStyleType
  style_preset?: IdeogramStylePreset
}

export interface IdeogramImageResult {
  url: string
  prompt: string
  resolution: string
  is_image_safe: boolean
  seed: number
  style_type?: string
}

export interface IdeogramGenerateResponse {
  created: string
  data: IdeogramImageResult[]
}

export interface IdeogramError {
  error: {
    code: string
    message: string
  }
}

/**
 * Get the Ideogram API key from environment
 */
function getApiKey(): string {
  const apiKey = process.env.IDEOGRAM_API_KEY
  if (!apiKey) {
    throw new Error('IDEOGRAM_API_KEY environment variable is not set. Get your API key at https://ideogram.ai/manage-api')
  }
  return apiKey
}

/**
 * Check if Ideogram API is configured
 */
export function isIdeogramConfigured(): boolean {
  return !!process.env.IDEOGRAM_API_KEY
}

/**
 * Generate an image using Ideogram 3.0
 *
 * Best for images with text overlays, logos, and social media graphics.
 *
 * @param request - Generation parameters
 * @returns Generated image data
 */
export async function generateImage(
  request: IdeogramGenerateRequest
): Promise<IdeogramGenerateResponse> {
  const apiKey = getApiKey()

  // Build JSON request body
  const requestBody: Record<string, any> = {
    image_request: {
      prompt: request.prompt,
      model: 'V_2', // Use V_2 model (stable)
      magic_prompt_option: request.magic_prompt || 'AUTO',
    }
  }

  // Add optional parameters
  if (request.aspect_ratio) {
    requestBody.image_request.aspect_ratio = request.aspect_ratio
  }
  if (request.negative_prompt) {
    requestBody.image_request.negative_prompt = request.negative_prompt
  }
  if (request.style_type) {
    requestBody.image_request.style_type = request.style_type
  }
  if (request.seed !== undefined) {
    requestBody.image_request.seed = request.seed
  }

  console.log('🎨 Ideogram request:', JSON.stringify(requestBody, null, 2))

  const response = await fetch(`${IDEOGRAM_BASE_URL}/generate`, {
    method: 'POST',
    headers: {
      'Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    console.error('🎨 Ideogram error response:', errorText)

    let errorMessage = response.statusText
    try {
      const errorData = JSON.parse(errorText)
      errorMessage = errorData?.message || errorData?.error?.message || errorText
    } catch {}

    if (response.status === 401) {
      throw new Error('Ideogram API authentication failed. Check your API key.')
    }
    if (response.status === 422) {
      throw new Error(`Ideogram content safety check failed: ${errorMessage}`)
    }
    if (response.status === 429) {
      throw new Error('Ideogram API rate limit exceeded. Please try again later.')
    }

    throw new Error(`Ideogram API error: ${response.status} - ${errorMessage}`)
  }

  const result = await response.json()

  // Transform response to expected format
  return {
    created: result.created || new Date().toISOString(),
    data: result.data?.map((img: any) => ({
      url: img.url,
      prompt: img.prompt || request.prompt,
      resolution: img.resolution || '1024x1024',
      is_image_safe: img.is_image_safe ?? true,
      seed: img.seed || 0,
      style_type: img.style_type,
    })) || [],
  }
}

/**
 * Generate an image optimized for Instagram
 *
 * @param prompt - Image description
 * @param options - Instagram-specific options
 * @returns Generated image URL and metadata
 */
export async function generateInstagramImage(
  prompt: string,
  options: {
    format?: 'feed' | 'story' | 'square'
    includeText?: boolean
    textContent?: string
    style?: IdeogramStylePreset
    mood?: string
    colorPalette?: string[]
  } = {}
): Promise<{
  url: string
  prompt: string
  revisedPrompt?: string
}> {
  // Determine aspect ratio based on format
  let aspectRatio: IdeogramAspectRatio = 'ASPECT_1_1'
  if (options.format === 'story') {
    aspectRatio = 'ASPECT_9_16'
  } else if (options.format === 'feed') {
    aspectRatio = 'ASPECT_4_5'
  }

  // Build enhanced prompt for text-heavy images
  let enhancedPrompt = prompt

  if (options.includeText && options.textContent) {
    // Ideogram excels at text rendering, so we include text instructions
    enhancedPrompt = `${prompt}. Text on image: "${options.textContent}". Text should be clearly readable, well-positioned, and visually integrated.`
  }

  if (options.mood) {
    enhancedPrompt += ` Mood: ${options.mood}.`
  }

  if (options.colorPalette && options.colorPalette.length > 0) {
    enhancedPrompt += ` Color palette: ${options.colorPalette.join(', ')}.`
  }

  const result = await generateImage({
    prompt: enhancedPrompt,
    aspect_ratio: aspectRatio,
    magic_prompt: 'AUTO',
    style_type: 'DESIGN', // Best for text-heavy images
    negative_prompt: 'blurry text, misspelled text, cut off text, low quality, distorted',
  })

  if (!result.data || result.data.length === 0) {
    throw new Error('Ideogram API returned no images')
  }

  const image = result.data[0]
  return {
    url: image.url,
    prompt: enhancedPrompt,
    revisedPrompt: image.prompt !== enhancedPrompt ? image.prompt : undefined,
  }
}

/**
 * Map common style names to Ideogram presets
 */
export function mapStyleToPreset(style: string): IdeogramStylePreset {
  const styleMap: Record<string, IdeogramStylePreset> = {
    'photography': 'PHOTOGRAPHY',
    'illustration': 'DIGITAL_ART',
    'minimalist': 'MINIMALIST',
    '3d_render': '3D_RENDER',
    'flat_design': 'FLAT_DESIGN',
    'watercolor': 'WATERCOLOR',
    'cinematic': 'CINEMATIC',
    'anime': 'ANIME',
    'vintage': 'VINTAGE',
    'neon': 'NEON',
  }

  return styleMap[style.toLowerCase()] || 'AUTO'
}

/**
 * Determine if a slide should use Ideogram (text-heavy) or DALL-E (photo-realistic)
 *
 * @param slideContent - Content of the slide
 * @returns 'ideogram' or 'dalle'
 */
export function recommendImageGenerator(slideContent: {
  hasTextOverlay?: boolean
  textLength?: number
  purpose?: string
  style?: string
}): 'ideogram' | 'dalle' {
  // Use Ideogram for text-heavy slides
  if (slideContent.hasTextOverlay && (slideContent.textLength || 0) > 10) {
    return 'ideogram'
  }

  // Use Ideogram for design-focused purposes
  const ideogramPurposes = ['hook', 'title', 'quote', 'cta', 'summary']
  if (slideContent.purpose && ideogramPurposes.includes(slideContent.purpose.toLowerCase())) {
    return 'ideogram'
  }

  // Use Ideogram for graphic design styles
  const ideogramStyles = ['minimalist', 'flat_design', '3d_render', 'geometric']
  if (slideContent.style && ideogramStyles.includes(slideContent.style.toLowerCase())) {
    return 'ideogram'
  }

  // Default to DALL-E for photorealistic content
  return 'dalle'
}
