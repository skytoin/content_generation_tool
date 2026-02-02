'use client';

/**
 * INK PRICING CONFIGURATOR PAGE
 *
 * Interactive pricing configurator instead of overwhelming tables.
 * Guided selection with real-time price updates.
 *
 * COPIED EXACTLY FROM DEMO for visual consistency.
 */

import React, { useState, useMemo } from 'react';
import { tokens } from '../primitives/design-tokens';
import { InkButton } from '../primitives/InkButton';
import { InkBadge } from '../primitives/InkBadge';

// Service types
const services = [
  {
    id: 'blog',
    name: 'Blog Post',
    description: 'Long-form articles with SEO optimization',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    id: 'social',
    name: 'Social Pack',
    description: '30 posts across LinkedIn, Twitter, Instagram',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
  },
  {
    id: 'email',
    name: 'Email Sequence',
    description: '5-email campaign with personalization',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
];

// Length tiers
const lengths = [
  { id: 'quick', name: 'Quick', words: '1,000-1,500', popular: false },
  { id: 'standard', name: 'Standard', words: '1,500-2,500', popular: true },
  { id: 'long', name: 'Long-form', words: '2,500-4,000', popular: false },
  { id: 'deep', name: 'Deep Dive', words: '4,000-5,500', popular: false },
];

// Quality tiers with pricing multipliers
const qualities = [
  {
    id: 'budget',
    name: 'Budget',
    description: 'GPT-4 powered, fast delivery',
    features: ['Single AI pass', 'Basic editing', '24h delivery'],
    multiplier: 1,
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Multi-model blend for better results',
    features: ['Multi-AI collaboration', 'Style matching', '12h delivery'],
    multiplier: 2,
    recommended: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Claude Opus with human-level review',
    features: ['Best AI models', 'Deep research', 'Quality guarantee'],
    multiplier: 4,
  },
];

// Base prices
const basePrices: Record<string, Record<string, number>> = {
  blog: { quick: 8, standard: 12, long: 18, deep: 24 },
  social: { quick: 39, standard: 49, long: 59, deep: 79 },
  email: { quick: 29, standard: 39, long: 49, deep: 59 },
};

export const InkPricingConfigurator: React.FC = () => {
  const [selectedService, setSelectedService] = useState('blog');
  const [selectedLength, setSelectedLength] = useState('standard');
  const [selectedQuality, setSelectedQuality] = useState('standard');

  // Calculate price
  const price = useMemo(() => {
    const base = basePrices[selectedService]?.[selectedLength] || 0;
    const quality = qualities.find(q => q.id === selectedQuality);
    return base * (quality?.multiplier || 1);
  }, [selectedService, selectedLength, selectedQuality]);

  const selectedServiceData = services.find(s => s.id === selectedService);
  const selectedLengthData = lengths.find(l => l.id === selectedLength);
  const selectedQualityData = qualities.find(q => q.id === selectedQuality);

  return (
    <div
      className="min-h-screen"
      style={{ background: tokens.colors.paper.cream }}
    >
      <div className="max-w-5xl mx-auto px-8 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <p
            className="text-xs uppercase tracking-[0.3em] mb-3"
            style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
          >
            Configure Your Content
          </p>
          <h1
            className="text-5xl font-light mb-4"
            style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
          >
            Build Your Perfect Package
          </h1>
          <p
            className="text-xl max-w-2xl mx-auto"
            style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.serif }}
          >
            Select your content type, length, and quality tier. <br />
            Watch the price update in real-time.
          </p>
        </header>

        {/* Configurator */}
        <div className="space-y-12">
          {/* Step 1: Service Type */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                style={{ background: tokens.colors.ink[700], color: '#fff', fontFamily: tokens.fonts.sans }}
              >
                1
              </span>
              <h2
                className="text-xl"
                style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
              >
                What do you need?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className="text-left p-6 rounded-xl transition-all"
                  style={{
                    background: selectedService === service.id ? tokens.colors.paper.white : tokens.colors.paper.warm,
                    border: `2px solid ${selectedService === service.id ? tokens.colors.ink[700] : 'transparent'}`,
                    boxShadow: selectedService === service.id ? tokens.shadows.lg : 'none',
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: selectedService === service.id ? tokens.colors.ink[50] : tokens.colors.paper.white,
                      color: selectedService === service.id ? tokens.colors.ink[700] : tokens.colors.text.muted,
                    }}
                  >
                    {service.icon}
                  </div>
                  <h3
                    className="font-medium mb-1"
                    style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
                  >
                    {service.name}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                  >
                    {service.description}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* Step 2: Length */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                style={{ background: tokens.colors.ink[700], color: '#fff', fontFamily: tokens.fonts.sans }}
              >
                2
              </span>
              <h2
                className="text-xl"
                style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
              >
                How comprehensive?
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {lengths.map((length) => (
                <button
                  key={length.id}
                  onClick={() => setSelectedLength(length.id)}
                  className="relative p-5 rounded-xl transition-all text-center"
                  style={{
                    background: selectedLength === length.id ? tokens.colors.paper.white : tokens.colors.paper.warm,
                    border: `2px solid ${selectedLength === length.id ? tokens.colors.ink[700] : 'transparent'}`,
                    boxShadow: selectedLength === length.id ? tokens.shadows.lg : 'none',
                  }}
                >
                  {length.popular && (
                    <span
                      className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        background: tokens.colors.sage[500],
                        color: '#fff',
                        fontFamily: tokens.fonts.sans,
                      }}
                    >
                      Popular
                    </span>
                  )}
                  <h3
                    className="font-medium mb-1"
                    style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
                  >
                    {length.name}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.mono }}
                  >
                    {length.words} words
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* Step 3: Quality Tier */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                style={{ background: tokens.colors.ink[700], color: '#fff', fontFamily: tokens.fonts.sans }}
              >
                3
              </span>
              <h2
                className="text-xl"
                style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
              >
                Choose your quality tier
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {qualities.map((quality) => (
                <button
                  key={quality.id}
                  onClick={() => setSelectedQuality(quality.id)}
                  className="relative text-left p-6 rounded-xl transition-all"
                  style={{
                    background: selectedQuality === quality.id ? tokens.colors.paper.white : tokens.colors.paper.warm,
                    border: `2px solid ${selectedQuality === quality.id ? tokens.colors.ink[700] : 'transparent'}`,
                    boxShadow: selectedQuality === quality.id ? tokens.shadows.lg : 'none',
                  }}
                >
                  {quality.recommended && (
                    <span
                      className="absolute -top-3 left-6 px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: tokens.colors.ink[700],
                        color: '#fff',
                        fontFamily: tokens.fonts.sans,
                      }}
                    >
                      Recommended
                    </span>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <InkBadge tier={quality.id as 'budget' | 'standard' | 'premium'}>{quality.name}</InkBadge>
                  </div>

                  <p
                    className="text-sm mb-4"
                    style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}
                  >
                    {quality.description}
                  </p>

                  <ul className="space-y-2">
                    {quality.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm"
                        style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={tokens.colors.sage[500]} strokeWidth="2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Price Summary - Sticky */}
        <div
          className="sticky bottom-8 mt-16 p-6 rounded-2xl"
          style={{
            background: tokens.colors.paper.white,
            boxShadow: '0 -10px 40px rgba(26,26,26,0.1), 0 10px 40px rgba(26,26,26,0.15)',
            border: `1px solid ${tokens.colors.paper.border}`,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Summary */}
              <div>
                <p
                  className="text-sm mb-1"
                  style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                >
                  Your selection
                </p>
                <p
                  className="font-medium"
                  style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
                >
                  {selectedServiceData?.name} · {selectedLengthData?.name} · {selectedQualityData?.name}
                </p>
              </div>

              {/* Divider */}
              <div
                className="w-px h-12"
                style={{ background: tokens.colors.paper.border }}
              />

              {/* Word count */}
              <div>
                <p
                  className="text-sm mb-1"
                  style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                >
                  Word count
                </p>
                <p
                  className="font-medium"
                  style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.mono }}
                >
                  {selectedLengthData?.words}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              {/* Price */}
              <div className="text-right">
                <p
                  className="text-sm mb-1"
                  style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                >
                  Total
                </p>
                <p
                  className="text-4xl font-light"
                  style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.serif }}
                >
                  ${price}
                </p>
              </div>

              <InkButton variant="primary" size="lg">
                Continue to checkout
              </InkButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InkPricingConfigurator;
