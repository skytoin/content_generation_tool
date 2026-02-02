'use client';

/**
 * PROGRESS VISUALIZATION
 *
 * Elegant progress bar with ink bleeding effect.
 * Shows current stage and percentage.
 */

import React from 'react';
import { tokens } from '../primitives/design-tokens';

interface ProgressVisualizationProps {
  progress: number;
  currentStage?: string;
}

export const ProgressVisualization: React.FC<ProgressVisualizationProps> = ({
  progress,
  currentStage,
}) => (
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
            className="absolute inset-0 progress-shimmer"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
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
        {Math.round(progress)}%
      </span>
    </div>
  </div>
);

export default ProgressVisualization;
