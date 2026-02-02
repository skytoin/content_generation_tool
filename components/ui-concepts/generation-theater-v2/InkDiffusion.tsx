'use client';

/**
 * INK DIFFUSION
 *
 * Concept: Content emerges like ink diffusing through water or spreading on paper.
 * Each word "bleeds" into existence with organic, watercolor-like movement.
 *
 * Feel: Editorial, artistic, craft-focused — perfect for a content agency
 * Palette: Premium-Blend (Terracotta + Sage + Cream)
 */

import React, { useMemo } from 'react';
import { TheaterProps, COLORS } from './types';

const colors = COLORS.premiumBlend;

// Ink drop that spreads
const InkDrop = ({
  delay,
  x,
  y,
  size,
  color
}: {
  delay: number;
  x: number;
  y: number;
  size: number;
  color: string;
}) => (
  <div
    className="absolute rounded-full opacity-0"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      background: `radial-gradient(circle, ${color}40 0%, ${color}10 50%, transparent 70%)`,
      animation: `inkSpread 4s ease-out ${delay}s infinite`,
      filter: 'blur(20px)',
    }}
  />
);

// Single word with ink reveal effect
const InkWord = ({ word, index, isVisible }: { word: string; index: number; isVisible: boolean }) => (
  <span
    className="inline-block mx-1 relative"
    style={{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
      transition: `all 0.6s cubic-bezier(0.23, 1, 0.32, 1) ${index * 0.03}s`,
    }}
  >
    {/* Ink bleed effect behind text */}
    <span
      className="absolute inset-0 -z-10"
      style={{
        background: `radial-gradient(ellipse at center, ${colors.primary}15 0%, transparent 70%)`,
        filter: 'blur(8px)',
        transform: 'scale(2)',
        opacity: isVisible ? 1 : 0,
        transition: `opacity 1s ease ${index * 0.03}s`,
      }}
    />
    {word}
  </span>
);

// Stage indicator as ink well
const InkWell = ({ stage, isActive, isComplete }: {
  stage: { label: string };
  isActive: boolean;
  isComplete: boolean;
}) => (
  <div className="flex items-center gap-3 py-2">
    <div
      className="relative w-3 h-3 rounded-full transition-all duration-700"
      style={{
        background: isComplete
          ? colors.accent
          : isActive
            ? colors.primary
            : '#e2e0dc',
        boxShadow: isActive
          ? `0 0 20px ${colors.primary}60, 0 0 40px ${colors.primary}30`
          : 'none',
      }}
    >
      {isActive && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: colors.primary,
            animation: 'inkPulse 2s ease-in-out infinite',
          }}
        />
      )}
    </div>
    <span
      className="text-sm transition-all duration-500"
      style={{
        color: isActive ? colors.text : isComplete ? colors.accent : colors.textMuted,
        fontFamily: "'Fraunces', serif",
        fontStyle: isActive ? 'italic' : 'normal',
      }}
    >
      {stage.label}
    </span>
  </div>
);

// Progress as ink filling a vessel
const InkProgress = ({ progress }: { progress: number }) => (
  <div className="relative h-1 w-full overflow-hidden rounded-full" style={{ background: '#e8e6e2' }}>
    {/* Main fill */}
    <div
      className="absolute inset-y-0 left-0 transition-all duration-500 ease-out"
      style={{
        width: `${progress}%`,
        background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
      }}
    />
    {/* Ink bleeding edge effect */}
    <div
      className="absolute inset-y-0 w-8 transition-all duration-500"
      style={{
        left: `calc(${progress}% - 1rem)`,
        background: `linear-gradient(90deg, ${colors.primary}80, transparent)`,
        filter: 'blur(4px)',
      }}
    />
  </div>
);

export const InkDiffusion: React.FC<TheaterProps> = ({
  stages,
  currentStageIndex,
  streamedText,
  isGenerating,
  progress,
  onCancel,
}) => {
  const words = useMemo(() => streamedText.split(' ').filter(Boolean), [streamedText]);

  // Generate random ink drops
  const inkDrops = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 100 + Math.random() * 150,
      delay: Math.random() * 4,
      color: i % 2 === 0 ? colors.primary : colors.accent,
    })),
  []);

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: colors.bg }}
    >
      {/* Floating ink drops in background */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {isGenerating && inkDrops.map(drop => (
          <InkDrop key={drop.id} {...drop} />
        ))}
      </div>

      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="flex items-start justify-between mb-16">
          <div>
            <p
              className="text-xs uppercase tracking-[0.3em] mb-3"
              style={{ color: colors.textMuted }}
            >
              Crafting your content
            </p>
            <h1
              className="text-4xl font-light"
              style={{
                color: colors.text,
                fontFamily: "'Fraunces', serif",
              }}
            >
              Words taking shape
            </h1>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-sm px-4 py-2 rounded-lg transition-all hover:opacity-70"
              style={{
                color: colors.textMuted,
                border: `1px solid ${colors.textMuted}30`,
              }}
            >
              Cancel
            </button>
          )}
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Stages column */}
          <div className="lg:col-span-4">
            <p
              className="text-xs uppercase tracking-[0.2em] mb-6"
              style={{ color: colors.textMuted }}
            >
              Process
            </p>
            <div className="space-y-1">
              {stages.map((stage, index) => (
                <InkWell
                  key={stage.id}
                  stage={stage}
                  isActive={index === currentStageIndex}
                  isComplete={index < currentStageIndex}
                />
              ))}
            </div>
          </div>

          {/* Content column */}
          <div className="lg:col-span-8">
            <p
              className="text-xs uppercase tracking-[0.2em] mb-6"
              style={{ color: colors.textMuted }}
            >
              Preview
            </p>

            {/* Writing area - like premium paper */}
            <div
              className="min-h-[400px] p-10 rounded-sm relative"
              style={{
                background: '#fffffe',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.06)',
              }}
            >
              {/* Subtle top border like a notebook */}
              <div
                className="absolute top-0 left-10 right-10 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${colors.primary}20, transparent)` }}
              />

              {/* Text content */}
              <div
                className="text-xl leading-[1.9] tracking-wide"
                style={{
                  color: colors.text,
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 300,
                }}
              >
                {words.map((word, index) => (
                  <InkWord
                    key={`${word}-${index}`}
                    word={word}
                    index={index}
                    isVisible={true}
                  />
                ))}
                {isGenerating && (
                  <span
                    className="inline-block w-0.5 h-6 ml-1"
                    style={{
                      background: colors.primary,
                      animation: 'inkCursor 1s ease-in-out infinite',
                    }}
                  />
                )}
              </div>
            </div>

            {/* Progress */}
            <div className="mt-8">
              <InkProgress progress={progress} />
              <div className="flex justify-between mt-3">
                <span
                  className="text-xs"
                  style={{ color: colors.textMuted }}
                >
                  {stages[currentStageIndex]?.label}
                </span>
                <span
                  className="text-xs tabular-nums"
                  style={{ color: colors.textMuted }}
                >
                  {progress}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes inkSpread {
          0% { transform: scale(0.5); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes inkPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes inkCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default InkDiffusion;
