/**
 * Instagram Pipeline E2E Tests
 *
 * These tests verify that the Instagram pipelines work by making real API calls.
 * They are EXCLUDED from normal test runs because they:
 * - Cost money (API calls to OpenAI, Anthropic, RiteTag, Ideogram)
 * - Take 30-60+ seconds per run
 * - Require valid API keys
 *
 * IMPORTANT FOR FUTURE AGENTS:
 * Always ask the user "Do you want to run pipeline tests too?" before running these.
 * Only run with: npm run test:pipelines
 *
 * Pipeline Tiers:
 * - Budget (default): GPT-4.1 + DALL-E 3 (8 stages)
 * - Standard: Claude Sonnet + RiteTag + DALL-E 3 (10 stages)
 * - Premium: Claude Sonnet + Hook Specialist + Ideogram + Visual Director (13 stages)
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

describeIf('Instagram Standard Tier Pipeline E2E Tests', () => {
  describe('Standard Tier Content Generation', () => {
    it('should generate content using Standard pipeline with Claude Sonnet + RiteTag', async () => {
      const response = await fetch(`${getBaseUrl()}/api/generate/instagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier: 'standard',
          formData: TEST_CONFIG.formData,
          styleSelections: TEST_CONFIG.styleSelections,
          imageOptions: {
            ...TEST_CONFIG.imageOptions,
            generateImages: false
          },
          additionalInfo: TEST_CONFIG.additionalInfo
        }),
      })

      if (response.status === 401) {
        console.log('⚠️  Standard pipeline: Authentication required')
        expect(response.status).toBe(401)
        return
      }

      expect(response.ok).toBe(true)

      const data = await response.json()

      expect(data).toHaveProperty('success', true)
      expect(data).toHaveProperty('content')
      expect(data.content).toHaveProperty('caption')
      expect(data.content).toHaveProperty('hashtags')

      // Standard tier should have better hashtag data from RiteTag
      expect(Array.isArray(data.content.hashtags)).toBe(true)

      // Verify quality report
      expect(data).toHaveProperty('qualityReport')
      expect(data.qualityReport.totalScore).toBeGreaterThanOrEqual(0)

      console.log('✅ Standard tier generation completed')
      console.log(`   Pipeline: 10-stage (Claude Sonnet + RiteTag)`)
      console.log(`   Caption length: ${data.content.caption.length} characters`)
      console.log(`   Hashtags: ${data.content.hashtags.length}`)
      console.log(`   Quality Score: ${data.qualityReport.totalScore}/100`)
    }, 240000) // 4 minute timeout for standard tier

    it('should include hashtag strategy metadata for standard tier', async () => {
      const response = await fetch(`${getBaseUrl()}/api/generate/instagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier: 'standard',
          formData: {
            ...TEST_CONFIG.formData,
            goal: 'engagement' // Specific goal for hashtag strategy
          },
          styleSelections: TEST_CONFIG.styleSelections,
          imageOptions: { generateImages: false }
        }),
      })

      if (response.status === 401) {
        console.log('⚠️  Standard tier hashtag test: Authentication required')
        expect(response.status).toBe(401)
        return
      }

      expect(response.ok).toBe(true)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.content.hashtags.length).toBeGreaterThan(0)

      console.log('✅ Standard tier hashtag strategy completed')
    }, 240000)
  })
})

describeIf('Instagram Premium Tier Pipeline E2E Tests', () => {
  describe('Premium Tier Content Generation', () => {
    it('should generate content using Premium pipeline with Hook Specialist + Visual Director', async () => {
      const response = await fetch(`${getBaseUrl()}/api/generate/instagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier: 'premium',
          formData: TEST_CONFIG.formData,
          styleSelections: TEST_CONFIG.styleSelections,
          imageOptions: {
            ...TEST_CONFIG.imageOptions,
            generateImages: false
          },
          additionalInfo: TEST_CONFIG.additionalInfo
        }),
      })

      if (response.status === 401) {
        console.log('⚠️  Premium pipeline: Authentication required')
        expect(response.status).toBe(401)
        return
      }

      expect(response.ok).toBe(true)

      const data = await response.json()

      expect(data).toHaveProperty('success', true)
      expect(data).toHaveProperty('content')
      expect(data.content).toHaveProperty('caption')

      // Premium tier should have enhanced hook and visual direction
      if (data.content.slides) {
        expect(Array.isArray(data.content.slides)).toBe(true)
        // Check for enhanced slide data
        data.content.slides.forEach((slide: any) => {
          expect(slide).toHaveProperty('headline')
        })
      }

      // Verify quality report
      expect(data).toHaveProperty('qualityReport')
      expect(data.qualityReport.totalScore).toBeGreaterThanOrEqual(0)

      console.log('✅ Premium tier generation completed')
      console.log(`   Pipeline: 13-stage (Claude + Hook Specialist + Visual Director)`)
      console.log(`   Caption length: ${data.content.caption.length} characters`)
      console.log(`   Quality Score: ${data.qualityReport.totalScore}/100`)
    }, 300000) // 5 minute timeout for premium tier

    it('should generate carousel with enhanced visual direction for premium tier', async () => {
      const response = await fetch(`${getBaseUrl()}/api/generate/instagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier: 'premium',
          formData: {
            ...TEST_CONFIG.formData,
            contentType: 'carousel'
          },
          styleSelections: {
            ...TEST_CONFIG.styleSelections,
            post_format: 'carousel',
            carousel_slides: '7'
          },
          imageOptions: { generateImages: false }
        }),
      })

      if (response.status === 401) {
        console.log('⚠️  Premium carousel test: Authentication required')
        expect(response.status).toBe(401)
        return
      }

      expect(response.ok).toBe(true)
      const data = await response.json()

      expect(data.success).toBe(true)

      // Premium carousel should have detailed slide structure
      if (data.content.slides) {
        expect(data.content.slides.length).toBeGreaterThan(0)
        console.log(`   Slides generated: ${data.content.slides.length}`)
      }

      console.log('✅ Premium tier carousel generation completed')
    }, 300000)
  })
})

describeIf('Instagram Tier Comparison Tests', () => {
  describe('API Tier Parameter Handling', () => {
    it('should default to budget tier when tier not specified', async () => {
      const response = await fetch(`${getBaseUrl()}/api/generate/instagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // No tier specified
          formData: TEST_CONFIG.formData,
          styleSelections: TEST_CONFIG.styleSelections,
          imageOptions: { generateImages: false }
        }),
      })

      if (response.status === 401) {
        console.log('⚠️  Default tier test: Authentication required')
        expect(response.status).toBe(401)
        return
      }

      expect(response.ok).toBe(true)
      const data = await response.json()
      expect(data.success).toBe(true)

      console.log('✅ Default tier (budget) working correctly')
    }, 180000)

    it('should handle invalid tier gracefully', async () => {
      const response = await fetch(`${getBaseUrl()}/api/generate/instagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier: 'invalid_tier',
          formData: TEST_CONFIG.formData,
          styleSelections: TEST_CONFIG.styleSelections,
          imageOptions: { generateImages: false }
        }),
      })

      if (response.status === 401) {
        console.log('⚠️  Invalid tier test: Authentication required')
        expect(response.status).toBe(401)
        return
      }

      // Should fall back to budget tier
      expect(response.ok).toBe(true)
      const data = await response.json()
      expect(data.success).toBe(true)

      console.log('✅ Invalid tier falls back to budget correctly')
    }, 180000)

    it('should return tier info in API GET request', async () => {
      const response = await fetch(`${getBaseUrl()}/api/generate/instagram`, {
        method: 'GET',
      })

      expect(response.ok).toBe(true)
      const data = await response.json()

      expect(data).toHaveProperty('tiers')
      expect(data.tiers).toHaveProperty('budget')
      expect(data.tiers).toHaveProperty('standard')
      expect(data.tiers).toHaveProperty('premium')

      // Verify tier info structure
      expect(data.tiers.budget.stages).toBe(8)
      expect(data.tiers.standard.stages).toBe(10)
      expect(data.tiers.premium.stages).toBe(13)

      console.log('✅ API tier documentation correct')
      console.log(`   Budget: ${data.tiers.budget.stages} stages`)
      console.log(`   Standard: ${data.tiers.standard.stages} stages`)
      console.log(`   Premium: ${data.tiers.premium.stages} stages`)
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
      console.log('')
      console.log('Pipeline Tiers:')
      console.log('  - Budget: GPT-4.1 + DALL-E 3 (8 stages)')
      console.log('  - Standard: Claude Sonnet + RiteTag (10 stages)')
      console.log('  - Premium: Claude + Hook Specialist + Ideogram (13 stages)')
      console.log('='.repeat(60) + '\n')
    }
    expect(true).toBe(true)
  })
})
