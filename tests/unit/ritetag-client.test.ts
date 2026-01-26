/**
 * RiteTag Client Unit Tests
 *
 * Tests for the RiteTag API client utility functions.
 * These tests do NOT make actual API calls - they test the helper functions.
 */

import { describe, it, expect } from 'vitest'
import {
  categorizeBySize,
  filterByQuality,
  sortByEngagement,
  selectOptimalMix,
  HASHTAG_COLOR_CODES,
  RiteTagHashtag
} from '@/app/api/generate/ritetag-client'

// Sample test data
const sampleHashtags: RiteTagHashtag[] = [
  { hashtag: '#tech', tag: 'tech', tweets: 5000, exposure: 2000000, retweets: 500, images: 80, links: 60, mentions: 40, color: 3 },
  { hashtag: '#ai', tag: 'ai', tweets: 3000, exposure: 1500000, retweets: 450, images: 70, links: 50, mentions: 30, color: 3 },
  { hashtag: '#startup', tag: 'startup', tweets: 2000, exposure: 500000, retweets: 200, images: 75, links: 55, mentions: 35, color: 2 },
  { hashtag: '#code', tag: 'code', tweets: 1500, exposure: 300000, retweets: 150, images: 65, links: 45, mentions: 25, color: 2 },
  { hashtag: '#developer', tag: 'developer', tweets: 800, exposure: 80000, retweets: 100, images: 60, links: 40, mentions: 20, color: 3 },
  { hashtag: '#programming', tag: 'programming', tweets: 500, exposure: 50000, retweets: 75, images: 55, links: 35, mentions: 15, color: 2 },
  { hashtag: '#oldtag', tag: 'oldtag', tweets: 100, exposure: 10000, retweets: 5, images: 30, links: 20, mentions: 10, color: 1 },
  { hashtag: '#spammy', tag: 'spammy', tweets: 10000, exposure: 5000000, retweets: 100, images: 90, links: 80, mentions: 70, color: 0 },
]

describe('RiteTag Client Utilities', () => {
  describe('HASHTAG_COLOR_CODES', () => {
    it('should have correct color code values', () => {
      expect(HASHTAG_COLOR_CODES.OVERUSED).toBe(0)
      expect(HASHTAG_COLOR_CODES.COLD).toBe(1)
      expect(HASHTAG_COLOR_CODES.UNUSED).toBe(2)
      expect(HASHTAG_COLOR_CODES.HOT).toBe(3)
    })
  })

  describe('categorizeBySize', () => {
    it('should categorize hashtags by exposure correctly', () => {
      const result = categorizeBySize(sampleHashtags)

      expect(result.large.length).toBeGreaterThan(0)
      expect(result.medium.length).toBeGreaterThan(0)
      expect(result.small.length).toBeGreaterThan(0)
    })

    it('should put hashtags with >1M exposure in large category', () => {
      const result = categorizeBySize(sampleHashtags)

      result.large.forEach(h => {
        expect(h.exposure).toBeGreaterThan(1000000)
      })
    })

    it('should put hashtags with 100K-1M exposure in medium category', () => {
      const result = categorizeBySize(sampleHashtags)

      result.medium.forEach(h => {
        expect(h.exposure).toBeGreaterThanOrEqual(100000)
        expect(h.exposure).toBeLessThanOrEqual(1000000)
      })
    })

    it('should put hashtags with <100K exposure in small category', () => {
      const result = categorizeBySize(sampleHashtags)

      result.small.forEach(h => {
        expect(h.exposure).toBeLessThan(100000)
      })
    })

    it('should handle empty array', () => {
      const result = categorizeBySize([])

      expect(result.large).toEqual([])
      expect(result.medium).toEqual([])
      expect(result.small).toEqual([])
    })
  })

  describe('filterByQuality', () => {
    it('should filter to hot and steady hashtags by default', () => {
      const result = filterByQuality(sampleHashtags)

      result.forEach(h => {
        expect([HASHTAG_COLOR_CODES.HOT, HASHTAG_COLOR_CODES.UNUSED]).toContain(h.color)
      })
    })

    it('should filter to only hot hashtags when specified', () => {
      const result = filterByQuality(sampleHashtags, {
        includeHot: true,
        includeSteady: false,
      })

      result.forEach(h => {
        expect(h.color).toBe(HASHTAG_COLOR_CODES.HOT)
      })
    })

    it('should exclude overused hashtags by default', () => {
      const result = filterByQuality(sampleHashtags)

      result.forEach(h => {
        expect(h.color).not.toBe(HASHTAG_COLOR_CODES.OVERUSED)
      })
    })

    it('should include overused when specified', () => {
      const result = filterByQuality(sampleHashtags, {
        includeHot: true,
        includeOverused: true,
      })

      const hasOverused = result.some(h => h.color === HASHTAG_COLOR_CODES.OVERUSED)
      expect(hasOverused).toBe(true)
    })

    it('should return empty array when no colors are allowed', () => {
      const result = filterByQuality(sampleHashtags, {
        includeHot: false,
        includeSteady: false,
        includeCold: false,
        includeOverused: false,
      })

      expect(result).toEqual([])
    })
  })

  describe('sortByEngagement', () => {
    it('should sort hashtags by color first (higher = better)', () => {
      const result = sortByEngagement(sampleHashtags)

      // First hashtags should have color 3 (hot)
      expect(result[0].color).toBe(3)

      // Verify overall sorting trend
      for (let i = 1; i < result.length; i++) {
        expect(result[i].color).toBeLessThanOrEqual(result[i - 1].color)
      }
    })

    it('should not mutate original array', () => {
      const original = [...sampleHashtags]
      sortByEngagement(sampleHashtags)

      expect(sampleHashtags).toEqual(original)
    })

    it('should handle array with single item', () => {
      const single = [sampleHashtags[0]]
      const result = sortByEngagement(single)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual(single[0])
    })
  })

  describe('selectOptimalMix', () => {
    it('should return primary, secondary, and niche hashtags', () => {
      const result = selectOptimalMix(sampleHashtags, 'reach')

      expect(result).toHaveProperty('primary')
      expect(result).toHaveProperty('secondary')
      expect(result).toHaveProperty('niche')
      expect(result).toHaveProperty('totalReach')
    })

    it('should calculate total reach correctly', () => {
      const result = selectOptimalMix(sampleHashtags, 'reach')

      const calculatedReach = [...result.primary, ...result.secondary, ...result.niche]
        .reduce((sum, h) => sum + h.exposure, 0)

      expect(result.totalReach).toBe(calculatedReach)
    })

    it('should respect count parameter', () => {
      const result = selectOptimalMix(sampleHashtags, 'reach', 5)

      const totalCount = result.primary.length + result.secondary.length + result.niche.length
      expect(totalCount).toBeLessThanOrEqual(5)
    })

    it('should filter out overused hashtags', () => {
      const result = selectOptimalMix(sampleHashtags, 'engagement')

      const allSelected = [...result.primary, ...result.secondary, ...result.niche]
      allSelected.forEach(h => {
        expect(h.color).not.toBe(HASHTAG_COLOR_CODES.OVERUSED)
      })
    })

    describe('goal-specific distribution', () => {
      it('should prioritize large hashtags for reach goal', () => {
        const result = selectOptimalMix(sampleHashtags, 'reach')

        // Reach goal should have more large hashtags (up to 2)
        expect(result.primary.length).toBeLessThanOrEqual(2)
      })

      it('should prioritize small hashtags for saves goal', () => {
        const result = selectOptimalMix(sampleHashtags, 'saves')

        // Saves goal should have at most 1 large hashtag
        expect(result.primary.length).toBeLessThanOrEqual(1)
      })

      it('should have balanced distribution for engagement goal', () => {
        const result = selectOptimalMix(sampleHashtags, 'engagement')

        // Engagement goal: 1 large, 4 medium, 5 small
        expect(result.primary.length).toBeLessThanOrEqual(1)
      })
    })
  })
})
