'use client';

/**
 * HOMEPAGE 6: DARK ELEGANCE
 *
 * Design: Sophisticated dark theme with gold/bronze accents.
 * Luxury, premium, exclusive feel. Think high-end watches
 * or premium automotive brands.
 */

import React from 'react';
import { tokens } from '../design-tokens';

const colors = {
  black: '#0A0A0A',
  charcoal: '#161616',
  darkGray: '#1F1F1F',
  gold: '#C9A962',
  goldLight: '#E8D5A3',
  bronze: '#CD7F32',
  cream: '#F5F0E6',
  white: '#FFFFFF',
};

export const Homepage6: React.FC = () => {
  return (
    <div style={{ background: colors.black }}>
      {/* Navigation */}
      <nav className="px-12 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-sm flex items-center justify-center"
              style={{ border: `1px solid ${colors.gold}` }}
            >
              <span style={{ color: colors.gold, fontFamily: tokens.fonts.serif }} className="text-xl">S</span>
            </div>
            <span className="text-lg tracking-[0.2em] text-white/80">SCRIBENGINE</span>
          </div>

          <div className="flex items-center gap-12">
            {['Services', 'Pricing', 'Process', 'About'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm tracking-wider text-white/50 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
            <button
              className="px-6 py-3 text-sm tracking-wider transition-all hover:bg-white/10"
              style={{ border: `1px solid ${colors.gold}`, color: colors.gold }}
            >
              BEGIN
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-[90vh] flex items-center px-12 relative overflow-hidden">
        {/* Subtle gold gradient */}
        <div
          className="absolute top-0 right-0 w-1/2 h-full opacity-10"
          style={{
            background: `radial-gradient(ellipse at 70% 30%, ${colors.gold}, transparent 60%)`,
          }}
        />

        <div className="max-w-7xl mx-auto w-full relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-16 h-px" style={{ background: colors.gold }} />
              <span className="text-xs tracking-[0.4em]" style={{ color: colors.gold }}>
                PREMIUM CONTENT CREATION
              </span>
            </div>

            <h1
              className="text-8xl font-light text-white leading-[1.0] mb-8"
              style={{ fontFamily: tokens.fonts.serif }}
            >
              The Art of
              <br />
              <em style={{ color: colors.gold }}>Written Excellence</em>
            </h1>

            <p
              className="text-xl text-white/50 max-w-xl mb-12 leading-relaxed"
              style={{ fontFamily: tokens.fonts.serif }}
            >
              Where artificial intelligence meets human artistry.
              Content crafted with precision, delivered with care.
            </p>

            <div className="flex items-center gap-8">
              <button
                className="px-10 py-4 text-sm tracking-wider transition-all hover:bg-opacity-90"
                style={{ background: colors.gold, color: colors.black }}
              >
                DISCOVER MORE
              </button>
              <button className="flex items-center gap-4 text-white/50 hover:text-white transition-colors">
                <span
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ border: `1px solid ${colors.gold}` }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={colors.gold}>
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </span>
                <span className="text-sm tracking-wider">VIEW SHOWCASE</span>
              </button>
            </div>
          </div>

          {/* Decorative line */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-64"
            style={{ background: `linear-gradient(180deg, transparent, ${colors.gold}30, transparent)` }}
          />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 px-12" style={{ background: colors.charcoal }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-4 gap-12">
            {[
              { number: '50,000+', label: 'Words Generated Daily' },
              { number: '94%', label: 'Average Quality Score' },
              { number: '18', label: 'Style Dimensions' },
              { number: '3', label: 'Quality Tiers' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p
                  className="text-4xl font-light mb-2"
                  style={{ color: colors.gold, fontFamily: tokens.fonts.serif }}
                >
                  {stat.number}
                </p>
                <p className="text-xs tracking-wider text-white/40">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-32 px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-20">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-px" style={{ background: colors.gold }} />
                <span className="text-xs tracking-[0.3em]" style={{ color: colors.gold }}>OUR SERVICES</span>
              </div>
              <h2
                className="text-5xl font-light text-white"
                style={{ fontFamily: tokens.fonts.serif }}
              >
                Crafted with
                <br />
                <em style={{ color: colors.gold }}>precision</em>
              </h2>
            </div>
            <p className="text-white/40 max-w-md text-right leading-relaxed">
              From strategic thought leadership to engaging social content,
              each piece is meticulously crafted to elevate your brand.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {[
              {
                title: 'Blog & Articles',
                desc: 'Long-form content with SEO optimization and style matching',
                price: 'From $8',
                features: ['1,000-7,000 words', 'SEO optimized', 'Voice matched'],
              },
              {
                title: 'Social Media',
                desc: '30 platform-optimized posts with hashtag research',
                price: 'From $39',
                features: ['Multi-platform', 'Hashtag strategy', 'Engagement focused'],
              },
              {
                title: 'Email Campaigns',
                desc: '5-email sequences designed to convert',
                price: 'From $29',
                features: ['Conversion focused', 'A/B subjects', 'Personalized'],
              },
            ].map((service, i) => (
              <div
                key={i}
                className="p-10 rounded-sm transition-all duration-500 group hover:bg-white/5"
                style={{ border: `1px solid ${colors.darkGray}` }}
              >
                <h3
                  className="text-2xl mb-4 group-hover:text-white transition-colors"
                  style={{ fontFamily: tokens.fonts.serif, color: colors.gold }}
                >
                  {service.title}
                </h3>
                <p className="text-white/40 mb-8 leading-relaxed">{service.desc}</p>

                <ul className="space-y-3 mb-8">
                  {service.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-white/60">
                      <div className="w-1 h-1 rounded-full" style={{ background: colors.gold }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-6" style={{ borderTop: `1px solid ${colors.darkGray}` }}>
                  <span className="text-2xl text-white" style={{ fontFamily: tokens.fonts.serif }}>
                    {service.price}
                  </span>
                  <span
                    className="text-xs tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: colors.gold }}
                  >
                    LEARN MORE →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Tiers - Horizontal Showcase */}
      <section className="py-32 px-12 relative" style={{ background: colors.charcoal }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-px" style={{ background: colors.gold }} />
              <span className="text-xs tracking-[0.3em]" style={{ color: colors.gold }}>QUALITY TIERS</span>
              <div className="w-12 h-px" style={{ background: colors.gold }} />
            </div>
            <h2
              className="text-5xl font-light text-white mb-6"
              style={{ fontFamily: tokens.fonts.serif }}
            >
              Choose Your Level of <em style={{ color: colors.gold }}>Excellence</em>
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-12">
            {[
              {
                tier: 'Essential',
                price: '$3-17',
                desc: 'Efficient AI-powered content for quick turnaround',
                features: ['GPT-4 generation', 'Basic style matching', '24-hour delivery'],
              },
              {
                tier: 'Signature',
                price: '$6-30',
                desc: 'Multi-model blend for superior results',
                features: ['Multi-AI collaboration', 'Advanced style learning', '12-hour delivery'],
                featured: true,
              },
              {
                tier: 'Prestige',
                price: '$12-65',
                desc: 'Uncompromising quality with human-level review',
                features: ['Claude Opus quality', 'Deep research', 'Quality guarantee'],
              },
            ].map((tier, i) => (
              <div
                key={i}
                className={`relative p-10 rounded-sm ${tier.featured ? 'ring-1' : ''}`}
                style={{
                  background: tier.featured ? `linear-gradient(180deg, ${colors.darkGray}, ${colors.charcoal})` : 'transparent',
                  border: `1px solid ${tier.featured ? colors.gold : colors.darkGray}`,
                }}
              >
                {tier.featured && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1 text-xs tracking-wider"
                    style={{ background: colors.gold, color: colors.black }}
                  >
                    RECOMMENDED
                  </div>
                )}

                <p className="text-xs tracking-wider text-white/40 mb-4">
                  {i === 0 ? 'TIER I' : i === 1 ? 'TIER II' : 'TIER III'}
                </p>

                <h3
                  className="text-3xl mb-2"
                  style={{ fontFamily: tokens.fonts.serif, color: tier.featured ? colors.gold : 'white' }}
                >
                  {tier.tier}
                </h3>

                <p className="text-white/40 text-sm mb-8">{tier.desc}</p>

                <p
                  className="text-4xl mb-8"
                  style={{ fontFamily: tokens.fonts.serif, color: tier.featured ? colors.gold : 'white' }}
                >
                  {tier.price}
                </p>

                <ul className="space-y-4 mb-10">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-white/60">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.gold} strokeWidth="1.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-4 text-sm tracking-wider transition-all ${
                    tier.featured ? 'hover:bg-white/90' : 'hover:bg-white/10'
                  }`}
                  style={{
                    background: tier.featured ? colors.gold : 'transparent',
                    color: tier.featured ? colors.black : colors.gold,
                    border: `1px solid ${colors.gold}`,
                  }}
                >
                  SELECT {tier.tier.toUpperCase()}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Style Customization */}
      <section className="py-32 px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-20 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-px" style={{ background: colors.gold }} />
                <span className="text-xs tracking-[0.3em]" style={{ color: colors.gold }}>
                  CUSTOMIZATION
                </span>
              </div>

              <h2
                className="text-5xl font-light text-white mb-8"
                style={{ fontFamily: tokens.fonts.serif }}
              >
                18 Dimensions of
                <br />
                <em style={{ color: colors.gold }}>Voice Control</em>
              </h2>

              <p className="text-white/40 leading-relaxed mb-10">
                Every aspect of your content can be precisely tuned—from the subtle
                nuances of tone to the rhythm of your sentences. Your voice, amplified.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  'Tone of Voice', 'Writing Style', 'Audience Level', 'Content Depth',
                  'Brand Personality', 'Emotional Appeal', 'Hook Style', 'CTA Approach',
                ].map((dim, i) => (
                  <div
                    key={i}
                    className="px-4 py-3 text-sm text-white/60"
                    style={{ border: `1px solid ${colors.darkGray}` }}
                  >
                    {dim}
                  </div>
                ))}
              </div>
            </div>

            {/* Visualization */}
            <div
              className="p-10 rounded-sm"
              style={{ border: `1px solid ${colors.darkGray}` }}
            >
              <p className="text-xs tracking-wider text-white/40 mb-8">STYLE PROFILE</p>

              {[
                { label: 'Formality', value: 70 },
                { label: 'Energy', value: 85 },
                { label: 'Depth', value: 60 },
                { label: 'Creativity', value: 75 },
              ].map((slider, i) => (
                <div key={i} className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/50">{slider.label}</span>
                    <span style={{ color: colors.gold }}>{slider.value}%</span>
                  </div>
                  <div className="h-1" style={{ background: colors.darkGray }}>
                    <div
                      className="h-full"
                      style={{ width: `${slider.value}%`, background: colors.gold }}
                    />
                  </div>
                </div>
              ))}

              <div
                className="mt-10 p-6"
                style={{ background: colors.darkGray }}
              >
                <p className="text-xs tracking-wider text-white/40 mb-4">OUTPUT PREVIEW</p>
                <p
                  className="text-white/80 leading-relaxed"
                  style={{ fontFamily: tokens.fonts.serif }}
                >
                  "The most compelling content doesn't announce its sophistication—
                  it simply demonstrates it. Every word carries intention."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-12 relative overflow-hidden" style={{ background: colors.charcoal }}>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(ellipse at center, ${colors.gold}20, transparent 60%)`,
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative">
          <h2
            className="text-6xl font-light text-white mb-8"
            style={{ fontFamily: tokens.fonts.serif }}
          >
            Begin Your Journey to
            <br />
            <em style={{ color: colors.gold }}>Content Excellence</em>
          </h2>
          <p className="text-white/40 text-xl mb-12">
            Experience the difference that precision craftsmanship makes.
          </p>
          <button
            className="px-12 py-5 text-sm tracking-wider transition-all hover:bg-opacity-90"
            style={{ background: colors.gold, color: colors.black }}
          >
            START YOUR JOURNEY
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-12" style={{ borderTop: `1px solid ${colors.darkGray}` }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-sm flex items-center justify-center"
              style={{ border: `1px solid ${colors.gold}` }}
            >
              <span style={{ color: colors.gold, fontFamily: tokens.fonts.serif }}>S</span>
            </div>
            <span className="text-sm tracking-[0.15em] text-white/40">SCRIBENGINE</span>
          </div>
          <p className="text-xs text-white/30">© 2025 Scribengine. Crafting Excellence.</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage6;
