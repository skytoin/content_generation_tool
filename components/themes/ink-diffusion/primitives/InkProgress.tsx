'use client';

/**
 * INK PROGRESS
 *
 * Progress indicator with ink bleeding effect.
 * The progress "bleeds" forward like ink on paper.
 */

import React from 'react';
import { tokens } from './design-tokens';

interface InkProgressProps {
  value: number; // 0-100
  variant?: 'linear' | 'steps';
  steps?: string[];
  currentStep?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'ink' | 'sage';
  label?: string;
}

export const InkProgress: React.FC<InkProgressProps> = ({
  value,
  variant = 'linear',
  steps = [],
  currentStep = 0,
  showLabel = true,
  size = 'md',
  color = 'ink',
  label,
}) => {
  const sizeMap = {
    sm: { height: '4px', dot: '8px' },
    md: { height: '6px', dot: '12px' },
    lg: { height: '8px', dot: '16px' },
  };

  const colorMap = {
    ink: {
      primary: tokens.colors.ink[700],
      light: tokens.colors.ink[200],
      glow: tokens.colors.ink[400],
    },
    sage: {
      primary: tokens.colors.sage[500],
      light: tokens.colors.sage[200],
      glow: tokens.colors.sage[400],
    },
  };

  const colors = colorMap[color];
  const dimensions = sizeMap[size];

  if (variant === 'steps' && steps.length > 0) {
    return (
      <div className="w-full">
        {/* Steps progress */}
        <div className="relative flex items-center justify-between">
          {/* Background line */}
          <div
            className="absolute left-0 right-0 top-1/2 -translate-y-1/2"
            style={{
              height: '2px',
              background: colors.light,
            }}
          />

          {/* Progress line */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-700"
            style={{
              height: '2px',
              width: steps.length > 1 ? `${(currentStep / (steps.length - 1)) * 100}%` : '0%',
              background: colors.primary,
            }}
          />

          {/* Step dots */}
          {steps.map((step, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center">
              <div
                className="rounded-full transition-all duration-500 flex items-center justify-center"
                style={{
                  width: dimensions.dot,
                  height: dimensions.dot,
                  background: index <= currentStep ? colors.primary : tokens.colors.paper.white,
                  border: `2px solid ${index <= currentStep ? colors.primary : colors.light}`,
                  boxShadow: index === currentStep ? `0 0 12px ${colors.glow}` : 'none',
                }}
              >
                {index < currentStep && (
                  <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span
                className="absolute top-full mt-2 text-xs whitespace-nowrap transition-colors duration-300"
                style={{
                  color: index <= currentStep ? colors.primary : tokens.colors.text.muted,
                  fontFamily: tokens.fonts.sans,
                  fontWeight: index === currentStep ? 600 : 400,
                }}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Linear progress
  return (
    <div className="w-full">
      <div
        className="relative w-full overflow-hidden rounded-full"
        style={{
          height: dimensions.height,
          background: colors.light,
        }}
      >
        {/* Main fill */}
        <div
          className="absolute inset-y-0 left-0 transition-all duration-500 ease-out rounded-full"
          style={{
            width: `${value}%`,
            background: colors.primary,
          }}
        />

        {/* Ink bleeding edge */}
        <div
          className="absolute inset-y-0 w-8 transition-all duration-500 rounded-full"
          style={{
            left: `calc(${Math.max(0, value)}% - 16px)`,
            background: `linear-gradient(90deg, ${colors.primary}, ${colors.glow}50, transparent)`,
            filter: 'blur(2px)',
          }}
        />

        {/* Shimmer effect */}
        <div
          className="absolute inset-0 overflow-hidden rounded-full animate-shimmer"
          style={{
            background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)`,
            width: `${value}%`,
          }}
        />
      </div>

      {/* Label */}
      {showLabel && (
        <div className="flex justify-between mt-2">
          <span
            className="text-xs"
            style={{
              color: tokens.colors.text.muted,
              fontFamily: tokens.fonts.sans,
            }}
          >
            {label || 'Progress'}
          </span>
          <span
            className="text-xs font-medium tabular-nums"
            style={{
              color: colors.primary,
              fontFamily: tokens.fonts.mono,
            }}
          >
            {Math.round(value)}%
          </span>
        </div>
      )}

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

export default InkProgress;
