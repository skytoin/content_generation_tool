'use client';

/**
 * PRICING SECTION - Ink Diffusion Homepage
 *
 * Dark navy background with gold accents.
 * No emoji badges.
 */

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { tokens } from '../../primitives/design-tokens';
import { CheckIcon } from '../icons/InkIcons';

const colors = {
  navy: '#1a2744',
  gold: '#C9A962',
};

const tiers = [
  {
    tier: 'Budget',
    tagline: 'Fast & Efficient',
    description: 'Quality content powered by GPT-4 with quick turnaround',
    price: '$3-17',
    priceNote: 'per piece',
    features: [
      'Single AI generation pass',
      'Basic style matching',
      'Standard delivery (24h)',
      '4 research queries',
    ],
    color: tokens.colors.sage[400],
  },
  {
    tier: 'Standard',
    tagline: 'Most Popular',
    description: 'Multi-model collaboration for superior results',
    price: '$6-30',
    priceNote: 'per piece',
    features: [
      'Multi-AI collaboration',
      'Advanced style matching',
      'Priority delivery (12h)',
      '7 research queries',
      'Professional polish pass',
    ],
    color: colors.gold,
    featured: true,
  },
  {
    tier: 'Premium',
    tagline: 'Uncompromising Quality',
    description: 'Best-in-class models with comprehensive review',
    price: '$12-65',
    priceNote: 'per piece',
    features: [
      'Top-tier AI models',
      'Deep style analysis',
      'Express delivery (6h)',
      'Live web research',
      'Multi-stage quality review',
      'Revision included',
    ],
    color: tokens.colors.ink[400],
  },
];

export const PricingSection: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleGetStarted = () => {
    if (session) {
      router.push('/dashboard/projects/new');
    } else {
      router.push('/signup');
    }
  };

  return (
    <section
      id="pricing"
      className="py-20 sm:py-32 px-4 sm:px-8 relative overflow-hidden scroll-mt-20"
      style={{ background: colors.navy }}
    >
      {/* Decorative gradient orbs */}
      <div
        className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 rounded-full blur-3xl opacity-20"
        style={{ background: tokens.colors.ink[500] }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 rounded-full blur-3xl opacity-20"
        style={{ background: colors.gold }}
      />

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-12 sm:mb-20">
          <p
            className="text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-3 sm:mb-4"
            style={{ color: colors.gold, fontFamily: tokens.fonts.sans }}
          >
            Quality Tiers
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-light mb-4 sm:mb-6"
            style={{ fontFamily: tokens.fonts.serif, color: '#fff' }}
          >
            Choose your level of <em>excellence</em>
          </h2>
          <p
            className="text-base sm:text-lg max-w-xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Three quality tiers to match your budget and needs.
            Same style matching, different AI horsepower.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={`relative p-6 sm:p-8 rounded-2xl transition-all duration-500 ${tier.featured ? 'md:-mt-4 md:mb-4' : ''}`}
              style={{
                background: tier.featured ? colors.gold : 'rgba(255,255,255,0.05)',
                border: tier.featured ? 'none' : '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {tier.featured && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-medium"
                  style={{ background: colors.navy, color: colors.gold }}
                >
                  Recommended
                </div>
              )}

              <p
                className="text-xs uppercase tracking-wider mb-2"
                style={{ color: tier.featured ? colors.navy : tier.color }}
              >
                {tier.tagline}
              </p>
              <h3
                className="text-2xl sm:text-3xl mb-2"
                style={{ fontFamily: tokens.fonts.serif, color: tier.featured ? colors.navy : '#fff' }}
              >
                {tier.tier}
              </h3>
              <p
                className="text-sm mb-4 sm:mb-6"
                style={{ color: tier.featured ? 'rgba(26,39,68,0.7)' : 'rgba(255,255,255,0.6)' }}
              >
                {tier.description}
              </p>

              <div className="mb-4 sm:mb-6">
                <p
                  className="text-3xl sm:text-4xl font-light"
                  style={{ fontFamily: tokens.fonts.serif, color: tier.featured ? colors.navy : '#fff' }}
                >
                  {tier.price}
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: tier.featured ? 'rgba(26,39,68,0.5)' : 'rgba(255,255,255,0.5)' }}
                >
                  {tier.priceNote}
                </p>
              </div>

              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {tier.features.map((feature, j) => (
                  <li
                    key={j}
                    className="flex items-center gap-2 sm:gap-3 text-sm"
                    style={{ color: tier.featured ? colors.navy : 'rgba(255,255,255,0.8)' }}
                  >
                    <CheckIcon
                      size={16}
                      color={tier.featured ? colors.navy : 'rgba(255,255,255,0.8)'}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={handleGetStarted}
                className="w-full py-3 rounded-xl font-medium transition-all hover:scale-105"
                style={{
                  background: tier.featured ? colors.navy : 'rgba(255,255,255,0.1)',
                  color: tier.featured ? colors.gold : '#fff',
                }}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        {/* See full pricing link */}
        <div className="text-center mt-10 sm:mt-12">
          <a
            href="#blog-pricing"
            className="text-sm font-medium inline-flex items-center gap-2"
            style={{ color: colors.gold }}
          >
            See detailed blog post pricing
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
