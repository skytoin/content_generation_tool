'use client';

/**
 * STYLE LEARNING SECTION - Ink Diffusion Homepage
 *
 * NEW section that explains how style learning works.
 * Addresses the critique that "style learning is invisible."
 */

import React from 'react';
import { tokens } from '../../primitives/design-tokens';
import { CheckIcon, DocumentIcon, InkDropIcon, ArrowRightIcon } from '../icons/InkIcons';

const analysisPoints = [
  'Sentence structure & length',
  'Vocabulary choices',
  'Tone & formality level',
  'Paragraph rhythm',
  'Opening & closing patterns',
  'Industry terminology',
];

const processSteps = [
  {
    number: '1',
    title: 'Share your samples',
    description: 'Upload 2-3 pieces of content you\'ve written—blog posts, emails, or LinkedIn articles. 500+ words each works best.',
  },
  {
    number: '2',
    title: 'We analyze patterns',
    description: 'Our AI examines your tone, rhythm, word choice, and structural preferences to build your unique style profile.',
  },
  {
    number: '3',
    title: 'Review your profile',
    description: 'See exactly what we learned before any content is generated. Adjust if needed—you\'re in control.',
  },
  {
    number: '4',
    title: 'Generate matched content',
    description: 'Every piece we create uses your style profile. The result? Content that sounds like you wrote it.',
  },
];

export const StyleLearningSection: React.FC = () => {
  return (
    <section
      id="style-learning"
      className="py-20 sm:py-32 px-4 sm:px-8 scroll-mt-20"
      style={{ background: tokens.colors.paper.cream }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-20">
          <p
            className="text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-3 sm:mb-4"
            style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
          >
            Your Voice, Decoded
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-light mb-4 sm:mb-6"
            style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.primary }}
          >
            We don't guess your style—
            <br className="hidden sm:block" />
            <em>we learn it</em>
          </h2>
          <p
            className="text-lg sm:text-xl max-w-2xl mx-auto"
            style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.secondary }}
          >
            Style learning isn't marketing speak. It's a systematic analysis of how you write,
            so every piece we generate feels authentically yours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Process steps */}
          <div>
            <h3
              className="text-xl sm:text-2xl mb-8"
              style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.primary }}
            >
              The Process
            </h3>
            <div className="space-y-6 sm:space-y-8">
              {processSteps.map((step, i) => (
                <div key={i} className="flex gap-4 sm:gap-6">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: tokens.colors.ink[100] }}
                  >
                    <span
                      className="text-lg sm:text-xl font-medium"
                      style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.ink[700] }}
                    >
                      {step.number}
                    </span>
                  </div>
                  <div>
                    <h4
                      className="text-base sm:text-lg font-medium mb-1 sm:mb-2"
                      style={{ fontFamily: tokens.fonts.sans, color: tokens.colors.text.primary }}
                    >
                      {step.title}
                    </h4>
                    <p
                      className="text-sm sm:text-base leading-relaxed"
                      style={{ color: tokens.colors.text.muted }}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sample requirements callout */}
            <div
              className="mt-8 sm:mt-12 p-5 sm:p-6 rounded-xl"
              style={{ background: tokens.colors.ink[50], border: `1px solid ${tokens.colors.ink[200]}` }}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <DocumentIcon size={24} color={tokens.colors.ink[700]} className="flex-shrink-0 mt-0.5" />
                <div>
                  <h4
                    className="font-medium mb-2"
                    style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
                  >
                    What samples should I provide?
                  </h4>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: tokens.colors.text.secondary }}
                  >
                    Provide 2-3 pieces of content you've written (500+ words each).
                    Blog posts work best, but emails, LinkedIn posts, or website copy also work.
                    The more variety, the better we understand your range.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: What we analyze + visual */}
          <div>
            <h3
              className="text-xl sm:text-2xl mb-8"
              style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.primary }}
            >
              What We Analyze
            </h3>

            {/* Analysis points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10">
              {analysisPoints.map((point, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg"
                  style={{ background: tokens.colors.paper.white }}
                >
                  <CheckIcon size={18} color={tokens.colors.ink[700]} />
                  <span
                    className="text-sm"
                    style={{ color: tokens.colors.text.secondary }}
                  >
                    {point}
                  </span>
                </div>
              ))}
            </div>

            {/* Style profile preview card */}
            <div
              className="p-6 sm:p-8 rounded-2xl relative overflow-hidden"
              style={{
                background: tokens.colors.paper.white,
                border: `1px solid ${tokens.colors.paper.border}`,
              }}
            >
              {/* Decorative ink drop */}
              <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20"
                style={{ background: tokens.colors.ink[500] }}
              />

              <div className="relative">
                <div className="flex items-center gap-2 mb-6">
                  <InkDropIcon size={20} color={tokens.colors.ink[700]} />
                  <p
                    className="text-xs uppercase tracking-wider"
                    style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
                  >
                    Sample Style Profile
                  </p>
                </div>

                {/* Tone slider */}
                <div className="mb-6">
                  <p
                    className="text-sm mb-3"
                    style={{ color: tokens.colors.text.muted }}
                  >
                    Tone
                  </p>
                  <div
                    className="relative h-2 rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${tokens.colors.ink[200]}, ${tokens.colors.sage[300]})`,
                    }}
                  >
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-4"
                      style={{
                        left: '65%',
                        background: '#fff',
                        borderColor: tokens.colors.ink[700],
                        boxShadow: tokens.shadows.md,
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs" style={{ color: tokens.colors.text.muted }}>
                    <span>Formal</span>
                    <span>Casual</span>
                  </div>
                </div>

                {/* Sample metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div
                    className="p-3 rounded-lg"
                    style={{ background: tokens.colors.paper.cream }}
                  >
                    <p className="text-xs mb-1" style={{ color: tokens.colors.text.muted }}>Avg. Sentence</p>
                    <p
                      className="text-lg font-medium"
                      style={{ fontFamily: tokens.fonts.mono, color: tokens.colors.ink[700] }}
                    >
                      16 words
                    </p>
                  </div>
                  <div
                    className="p-3 rounded-lg"
                    style={{ background: tokens.colors.paper.cream }}
                  >
                    <p className="text-xs mb-1" style={{ color: tokens.colors.text.muted }}>Reading Level</p>
                    <p
                      className="text-lg font-medium"
                      style={{ fontFamily: tokens.fonts.mono, color: tokens.colors.ink[700] }}
                    >
                      Grade 10
                    </p>
                  </div>
                </div>

                {/* Sample output */}
                <div
                  className="p-4 sm:p-5 rounded-xl"
                  style={{ background: tokens.colors.paper.cream }}
                >
                  <p
                    className="text-xs uppercase tracking-wider mb-2 sm:mb-3"
                    style={{ color: tokens.colors.ink[700] }}
                  >
                    Generated Preview
                  </p>
                  <p
                    className="text-base sm:text-lg leading-relaxed italic"
                    style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.primary }}
                  >
                    "Here's the thing about strategic patience—the data makes a compelling case.
                    When you resist the urge to chase quick wins, something interesting happens..."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StyleLearningSection;
