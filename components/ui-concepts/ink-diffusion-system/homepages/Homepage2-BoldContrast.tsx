'use client';

/**
 * HOMEPAGE 2: BOLD CONTRAST
 *
 * Design: Dramatic black and white sections with vibrant color accents.
 * Asymmetric layouts, bold typography, high impact.
 * Think Apple meets luxury fashion brand.
 */

import React from 'react';
import { tokens } from '../design-tokens';

const colors = {
  black: '#0a0a0a',
  white: '#ffffff',
  coral: '#FF6B5B',
  electric: '#5B7FFF',
  gold: '#FFB84D',
  mint: '#4ECDC4',
};

export const Homepage2: React.FC = () => {
  return (
    <div>
      {/* Hero - Split Screen */}
      <section className="min-h-screen grid grid-cols-2">
        {/* Left - Dark */}
        <div className="bg-black relative overflow-hidden flex items-center justify-center p-16">
          {/* Animated gradient blob */}
          <div
            className="absolute top-1/4 -left-20 w-80 h-80 rounded-full blur-3xl opacity-60"
            style={{ background: `linear-gradient(135deg, ${colors.coral}, ${colors.electric})` }}
          />

          <div className="relative z-10">
            <p
              className="text-coral text-sm uppercase tracking-[0.4em] mb-6"
              style={{ color: colors.coral }}
            >
              AI Content Studio
            </p>
            <h1
              className="text-7xl font-bold text-white leading-[1.1] mb-8"
              style={{ fontFamily: tokens.fonts.serif }}
            >
              Create
              <br />
              <span className="text-transparent bg-clip-text" style={{
                backgroundImage: `linear-gradient(90deg, ${colors.coral}, ${colors.electric})`,
              }}>
                Extraordinary
              </span>
              <br />
              Content
            </h1>
            <p className="text-gray-400 text-lg max-w-md mb-10 leading-relaxed">
              Transform your ideas into compelling narratives with
              AI that understands your unique voice.
            </p>

            <div className="flex items-center gap-4">
              <button
                className="px-8 py-4 rounded-full font-semibold transition-all hover:scale-105"
                style={{ background: colors.coral, color: '#fff' }}
              >
                Start Free Trial
              </button>
              <button className="px-8 py-4 rounded-full font-semibold border border-gray-700 text-white hover:border-gray-500 transition-all">
                See Examples
              </button>
            </div>
          </div>
        </div>

        {/* Right - Light with Preview */}
        <div className="bg-white relative flex items-center justify-center p-16">
          {/* Navigation overlay */}
          <nav className="absolute top-0 left-0 right-0 p-8 flex items-center justify-between">
            <div className="flex items-center gap-8">
              {['Services', 'Pricing', 'About'].map((item) => (
                <a key={item} href="#" className="text-sm text-gray-600 hover:text-black transition-colors">
                  {item}
                </a>
              ))}
            </div>
            <button className="text-sm font-medium text-black">
              Sign In →
            </button>
          </nav>

          {/* Floating preview cards */}
          <div className="relative w-full max-w-md">
            {/* Main card */}
            <div
              className="bg-white rounded-3xl p-8 shadow-2xl relative z-20"
              style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.15)' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full" style={{ background: colors.coral }} />
                <span className="text-xs uppercase tracking-wider text-gray-400">Live Preview</span>
              </div>

              <p className="text-2xl leading-relaxed text-gray-800 mb-6" style={{ fontFamily: tokens.fonts.serif }}>
                "The future of content isn't about volume—it's about
                <span className="font-semibold" style={{ color: colors.electric }}> resonance</span>."
              </p>

              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Blog Post • 2,450 words</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  Generated
                </span>
              </div>
            </div>

            {/* Background cards */}
            <div
              className="absolute -bottom-4 -right-4 w-full h-full bg-gray-100 rounded-3xl z-10"
              style={{ transform: 'rotate(3deg)' }}
            />
            <div
              className="absolute -bottom-8 -right-8 w-full h-full rounded-3xl z-0"
              style={{ background: colors.electric, opacity: 0.2, transform: 'rotate(6deg)' }}
            />
          </div>
        </div>
      </section>

      {/* Trusted By - Horizontal Scroll Feel */}
      <section className="py-20 px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-500 text-sm uppercase tracking-wider mb-12">
            Trusted by innovative teams worldwide
          </p>
          <div className="flex items-center justify-center gap-16 opacity-50">
            {['Stripe', 'Notion', 'Linear', 'Vercel', 'Figma', 'Framer'].map((brand) => (
              <span key={brand} className="text-2xl font-bold text-white">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Services - Staggered Grid */}
      <section className="py-32 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-8 mb-20">
            <div className="col-span-5">
              <h2
                className="text-6xl font-bold leading-tight"
                style={{ fontFamily: tokens.fonts.serif }}
              >
                Every format.
                <br />
                <span style={{ color: colors.electric }}>One platform.</span>
              </h2>
            </div>
            <div className="col-span-7 flex items-end justify-end">
              <p className="text-xl text-gray-600 max-w-md">
                From SEO-optimized blog posts to viral social content—
                we've got your content needs covered.
              </p>
            </div>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Large card */}
            <div
              className="col-span-2 row-span-2 rounded-3xl p-10 relative overflow-hidden group"
              style={{ background: colors.black }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(135deg, ${colors.coral}20, ${colors.electric}20)` }}
              />
              <div className="relative z-10">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8"
                  style={{ background: colors.coral }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <h3 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: tokens.fonts.serif }}>
                  Blog Posts & Articles
                </h3>
                <p className="text-gray-400 text-lg mb-8 max-w-md">
                  Long-form content with SEO optimization, style matching,
                  and multi-stage quality review.
                </p>
                <div className="flex items-center gap-6">
                  <span className="text-3xl font-bold text-white">$8</span>
                  <span className="text-gray-500">starting price</span>
                </div>
              </div>
            </div>

            {/* Small cards */}
            {[
              {
                title: 'Social Packs',
                desc: '30 posts across all platforms',
                price: '$39',
                color: colors.electric,
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                ),
              },
              {
                title: 'Email Sequences',
                desc: '5-email conversion campaigns',
                price: '$29',
                color: colors.gold,
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                ),
              },
              {
                title: 'SEO Audits',
                desc: 'Keyword & gap analysis',
                price: '$149',
                color: colors.mint,
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                ),
              },
              {
                title: 'Monthly Bundle',
                desc: 'Everything you need',
                price: '$249',
                color: colors.coral,
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  </svg>
                ),
              },
            ].map((service, i) => (
              <div
                key={i}
                className="rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                style={{ background: service.color }}
              >
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-white/70 text-sm mb-6">{service.desc}</p>
                <p className="text-2xl font-bold text-white">{service.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-32 px-8" style={{ background: '#fafafa' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6" style={{ fontFamily: tokens.fonts.serif }}>
              Powered by
              <span style={{ color: colors.electric }}> intelligence</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              18 customizable style dimensions, multi-model AI collaboration,
              and real-time generation—all in one platform.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {[
              { number: '18', label: 'Style dimensions', desc: 'Customize every aspect of your voice' },
              { number: '3', label: 'Quality tiers', desc: 'Budget to Premium options' },
              { number: '5', label: 'Content types', desc: 'Blog, social, email & more' },
              { number: '∞', label: 'Possibilities', desc: 'Unlimited creative potential' },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 text-center transition-all hover:shadow-xl"
              >
                <p
                  className="text-5xl font-bold mb-2"
                  style={{
                    background: `linear-gradient(135deg, ${colors.coral}, ${colors.electric})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {stat.number}
                </p>
                <p className="font-semibold text-gray-800 mb-1">{stat.label}</p>
                <p className="text-sm text-gray-500">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Tiers - Horizontal */}
      <section className="py-32 px-8 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-16">
            <h2 className="text-5xl font-bold" style={{ fontFamily: tokens.fonts.serif }}>
              Choose your
              <br />
              <span style={{ color: colors.gold }}>quality level</span>
            </h2>
            <p className="text-gray-400 max-w-md text-right">
              From quick drafts to premium publications—
              find the perfect tier for your needs.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {[
              {
                tier: 'Budget',
                price: '$3-17',
                desc: 'Fast, efficient AI-powered content',
                features: ['GPT-4 generation', 'Basic style matching', '24h delivery'],
                color: colors.mint,
              },
              {
                tier: 'Standard',
                price: '$6-30',
                desc: 'Multi-model blend for superior quality',
                features: ['Multi-AI collaboration', 'Advanced customization', '12h delivery'],
                color: colors.gold,
                featured: true,
              },
              {
                tier: 'Premium',
                price: '$12-65',
                desc: 'Best-in-class with human-level review',
                features: ['Claude Opus quality', 'Deep research', 'Quality guarantee'],
                color: colors.coral,
              },
            ].map((tier, i) => (
              <div
                key={i}
                className={`rounded-3xl p-10 relative ${tier.featured ? 'bg-white text-black' : 'border border-gray-800'}`}
              >
                {tier.featured && (
                  <div
                    className="absolute -top-4 left-8 px-4 py-1 rounded-full text-xs font-bold"
                    style={{ background: colors.gold, color: 'black' }}
                  >
                    MOST POPULAR
                  </div>
                )}

                <div
                  className="w-3 h-3 rounded-full mb-6"
                  style={{ background: tier.color }}
                />

                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: tokens.fonts.serif }}>
                  {tier.tier}
                </h3>
                <p className={`text-sm mb-6 ${tier.featured ? 'text-gray-600' : 'text-gray-400'}`}>
                  {tier.desc}
                </p>

                <p className="text-4xl font-bold mb-8">{tier.price}</p>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={tier.color} strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className={tier.featured ? 'text-gray-700' : 'text-gray-300'}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-4 rounded-xl font-semibold transition-all hover:scale-105 ${
                    tier.featured ? 'text-white' : 'text-black'
                  }`}
                  style={{ background: tier.featured ? 'black' : tier.color }}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-8 relative overflow-hidden" style={{ background: colors.electric }}>
        <div
          className="absolute top-0 right-0 w-1/2 h-full"
          style={{
            background: `linear-gradient(135deg, ${colors.coral}, ${colors.gold})`,
            clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)',
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-2xl">
            <h2
              className="text-6xl font-bold text-white mb-6"
              style={{ fontFamily: tokens.fonts.serif }}
            >
              Ready to create
              <br />
              something amazing?
            </h2>
            <p className="text-xl text-white/80 mb-10">
              Start your free trial today. No credit card required.
            </p>
            <button
              className="px-10 py-5 rounded-full font-bold text-lg transition-all hover:scale-105"
              style={{ background: 'white', color: colors.electric }}
            >
              Get Started Free →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8 bg-black text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${colors.coral}, ${colors.electric})` }}
            >
              <span className="text-white font-bold">S</span>
            </div>
            <span className="text-xl font-bold">Scribengine</span>
          </div>
          <p className="text-gray-500 text-sm">© 2025 Scribengine. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage2;
