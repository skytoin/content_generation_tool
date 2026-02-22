/**
 * Scribengine Knowledge Base Service Tests
 *
 * Verifies that all implemented pipelines are correctly registered
 * as available services in the knowledge base, and that Content Architect
 * can recommend them.
 */

import { describe, it, expect } from 'vitest'
import {
  getAvailableServices,
  getService,
  getAllServices,
  getServicesByCategory,
} from '@/lib/scribengine-knowledge-base'

describe('Knowledge Base Services', () => {
  describe('Available Services', () => {
    it('should include all implemented pipelines as available', () => {
      const available = getAvailableServices()
      const availableIds = available.map(s => s.id)

      // These all have working pipelines and should be available
      expect(availableIds).toContain('blog-post')
      expect(availableIds).toContain('instagram')
      expect(availableIds).toContain('linkedin')
      expect(availableIds).toContain('twitter')
    })

    it('should NOT include pipelines that are not yet built', () => {
      const available = getAvailableServices()
      const availableIds = available.map(s => s.id)

      // These don't have pipelines yet
      expect(availableIds).not.toContain('facebook')
      expect(availableIds).not.toContain('facebook-ads')
      expect(availableIds).not.toContain('google-ads')
    })
  })

  describe('Twitter/X Service', () => {
    it('should be marked as available (not coming soon)', () => {
      const twitter = getService('twitter')
      expect(twitter).toBeDefined()
      expect(twitter!.available).toBe(true)
      expect(twitter!.comingSoon).toBeUndefined()
    })

    it('should have populated deliverables', () => {
      const twitter = getService('twitter')
      expect(twitter!.deliverables.length).toBeGreaterThan(0)
    })

    it('should have populated features', () => {
      const twitter = getService('twitter')
      expect(twitter!.features.length).toBeGreaterThan(0)
    })

    it('should have populated style categories', () => {
      const twitter = getService('twitter')
      expect(twitter!.styleCategories.length).toBeGreaterThan(0)
    })

    it('should have populated use cases', () => {
      const twitter = getService('twitter')
      expect(twitter!.useCases.length).toBeGreaterThan(0)
    })

    it('should have populated pipeline stages', () => {
      const twitter = getService('twitter')
      expect(twitter!.pipelineStages.length).toBeGreaterThan(0)
      expect(twitter!.pipelineStages).toContain('Input processing')
      expect(twitter!.pipelineStages).toContain('Final polish')
    })

    it('should have tier pricing', () => {
      const twitter = getService('twitter')
      expect(twitter!.tiers.budget.price).toBeGreaterThan(0)
      expect(twitter!.tiers.standard.price).toBeGreaterThan(0)
      expect(twitter!.tiers.premium.price).toBeGreaterThan(0)
    })

    it('should have required inputs', () => {
      const twitter = getService('twitter')
      expect(twitter!.requiredInputs).toContain('topic')
      expect(twitter!.requiredInputs).toContain('company')
    })

    it('should have recommendWhen goals', () => {
      const twitter = getService('twitter')
      expect(twitter!.recommendWhen.goals.length).toBeGreaterThan(0)
    })
  })

  describe('LinkedIn Service', () => {
    it('should be marked as available', () => {
      const linkedin = getService('linkedin')
      expect(linkedin).toBeDefined()
      expect(linkedin!.available).toBe(true)
    })

    it('should have populated content', () => {
      const linkedin = getService('linkedin')
      expect(linkedin!.deliverables.length).toBeGreaterThan(0)
      expect(linkedin!.features.length).toBeGreaterThan(0)
      expect(linkedin!.useCases.length).toBeGreaterThan(0)
    })
  })

  describe('Instagram Service', () => {
    it('should be marked as available', () => {
      const instagram = getService('instagram')
      expect(instagram).toBeDefined()
      expect(instagram!.available).toBe(true)
    })
  })

  describe('Blog Service', () => {
    it('should be marked as available', () => {
      const blog = getService('blog-post')
      expect(blog).toBeDefined()
      expect(blog!.available).toBe(true)
    })
  })

  describe('Facebook Service (Future)', () => {
    it('should exist but be marked as coming soon', () => {
      const facebook = getService('facebook')
      expect(facebook).toBeDefined()
      expect(facebook!.available).toBeFalsy()
      expect(facebook!.comingSoon).toBe(true)
    })
  })

  describe('Service Categories', () => {
    it('should have social category services', () => {
      const social = getServicesByCategory('social')
      expect(social.length).toBeGreaterThan(0)
      const ids = social.map(s => s.id)
      expect(ids).toContain('instagram')
      expect(ids).toContain('linkedin')
      expect(ids).toContain('twitter')
    })
  })

  describe('Content Architect Integration', () => {
    it('getAvailableServices should return services CA can recommend', () => {
      const available = getAvailableServices()
      // CA uses this function to build its recommendations prompt
      // Each service should have enough data for meaningful recommendations
      for (const service of available) {
        expect(service.id).toBeTruthy()
        expect(service.name).toBeTruthy()
        expect(service.description).toBeTruthy()
        expect(service.tiers).toBeDefined()
        expect(service.recommendWhen).toBeDefined()
        expect(service.recommendWhen.goals.length).toBeGreaterThan(0)
      }
    })
  })
})
