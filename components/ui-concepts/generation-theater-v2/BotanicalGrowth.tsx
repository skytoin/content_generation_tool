'use client';

/**
 * BOTANICAL GROWTH
 *
 * Concept: Content grows organically like plants in time-lapse.
 * Vines, leaves, stems unfurl to reveal text.
 * Nature meets technology — organic intelligence.
 *
 * Feel: Natural, alive, growth-oriented — content as living thing
 * Palette: Premium-Blend (Sage greens + Terracotta accents + Cream)
 */

import React, { useMemo } from 'react';
import { TheaterProps, COLORS } from './types';

const colors = COLORS.premiumBlend;

// Additional botanical colors
const botanical = {
  leafDark: '#3d5a3d',
  leafMid: '#5a7a5a',
  leafLight: '#8aab7a',
  stem: '#4a634a',
  flower: colors.primary, // Terracotta
  pollen: '#f4d03f',
};

// Growing vine SVG
const GrowingVine = ({
  progress,
  side
}: {
  progress: number;
  side: 'left' | 'right';
}) => {
  const flip = side === 'right' ? -1 : 1;

  return (
    <svg
      className="absolute pointer-events-none"
      style={{
        [side]: 0,
        top: '10%',
        width: '120px',
        height: '80%',
        transform: `scaleX(${flip})`,
      }}
      viewBox="0 0 100 400"
    >
      {/* Main stem */}
      <path
        d="M 50 400 Q 30 300 50 200 Q 70 100 50 0"
        fill="none"
        stroke={botanical.stem}
        strokeWidth="3"
        strokeLinecap="round"
        style={{
          strokeDasharray: 500,
          strokeDashoffset: 500 - (progress / 100) * 500,
          transition: 'stroke-dashoffset 1s ease-out',
        }}
      />

      {/* Leaves */}
      {[0.2, 0.4, 0.6, 0.8].map((pos, i) => (
        <g
          key={i}
          style={{
            opacity: progress > pos * 100 ? 1 : 0,
            transform: `translateY(${400 - pos * 400}px)`,
            transition: 'opacity 0.5s ease',
            transitionDelay: `${pos}s`,
          }}
        >
          <ellipse
            cx={i % 2 === 0 ? 30 : 70}
            cy={0}
            rx="20"
            ry="8"
            fill={i % 2 === 0 ? botanical.leafMid : botanical.leafLight}
            style={{
              transformOrigin: i % 2 === 0 ? '100% 50%' : '0% 50%',
              transform: `rotate(${i % 2 === 0 ? -30 : 30}deg) scale(${progress > pos * 100 + 10 ? 1 : 0})`,
              transition: 'transform 0.5s ease',
              transitionDelay: `${pos + 0.2}s`,
            }}
          />
        </g>
      ))}

      {/* Small flower at progress point */}
      <circle
        cx="50"
        cy={400 - (progress / 100) * 400}
        r="6"
        fill={botanical.flower}
        style={{
          opacity: progress > 10 ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
    </svg>
  );
};

// Leaf decoration for stage
const LeafIcon = ({ isActive, isComplete }: { isActive: boolean; isComplete: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2C7 2 3 6 3 12c0 4 2 7 5 9 1-3 4-5 4-9 0-2 2-4 4-4s4 2 4 4c0 4 3 6 4 9 3-2 5-5 5-9 0-6-4-10-9-10z"
      fill={isComplete ? botanical.leafMid : isActive ? botanical.leafLight : '#e5e5e5'}
      style={{ transition: 'fill 0.5s ease' }}
    />
    {isActive && (
      <circle cx="12" cy="10" r="3" fill={botanical.flower} opacity="0.8">
        <animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite" />
      </circle>
    )}
  </svg>
);

// Growth stage indicator
const GrowthStage = ({
  stage,
  isActive,
  isComplete
}: {
  stage: { label: string };
  isActive: boolean;
  isComplete: boolean;
}) => (
  <div
    className="flex items-center gap-4 py-4 border-b transition-all duration-500"
    style={{ borderColor: isActive ? `${botanical.leafMid}40` : '#f0eeeb' }}
  >
    <LeafIcon isActive={isActive} isComplete={isComplete} />
    <span
      className="flex-1 text-sm transition-all duration-500"
      style={{
        color: isActive ? colors.text : isComplete ? botanical.leafDark : colors.textMuted,
        fontFamily: "'Fraunces', serif",
      }}
    >
      {stage.label}
    </span>
    {isActive && (
      <span
        className="text-xs"
        style={{ color: botanical.leafMid }}
      >
        growing...
      </span>
    )}
    {isComplete && (
      <span
        className="text-xs"
        style={{ color: botanical.flower }}
      >
        bloomed
      </span>
    )}
  </div>
);

// Organic text container
const OrganicText = ({ text, isGenerating }: { text: string; isGenerating: boolean }) => {
  const words = useMemo(() => text.split(' ').filter(Boolean), [text]);

  return (
    <div
      className="relative min-h-[400px] p-10 rounded-3xl overflow-hidden"
      style={{
        background: '#fffffe',
        boxShadow: '0 20px 60px rgba(93, 122, 93, 0.1)',
      }}
    >
      {/* Organic corner decorations */}
      <svg
        className="absolute top-0 left-0 w-32 h-32 pointer-events-none"
        viewBox="0 0 100 100"
      >
        <path
          d="M 0 0 Q 50 10 40 50 Q 30 30 0 40 Z"
          fill={`${botanical.leafLight}20`}
        />
      </svg>
      <svg
        className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none"
        viewBox="0 0 100 100"
        style={{ transform: 'rotate(180deg)' }}
      >
        <path
          d="M 0 0 Q 50 10 40 50 Q 30 30 0 40 Z"
          fill={`${botanical.leafLight}20`}
        />
      </svg>

      {/* Text content with word-by-word growth effect */}
      <div
        className="relative text-xl leading-[2]"
        style={{
          color: colors.text,
          fontFamily: "'Fraunces', serif",
          fontWeight: 300,
        }}
      >
        {words.map((word, i) => (
          <span
            key={i}
            className="inline-block mx-1"
            style={{
              opacity: 1,
              transform: 'translateY(0)',
              transition: `all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.02}s`,
            }}
          >
            {word}
          </span>
        ))}
        {isGenerating && (
          <span
            className="inline-block w-1 h-6 ml-1 rounded-full"
            style={{
              background: botanical.leafMid,
              animation: 'seedPulse 1.5s ease-in-out infinite',
            }}
          />
        )}
      </div>

      {/* Word count as "harvest" */}
      <div
        className="absolute bottom-6 right-8 flex items-center gap-2"
        style={{ color: colors.textMuted }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C7 2 3 6 3 12c0 4 2 7 5 9 1-3 4-5 4-9 0-2 2-4 4-4s4 2 4 4c0 4 3 6 4 9 3-2 5-5 5-9 0-6-4-10-9-10z" />
        </svg>
        <span className="text-xs">
          {words.length} words harvested
        </span>
      </div>
    </div>
  );
};

// Progress as growing stem
const GrowthProgress = ({ progress }: { progress: number }) => (
  <div className="relative">
    {/* Soil line */}
    <div
      className="h-3 rounded-full overflow-hidden relative"
      style={{ background: '#e8e5e0' }}
    >
      {/* Growth fill */}
      <div
        className="absolute inset-y-0 left-0 transition-all duration-700 ease-out"
        style={{
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${botanical.stem}, ${botanical.leafMid}, ${botanical.leafLight})`,
        }}
      />

      {/* Flower bud at tip */}
      <div
        className="absolute top-1/2 w-4 h-4 -mt-2 rounded-full transition-all duration-500"
        style={{
          left: `calc(${progress}% - 8px)`,
          background: botanical.flower,
          boxShadow: `0 0 10px ${botanical.flower}60`,
          transform: `scale(${progress > 0 ? 1 : 0})`,
        }}
      />
    </div>

    {/* Labels */}
    <div className="flex justify-between mt-3">
      <span
        className="text-xs"
        style={{
          color: colors.textMuted,
          fontFamily: "'Fraunces', serif",
        }}
      >
        Seed
      </span>
      <span
        className="text-xs"
        style={{
          color: progress === 100 ? botanical.flower : colors.textMuted,
          fontFamily: "'Fraunces', serif",
        }}
      >
        {progress === 100 ? 'In full bloom' : `${progress}% grown`}
      </span>
      <span
        className="text-xs"
        style={{
          color: colors.textMuted,
          fontFamily: "'Fraunces', serif",
        }}
      >
        Bloom
      </span>
    </div>
  </div>
);

export const BotanicalGrowth: React.FC<TheaterProps> = ({
  stages,
  currentStageIndex,
  streamedText,
  isGenerating,
  progress,
  onCancel,
}) => {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: colors.bg }}
    >
      {/* Growing vines on sides */}
      <GrowingVine progress={progress} side="left" />
      <GrowingVine progress={progress} side="right" />

      {/* Subtle texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L30 60M0 30L60 30' stroke='%23000' stroke-width='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="flex items-start justify-between mb-16">
          <div>
            <p
              className="text-xs uppercase tracking-[0.3em] mb-3"
              style={{ color: botanical.leafMid }}
            >
              Cultivating ideas
            </p>
            <h1
              className="text-4xl font-light"
              style={{
                color: colors.text,
                fontFamily: "'Fraunces', serif",
              }}
            >
              Watch your content grow
            </h1>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-sm px-4 py-2 rounded-full transition-all"
              style={{
                color: colors.textMuted,
                border: `1px solid ${botanical.leafMid}30`,
              }}
            >
              Prune
            </button>
          )}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Growth stages */}
          <div className="lg:col-span-4">
            <p
              className="text-xs uppercase tracking-[0.2em] mb-6"
              style={{ color: colors.textMuted }}
            >
              Growth Stages
            </p>
            <div
              className="p-6 rounded-2xl"
              style={{
                background: '#fffffe',
                boxShadow: '0 10px 40px rgba(93, 122, 93, 0.08)',
              }}
            >
              {stages.map((stage, index) => (
                <GrowthStage
                  key={stage.id}
                  stage={stage}
                  isActive={index === currentStageIndex}
                  isComplete={index < currentStageIndex}
                />
              ))}
            </div>
          </div>

          {/* Content garden */}
          <div className="lg:col-span-8">
            <p
              className="text-xs uppercase tracking-[0.2em] mb-6"
              style={{ color: colors.textMuted }}
            >
              Your Garden
            </p>
            <OrganicText text={streamedText} isGenerating={isGenerating} />
          </div>
        </div>

        {/* Progress */}
        <div className="mt-16">
          <GrowthProgress progress={progress} />
        </div>
      </div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes seedPulse {
          0%, 100% { transform: scaleY(1); opacity: 1; }
          50% { transform: scaleY(1.3); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default BotanicalGrowth;
