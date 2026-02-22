/**
 * LinkedIn Options Unit Tests
 *
 * Tests for LinkedIn style options, defaults, pricing, and helper functions.
 */

import { describe, it, expect } from 'vitest'
import {
  defaultLinkedInStyleProfile,
  allLinkedInStyleCategories,
  contentSourceCategory,
  voiceStyleCategory,
  platformOptimizationCategory,
  engagementCategory,
  contentMixCategory,
  textPostCategory,
  carouselCategory,
  articleCategory,
  pollCategory,
  LINKEDIN_PRICING,
  getLinkedInStyleOptionByValue,
  validateLinkedInStyleProfile,
  mergeWithLinkedInDefaults
} from '@/app/api/generate/linkedin-options'

describe('LinkedIn Style Options', () => {
  describe('Default Style Profile', () => {
    it('should have all required content source fields', () => {
      expect(defaultLinkedInStyleProfile.source_type).toBeDefined()
    })

    it('should have all required voice & style fields', () => {
      expect(defaultLinkedInStyleProfile.voice_learning).toBeDefined()
      expect(defaultLinkedInStyleProfile.tone).toBeDefined()
      expect(defaultLinkedInStyleProfile.controversy_level).toBeDefined()
      expect(defaultLinkedInStyleProfile.emoji_usage).toBeDefined()
    })

    it('should have all required platform optimization fields', () => {
      expect(defaultLinkedInStyleProfile.trend_integration).toBeDefined()
      expect(defaultLinkedInStyleProfile.hashtag_strategy).toBeDefined()
      expect(defaultLinkedInStyleProfile.post_length).toBeDefined()
    })

    it('should have all required engagement fields', () => {
      expect(defaultLinkedInStyleProfile.engagement_style).toBeDefined()
      expect(defaultLinkedInStyleProfile.cta_approach).toBeDefined()
      expect(defaultLinkedInStyleProfile.first_comment_strategy).toBeDefined()
    })

    it('should have all required content mix fields', () => {
      expect(defaultLinkedInStyleProfile.content_distribution).toBeDefined()
      expect(defaultLinkedInStyleProfile.hook_style).toBeDefined()
    })

    it('should have all required text post fields', () => {
      expect(defaultLinkedInStyleProfile.formatting_style).toBeDefined()
      expect(defaultLinkedInStyleProfile.variation_style).toBeDefined()
    })

    it('should have all required carousel fields', () => {
      expect(defaultLinkedInStyleProfile.carousel_type).toBeDefined()
      expect(defaultLinkedInStyleProfile.slide_count).toBeDefined()
      expect(defaultLinkedInStyleProfile.visual_style).toBeDefined()
    })

    it('should have all required article fields', () => {
      expect(defaultLinkedInStyleProfile.article_type).toBeDefined()
      expect(defaultLinkedInStyleProfile.article_length).toBeDefined()
      expect(defaultLinkedInStyleProfile.companion_post_style).toBeDefined()
    })

    it('should have all required poll fields', () => {
      expect(defaultLinkedInStyleProfile.poll_type).toBeDefined()
      expect(defaultLinkedInStyleProfile.poll_duration).toBeDefined()
      expect(defaultLinkedInStyleProfile.follow_up_strategy).toBeDefined()
    })

    it('should have LinkedIn-optimized defaults', () => {
      expect(defaultLinkedInStyleProfile.source_type).toBe('original')
      expect(defaultLinkedInStyleProfile.tone).toBe('bold_confident')
      expect(defaultLinkedInStyleProfile.controversy_level).toBe('clear_position')
      expect(defaultLinkedInStyleProfile.emoji_usage).toBe('minimal')
      expect(defaultLinkedInStyleProfile.hashtag_strategy).toBe('minimal')
      expect(defaultLinkedInStyleProfile.first_comment_strategy).toBe('context_add')
      expect(defaultLinkedInStyleProfile.formatting_style).toBe('short_lines')
      expect(defaultLinkedInStyleProfile.cta_approach).toBe('engagement_prompt')
    })
  })

  describe('Style Categories', () => {
    it('should have 9 main categories', () => {
      expect(allLinkedInStyleCategories).toHaveLength(9)
    })

    it('should include content source category', () => {
      const category = allLinkedInStyleCategories.find(c => c.id === 'content_source')
      expect(category).toBeDefined()
      expect(category?.name).toBe('Content Source')
    })

    it('should include voice style category', () => {
      const category = allLinkedInStyleCategories.find(c => c.id === 'voice_style')
      expect(category).toBeDefined()
      expect(category?.name).toBe('Voice & Style')
    })

    it('should include platform optimization category', () => {
      const category = allLinkedInStyleCategories.find(c => c.id === 'platform_optimization')
      expect(category).toBeDefined()
      expect(category?.name).toBe('Platform Optimization')
    })

    it('should include engagement category', () => {
      const category = allLinkedInStyleCategories.find(c => c.id === 'engagement')
      expect(category).toBeDefined()
      expect(category?.name).toBe('Engagement Strategy')
    })

    it('should include content mix category', () => {
      const category = allLinkedInStyleCategories.find(c => c.id === 'content_mix')
      expect(category).toBeDefined()
      expect(category?.name).toBe('Content Mix')
    })

    it('should include text post category', () => {
      const category = allLinkedInStyleCategories.find(c => c.id === 'text_post')
      expect(category).toBeDefined()
      expect(category?.name).toBe('Text Post Settings')
    })

    it('should include carousel category', () => {
      const category = allLinkedInStyleCategories.find(c => c.id === 'carousel')
      expect(category).toBeDefined()
      expect(category?.name).toBe('Carousel Settings')
    })

    it('should include article category', () => {
      const category = allLinkedInStyleCategories.find(c => c.id === 'article')
      expect(category).toBeDefined()
      expect(category?.name).toBe('Article/Newsletter Settings')
    })

    it('should include poll category', () => {
      const category = allLinkedInStyleCategories.find(c => c.id === 'poll')
      expect(category).toBeDefined()
      expect(category?.name).toBe('Poll Settings')
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
      expect(values).toContain('presentation_repurpose')
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

    it('should have tone options including LinkedIn-specific tones', () => {
      const option = voiceStyleCategory.options.find(o => o.id === 'tone')
      expect(option).toBeDefined()
      const values = option?.options.map(o => o.value) || []
      expect(values).toContain('professional')
      expect(values).toContain('conversational')
      expect(values).toContain('bold_confident')
      expect(values).toContain('educational')
      expect(values).toContain('storytelling')
      expect(values).toContain('inspirational')
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
        expect.objectContaining({ value: 'active' })
      )
    })

    it('should have hashtag strategy options', () => {
      const option = platformOptimizationCategory.options.find(o => o.id === 'hashtag_strategy')
      expect(option).toBeDefined()
      expect(option?.options).toContainEqual(
        expect.objectContaining({ value: 'research_based' })
      )
    })

    it('should have post length options', () => {
      const option = platformOptimizationCategory.options.find(o => o.id === 'post_length')
      expect(option).toBeDefined()
      const values = option?.options.map(o => o.value) || []
      expect(values).toContain('short_punchy')
      expect(values).toContain('standard')
      expect(values).toContain('long_form')
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

    it('should have first comment strategy options', () => {
      const option = engagementCategory.options.find(o => o.id === 'first_comment_strategy')
      expect(option).toBeDefined()
      const values = option?.options.map(o => o.value) || []
      expect(values).toContain('link_drop')
      expect(values).toContain('context_add')
      expect(values).toContain('question')
      expect(values).toContain('resource')
    })
  })

  describe('Content Mix Options', () => {
    it('should have content distribution options', () => {
      const option = contentMixCategory.options.find(o => o.id === 'content_distribution')
      expect(option).toBeDefined()
      const values = option?.options.map(o => o.value) || []
      expect(values).toContain('thought_leadership')
      expect(values).toContain('balanced')
      expect(values).toContain('engagement_focused')
      expect(values).toContain('storytelling')
    })

    it('should have hook style options', () => {
      const option = contentMixCategory.options.find(o => o.id === 'hook_style')
      expect(option).toBeDefined()
      const values = option?.options.map(o => o.value) || []
      expect(values).toContain('bold_statement')
      expect(values).toContain('question')
      expect(values).toContain('story_opening')
      expect(values).toContain('contrarian')
      expect(values).toContain('mixed')
    })
  })

  describe('Text Post Options', () => {
    it('should have formatting style options', () => {
      const option = textPostCategory.options.find(o => o.id === 'formatting_style')
      expect(option).toBeDefined()
      const values = option?.options.map(o => o.value) || []
      expect(values).toContain('short_lines')
      expect(values).toContain('paragraphs')
      expect(values).toContain('mixed')
      expect(values).toContain('list_format')
    })

    it('should have variation style options', () => {
      const option = textPostCategory.options.find(o => o.id === 'variation_style')
      expect(option).toBeDefined()
      expect(option?.options).toContainEqual(
        expect.objectContaining({ value: 'diverse' })
      )
    })
  })

  describe('Carousel Options', () => {
    it('should have carousel type options', () => {
      const option = carouselCategory.options.find(o => o.id === 'carousel_type')
      expect(option).toBeDefined()
      const values = option?.options.map(o => o.value) || []
      expect(values).toContain('how_to')
      expect(values).toContain('listicle')
      expect(values).toContain('story')
      expect(values).toContain('framework')
      expect(values).toContain('comparison')
      expect(values).toContain('myth_busting')
    })

    it('should have slide count options', () => {
      const option = carouselCategory.options.find(o => o.id === 'slide_count')
      expect(option).toBeDefined()
      const values = option?.options.map(o => o.value) || []
      expect(values).toContain('short')
      expect(values).toContain('standard')
      expect(values).toContain('long')
    })

    it('should have visual style options', () => {
      const option = carouselCategory.options.find(o => o.id === 'visual_style')
      expect(option).toBeDefined()
      expect(option?.options).toContainEqual(
        expect.objectContaining({ value: 'clean_minimal' })
      )
    })
  })

  describe('Article Options', () => {
    it('should have article type options', () => {
      const option = articleCategory.options.find(o => o.id === 'article_type')
      expect(option).toBeDefined()
      const values = option?.options.map(o => o.value) || []
      expect(values).toContain('thought_leadership')
      expect(values).toContain('how_to')
      expect(values).toContain('analysis')
      expect(values).toContain('case_study')
      expect(values).toContain('opinion')
    })

    it('should have article length options', () => {
      const option = articleCategory.options.find(o => o.id === 'article_length')
      expect(option).toBeDefined()
      const values = option?.options.map(o => o.value) || []
      expect(values).toContain('short')
      expect(values).toContain('standard')
      expect(values).toContain('deep_dive')
    })

    it('should have companion post style options', () => {
      const option = articleCategory.options.find(o => o.id === 'companion_post_style')
      expect(option).toBeDefined()
      const values = option?.options.map(o => o.value) || []
      expect(values).toContain('teaser')
      expect(values).toContain('summary')
      expect(values).toContain('story_hook')
      expect(values).toContain('question')
    })
  })

  describe('Poll Options', () => {
    it('should have poll type options', () => {
      const option = pollCategory.options.find(o => o.id === 'poll_type')
      expect(option).toBeDefined()
      const values = option?.options.map(o => o.value) || []
      expect(values).toContain('opinion')
      expect(values).toContain('prediction')
      expect(values).toContain('experience')
      expect(values).toContain('controversial')
      expect(values).toContain('fun')
    })

    it('should have poll duration options', () => {
      const option = pollCategory.options.find(o => o.id === 'poll_duration')
      expect(option).toBeDefined()
      const values = option?.options.map(o => o.value) || []
      expect(values).toContain('1_day')
      expect(values).toContain('3_days')
      expect(values).toContain('1_week')
      expect(values).toContain('2_weeks')
    })

    it('should have follow-up strategy options', () => {
      const option = pollCategory.options.find(o => o.id === 'follow_up_strategy')
      expect(option).toBeDefined()
      const values = option?.options.map(o => o.value) || []
      expect(values).toContain('results_post')
      expect(values).toContain('carousel')
      expect(values).toContain('article')
      expect(values).toContain('none')
    })
  })

  describe('Pricing Configuration', () => {
    it('should have text post pricing for all tiers', () => {
      expect(LINKEDIN_PRICING.textPosts.budget).toBeDefined()
      expect(LINKEDIN_PRICING.textPosts.standard).toBeDefined()
      expect(LINKEDIN_PRICING.textPosts.premium).toBeDefined()
    })

    it('should have carousel pricing for all tiers', () => {
      expect(LINKEDIN_PRICING.carousels.budget).toBeDefined()
      expect(LINKEDIN_PRICING.carousels.standard).toBeDefined()
      expect(LINKEDIN_PRICING.carousels.premium).toBeDefined()
    })

    it('should have article pricing for all tiers', () => {
      expect(LINKEDIN_PRICING.articles.budget).toBeDefined()
      expect(LINKEDIN_PRICING.articles.standard).toBeDefined()
      expect(LINKEDIN_PRICING.articles.premium).toBeDefined()
    })

    it('should have poll pricing for all tiers', () => {
      expect(LINKEDIN_PRICING.polls.budget).toBeDefined()
      expect(LINKEDIN_PRICING.polls.standard).toBeDefined()
      expect(LINKEDIN_PRICING.polls.premium).toBeDefined()
    })

    it('should have increasing prices from budget to premium', () => {
      expect(LINKEDIN_PRICING.textPosts.standard[5]).toBeGreaterThan(LINKEDIN_PRICING.textPosts.budget[5])
      expect(LINKEDIN_PRICING.textPosts.premium[5]).toBeGreaterThan(LINKEDIN_PRICING.textPosts.standard[5])
    })
  })

  describe('Helper Functions', () => {
    describe('getLinkedInStyleOptionByValue', () => {
      it('should find option by category, option id, and value', () => {
        const result = getLinkedInStyleOptionByValue('voice_style', 'tone', 'bold_confident')
        expect(result).toBeDefined()
        expect(result?.label).toBe('Bold & Confident')
      })

      it('should return undefined for invalid category', () => {
        const result = getLinkedInStyleOptionByValue('invalid', 'tone', 'professional')
        expect(result).toBeUndefined()
      })

      it('should return undefined for invalid option id', () => {
        const result = getLinkedInStyleOptionByValue('voice_style', 'invalid', 'professional')
        expect(result).toBeUndefined()
      })

      it('should return undefined for invalid value', () => {
        const result = getLinkedInStyleOptionByValue('voice_style', 'tone', 'invalid')
        expect(result).toBeUndefined()
      })
    })

    describe('validateLinkedInStyleProfile', () => {
      it('should validate a complete profile', () => {
        const result = validateLinkedInStyleProfile(defaultLinkedInStyleProfile)
        expect(result.isValid).toBe(true)
        expect(result.missingFields).toHaveLength(0)
      })

      it('should detect missing fields', () => {
        const result = validateLinkedInStyleProfile({
          source_type: 'original',
          tone: 'professional'
        })
        expect(result.isValid).toBe(false)
        expect(result.missingFields.length).toBeGreaterThan(0)
      })

      it('should detect empty profile', () => {
        const result = validateLinkedInStyleProfile({})
        expect(result.isValid).toBe(false)
        expect(result.missingFields.length).toBe(Object.keys(defaultLinkedInStyleProfile).length)
      })
    })

    describe('mergeWithLinkedInDefaults', () => {
      it('should merge selections with defaults', () => {
        const result = mergeWithLinkedInDefaults({
          tone: 'professional',
          emoji_usage: 'none'
        })
        expect(result.tone).toBe('professional')
        expect(result.emoji_usage).toBe('none')
        expect(result.source_type).toBe('original') // default
        expect(result.controversy_level).toBe('clear_position') // default
      })

      it('should return defaults when no selections', () => {
        const result = mergeWithLinkedInDefaults({})
        expect(result).toEqual(defaultLinkedInStyleProfile)
      })

      it('should override all defaults when full profile provided', () => {
        const customProfile = {
          ...defaultLinkedInStyleProfile,
          tone: 'educational',
          emoji_usage: 'heavy'
        }
        const result = mergeWithLinkedInDefaults(customProfile)
        expect(result.tone).toBe('educational')
        expect(result.emoji_usage).toBe('heavy')
      })
    })
  })
})
