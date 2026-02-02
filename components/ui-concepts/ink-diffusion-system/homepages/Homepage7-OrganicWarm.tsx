'use client';

/**
 * HOMEPAGE 7: ORGANIC WARM
 *
 * Design: Warm, inviting, organic shapes. Nature-inspired
 * with the Premium-Blend palette. Rounded corners, soft
 * gradients, botanical accents. Welcoming and trustworthy.
 */

import React from 'react';
import { tokens } from '../design-tokens';

const colors = {
  cream: '#FAF7F2',
  warmWhite: '#FFFBF5',
  terracotta: '#C75D3A',
  terracottaLight: '#E8A08B',
  sage: '#7D8C6E',
  sageLight: '#B5C4A6',
  sand: '#E8DCC4',
  charcoal: '#2D2A26',
  brown: '#8B7355',
};

export const Homepage7: React.FC = () => {
  return (
    <div style={{ background: colors.cream }}>
      {/* Navigation */}
      <nav className="px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: colors.terracotta }}
            >
              <span className="text-white text-xl" style={{ fontFamily: tokens.fonts.serif }}>S</span>
            </div>
            <span
              className="text-xl"
              style={{ fontFamily: tokens.fonts.serif, color: colors.charcoal }}
            >
              Scribengine
            </span>
          </div>

          <div className="flex items-center gap-8">
            {['Services', 'Pricing', 'About', 'Examples'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm transition-colors hover:opacity-70"
                style={{ color: colors.brown }}
              >
                {item}
              </a>
            ))}
            <button
              className="px-6 py-3 rounded-full text-sm font-medium text-white transition-all hover:scale-105"
              style={{ background: colors.terracotta }}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-8 relative overflow-hidden">
        {/* Organic blob shapes */}
        <div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{ background: colors.terracottaLight }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-30"
          style={{ background: colors.sageLight }}
        />

        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-3xl mx-auto text-center">
            <div
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8"
              style={{ background: colors.sand }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: colors.sage }} />
              <span className="text-sm" style={{ color: colors.brown }}>AI-Powered Content Creation</span>
            </div>

            <h1
              className="text-7xl font-light leading-[1.1] mb-8"
              style={{ fontFamily: tokens.fonts.serif, color: colors.charcoal }}
            >
              Words that feel
              <br />
              <em style={{ color: colors.terracotta }}>authentically you</em>
            </h1>

            <p
              className="text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
              style={{ color: colors.brown, fontFamily: tokens.fonts.serif }}
            >
              Transform your ideas into compelling content with AI that learns
              your unique voice and brings your stories to life.
            </p>

            <div className="flex items-center justify-center gap-4">
              <button
                className="px-10 py-4 rounded-full text-lg font-medium text-white transition-all hover:scale-105"
                style={{
                  background: colors.terracotta,
                  boxShadow: `0 20px 40px ${colors.terracotta}30`,
                }}
              >
                Start Creating Free
              </button>
              <button
                className="px-10 py-4 rounded-full text-lg font-medium transition-all hover:scale-105"
                style={{
                  background: colors.warmWhite,
                  color: colors.charcoal,
                  border: `2px solid ${colors.sand}`,
                }}
              >
                See Examples
              </button>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-16 mt-20">
            {[
              { number: '50K+', label: 'Words daily' },
              { number: '94%', label: 'Quality score' },
              { number: '2,500+', label: 'Happy creators' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p
                  className="text-3xl font-light mb-1"
                  style={{ fontFamily: tokens.fonts.serif, color: colors.terracotta }}
                >
                  {stat.number}
                </p>
                <p className="text-sm" style={{ color: colors.brown }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services - Organic Cards */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-5xl font-light mb-4"
              style={{ fontFamily: tokens.fonts.serif, color: colors.charcoal }}
            >
              Content for <em style={{ color: colors.terracotta }}>every</em> need
            </h2>
            <p className="text-lg" style={{ color: colors.brown }}>
              From blogs to social media, we've got you covered
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {[
              {
                title: 'Blog Posts',
                desc: 'SEO-optimized articles that engage and convert',
                price: 'From $8',
                color: colors.terracotta,
                bgColor: colors.terracottaLight,
              },
              {
                title: 'Social Media',
                desc: '30 platform-ready posts with hashtag strategy',
                price: 'From $39',
                color: colors.sage,
                bgColor: colors.sageLight,
              },
              {
                title: 'Email Campaigns',
                desc: '5-email sequences designed to nurture and convert',
                price: 'From $29',
                color: colors.brown,
                bgColor: colors.sand,
              },
            ].map((service, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                style={{ background: colors.warmWhite }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: `${service.bgColor}50` }}
                >
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ background: service.color }}
                  />
                </div>

                <h3
                  className="text-2xl mb-3"
                  style={{ fontFamily: tokens.fonts.serif, color: colors.charcoal }}
                >
                  {service.title}
                </h3>
                <p className="mb-6 leading-relaxed" style={{ color: colors.brown }}>
                  {service.desc}
                </p>
                <p
                  className="text-2xl font-light"
                  style={{ fontFamily: tokens.fonts.serif, color: service.color }}
                >
                  {service.price}
                </p>
              </div>
            ))}
          </div>

          {/* Additional services row */}
          <div className="grid grid-cols-3 gap-8 mt-8">
            {[
              { title: 'SEO Audits', price: '$149' },
              { title: 'Content Strategy', price: 'From $49' },
              { title: 'Monthly Bundle', price: '$249' },
            ].map((service, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl flex items-center justify-between"
                style={{ background: colors.sand }}
              >
                <span style={{ fontFamily: tokens.fonts.serif, color: colors.charcoal }}>
                  {service.title}
                </span>
                <span style={{ color: colors.terracotta }}>{service.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Tiers */}
      <section className="py-24 px-8" style={{ background: colors.warmWhite }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-5xl font-light mb-4"
              style={{ fontFamily: tokens.fonts.serif, color: colors.charcoal }}
            >
              Choose your <em style={{ color: colors.terracotta }}>quality</em> tier
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {[
              {
                tier: 'Essentials',
                price: '$3-17',
                desc: 'Quick, efficient AI content',
                features: ['GPT-4 powered', 'Basic styling', '24h delivery'],
                color: colors.sage,
              },
              {
                tier: 'Professional',
                price: '$6-30',
                desc: 'Multi-model quality blend',
                features: ['Multi-AI blend', 'Style learning', '12h delivery'],
                color: colors.terracotta,
                featured: true,
              },
              {
                tier: 'Premium',
                price: '$12-65',
                desc: 'Best-in-class output',
                features: ['Claude Opus', 'Deep research', 'Guaranteed'],
                color: colors.brown,
              },
            ].map((tier, i) => (
              <div
                key={i}
                className={`p-8 rounded-3xl ${tier.featured ? '-mt-4 mb-4' : ''}`}
                style={{
                  background: tier.featured ? colors.terracotta : colors.cream,
                  border: tier.featured ? 'none' : `2px solid ${colors.sand}`,
                }}
              >
                {tier.featured && (
                  <div
                    className="inline-block px-4 py-1 rounded-full text-xs font-medium mb-6"
                    style={{ background: colors.terracottaLight, color: colors.charcoal }}
                  >
                    Most Popular
                  </div>
                )}

                <h3
                  className="text-2xl mb-2"
                  style={{
                    fontFamily: tokens.fonts.serif,
                    color: tier.featured ? 'white' : colors.charcoal,
                  }}
                >
                  {tier.tier}
                </h3>
                <p
                  className="text-sm mb-6"
                  style={{ color: tier.featured ? 'rgba(255,255,255,0.8)' : colors.brown }}
                >
                  {tier.desc}
                </p>

                <p
                  className="text-4xl font-light mb-8"
                  style={{
                    fontFamily: tokens.fonts.serif,
                    color: tier.featured ? 'white' : tier.color,
                  }}
                >
                  {tier.price}
                </p>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((f, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-3 text-sm"
                      style={{ color: tier.featured ? 'rgba(255,255,255,0.9)' : colors.brown }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={tier.featured ? 'white' : tier.color}
                        strokeWidth="2"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  className="w-full py-4 rounded-full font-medium transition-all hover:scale-105"
                  style={{
                    background: tier.featured ? 'white' : tier.color,
                    color: tier.featured ? colors.terracotta : 'white',
                  }}
                >
                  Choose {tier.tier}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Style Customization */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-16 items-center">
            <div>
              <h2
                className="text-5xl font-light mb-6 leading-tight"
                style={{ fontFamily: tokens.fonts.serif, color: colors.charcoal }}
              >
                Your voice,
                <br />
                <em style={{ color: colors.terracotta }}>perfectly tuned</em>
              </h2>
              <p
                className="text-lg mb-8 leading-relaxed"
                style={{ color: colors.brown, fontFamily: tokens.fonts.serif }}
              >
                18 customizable dimensions let you fine-tune every aspect of your
                content—from tone and formality to emotional appeal and rhythm.
              </p>

              <div className="flex flex-wrap gap-3">
                {[
                  'Tone', 'Style', 'Depth', 'Energy', 'Formality',
                  'Humor', 'Emotion', 'CTA Style',
                ].map((dim, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-full text-sm"
                    style={{
                      background: i === 0 ? colors.terracotta : colors.sand,
                      color: i === 0 ? 'white' : colors.charcoal,
                    }}
                  >
                    {dim}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive preview */}
            <div
              className="p-8 rounded-3xl"
              style={{ background: colors.warmWhite, border: `2px solid ${colors.sand}` }}
            >
              {[
                { label: 'Warmth', value: 75, color: colors.terracotta },
                { label: 'Energy', value: 60, color: colors.sage },
                { label: 'Depth', value: 85, color: colors.brown },
              ].map((slider, i) => (
                <div key={i} className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span style={{ color: colors.brown }}>{slider.label}</span>
                    <span style={{ color: slider.color }}>{slider.value}%</span>
                  </div>
                  <div className="h-3 rounded-full" style={{ background: colors.sand }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${slider.value}%`, background: slider.color }}
                    />
                  </div>
                </div>
              ))}

              <div
                className="mt-8 p-6 rounded-2xl"
                style={{ background: colors.cream }}
              >
                <p className="text-xs uppercase tracking-wider mb-3" style={{ color: colors.brown }}>
                  Preview
                </p>
                <p
                  className="text-lg leading-relaxed"
                  style={{ fontFamily: tokens.fonts.serif, color: colors.charcoal }}
                >
                  "The best ideas often come when we least expect them—in the quiet
                  moments between meetings, during a morning walk, or late at night..."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-8" style={{ background: colors.warmWhite }}>
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-5xl font-light text-center mb-16"
            style={{ fontFamily: tokens.fonts.serif, color: colors.charcoal }}
          >
            Simple as <em style={{ color: colors.terracotta }}>1-2-3-4</em>
          </h2>

          <div className="grid grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Choose', desc: 'Pick your content type', color: colors.terracotta },
              { step: '2', title: 'Customize', desc: 'Set your preferences', color: colors.sage },
              { step: '3', title: 'Generate', desc: 'Watch AI create', color: colors.brown },
              { step: '4', title: 'Publish', desc: 'Export & share', color: colors.terracotta },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-light"
                  style={{ background: item.color, fontFamily: tokens.fonts.serif }}
                >
                  {item.step}
                </div>
                <h3
                  className="text-xl mb-2"
                  style={{ fontFamily: tokens.fonts.serif, color: colors.charcoal }}
                >
                  {item.title}
                </h3>
                <p style={{ color: colors.brown }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-8 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${colors.terracotta}, ${colors.sage})` }}
        />

        <div className="max-w-4xl mx-auto text-center relative">
          <h2
            className="text-6xl font-light text-white mb-8"
            style={{ fontFamily: tokens.fonts.serif }}
          >
            Ready to find
            <br />
            your voice?
          </h2>
          <p className="text-xl text-white/80 mb-12">
            Start creating content that truly sounds like you.
          </p>
          <button
            className="px-12 py-5 rounded-full text-lg font-medium transition-all hover:scale-105"
            style={{ background: 'white', color: colors.terracotta }}
          >
            Start Your Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8" style={{ borderTop: `1px solid ${colors.sand}` }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: colors.terracotta }}
            >
              <span className="text-white" style={{ fontFamily: tokens.fonts.serif }}>S</span>
            </div>
            <span style={{ fontFamily: tokens.fonts.serif, color: colors.charcoal }}>
              Scribengine
            </span>
          </div>
          <p style={{ color: colors.brown }}>© 2025 Scribengine. Words that matter.</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage7;
