'use client';

/**
 * VARIANT 4: AMBIENT / ARTISTIC
 *
 * Design Philosophy:
 * - Abstract, calming visualization
 * - Focus on the "feeling" of creation
 * - Subtle particle/wave animations
 * - Minimal text, maximum atmosphere
 * - Almost meditative experience
 */

import React, { useEffect, useState } from 'react';
import { GenerationTheaterProps, GenerationStage } from './types';

// Floating orbs animation (CSS-based for simplicity)
const FloatingOrbs = ({ isActive }: { isActive: boolean }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className={`
          absolute rounded-full blur-3xl transition-all duration-1000
          ${isActive ? 'opacity-60' : 'opacity-20'}
        `}
        style={{
          width: `${150 + i * 50}px`,
          height: `${150 + i * 50}px`,
          left: `${10 + i * 18}%`,
          top: `${20 + (i % 3) * 25}%`,
          background: `radial-gradient(circle, ${
            ['rgba(59, 130, 246, 0.5)', 'rgba(147, 51, 234, 0.5)', 'rgba(236, 72, 153, 0.4)', 'rgba(34, 197, 94, 0.4)', 'rgba(251, 146, 60, 0.4)'][i]
          }, transparent)`,
          animation: `float${i} ${8 + i * 2}s ease-in-out infinite`,
          animationDelay: `${i * 0.5}s`,
        }}
      />
    ))}
    <style jsx>{`
      @keyframes float0 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, -20px); } }
      @keyframes float1 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-20px, 30px); } }
      @keyframes float2 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(25px, 25px); } }
      @keyframes float3 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-30px, -15px); } }
      @keyframes float4 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(15px, -30px); } }
    `}</style>
  </div>
);

// Pulsing ring animation
const PulsingRings = ({ progress }: { progress: number }) => (
  <div className="relative w-48 h-48 mx-auto mb-12">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="absolute inset-0 rounded-full border-2 border-white/10"
        style={{
          animation: `pulse-ring 3s ease-out infinite`,
          animationDelay: `${i * 1}s`,
        }}
      />
    ))}
    {/* Center progress circle */}
    <div className="absolute inset-4 rounded-full bg-gray-900/80 flex items-center justify-center backdrop-blur-sm">
      <div className="text-center">
        <p className="text-4xl font-light text-white">{progress}</p>
        <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">percent</p>
      </div>
    </div>
    <style jsx>{`
      @keyframes pulse-ring {
        0% { transform: scale(1); opacity: 0.5; }
        100% { transform: scale(1.5); opacity: 0; }
      }
    `}</style>
  </div>
);

// Minimal stage indicator - words only
const StageWord = ({ stage, isActive }: { stage: GenerationStage; isActive: boolean }) => (
  <span
    className={`
      inline-block px-4 py-2 text-sm transition-all duration-500
      ${isActive
        ? 'text-white opacity-100'
        : 'text-gray-600 opacity-50'
      }
    `}
  >
    {stage.label.split(' ').slice(-1)[0]}
    {/* Just show last word for brevity */}
  </span>
);

// Elegant text fade-in area
const FadingTextArea = ({ text }: { text: string }) => {
  // Split text into words for staggered fade-in effect
  const words = text.split(' ');

  return (
    <div className="max-w-2xl mx-auto px-8">
      <div className="min-h-[250px] text-xl leading-relaxed text-gray-300 font-light text-center">
        {words.map((word, i) => (
          <span
            key={i}
            className="inline-block mx-1 animate-fade-in"
            style={{
              animationDelay: `${i * 0.05}s`,
              animationFillMode: 'both',
            }}
          >
            {word}
          </span>
        ))}
        <span className="inline-block w-0.5 h-6 bg-white/50 ml-2 animate-pulse" />
      </div>
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

// Wave progress bar
const WaveProgress = ({ progress }: { progress: number }) => (
  <div className="w-full max-w-md mx-auto mt-12">
    <div className="h-1 bg-gray-800 rounded-full overflow-hidden relative">
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 relative"
        style={{ width: `${progress}%` }}
      >
        {/* Animated shimmer */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            animation: 'shimmer 1.5s infinite',
          }}
        />
      </div>
    </div>
    <style jsx>{`
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    `}</style>
  </div>
);

export const AmbientTheater: React.FC<GenerationTheaterProps> = ({
  stages,
  currentStageIndex,
  streamedText,
  isGenerating,
  progress,
  onCancel,
}) => {
  const currentStage = stages[currentStageIndex];

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Floating background orbs */}
      <FloatingOrbs isActive={isGenerating} />

      {/* Content */}
      <div className="relative z-10 py-20 px-6">
        {/* Cancel button - very subtle */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="absolute top-8 right-8 text-gray-600 hover:text-gray-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Pulsing progress rings */}
        <PulsingRings progress={progress} />

        {/* Current stage - centered, minimal */}
        <div className="text-center mb-12">
          <p className="text-gray-500 text-sm uppercase tracking-[0.3em] mb-2">
            Creating
          </p>
          <p className="text-2xl font-light text-white">
            {currentStage?.label}
          </p>
        </div>

        {/* Stage indicators */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {stages.map((stage, index) => (
            <React.Fragment key={stage.id}>
              <div
                className={`
                  w-2 h-2 rounded-full transition-all duration-500
                  ${index < currentStageIndex
                    ? 'bg-emerald-400'
                    : index === currentStageIndex
                      ? 'bg-white w-3 h-3'
                      : 'bg-gray-700'
                  }
                `}
              />
            </React.Fragment>
          ))}
        </div>

        {/* Text preview area */}
        <FadingTextArea text={streamedText.slice(-500)} />

        {/* Only show last ~500 chars for ambient feel */}

        {/* Wave progress */}
        <WaveProgress progress={progress} />
      </div>
    </div>
  );
};

export default AmbientTheater;
