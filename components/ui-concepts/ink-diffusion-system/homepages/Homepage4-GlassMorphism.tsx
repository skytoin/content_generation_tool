'use client';

/**
 * HOMEPAGE 4: GLASSMORPHISM PREMIUM
 *
 * Design: Modern glass effects with depth and layers.
 * Frosted glass cards, gradient backgrounds, subtle blur.
 * Think iOS meets luxury fintech.
 */

import React from 'react';
import { tokens } from '../design-tokens';

const colors = {
  gradientStart: '#667EEA',
  gradientEnd: '#764BA2',
  accent1: '#F093FB',
  accent2: '#F5576C',
  accent3: '#4FACFE',
  dark: '#0F0F23',
  light: '#FAFBFF',
};

export const Homepage4: React.FC = () => {
  return (
    <div className="min-h-screen" style={{ background: colors.light }}>
      {/* Navigation - Glass */}
      <nav
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-8 py-4 rounded-2xl"
        style={{
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.5)',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.1)',
        }}
      >
        <div className="flex items-center gap-12">
          <span className="text-xl font-bold" style={{ color: colors.dark }}>
            Scribengine
          </span>
          <div className="flex items-center gap-8">
            {['Services', 'Pricing', 'Examples'].map((item) => (
              <a key={item} href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                {item}
              </a>
            ))}
          </div>
          <button
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${colors.gradientStart}, ${colors.gradientEnd})` }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen pt-32 pb-20 px-8 relative overflow-hidden">
        {/* Gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 0%, ${colors.gradientStart}20 0%, transparent 50%),
              radial-gradient(ellipse at 70% 100%, ${colors.gradientEnd}20 0%, transparent 50%),
              radial-gradient(ellipse at 100% 50%, ${colors.accent1}15 0%, transparent 40%)
            `,
          }}
        />

        {/* Floating orbs */}
        <div
          className="absolute top-40 right-20 w-64 h-64 rounded-full blur-3xl opacity-60"
          style={{ background: `linear-gradient(135deg, ${colors.accent3}, ${colors.gradientStart})` }}
        />
        <div
          className="absolute bottom-40 left-20 w-80 h-80 rounded-full blur-3xl opacity-40"
          style={{ background: `linear-gradient(135deg, ${colors.accent1}, ${colors.accent2})` }}
        />

        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-2 gap-16 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
                style={{
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.5)',
                }}
              >
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: colors.accent2 }} />
                <span className="text-sm text-gray-600">AI-Powered Content Creation</span>
              </div>

              <h1
                className="text-7xl font-bold leading-[1.1] mb-8"
                style={{
                  background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.gradientStart} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Write better.
                <br />
                Write faster.
              </h1>

              <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
                Transform your content strategy with AI that learns your voice
                and delivers publication-ready content in minutes.
              </p>

              <div className="flex items-center gap-4">
                <button
                  className="px-8 py-4 rounded-2xl text-lg font-semibold text-white transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${colors.gradientStart}, ${colors.gradientEnd})`,
                    boxShadow: `0 20px 40px ${colors.gradientStart}40`,
                  }}
                >
                  Start Free Trial
                </button>
                <button
                  className="px-8 py-4 rounded-2xl text-lg font-semibold transition-all hover:scale-105"
                  style={{
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0,0,0,0.1)',
                  }}
                >
                  View Demo
                </button>
              </div>
            </div>

            {/* Glass card preview */}
            <div className="relative">
              <div
                className="rounded-3xl p-8 relative z-10"
                style={{
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.8)',
                  boxShadow: '0 32px 64px rgba(0,0,0,0.1)',
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: `${colors.gradientStart}20`, color: colors.gradientStart }}
                  >
                    Live Preview
                  </span>
                </div>

                {/* Content preview */}
                <div className="space-y-4 mb-8">
                  <div className="h-4 rounded-full bg-gray-200 w-3/4" />
                  <div className="h-4 rounded-full bg-gray-200 w-full" />
                  <div className="h-4 rounded-full bg-gray-200 w-5/6" />
                </div>

                <p className="text-lg text-gray-700 leading-relaxed mb-6" style={{ fontFamily: tokens.fonts.serif }}>
                  "The future of content marketing isn't about volume—it's about
                  <span style={{ color: colors.gradientStart }}> resonance</span>."
                </p>

                {/* Stats */}
                <div className="flex items-center gap-6 pt-6 border-t border-gray-200">
                  <div>
                    <p className="text-2xl font-bold" style={{ color: colors.gradientStart }}>2,450</p>
                    <p className="text-xs text-gray-500">words</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: colors.accent2 }}>94%</p>
                    <p className="text-xs text-gray-500">quality</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: colors.accent3 }}>3min</p>
                    <p className="text-xs text-gray-500">generated</p>
                  </div>
                </div>
              </div>

              {/* Background card */}
              <div
                className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl"
                style={{
                  background: `linear-gradient(135deg, ${colors.gradientStart}20, ${colors.gradientEnd}20)`,
                  transform: 'rotate(3deg)',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2
              className="text-5xl font-bold mb-6"
              style={{
                background: `linear-gradient(135deg, ${colors.dark}, ${colors.gradientStart})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Everything you need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              One platform for all your content needs—blog posts, social media,
              email campaigns, and more.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {[
              {
                icon: '📝',
                title: 'Blog Posts',
                desc: 'SEO-optimized long-form content from 1,000 to 7,000 words',
                price: 'From $8',
                gradient: `linear-gradient(135deg, ${colors.gradientStart}, ${colors.accent3})`,
              },
              {
                icon: '📱',
                title: 'Social Packs',
                desc: '30 platform-optimized posts with hashtag strategy',
                price: 'From $39',
                gradient: `linear-gradient(135deg, ${colors.accent1}, ${colors.accent2})`,
              },
              {
                icon: '✉️',
                title: 'Email Sequences',
                desc: '5-email conversion campaigns with personalization',
                price: 'From $29',
                gradient: `linear-gradient(135deg, ${colors.accent3}, ${colors.gradientEnd})`,
              },
              {
                icon: '📊',
                title: 'SEO Audits',
                desc: 'Comprehensive keyword and competitor analysis',
                price: '$149',
                gradient: `linear-gradient(135deg, ${colors.gradientEnd}, ${colors.accent1})`,
              },
              {
                icon: '🎯',
                title: 'Content Strategy',
                desc: 'AI-powered content planning and recommendations',
                price: 'From $49',
                gradient: `linear-gradient(135deg, ${colors.accent2}, ${colors.gradientStart})`,
              },
              {
                icon: '📦',
                title: 'Monthly Bundle',
                desc: '4 blog posts + 30 social + 1 email sequence',
                price: '$249',
                gradient: `linear-gradient(135deg, ${colors.gradientStart}, ${colors.gradientEnd})`,
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group"
                style={{
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.5)',
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 transition-transform group-hover:scale-110"
                  style={{ background: feature.gradient }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.desc}</p>
                <p
                  className="text-2xl font-bold"
                  style={{
                    background: feature.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {feature.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Tiers */}
      <section className="py-32 px-8 relative overflow-hidden" style={{ background: colors.dark }}>
        {/* Background gradient */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background: `
              radial-gradient(ellipse at 20% 50%, ${colors.gradientStart}30 0%, transparent 50%),
              radial-gradient(ellipse at 80% 50%, ${colors.gradientEnd}30 0%, transparent 50%)
            `,
          }}
        />

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              Choose your quality tier
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From quick drafts to premium publications—find the perfect fit for your needs.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {[
              {
                tier: 'Budget',
                price: '$3-17',
                desc: 'Fast, efficient AI-powered content',
                features: ['GPT-4 generation', 'Basic style matching', '24h delivery'],
                gradient: `linear-gradient(135deg, ${colors.accent3}, ${colors.gradientStart})`,
              },
              {
                tier: 'Standard',
                price: '$6-30',
                desc: 'Multi-model blend for superior quality',
                features: ['Multi-AI collaboration', 'Advanced customization', '12h delivery'],
                gradient: `linear-gradient(135deg, ${colors.gradientStart}, ${colors.gradientEnd})`,
                featured: true,
              },
              {
                tier: 'Premium',
                price: '$12-65',
                desc: 'Best-in-class with human-level review',
                features: ['Claude Opus quality', 'Deep research', 'Quality guarantee'],
                gradient: `linear-gradient(135deg, ${colors.accent1}, ${colors.accent2})`,
              },
            ].map((tier, i) => (
              <div
                key={i}
                className={`relative rounded-3xl p-8 ${tier.featured ? 'transform scale-105' : ''}`}
                style={{
                  background: tier.featured
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(20px)',
                  border: tier.featured
                    ? '2px solid rgba(255,255,255,0.3)'
                    : '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {tier.featured && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full text-xs font-bold text-white"
                    style={{ background: tier.gradient }}
                  >
                    MOST POPULAR
                  </div>
                )}

                <div
                  className="w-12 h-12 rounded-xl mb-6"
                  style={{ background: tier.gradient }}
                />

                <h3 className="text-2xl font-bold text-white mb-2">{tier.tier}</h3>
                <p className="text-gray-400 mb-6">{tier.desc}</p>

                <p
                  className="text-4xl font-bold mb-8"
                  style={{
                    background: tier.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {tier.price}
                </p>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-gray-300">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.accent3} strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  className="w-full py-4 rounded-xl font-semibold transition-all hover:scale-105"
                  style={{
                    background: tier.featured ? tier.gradient : 'rgba(255,255,255,0.1)',
                    color: 'white',
                  }}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Style Customization */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-20 items-center">
            <div>
              <h2
                className="text-5xl font-bold mb-6"
                style={{
                  background: `linear-gradient(135deg, ${colors.dark}, ${colors.gradientStart})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                18 dimensions
                <br />
                of customization
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Fine-tune every aspect of your content—from tone and formality
                to emotional appeal and formatting preferences.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  'Tone of Voice', 'Writing Style', 'Audience Level', 'Content Depth',
                  'Brand Personality', 'Emotional Appeal', 'Hook Style', 'CTA Approach',
                ].map((dim, i) => (
                  <div
                    key={i}
                    className="px-4 py-3 rounded-xl text-sm"
                    style={{
                      background: 'rgba(255,255,255,0.7)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(0,0,0,0.05)',
                    }}
                  >
                    {dim}
                  </div>
                ))}
              </div>

              <button
                className="mt-8 px-6 py-3 rounded-xl font-medium transition-all hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${colors.gradientStart}, ${colors.gradientEnd})`,
                  color: 'white',
                }}
              >
                Explore All 18 Dimensions →
              </button>
            </div>

            {/* Visual */}
            <div
              className="rounded-3xl p-8"
              style={{
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.5)',
                boxShadow: '0 32px 64px rgba(0,0,0,0.1)',
              }}
            >
              {/* Sliders */}
              {[
                { label: 'Formality', value: 65, color: colors.gradientStart },
                { label: 'Energy', value: 80, color: colors.accent2 },
                { label: 'Depth', value: 55, color: colors.accent3 },
                { label: 'Creativity', value: 70, color: colors.accent1 },
              ].map((slider, i) => (
                <div key={i} className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">{slider.label}</span>
                    <span style={{ color: slider.color }}>{slider.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${slider.value}%`, background: slider.color }}
                    />
                  </div>
                </div>
              ))}

              <div className="mt-8 p-6 rounded-2xl bg-gray-50">
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">Output Preview</p>
                <p className="text-gray-700 leading-relaxed" style={{ fontFamily: tokens.fonts.serif }}>
                  "Strategic patience isn't passive—it's the most active form of waiting.
                  It's knowing exactly when to move, and having the discipline not to."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-8 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${colors.gradientStart}, ${colors.gradientEnd})` }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-6xl font-bold text-white mb-6">
            Ready to transform
            <br />
            your content?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Start your free trial today. No credit card required.
          </p>
          <button
            className="px-12 py-5 rounded-2xl text-xl font-bold transition-all hover:scale-105"
            style={{
              background: 'white',
              color: colors.gradientStart,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            Start Creating Free →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span
            className="text-xl font-bold"
            style={{
              background: `linear-gradient(135deg, ${colors.gradientStart}, ${colors.gradientEnd})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Scribengine
          </span>
          <p className="text-gray-500 text-sm">© 2025 Scribengine. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage4;
