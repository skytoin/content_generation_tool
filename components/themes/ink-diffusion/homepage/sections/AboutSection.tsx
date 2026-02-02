'use client';

/**
 * ABOUT SECTION - Ink Diffusion Homepage
 *
 * Editorial layout with emphasis on MISTTRADES and style learning.
 */

import React from 'react';
import { tokens } from '../../primitives/design-tokens';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 sm:py-32 px-4 sm:px-8 scroll-mt-20" style={{ background: tokens.colors.paper.cream }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <p
            className="text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-3 sm:mb-4"
            style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
          >
            About Scribengine
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-light"
            style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.primary }}
          >
            A new approach to content
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div
            className="p-6 sm:p-8 lg:p-12 rounded-2xl"
            style={{
              background: tokens.colors.paper.white,
              border: `1px solid ${tokens.colors.paper.border}`,
            }}
          >
            <p
              className="text-base sm:text-lg lg:text-xl leading-relaxed mb-6"
              style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.secondary }}
            >
              Scribengine was built to solve a common problem: creating high-quality content
              that actually sounds like you wrote it. Generic AI output isn't enough—your
              brand voice matters.
            </p>
            <p
              className="text-base sm:text-lg lg:text-xl leading-relaxed mb-6"
              style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.secondary }}
            >
              What sets us apart is our{' '}
              <span style={{ color: tokens.colors.ink[700], fontWeight: 500 }}>
                style learning technology
              </span>
              . Share your existing content and our AI analyzes your writing patterns—tone,
              rhythm, vocabulary, sentence structure. Every piece we generate uses this
              profile to match your authentic voice.
            </p>
            <p
              className="text-base sm:text-lg lg:text-xl leading-relaxed mb-6"
              style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.secondary }}
            >
              Our multi-stage pipeline includes style analysis, research, writing, and quality
              review—all automated to ensure consistent, on-brand output. Whether you need
              blog posts, social content, or email sequences, we deliver content that maintains
              your voice at scale.
            </p>
            <p
              className="text-base sm:text-lg lg:text-xl leading-relaxed"
              style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.secondary }}
            >
              Scribengine is a product of{' '}
              <span style={{ color: tokens.colors.ink[700], fontWeight: 500 }}>MISTTRADES</span>,
              committed to making professional, personalized content accessible to businesses
              of all sizes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
