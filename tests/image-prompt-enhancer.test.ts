/**
 * Tests for Image Prompt Enhancer
 *
 * Tests quality modifiers, text spelling protocol, industry templates, and brand DNA extraction.
 */

import { describe, it, expect } from 'vitest'
import {
  QUALITY_MODIFIERS,
  NEGATIVE_PROMPTS,
  INDUSTRY_TEMPLATES,
  extractBrandDNA,
  formatTextForImageGeneration,
  enhanceImagePrompt,
  quickEnhancePrompt,
  type BrandDNA,
  type IndustryTemplate,
} from '@/app/api/generate/image-prompt-enhancer'

describe('Image Prompt Enhancer', () => {
  // ============================================
  // QUALITY MODIFIERS TESTS
  // ============================================
  describe('Quality Modifiers', () => {
    it('should have photography modifiers', () => {
      expect(QUALITY_MODIFIERS.photography).toBeDefined()
      expect(QUALITY_MODIFIERS.photography.length).toBeGreaterThan(0)
      expect(QUALITY_MODIFIERS.photography).toContain('professional photography')
      expect(QUALITY_MODIFIERS.photography).toContain('sharp focus')
    })

    it('should have lighting modifiers', () => {
      expect(QUALITY_MODIFIERS.lighting).toBeDefined()
      expect(QUALITY_MODIFIERS.lighting.length).toBeGreaterThan(0)
    })

    it('should have composition modifiers', () => {
      expect(QUALITY_MODIFIERS.composition).toBeDefined()
      expect(QUALITY_MODIFIERS.composition.length).toBeGreaterThan(0)
    })

    it('should have finish modifiers', () => {
      expect(QUALITY_MODIFIERS.finish).toBeDefined()
      expect(QUALITY_MODIFIERS.finish.length).toBeGreaterThan(0)
    })
  })

  // ============================================
  // NEGATIVE PROMPTS TESTS
  // ============================================
  describe('Negative Prompts', () => {
    it('should have ideogram negative prompt', () => {
      expect(NEGATIVE_PROMPTS.ideogram).toBeDefined()
      expect(NEGATIVE_PROMPTS.ideogram.length).toBeGreaterThan(0)
      expect(NEGATIVE_PROMPTS.ideogram).toContain('blurry')
      expect(NEGATIVE_PROMPTS.ideogram).toContain('misspelled')
    })

    it('should have empty dalle negative prompt (not supported)', () => {
      expect(NEGATIVE_PROMPTS.dalle).toBeDefined()
      expect(NEGATIVE_PROMPTS.dalle).toBe('')
    })
  })

  // ============================================
  // INDUSTRY TEMPLATES TESTS
  // ============================================
  describe('Industry Templates', () => {
    const industries = ['tech', 'food', 'fitness', 'fashion', 'beauty', 'business', 'lifestyle', 'education', 'ecommerce']

    it('should have all industry templates', () => {
      industries.forEach(industry => {
        expect(INDUSTRY_TEMPLATES[industry]).toBeDefined()
      })
    })

    it('should have correct structure for each template', () => {
      industries.forEach(industry => {
        const template = INDUSTRY_TEMPLATES[industry]
        expect(template.keywords).toBeDefined()
        expect(Array.isArray(template.keywords)).toBe(true)
        expect(template.keywords.length).toBeGreaterThan(0)
        expect(template.visualStyle).toBeDefined()
        expect(template.subjects).toBeDefined()
        expect(template.mood).toBeDefined()
        expect(template.colorSuggestions).toBeDefined()
        expect(template.avoid).toBeDefined()
        expect(template.promptAdditions).toBeDefined()
      })
    })

    it('tech template should have tech-related keywords', () => {
      const techTemplate = INDUSTRY_TEMPLATES.tech
      expect(techTemplate.keywords).toContain('technology')
      expect(techTemplate.keywords).toContain('software')
      expect(techTemplate.keywords).toContain('ai')
    })

    it('food template should have food-related keywords', () => {
      const foodTemplate = INDUSTRY_TEMPLATES.food
      expect(foodTemplate.keywords).toContain('food')
      expect(foodTemplate.keywords).toContain('restaurant')
      expect(foodTemplate.keywords).toContain('cooking')
    })
  })

  // ============================================
  // BRAND DNA EXTRACTION TESTS
  // ============================================
  describe('Brand DNA Extraction', () => {
    it('should extract tech brand DNA', () => {
      const brandDNA = extractBrandDNA('TechCorp', 'technology', 'AI chatbots', 'developers')
      expect(brandDNA.industry).toBe('tech')
      expect(brandDNA.template).toBeDefined()
      expect(brandDNA.visualStyle).toContain('minimalist')
    })

    it('should extract food brand DNA', () => {
      const brandDNA = extractBrandDNA('CafeDelight', 'food and beverage', 'coffee recipes', 'coffee lovers')
      expect(brandDNA.industry).toBe('food')
      expect(brandDNA.template).toBeDefined()
    })

    it('should extract fitness brand DNA', () => {
      const brandDNA = extractBrandDNA('FitLife', 'fitness', 'workout routines', 'gym enthusiasts')
      expect(brandDNA.industry).toBe('fitness')
    })

    it('should use general template for unknown industry', () => {
      const brandDNA = extractBrandDNA('RandomCorp', 'unknown-industry', 'random topic', 'general audience')
      expect(brandDNA.industry).toBe('general')
      expect(brandDNA.template).toBeNull()
    })

    it('should include color preferences when provided', () => {
      const colors = ['#FF0000', '#00FF00']
      const brandDNA = extractBrandDNA('TechCorp', 'technology', 'apps', 'users', colors)
      expect(brandDNA.colorPalette).toEqual(colors)
    })

    it('should have empty color palette when not provided', () => {
      const brandDNA = extractBrandDNA('TechCorp', 'technology', 'apps', 'users')
      expect(brandDNA.colorPalette).toEqual([])
    })
  })

  // ============================================
  // TEXT SPELLING PROTOCOL TESTS
  // ============================================
  describe('Text Spelling Protocol', () => {
    it('should return empty string for empty text', () => {
      const result = formatTextForImageGeneration('')
      expect(result).toBe('')
    })

    it('should return empty string for whitespace only', () => {
      const result = formatTextForImageGeneration('   ')
      expect(result).toBe('')
    })

    it('should include text content in output', () => {
      const result = formatTextForImageGeneration('Hello World')
      expect(result).toContain('Hello World')
      expect(result).toContain('TEXT CONTENT')
    })

    it('should triple-repeat text for accuracy', () => {
      const result = formatTextForImageGeneration('Test')
      // The text should appear multiple times
      const matches = result.match(/Test/g)
      expect(matches?.length).toBeGreaterThanOrEqual(3)
    })

    it('should spell out words longer than 4 characters', () => {
      const result = formatTextForImageGeneration('Hello')
      expect(result).toContain('H-E-L-L-O')
    })

    it('should not spell out short words', () => {
      const result = formatTextForImageGeneration('Hi')
      expect(result).not.toContain('H-I')
    })

    it('should handle placement top', () => {
      const result = formatTextForImageGeneration('Test', 'top')
      expect(result).toContain('upper third')
    })

    it('should handle placement center', () => {
      const result = formatTextForImageGeneration('Test', 'center')
      expect(result).toContain('centered')
    })

    it('should handle placement bottom', () => {
      const result = formatTextForImageGeneration('Test', 'bottom')
      expect(result).toContain('lower third')
    })

    it('should handle bold style', () => {
      const result = formatTextForImageGeneration('Test', 'center', 'bold')
      expect(result).toContain('bold')
    })

    it('should handle elegant style', () => {
      const result = formatTextForImageGeneration('Test', 'center', 'elegant')
      expect(result).toContain('serif')
    })

    it('should handle minimal style', () => {
      const result = formatTextForImageGeneration('Test', 'center', 'minimal')
      expect(result).toContain('minimal')
    })
  })

  // ============================================
  // PROMPT ENHANCEMENT TESTS
  // ============================================
  describe('Prompt Enhancement', () => {
    it('should enhance a basic prompt', () => {
      const result = enhanceImagePrompt({
        basePrompt: 'A person working on a laptop',
      })
      expect(result.prompt).toContain('A person working on a laptop')
      expect(result.qualityScore).toBeGreaterThan(0)
    })

    it('should include format specification', () => {
      const result = enhanceImagePrompt({
        basePrompt: 'Test image',
        aspectRatio: 'square',
      })
      expect(result.prompt).toContain('Instagram square format')
    })

    it('should include portrait format for portrait ratio', () => {
      const result = enhanceImagePrompt({
        basePrompt: 'Test image',
        aspectRatio: 'portrait',
      })
      expect(result.prompt).toContain('Instagram portrait format')
    })

    it('should include landscape format for landscape ratio', () => {
      const result = enhanceImagePrompt({
        basePrompt: 'Test image',
        aspectRatio: 'landscape',
      })
      expect(result.prompt).toContain('Instagram landscape format')
    })

    it('should add brand DNA when provided', () => {
      const brandDNA = extractBrandDNA('TechCorp', 'technology', 'AI', 'developers')
      const result = enhanceImagePrompt({
        basePrompt: 'Test image',
        brandDNA,
      })
      expect(result.prompt).toContain('VISUAL STYLE')
      expect(result.prompt).toContain('MOOD')
      expect(result.qualityScore).toBeGreaterThan(30)
    })

    it('should add image style when provided', () => {
      const result = enhanceImagePrompt({
        basePrompt: 'Test image',
        imageStyle: 'cinematic',
      })
      expect(result.prompt).toContain('STYLE: cinematic')
    })

    it('should add image mood when provided', () => {
      const result = enhanceImagePrompt({
        basePrompt: 'Test image',
        imageMood: 'dramatic',
      })
      expect(result.prompt).toContain('ATMOSPHERE: dramatic')
    })

    it('should add color preferences when provided', () => {
      const result = enhanceImagePrompt({
        basePrompt: 'Test image',
        colorPreferences: ['#FF0000', 'blue', 'green'],
      })
      expect(result.prompt).toContain('COLOR PALETTE')
      expect(result.prompt).toContain('#FF0000')
    })

    it('should add hook composition for hook slides', () => {
      const result = enhanceImagePrompt({
        basePrompt: 'Test image',
        slidePurpose: 'hook',
      })
      expect(result.prompt).toContain('Bold')
      expect(result.prompt).toContain('attention-grabbing')
    })

    it('should add content composition for content slides', () => {
      const result = enhanceImagePrompt({
        basePrompt: 'Test image',
        slidePurpose: 'content',
      })
      expect(result.prompt).toContain('Clean')
      expect(result.prompt).toContain('informative')
    })

    it('should add cta composition for cta slides', () => {
      const result = enhanceImagePrompt({
        basePrompt: 'Test image',
        slidePurpose: 'cta',
      })
      expect(result.prompt).toContain('Action-oriented')
    })

    it('should add text content with spelling protocol', () => {
      const result = enhanceImagePrompt({
        basePrompt: 'Test image',
        textContent: 'Special Offer',
      })
      expect(result.prompt).toContain('Special Offer')
      expect(result.prompt).toContain('TEXT CONTENT')
    })

    it('should add quality modifiers', () => {
      const result = enhanceImagePrompt({
        basePrompt: 'Test image',
      })
      expect(result.prompt).toContain('QUALITY')
      expect(result.prompt).toContain('professional')
    })

    it('should add avoid section', () => {
      const result = enhanceImagePrompt({
        basePrompt: 'Test image',
      })
      expect(result.prompt).toContain('AVOID')
    })

    it('should add Ideogram-specific instructions for text images', () => {
      const result = enhanceImagePrompt({
        basePrompt: 'Test image',
        textContent: 'Hello',
        isIdeogram: true,
      })
      expect(result.prompt).toContain('IMPORTANT')
      expect(result.prompt).toContain('text')
    })

    it('should return ideogram negative prompt when isIdeogram true', () => {
      const result = enhanceImagePrompt({
        basePrompt: 'Test image',
        isIdeogram: true,
      })
      expect(result.negativePrompt).toContain('blurry')
    })

    it('should return empty negative prompt for DALL-E', () => {
      const result = enhanceImagePrompt({
        basePrompt: 'Test image',
        isIdeogram: false,
      })
      expect(result.negativePrompt).toBe('')
    })

    it('should cap quality score at 100', () => {
      const brandDNA = extractBrandDNA('TechCorp', 'technology', 'AI', 'developers')
      const result = enhanceImagePrompt({
        basePrompt: 'Test image',
        brandDNA,
        imageStyle: 'cinematic',
        imageMood: 'dramatic',
        colorPreferences: ['#FF0000'],
        textContent: 'Hello World',
        isIdeogram: true,
      })
      expect(result.qualityScore).toBeLessThanOrEqual(100)
    })
  })

  // ============================================
  // QUICK ENHANCE TESTS
  // ============================================
  describe('Quick Enhance', () => {
    it('should add quality modifiers to simple prompt', () => {
      const result = quickEnhancePrompt('A cat sitting on a couch')
      expect(result).toContain('A cat sitting on a couch')
      expect(result).toContain('professional quality')
      expect(result).toContain('sharp focus')
    })

    it('should work with both ideogram true and false', () => {
      const resultDalle = quickEnhancePrompt('Test', false)
      const resultIdeogram = quickEnhancePrompt('Test', true)
      expect(resultDalle).toContain('professional quality')
      expect(resultIdeogram).toContain('professional quality')
    })
  })
})
