/**
 * Instagram Options Unit Tests
 *
 * Tests for Instagram style options and defaults.
 */

import { describe, it, expect } from 'vitest'
import {
  defaultInstagramStyleProfile,
  defaultImageGenerationOptions,
  allInstagramStyleCategories,
  captionStyle,
  hashtagStrategy,
  visualStyle,
  contentType
} from '@/app/api/generate/instagram-options'

describe('Instagram Style Options', () => {
  describe('Default Style Profile', () => {
    it('should have all required caption style fields', () => {
      expect(defaultInstagramStyleProfile.caption_tone).toBeDefined()
      expect(defaultInstagramStyleProfile.emoji_usage).toBeDefined()
      expect(defaultInstagramStyleProfile.cta_style).toBeDefined()
      expect(defaultInstagramStyleProfile.content_format).toBeDefined()
    })

    it('should have all required hashtag strategy fields', () => {
      expect(defaultInstagramStyleProfile.hashtag_strategy).toBeDefined()
      expect(defaultInstagramStyleProfile.hashtag_placement).toBeDefined()
    })

    it('should have all required visual style fields', () => {
      expect(defaultInstagramStyleProfile.image_style).toBeDefined()
      expect(defaultInstagramStyleProfile.image_mood).toBeDefined()
      expect(defaultInstagramStyleProfile.color_scheme).toBeDefined()
    })

    it('should have all required content type fields', () => {
      expect(defaultInstagramStyleProfile.post_format).toBeDefined()
      expect(defaultInstagramStyleProfile.carousel_slides).toBeDefined()
    })

    it('should have sensible defaults', () => {
      expect(defaultInstagramStyleProfile.caption_tone).toBe('friendly')
      expect(defaultInstagramStyleProfile.emoji_usage).toBe('moderate')
      expect(defaultInstagramStyleProfile.hashtag_strategy).toBe('minimal')
      expect(defaultInstagramStyleProfile.post_format).toBe('carousel')
    })
  })

  describe('Default Image Generation Options', () => {
    it('should have image generation disabled by default', () => {
      expect(defaultImageGenerationOptions.generateImages).toBe(false)
    })

    it('should have sensible style defaults', () => {
      expect(defaultImageGenerationOptions.style).toBe('photography')
      expect(defaultImageGenerationOptions.mood).toBe('professional')
    })

    it('should have empty arrays for preferences', () => {
      expect(defaultImageGenerationOptions.colorPreferences).toEqual([])
      expect(defaultImageGenerationOptions.subjectsToInclude).toEqual([])
      expect(defaultImageGenerationOptions.subjectsToAvoid).toEqual([])
    })

    it('should have empty additional notes', () => {
      expect(defaultImageGenerationOptions.additionalImageNotes).toBe('')
    })
  })

  describe('Style Categories', () => {
    it('should have 4 main categories', () => {
      expect(allInstagramStyleCategories).toHaveLength(4)
    })

    it('should include caption style category', () => {
      const category = allInstagramStyleCategories.find(c => c.id === 'caption_style')
      expect(category).toBeDefined()
      expect(category?.name).toBe('Caption Style')
    })

    it('should include hashtag strategy category', () => {
      const category = allInstagramStyleCategories.find(c => c.id === 'hashtag_strategy')
      expect(category).toBeDefined()
      expect(category?.name).toBe('Hashtag Strategy')
    })

    it('should include visual style category', () => {
      const category = allInstagramStyleCategories.find(c => c.id === 'visual_style')
      expect(category).toBeDefined()
      expect(category?.name).toBe('Visual Style')
    })

    it('should include content type category', () => {
      const category = allInstagramStyleCategories.find(c => c.id === 'content_type')
      expect(category).toBeDefined()
      expect(category?.name).toBe('Content Type')
    })
  })

  describe('Caption Style Options', () => {
    it('should have caption tone options', () => {
      const option = captionStyle.options.find(o => o.id === 'caption_tone')
      expect(option).toBeDefined()
      expect(option?.options.length).toBeGreaterThan(0)
    })

    it('should have emoji usage options', () => {
      const option = captionStyle.options.find(o => o.id === 'emoji_usage')
      expect(option).toBeDefined()
      expect(option?.options).toContainEqual(
        expect.objectContaining({ value: 'minimal' })
      )
    })

    it('should have CTA style options', () => {
      const option = captionStyle.options.find(o => o.id === 'cta_style')
      expect(option).toBeDefined()
      expect(option?.options).toContainEqual(
        expect.objectContaining({ value: 'question' })
      )
    })

    it('should have content format options', () => {
      const option = captionStyle.options.find(o => o.id === 'content_format')
      expect(option).toBeDefined()
      expect(option?.options).toContainEqual(
        expect.objectContaining({ value: 'tips_list' })
      )
    })
  })

  describe('Hashtag Strategy Options', () => {
    it('should have hashtag strategy options', () => {
      const option = hashtagStrategy.options.find(o => o.id === 'hashtag_strategy')
      expect(option).toBeDefined()
      expect(option?.options).toContainEqual(
        expect.objectContaining({ value: 'minimal' })
      )
    })

    it('should have hashtag placement options', () => {
      const option = hashtagStrategy.options.find(o => o.id === 'hashtag_placement')
      expect(option).toBeDefined()
      expect(option?.options).toContainEqual(
        expect.objectContaining({ value: 'first_comment' })
      )
    })
  })

  describe('Visual Style Options', () => {
    it('should have image style options', () => {
      const option = visualStyle.options.find(o => o.id === 'image_style')
      expect(option).toBeDefined()
      expect(option?.options).toContainEqual(
        expect.objectContaining({ value: 'photography' })
      )
    })

    it('should have image mood options', () => {
      const option = visualStyle.options.find(o => o.id === 'image_mood')
      expect(option).toBeDefined()
      expect(option?.options).toContainEqual(
        expect.objectContaining({ value: 'professional' })
      )
    })

    it('should have color scheme options', () => {
      const option = visualStyle.options.find(o => o.id === 'color_scheme')
      expect(option).toBeDefined()
      expect(option?.options).toContainEqual(
        expect.objectContaining({ value: 'brand_colors' })
      )
    })
  })

  describe('Content Type Options', () => {
    it('should have post format options', () => {
      const option = contentType.options.find(o => o.id === 'post_format')
      expect(option).toBeDefined()
      expect(option?.options).toContainEqual(
        expect.objectContaining({ value: 'carousel' })
      )
    })

    it('should have carousel slides options', () => {
      const option = contentType.options.find(o => o.id === 'carousel_slides')
      expect(option).toBeDefined()
      expect(option?.options).toContainEqual(
        expect.objectContaining({ value: '5' })
      )
    })

    it('should support all Instagram post types', () => {
      const option = contentType.options.find(o => o.id === 'post_format')
      const values = option?.options.map(o => o.value) || []

      expect(values).toContain('single_post')
      expect(values).toContain('carousel')
      expect(values).toContain('reels_cover')
      expect(values).toContain('story')
    })
  })

  describe('Option Validity', () => {
    it('all options should have required fields', () => {
      for (const category of allInstagramStyleCategories) {
        expect(category.id).toBeDefined()
        expect(category.name).toBeDefined()
        expect(category.description).toBeDefined()
        expect(category.options.length).toBeGreaterThan(0)

        for (const option of category.options) {
          expect(option.id).toBeDefined()
          expect(option.label).toBeDefined()
          expect(option.hint).toBeDefined()
          expect(option.options.length).toBeGreaterThan(0)

          for (const choice of option.options) {
            expect(choice.value).toBeDefined()
            expect(choice.label).toBeDefined()
          }
        }
      }
    })

    it('default values should be valid options', () => {
      // Check caption_tone default is in options
      const captionToneOption = captionStyle.options.find(o => o.id === 'caption_tone')
      const captionToneValues = captionToneOption?.options.map(o => o.value) || []
      expect(captionToneValues).toContain(defaultInstagramStyleProfile.caption_tone)

      // Check emoji_usage default is in options
      const emojiOption = captionStyle.options.find(o => o.id === 'emoji_usage')
      const emojiValues = emojiOption?.options.map(o => o.value) || []
      expect(emojiValues).toContain(defaultInstagramStyleProfile.emoji_usage)

      // Check hashtag_strategy default is in options
      const hashtagOption = hashtagStrategy.options.find(o => o.id === 'hashtag_strategy')
      const hashtagValues = hashtagOption?.options.map(o => o.value) || []
      expect(hashtagValues).toContain(defaultInstagramStyleProfile.hashtag_strategy)

      // Check post_format default is in options
      const formatOption = contentType.options.find(o => o.id === 'post_format')
      const formatValues = formatOption?.options.map(o => o.value) || []
      expect(formatValues).toContain(defaultInstagramStyleProfile.post_format)
    })
  })
})
