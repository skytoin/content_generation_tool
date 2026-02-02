'use client';

/**
 * FAQ SECTION - Ink Diffusion Homepage
 *
 * Clean accordion with serif headings.
 * Includes style learning questions.
 */

import React, { useState } from 'react';
import { tokens } from '../../primitives/design-tokens';
import { PlusIcon, MinusIcon } from '../icons/InkIcons';

const faqs = [
  {
    q: 'What samples should I provide for style learning?',
    a: 'We recommend 2-3 pieces of content you\'ve written, each at least 500 words. Blog posts work best, but emails, LinkedIn posts, or website copy also work well. The more variety you provide, the better we understand your full range of expression.',
  },
  {
    q: 'How accurate is the style matching?',
    a: 'Our style matching achieves 94% accuracy based on blind tests where clients couldn\'t distinguish AI-generated content from their own writing. The key factors are sentence structure, vocabulary patterns, tone, and your unique writing quirks.',
  },
  {
    q: 'Can I see my style profile before generating?',
    a: 'Yes. After uploading your samples, you\'ll see a detailed style profile showing your tone spectrum, sentence patterns, vocabulary preferences, and more. You can adjust these settings before any content is generated.',
  },
  {
    q: 'How is the content generated?',
    a: 'We use advanced AI models combined with your style profile to generate content. Each piece goes through quality checks before delivery. Premium tier includes multi-stage review with different AI models validating the output.',
  },
  {
    q: 'What\'s the turnaround time?',
    a: 'Budget tier: 24 hours. Standard tier: 12 hours. Premium tier: 6 hours. Most content is delivered well before these windows. You\'ll receive an email notification when your content is ready.',
  },
  {
    q: 'Can I request revisions?',
    a: 'Yes. We offer one free revision within 7 days of delivery. Premium tier includes unlimited revisions. Just reply to your delivery email with specific feedback.',
  },
  {
    q: 'Is the content original?',
    a: 'Every piece is generated fresh for your specific request. All content passes plagiarism checks and you receive full ownership rights. We never reuse content between clients.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 sm:py-32 px-4 sm:px-8 scroll-mt-20" style={{ background: tokens.colors.paper.white }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <p
            className="text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-3 sm:mb-4"
            style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
          >
            Questions & Answers
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-light"
            style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.primary }}
          >
            Frequently Asked
          </h2>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden"
              style={{
                background: tokens.colors.paper.cream,
                border: `1px solid ${openIndex === i ? tokens.colors.ink[200] : tokens.colors.paper.border}`,
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-5 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 transition-colors hover:bg-white/50"
              >
                <span
                  className="font-medium text-sm sm:text-base"
                  style={{ fontFamily: tokens.fonts.sans, color: tokens.colors.text.primary }}
                >
                  {faq.q}
                </span>
                {openIndex === i ? (
                  <MinusIcon size={20} color={tokens.colors.ink[700]} className="flex-shrink-0" />
                ) : (
                  <PlusIcon size={20} color={tokens.colors.text.muted} className="flex-shrink-0" />
                )}
              </button>
              {openIndex === i && (
                <div
                  className="px-5 sm:px-6 pb-4 sm:pb-5"
                  style={{ color: tokens.colors.text.secondary }}
                >
                  <p className="text-sm sm:text-base leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
