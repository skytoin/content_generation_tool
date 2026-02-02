'use client';

/**
 * ARCHITECT BLUEPRINT
 *
 * Concept: Content is "constructed" like architectural blueprints.
 * Grid lines, measurements, annotations — then fills in with substance.
 * The skeleton becomes the building.
 *
 * Feel: Precision, craft, intentional structure — content as architecture
 * Palette: Original (Sky blue as blueprint color) + white accents
 */

import React from 'react';
import { TheaterProps, COLORS } from './types';

const colors = COLORS.original;

// Blueprint grid background
const BlueprintGrid = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {/* Major grid lines */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(${colors.primary}15 1px, transparent 1px),
          linear-gradient(90deg, ${colors.primary}15 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
    />
    {/* Minor grid lines */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(${colors.primary}08 1px, transparent 1px),
          linear-gradient(90deg, ${colors.primary}08 1px, transparent 1px)
        `,
        backgroundSize: '15px 15px',
      }}
    />
  </div>
);

// Blueprint annotation mark
const AnnotationMark = ({
  x, y, label, isActive
}: {
  x: string;
  y: string;
  label: string;
  isActive: boolean;
}) => (
  <div
    className="absolute flex items-center gap-2 transition-all duration-500"
    style={{
      left: x,
      top: y,
      opacity: isActive ? 1 : 0,
      transform: isActive ? 'translateX(0)' : 'translateX(-10px)',
    }}
  >
    <div
      className="w-2 h-2 rounded-full"
      style={{ background: colors.primary }}
    />
    <span
      className="text-[10px] uppercase tracking-widest whitespace-nowrap"
      style={{ color: colors.primary }}
    >
      {label}
    </span>
    <div
      className="w-16 h-px"
      style={{ background: `linear-gradient(90deg, ${colors.primary}, transparent)` }}
    />
  </div>
);

// Construction stage indicator
const ConstructionPhase = ({
  stage,
  index,
  isActive,
  isComplete
}: {
  stage: { label: string };
  index: number;
  isActive: boolean;
  isComplete: boolean;
}) => (
  <div className="flex items-center gap-4 py-3 border-b" style={{ borderColor: `${colors.primary}20` }}>
    {/* Phase number */}
    <div
      className="w-8 h-8 rounded flex items-center justify-center text-sm font-mono transition-all duration-500"
      style={{
        background: isComplete
          ? colors.primary
          : isActive
            ? `${colors.primary}20`
            : 'transparent',
        color: isComplete ? '#fff' : colors.primary,
        border: `1px solid ${colors.primary}${isComplete || isActive ? '' : '40'}`,
      }}
    >
      {String(index + 1).padStart(2, '0')}
    </div>

    {/* Phase label */}
    <div className="flex-1">
      <span
        className="text-sm transition-all duration-500"
        style={{
          color: isActive ? colors.text : isComplete ? colors.primary : colors.textMuted,
        }}
      >
        {stage.label}
      </span>
    </div>

    {/* Status indicator */}
    <div
      className="text-[10px] uppercase tracking-wider transition-all duration-500"
      style={{
        color: isComplete ? colors.accent : isActive ? colors.primary : colors.textMuted,
      }}
    >
      {isComplete ? 'COMPLETE' : isActive ? 'IN PROGRESS' : 'PENDING'}
    </div>
  </div>
);

// Blueprint-style text container
const BlueprintDocument = ({ text, isGenerating }: { text: string; isGenerating: boolean }) => (
  <div className="relative">
    {/* Document frame */}
    <div
      className="relative p-8 rounded-lg overflow-hidden"
      style={{
        background: '#fff',
        boxShadow: `
          0 0 0 1px ${colors.primary}20,
          4px 4px 0 0 ${colors.primary}10,
          8px 8px 0 0 ${colors.primary}05
        `,
      }}
    >
      {/* Corner marks */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
        <div
          key={corner}
          className={`absolute w-4 h-4 border-${colors.primary}`}
          style={{
            [corner.includes('top') ? 'top' : 'bottom']: '8px',
            [corner.includes('left') ? 'left' : 'right']: '8px',
            borderTop: corner.includes('top') ? `2px solid ${colors.primary}40` : 'none',
            borderBottom: corner.includes('bottom') ? `2px solid ${colors.primary}40` : 'none',
            borderLeft: corner.includes('left') ? `2px solid ${colors.primary}40` : 'none',
            borderRight: corner.includes('right') ? `2px solid ${colors.primary}40` : 'none',
          }}
        />
      ))}

      {/* Title block */}
      <div
        className="flex items-center justify-between pb-4 mb-6 border-b"
        style={{ borderColor: `${colors.primary}20` }}
      >
        <div>
          <p
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ color: colors.textMuted }}
          >
            Document Output
          </p>
          <p
            className="text-lg font-medium"
            style={{ color: colors.text }}
          >
            Content Draft
          </p>
        </div>
        <div className="text-right">
          <p
            className="text-[10px] uppercase tracking-widest"
            style={{ color: colors.textMuted }}
          >
            Scale
          </p>
          <p
            className="text-sm font-mono"
            style={{ color: colors.primary }}
          >
            1:1
          </p>
        </div>
      </div>

      {/* Content area with line numbers */}
      <div className="flex gap-6 min-h-[300px]">
        {/* Line numbers */}
        <div
          className="flex flex-col text-right text-xs font-mono select-none"
          style={{ color: `${colors.primary}40` }}
        >
          {text.split('\n\n').map((_, i) => (
            <span key={i} className="leading-[2.5]">{String(i + 1).padStart(3, '0')}</span>
          ))}
        </div>

        {/* Text content */}
        <div
          className="flex-1 text-base leading-[2.5]"
          style={{ color: colors.text }}
        >
          {text}
          {isGenerating && (
            <span
              className="inline-block w-2 h-5 ml-1"
              style={{
                background: colors.primary,
                animation: 'blueprintCursor 0.8s steps(2) infinite',
              }}
            />
          )}
        </div>
      </div>

      {/* Revision block */}
      <div
        className="mt-6 pt-4 border-t flex items-center justify-between"
        style={{ borderColor: `${colors.primary}20` }}
      >
        <div className="flex gap-8">
          <div>
            <p className="text-[9px] uppercase tracking-wider" style={{ color: colors.textMuted }}>
              Revision
            </p>
            <p className="text-sm font-mono" style={{ color: colors.primary }}>
              A
            </p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-wider" style={{ color: colors.textMuted }}>
              Words
            </p>
            <p className="text-sm font-mono" style={{ color: colors.primary }}>
              {text.split(/\s+/).filter(Boolean).length}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: isGenerating ? colors.accent : colors.primary }} />
          <span className="text-xs" style={{ color: colors.textMuted }}>
            {isGenerating ? 'Drafting...' : 'Complete'}
          </span>
        </div>
      </div>
    </div>
  </div>
);

// Technical progress bar
const TechnicalProgress = ({ progress }: { progress: number }) => (
  <div className="relative">
    {/* Track with measurement marks */}
    <div className="relative h-1 rounded-full" style={{ background: `${colors.primary}15` }}>
      {/* Measurement ticks */}
      {[0, 25, 50, 75, 100].map((tick) => (
        <div
          key={tick}
          className="absolute top-full w-px h-2"
          style={{
            left: `${tick}%`,
            background: `${colors.primary}40`,
          }}
        />
      ))}

      {/* Fill */}
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
        style={{
          width: `${progress}%`,
          background: colors.primary,
        }}
      />
    </div>

    {/* Labels */}
    <div className="flex justify-between mt-3">
      {[0, 25, 50, 75, 100].map((tick) => (
        <span
          key={tick}
          className="text-[10px] font-mono"
          style={{ color: progress >= tick ? colors.primary : colors.textMuted }}
        >
          {tick}%
        </span>
      ))}
    </div>
  </div>
);

export const ArchitectBlueprint: React.FC<TheaterProps> = ({
  stages,
  currentStageIndex,
  streamedText,
  isGenerating,
  progress,
  onCancel,
}) => {
  return (
    <div
      className="min-h-screen relative"
      style={{ background: '#f8fafc' }}
    >
      <BlueprintGrid />

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-8 h-1"
                style={{ background: colors.primary }}
              />
              <p
                className="text-[11px] uppercase tracking-[0.25em]"
                style={{ color: colors.primary }}
              >
                Scribengine Content Architect
              </p>
            </div>
            <h1
              className="text-3xl font-light"
              style={{ color: colors.text }}
            >
              Building Your Content
            </h1>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-sm px-4 py-2 border rounded transition-all"
              style={{
                color: colors.textMuted,
                borderColor: `${colors.primary}30`,
              }}
            >
              Cancel Build
            </button>
          )}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Stages panel */}
          <div className="lg:col-span-4">
            <div
              className="p-6 rounded-lg"
              style={{
                background: '#fff',
                border: `1px solid ${colors.primary}20`,
              }}
            >
              <p
                className="text-[10px] uppercase tracking-[0.2em] mb-4"
                style={{ color: colors.textMuted }}
              >
                Construction Phases
              </p>
              {stages.map((stage, index) => (
                <ConstructionPhase
                  key={stage.id}
                  stage={stage}
                  index={index}
                  isActive={index === currentStageIndex}
                  isComplete={index < currentStageIndex}
                />
              ))}
            </div>
          </div>

          {/* Document output */}
          <div className="lg:col-span-8">
            <BlueprintDocument text={streamedText} isGenerating={isGenerating} />
          </div>
        </div>

        {/* Progress */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <span
              className="text-[11px] uppercase tracking-[0.2em]"
              style={{ color: colors.textMuted }}
            >
              Overall Progress
            </span>
            <span
              className="text-sm font-mono"
              style={{ color: colors.primary }}
            >
              Phase {currentStageIndex + 1} of {stages.length}
            </span>
          </div>
          <TechnicalProgress progress={progress} />
        </div>
      </div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes blueprintCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ArchitectBlueprint;
