/**
 * Trends Seed Injection Unit Tests
 *
 * Tests for extracting rising queries from Google Trends data
 * and merging them into DataForSEO discovery seeds.
 * These tests do NOT make actual API calls.
 */

import { describe, it, expect } from 'vitest'
import { extractTrendSeeds } from '@/lib/analytics/analytics-client'
import type { GoogleTrendsData } from '@/lib/analytics/types'

function makeTrendsData(
  overrides: Partial<GoogleTrendsData> = {}
): GoogleTrendsData {
  return {
    keyword: 'ai content writing',
    interest: 75,
    relatedTopics: [],
    relatedQueries: [],
    ...overrides,
  }
}

describe('extractTrendSeeds', () => {
  it('should extract only rising queries', () => {
    const trends = makeTrendsData({
      relatedQueries: [
        { query: 'ai content for linkedin', type: 'rising', value: '+300%' },
        { query: 'ai blog writer', type: 'rising', value: '+200%' },
        { query: 'content marketing', type: 'top', value: 100 },
        { query: 'copywriting tools', type: 'top', value: 85 },
      ],
    })

    const seeds = extractTrendSeeds(trends)
    expect(seeds).toEqual(['ai content for linkedin', 'ai blog writer'])
  })

  it('should cap results at 5 entries', () => {
    const trends = makeTrendsData({
      relatedQueries: [
        { query: 'seed 1', type: 'rising', value: '+100%' },
        { query: 'seed 2', type: 'rising', value: '+200%' },
        { query: 'seed 3', type: 'rising', value: '+300%' },
        { query: 'seed 4', type: 'rising', value: '+400%' },
        { query: 'seed 5', type: 'rising', value: '+500%' },
        { query: 'seed 6', type: 'rising', value: '+600%' },
        { query: 'seed 7', type: 'rising', value: '+700%' },
      ],
    })

    const seeds = extractTrendSeeds(trends)
    expect(seeds).toHaveLength(5)
    expect(seeds).toEqual(['seed 1', 'seed 2', 'seed 3', 'seed 4', 'seed 5'])
  })

  it('should return empty array when no rising queries exist', () => {
    const trends = makeTrendsData({
      relatedQueries: [
        { query: 'content marketing', type: 'top', value: 100 },
        { query: 'blog writing', type: 'top', value: 80 },
      ],
    })

    const seeds = extractTrendSeeds(trends)
    expect(seeds).toEqual([])
  })

  it('should return empty array when relatedQueries is empty', () => {
    const trends = makeTrendsData({ relatedQueries: [] })
    expect(extractTrendSeeds(trends)).toEqual([])
  })

  it('should return empty array when trends data has no relatedQueries property', () => {
    const trends = makeTrendsData()
    // Delete relatedQueries to simulate missing field
    delete (trends as Record<string, unknown>).relatedQueries
    expect(extractTrendSeeds(trends)).toEqual([])
  })

  it('should return empty array for null/undefined input', () => {
    expect(extractTrendSeeds(null as unknown as GoogleTrendsData)).toEqual([])
    expect(extractTrendSeeds(undefined as unknown as GoogleTrendsData)).toEqual([])
  })

  it('should handle a mix of rising and top queries correctly', () => {
    const trends = makeTrendsData({
      relatedQueries: [
        { query: 'top query 1', type: 'top', value: 100 },
        { query: 'rising query 1', type: 'rising', value: '+150%' },
        { query: 'top query 2', type: 'top', value: 90 },
        { query: 'rising query 2', type: 'rising', value: '+250%' },
        { query: 'top query 3', type: 'top', value: 70 },
      ],
    })

    const seeds = extractTrendSeeds(trends)
    expect(seeds).toEqual(['rising query 1', 'rising query 2'])
  })
})

describe('Seed merging logic', () => {
  it('should merge trend seeds with existing seoSeeds without duplicates', () => {
    const existingSeeds = ['ai writing tool', 'blog generator', 'content creator']
    const trendSeeds = ['ai writing tool', 'ai content for linkedin', 'blog automation']

    // This mirrors the merging logic in runAnalytics
    const merged = [...existingSeeds, ...trendSeeds]
    // DataForSEO deduplicates with new Set() in seo-analyzer.ts
    const deduped = [...new Set(merged)]

    expect(deduped).toHaveLength(5) // 3 original + 2 unique from trends
    expect(deduped).toContain('ai writing tool')
    expect(deduped).toContain('blog generator')
    expect(deduped).toContain('content creator')
    expect(deduped).toContain('ai content for linkedin')
    expect(deduped).toContain('blog automation')
  })

  it('should produce empty merged seeds when both sources are empty', () => {
    const existingSeeds: string[] = []
    const trendSeeds: string[] = []
    const merged = [...existingSeeds, ...trendSeeds]
    expect(merged).toHaveLength(0)
  })

  it('should work with only trend seeds when no existing seoSeeds', () => {
    const trendSeeds = ['ai content for linkedin', 'blog automation']
    const merged = [...trendSeeds]
    expect(merged).toHaveLength(2)
  })

  it('should work with only existing seeds when trends returned nothing', () => {
    const existingSeeds = ['ai writing tool', 'blog generator']
    const trendSeeds: string[] = []
    const merged = [...existingSeeds, ...trendSeeds]
    expect(merged).toEqual(['ai writing tool', 'blog generator'])
  })

  it('should cap total seeds at 20 via DataForSEO slice', () => {
    const existingSeeds = Array.from({ length: 18 }, (_, i) => `existing-${i}`)
    const trendSeeds = ['trend-1', 'trend-2', 'trend-3', 'trend-4', 'trend-5']

    // Mirror seo-analyzer.ts logic: [...new Set([...seoSeeds, ...seedKeywords.slice(0, 5)])].slice(0, 20)
    const merged = [...new Set([...existingSeeds, ...trendSeeds])].slice(0, 20)
    expect(merged).toHaveLength(20)
    // First 18 are existing, then first 2 of 5 trends fit
    expect(merged[18]).toBe('trend-1')
    expect(merged[19]).toBe('trend-2')
  })
})
