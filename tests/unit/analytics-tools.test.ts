/**
 * Analytics Tools Module Unit Tests
 *
 * Tests for the analytics tool registry and utility functions.
 * These tests do NOT make actual API calls.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  TOOL_CONFIGS,
  isToolConfigured,
  getConfiguredTools,
  getFreeTool,
  getToolsByTier,
  getToolsForTier,
  calculateConfidence,
  getMissingToolsExplanation,
} from '@/lib/analytics/tool-registry'

describe('Analytics Tool Registry', () => {
  describe('TOOL_CONFIGS', () => {
    it('should have all expected tools defined', () => {
      const expectedTools = [
        'google-trends',
        'google-pagespeed',
        'ritetag',
        'semrush',
        'spyfu',
        'sparktoro',
        'facebook-ad-library',
      ]

      expectedTools.forEach(tool => {
        expect(TOOL_CONFIGS).toHaveProperty(tool)
      })
    })

    it('should have required properties for each tool', () => {
      Object.values(TOOL_CONFIGS).forEach(config => {
        expect(config).toHaveProperty('id')
        expect(config).toHaveProperty('name')
        expect(config).toHaveProperty('description')
        expect(config).toHaveProperty('tier')
        expect(config).toHaveProperty('requiredEnvVars')
        expect(['free', 'freemium', 'paid']).toContain(config.tier)
      })
    })

    it('should have google-trends as a freemium tool (requires SerpAPI)', () => {
      // Google Trends requires SerpAPI ($75+/month) - there's no free official API
      expect(TOOL_CONFIGS['google-trends'].tier).toBe('freemium')
      expect(TOOL_CONFIGS['google-trends'].requiredEnvVars).toContain('SERPAPI_API_KEY')
    })

    it('should have semrush as a paid tool', () => {
      expect(TOOL_CONFIGS['semrush'].tier).toBe('paid')
    })
  })

  describe('isToolConfigured', () => {
    beforeEach(() => {
      // Clear all env vars
      vi.stubEnv('RITEKIT_CLIENT_ID', undefined as any)
      vi.stubEnv('SEMRUSH_API_KEY', undefined as any)
      vi.stubEnv('GOOGLE_PAGESPEED_API_KEY', undefined as any)
    })

    it('should return true for tools with no required env vars or when env vars are set', () => {
      // google-pagespeed has optional env vars - works without key but recommended
      // Facebook Ad Library requires token but for this test we check PageSpeed without key
      // Note: google-trends now requires SERPAPI_API_KEY so we test pagespeed instead
      vi.stubEnv('GOOGLE_PAGESPEED_API_KEY', 'test-key')
      expect(isToolConfigured('google-pagespeed')).toBe(true)
    })

    it('should return false for unconfigured paid tools', () => {
      expect(isToolConfigured('semrush')).toBe(false)
    })

    it('should return true when all required env vars are set', () => {
      vi.stubEnv('RITEKIT_CLIENT_ID', 'test-client-id')
      expect(isToolConfigured('ritetag')).toBe(true)
    })
  })

  describe('getFreeTool', () => {
    it('should return only free tools', () => {
      const freeTools = getFreeTool()

      freeTools.forEach(tool => {
        expect(TOOL_CONFIGS[tool].tier).toBe('free')
      })
    })

    it('should include facebook-ad-library (free with ID verification)', () => {
      const freeTools = getFreeTool()
      // Google Trends is now freemium (requires SerpAPI), but Facebook Ad Library is free
      expect(freeTools).toContain('facebook-ad-library')
    })

    it('should include google-pagespeed', () => {
      const freeTools = getFreeTool()
      expect(freeTools).toContain('google-pagespeed')
    })
  })

  describe('getToolsByTier', () => {
    it('should return correct tools for free tier', () => {
      const freeTools = getToolsByTier('free')

      freeTools.forEach(tool => {
        expect(TOOL_CONFIGS[tool].tier).toBe('free')
      })
    })

    it('should return correct tools for paid tier', () => {
      const paidTools = getToolsByTier('paid')

      paidTools.forEach(tool => {
        expect(TOOL_CONFIGS[tool].tier).toBe('paid')
      })
      expect(paidTools).toContain('semrush')
      expect(paidTools).toContain('spyfu')
    })

    it('should return correct tools for freemium tier', () => {
      const freemiumTools = getToolsByTier('freemium')

      freemiumTools.forEach(tool => {
        expect(TOOL_CONFIGS[tool].tier).toBe('freemium')
      })
    })
  })

  describe('getToolsForTier', () => {
    beforeEach(() => {
      // Simulate having google-trends configured (no env vars needed)
      vi.stubEnv('RITEKIT_CLIENT_ID', undefined as any)
      vi.stubEnv('SEMRUSH_API_KEY', undefined as any)
    })

    it('should return only free tools for budget tier', () => {
      const budgetTools = getToolsForTier('budget')

      budgetTools.forEach(tool => {
        expect(TOOL_CONFIGS[tool].tier).toBe('free')
      })
    })

    it('should return free and freemium tools for standard tier', () => {
      const standardTools = getToolsForTier('standard')

      standardTools.forEach(tool => {
        expect(['free', 'freemium']).toContain(TOOL_CONFIGS[tool].tier)
      })
    })

    it('should return all configured tools for premium tier', () => {
      const premiumTools = getToolsForTier('premium')
      const configuredTools = getConfiguredTools()

      expect(premiumTools).toEqual(configuredTools)
    })
  })

  describe('calculateConfidence', () => {
    it('should return high confidence when all tools are used', () => {
      const used = ['google-trends', 'ritetag'] as any[]
      const requested = ['google-trends', 'ritetag'] as any[]

      expect(calculateConfidence(used, requested)).toBe('high')
    })

    it('should return medium confidence when most tools are used', () => {
      const used = ['google-trends'] as any[]
      const requested = ['google-trends', 'ritetag'] as any[]

      expect(calculateConfidence(used, requested)).toBe('medium')
    })

    it('should return low confidence when few tools are used', () => {
      const used = ['google-trends'] as any[]
      const requested = ['google-trends', 'ritetag', 'semrush', 'spyfu'] as any[]

      expect(calculateConfidence(used, requested)).toBe('low')
    })

    it('should return medium confidence when no tools requested', () => {
      expect(calculateConfidence([], [])).toBe('medium')
    })
  })

  describe('getMissingToolsExplanation', () => {
    it('should return empty string when no tools unavailable', () => {
      expect(getMissingToolsExplanation([])).toBe('')
    })

    it('should mention premium features for paid tools', () => {
      const explanation = getMissingToolsExplanation(['semrush'])
      expect(explanation).toContain('SEMrush')
      expect(explanation).toContain('premium feature')
    })

    it('should mention not configured for free tools', () => {
      const explanation = getMissingToolsExplanation(['google-pagespeed'])
      expect(explanation).toContain('PageSpeed')
    })

    it('should list multiple tools', () => {
      const explanation = getMissingToolsExplanation(['semrush', 'spyfu'])
      expect(explanation).toContain('SEMrush')
      expect(explanation).toContain('SpyFu')
    })
  })
})
