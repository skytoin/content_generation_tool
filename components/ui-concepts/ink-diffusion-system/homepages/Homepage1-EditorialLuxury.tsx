'use client';

/**
 * HOMEPAGE 1: EDITORIAL LUXURY
 *
 * Design: Magazine-style editorial layout with dramatic typography,
 * generous whitespace, and sophisticated visual hierarchy.
 * Think Vogue meets tech startup.
 */

import React from 'react';
import { tokens } from '../design-tokens';

// Extended color palette for more vibrancy
const colors = {
  ...tokens.colors,
  gold: '#C9A962',
  goldLight: '#E8DCC4',
  navy: '#1a2744',
  coral: '#E07A5F',
  mint: '#83C5BE',
};

export const Homepage1: React.FC = () => {
  return (
    <div style={{ background: tokens.colors.paper.cream }}>
      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-8 py-6"
        style={{ background: 'rgba(250, 249, 247, 0.9)', backdropFilter: 'blur(20px)' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: tokens.colors.ink[700] }}
            >
              <span className="text-white font-bold" style={{ fontFamily: tokens.fonts.serif }}>S</span>
            </div>
            <span className="text-xl font-medium" style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.primary }}>
              Scribengine
            </span>
          </div>

          <div className="flex items-center gap-8">
            {['Services', 'Pricing', 'How it Works', 'Examples'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm hover:opacity-70 transition-opacity"
                style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}
              >
                {item}
              </a>
            ))}
            <button
              className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
              style={{ background: tokens.colors.ink[700], color: '#fff' }}
            >
              Start Creating
            </button>
          </div>
        </div>
      </nav>

      {/* Hero - Magazine Cover Style */}
      <section className="min-h-screen pt-32 pb-20 px-8 relative overflow-hidden">
        {/* Large decorative letter */}
        <div
          className="absolute -right-20 top-20 text-[40rem] font-bold leading-none pointer-events-none select-none"
          style={{
            fontFamily: tokens.fonts.serif,
            color: tokens.colors.ink[100],
            opacity: 0.5,
          }}
        >
          S
        </div>

        <div className="max-w-7xl mx-auto relative">
          {/* Issue number style */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-px" style={{ background: tokens.colors.ink[700] }} />
            <span
              className="text-xs uppercase tracking-[0.3em]"
              style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
            >
              The Future of Content
            </span>
          </div>

          {/* Main headline */}
          <h1
            className="text-8xl font-light leading-[0.9] mb-8 max-w-4xl"
            style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.primary }}
          >
            Words that
            <br />
            <span style={{ fontStyle: 'italic', color: tokens.colors.ink[700] }}>
              resonate.
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-2xl max-w-xl mb-12 leading-relaxed"
            style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.secondary }}
          >
            AI-powered content creation that captures your unique voice
            and turns it into compelling stories.
          </p>

          {/* CTA Group */}
          <div className="flex items-center gap-6">
            <button
              className="px-8 py-4 rounded-xl text-lg font-medium transition-all hover:scale-105"
              style={{
                background: tokens.colors.ink[700],
                color: '#fff',
                boxShadow: `0 20px 40px ${tokens.colors.ink[700]}30`,
              }}
            >
              Create Your First Piece
            </button>
            <button
              className="flex items-center gap-3 text-lg transition-all hover:gap-4"
              style={{ color: tokens.colors.text.secondary }}
            >
              <span className="w-12 h-12 rounded-full border-2 flex items-center justify-center" style={{ borderColor: tokens.colors.ink[300] }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill={tokens.colors.ink[700]}>
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </span>
              Watch the magic
            </button>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-16 mt-20 pt-12 border-t" style={{ borderColor: tokens.colors.paper.border }}>
            {[
              { number: '50K+', label: 'Words generated daily' },
              { number: '94%', label: 'Quality score average' },
              { number: '3min', label: 'Average delivery time' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-5xl font-light mb-2" style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.ink[700] }}>
                  {stat.number}
                </p>
                <p className="text-sm" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services - Editorial Grid */}
      <section className="py-32 px-8" style={{ background: tokens.colors.paper.white }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-8 mb-20">
            <div className="col-span-4">
              <p
                className="text-xs uppercase tracking-[0.3em] mb-4"
                style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
              >
                Our Services
              </p>
              <h2
                className="text-5xl font-light leading-tight"
                style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.primary }}
              >
                Content for
                <br />
                <em>every</em> channel
              </h2>
            </div>
            <div className="col-span-8 flex items-end">
              <p
                className="text-xl max-w-lg"
                style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.secondary }}
              >
                From long-form thought leadership to scroll-stopping social content,
                we craft words that work as hard as you do.
              </p>
            </div>
          </div>

          {/* Service cards - Magazine spread style */}
          <div className="grid grid-cols-3 gap-8">
            {[
              {
                number: '01',
                title: 'Blog Posts',
                description: 'Long-form articles with SEO optimization, style matching, and multi-model quality review.',
                price: 'From $8',
                color: tokens.colors.ink[700],
                features: ['1,000 - 7,000 words', 'SEO optimized', 'Your voice, amplified'],
              },
              {
                number: '02',
                title: 'Social Packs',
                description: '30 ready-to-post pieces across LinkedIn, Twitter, and Instagram with hashtag research.',
                price: 'From $39',
                color: colors.coral,
                features: ['30 posts included', 'Platform-optimized', 'Hashtag strategy'],
              },
              {
                number: '03',
                title: 'Email Sequences',
                description: '5-email campaigns with personalization hooks, subject line variants, and CTA optimization.',
                price: 'From $29',
                color: colors.mint,
                features: ['5-email sequence', 'A/B subject lines', 'Conversion focused'],
              },
            ].map((service, i) => (
              <div
                key={i}
                className="group relative p-8 rounded-2xl transition-all duration-500 hover:-translate-y-2"
                style={{
                  background: tokens.colors.paper.cream,
                  border: `1px solid ${tokens.colors.paper.border}`,
                }}
              >
                {/* Number */}
                <span
                  className="text-8xl font-bold absolute -top-4 -left-2 opacity-10"
                  style={{ fontFamily: tokens.fonts.serif, color: service.color }}
                >
                  {service.number}
                </span>

                <div className="relative">
                  <p className="text-sm mb-4" style={{ color: service.color, fontFamily: tokens.fonts.mono }}>
                    {service.price}
                  </p>
                  <h3
                    className="text-2xl mb-4"
                    style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.primary }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="text-sm mb-6 leading-relaxed"
                    style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                  >
                    {service.description}
                  </p>

                  <ul className="space-y-2 mb-8">
                    {service.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm" style={{ color: tokens.colors.text.secondary }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: service.color }} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    className="text-sm font-medium flex items-center gap-2 transition-all group-hover:gap-3"
                    style={{ color: service.color }}
                  >
                    Learn more
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Tiers - Dramatic Full Width */}
      <section className="py-32 px-8 relative overflow-hidden" style={{ background: colors.navy }}>
        {/* Decorative gradient orbs */}
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: tokens.colors.ink[500] }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: colors.gold }}
        />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-20">
            <p
              className="text-xs uppercase tracking-[0.3em] mb-4"
              style={{ color: colors.gold, fontFamily: tokens.fonts.sans }}
            >
              Quality Tiers
            </p>
            <h2
              className="text-5xl font-light mb-6"
              style={{ fontFamily: tokens.fonts.serif, color: '#fff' }}
            >
              Choose your level of <em>excellence</em>
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[
              {
                tier: 'Budget',
                tagline: 'Fast & Efficient',
                description: 'GPT-4 powered content with quick turnaround',
                price: '$3-17',
                features: ['Single AI pass', 'Basic style matching', '24h delivery'],
                color: tokens.colors.sage[400],
              },
              {
                tier: 'Standard',
                tagline: 'Most Popular',
                description: 'Multi-model blend for superior results',
                price: '$6-30',
                features: ['Multi-AI collaboration', 'Advanced style matching', '12h delivery'],
                color: colors.gold,
                featured: true,
              },
              {
                tier: 'Premium',
                tagline: 'Uncompromising Quality',
                description: 'Claude Opus with human-level review process',
                price: '$12-65',
                features: ['Best-in-class models', 'Deep research integration', 'Quality guarantee'],
                color: tokens.colors.ink[400],
              },
            ].map((tier, i) => (
              <div
                key={i}
                className={`relative p-8 rounded-2xl transition-all duration-500 ${tier.featured ? '-mt-4 mb-4' : ''}`}
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
                  className="text-3xl mb-2"
                  style={{ fontFamily: tokens.fonts.serif, color: tier.featured ? colors.navy : '#fff' }}
                >
                  {tier.tier}
                </h3>
                <p
                  className="text-sm mb-6"
                  style={{ color: tier.featured ? 'rgba(26,39,68,0.7)' : 'rgba(255,255,255,0.6)' }}
                >
                  {tier.description}
                </p>

                <p
                  className="text-4xl font-light mb-6"
                  style={{ fontFamily: tokens.fonts.serif, color: tier.featured ? colors.navy : '#fff' }}
                >
                  {tier.price}
                </p>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-3 text-sm"
                      style={{ color: tier.featured ? colors.navy : 'rgba(255,255,255,0.8)' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
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
        </div>
      </section>

      {/* Style Customization Preview */}
      <section className="py-32 px-8" style={{ background: tokens.colors.paper.white }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-20 items-center">
            <div>
              <p
                className="text-xs uppercase tracking-[0.3em] mb-4"
                style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
              >
                18 Style Dimensions
              </p>
              <h2
                className="text-5xl font-light mb-6 leading-tight"
                style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.primary }}
              >
                Your voice,
                <br />
                <em>precisely</em> tuned
              </h2>
              <p
                className="text-lg mb-8 leading-relaxed"
                style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.secondary }}
              >
                From tone and rhythm to emotional appeal and formatting preferences—
                customize every aspect of how your content sounds and feels.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  'Tone of Voice', 'Writing Style', 'Audience Level', 'Content Depth',
                  'Brand Personality', 'Emotional Appeal', 'Hook Style', 'CTA Approach',
                ].map((dim, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-3 px-4 rounded-lg"
                    style={{ background: tokens.colors.paper.cream }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ background: tokens.colors.ink[700] }} />
                    <span className="text-sm" style={{ color: tokens.colors.text.secondary }}>{dim}</span>
                  </div>
                ))}
              </div>

              <button
                className="mt-8 text-sm font-medium flex items-center gap-2"
                style={{ color: tokens.colors.ink[700] }}
              >
                Explore all 18 dimensions
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Visual representation */}
            <div className="relative">
              <div
                className="p-8 rounded-2xl"
                style={{ background: tokens.colors.paper.cream, border: `1px solid ${tokens.colors.paper.border}` }}
              >
                {/* Tone slider visualization */}
                <div className="mb-8">
                  <p className="text-sm mb-4" style={{ color: tokens.colors.text.muted }}>Tone</p>
                  <div className="relative h-2 rounded-full" style={{ background: `linear-gradient(90deg, ${tokens.colors.ink[200]}, ${tokens.colors.sage[300]})` }}>
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-4"
                      style={{ left: '60%', background: '#fff', borderColor: tokens.colors.ink[700], boxShadow: tokens.shadows.md }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs" style={{ color: tokens.colors.text.muted }}>
                    <span>Formal</span>
                    <span>Casual</span>
                  </div>
                </div>

                {/* Sample output */}
                <div
                  className="p-6 rounded-xl"
                  style={{ background: tokens.colors.paper.white }}
                >
                  <p className="text-xs uppercase tracking-wider mb-3" style={{ color: tokens.colors.ink[700] }}>
                    Preview
                  </p>
                  <p
                    className="text-lg leading-relaxed"
                    style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.primary }}
                  >
                    "Here's the thing about strategic patience—the data makes a compelling case.
                    When you resist the urge to chase quick wins, something interesting happens..."
                  </p>
                </div>
              </div>

              {/* Floating accent */}
              <div
                className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full blur-2xl opacity-30"
                style={{ background: colors.coral }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-8" style={{ background: tokens.colors.paper.cream }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p
              className="text-xs uppercase tracking-[0.3em] mb-4"
              style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
            >
              Simple Process
            </p>
            <h2
              className="text-5xl font-light"
              style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.primary }}
            >
              From idea to <em>impact</em>
            </h2>
          </div>

          <div className="grid grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Choose', desc: 'Select your content type and quality tier' },
              { step: '02', title: 'Customize', desc: 'Fine-tune tone, style, and audience settings' },
              { step: '03', title: 'Generate', desc: 'Watch as AI crafts your content in real-time' },
              { step: '04', title: 'Publish', desc: 'Export to your platform of choice' },
            ].map((item, i) => (
              <div key={i} className="relative">
                <p
                  className="text-7xl font-bold mb-4"
                  style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.ink[100] }}
                >
                  {item.step}
                </p>
                <h3
                  className="text-xl mb-2"
                  style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.primary }}
                >
                  {item.title}
                </h3>
                <p className="text-sm" style={{ color: tokens.colors.text.muted }}>
                  {item.desc}
                </p>
                {i < 3 && (
                  <div
                    className="absolute top-8 -right-4 w-8 h-px"
                    style={{ background: tokens.colors.ink[200] }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-8 relative overflow-hidden" style={{ background: tokens.colors.ink[700] }}>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative">
          <h2
            className="text-6xl font-light mb-6"
            style={{ fontFamily: tokens.fonts.serif, color: '#fff' }}
          >
            Ready to transform
            <br />
            your content?
          </h2>
          <p
            className="text-xl mb-12 opacity-80"
            style={{ fontFamily: tokens.fonts.serif, color: '#fff' }}
          >
            Join thousands of marketers who've discovered
            the power of AI-crafted content.
          </p>
          <button
            className="px-10 py-5 rounded-xl text-lg font-medium transition-all hover:scale-105"
            style={{
              background: '#fff',
              color: tokens.colors.ink[700],
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            }}
          >
            Start Creating Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8" style={{ background: tokens.colors.paper.white }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between pb-12 border-b" style={{ borderColor: tokens.colors.paper.border }}>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: tokens.colors.ink[700] }}
              >
                <span className="text-white font-bold" style={{ fontFamily: tokens.fonts.serif }}>S</span>
              </div>
              <span className="text-xl" style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.primary }}>
                Scribengine
              </span>
            </div>
            <p className="text-sm" style={{ color: tokens.colors.text.muted }}>
              © 2025 Scribengine. Crafting words that matter.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage1;
