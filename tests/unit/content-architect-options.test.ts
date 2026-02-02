/**
 * Content Architect Options Unit Tests
 *
 * Tests for the Content Architect options schema and utilities.
 */

import { describe, it, expect } from 'vitest'
import {
  contentArchitectCategories,
  contentArchitectTiers,
  defaultContentArchitectOptions,
  validateContentArchitectOptions,
  getOptionLabel,
  recommendTierForBudget,
} from '@/app/api/generate/content-architect-options'

describe('Content Architect Options', () => {
  describe('contentArchitectCategories', () => {
    it('should have all expected categories', () => {
      const categoryIds = contentArchitectCategories.map(c => c.id)

      expect(categoryIds).toContain('business_context')
      expect(categoryIds).toContain('content_goals')
      expect(categoryIds).toContain('target_platforms')
      expect(categoryIds).toContain('budget_resources')
      expect(categoryIds).toContain('content_preferences')
    })

    it('should have valid structure for each category', () => {
      contentArchitectCategories.forEach(category => {
        expect(category).toHaveProperty('id')
        expect(category).toHaveProperty('name')
        expect(category).toHaveProperty('description')
        expect(category).toHaveProperty('options')
        expect(Array.isArray(category.options)).toBe(true)
        expect(category.options.length).toBeGreaterThan(0)
      })
    })

    it('should have valid structure for each option', () => {
      contentArchitectCategories.forEach(category => {
        category.options.forEach(option => {
          expect(option).toHaveProperty('id')
          expect(option).toHaveProperty('label')
          expect(option).toHaveProperty('hint')
          expect(option).toHaveProperty('options')
          expect(Array.isArray(option.options)).toBe(true)
          expect(option.options.length).toBeGreaterThanOrEqual(2)
        })
      })
    })

    it('should have valid option values', () => {
      contentArchitectCategories.forEach(category => {
        category.options.forEach(option => {
          option.options.forEach(opt => {
            expect(opt).toHaveProperty('value')
            expect(opt).toHaveProperty('label')
            expect(typeof opt.value).toBe('string')
            expect(typeof opt.label).toBe('string')
          })
        })
      })
    })
  })

  describe('contentArchitectTiers', () => {
    it('should have all three tiers', () => {
      expect(contentArchitectTiers).toHaveProperty('budget')
      expect(contentArchitectTiers).toHaveProperty('standard')
      expect(contentArchitectTiers).toHaveProperty('premium')
    })

    it('should have increasing prices', () => {
      expect(contentArchitectTiers.budget.price).toBeLessThan(contentArchitectTiers.standard.price)
      expect(contentArchitectTiers.standard.price).toBeLessThan(contentArchitectTiers.premium.price)
    })

    it('should have valid tier structure', () => {
      Object.values(contentArchitectTiers).forEach(tier => {
        expect(tier).toHaveProperty('name')
        expect(tier).toHaveProperty('price')
        expect(tier).toHaveProperty('description')
        expect(tier).toHaveProperty('features')
        expect(tier).toHaveProperty('bestFor')
        expect(Array.isArray(tier.features)).toBe(true)
        expect(tier.features.length).toBeGreaterThan(0)
      })
    })

    it('should have premium tier with most features', () => {
      expect(contentArchitectTiers.premium.features.length)
        .toBeGreaterThanOrEqual(contentArchitectTiers.standard.features.length)
      expect(contentArchitectTiers.standard.features.length)
        .toBeGreaterThanOrEqual(contentArchitectTiers.budget.features.length)
    })
  })

  describe('defaultContentArchitectOptions', () => {
    it('should have all required default values', () => {
      expect(defaultContentArchitectOptions).toHaveProperty('industry')
      expect(defaultContentArchitectOptions).toHaveProperty('primary_goal')
      expect(defaultContentArchitectOptions).toHaveProperty('primary_platform')
      expect(defaultContentArchitectOptions).toHaveProperty('budget_range')
    })

    it('should have valid default values', () => {
      // Verify defaults match valid option values
      expect(typeof defaultContentArchitectOptions.industry).toBe('string')
      expect(typeof defaultContentArchitectOptions.primary_goal).toBe('string')
      expect(typeof defaultContentArchitectOptions.primary_platform).toBe('string')
    })
  })

  describe('validateContentArchitectOptions', () => {
    it('should pass validation with required fields', () => {
      const result = validateContentArchitectOptions({
        primary_goal: 'lead_generation',
        primary_platform: 'blog',
      })

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should fail validation without primary_goal', () => {
      const result = validateContentArchitectOptions({
        primary_platform: 'blog',
      })

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Primary goal is required')
    })

    it('should fail validation without primary_platform', () => {
      const result = validateContentArchitectOptions({
        primary_goal: 'lead_generation',
      })

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Primary platform is required')
    })

    it('should fail validation with empty object', () => {
      const result = validateContentArchitectOptions({})

      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe('getOptionLabel', () => {
    it('should return correct label for valid option', () => {
      const label = getOptionLabel('business_context', 'industry', 'technology')
      expect(label).toBe('Technology & SaaS')
    })

    it('should return value when category not found', () => {
      const label = getOptionLabel('nonexistent', 'industry', 'technology')
      expect(label).toBe('technology')
    })

    it('should return value when option not found', () => {
      const label = getOptionLabel('business_context', 'nonexistent', 'technology')
      expect(label).toBe('technology')
    })

    it('should return value when option value not found', () => {
      const label = getOptionLabel('business_context', 'industry', 'nonexistent')
      expect(label).toBe('nonexistent')
    })
  })

  describe('recommendTierForBudget', () => {
    it('should recommend budget tier for starter budget', () => {
      expect(recommendTierForBudget('starter')).toBe('budget')
    })

    it('should recommend standard tier for growing budget', () => {
      expect(recommendTierForBudget('growing')).toBe('standard')
    })

    it('should recommend standard tier for established budget', () => {
      expect(recommendTierForBudget('established')).toBe('standard')
    })

    it('should recommend premium tier for scaling budget', () => {
      expect(recommendTierForBudget('scaling')).toBe('premium')
    })

    it('should recommend premium tier for enterprise budget', () => {
      expect(recommendTierForBudget('enterprise')).toBe('premium')
    })

    it('should default to standard for unknown budget', () => {
      expect(recommendTierForBudget('unknown')).toBe('standard')
    })
  })
})
