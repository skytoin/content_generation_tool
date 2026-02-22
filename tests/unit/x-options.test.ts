/**
 * X (Twitter) Options Unit Tests
 *
 * Tests for X style options, defaults, pricing, and helper functions.
 */

import { describe, it, expect } from 'vitest'
import {
  defaultXStyleProfile,
  allXStyleCategories,
  contentSourceCategory,
  voiceStyleCategory,
  platformOptimizationCategory,
  engagementCategory,
  tweetGeneratorCategory,
  threadBuilderCategory,
  quoteTweetCategory,
  X_PRICING,
  getStyleOptionByValue,
  validateStyleProfile,
  mergeWithDefaults
} from '@/app/api/generate/x-options'

describe('X Style Options', () => {
  describe('Default Style Profile', () => {
    it('should have all required content source fields', () => {
      expect(defaultXStyleProfile.source_type).toBeDefined()
    })

    it('should have all required voice & style fields', () => {
      expect(defaultXStyleProfile.voice_learning).toBeDefined()
      expect(defaultXStyleProfile.tone).toBeDefined()
      expect(defaultXStyleProfile.controversy_level).toBeDefined()
      expect(defaultXStyleProfile.emoji_usage).toBeDefined()
    })

    it('should have all required platform optimization fields', () => {
      expect(defaultXStyleProfile.trend_integration).toBeDefined()
      expect(defaultXStyleProfile.hashtag_strategy).toBeDefined()
      expect(defaultXStyleProfile.length_preference).toBeDefined()
    })

    it('should have all required engagement fields', () => {
      expect(defaultXStyleProfile.engagement_style).toBeDefined()
      expect(defaultXStyleProfile.cta_approach).toBeDefined()
    })

    it('should have all required tweet generator fields', () => {
      expect(defaultXStyleProfile.content_mix).toBeDefined()
      expect(defaultXStyleProfile.variation_style).toBeDefined()
    })

    it('should have all required thread builder fields', () => {
      expect(defaultXStyleProfile.thread_type).toBeDefined()
      expect(defaultXStyleProfile.hook_style).toBeDefined()
      expect(defaultXStyleProfile.final_tweet_style).toBeDefined()
      expect(defaultXStyleProfile.visual_breaks).toBeDefined()
    })

    it('should have all required quote tweet fields', () => {
      expect(defaultXStyleProfile.input_mode).toBeDefined()
      expect(defaultXStyleProfile.quote_type_mix).toBeDefined()
      expect(defaultXStyleProfile.relationship_intent).toBeDefined()
    })

    it('should have sensible defaults', () => {
      expect(defaultXStyleProfile.source_type).toBe('original')
      expect(defaultXStyleProfile.tone).toBe('conversational')
      expect(defaultXStyleProfile.emoji_usage).toBe('minimal')
      expect(defaultXStyleProfile.hashtag_strategy).toBe('minimal')
      expect(defaultXStyleProfile.engagement_style).toBe('mixed')
    })
  })

  describe('Style Categories', () => {
    it('should have 7 main categories', () => {
      expect(allXStyleCategories).toHaveLength(7)
    })

    it('should include content source category', () => {
      const category = allXStyleCategories.find(c => c.id === 'content_source')
      expect(category).toBeDefined()
      expect(category?.name).toBe('Content Source')
    })

    it('should include voice style category', () => {
      const category = allXStyleCategories.find(c => c.id === 'voice_style')
      expect(category).toBeDefined()
      expect(category?.name).toBe('Voice & Style')
    })

    it('should include platform optimization category', () => {
      const category = allXStyleCategories.find(c => c.id === 'platform_optimization')
      expect(category).toBeDefined()
      expect(category?.name).toBe('Platform Optimization')
    })

    it('should include engagement category', () => {
      const category = allXStyleCategories.find(c => c.id === 'engagement')
      expect(category).toBeDefined()
      expect(category?.name).toBe('Engagement Strategy')
    })

    it('should include tweet generator category', () => {
      const category = allXStyleCategories.find(c => c.id === 'tweet_generator')
      expect(category).toBeDefined()
      expect(category?.name).toBe('Tweet Generator Settings')
    })

    it('should include thread builder category', () => {
      const category = allXStyleCategories.find(c => c.id === 'thread_builder')
      expect(category).toBeDefined()
      expect(category?.name).toBe('Thread Builder Settings')
    })

    it('should include quote tweet category', () => {
      const category = allXStyleCategories.find(c => c.id === 'quote_tweet')
      expect(category).toBeDefined()
      expect(category?.name).toBe('Quote Tweet Settings')
    })
  })

  describe('Content Source Options', () => {
    it('should have source type options', () => {
      const option = contentSourceCategory.options.find(o => o.id === 'source_type')
      expect(option).toBeDefined()
      expect(option?.options.length).toBeGreaterThan(0)
    })

    it('should include all content source types', () => {
      const option = contentSourceCategory.options.find(o => o.id === 'source_type')
      const values = option?.options.map(o => o.value) || []
      expect(values).toContain('original')
      expect(values).toContain('blog_repurpose')
      expect(values).toContain('newsletter_repurpose')
      expect(values).toContain('podcast_repurpose')
      expect(values).toContain('tweet_expansion')
    })
  })

  describe('Voice Style Options', () => {
    it('should have voice learning options', () => {
      const option = voiceStyleCategory.options.find(o => o.id === 'voice_learning')
      expect(option).toBeDefined()
      expect(option?.options).toContainEqual(
        expect.objectContaining({ value: 'full_clone' })
      )
    })

    it('should have tone options', () => {
      const option = voiceStyleCategory.options.find(o => o.id === 'tone')
      expect(option).toBeDefined()
      const values = option?.options.map(o => o.value) || []
      expect(values).toContain('professional')
      expect(values).toContain('conversational')
      expect(values).toContain('witty')
      expect(values).toContain('bold')
    })

    it('should have controversy level options', () => {
      const option = voiceStyleCategory.options.find(o => o.id === 'controversy_level')
      expect(option).toBeDefined()
      expect(option?.options).toContainEqual(
        expect.objectContaining({ value: 'spicy' })
      )
    })

    it('should have emoji usage options', () => {
      const option = voiceStyleCategory.options.find(o => o.id === 'emoji_usage')
      expect(option).toBeDefined()
      expect(option?.options).toContainEqual(
        expect.objectContaining({ value: 'minimal' })
      )
    })
  })

  describe('Platform Optimization Options', () => {
    it('should have trend integration options', () => {
      const option = platformOptimizationCategory.options.find(o => o.id === 'trend_integration')
      expect(option).toBeDefined()
      expect(option?.options).toContainEqual(
        expect.objectContaining({ value: 'trend_first' })
      )
    })

    it('should have hashtag strategy options', () => {
      const option = platformOptimizationCategory.options.find(o => o.id === 'hashtag_strategy')
      expect(option).toBeDefined()
      expect(option?.options).toContainEqual(
        expect.objectContaining({ value: 'research_based' })
      )
    })

    it('should have length preference options', () => {
      const option = platformOptimizationCategory.options.find(o => o.id === 'length_preference')
      expect(option).toBeDefined()
      const values = option?.options.map(o => o.value) || []
      expect(values).toContain('punchy')
      expect(values).toContain('standard')
      expect(values).toContain('detailed')
      expect(values).toContain('premium_long')
    })
  })

  describe('Engagement Options', () => {
    it('should have engagement style options', () => {
      const option = engagementCategory.options.find(o => o.id === 'engagement_style')
      expect(option).toBeDefined()
      expect(option?.options).toContainEqual(
        expect.objectContaining({ value: 'conversational' })
      )
    })

    it('should have CTA approach options', () => {
      const option = engagementCategory.options.find(o => o.id === 'cta_approach')
      expect(option).toBeDefined()
      expect(option?.options).toContainEqual(
        expect.objectContaining({ value: 'engagement_prompt' })
      )
    })
  })

  describe('Tweet Generator Specific Options', () => {
    it('should have content mix options', () => {
      const option = tweetGeneratorCategory.options.find(o => o.id === 'content_mix')
      expect(option).toBeDefined()
      const values = option?.options.map(o => o.value) || []
      expect(values).toContain('insight_heavy')
      expect(values).toContain('balanced')
      expect(values).toContain('engagement_focused')
      expect(values).toContain('storytelling')
    })

    it('should have variation style options', () => {
      const option = tweetGeneratorCategory.options.find(o => o.id === 'variation_style')
      expect(option).toBeDefined()
      expect(option?.options).toContainEqual(
        expect.objectContaining({ value: 'diverse' })
      )
    })
  })

  describe('Thread Builder Specific Options', () => {
    it('should have thread type options', () => {
      const option = threadBuilderCategory.options.find(o => o.id === 'thread_type')
      expect(option).toBeDefined()
      const values = option?.options.map(o => o.value) || []
      expect(values).toContain('how_to')
      expect(values).toContain('listicle')
      expect(values).toContain('story')
      expect(values).toContain('contrarian')
      expect(values).toContain('myth_busting')
    })

    it('should have hook style options', () => {
      const option = threadBuilderCategory.options.find(o => o.id === 'hook_style')
      expect(option).toBeDefined()
      expect(option?.options).toContainEqual(
        expect.objectContaining({ value: 'bold_statement' })
      )
    })

    it('should have final tweet style options', () => {
      const option = threadBuilderCategory.options.find(o => o.id === 'final_tweet_style')
      expect(option).toBeDefined()
      const values = option?.options.map(o => o.value) || []
      expect(values).toContain('summary')
      expect(values).toContain('cta')
      expect(values).toContain('question')
    })

    it('should have visual breaks options', () => {
      const option = threadBuilderCategory.options.find(o => o.id === 'visual_breaks')
      expect(option).toBeDefined()
      expect(option?.options).toContainEqual(
        expect.objectContaining({ value: 'suggested' })
      )
    })
  })

  describe('Quote Tweet Specific Options', () => {
    it('should have input mode options', () => {
      const option = quoteTweetCategory.options.find(o => o.id === 'input_mode')
      expect(option).toBeDefined()
      const values = option?.options.map(o => o.value) || []
      expect(values).toContain('target_accounts')
      expect(values).toContain('trends')
      expect(values).toContain('content_types')
    })

    it('should have quote type mix options', () => {
      const option = quoteTweetCategory.options.find(o => o.id === 'quote_type_mix')
      expect(option).toBeDefined()
      expect(option?.options).toContainEqual(
        expect.objectContaining({ value: 'thought_leadership' })
      )
    })

    it('should have relationship intent options', () => {
      const option = quoteTweetCategory.options.find(o => o.id === 'relationship_intent')
      expect(option).toBeDefined()
      const values = option?.options.map(o => o.value) || []
      expect(values).toContain('visibility')
      expect(values).toContain('networking')
      expect(values).toContain('authority')
      expect(values).toContain('community')
    })
  })

  describe('Option Validity', () => {
    it('all options should have required fields', () => {
      for (const category of allXStyleCategories) {
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
      // Check tone default is in options
      const toneOption = voiceStyleCategory.options.find(o => o.id === 'tone')
      const toneValues = toneOption?.options.map(o => o.value) || []
      expect(toneValues).toContain(defaultXStyleProfile.tone)

      // Check emoji_usage default is in options
      const emojiOption = voiceStyleCategory.options.find(o => o.id === 'emoji_usage')
      const emojiValues = emojiOption?.options.map(o => o.value) || []
      expect(emojiValues).toContain(defaultXStyleProfile.emoji_usage)

      // Check hashtag_strategy default is in options
      const hashtagOption = platformOptimizationCategory.options.find(o => o.id === 'hashtag_strategy')
      const hashtagValues = hashtagOption?.options.map(o => o.value) || []
      expect(hashtagValues).toContain(defaultXStyleProfile.hashtag_strategy)

      // Check thread_type default is in options
      const threadTypeOption = threadBuilderCategory.options.find(o => o.id === 'thread_type')
      const threadTypeValues = threadTypeOption?.options.map(o => o.value) || []
      expect(threadTypeValues).toContain(defaultXStyleProfile.thread_type)

      // Check hook_style default is in options
      const hookStyleOption = threadBuilderCategory.options.find(o => o.id === 'hook_style')
      const hookStyleValues = hookStyleOption?.options.map(o => o.value) || []
      expect(hookStyleValues).toContain(defaultXStyleProfile.hook_style)
    })
  })

  describe('Pricing Configuration', () => {
    it('should have pricing for all three pipelines', () => {
      expect(X_PRICING.tweetGenerator).toBeDefined()
      expect(X_PRICING.threadBuilder).toBeDefined()
      expect(X_PRICING.quoteTweetCrafter).toBeDefined()
    })

    it('should have all tiers for tweet generator', () => {
      expect(X_PRICING.tweetGenerator.budget).toBeDefined()
      expect(X_PRICING.tweetGenerator.standard).toBeDefined()
      expect(X_PRICING.tweetGenerator.premium).toBeDefined()
    })

    it('should have all tiers for thread builder', () => {
      expect(X_PRICING.threadBuilder.budget).toBeDefined()
      expect(X_PRICING.threadBuilder.standard).toBeDefined()
      expect(X_PRICING.threadBuilder.premium).toBeDefined()
    })

    it('should have all tiers for quote tweet crafter', () => {
      expect(X_PRICING.quoteTweetCrafter.budget).toBeDefined()
      expect(X_PRICING.quoteTweetCrafter.standard).toBeDefined()
      expect(X_PRICING.quoteTweetCrafter.premium).toBeDefined()
    })

    it('tweet generator pricing should scale with volume', () => {
      const budget = X_PRICING.tweetGenerator.budget
      expect(budget[7]).toBeLessThan(budget[14])
      expect(budget[14]).toBeLessThan(budget[30])
      expect(budget[30]).toBeLessThan(budget[60])
    })

    it('standard tier should be more expensive than budget', () => {
      expect(X_PRICING.tweetGenerator.standard[7]).toBeGreaterThan(X_PRICING.tweetGenerator.budget[7])
      expect(X_PRICING.threadBuilder.standard.mini).toBeGreaterThan(X_PRICING.threadBuilder.budget.mini)
      expect(X_PRICING.quoteTweetCrafter.standard[10]).toBeGreaterThan(X_PRICING.quoteTweetCrafter.budget[10])
    })

    it('premium tier should be more expensive than standard', () => {
      expect(X_PRICING.tweetGenerator.premium[7]).toBeGreaterThan(X_PRICING.tweetGenerator.standard[7])
      expect(X_PRICING.threadBuilder.premium.mini).toBeGreaterThan(X_PRICING.threadBuilder.standard.mini)
      expect(X_PRICING.quoteTweetCrafter.premium[10]).toBeGreaterThan(X_PRICING.quoteTweetCrafter.standard[10])
    })

    it('thread builder should have all size options', () => {
      const budget = X_PRICING.threadBuilder.budget
      expect(budget.mini).toBeDefined()
      expect(budget.standard).toBeDefined()
      expect(budget.deep).toBeDefined()
      expect(budget.ultimate).toBeDefined()
    })
  })

  describe('Helper Functions', () => {
    describe('getStyleOptionByValue', () => {
      it('should return option info for valid category/option/value', () => {
        const result = getStyleOptionByValue('voice_style', 'tone', 'professional')
        expect(result).toBeDefined()
        expect(result?.label).toBe('Professional')
      })

      it('should return undefined for invalid category', () => {
        const result = getStyleOptionByValue('invalid_category', 'tone', 'professional')
        expect(result).toBeUndefined()
      })

      it('should return undefined for invalid option', () => {
        const result = getStyleOptionByValue('voice_style', 'invalid_option', 'professional')
        expect(result).toBeUndefined()
      })

      it('should return undefined for invalid value', () => {
        const result = getStyleOptionByValue('voice_style', 'tone', 'invalid_value')
        expect(result).toBeUndefined()
      })
    })

    describe('validateStyleProfile', () => {
      it('should validate a complete profile as valid', () => {
        const result = validateStyleProfile(defaultXStyleProfile)
        expect(result.isValid).toBe(true)
        expect(result.missingFields).toHaveLength(0)
      })

      it('should detect missing fields', () => {
        const partialProfile = {
          source_type: 'original',
          tone: 'professional'
        }
        const result = validateStyleProfile(partialProfile)
        expect(result.isValid).toBe(false)
        expect(result.missingFields.length).toBeGreaterThan(0)
        expect(result.missingFields).toContain('voice_learning')
      })

      it('should handle empty profile', () => {
        const result = validateStyleProfile({})
        expect(result.isValid).toBe(false)
        expect(result.missingFields.length).toBe(Object.keys(defaultXStyleProfile).length)
      })
    })

    describe('mergeWithDefaults', () => {
      it('should merge partial profile with defaults', () => {
        const partial = {
          tone: 'bold',
          emoji_usage: 'heavy'
        }
        const result = mergeWithDefaults(partial)

        // Custom values should be preserved
        expect(result.tone).toBe('bold')
        expect(result.emoji_usage).toBe('heavy')

        // Default values should be used for missing fields
        expect(result.source_type).toBe(defaultXStyleProfile.source_type)
        expect(result.thread_type).toBe(defaultXStyleProfile.thread_type)
      })

      it('should return all default values for empty input', () => {
        const result = mergeWithDefaults({})
        expect(result).toEqual(defaultXStyleProfile)
      })

      it('should override all defaults with full custom profile', () => {
        const customProfile = {
          source_type: 'blog_repurpose',
          voice_learning: 'full_clone',
          tone: 'bold',
          controversy_level: 'spicy',
          emoji_usage: 'heavy',
          trend_integration: 'trend_first',
          hashtag_strategy: 'research_based',
          length_preference: 'punchy',
          engagement_style: 'conversational',
          cta_approach: 'direct',
          content_mix: 'engagement_focused',
          variation_style: 'thematic',
          thread_type: 'contrarian',
          hook_style: 'bold_statement',
          final_tweet_style: 'question',
          visual_breaks: 'emoji_dividers',
          input_mode: 'trends',
          quote_type_mix: 'thought_leadership',
          relationship_intent: 'authority'
        }
        const result = mergeWithDefaults(customProfile)
        expect(result).toEqual(customProfile)
      })
    })
  })
})
