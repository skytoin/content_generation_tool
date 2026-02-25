/**
 * Tests for companyDescription flowing through the Content Architect pipeline.
 *
 * Verifies that:
 * - buildAnalysisPrompt includes companyDescription in the prompt output
 * - buildFallbackAnalysis includes company_description when provided
 * - formatContentArchitectOutput renders company description in business context
 * - ContentArchitectRequest type accepts companyDescription in businessInfo
 */

import { describe, it, expect } from 'vitest'

import {
  buildAnalysisPrompt,
  buildFallbackAnalysis,
  formatContentArchitectOutput,
  type ContentArchitectRequest,
  type ContentArchitectResponse,
} from '@/app/api/generate/content-architect-pipeline'

// Helper to build a minimal valid response for testing
function buildResponse(overrides: Partial<ContentArchitectResponse> = {}): ContentArchitectResponse {
  return {
    success: true,
    tier: 'standard',
    analysis: {
      summary: 'Test analysis summary',
      businessContext: { industry: 'technology', company_type: 'SaaS' },
      audienceProfile: { primary_demographic: 'marketing managers' },
      contentNeeds: { primary_purpose: 'lead generation' },
    },
    strategy: {
      overview: 'Strategic overview.',
      primaryFocus: 'Build authority',
      contentPillars: ['Thought Leadership'],
      platformStrategy: {},
    },
    recommendations: [],
    executionPlan: {
      phase1: [],
      phase2: [],
      phase3: [],
      quickWins: ['Audit existing content'],
    },
    metadata: {
      generatedAt: new Date().toISOString(),
      modelUsed: 'GPT-4o',
      analyticsConfidence: 'low',
      warnings: [],
    },
    ...overrides,
  }
}

describe('Content Architect - companyDescription', () => {
  describe('buildAnalysisPrompt', () => {
    it('includes companyDescription in the prompt when provided', () => {
      const request: ContentArchitectRequest = {
        description: 'We need content marketing help',
        businessInfo: {
          companyName: 'Acme Corp',
          companyDescription: 'A B2B SaaS platform for marketing teams',
          industry: 'technology',
        },
      }

      const prompt = buildAnalysisPrompt(request)

      expect(prompt).toContain('companyDescription')
      expect(prompt).toContain('A B2B SaaS platform for marketing teams')
    })

    it('generates valid prompt without companyDescription', () => {
      const request: ContentArchitectRequest = {
        description: 'We need content marketing help',
        businessInfo: {
          companyName: 'Acme Corp',
          industry: 'technology',
        },
      }

      const prompt = buildAnalysisPrompt(request)

      expect(prompt).toContain('Acme Corp')
      expect(prompt).not.toContain('companyDescription')
    })
  })

  describe('buildFallbackAnalysis', () => {
    it('includes company_description when companyDescription is provided', () => {
      const request: ContentArchitectRequest = {
        description: 'We need help',
        businessInfo: {
          companyDescription: 'We build AI tools for content creators',
        },
      }

      const analysis = buildFallbackAnalysis(request)

      expect(analysis.business_context.company_description).toBe(
        'We build AI tools for content creators'
      )
    })

    it('returns empty string for company_description when not provided', () => {
      const request: ContentArchitectRequest = {
        description: 'We need help',
        businessInfo: {
          companyName: 'TestCo',
        },
      }

      const analysis = buildFallbackAnalysis(request)

      expect(analysis.business_context.company_description).toBe('')
    })

    it('handles missing businessInfo gracefully', () => {
      const request: ContentArchitectRequest = {
        description: 'We need help',
      }

      const analysis = buildFallbackAnalysis(request)

      expect(analysis.business_context.company_description).toBe('')
    })
  })

  describe('formatContentArchitectOutput', () => {
    it('renders company_description in business context section', () => {
      const response = buildResponse({
        analysis: {
          summary: 'Test summary',
          businessContext: {
            industry: 'technology',
            company_type: 'SaaS',
            company_description: 'AI-powered content creation platform',
          },
          audienceProfile: {},
          contentNeeds: {},
        },
      })

      const output = formatContentArchitectOutput(response)

      expect(output).toContain('company description')
      expect(output).toContain('AI-powered content creation platform')
    })
  })

  describe('ContentArchitectRequest type', () => {
    it('accepts companyDescription in businessInfo', () => {
      const request: ContentArchitectRequest = {
        description: 'Content strategy needed',
        businessInfo: {
          industry: 'technology',
          companyName: 'TestCo',
          companyDescription: 'A SaaS company building developer tools',
          companySize: 'startup',
          website: 'https://testco.com',
        },
        goals: ['brand_awareness'],
        platforms: ['blog', 'linkedin'],
      }

      // Type check passes - verify all fields are present
      expect(request.businessInfo?.companyDescription).toBe(
        'A SaaS company building developer tools'
      )
      expect(request.businessInfo?.companyName).toBe('TestCo')
      expect(request.businessInfo?.industry).toBe('technology')
    })
  })
})
