'use client';

/**
 * GENERATION PAGE - Enhanced Ink Diffusion
 *
 * The premium content generation experience.
 * More expensive, professional, innovative.
 */

import React, { useMemo } from 'react';
import { tokens } from '../design-tokens';

interface GenerationPageProps {
  stages: Array<{ id: string; label: string }>;
  currentStageIndex: number;
  streamedText: string;
  isGenerating: boolean;
  progress: number;
}

// Animated ink drop with more sophisticated effect
const InkDrop = ({ x, y, size, delay, color }: {
  x: number; y: number; size: number; delay: number; color: string;
}) => (
  <div
    className="absolute rounded-full pointer-events-none"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      background: `radial-gradient(circle at 30% 30%, ${color}60 0%, ${color}20 40%, transparent 70%)`,
      filter: 'blur(30px)',
      animation: `inkBloom 6s ease-out ${delay}s infinite`,
      opacity: 0,
    }}
  />
);

// Premium stage indicator
const StageIndicator = ({ label, isActive, isComplete, index }: {
  label: string; isActive: boolean; isComplete: boolean; index: number;
}) => (
  <div
    className="flex items-center gap-4 py-4 transition-all duration-700"
    style={{
      opacity: isComplete ? 0.5 : 1,
      transform: isActive ? 'translateX(8px)' : 'translateX(0)',
    }}
  >
    {/* Ink well indicator */}
    <div className="relative">
      <div
        className="w-3 h-3 rounded-full transition-all duration-500"
        style={{
          background: isComplete
            ? tokens.colors.sage[500]
            : isActive
              ? tokens.colors.ink[700]
              : tokens.colors.paper.border,
          boxShadow: isActive
            ? `0 0 0 4px ${tokens.colors.ink[100]}, 0 0 20px ${tokens.colors.ink[300]}`
            : 'none',
        }}
      />
      {/* Ripple for active */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: tokens.colors.ink[700],
            animation: 'inkRipple 2s ease-out infinite',
          }}
        />
      )}
    </div>

    {/* Label */}
    <span
      className="text-sm transition-all duration-500"
      style={{
        color: isActive
          ? tokens.colors.ink[700]
          : isComplete
            ? tokens.colors.sage[600]
            : tokens.colors.text.muted,
        fontFamily: tokens.fonts.serif,
        fontStyle: isActive ? 'italic' : 'normal',
        fontWeight: isActive ? 500 : 400,
      }}
    >
      {label}
      {isActive && (
        <span
          className="ml-2 inline-block"
          style={{ color: tokens.colors.ink[400] }}
        >
          ...
        </span>
      )}
    </span>
  </div>
);

// Premium writing surface
const WritingSurface = ({ text, isGenerating }: { text: string; isGenerating: boolean }) => {
  const words = useMemo(() => text.split(' ').filter(Boolean), [text]);

  return (
    <div className="relative">
      {/* Outer frame - like a premium picture frame */}
      <div
        className="absolute -inset-4 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${tokens.colors.paper.dark} 0%, ${tokens.colors.paper.border} 100%)`,
          padding: '1px',
        }}
      >
        <div
          className="w-full h-full rounded-2xl"
          style={{ background: tokens.colors.paper.cream }}
        />
      </div>

      {/* Main writing surface */}
      <div
        className="relative min-h-[450px] p-12 rounded-xl overflow-hidden"
        style={{
          background: tokens.colors.paper.white,
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.8),
            0 25px 50px -12px rgba(26, 26, 26, 0.15),
            0 0 0 1px ${tokens.colors.paper.border}
          `,
        }}
      >
        {/* Subtle paper texture */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Top accent line */}
        <div
          className="absolute top-0 left-12 right-12 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${tokens.colors.ink[200]}, transparent)`,
          }}
        />

        {/* Left margin line (like notebook paper) */}
        <div
          className="absolute top-12 bottom-12 left-10 w-px"
          style={{ background: tokens.colors.ink[100] }}
        />

        {/* Content area */}
        <div className="relative pl-6">
          {/* Document header */}
          <div className="mb-8 pb-6 border-b" style={{ borderColor: tokens.colors.paper.border }}>
            <p
              className="text-xs uppercase tracking-[0.25em] mb-2"
              style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
            >
              Draft in Progress
            </p>
            <div className="flex items-baseline gap-4">
              <h2
                className="text-2xl"
                style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
              >
                Your Content
              </h2>
              <span
                className="text-sm"
                style={{ color: tokens.colors.text.subtle, fontFamily: tokens.fonts.mono }}
              >
                {words.length} words
              </span>
            </div>
          </div>

          {/* Text content with word-by-word animation */}
          <div
            className="text-xl leading-[2.2] tracking-wide"
            style={{
              color: tokens.colors.text.primary,
              fontFamily: tokens.fonts.serif,
              fontWeight: 300,
            }}
          >
            {words.map((word, index) => (
              <span
                key={`${word}-${index}`}
                className="inline-block mx-[0.2em] transition-all duration-500"
                style={{
                  opacity: 1,
                  transform: 'translateY(0)',
                  transitionDelay: `${index * 0.01}s`,
                }}
              >
                {word}
              </span>
            ))}

            {/* Cursor */}
            {isGenerating && (
              <span
                className="inline-block w-0.5 h-7 ml-1 rounded-full"
                style={{
                  background: tokens.colors.ink[700],
                  boxShadow: `0 0 8px ${tokens.colors.ink[400]}`,
                  animation: 'inkCursor 1.2s ease-in-out infinite',
                }}
              />
            )}
          </div>
        </div>

        {/* Ink stain decoration - subtle */}
        {isGenerating && (
          <div
            className="absolute bottom-8 right-8 w-24 h-24 opacity-[0.03]"
            style={{
              background: `radial-gradient(circle, ${tokens.colors.ink[700]} 0%, transparent 70%)`,
              filter: 'blur(10px)',
            }}
          />
        )}
      </div>
    </div>
  );
};

// Elegant progress visualization
const ProgressVisualization = ({ progress, currentStage }: { progress: number; currentStage?: string }) => (
  <div className="space-y-4">
    {/* Progress bar */}
    <div className="relative">
      <div
        className="h-1 rounded-full overflow-hidden"
        style={{ background: tokens.colors.paper.border }}
      >
        {/* Main fill */}
        <div
          className="h-full transition-all duration-700 ease-out relative"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${tokens.colors.ink[700]}, ${tokens.colors.sage[500]})`,
          }}
        >
          {/* Shimmer */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              animation: 'shimmer 2s infinite',
            }}
          />
        </div>

        {/* Bleeding edge effect */}
        <div
          className="absolute top-0 h-full w-12 transition-all duration-700"
          style={{
            left: `calc(${progress}% - 24px)`,
            background: `linear-gradient(90deg, ${tokens.colors.ink[500]}80, transparent)`,
            filter: 'blur(4px)',
          }}
        />
      </div>
    </div>

    {/* Labels */}
    <div className="flex items-center justify-between">
      <span
        className="text-sm"
        style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.serif }}
      >
        {currentStage || 'Preparing...'}
      </span>
      <span
        className="text-sm tabular-nums"
        style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.mono }}
      >
        {progress}%
      </span>
    </div>
  </div>
);

export const GenerationPage: React.FC<GenerationPageProps> = ({
  stages,
  currentStageIndex,
  streamedText,
  isGenerating,
  progress,
}) => {
  // Generate random ink drops
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
      {/* Animated ink drops in background */}
      <div className="absolute inset-0 pointer-events-none">
        {isGenerating && inkDrops.map((drop, i) => (
          <InkDrop key={i} {...drop} />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 py-16">
        {/* Header */}
        <header className="mb-16">
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-xs uppercase tracking-[0.3em] mb-3"
                style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
              >
                Content Generation
              </p>
              <h1
                className="text-5xl font-light mb-3"
                style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
              >
                Crafting Your Words
              </h1>
              <p
                className="text-xl"
                style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.serif }}
              >
                Watch as your content takes shape
              </p>
            </div>

            <button
              className="px-5 py-2.5 rounded-lg text-sm transition-all hover:opacity-70"
              style={{
                color: tokens.colors.text.muted,
                border: `1px solid ${tokens.colors.paper.border}`,
                fontFamily: tokens.fonts.sans,
              }}
            >
              Cancel
            </button>
          </div>
        </header>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Stages sidebar */}
          <aside className="lg:col-span-3">
            <p
              className="text-xs uppercase tracking-[0.2em] mb-6"
              style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
            >
              Process
            </p>
            <div className="space-y-1">
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

          {/* Writing surface */}
          <main className="lg:col-span-9">
            <WritingSurface text={streamedText} isGenerating={isGenerating} />

            {/* Progress */}
            <div className="mt-10">
              <ProgressVisualization progress={progress} currentStage={currentStage?.label} />
            </div>
          </main>
        </div>
      </div>

      {/* Keyframes */}
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
      `}</style>
    </div>
  );
};

export default GenerationPage;
