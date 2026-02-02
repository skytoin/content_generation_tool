'use client';

/**
 * HERO SECTION - Ink Diffusion Homepage
 *
 * Magazine cover style with dramatic typography.
 */

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { tokens } from '../../primitives/design-tokens';

export const HeroSection: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <section className="min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-8 relative overflow-hidden">
      {/* Large decorative letter */}
      <div
        className="absolute -right-10 sm:-right-20 top-20 text-[20rem] sm:text-[40rem] font-bold leading-none pointer-events-none select-none"
        style={{
          fontFamily: tokens.fonts.serif,
          color: tokens.colors.ink[100],
          opacity: 0.5,
        }}
      >
        S
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Issue number style header */}
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <div className="w-12 sm:w-16 h-px" style={{ background: tokens.colors.ink[700] }} />
          <span
            className="text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em]"
            style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
          >
            The Future of Content
          </span>
        </div>

        {/* Main headline */}
        <h1
          className="text-5xl sm:text-7xl lg:text-8xl font-light leading-[0.95] mb-6 sm:mb-8 max-w-4xl"
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
          className="text-lg sm:text-xl lg:text-2xl max-w-xl mb-8 sm:mb-12 leading-relaxed"
          style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.secondary }}
        >
          Content that sounds like you wrote it—because we learned how you write.
          Share your voice; we'll match it in everything we create.
        </p>

        {/* CTA Group */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <button
            onClick={() => session ? router.push('/dashboard/projects/new') : router.push('/signup')}
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-medium transition-all hover:scale-105"
            style={{
              background: tokens.colors.ink[700],
              color: '#fff',
              boxShadow: `0 20px 40px ${tokens.colors.ink[700]}30`,
            }}
          >
            {session ? 'Create New Project' : 'Start Creating'}
          </button>
          <a
            href="#style-learning"
            className="flex items-center gap-3 text-base sm:text-lg transition-all hover:gap-4"
            style={{ color: tokens.colors.text.secondary }}
          >
            <span
              className="w-10 sm:w-12 h-10 sm:h-12 rounded-full border-2 flex items-center justify-center"
              style={{ borderColor: tokens.colors.ink[300] }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={tokens.colors.ink[700]} strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
            <span style={{ fontFamily: tokens.fonts.sans }}>See how it works</span>
          </a>
        </div>

        {/* Stats row */}
        <div
          className="grid grid-cols-2 sm:flex sm:items-center gap-6 sm:gap-16 mt-16 sm:mt-20 pt-8 sm:pt-12 border-t"
          style={{ borderColor: tokens.colors.paper.border }}
        >
          {[
            { number: '50K+', label: 'Words crafted daily' },
            { number: '94%', label: 'Style match accuracy' },
            { number: '<24h', label: 'Average delivery' },
          ].map((stat, i) => (
            <div key={i}>
              <p
                className="text-3xl sm:text-4xl lg:text-5xl font-light mb-1 sm:mb-2"
                style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.ink[700] }}
              >
                {stat.number}
              </p>
              <p
                className="text-xs sm:text-sm"
                style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
