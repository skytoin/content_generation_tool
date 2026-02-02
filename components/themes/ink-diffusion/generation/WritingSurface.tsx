'use client';

/**
 * WRITING SURFACE
 *
 * Premium paper-like surface where generated content appears.
 * Features word-by-word animation and ink cursor effect.
 */

import React, { useMemo } from 'react';
import { tokens } from '../primitives/design-tokens';

interface WritingSurfaceProps {
  text: string;
  isGenerating: boolean;
  title?: string;
}

export const WritingSurface: React.FC<WritingSurfaceProps> = ({
  text,
  isGenerating,
  title = 'Your Content',
}) => {
  const words = useMemo(() => text.split(' ').filter(Boolean), [text]);

  return (
    <div className="relative">
      {/* Outer frame - like a premium picture frame */}
      <div
        className="absolute -inset-4 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${tokens.colors.paper.dark} 0%, ${tokens.colors.paper.border} 100%)`,
          padding: '1px',
        }}
      >
        <div
          className="w-full h-full rounded-2xl"
          style={{ background: tokens.colors.paper.cream }}
        />
      </div>

      {/* Main writing surface */}
      <div
        className="relative min-h-[450px] p-12 rounded-xl overflow-hidden"
        style={{
          background: tokens.colors.paper.white,
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.8),
            0 25px 50px -12px rgba(26, 26, 26, 0.15),
            0 0 0 1px ${tokens.colors.paper.border}
          `,
        }}
      >
        {/* Subtle paper texture */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Top accent line */}
        <div
          className="absolute top-0 left-12 right-12 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${tokens.colors.ink[200]}, transparent)`,
          }}
        />

        {/* Left margin line (like notebook paper) */}
        <div
          className="absolute top-12 bottom-12 left-10 w-px"
          style={{ background: tokens.colors.ink[100] }}
        />

        {/* Content area */}
        <div className="relative pl-6">
          {/* Document header */}
          <div className="mb-8 pb-6 border-b" style={{ borderColor: tokens.colors.paper.border }}>
            <p
              className="text-xs uppercase tracking-[0.25em] mb-2"
              style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
            >
              {isGenerating ? 'Draft in Progress' : 'Generated Content'}
            </p>
            <div className="flex items-baseline gap-4">
              <h2
                className="text-2xl"
                style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
              >
                {title}
              </h2>
              <span
                className="text-sm"
                style={{ color: tokens.colors.text.subtle, fontFamily: tokens.fonts.mono }}
              >
                {words.length} words
              </span>
            </div>
          </div>

          {/* Text content with word-by-word animation */}
          <div
            className="text-xl leading-[2.2] tracking-wide"
            style={{
              color: tokens.colors.text.primary,
              fontFamily: tokens.fonts.serif,
              fontWeight: 300,
            }}
          >
            {words.length > 0 ? (
              words.map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  className="inline-block mx-[0.2em] transition-all duration-500"
                  style={{
                    opacity: 1,
                    transform: 'translateY(0)',
                    transitionDelay: `${Math.min(index * 0.01, 0.5)}s`,
                  }}
                >
                  {word}
                </span>
              ))
            ) : (
              <span
                className="text-lg italic"
                style={{ color: tokens.colors.text.subtle }}
              >
                Content will appear here as it's generated...
              </span>
            )}

            {/* Cursor */}
            {isGenerating && (
              <span
                className="inline-block w-0.5 h-7 ml-1 rounded-full ink-cursor"
                style={{
                  background: tokens.colors.ink[700],
                  boxShadow: `0 0 8px ${tokens.colors.ink[400]}`,
                }}
              />
            )}
          </div>
        </div>

        {/* Ink stain decoration - subtle */}
        {isGenerating && (
          <div
            className="absolute bottom-8 right-8 w-24 h-24 opacity-[0.03]"
            style={{
              background: `radial-gradient(circle, ${tokens.colors.ink[700]} 0%, transparent 70%)`,
              filter: 'blur(10px)',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default WritingSurface;
