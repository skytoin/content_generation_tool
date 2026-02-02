'use client';

/**
 * VARIANT 5: CARD-BASED / MODULAR
 *
 * Design Philosophy:
 * - Each stage is a distinct card
 * - Progress through a visual "assembly line"
 * - Good for complex multi-stage pipelines
 * - Clear visual hierarchy
 * - Works well in light mode
 */

import React from 'react';
import { GenerationTheaterProps, GenerationStage } from './types';

// Stage card component
const StageCard = ({
  stage,
  index,
  currentIndex,
  isLast
}: {
  stage: GenerationStage;
  index: number;
  currentIndex: number;
  isLast: boolean;
}) => {
  const isActive = index === currentIndex;
  const isComplete = index < currentIndex;
  const isPending = index > currentIndex;

  return (
    <div className="flex items-start">
      {/* Card */}
      <div
        className={`
          relative w-64 p-5 rounded-xl transition-all duration-500
          ${isActive
            ? 'bg-white shadow-xl shadow-blue-100 border-2 border-blue-500 scale-105'
            : isComplete
              ? 'bg-emerald-50 border border-emerald-200'
              : 'bg-gray-50 border border-gray-200 opacity-60'
          }
        `}
      >
        {/* Status badge */}
        <div className={`
          absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center
          ${isComplete
            ? 'bg-emerald-500'
            : isActive
              ? 'bg-blue-500'
              : 'bg-gray-300'
          }
        `}>
          {isComplete ? (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          ) : isActive ? (
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          ) : (
            <span className="text-xs text-white font-medium">{index + 1}</span>
          )}
        </div>

        {/* Icon placeholder */}
        <div className={`
          w-10 h-10 rounded-lg mb-3 flex items-center justify-center
          ${isActive ? 'bg-blue-100' : isComplete ? 'bg-emerald-100' : 'bg-gray-100'}
        `}>
          <svg
            className={`w-5 h-5 ${isActive ? 'text-blue-600' : isComplete ? 'text-emerald-600' : 'text-gray-400'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {index === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />}
            {index === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />}
            {index === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />}
            {index === 3 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />}
            {index === 4 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />}
            {index >= 5 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
          </svg>
        </div>

        {/* Label */}
        <h4 className={`
          font-medium mb-1
          ${isActive ? 'text-blue-900' : isComplete ? 'text-emerald-800' : 'text-gray-500'}
        `}>
          {stage.label}
        </h4>

        {/* Status text */}
        <p className={`
          text-xs
          ${isActive ? 'text-blue-600' : isComplete ? 'text-emerald-600' : 'text-gray-400'}
        `}>
          {isComplete ? 'Completed' : isActive ? 'In progress...' : 'Waiting'}
        </p>

        {/* Progress bar for active card */}
        {isActive && (
          <div className="mt-3 h-1 bg-blue-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full animate-pulse"
              style={{ width: '60%' }}
            />
          </div>
        )}
      </div>

      {/* Connector arrow */}
      {!isLast && (
        <div className="flex items-center px-4 pt-8">
          <div className={`
            w-8 h-0.5
            ${isComplete ? 'bg-emerald-300' : 'bg-gray-200'}
          `} />
          <svg
            className={`w-4 h-4 -ml-1 ${isComplete ? 'text-emerald-300' : 'text-gray-200'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};

// Content preview card
const ContentPreviewCard = ({ text }: { text: string }) => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
    {/* Header */}
    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-emerald-500" />
        <span className="text-sm font-medium text-gray-700">Live Preview</span>
      </div>
      <span className="text-xs text-gray-400">Streaming...</span>
    </div>

    {/* Content */}
    <div className="p-6 min-h-[300px]">
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-700 leading-relaxed">
          {text}
          <span className="inline-block w-0.5 h-5 bg-blue-500 ml-1 animate-pulse" />
        </p>
      </div>
    </div>

    {/* Footer stats */}
    <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-6">
      <span className="text-xs text-gray-500">
        {text.split(/\s+/).filter(Boolean).length} words
      </span>
      <span className="text-xs text-gray-500">
        ~{Math.ceil(text.length / 5)} characters
      </span>
    </div>
  </div>
);

// Overall progress summary
const ProgressSummary = ({ stages, currentIndex, progress }: { stages: GenerationStage[]; currentIndex: number; progress: number }) => (
  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold">Generation Progress</h3>
        <p className="text-blue-200 text-sm">
          Step {currentIndex + 1} of {stages.length}
        </p>
      </div>
      <div className="text-right">
        <p className="text-3xl font-bold">{progress}%</p>
        <p className="text-blue-200 text-xs">complete</p>
      </div>
    </div>
    <div className="h-2 bg-blue-800/50 rounded-full overflow-hidden">
      <div
        className="h-full bg-white rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

export const CardsTheater: React.FC<GenerationTheaterProps> = ({
  stages,
  currentStageIndex,
  streamedText,
  isGenerating,
  progress,
  onCancel,
}) => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Creating Your Content</h1>
            <p className="text-gray-500 mt-1">Watch as our AI crafts your personalized content</p>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 rounded-lg transition-all"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Progress summary */}
        <div className="mb-8">
          <ProgressSummary stages={stages} currentIndex={currentStageIndex} progress={progress} />
        </div>

        {/* Stage cards - horizontal scroll on mobile */}
        <div className="mb-8 overflow-x-auto pb-4">
          <div className="flex items-start gap-0 min-w-max">
            {stages.map((stage, index) => (
              <StageCard
                key={stage.id}
                stage={stage}
                index={index}
                currentIndex={currentStageIndex}
                isLast={index === stages.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Content preview */}
        <ContentPreviewCard text={streamedText} />
      </div>
    </div>
  );
};

export default CardsTheater;
