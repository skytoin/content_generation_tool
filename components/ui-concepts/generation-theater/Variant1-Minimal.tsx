'use client';

/**
 * VARIANT 1: MINIMAL ELEGANT
 *
 * Design Philosophy:
 * - Less is more - sophisticated restraint
 * - Single accent color, lots of whitespace
 * - Subtle animations that don't distract
 * - Focus on the content being generated
 * - Professional, Notion-like aesthetic
 */

import React from 'react';
import { GenerationTheaterProps, GenerationStage } from './types';

// Minimal stage indicator - just dots
const StageIndicator = ({
  stages,
  currentIndex
}: {
  stages: GenerationStage[];
  currentIndex: number;
}) => (
  <div className="flex items-center gap-2 mb-8">
    {stages.map((stage, index) => (
      <div
        key={stage.id}
        className={`
          w-2 h-2 rounded-full transition-all duration-500
          ${index < currentIndex
            ? 'bg-emerald-500'
            : index === currentIndex
              ? 'bg-blue-500 animate-pulse scale-125'
              : 'bg-gray-200'
          }
        `}
        title={stage.label}
      />
    ))}
  </div>
);

// Current stage label - simple text
const CurrentStageLabel = ({ stage }: { stage: GenerationStage }) => (
  <div className="mb-6">
    <p className="text-sm text-gray-500 font-medium tracking-wide uppercase">
      {stage.label}
    </p>
  </div>
);

// Streaming text area - clean and focused
const StreamingTextArea = ({ text }: { text: string }) => (
  <div className="relative">
    <div
      className="
        min-h-[300px] p-8
        bg-gray-50 rounded-lg
        font-serif text-lg leading-relaxed text-gray-800
        border border-gray-100
      "
    >
      {text}
      <span className="inline-block w-0.5 h-5 bg-blue-500 ml-1 animate-pulse" />
    </div>
  </div>
);

// Simple progress bar
const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="mt-6">
    <div className="h-0.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-blue-500 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
    <p className="text-xs text-gray-400 mt-2 text-right">{progress}%</p>
  </div>
);

export const MinimalTheater: React.FC<GenerationTheaterProps> = ({
  stages,
  currentStageIndex,
  streamedText,
  isGenerating,
  progress,
  onCancel,
}) => {
  const currentStage = stages[currentStageIndex];

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-light text-gray-900">
          Generating your content
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Stage dots */}
      <StageIndicator stages={stages} currentIndex={currentStageIndex} />

      {/* Current stage */}
      {currentStage && <CurrentStageLabel stage={currentStage} />}

      {/* Content area */}
      <StreamingTextArea text={streamedText} />

      {/* Progress */}
      <ProgressBar progress={progress} />
    </div>
  );
};

export default MinimalTheater;
