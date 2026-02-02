'use client';

/**
 * VARIANT 3: TECHNICAL / TRANSPARENT
 *
 * Design Philosophy:
 * - Show what's happening under the hood
 * - Terminal/developer aesthetic
 * - Real-time stats and metrics
 * - Appeals to power users who want visibility
 * - Builds trust through transparency
 */

import React from 'react';
import { GenerationTheaterProps, GenerationStage } from './types';

// Terminal-style log entries
const LogEntry = ({
  stage,
  index,
  currentIndex
}: {
  stage: GenerationStage;
  index: number;
  currentIndex: number;
}) => {
  const isActive = index === currentIndex;
  const isComplete = index < currentIndex;
  const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);

  return (
    <div className={`
      font-mono text-sm flex items-start gap-3 py-1
      ${isActive ? 'text-green-400' : isComplete ? 'text-gray-500' : 'text-gray-600'}
    `}>
      <span className="text-gray-600 shrink-0">{timestamp}</span>
      <span className={isComplete ? 'text-emerald-500' : isActive ? 'text-yellow-400' : 'text-gray-600'}>
        {isComplete ? '[DONE]' : isActive ? '[RUN ]' : '[WAIT]'}
      </span>
      <span>
        {stage.label}
        {isActive && <span className="animate-pulse">_</span>}
      </span>
    </div>
  );
};

// Stats panel
const StatsPanel = ({
  progress,
  wordCount,
  tokensUsed,
  modelName
}: {
  progress: number;
  wordCount: number;
  tokensUsed: number;
  modelName: string;
}) => (
  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-900 rounded-lg border border-gray-800">
    <div>
      <p className="text-xs text-gray-500 uppercase mb-1">Progress</p>
      <p className="text-2xl font-mono text-green-400">{progress}%</p>
    </div>
    <div>
      <p className="text-xs text-gray-500 uppercase mb-1">Words</p>
      <p className="text-2xl font-mono text-blue-400">{wordCount}</p>
    </div>
    <div>
      <p className="text-xs text-gray-500 uppercase mb-1">Tokens</p>
      <p className="text-lg font-mono text-purple-400">{tokensUsed.toLocaleString()}</p>
    </div>
    <div>
      <p className="text-xs text-gray-500 uppercase mb-1">Model</p>
      <p className="text-sm font-mono text-orange-400 truncate">{modelName}</p>
    </div>
  </div>
);

// Terminal-style text output
const TerminalOutput = ({ text }: { text: string }) => (
  <div className="bg-black rounded-lg border border-gray-800 overflow-hidden">
    {/* Terminal header */}
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-b border-gray-800">
      <div className="w-3 h-3 rounded-full bg-red-500" />
      <div className="w-3 h-3 rounded-full bg-yellow-500" />
      <div className="w-3 h-3 rounded-full bg-green-500" />
      <span className="ml-4 text-xs text-gray-500 font-mono">output.txt</span>
    </div>

    {/* Terminal content */}
    <div className="p-4 font-mono text-sm text-gray-300 min-h-[300px] overflow-auto">
      <pre className="whitespace-pre-wrap leading-relaxed">
        {text}
        <span className="inline-block w-2 h-4 bg-green-400 ml-0.5 animate-pulse" />
      </pre>
    </div>

    {/* Status bar */}
    <div className="px-4 py-2 bg-gray-900 border-t border-gray-800 flex items-center justify-between">
      <span className="text-xs text-gray-500 font-mono">
        streaming: active
      </span>
      <span className="text-xs text-gray-500 font-mono">
        utf-8 | LF
      </span>
    </div>
  </div>
);

// Pipeline visualization
const PipelineVisualization = ({ stages, currentIndex }: { stages: GenerationStage[]; currentIndex: number }) => (
  <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
    {stages.map((stage, index) => {
      const isActive = index === currentIndex;
      const isComplete = index < currentIndex;

      return (
        <React.Fragment key={stage.id}>
          <div className={`
            px-3 py-1.5 rounded text-xs font-mono whitespace-nowrap
            ${isComplete
              ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700'
              : isActive
                ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-600 animate-pulse'
                : 'bg-gray-800 text-gray-500 border border-gray-700'
            }
          `}>
            {stage.id}
          </div>
          {index < stages.length - 1 && (
            <div className={`
              w-4 h-0.5
              ${isComplete ? 'bg-emerald-600' : 'bg-gray-700'}
            `} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

export const TechnicalTheater: React.FC<GenerationTheaterProps & {
  wordCount?: number;
  tokensUsed?: number;
  modelName?: string;
}> = ({
  stages,
  currentStageIndex,
  streamedText,
  isGenerating,
  progress,
  onCancel,
  wordCount = 0,
  tokensUsed = 0,
  modelName = 'claude-sonnet-4',
}) => {
  // Calculate word count from streamed text if not provided
  const actualWordCount = wordCount || streamedText.split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <h2 className="text-lg font-mono text-gray-300">
              generation.process
            </h2>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-1.5 text-sm font-mono text-red-400 hover:text-red-300 border border-red-900 hover:border-red-700 rounded transition-all"
            >
              SIGTERM
            </button>
          )}
        </div>

        {/* Pipeline visualization */}
        <PipelineVisualization stages={stages} currentIndex={currentStageIndex} />

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Log panel */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-mono">
              // Pipeline Log
            </h3>
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 max-h-[200px] overflow-y-auto">
              {stages.map((stage, index) => (
                <LogEntry
                  key={stage.id}
                  stage={stage}
                  index={index}
                  currentIndex={currentStageIndex}
                />
              ))}
            </div>

            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-mono mt-6">
              // Stats
            </h3>
            <StatsPanel
              progress={progress}
              wordCount={actualWordCount}
              tokensUsed={tokensUsed}
              modelName={modelName}
            />
          </div>

          {/* Output terminal */}
          <div className="lg:col-span-3">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-mono mb-4">
              // Output Stream
            </h3>
            <TerminalOutput text={streamedText} />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-600 to-emerald-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalTheater;
