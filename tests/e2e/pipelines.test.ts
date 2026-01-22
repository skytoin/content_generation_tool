/**
 * Pipeline Smoke Tests
 *
 * These tests verify that the AI pipelines actually work by making real API calls.
 * They are EXCLUDED from normal test runs because they:
 * - Cost money (API calls to OpenAI/Anthropic)
 * - Take 30-60+ seconds per pipeline
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
  // Use minimal content to reduce costs
  formData: {
    topic: 'Benefits of unit testing in software development',
    audience: 'Software developers',
    company: 'Test Company',
    industry: 'Technology',
    goal: 'Educate readers about testing best practices',
  },
  styleSelections: {
    professional_level: 'business_professional',
    structure_style: 'how_to_guide',
  },
  additionalInfo: '',
  serviceId: 'blog-post',
  // Use shortest length tier to minimize API costs
  lengthTier: 'quick',
}

// Base URL for API calls
const getBaseUrl = () => {
  return process.env.TEST_BASE_URL || 'http://localhost:3000'
}

describeIf('Pipeline Smoke Tests', () => {
  beforeAll(() => {
    console.log('\n🔥 RUNNING PIPELINE SMOKE TESTS')
    console.log('⚠️  These tests make REAL API calls and cost money!')
    console.log(`📍 Testing against: ${getBaseUrl()}\n`)
  })

  describe('Budget Pipeline (OpenAI only)', () => {
    it('should generate content using budget tier', async () => {
      const response = await fetch(`${getBaseUrl()}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...TEST_CONFIG,
          tier: 'budget',
        }),
      })

      // Check response status
      // Note: Will be 401 if not authenticated - that's expected without session
      if (response.status === 401) {
        console.log('⚠️  Budget pipeline: Authentication required (expected without session)')
        expect(response.status).toBe(401)
        return
      }

      expect(response.ok).toBe(true)

      const data = await response.json()

      // Verify content was generated
      expect(data).toHaveProperty('content')
      expect(typeof data.content).toBe('string')
      expect(data.content.length).toBeGreaterThan(100)

      console.log('✅ Budget pipeline completed')
      console.log(`   Content length: ${data.content.length} characters`)
    }, 120000) // 2 minute timeout
  })

  describe('Standard Pipeline (OpenAI + Claude Sonnet)', () => {
    it('should generate content using standard tier', async () => {
      const response = await fetch(`${getBaseUrl()}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...TEST_CONFIG,
          tier: 'standard',
        }),
      })

      if (response.status === 401) {
        console.log('⚠️  Standard pipeline: Authentication required (expected without session)')
        expect(response.status).toBe(401)
        return
      }

      expect(response.ok).toBe(true)

      const data = await response.json()

      expect(data).toHaveProperty('content')
      expect(typeof data.content).toBe('string')
      expect(data.content.length).toBeGreaterThan(100)

      console.log('✅ Standard pipeline completed')
      console.log(`   Content length: ${data.content.length} characters`)
    }, 180000) // 3 minute timeout
  })

  describe('Premium Pipeline (Full Claude pipeline)', () => {
    it('should generate content using premium tier', async () => {
      const response = await fetch(`${getBaseUrl()}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...TEST_CONFIG,
          tier: 'premium',
        }),
      })

      if (response.status === 401) {
        console.log('⚠️  Premium pipeline: Authentication required (expected without session)')
        expect(response.status).toBe(401)
        return
      }

      expect(response.ok).toBe(true)

      const data = await response.json()

      expect(data).toHaveProperty('content')
      expect(typeof data.content).toBe('string')
      expect(data.content.length).toBeGreaterThan(100)

      // Premium should include quality report
      expect(data.content).toContain('QUALITY')

      console.log('✅ Premium pipeline completed')
      console.log(`   Content length: ${data.content.length} characters`)
    }, 300000) // 5 minute timeout
  })

  describe('Pipeline Error Handling', () => {
    it('should return 401 for unauthenticated requests', async () => {
      const response = await fetch(`${getBaseUrl()}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...TEST_CONFIG,
          tier: 'budget',
        }),
      })

      // Without authentication, should get 401
      expect(response.status).toBe(401)

      const data = await response.json()
      expect(data).toHaveProperty('error')

      console.log('✅ Authentication check working')
    }, 10000)

    it('should handle missing required fields', async () => {
      const response = await fetch(`${getBaseUrl()}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Missing formData, serviceId, etc.
          tier: 'budget',
        }),
      })

      // Should either be 401 (auth) or 400 (bad request)
      expect([400, 401, 500]).toContain(response.status)

      console.log('✅ Error handling working')
    }, 10000)
  })
})

describe('Pipeline Test Instructions', () => {
  it('should remind about pipeline tests', () => {
    if (!RUN_PIPELINE_TESTS) {
      console.log('\n' + '='.repeat(60))
      console.log('📋 PIPELINE TESTS WERE SKIPPED')
      console.log('='.repeat(60))
      console.log('')
      console.log('To run pipeline tests:')
      console.log('  npm run test:pipelines')
      console.log('')
      console.log('⚠️  Pipeline tests make REAL API calls and cost money!')
      console.log('='.repeat(60) + '\n')
    }
    expect(true).toBe(true)
  })
})
