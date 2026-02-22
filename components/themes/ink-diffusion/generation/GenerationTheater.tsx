'use client';

/**
 * GENERATION THEATER
 *
 * The premium content generation experience.
 * Displays animated stages, ink effects, and streaming content.
 */

import React, { useMemo } from 'react';
import { tokens } from '../primitives/design-tokens';
import { InkButton } from '../primitives/InkButton';
import { InkDrop } from './InkDrop';
import { StageIndicator } from './StageIndicator';
import { WritingSurface } from './WritingSurface';
import { InstagramSurface } from './InstagramSurface';
import { XSurface } from './XSurface';
import { LinkedInSurface } from './LinkedInSurface';
import { ContentArchitectSurface } from './ContentArchitectSurface';
import { ProgressVisualization } from './ProgressVisualization';

export interface Stage {
  id: string;
  label: string;
}

interface GenerationTheaterProps {
  stages: Stage[];
  currentStageIndex: number;
  streamedText: string;
  isGenerating: boolean;
  progress: number;
  title?: string;
  contentType?: 'blog' | 'instagram' | 'twitter' | 'linkedin' | 'email' | 'social' | 'content-architect';
  onCancel?: () => void;
  error?: string | null;
}

export const GenerationTheater: React.FC<GenerationTheaterProps> = ({
  stages,
  currentStageIndex,
  streamedText,
  isGenerating,
  progress,
  title = 'Your Content',
  contentType = 'blog',
  onCancel,
  error,
}) => {
  // Auto-detect content type from text if not explicitly set
  const isContentArchitect = contentType === 'content-architect' ||
    streamedText.includes('🏗️ CONTENT ARCHITECT') ||
    streamedText.includes('CONTENT ARCHITECT');
  const isInstagramContent = !isContentArchitect && (contentType === 'instagram' || streamedText.includes('📸 INSTAGRAM CONTENT'));
  const isXContent = !isContentArchitect && (contentType === 'twitter' ||
    streamedText.includes('🐦 X TWEET PACK') ||
    streamedText.includes('🧵 X THREAD') ||
    streamedText.includes('💬 X QUOTE TWEETS'));
  const isLinkedInContent = !isContentArchitect && (contentType === 'linkedin' ||
    streamedText.includes('💼 LINKEDIN TEXT POSTS') ||
    streamedText.includes('🎠 LINKEDIN CAROUSEL') ||
    streamedText.includes('📰 LINKEDIN ARTICLE') ||
    streamedText.includes('📊 LINKEDIN POLLS'));
  // Generate random ink drops for background animation
  const inkDrops = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      size: 150 + Math.random() * 200,
      delay: Math.random() * 4,
      color: i % 2 === 0 ? tokens.colors.ink[300] : tokens.colors.sage[300],
    })),
  []);

  const currentStage = stages[currentStageIndex];

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: tokens.colors.paper.cream }}
    >
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes inkBloom {
          0% { transform: scale(0.5); opacity: 0; }
          30% { opacity: 0.6; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes inkRipple {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(3); opacity: 0; }
        }
        @keyframes inkCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        :global(.ink-drop) {
          animation: inkBloom 6s ease-out infinite;
        }
        :global(.stage-ripple) {
          animation: inkRipple 2s ease-out infinite;
        }
        :global(.ink-cursor) {
          animation: inkCursor 1.2s ease-in-out infinite;
        }
        :global(.progress-shimmer) {
          animation: shimmer 2s infinite;
        }
      `}</style>

      {/* Animated ink drops in background */}
      <div className="absolute inset-0 pointer-events-none">
        {isGenerating && inkDrops.map((drop, i) => (
          <InkDrop key={i} {...drop} />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-16">
        {/* Header */}
        <header className="mb-8 sm:mb-16">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <p
                className="text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-2 sm:mb-3"
                style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
              >
                Content Generation
              </p>
              <h1
                className="text-3xl sm:text-5xl font-light mb-2 sm:mb-3"
                style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
              >
                Crafting Your Words
              </h1>
              <p
                className="text-base sm:text-xl"
                style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.serif }}
              >
                Watch as your content takes shape
              </p>
            </div>

            {isGenerating && onCancel && (
              <InkButton variant="ghost" onClick={onCancel}>
                Cancel
              </InkButton>
            )}
          </div>
        </header>

        {/* Error display */}
        {error && (
          <div
            className="mb-8 p-6 rounded-xl border"
            style={{
              background: tokens.colors.ink[50],
              borderColor: tokens.colors.ink[200],
            }}
          >
            <p
              className="text-sm font-medium"
              style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
            >
              {error}
            </p>
          </div>
        )}

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12">
          {/* Stages sidebar - horizontal scroll on mobile */}
          <aside className="lg:col-span-3 order-2 lg:order-1">
            <p
              className="text-xs uppercase tracking-[0.2em] mb-4 sm:mb-6"
              style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
            >
              Process
            </p>
            <div className="flex lg:flex-col gap-2 lg:gap-1 overflow-x-auto pb-2 lg:pb-0 lg:space-y-1">
              {stages.map((stage, index) => (
                <StageIndicator
                  key={stage.id}
                  label={stage.label}
                  isActive={index === currentStageIndex}
                  isComplete={index < currentStageIndex}
                  index={index}
                />
              ))}
            </div>
          </aside>

          {/* Content surface - switches based on content type */}
          <main className="lg:col-span-9 order-1 lg:order-2">
            {isContentArchitect ? (
              <ContentArchitectSurface
                text={streamedText}
                isGenerating={isGenerating}
                title={title}
              />
            ) : isInstagramContent ? (
              <InstagramSurface
                text={streamedText}
                isGenerating={isGenerating}
                title={title}
              />
            ) : isXContent ? (
              <XSurface
                text={streamedText}
                isGenerating={isGenerating}
                title={title}
              />
            ) : isLinkedInContent ? (
              <LinkedInSurface
                text={streamedText}
                isGenerating={isGenerating}
                title={title}
              />
            ) : (
              <WritingSurface
                text={streamedText}
                isGenerating={isGenerating}
                title={title}
              />
            )}

            {/* Progress */}
            <div className="mt-10">
              <ProgressVisualization
                progress={progress}
                currentStage={currentStage?.label}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default GenerationTheater;
