'use client';

/**
 * TESTIMONIALS SECTION - Ink Diffusion Homepage
 *
 * Editorial quote style with specific style-matching mentions.
 */

import React from 'react';
import { tokens } from '../../primitives/design-tokens';
import { QuoteIcon } from '../icons/InkIcons';

const testimonials = [
  {
    quote: 'We gave Scribengine three technical blog posts. They identified that we use short sentences, avoid jargon, and always include practical examples. The first article they generated? Our editor thought our CTO wrote it.',
    name: 'Emma Thompson',
    role: 'Content Lead',
    company: 'ScaleUp Co',
    initials: 'ET',
  },
  {
    quote: 'The style matching is genuinely impressive. I uploaded my LinkedIn posts and the AI picked up on my conversational tone and tendency to start with a provocative question. The content feels like mine.',
    name: 'Marcus Rodriguez',
    role: 'Founder',
    company: 'GrowthLab',
    initials: 'MR',
  },
  {
    quote: 'We went from publishing 2 posts a month to 8, and our organic traffic increased 340%. But what sold me was how the content maintained our voice—our readers can\'t tell the difference.',
    name: 'Sarah Chen',
    role: 'Marketing Director',
    company: 'TechStart',
    initials: 'SC',
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-32 px-4 sm:px-8" style={{ background: tokens.colors.paper.cream }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-20">
          <p
            className="text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-3 sm:mb-4"
            style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
          >
            Client Stories
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-light"
            style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.primary }}
          >
            Trusted by content teams
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="p-6 sm:p-8 rounded-2xl relative"
              style={{
                background: tokens.colors.paper.white,
                border: `1px solid ${tokens.colors.paper.border}`,
              }}
            >
              {/* Quote icon */}
              <QuoteIcon
                size={32}
                color={tokens.colors.ink[200]}
                className="absolute top-6 right-6 opacity-50"
              />

              <p
                className="text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 relative"
                style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.secondary }}
              >
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-3 sm:gap-4">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm font-medium"
                  style={{
                    background: tokens.colors.ink[100],
                    color: tokens.colors.ink[700],
                  }}
                >
                  {testimonial.initials}
                </div>
                <div>
                  <p
                    className="font-medium text-sm sm:text-base"
                    style={{ color: tokens.colors.text.primary }}
                  >
                    {testimonial.name}
                  </p>
                  <p
                    className="text-xs sm:text-sm"
                    style={{ color: tokens.colors.text.muted }}
                  >
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
