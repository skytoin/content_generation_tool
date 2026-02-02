'use client';

/**
 * HOMEPAGE 3: IMMERSIVE SCROLL
 *
 * Design: Full-screen sections with dramatic transitions.
 * Storytelling approach - each section reveals the next chapter.
 * Parallax effects, sticky elements, cinematic feel.
 */

import React from 'react';
import { tokens } from '../design-tokens';

const colors = {
  cream: '#FAF7F2',
  charcoal: '#1C1C1E',
  terracotta: '#C75D3A',
  sage: '#7D8C6E',
  gold: '#D4A855',
  lavender: '#9D8EC7',
  rose: '#E8B4B8',
};

export const Homepage3: React.FC = () => {
  return (
    <div>
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 mix-blend-difference">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold text-white" style={{ fontFamily: tokens.fonts.serif }}>
            Scribengine
          </span>
          <div className="flex items-center gap-8">
            {['Work', 'Pricing', 'About'].map((item) => (
              <a key={item} href="#" className="text-sm text-white hover:opacity-70 transition-opacity">
                {item}
              </a>
            ))}
            <button className="px-5 py-2 rounded-full bg-white text-black text-sm font-medium">
              Start Creating
            </button>
          </div>
        </div>
      </nav>

      {/* Section 1: Hero - Full Screen Dramatic */}
      <section
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: colors.charcoal }}
      >
        {/* Animated gradient background */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(ellipse at 20% 80%, ${colors.terracotta}40 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, ${colors.lavender}40 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, ${colors.gold}20 0%, transparent 70%)
            `,
          }}
        />

        <div className="relative z-10 text-center px-8">
          <p
            className="text-sm uppercase tracking-[0.4em] mb-8 text-white/60"
          >
            The Future of Content Creation
          </p>

          <h1
            className="text-[8rem] font-light text-white leading-[0.9] mb-8"
            style={{ fontFamily: tokens.fonts.serif }}
          >
            Words
            <br />
            <em className="font-normal" style={{ color: colors.terracotta }}>matter.</em>
          </h1>

          <p
            className="text-2xl text-white/70 max-w-2xl mx-auto mb-12"
            style={{ fontFamily: tokens.fonts.serif }}
          >
            AI-powered content that captures your voice
            and moves your audience.
          </p>

          <div className="flex items-center justify-center gap-6">
            <button
              className="px-10 py-5 rounded-full text-lg font-medium transition-all hover:scale-105"
              style={{ background: colors.terracotta, color: 'white' }}
            >
              Begin Your Story
            </button>
            <button className="px-10 py-5 rounded-full text-lg font-medium border border-white/30 text-white hover:bg-white/10 transition-all">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-xs text-white/40 uppercase tracking-widest">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* Section 2: The Problem - Cream Background */}
      <section
        className="min-h-screen flex items-center py-32 px-8"
        style={{ background: colors.cream }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 gap-20 items-center">
          <div>
            <p
              className="text-xs uppercase tracking-[0.3em] mb-6"
              style={{ color: colors.terracotta }}
            >
              The Challenge
            </p>
            <h2
              className="text-6xl font-light leading-tight mb-8"
              style={{ fontFamily: tokens.fonts.serif, color: colors.charcoal }}
            >
              Great content
              <br />
              takes <em>time.</em>
            </h2>
            <p
              className="text-xl leading-relaxed mb-8"
              style={{ color: '#666', fontFamily: tokens.fonts.serif }}
            >
              Hours of research. Days of writing. Endless revisions.
              And still, something feels... generic.
            </p>
            <p
              className="text-xl leading-relaxed"
              style={{ color: '#666', fontFamily: tokens.fonts.serif }}
            >
              You need content that sounds like <em>you</em>.
              Content that connects. Content that converts.
            </p>
          </div>

          {/* Visual element */}
          <div className="relative">
            <div
              className="aspect-square rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${colors.terracotta}10, ${colors.lavender}10)`,
              }}
            >
              <div
                className="w-3/4 h-3/4 rounded-full flex items-center justify-center"
                style={{ background: 'white', boxShadow: '0 40px 80px rgba(0,0,0,0.1)' }}
              >
                <div className="text-center">
                  <p className="text-7xl font-bold" style={{ color: colors.terracotta }}>47</p>
                  <p className="text-sm text-gray-500 mt-2">hours saved per month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: The Solution - Dark */}
      <section
        className="min-h-screen flex items-center py-32 px-8"
        style={{ background: colors.charcoal }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p
              className="text-xs uppercase tracking-[0.3em] mb-6"
              style={{ color: colors.gold }}
            >
              The Solution
            </p>
            <h2
              className="text-6xl font-light text-white mb-8"
              style={{ fontFamily: tokens.fonts.serif }}
            >
              Enter <em style={{ color: colors.gold }}>Scribengine</em>
            </h2>
            <p
              className="text-xl text-white/60 max-w-2xl mx-auto"
              style={{ fontFamily: tokens.fonts.serif }}
            >
              AI that doesn't just write—it learns your voice,
              understands your audience, and crafts content that resonates.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-3 gap-8">
            {[
              {
                icon: '✍️',
                title: 'Style Learning',
                desc: '18 customizable dimensions to capture your unique voice',
                color: colors.terracotta,
              },
              {
                icon: '🧠',
                title: 'Multi-Model AI',
                desc: 'GPT-4, Claude, and more working together for best results',
                color: colors.lavender,
              },
              {
                icon: '⚡',
                title: 'Instant Delivery',
                desc: 'From brief to polished content in minutes, not days',
                color: colors.gold,
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-10 rounded-3xl border border-white/10 hover:border-white/20 transition-all group"
              >
                <span className="text-5xl mb-6 block">{feature.icon}</span>
                <h3
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: tokens.fonts.serif }}
                >
                  {feature.title}
                </h3>
                <p className="text-white/50 leading-relaxed">
                  {feature.desc}
                </p>
                <div
                  className="w-full h-1 mt-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: feature.color }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Services Showcase */}
      <section className="py-32 px-8" style={{ background: colors.cream }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <p
              className="text-xs uppercase tracking-[0.3em] mb-6"
              style={{ color: colors.sage }}
            >
              Our Services
            </p>
            <h2
              className="text-5xl font-light"
              style={{ fontFamily: tokens.fonts.serif, color: colors.charcoal }}
            >
              Content for <em>every</em> moment
            </h2>
          </div>

          {/* Horizontal scroll cards */}
          <div className="flex gap-6 overflow-x-auto pb-8 -mx-8 px-8 snap-x">
            {[
              {
                title: 'Blog Posts',
                desc: 'SEO-optimized long-form content',
                range: '1,000 - 7,000 words',
                price: 'From $8',
                bg: colors.terracotta,
              },
              {
                title: 'Social Packs',
                desc: '30 posts across all platforms',
                range: 'LinkedIn, Twitter, Instagram',
                price: 'From $39',
                bg: colors.lavender,
              },
              {
                title: 'Email Sequences',
                desc: 'Conversion-focused campaigns',
                range: '5-email series',
                price: 'From $29',
                bg: colors.sage,
              },
              {
                title: 'SEO Audits',
                desc: 'Keyword & competitor analysis',
                range: 'Full report',
                price: '$149',
                bg: colors.gold,
              },
              {
                title: 'Monthly Bundle',
                desc: 'Everything you need',
                range: '4 posts + 30 social + emails',
                price: '$249',
                bg: colors.rose,
              },
            ].map((service, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-80 rounded-3xl p-8 text-white snap-start transition-transform hover:scale-105"
                style={{ background: service.bg }}
              >
                <h3
                  className="text-2xl mb-4"
                  style={{ fontFamily: tokens.fonts.serif }}
                >
                  {service.title}
                </h3>
                <p className="text-white/80 mb-6">{service.desc}</p>
                <p className="text-sm text-white/60 mb-8">{service.range}</p>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold">{service.price}</span>
                  <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Quality Tiers */}
      <section
        className="min-h-screen flex items-center py-32 px-8"
        style={{ background: 'linear-gradient(180deg, #1C1C1E 0%, #2C2C2E 100%)' }}
      >
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2
              className="text-5xl font-light text-white mb-4"
              style={{ fontFamily: tokens.fonts.serif }}
            >
              Three tiers of <em style={{ color: colors.gold }}>excellence</em>
            </h2>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />

            <div className="grid grid-cols-3 gap-12">
              {[
                {
                  tier: 'Budget',
                  emoji: '⚡',
                  price: '$3-17',
                  tagline: 'Fast & Efficient',
                  features: ['Single AI pass', 'Basic matching', '24h delivery'],
                },
                {
                  tier: 'Standard',
                  emoji: '✨',
                  price: '$6-30',
                  tagline: 'Best Value',
                  features: ['Multi-model AI', 'Style learning', '12h delivery'],
                  featured: true,
                },
                {
                  tier: 'Premium',
                  emoji: '👑',
                  price: '$12-65',
                  tagline: 'Uncompromising',
                  features: ['Claude Opus', 'Deep research', 'Guaranteed'],
                },
              ].map((tier, i) => (
                <div key={i} className="relative">
                  {/* Circle node */}
                  <div
                    className={`w-16 h-16 rounded-full mx-auto mb-8 flex items-center justify-center text-2xl ${
                      tier.featured ? 'ring-4 ring-offset-4 ring-offset-[#1C1C1E]' : ''
                    }`}
                    style={{
                      background: tier.featured ? colors.gold : 'white',
                    }}
                  >
                    {tier.emoji}
                  </div>

                  <div className={`text-center ${tier.featured ? 'transform scale-110' : ''}`}>
                    <p className="text-sm text-white/50 uppercase tracking-wider mb-2">
                      {tier.tagline}
                    </p>
                    <h3
                      className="text-3xl text-white mb-2"
                      style={{ fontFamily: tokens.fonts.serif }}
                    >
                      {tier.tier}
                    </h3>
                    <p
                      className="text-4xl font-bold mb-6"
                      style={{ color: tier.featured ? colors.gold : 'white' }}
                    >
                      {tier.price}
                    </p>

                    <ul className="space-y-3">
                      {tier.features.map((f, j) => (
                        <li key={j} className="text-white/60 text-sm">{f}</li>
                      ))}
                    </ul>

                    <button
                      className={`mt-8 px-8 py-3 rounded-full font-medium transition-all hover:scale-105 ${
                        tier.featured
                          ? 'bg-white text-black'
                          : 'border border-white/30 text-white hover:bg-white/10'
                      }`}
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Style Customization */}
      <section className="py-32 px-8" style={{ background: colors.cream }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-20 items-center">
            {/* Visual */}
            <div className="relative">
              <div
                className="aspect-[4/5] rounded-3xl overflow-hidden"
                style={{ background: 'white', boxShadow: '0 40px 80px rgba(0,0,0,0.1)' }}
              >
                <div className="p-8 h-full flex flex-col">
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-4">Style Preview</p>

                  {/* Sliders visualization */}
                  {[
                    { label: 'Formality', value: 70, color: colors.terracotta },
                    { label: 'Energy', value: 85, color: colors.lavender },
                    { label: 'Depth', value: 60, color: colors.sage },
                    { label: 'Humor', value: 40, color: colors.gold },
                  ].map((slider, i) => (
                    <div key={i} className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">{slider.label}</span>
                        <span style={{ color: slider.color }}>{slider.value}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${slider.value}%`, background: slider.color }}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="flex-1" />

                  {/* Sample text */}
                  <div className="p-6 rounded-2xl" style={{ background: colors.cream }}>
                    <p
                      className="text-lg leading-relaxed"
                      style={{ fontFamily: tokens.fonts.serif, color: colors.charcoal }}
                    >
                      "Here's what makes strategic patience powerful—when you stop chasing
                      quick wins, something remarkable happens..."
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div
                className="absolute -bottom-4 -right-4 px-6 py-3 rounded-full text-sm font-medium"
                style={{ background: colors.terracotta, color: 'white', boxShadow: '0 10px 30px rgba(199,93,58,0.3)' }}
              >
                Your unique voice
              </div>
            </div>

            {/* Text */}
            <div>
              <p
                className="text-xs uppercase tracking-[0.3em] mb-6"
                style={{ color: colors.terracotta }}
              >
                18 Style Dimensions
              </p>
              <h2
                className="text-5xl font-light leading-tight mb-8"
                style={{ fontFamily: tokens.fonts.serif, color: colors.charcoal }}
              >
                Customize
                <br />
                <em>everything</em>
              </h2>
              <p
                className="text-xl leading-relaxed mb-8"
                style={{ color: '#666', fontFamily: tokens.fonts.serif }}
              >
                Tone, rhythm, formality, humor, emotional appeal, formatting—
                adjust every aspect until it sounds exactly like you.
              </p>

              <div className="flex flex-wrap gap-3">
                {[
                  'Tone of Voice', 'Writing Style', 'Audience Level', 'Content Depth',
                  'Brand Personality', 'Emotional Appeal', 'CTA Approach', '+ 11 more'
                ].map((dim, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-full text-sm"
                    style={{
                      background: i === 7 ? colors.terracotta : 'white',
                      color: i === 7 ? 'white' : colors.charcoal,
                      border: i === 7 ? 'none' : '1px solid #e5e5e5',
                    }}
                  >
                    {dim}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="min-h-[70vh] flex items-center justify-center relative overflow-hidden"
        style={{ background: colors.charcoal }}
      >
        {/* Gradient orbs */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl opacity-30"
          style={{ background: `radial-gradient(circle, ${colors.terracotta}, ${colors.lavender}, transparent)` }}
        />

        <div className="relative z-10 text-center px-8">
          <h2
            className="text-7xl font-light text-white mb-8"
            style={{ fontFamily: tokens.fonts.serif }}
          >
            Your story
            <br />
            <em style={{ color: colors.gold }}>starts here.</em>
          </h2>
          <button
            className="px-12 py-6 rounded-full text-xl font-medium transition-all hover:scale-105"
            style={{ background: colors.terracotta, color: 'white' }}
          >
            Create Your First Piece →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8" style={{ background: colors.charcoal }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between border-t border-white/10 pt-12">
          <span className="text-white font-bold" style={{ fontFamily: tokens.fonts.serif }}>
            Scribengine
          </span>
          <p className="text-white/40 text-sm">© 2025 Scribengine. Crafting words that matter.</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage3;
