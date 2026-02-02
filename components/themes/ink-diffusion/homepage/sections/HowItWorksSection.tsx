'use client';

/**
 * HOW IT WORKS SECTION - Ink Diffusion Homepage
 *
 * Large numbered steps with connecting lines.
 */

import React from 'react';
import { tokens } from '../../primitives/design-tokens';

const steps = [
  {
    step: '01',
    title: 'Choose',
    description: 'Select your content type and quality tier based on your needs and budget.',
  },
  {
    step: '02',
    title: 'Customize',
    description: 'Fine-tune tone, style, and audience settings. Upload samples to train your voice.',
  },
  {
    step: '03',
    title: 'Generate',
    description: 'Our AI crafts content using your style profile with multi-stage quality checks.',
  },
  {
    step: '04',
    title: 'Publish',
    description: 'Review, edit if needed, and export directly to your platform of choice.',
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section
      id="how-it-works"
      className="py-20 sm:py-32 px-4 sm:px-8 scroll-mt-20"
      style={{ background: tokens.colors.paper.white }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-20">
          <p
            className="text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-3 sm:mb-4"
            style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
          >
            Simple Process
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-light"
            style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.primary }}
          >
            From idea to <em>impact</em>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((item, i) => (
            <div key={i} className="relative">
              <p
                className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-3 sm:mb-4"
                style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.ink[100] }}
              >
                {item.step}
              </p>
              <h3
                className="text-lg sm:text-xl mb-2"
                style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.primary }}
              >
                {item.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: tokens.colors.text.muted }}
              >
                {item.description}
              </p>
              {/* Connecting line - hidden on mobile, visible on larger screens */}
              {i < 3 && (
                <div
                  className="absolute top-6 sm:top-8 -right-3 sm:-right-4 w-6 sm:w-8 h-px hidden lg:block"
                  style={{ background: tokens.colors.ink[200] }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
