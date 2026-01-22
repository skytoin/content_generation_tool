import { describe, it, expect } from 'vitest'
import {
  getLengthTier,
  getQualityTier,
  getPrice,
  formatPrice,
  getWordCountRange,
  LENGTH_TIERS,
  QUALITY_TIERS,
  DEFAULT_QUALITY_TIER,
  DEFAULT_LENGTH_TIER,
  type QualityTier,
  type LengthTier,
} from '@/lib/pricing-config'

describe('pricing-config', () => {
  describe('LENGTH_TIERS', () => {
    it('should have 5 length tiers', () => {
      expect(LENGTH_TIERS).toHaveLength(5)
    })

    it('should have correct tier IDs', () => {
      const ids = LENGTH_TIERS.map(t => t.id)
      expect(ids).toEqual(['quick', 'standard', 'long-form', 'deep-dive', 'ultimate'])
    })

    it('should have prices for all quality tiers', () => {
      LENGTH_TIERS.forEach(tier => {
        expect(tier.prices).toHaveProperty('budget')
        expect(tier.prices).toHaveProperty('standard')
        expect(tier.prices).toHaveProperty('premium')
      })
    })

    it('should have increasing prices from budget to premium', () => {
      LENGTH_TIERS.forEach(tier => {
        expect(tier.prices.budget).toBeLessThan(tier.prices.standard)
        expect(tier.prices.standard).toBeLessThan(tier.prices.premium)
      })
    })

    it('should have valid word ranges', () => {
      LENGTH_TIERS.forEach(tier => {
        expect(tier.minWords).toBeGreaterThan(0)
        expect(tier.maxWords).toBeGreaterThan(tier.minWords)
      })
    })
  })

  describe('QUALITY_TIERS', () => {
    it('should have 3 quality tiers', () => {
      expect(QUALITY_TIERS).toHaveLength(3)
    })

    it('should have correct tier IDs', () => {
      const ids = QUALITY_TIERS.map(t => t.id)
      expect(ids).toEqual(['budget', 'standard', 'premium'])
    })

    it('should have features for each tier', () => {
      QUALITY_TIERS.forEach(tier => {
        expect(tier.features.length).toBeGreaterThan(0)
      })
    })

    it('should have models for each tier', () => {
      QUALITY_TIERS.forEach(tier => {
        expect(tier.models.length).toBeGreaterThan(0)
      })
    })
  })

  describe('getLengthTier', () => {
    it('should return correct tier for valid ID', () => {
      const tier = getLengthTier('standard')
      expect(tier).toBeDefined()
      expect(tier?.id).toBe('standard')
      expect(tier?.name).toBe('Standard')
    })

    it('should return undefined for invalid ID', () => {
      const tier = getLengthTier('invalid' as LengthTier)
      expect(tier).toBeUndefined()
    })

    it('should return all length tiers correctly', () => {
      const tiers: LengthTier[] = ['quick', 'standard', 'long-form', 'deep-dive', 'ultimate']
      tiers.forEach(tierId => {
        const tier = getLengthTier(tierId)
        expect(tier).toBeDefined()
        expect(tier?.id).toBe(tierId)
      })
    })
  })

  describe('getQualityTier', () => {
    it('should return correct tier for valid ID', () => {
      const tier = getQualityTier('premium')
      expect(tier).toBeDefined()
      expect(tier?.id).toBe('premium')
      expect(tier?.name).toBe('Premium')
    })

    it('should return undefined for invalid ID', () => {
      const tier = getQualityTier('invalid' as QualityTier)
      expect(tier).toBeUndefined()
    })

    it('should return all quality tiers correctly', () => {
      const tiers: QualityTier[] = ['budget', 'standard', 'premium']
      tiers.forEach(tierId => {
        const tier = getQualityTier(tierId)
        expect(tier).toBeDefined()
        expect(tier?.id).toBe(tierId)
      })
    })
  })

  describe('getPrice', () => {
    it('should return correct price for valid combination', () => {
      expect(getPrice('budget', 'quick')).toBe(3)
      expect(getPrice('standard', 'quick')).toBe(6)
      expect(getPrice('premium', 'quick')).toBe(12)
    })

    it('should return correct prices for standard length', () => {
      expect(getPrice('budget', 'standard')).toBe(5)
      expect(getPrice('standard', 'standard')).toBe(10)
      expect(getPrice('premium', 'standard')).toBe(20)
    })

    it('should return correct prices for ultimate length', () => {
      expect(getPrice('budget', 'ultimate')).toBe(17)
      expect(getPrice('standard', 'ultimate')).toBe(30)
      expect(getPrice('premium', 'ultimate')).toBe(65)
    })

    it('should return 0 for invalid length tier', () => {
      expect(getPrice('premium', 'invalid' as LengthTier)).toBe(0)
    })

    it('should cover all price combinations', () => {
      const qualityTiers: QualityTier[] = ['budget', 'standard', 'premium']
      const lengthTiers: LengthTier[] = ['quick', 'standard', 'long-form', 'deep-dive', 'ultimate']

      qualityTiers.forEach(quality => {
        lengthTiers.forEach(length => {
          const price = getPrice(quality, length)
          expect(price).toBeGreaterThan(0)
          expect(typeof price).toBe('number')
        })
      })
    })
  })

  describe('formatPrice', () => {
    it('should format integer prices correctly', () => {
      expect(formatPrice(10)).toBe('$10')
      expect(formatPrice(0)).toBe('$0')
      expect(formatPrice(100)).toBe('$100')
    })

    it('should format decimal prices', () => {
      expect(formatPrice(10.5)).toBe('$10.5')
      expect(formatPrice(99.99)).toBe('$99.99')
    })

    it('should format all tier prices correctly', () => {
      LENGTH_TIERS.forEach(tier => {
        Object.values(tier.prices).forEach(price => {
          expect(formatPrice(price)).toMatch(/^\$\d+(\.\d+)?$/)
        })
      })
    })
  })

  describe('getWordCountRange', () => {
    it('should return correct range for valid tier', () => {
      const range = getWordCountRange('standard')
      expect(range.min).toBe(1500)
      expect(range.max).toBe(2500)
    })

    it('should return correct range for quick tier', () => {
      const range = getWordCountRange('quick')
      expect(range.min).toBe(1000)
      expect(range.max).toBe(1500)
    })

    it('should return correct range for ultimate tier', () => {
      const range = getWordCountRange('ultimate')
      expect(range.min).toBe(5500)
      expect(range.max).toBe(7000)
    })

    it('should return default values for invalid tier', () => {
      const range = getWordCountRange('invalid' as LengthTier)
      expect(range.min).toBe(1500)
      expect(range.max).toBe(2500)
    })

    it('should have min less than max for all tiers', () => {
      const lengthTiers: LengthTier[] = ['quick', 'standard', 'long-form', 'deep-dive', 'ultimate']
      lengthTiers.forEach(tierId => {
        const range = getWordCountRange(tierId)
        expect(range.min).toBeLessThan(range.max)
      })
    })
  })

  describe('defaults', () => {
    it('should have premium as default quality tier', () => {
      expect(DEFAULT_QUALITY_TIER).toBe('premium')
    })

    it('should have standard as default length tier', () => {
      expect(DEFAULT_LENGTH_TIER).toBe('standard')
    })

    it('default tiers should be valid', () => {
      expect(getQualityTier(DEFAULT_QUALITY_TIER)).toBeDefined()
      expect(getLengthTier(DEFAULT_LENGTH_TIER)).toBeDefined()
    })
  })
})
