'use client';

/**
 * VARIANT 2: CINEMATIC / THEATRICAL
 *
 * Design Philosophy:
 * - Make generation feel like "witnessing intelligence"
 * - Rich visual feedback, subtle glow effects
 * - Stage-based progress with descriptions
 * - Dark mode aesthetic for drama
 * - Premium, high-end feel
 */

import React from 'react';
import { GenerationTheaterProps, GenerationStage } from './types';

// Animated stage list with glow effects
const StageList = ({
  stages,
  currentIndex
}: {
  stages: GenerationStage[];
  currentIndex: number;
}) => (
  <div className="space-y-3 mb-8">
    {stages.map((stage, index) => {
      const isActive = index === currentIndex;
      const isComplete = index < currentIndex;
      const isPending = index > currentIndex;

      return (
        <div
          key={stage.id}
          className={`
            flex items-center gap-4 px-4 py-3 rounded-lg
            transition-all duration-500
            ${isActive
              ? 'bg-blue-500/10 border border-blue-500/30 shadow-lg shadow-blue-500/10'
              : isComplete
                ? 'bg-emerald-500/5 border border-emerald-500/20'
                : 'bg-gray-800/50 border border-gray-700/50 opacity-40'
            }
          `}
        >
          {/* Status icon */}
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center
            transition-all duration-500
            ${isActive
              ? 'bg-blue-500 shadow-lg shadow-blue-500/50'
              : isComplete
                ? 'bg-emerald-500'
                : 'bg-gray-700'
            }
          `}>
            {isComplete ? (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : isActive ? (
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            ) : (
              <div className="w-2 h-2 bg-gray-500 rounded-full" />
            )}
          </div>

          {/* Label */}
          <span className={`
            text-sm font-medium
            ${isActive ? 'text-blue-300' : isComplete ? 'text-emerald-400' : 'text-gray-500'}
          `}>
            {stage.label}
            {isActive && <span className="ml-2 text-blue-400">...</span>}
          </span>
        </div>
      );
    })}
  </div>
);

// Glowing text generation area
const GlowingTextArea = ({ text, isGenerating }: { text: string; isGenerating: boolean }) => (
  <div className="relative">
    {/* Ambient glow behind */}
    {isGenerating && (
      <div className="absolute -inset-4 bg-blue-500/20 rounded-2xl blur-xl animate-pulse" />
    )}

    <div
      className={`
        relative min-h-[350px] p-8
        bg-gray-900 rounded-xl
        border transition-all duration-500
        ${isGenerating ? 'border-blue-500/50' : 'border-gray-700'}
      `}
    >
      {/* Shimmer overlay when generating */}
      {isGenerating && (
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div
            className="absolute inset-0 -translate-x-full animate-shimmer"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent)',
              animationDuration: '2s',
              animationIterationCount: 'infinite',
            }}
          />
        </div>
      )}

      {/* Text content */}
      <div className="relative font-serif text-lg leading-relaxed text-gray-200">
        {text}
        {isGenerating && (
          <span className="inline-block w-0.5 h-6 bg-blue-400 ml-1 animate-pulse" />
        )}
      </div>
    </div>
  </div>
);

// Cinematic progress indicator
const CinematicProgress = ({ progress, stage }: { progress: number; stage?: GenerationStage }) => (
  <div className="mt-8">
    {/* Progress bar with glow */}
    <div className="relative h-1 bg-gray-800 rounded-full overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
      {/* Glow on progress edge */}
      <div
        className="absolute top-0 h-full w-8 bg-gradient-to-r from-transparent to-blue-400/50 blur-sm transition-all duration-300"
        style={{ left: `calc(${progress}% - 2rem)` }}
      />
    </div>

    {/* Progress info */}
    <div className="flex items-center justify-between mt-4">
      <span className="text-xs text-gray-500 uppercase tracking-wider">
        {stage?.label || 'Processing'}
      </span>
      <span className="text-sm text-blue-400 font-mono">{progress}%</span>
    </div>
  </div>
);

export const CinematicTheater: React.FC<GenerationTheaterProps> = ({
  stages,
  currentStageIndex,
  streamedText,
  isGenerating,
  progress,
  onCancel,
}) => {
  const currentStage = stages[currentStageIndex];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto py-16 px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-2xl font-light text-white mb-2">
              Creating Your Content
            </h2>
            <p className="text-gray-500 text-sm">
              Our AI is analyzing, structuring, and crafting your piece
            </p>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg transition-all"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stages sidebar */}
          <div className="lg:col-span-1">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">
              Generation Pipeline
            </h3>
            <StageList stages={stages} currentIndex={currentStageIndex} />
          </div>

          {/* Content area */}
          <div className="lg:col-span-2">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">
              Live Preview
            </h3>
            <GlowingTextArea text={streamedText} isGenerating={isGenerating} />
            <CinematicProgress progress={progress} stage={currentStage} />
          </div>
        </div>
      </div>

      {/* Add shimmer keyframes */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default CinematicTheater;
