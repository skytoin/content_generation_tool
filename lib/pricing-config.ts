// Scribengine - Centralized Pricing Configuration
// This file contains all pricing information used across the application

export type QualityTier = 'budget' | 'standard' | 'premium'
export type LengthTier = 'quick' | 'standard' | 'long-form' | 'deep-dive' | 'ultimate'

export interface LengthTierConfig {
  id: LengthTier
  name: string
  wordRange: string
  minWords: number
  maxWords: number
  prices: Record<QualityTier, number> // prices in dollars
}

export interface QualityTierConfig {
  id: QualityTier
  name: string
  description: string
  features: string[]
  models: string[]
}

// Length tier configurations with word ranges and pricing
export const LENGTH_TIERS: LengthTierConfig[] = [
  {
    id: 'quick',
    name: 'Quick Post',
    wordRange: '1,000-1,500',
    minWords: 1000,
    maxWords: 1500,
    prices: {
      budget: 3,
      standard: 6,
      premium: 12,
    },
  },
  {
    id: 'standard',
    name: 'Standard',
    wordRange: '1,500-2,500',
    minWords: 1500,
    maxWords: 2500,
    prices: {
      budget: 5,
      standard: 10,
      premium: 20,
    },
  },
  {
    id: 'long-form',
    name: 'Long-Form',
    wordRange: '2,500-4,000',
    minWords: 2500,
    maxWords: 4000,
    prices: {
      budget: 8,
      standard: 14,
      premium: 25,
    },
  },
  {
    id: 'deep-dive',
    name: 'Deep Dive',
    wordRange: '4,000-5,500',
    minWords: 4000,
    maxWords: 5500,
    prices: {
      budget: 12,
      standard: 20,
      premium: 45,
    },
  },
  {
    id: 'ultimate',
    name: 'Ultimate Guide',
    wordRange: '5,500-7,000',
    minWords: 5500,
    maxWords: 7000,
    prices: {
      budget: 17,
      standard: 30,
      premium: 65,
    },
  },
]

// Quality tier configurations
export const QUALITY_TIERS: QualityTierConfig[] = [
  {
    id: 'budget',
    name: 'Budget',
    description: 'Fast, cost-effective content using GPT-4o models',
    features: [
      'GPT-4o mini for research & outline',
      'GPT-4o for writing & polish',
      'Basic quality checks',
      'Quick turnaround',
    ],
    models: ['GPT-4o mini', 'GPT-4o'],
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Balanced quality with mixed AI models',
    features: [
      'GPT-4.1 for research & planning',
      'GPT-4o for content generation',
      'Claude Sonnet for quality review',
      'Enhanced fact-checking',
    ],
    models: ['GPT-4.1', 'GPT-4o', 'Claude Sonnet'],
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Highest quality using Claude\'s best models',
    features: [
      'Claude Haiku for research',
      'Claude Sonnet for writing',
      'Claude Opus for final polish',
      'Comprehensive quality assurance',
      'Expert-level content',
    ],
    models: ['Claude Haiku', 'Claude Sonnet', 'Claude Opus'],
  },
]

// Helper functions
export function getLengthTier(tierId: LengthTier): LengthTierConfig | undefined {
  return LENGTH_TIERS.find(tier => tier.id === tierId)
}

export function getQualityTier(tierId: QualityTier): QualityTierConfig | undefined {
  return QUALITY_TIERS.find(tier => tier.id === tierId)
}

export function getPrice(qualityTier: QualityTier, lengthTier: LengthTier): number {
  const length = getLengthTier(lengthTier)
  return length?.prices[qualityTier] ?? 0
}

export function formatPrice(price: number): string {
  return `$${price}`
}

export function getWordCountRange(lengthTier: LengthTier): { min: number; max: number } {
  const tier = getLengthTier(lengthTier)
  return {
    min: tier?.minWords ?? 1500,
    max: tier?.maxWords ?? 2500,
  }
}

// Default values
export const DEFAULT_QUALITY_TIER: QualityTier = 'premium'
export const DEFAULT_LENGTH_TIER: LengthTier = 'standard'
