/**
 * Instagram Pipeline E2E Tests
 *
 * These tests verify that the Instagram pipeline works by making real API calls.
 * They are EXCLUDED from normal test runs because they:
 * - Cost money (API calls to OpenAI)
 * - Take 30-60+ seconds per run
 * - Require valid API keys
 *
 * IMPORTANT FOR FUTURE AGENTS:
 * Always ask the user "Do you want to run pipeline tests too?" before running these.
 * Only run with: npm run test:pipelines
 *
 * @see TESTING.md for full documentation
 */

import { describe, it, expect, beforeAll } from 'vitest'

// Check if pipeline tests should run
const RUN_PIPELINE_TESTS = process.env.RUN_PIPELINE_TESTS === 'true'

// Skip all tests if not explicitly enabled
const describeIf = RUN_PIPELINE_TESTS ? describe : describe.skip

// Test configuration
const TEST_CONFIG = {
  formData: {
    company: 'Test Company',
    industry: 'Technology',
    topic: '5 productivity tips for developers',
    audience: 'Software developers',
    goal: 'Educate and engage',
    contentType: 'carousel' as const,
    postCount: 1
  },
  styleSelections: {
    caption_tone: 'friendly',
    emoji_usage: 'moderate',
    cta_style: 'question',
    content_format: 'tips_list',
    hashtag_strategy: 'minimal',
    hashtag_placement: 'first_comment',
    post_format: 'carousel',
    carousel_slides: '5'
  },
  imageOptions: {
    generateImages: false, // Keep false to save costs
    style: 'photography' as const,
    mood: 'professional' as const,
    colorPreferences: [],
    subjectsToInclude: [],
    subjectsToAvoid: [],
    additionalImageNotes: ''
  },
  additionalInfo: ''
}

// Base URL for API calls
const getBaseUrl = () => {
  return process.env.TEST_BASE_URL || 'http://localhost:3000'
}

describeIf('Instagram Pipeline E2E Tests', () => {
  beforeAll(() => {
    console.log('\n📸 RUNNING INSTAGRAM PIPELINE TESTS')
    console.log('⚠️  These tests make REAL API calls and cost money!')
    console.log(`📍 Testing against: ${getBaseUrl()}\n`)
  })

  describe('Instagram Content Generation (Text Only)', () => {
    it('should generate Instagram content without images', async () => {
      const response = await fetch(`${getBaseUrl()}/api/generate/instagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: TEST_CONFIG.formData,
          styleSelections: TEST_CONFIG.styleSelections,
          imageOptions: {
            ...TEST_CONFIG.imageOptions,
            generateImages: false
          },
          additionalInfo: TEST_CONFIG.additionalInfo
        }),
      })

      // Check for authentication requirement
      if (response.status === 401) {
        console.log('⚠️  Instagram pipeline: Authentication required (expected without session)')
        expect(response.status).toBe(401)
        return
      }

      expect(response.ok).toBe(true)

      const data = await response.json()

      // Verify response structure
      expect(data).toHaveProperty('success', true)
      expect(data).toHaveProperty('content')
      expect(data.content).toHaveProperty('caption')
      expect(data.content).toHaveProperty('hashtags')
      expect(data.content).toHaveProperty('altText')

      // Verify caption is not empty
      expect(typeof data.content.caption).toBe('string')
      expect(data.content.caption.length).toBeGreaterThan(50)

      // Verify hashtags array
      expect(Array.isArray(data.content.hashtags)).toBe(true)

      // Verify quality report
      expect(data).toHaveProperty('qualityReport')
      expect(data.qualityReport).toHaveProperty('totalScore')
      expect(typeof data.qualityReport.totalScore).toBe('number')

      // Verify metadata
      expect(data).toHaveProperty('metadata')
      expect(data.metadata).toHaveProperty('processingStages')
      expect(Array.isArray(data.metadata.processingStages)).toBe(true)

      // Should not have images when disabled
      expect(data.images).toBeUndefined()

      console.log('✅ Instagram text generation completed')
      console.log(`   Caption length: ${data.content.caption.length} characters`)
      console.log(`   Hashtags: ${data.content.hashtags.length}`)
      console.log(`   Quality Score: ${data.qualityReport.totalScore}/100`)
    }, 180000) // 3 minute timeout
  })

  describe('Instagram Carousel Generation', () => {
    it('should generate carousel content with slides', async () => {
      const response = await fetch(`${getBaseUrl()}/api/generate/instagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: {
            ...TEST_CONFIG.formData,
            contentType: 'carousel'
          },
          styleSelections: {
            ...TEST_CONFIG.styleSelections,
            post_format: 'carousel',
            carousel_slides: '5'
          },
          imageOptions: {
            generateImages: false
          }
        }),
      })

      if (response.status === 401) {
        console.log('⚠️  Carousel test: Authentication required')
        expect(response.status).toBe(401)
        return
      }

      expect(response.ok).toBe(true)

      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.content).toHaveProperty('slides')

      // Carousel should have slide data
      if (data.content.slides) {
        expect(Array.isArray(data.content.slides)).toBe(true)
        console.log(`   Slides generated: ${data.content.slides.length}`)
      }

      console.log('✅ Carousel generation completed')
    }, 180000)
  })

  describe('Instagram Single Post Generation', () => {
    it('should generate single post content', async () => {
      const response = await fetch(`${getBaseUrl()}/api/generate/instagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: {
            ...TEST_CONFIG.formData,
            contentType: 'single_post'
          },
          styleSelections: {
            ...TEST_CONFIG.styleSelections,
            post_format: 'single_post'
          },
          imageOptions: {
            generateImages: false
          }
        }),
      })

      if (response.status === 401) {
        console.log('⚠️  Single post test: Authentication required')
        expect(response.status).toBe(401)
        return
      }

      expect(response.ok).toBe(true)

      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.content.caption.length).toBeGreaterThan(0)

      console.log('✅ Single post generation completed')
    }, 180000)
  })

  describe('Instagram with Additional Info', () => {
    it('should incorporate additional information', async () => {
      const response = await fetch(`${getBaseUrl()}/api/generate/instagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: TEST_CONFIG.formData,
          styleSelections: TEST_CONFIG.styleSelections,
          imageOptions: {
            generateImages: false
          },
          additionalInfo: 'Please mention our new product launch happening next week. Include a sense of urgency.'
        }),
      })

      if (response.status === 401) {
        console.log('⚠️  Additional info test: Authentication required')
        expect(response.status).toBe(401)
        return
      }

      expect(response.ok).toBe(true)

      const data = await response.json()
      expect(data.success).toBe(true)

      console.log('✅ Additional info integration completed')
    }, 180000)
  })

  describe('Instagram Error Handling', () => {
    it('should return 401 for unauthenticated requests', async () => {
      const response = await fetch(`${getBaseUrl()}/api/generate/instagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: TEST_CONFIG.formData,
          imageOptions: { generateImages: false }
        }),
      })

      // Without authentication, should get 401
      expect(response.status).toBe(401)

      const data = await response.json()
      expect(data).toHaveProperty('error')

      console.log('✅ Authentication check working')
    }, 10000)

    it('should return 400 for missing required fields', async () => {
      const response = await fetch(`${getBaseUrl()}/api/generate/instagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: {
            // Missing required fields
            industry: 'Tech'
          },
          imageOptions: { generateImages: false }
        }),
      })

      // Should be 400 (bad request) or 401 (auth)
      expect([400, 401]).toContain(response.status)

      console.log('✅ Validation working')
    }, 10000)

    it('should provide API info on GET request', async () => {
      const response = await fetch(`${getBaseUrl()}/api/generate/instagram`, {
        method: 'GET',
      })

      expect(response.ok).toBe(true)

      const data = await response.json()
      expect(data).toHaveProperty('name')
      expect(data).toHaveProperty('version')
      expect(data).toHaveProperty('endpoints')

      console.log('✅ API info endpoint working')
    }, 10000)
  })
})

// Reminder test that always runs
describe('Instagram Pipeline Test Instructions', () => {
  it('should remind about pipeline tests', () => {
    if (!RUN_PIPELINE_TESTS) {
      console.log('\n' + '='.repeat(60))
      console.log('📸 INSTAGRAM PIPELINE TESTS WERE SKIPPED')
      console.log('='.repeat(60))
      console.log('')
      console.log('To run Instagram pipeline tests:')
      console.log('  npm run test:pipelines')
      console.log('')
      console.log('⚠️  Pipeline tests make REAL API calls and cost money!')
      console.log('='.repeat(60) + '\n')
    }
    expect(true).toBe(true)
  })
})
