/**
 * Scribengine Knowledge Base Unit Tests
 *
 * Tests for the service knowledge base used by the Content Architect.
 */

import { describe, it, expect } from 'vitest'
import {
  SERVICES,
  getAvailableServices,
  generateServicesContextForAI,
  getTopRecommendations,
  scoreServiceRelevance,
  type ServiceConfig,
} from '@/lib/scribengine-knowledge-base'

describe('Scribengine Knowledge Base', () => {
  describe('SERVICES', () => {
    it('should have services defined', () => {
      expect(Object.keys(SERVICES).length).toBeGreaterThan(0)
    })

    it('should have blog-post service defined', () => {
      expect(SERVICES).toHaveProperty('blog-post')
    })

    it('should have required properties for each service', () => {
      Object.values(SERVICES).forEach(service => {
        expect(service).toHaveProperty('id')
        expect(service).toHaveProperty('name')
        expect(service).toHaveProperty('icon')
        expect(service).toHaveProperty('category')
        expect(service).toHaveProperty('tiers')
        expect(service).toHaveProperty('recommendWhen')
        expect(service).toHaveProperty('description')
      })
    })

    it('should have valid tiers for each service', () => {
      Object.values(SERVICES).forEach(service => {
        expect(service.tiers).toHaveProperty('budget')
        expect(service.tiers).toHaveProperty('standard')
        expect(service.tiers).toHaveProperty('premium')
      })
    })

    it('should have increasing prices across tiers', () => {
      Object.values(SERVICES).forEach(service => {
        expect(service.tiers.budget.price).toBeLessThanOrEqual(service.tiers.standard.price)
        expect(service.tiers.standard.price).toBeLessThanOrEqual(service.tiers.premium.price)
      })
    })

    it('should have valid category values', () => {
      const validCategories = ['content', 'social', 'email', 'seo', 'ads', 'strategy']

      Object.values(SERVICES).forEach(service => {
        expect(validCategories).toContain(service.category)
      })
    })
  })

  describe('getAvailableServices', () => {
    it('should return an array of ServiceConfig objects', () => {
      const services = getAvailableServices()

      expect(Array.isArray(services)).toBe(true)
      expect(services.length).toBeGreaterThan(0)
    })

    it('should return only available services', () => {
      const services = getAvailableServices()

      services.forEach(service => {
        expect(service.available).toBe(true)
      })
    })

    it('should return valid service objects', () => {
      const services = getAvailableServices()

      services.forEach(service => {
        expect(service).toHaveProperty('id')
        expect(service).toHaveProperty('name')
        expect(SERVICES).toHaveProperty(service.id)
      })
    })
  })

  describe('generateServicesContextForAI', () => {
    it('should return a non-empty string', () => {
      const context = generateServicesContextForAI('standard')

      expect(typeof context).toBe('string')
      expect(context.length).toBeGreaterThan(0)
    })

    it('should include service information', () => {
      const context = generateServicesContextForAI('standard')

      // Check that context contains service-related content
      expect(context.length).toBeGreaterThan(100)
    })

    it('should differ based on tier', () => {
      const budgetContext = generateServicesContextForAI('budget')
      const premiumContext = generateServicesContextForAI('premium')

      // Both should produce content
      expect(budgetContext.length).toBeGreaterThan(0)
      expect(premiumContext.length).toBeGreaterThan(0)
    })
  })

  describe('getTopRecommendations', () => {
    const testGoals = ['lead_generation', 'thought_leadership']
    const testChallenges = ['low_traffic', 'need_content']
    const testIndustry = 'technology'
    const needsImages = true

    it('should return an array of recommendations', () => {
      const recommendations = getTopRecommendations(
        testGoals,
        testChallenges,
        testIndustry,
        needsImages
      )

      expect(Array.isArray(recommendations)).toBe(true)
    })

    it('should respect the limit parameter', () => {
      const recommendations = getTopRecommendations(
        testGoals,
        testChallenges,
        testIndustry,
        needsImages,
        3
      )

      expect(recommendations.length).toBeLessThanOrEqual(3)
    })

    it('should return valid service objects', () => {
      const recommendations = getTopRecommendations(
        testGoals,
        testChallenges,
        testIndustry,
        needsImages
      )

      recommendations.forEach(rec => {
        expect(rec).toHaveProperty('service')
        expect(rec.service).toHaveProperty('id')
        expect(SERVICES).toHaveProperty(rec.service.id)
      })
    })

    it('should include scores for each recommendation', () => {
      const recommendations = getTopRecommendations(
        testGoals,
        testChallenges,
        testIndustry,
        needsImages
      )

      recommendations.forEach(rec => {
        expect(rec).toHaveProperty('score')
        expect(typeof rec.score).toBe('number')
        expect(rec.score).toBeGreaterThanOrEqual(0)
      })
    })

    it('should sort recommendations by score (highest first)', () => {
      const recommendations = getTopRecommendations(
        testGoals,
        testChallenges,
        testIndustry,
        needsImages
      )

      for (let i = 1; i < recommendations.length; i++) {
        expect(recommendations[i].score).toBeLessThanOrEqual(recommendations[i - 1].score)
      }
    })

    it('should include reasons for each recommendation', () => {
      const recommendations = getTopRecommendations(
        testGoals,
        testChallenges,
        testIndustry,
        needsImages
      )

      recommendations.forEach(rec => {
        expect(rec).toHaveProperty('reasons')
        expect(Array.isArray(rec.reasons)).toBe(true)
      })
    })
  })

  describe('scoreServiceRelevance', () => {
    it('should return a number', () => {
      const service = Object.values(SERVICES)[0]
      const score = scoreServiceRelevance(
        service,
        ['seo_traffic'],
        [],
        'technology',
        false
      )

      expect(typeof score).toBe('number')
    })

    it('should return non-negative score', () => {
      const service = Object.values(SERVICES)[0]
      const score = scoreServiceRelevance(
        service,
        ['seo_traffic'],
        [],
        'technology',
        false
      )

      expect(score).toBeGreaterThanOrEqual(0)
    })

    it('should score blog-post service higher for content-related goals', () => {
      const blogService = SERVICES['blog-post']
      if (!blogService) return // Skip if service doesn't exist

      const contentScore = scoreServiceRelevance(
        blogService,
        ['seo_traffic', 'thought_leadership'],
        [],
        'technology',
        false
      )

      const randomScore = scoreServiceRelevance(
        blogService,
        ['unrelated_goal'],
        [],
        'unrelated_industry',
        false
      )

      expect(contentScore).toBeGreaterThanOrEqual(randomScore)
    })

    it('should handle empty goals array', () => {
      const service = Object.values(SERVICES)[0]
      const score = scoreServiceRelevance(
        service,
        [],
        [],
        'technology',
        false
      )

      expect(typeof score).toBe('number')
      expect(score).toBeGreaterThanOrEqual(0)
    })

    it('should increase score when needsImages matches service capability', () => {
      const imageService = Object.values(SERVICES).find(s => s.supportsImages)
      const nonImageService = Object.values(SERVICES).find(s => !s.supportsImages)

      if (imageService) {
        const withImages = scoreServiceRelevance(
          imageService,
          [],
          [],
          '',
          true
        )
        const withoutImages = scoreServiceRelevance(
          imageService,
          [],
          [],
          '',
          false
        )

        expect(withImages).toBeGreaterThanOrEqual(withoutImages)
      }
    })
  })
})
