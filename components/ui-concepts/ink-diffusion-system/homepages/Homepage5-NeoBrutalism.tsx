'use client';

/**
 * HOMEPAGE 5: NEO-BRUTALISM
 *
 * Design: Bold, unapologetic design with thick borders,
 * stark contrasts, and playful shadows. Modern brutalism
 * meets vibrant colors. Memorable and unique.
 */

import React from 'react';
import { tokens } from '../design-tokens';

const colors = {
  yellow: '#FFE566',
  pink: '#FF6B9D',
  blue: '#6BCBFF',
  green: '#7FE5C3',
  purple: '#C4B5FD',
  orange: '#FFAB5E',
  black: '#000000',
  white: '#FFFFFF',
  cream: '#FFFBEB',
};

export const Homepage5: React.FC = () => {
  return (
    <div style={{ background: colors.cream }}>
      {/* Navigation */}
      <nav className="px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            className="px-6 py-3 font-black text-xl"
            style={{
              background: colors.yellow,
              border: '3px solid black',
              boxShadow: '4px 4px 0 black',
            }}
          >
            SCRIBENGINE
          </div>

          <div className="flex items-center gap-4">
            {['Services', 'Pricing', 'Examples'].map((item) => (
              <a
                key={item}
                href="#"
                className="px-4 py-2 font-bold text-sm hover:bg-black hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
            <button
              className="px-6 py-3 font-bold text-sm transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_black]"
              style={{
                background: colors.pink,
                border: '3px solid black',
                boxShadow: '4px 4px 0 black',
              }}
            >
              GET STARTED →
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-8">
            {/* Main headline */}
            <div className="col-span-8">
              <div
                className="inline-block px-4 py-2 mb-8 font-bold text-sm"
                style={{
                  background: colors.blue,
                  border: '3px solid black',
                  boxShadow: '4px 4px 0 black',
                  transform: 'rotate(-2deg)',
                }}
              >
                ✨ AI-POWERED CONTENT
              </div>

              <h1
                className="text-[8rem] font-black leading-[0.85] mb-8"
                style={{ fontFamily: 'system-ui', letterSpacing: '-0.04em' }}
              >
                WRITE
                <br />
                <span
                  className="inline-block px-6"
                  style={{
                    background: colors.yellow,
                    border: '4px solid black',
                  }}
                >
                  BETTER
                </span>
                <br />
                CONTENT
              </h1>

              <p className="text-2xl max-w-xl mb-10 leading-relaxed">
                Transform your ideas into <strong>compelling narratives</strong> with
                AI that actually understands your unique voice.
              </p>

              <div className="flex items-center gap-4">
                <button
                  className="px-10 py-5 font-black text-xl transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_black]"
                  style={{
                    background: colors.green,
                    border: '4px solid black',
                    boxShadow: '6px 6px 0 black',
                  }}
                >
                  START FREE →
                </button>
                <button
                  className="px-10 py-5 font-bold text-xl transition-all hover:bg-black hover:text-white"
                  style={{ border: '4px solid black' }}
                >
                  SEE EXAMPLES
                </button>
              </div>
            </div>

            {/* Stats cards */}
            <div className="col-span-4 space-y-4">
              {[
                { number: '50K+', label: 'WORDS DAILY', color: colors.pink },
                { number: '94%', label: 'QUALITY SCORE', color: colors.blue },
                { number: '3MIN', label: 'AVG DELIVERY', color: colors.yellow },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-6 transition-all hover:-translate-x-1 hover:-translate-y-1"
                  style={{
                    background: stat.color,
                    border: '3px solid black',
                    boxShadow: '4px 4px 0 black',
                    transform: `rotate(${i % 2 === 0 ? 2 : -2}deg)`,
                  }}
                >
                  <p className="text-4xl font-black mb-1">{stat.number}</p>
                  <p className="text-sm font-bold">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-8" style={{ background: colors.black }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2
              className="text-5xl font-black text-white"
              style={{ fontFamily: 'system-ui' }}
            >
              WHAT WE CREATE
            </h2>
            <div
              className="px-6 py-3 font-bold"
              style={{
                background: colors.orange,
                border: '3px solid white',
                boxShadow: '4px 4px 0 white',
              }}
            >
              6 CONTENT TYPES
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[
              { title: 'BLOG POSTS', desc: 'SEO-optimized articles', price: 'FROM $8', color: colors.yellow },
              { title: 'SOCIAL PACKS', desc: '30 posts included', price: 'FROM $39', color: colors.pink },
              { title: 'EMAIL SEQUENCES', desc: '5-email campaigns', price: 'FROM $29', color: colors.blue },
              { title: 'SEO AUDITS', desc: 'Keyword analysis', price: '$149', color: colors.green },
              { title: 'CONTENT STRATEGY', desc: 'AI-powered planning', price: 'FROM $49', color: colors.purple },
              { title: 'MONTHLY BUNDLE', desc: 'Everything you need', price: '$249', color: colors.orange },
            ].map((service, i) => (
              <div
                key={i}
                className="p-8 transition-all cursor-pointer hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[10px_10px_0_white]"
                style={{
                  background: service.color,
                  border: '4px solid black',
                  boxShadow: '6px 6px 0 black',
                }}
              >
                <h3 className="text-2xl font-black mb-2">{service.title}</h3>
                <p className="text-lg mb-6">{service.desc}</p>
                <p className="text-3xl font-black">{service.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Tiers */}
      <section className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-5xl font-black text-center mb-16"
            style={{ fontFamily: 'system-ui' }}
          >
            PICK YOUR
            <span
              className="inline-block mx-4 px-4"
              style={{ background: colors.pink, border: '3px solid black' }}
            >
              QUALITY
            </span>
            LEVEL
          </h2>

          <div className="grid grid-cols-3 gap-8">
            {[
              {
                tier: 'BUDGET',
                price: '$3-17',
                tagline: 'Fast & efficient',
                features: ['GPT-4 power', 'Basic matching', '24h delivery'],
                color: colors.blue,
              },
              {
                tier: 'STANDARD',
                price: '$6-30',
                tagline: 'Most popular',
                features: ['Multi-AI blend', 'Style learning', '12h delivery'],
                color: colors.yellow,
                featured: true,
              },
              {
                tier: 'PREMIUM',
                price: '$12-65',
                tagline: 'Best quality',
                features: ['Claude Opus', 'Deep research', 'Guaranteed'],
                color: colors.green,
              },
            ].map((tier, i) => (
              <div
                key={i}
                className={`p-8 transition-all ${tier.featured ? '-mt-4 mb-4' : ''}`}
                style={{
                  background: tier.color,
                  border: '4px solid black',
                  boxShadow: tier.featured ? '10px 10px 0 black' : '6px 6px 0 black',
                }}
              >
                {tier.featured && (
                  <div
                    className="inline-block px-4 py-1 mb-4 font-bold text-sm"
                    style={{ background: colors.pink, border: '2px solid black' }}
                  >
                    ⭐ RECOMMENDED
                  </div>
                )}

                <p className="text-sm font-bold uppercase mb-2">{tier.tagline}</p>
                <h3 className="text-3xl font-black mb-2">{tier.tier}</h3>
                <p className="text-5xl font-black mb-6">{tier.price}</p>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 font-bold">
                      <span
                        className="w-6 h-6 flex items-center justify-center text-sm"
                        style={{ background: 'black', color: tier.color }}
                      >
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  className="w-full py-4 font-black text-lg transition-all hover:translate-x-1 hover:translate-y-1"
                  style={{
                    background: 'black',
                    color: tier.color,
                    border: '3px solid black',
                  }}
                >
                  CHOOSE {tier.tier}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Style Customization */}
      <section className="py-20 px-8" style={{ background: colors.purple }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-12 items-center">
            <div>
              <div
                className="inline-block px-4 py-2 mb-6 font-bold"
                style={{ background: colors.yellow, border: '3px solid black', boxShadow: '4px 4px 0 black' }}
              >
                18 STYLE DIMENSIONS
              </div>

              <h2 className="text-5xl font-black mb-6" style={{ fontFamily: 'system-ui' }}>
                CUSTOMIZE
                <br />
                EVERYTHING
              </h2>

              <p className="text-xl mb-8 leading-relaxed">
                Tone, rhythm, formality, humor—adjust every aspect until it sounds exactly like you.
              </p>

              <div className="flex flex-wrap gap-3">
                {[
                  'Tone', 'Style', 'Depth', 'Energy', 'Humor', 'Formality', 'CTA', 'Hooks'
                ].map((dim, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 font-bold transition-all hover:rotate-2"
                    style={{
                      background: i === 0 ? colors.pink : 'white',
                      border: '3px solid black',
                      boxShadow: '3px 3px 0 black',
                    }}
                  >
                    {dim}
                  </span>
                ))}
              </div>
            </div>

            {/* Preview card */}
            <div
              className="p-8"
              style={{
                background: 'white',
                border: '4px solid black',
                boxShadow: '8px 8px 0 black',
                transform: 'rotate(2deg)',
              }}
            >
              <div className="mb-6">
                <p className="text-sm font-bold uppercase mb-4">PREVIEW</p>
                {[
                  { label: 'Formality', value: 65, color: colors.blue },
                  { label: 'Energy', value: 80, color: colors.pink },
                  { label: 'Depth', value: 55, color: colors.green },
                ].map((slider, i) => (
                  <div key={i} className="mb-4">
                    <div className="flex justify-between text-sm font-bold mb-1">
                      <span>{slider.label}</span>
                      <span>{slider.value}%</span>
                    </div>
                    <div className="h-4" style={{ background: '#eee', border: '2px solid black' }}>
                      <div className="h-full" style={{ width: `${slider.value}%`, background: slider.color }} />
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="p-4"
                style={{ background: colors.cream, border: '3px solid black' }}
              >
                <p className="font-bold" style={{ fontFamily: tokens.fonts.serif }}>
                  "Here's the thing about strategic patience—the data makes a compelling case..."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black text-center mb-16" style={{ fontFamily: 'system-ui' }}>
            HOW IT WORKS
          </h2>

          <div className="grid grid-cols-4 gap-6">
            {[
              { step: '01', title: 'CHOOSE', desc: 'Pick content type & tier', color: colors.yellow },
              { step: '02', title: 'CUSTOMIZE', desc: 'Set your style preferences', color: colors.pink },
              { step: '03', title: 'GENERATE', desc: 'Watch AI create magic', color: colors.blue },
              { step: '04', title: 'PUBLISH', desc: 'Export anywhere', color: colors.green },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div
                  className="p-6 h-full transition-all hover:-translate-y-2"
                  style={{
                    background: item.color,
                    border: '4px solid black',
                    boxShadow: '6px 6px 0 black',
                  }}
                >
                  <p className="text-6xl font-black opacity-30 mb-4">{item.step}</p>
                  <h3 className="text-2xl font-black mb-2">{item.title}</h3>
                  <p className="font-bold">{item.desc}</p>
                </div>
                {i < 3 && (
                  <div className="absolute top-1/2 -right-6 text-4xl font-black z-10">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-8" style={{ background: colors.black }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl font-black text-white mb-6" style={{ fontFamily: 'system-ui' }}>
            READY TO
            <span
              className="inline-block mx-4 px-4"
              style={{ background: colors.yellow, color: 'black' }}
            >
              START
            </span>
            ?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Create your first piece free. No credit card required.
          </p>
          <button
            className="px-12 py-6 font-black text-2xl transition-all hover:-translate-x-2 hover:-translate-y-2"
            style={{
              background: colors.pink,
              border: '4px solid white',
              boxShadow: '8px 8px 0 white',
            }}
          >
            START CREATING NOW →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 border-t-4 border-black">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            className="px-4 py-2 font-black"
            style={{ background: colors.yellow, border: '3px solid black', boxShadow: '3px 3px 0 black' }}
          >
            SCRIBENGINE
          </div>
          <p className="font-bold">© 2025 — WORDS THAT MATTER</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage5;
