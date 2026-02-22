/**
 * Tests for parseStrategyResponse and formatContentArchitectOutput
 *
 * Validates that AI strategy text is correctly parsed into structured data,
 * and that the structured data formats into readable report text.
 */

import { describe, it, expect } from 'vitest'

// We need to test the internal parseStrategyResponse function.
// Since it's not exported, we'll test via formatContentArchitectOutput which calls it,
// or we can import it after making it testable.
// For now, let's import the format function and test the full pipeline output.

import {
  formatContentArchitectOutput,
  type ContentArchitectResponse,
} from '@/app/api/generate/content-architect-pipeline'

// Helper to build a minimal valid response for testing specific sections
function buildResponse(overrides: Partial<ContentArchitectResponse> = {}): ContentArchitectResponse {
  return {
    success: true,
    tier: 'standard',
    analysis: {
      summary: 'Test analysis summary',
      businessContext: { industry: 'finance', company_type: 'consultation' },
      audienceProfile: { primary_demographic: 'small business owners' },
      contentNeeds: { primary_purpose: 'educate' },
    },
    strategy: {
      overview: 'Strategic overview text here.',
      primaryFocus: 'Build SEO foundation',
      contentPillars: ['Tax Problem Solver', 'Business Formation Guide', 'Audit Defense'],
      platformStrategy: {
        blog: 'SEO-optimized educational content targeting long-tail keywords',
        linkedin: 'B2B thought leadership with carousels and articles',
        instagram: 'Local awareness through visual tax tips and behind-the-scenes',
      },
      contentCalendar: 'Weekly blog posts, 3x/week social',
    },
    recommendations: [],
    executionPlan: {
      phase1: ['Set up Blog Content Pipeline'],
      phase2: ['Implement LinkedIn Content Pipeline'],
      phase3: [],
      quickWins: ['Audit existing content'],
    },
    metadata: {
      generatedAt: '2026-02-21T00:00:00.000Z',
      modelUsed: 'Claude Sonnet',
      analyticsConfidence: 'medium',
      warnings: [],
    },
    ...overrides,
  }
}

describe('formatContentArchitectOutput', () => {
  it('should include all section headers', () => {
    const output = formatContentArchitectOutput(buildResponse())
    expect(output).toContain('CONTENT ARCHITECT')
    expect(output).toContain('ANALYSIS SUMMARY')
    expect(output).toContain('STRATEGIC OVERVIEW')
    expect(output).toContain('PLATFORM STRATEGY')
    expect(output).toContain('EXECUTION PLAN')
  })

  it('should render content pillars with proper numbering', () => {
    const output = formatContentArchitectOutput(buildResponse())
    expect(output).toContain('Content Pillars:')
    expect(output).toContain('1. Tax Problem Solver')
    expect(output).toContain('2. Business Formation Guide')
    expect(output).toContain('3. Audit Defense')
  })

  it('should render platform strategy with full content', () => {
    const output = formatContentArchitectOutput(buildResponse())
    expect(output).toContain('BLOG: SEO-optimized educational content')
    expect(output).toContain('LINKEDIN: B2B thought leadership')
    expect(output).toContain('INSTAGRAM: Local awareness')
  })

  it('should render analysis summary with business context', () => {
    const output = formatContentArchitectOutput(buildResponse())
    expect(output).toContain('Test analysis summary')
    expect(output).toContain('industry: finance')
  })

  it('should render SEO intelligence when present', () => {
    const response = buildResponse({
      seoInsights: {
        topKeywords: [
          { keyword: 'tax planning services', volume: 1200, difficulty: 45, clicks: 300, intent: 'commercial' },
          { keyword: 'llc formation', volume: 800, difficulty: 30, clicks: 200, intent: 'informational' },
        ],
        competitorDomains: [
          { domain: 'turbotax.com', rank: 5, traffic: 50000, keywords: 1200 },
        ],
        contentGaps: [
          { keyword: 'irs audit help', competitorCount: 3, avgVolume: 500 },
        ],
        keywordWarnings: [
          { keyword: 'finance', reason: 'Low click-through rate', alternatives: ['financial planning'] },
        ],
        searchIntentBreakdown: { commercial: 5, informational: 3 },
      },
    })
    const output = formatContentArchitectOutput(response)
    expect(output).toContain('SEO INTELLIGENCE')
    expect(output).toContain('Keyword Opportunities:')
    expect(output).toContain('tax planning services')
    expect(output).toContain('Competitor Domains:')
    expect(output).toContain('turbotax.com')
    expect(output).toContain('Content Gaps:')
    expect(output).toContain('irs audit help')
    expect(output).toContain('Keyword Warnings:')
    expect(output).toContain('Low click-through rate')
    expect(output).toContain('Search Intent Breakdown:')
  })

  it('should render execution plan phases', () => {
    const output = formatContentArchitectOutput(buildResponse())
    expect(output).toContain('QUICK WINS')
    expect(output).toContain('Audit existing content')
    expect(output).toContain('PHASE 1')
    expect(output).toContain('Set up Blog Content Pipeline')
    expect(output).toContain('PHASE 2')
    expect(output).toContain('Implement LinkedIn Content Pipeline')
  })

  it('should handle empty content pillars', () => {
    const response = buildResponse({
      strategy: {
        overview: 'Overview',
        primaryFocus: 'Focus',
        contentPillars: [],
        platformStrategy: {},
      },
    })
    const output = formatContentArchitectOutput(response)
    expect(output).toContain('Content Pillars:')
    // Should not crash — just empty
  })

  it('should handle empty platform strategy', () => {
    const response = buildResponse({
      strategy: {
        overview: 'Overview',
        primaryFocus: 'Focus',
        contentPillars: ['Pillar 1'],
        platformStrategy: {},
      },
    })
    const output = formatContentArchitectOutput(response)
    // Should not contain PLATFORM STRATEGY section header when empty
    expect(output).not.toContain('PLATFORM STRATEGY')
  })
})

// Now test parseStrategyResponse via a re-exported test helper
// Since we can't import it directly, we test it indirectly through the module
import { parseStrategyResponse as _parseStrategy } from '@/app/api/generate/content-architect-pipeline'

describe('parseStrategyResponse', () => {
  // Standard AI output with clear section headers
  const standardResponse = `OVERVIEW: Your finance consultation business needs a trust-first content strategy that positions you as the local expert.

PRIMARY FOCUS: Build SEO Foundation Through Educational Blog Content

CONTENT PILLARS:
1. "Tax Problem Solver" (Lead Generation Priority)
   - Focus: IRS audits, back taxes, penalties
   - Target: Individuals with tax problems

2. "Business Formation Guide" (Authority Builder)
   - Focus: LLC, S-Corp, business setup
   - Target: New business owners

3. "Audit Defense & Representation"
   - Focus: IRS representation, compliance
   - Target: Businesses facing audits

4. "Local Business Tax Tips"
   - Focus: City/county-specific tax requirements
   - Target: NY/NJ business owners

5. "Financial Literacy for Business Owners"
   - Focus: Bookkeeping basics, financial planning
   - Target: Startup owners

PLATFORM STRATEGY:
Blog: SEO-optimized educational content targeting long-tail keywords.
Service: Blog Content Pipeline - Standard tier ($10/post)
Publishing Cadence: 3 posts/week during tax season
Topic Distribution: 40% Tax Season, 25% Business Formation, 20% Audit Defense, 15% Local Tips

Instagram: Local awareness through visual tax tips.
Publishing Cadence: 2 posts/week
Content Mix: 50% educational carousels, 25% behind-the-scenes

LinkedIn: B2B thought leadership with carousels and articles.
Publishing Cadence: 3 posts/week
Content Mix: 60% text posts, 30% carousels, 10% articles

Email: Nurture sequences for lead conversion.
Publishing Cadence: Weekly digest + triggered sequences

CONTENT CALENDAR:
Tax Season (Aug-Apr): 3 blog posts/week, 3 LinkedIn/week, 2 Instagram/week
Off-Season (May-Jul): 1 blog post/week, 2 LinkedIn/week, 1 Instagram/week`

  it('should extract overview text', () => {
    const result = _parseStrategy(standardResponse)
    expect(result.overview).toContain('trust-first content strategy')
  })

  it('should extract primary focus', () => {
    const result = _parseStrategy(standardResponse)
    expect(result.primaryFocus).toContain('Build SEO Foundation')
  })

  it('should extract all 5 content pillars', () => {
    const result = _parseStrategy(standardResponse)
    expect(result.contentPillars).toHaveLength(5)
    expect(result.contentPillars[0]).toContain('Tax Problem Solver')
    expect(result.contentPillars[1]).toContain('Business Formation Guide')
    expect(result.contentPillars[2]).toContain('Audit Defense')
    expect(result.contentPillars[3]).toContain('Local Business Tax Tips')
    expect(result.contentPillars[4]).toContain('Financial Literacy')
  })

  it('should NOT include sub-bullets in content pillars', () => {
    const result = _parseStrategy(standardResponse)
    for (const pillar of result.contentPillars) {
      expect(pillar).not.toContain('Focus:')
      expect(pillar).not.toContain('Target:')
    }
  })

  it('should extract platform strategies with full content', () => {
    const result = _parseStrategy(standardResponse)
    expect(result.platformStrategy.blog).toContain('SEO-optimized')
    expect(result.platformStrategy.blog).toContain('Publishing Cadence')
    expect(result.platformStrategy.instagram).toContain('Local awareness')
    expect(result.platformStrategy.instagram).toContain('Content Mix')
    expect(result.platformStrategy.linkedin).toContain('B2B thought leadership')
    expect(result.platformStrategy.email).toContain('Nurture sequences')
  })

  it('should extract content calendar', () => {
    const result = _parseStrategy(standardResponse)
    expect(result.contentCalendar).toContain('Tax Season')
  })

  // Test with markdown-formatted AI output (bold headers, bullets)
  const markdownResponse = `**OVERVIEW**
A comprehensive strategy focusing on local authority and lead generation.

**PRIMARY FOCUS**
Establish local SEO dominance through educational blog content.

**CONTENT PILLARS**
- Tax Season Survival Guide
- Business Formation Simplified
- Audit Defense Strategies
- Local Tax Requirements
- Financial Planning Basics

**PLATFORM STRATEGY**
**Blog**: Core SEO content hub with weekly posts.
Focus on long-tail keywords and local intent.

**LinkedIn**: Professional thought leadership.
Weekly articles and daily posts.

**Instagram**: Visual content for local awareness.
Carousel posts and stories.

**CONTENT CALENDAR**
3 posts per week on blog, daily social media.`

  it('should handle markdown-formatted headers', () => {
    const result = _parseStrategy(markdownResponse)
    expect(result.overview).toContain('comprehensive strategy')
    expect(result.primaryFocus).toContain('local SEO dominance')
  })

  it('should extract bullet-style content pillars', () => {
    const result = _parseStrategy(markdownResponse)
    expect(result.contentPillars.length).toBeGreaterThanOrEqual(4)
    expect(result.contentPillars.some(p => p.includes('Tax Season'))).toBe(true)
    expect(result.contentPillars.some(p => p.includes('Business Formation'))).toBe(true)
  })

  it('should handle bold platform names in platform strategy', () => {
    const result = _parseStrategy(markdownResponse)
    expect(result.platformStrategy.blog).toContain('Core SEO content hub')
    expect(result.platformStrategy.linkedin).toContain('thought leadership')
    expect(result.platformStrategy.instagram).toContain('Visual content')
  })

  // Test with minimal/edge case output
  it('should handle response with no sections found', () => {
    const result = _parseStrategy('Just some random text without any sections.')
    expect(result.overview).toBe('')
    expect(result.contentPillars).toEqual([])
    expect(result.platformStrategy).toEqual({})
  })

  it('should handle X/Twitter platform name', () => {
    const response = `OVERVIEW: Strategy overview.
PRIMARY FOCUS: Content focus.
CONTENT PILLARS:
1. Pillar One
PLATFORM STRATEGY:
X (Twitter): Real-time engagement with trending topics.
Post 3x daily during peak hours.
CONTENT CALENDAR: Daily posting.`
    const result = _parseStrategy(response)
    expect(result.platformStrategy.twitter).toContain('Real-time engagement')
    expect(result.platformStrategy.twitter).toContain('peak hours')
  })
})
