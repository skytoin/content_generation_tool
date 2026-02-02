'use client';

/**
 * STAGE INDICATOR
 *
 * Shows pipeline stage progress with ink-style animations.
 * Displays active stage with ripple effect.
 */

import React from 'react';
import { tokens } from '../primitives/design-tokens';

interface StageIndicatorProps {
  label: string;
  isActive: boolean;
  isComplete: boolean;
  index: number;
}

export const StageIndicator: React.FC<StageIndicatorProps> = ({
  label,
  isActive,
  isComplete,
  index,
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
          className="absolute inset-0 rounded-full stage-ripple"
          style={{
            background: tokens.colors.ink[700],
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
          className="ml-2 inline-block animate-pulse"
          style={{ color: tokens.colors.ink[400] }}
        >
          ...
        </span>
      )}
    </span>
  </div>
);

export default StageIndicator;
