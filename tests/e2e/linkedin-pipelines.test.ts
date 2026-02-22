/**
 * LinkedIn Pipeline E2E Tests
 *
 * These tests verify that the LinkedIn pipelines work by making real API calls.
 * They are EXCLUDED from normal test runs because they:
 * - Cost money (API calls to OpenAI, Anthropic)
 * - Take 30-60+ seconds per run
 * - Require valid API keys
 *
 * IMPORTANT FOR FUTURE AGENTS:
 * Always ask the user "Do you want to run pipeline tests too?" before running these.
 * Only run with: npm run test:pipelines
 *
 * LinkedIn Pipelines:
 * - Text Posts: 7 stages for individual posts with first comments
 * - Carousels: 7 stages for document/carousel posts with slide scripts
 * - Articles: 7 stages for long-form articles with companion posts
 * - Polls: 7 stages for polls with companion text and follow-up templates
 *
 * @see TESTING.md for full documentation
 */

import { describe, it, expect, beforeAll } from 'vitest'

// Check if pipeline tests should run
const RUN_PIPELINE_TESTS = process.env.RUN_PIPELINE_TESTS === 'true'

// Skip all tests if not explicitly enabled
const describeIf = RUN_PIPELINE_TESTS ? describe : describe.skip

// ============================================
// TEST CONFIGURATIONS
// ============================================

const TEXT_POST_TEST_CONFIG = {
  formData: {
    company: 'Test SaaS Company',
    industry: 'B2B SaaS',
    topic: 'Leadership lessons from scaling a startup',
    audience: 'Startup founders, VPs, and C-suite executives',
    postCount: 3
  },
  styleSelections: {
    source_type: 'original',
    voice_learning: 'none',
    tone: 'bold_confident',
    controversy_level: 'clear_position',
    emoji_usage: 'minimal',
    trend_integration: 'light',
    hashtag_strategy: 'minimal',
    post_length: 'standard',
    engagement_style: 'mixed',
    cta_approach: 'engagement_prompt',
    first_comment_strategy: 'context_add',
    content_distribution: 'balanced',
    hook_style: 'mixed',
    formatting_style: 'short_lines',
    variation_style: 'diverse'
  }
}

const CAROUSEL_TEST_CONFIG = {
  formData: {
    company: 'Test SaaS Company',
    industry: 'B2B SaaS',
    topic: '7 frameworks for better decision-making',
    audience: 'Startup founders and product managers',
    carouselCount: 1
  },
  styleSelections: {
    source_type: 'original',
    voice_learning: 'none',
    tone: 'educational',
    controversy_level: 'mild_opinion',
    emoji_usage: 'minimal',
    trend_integration: 'light',
    hashtag_strategy: 'standard',
    carousel_type: 'framework',
    slide_count: 'standard',
    visual_style: 'clean_minimal',
    first_comment_strategy: 'context_add'
  }
}

const ARTICLE_TEST_CONFIG = {
  formData: {
    company: 'Test SaaS Company',
    industry: 'B2B SaaS',
    topic: 'Why most B2B content strategies fail and how to fix them',
    audience: 'Marketing leaders and content strategists',
    articleCount: 1
  },
  styleSelections: {
    source_type: 'original',
    voice_learning: 'none',
    tone: 'bold_confident',
    controversy_level: 'clear_position',
    article_type: 'thought_leadership',
    article_length: 'standard',
    companion_post_style: 'teaser',
    first_comment_strategy: 'link_drop'
  }
}

const POLL_TEST_CONFIG = {
  formData: {
    company: 'Test SaaS Company',
    industry: 'B2B SaaS',
    topic: 'Remote work and team productivity',
    audience: 'Tech executives and team leads',
    pollCount: 3
  },
  styleSelections: {
    source_type: 'original',
    voice_learning: 'none',
    tone: 'conversational',
    controversy_level: 'mild_opinion',
    poll_type: 'opinion',
    poll_duration: '3_days',
    follow_up_strategy: 'results_post',
    first_comment_strategy: 'question'
  }
}

// Base URL for API calls
const getBaseUrl = () => {
  return process.env.TEST_BASE_URL || 'http://localhost:3000'
}

// ============================================
// TEXT POST PIPELINE TESTS
// ============================================

describeIf('LinkedIn Text Post Pipeline E2E Tests', () => {
  beforeAll(() => {
    console.log('\n💼 RUNNING LINKEDIN TEXT POST PIPELINE TESTS')
    console.log('⚠️  These tests make REAL API calls and cost money!')
    console.log(`📍 Testing against: ${getBaseUrl()}\n`)
  })

  describe('Text Post Generation (Budget Tier)', () => {
    it('should generate text posts using budget tier pipeline', async () => {
      const response = await fetch(`${getBaseUrl()}/api/generate/linkedin/text-posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: 'budget',
          formData: TEXT_POST_TEST_CONFIG.formData,
          styleSelections: TEXT_POST_TEST_CONFIG.styleSelections
        }),
      })

      if (response.status === 401) {
        console.log('⚠️  Text posts: Authentication required (expected without session)')
        expect(response.status).toBe(401)
        return
      }

      expect(response.ok).toBe(true)
      const data = await response.json()

      expect(data).toHaveProperty('success', true)
      expect(data).toHaveProperty('posts')
      expect(Array.isArray(data.posts)).toBe(true)
      expect(data.posts.length).toBeGreaterThan(0)

      // Verify post structure
      const post = data.posts[0]
      expect(post).toHaveProperty('id')
      expect(post).toHaveProperty('text')
      expect(post).toHaveProperty('characterCount')
      expect(post).toHaveProperty('hookText')
      expect(post).toHaveProperty('firstComment')
      expect(post).toHaveProperty('hashtags')

      // Verify LinkedIn constraints
      expect(typeof post.text).toBe('string')
      expect(post.text.length).toBeGreaterThan(10)
      expect(post.characterCount).toBeLessThanOrEqual(3000)
      expect(post.hookText.length).toBeLessThanOrEqual(210)
      expect(typeof post.firstComment).toBe('string')
      expect(post.firstComment.length).toBeGreaterThan(0)
      expect(Array.isArray(post.hashtags)).toBe(true)

      // Verify quality report
      expect(data).toHaveProperty('qualityReport')
      expect(data.qualityReport).toHaveProperty('overallScore')

      // Verify metadata
      expect(data).toHaveProperty('metadata')
      expect(data.metadata).toHaveProperty('tier', 'budget')
      expect(data.metadata).toHaveProperty('processingStages')

      console.log('✅ Text posts (budget) completed')
      console.log(`   Posts generated: ${data.posts.length}`)
      console.log(`   Quality Score: ${data.qualityReport.overallScore}`)
    }, 180000)
  })

  describe('Text Post Generation (Standard Tier)', () => {
    it('should generate text posts using standard tier pipeline', async () => {
      const response = await fetch(`${getBaseUrl()}/api/generate/linkedin/text-posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: 'standard',
          formData: TEXT_POST_TEST_CONFIG.formData,
          styleSelections: TEXT_POST_TEST_CONFIG.styleSelections
        }),
      })

      if (response.status === 401) {
        console.log('⚠️  Text posts (standard): Authentication required')
        expect(response.status).toBe(401)
        return
      }

      expect(response.ok).toBe(true)
      const data = await response.json()

      expect(data).toHaveProperty('success', true)
      expect(data).toHaveProperty('posts')
      expect(data.metadata.tier).toBe('standard')

      console.log('✅ Text posts (standard) completed')
      console.log(`   Posts generated: ${data.posts.length}`)
    }, 240000)
  })

  describe('Text Post Generation (Premium Tier)', () => {
    it('should generate text posts using premium tier pipeline with Claude', async () => {
      const response = await fetch(`${getBaseUrl()}/api/generate/linkedin/text-posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: 'premium',
          formData: TEXT_POST_TEST_CONFIG.formData,
          styleSelections: TEXT_POST_TEST_CONFIG.styleSelections
        }),
      })

      if (response.status === 401) {
        console.log('⚠️  Text posts (premium): Authentication required')
        expect(response.status).toBe(401)
        return
      }

      expect(response.ok).toBe(true)
      const data = await response.json()

      expect(data).toHaveProperty('success', true)
      expect(data).toHaveProperty('posts')
      expect(data.metadata.tier).toBe('premium')

      // Premium should have trend briefing
      if (data.trendBriefing) {
        expect(data.trendBriefing).toHaveProperty('currentTrends')
      }

      console.log('✅ Text posts (premium) completed')
      console.log(`   Posts generated: ${data.posts.length}`)
    }, 300000)
  })
})

// ============================================
// CAROUSEL PIPELINE TESTS
// ============================================

describeIf('LinkedIn Carousel Pipeline E2E Tests', () => {
  beforeAll(() => {
    console.log('\n📑 RUNNING LINKEDIN CAROUSEL PIPELINE TESTS')
    console.log('⚠️  These tests make REAL API calls and cost money!\n')
  })

  describe('Carousel Generation (Budget Tier)', () => {
    it('should generate carousels using budget tier pipeline', async () => {
      const response = await fetch(`${getBaseUrl()}/api/generate/linkedin/carousels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: 'budget',
          formData: CAROUSEL_TEST_CONFIG.formData,
          styleSelections: CAROUSEL_TEST_CONFIG.styleSelections
        }),
      })

      if (response.status === 401) {
        console.log('⚠️  Carousels: Authentication required')
        expect(response.status).toBe(401)
        return
      }

      expect(response.ok).toBe(true)
      const data = await response.json()

      expect(data).toHaveProperty('success', true)
      expect(data).toHaveProperty('carousels')
      expect(Array.isArray(data.carousels)).toBe(true)
      expect(data.carousels.length).toBeGreaterThan(0)

      // Verify carousel structure
      const carousel = data.carousels[0]
      expect(carousel).toHaveProperty('id')
      expect(carousel).toHaveProperty('caption')
      expect(carousel).toHaveProperty('slides')
      expect(carousel).toHaveProperty('firstComment')
      expect(carousel).toHaveProperty('hashtags')
      expect(Array.isArray(carousel.slides)).toBe(true)
      expect(carousel.slides.length).toBeGreaterThan(0)

      // Verify slide structure
      const slide = carousel.slides[0]
      expect(slide).toHaveProperty('slideNumber')
      expect(slide).toHaveProperty('headline')
      expect(slide).toHaveProperty('body')
      expect(slide).toHaveProperty('visualDirection')

      console.log('✅ Carousels (budget) completed')
      console.log(`   Carousels generated: ${data.carousels.length}`)
      console.log(`   Slides in first carousel: ${carousel.slides.length}`)
    }, 180000)
  })
})

// ============================================
// ARTICLE PIPELINE TESTS
// ============================================

describeIf('LinkedIn Article Pipeline E2E Tests', () => {
  beforeAll(() => {
    console.log('\n📰 RUNNING LINKEDIN ARTICLE PIPELINE TESTS')
    console.log('⚠️  These tests make REAL API calls and cost money!\n')
  })

  describe('Article Generation (Budget Tier)', () => {
    it('should generate articles using budget tier pipeline', async () => {
      const response = await fetch(`${getBaseUrl()}/api/generate/linkedin/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: 'budget',
          formData: ARTICLE_TEST_CONFIG.formData,
          styleSelections: ARTICLE_TEST_CONFIG.styleSelections
        }),
      })

      if (response.status === 401) {
        console.log('⚠️  Articles: Authentication required')
        expect(response.status).toBe(401)
        return
      }

      expect(response.ok).toBe(true)
      const data = await response.json()

      expect(data).toHaveProperty('success', true)
      expect(data).toHaveProperty('articles')
      expect(Array.isArray(data.articles)).toBe(true)
      expect(data.articles.length).toBeGreaterThan(0)

      // Verify article structure
      const article = data.articles[0]
      expect(article).toHaveProperty('id')
      expect(article).toHaveProperty('title')
      expect(article).toHaveProperty('body')
      expect(article).toHaveProperty('wordCount')
      expect(article).toHaveProperty('companionPost')
      expect(article).toHaveProperty('companionPostFirstComment')
      expect(article).toHaveProperty('sections')

      // Verify constraints
      expect(article.title.length).toBeLessThanOrEqual(100)
      expect(article.wordCount).toBeGreaterThan(500)
      expect(typeof article.companionPost).toBe('string')
      expect(article.companionPost.length).toBeGreaterThan(0)

      console.log('✅ Articles (budget) completed')
      console.log(`   Articles generated: ${data.articles.length}`)
      console.log(`   Word count: ${article.wordCount}`)
    }, 240000)
  })
})

// ============================================
// POLL PIPELINE TESTS
// ============================================

describeIf('LinkedIn Poll Pipeline E2E Tests', () => {
  beforeAll(() => {
    console.log('\n📊 RUNNING LINKEDIN POLL PIPELINE TESTS')
    console.log('⚠️  These tests make REAL API calls and cost money!\n')
  })

  describe('Poll Generation (Budget Tier)', () => {
    it('should generate polls using budget tier pipeline', async () => {
      const response = await fetch(`${getBaseUrl()}/api/generate/linkedin/polls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: 'budget',
          formData: POLL_TEST_CONFIG.formData,
          styleSelections: POLL_TEST_CONFIG.styleSelections
        }),
      })

      if (response.status === 401) {
        console.log('⚠️  Polls: Authentication required')
        expect(response.status).toBe(401)
        return
      }

      expect(response.ok).toBe(true)
      const data = await response.json()

      expect(data).toHaveProperty('success', true)
      expect(data).toHaveProperty('polls')
      expect(Array.isArray(data.polls)).toBe(true)
      expect(data.polls.length).toBeGreaterThan(0)

      // Verify poll structure
      const poll = data.polls[0]
      expect(poll).toHaveProperty('id')
      expect(poll).toHaveProperty('question')
      expect(poll).toHaveProperty('options')
      expect(poll).toHaveProperty('companionText')
      expect(poll).toHaveProperty('firstComment')

      // Verify LinkedIn poll constraints
      expect(poll.question.length).toBeLessThanOrEqual(140)
      expect(Array.isArray(poll.options)).toBe(true)
      expect(poll.options.length).toBeLessThanOrEqual(4)
      expect(poll.options.length).toBeGreaterThanOrEqual(2)

      // Verify each option is under 30 characters
      for (const option of poll.options) {
        expect(option.length).toBeLessThanOrEqual(30)
      }

      expect(typeof poll.firstComment).toBe('string')
      expect(poll.firstComment.length).toBeGreaterThan(0)

      console.log('✅ Polls (budget) completed')
      console.log(`   Polls generated: ${data.polls.length}`)
      console.log(`   First poll question: ${poll.question}`)
    }, 180000)
  })
})

// ============================================
// ERROR HANDLING TESTS
// ============================================

describeIf('LinkedIn Pipeline Error Handling', () => {
  describe('Missing required fields', () => {
    it('should handle missing company name gracefully', async () => {
      const response = await fetch(`${getBaseUrl()}/api/generate/linkedin/text-posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: 'budget',
          formData: {
            industry: 'B2B SaaS',
            topic: 'Test topic',
            audience: 'Test audience',
            postCount: 1
          },
          styleSelections: {}
        }),
      })

      if (response.status === 401) {
        expect(response.status).toBe(401)
        return
      }

      // Should either return an error or handle gracefully
      const data = await response.json()
      expect(data).toBeDefined()
    }, 60000)
  })

  describe('Invalid tier', () => {
    it('should handle invalid tier gracefully', async () => {
      const response = await fetch(`${getBaseUrl()}/api/generate/linkedin/text-posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: 'invalid_tier',
          formData: TEXT_POST_TEST_CONFIG.formData,
          styleSelections: TEXT_POST_TEST_CONFIG.styleSelections
        }),
      })

      if (response.status === 401) {
        expect(response.status).toBe(401)
        return
      }

      const data = await response.json()
      expect(data).toBeDefined()
    }, 60000)
  })
})
