'use client';

/**
 * LIQUID METAL
 *
 * Concept: Molten, morphing metallic forms that solidify into content.
 * Chrome, gold, bronze tones. Luxury material feel.
 * Words emerge from liquid pools of metal.
 *
 * Feel: Ultra-premium, luxury, rare materials — content as precious metal
 * Palette: Dark base + metallic gradients (gold, silver, rose gold)
 */

import React from 'react';
import { TheaterProps } from './types';

// Metallic color palette
const metals = {
  gold: {
    base: '#D4AF37',
    light: '#F4E4BA',
    dark: '#996515',
    glow: 'rgba(212, 175, 55, 0.5)',
  },
  silver: {
    base: '#C0C0C0',
    light: '#E8E8E8',
    dark: '#808080',
    glow: 'rgba(192, 192, 192, 0.5)',
  },
  roseGold: {
    base: '#B76E79',
    light: '#E8C4C4',
    dark: '#8B5A5A',
    glow: 'rgba(183, 110, 121, 0.5)',
  },
  bronze: {
    base: '#CD7F32',
    light: '#E8C39E',
    dark: '#8B5A2B',
    glow: 'rgba(205, 127, 50, 0.5)',
  },
};

// Liquid metal blob
const MetalBlob = ({
  metal,
  size,
  x,
  y,
  delay,
  isActive
}: {
  metal: keyof typeof metals;
  size: number;
  x: number;
  y: number;
  delay: number;
  isActive: boolean;
}) => {
  const m = metals[metal];

  return (
    <div
      className="absolute rounded-full transition-all duration-1000"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        background: `radial-gradient(ellipse at 30% 30%, ${m.light}, ${m.base} 50%, ${m.dark})`,
        boxShadow: isActive
          ? `0 0 60px ${m.glow}, inset 0 -10px 30px ${m.dark}80`
          : `0 0 20px ${m.glow}, inset 0 -10px 30px ${m.dark}80`,
        transform: `translate(-50%, -50%) scale(${isActive ? 1.1 : 1})`,
        filter: 'blur(0.5px)',
        animation: isActive ? `metalMorph${delay} 4s ease-in-out infinite` : 'none',
        animationDelay: `${delay}s`,
      }}
    />
  );
};

// Stage as forging process
const ForgingStage = ({
  stage,
  index,
  isActive,
  isComplete,
  metal
}: {
  stage: { label: string };
  index: number;
  isActive: boolean;
  isComplete: boolean;
  metal: keyof typeof metals;
}) => {
  const m = metals[metal];

  return (
    <div className="flex items-center gap-4 py-4">
      {/* Metal ingot indicator */}
      <div
        className="w-10 h-6 rounded-sm transition-all duration-700 relative overflow-hidden"
        style={{
          background: isComplete || isActive
            ? `linear-gradient(135deg, ${m.light}, ${m.base} 50%, ${m.dark})`
            : '#2a2a2a',
          boxShadow: isActive
            ? `0 0 20px ${m.glow}, 0 4px 12px rgba(0,0,0,0.5)`
            : isComplete
              ? `0 0 10px ${m.glow}50, 0 2px 8px rgba(0,0,0,0.3)`
              : '0 2px 8px rgba(0,0,0,0.3)',
        }}
      >
        {/* Heat glow for active */}
        {isActive && (
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at center, ${m.light}60, transparent)`,
              animation: 'heatPulse 2s ease-in-out infinite',
            }}
          />
        )}
      </div>

      {/* Label */}
      <div className="flex-1">
        <span
          className="text-sm transition-all duration-500"
          style={{
            color: isActive ? m.light : isComplete ? m.base : '#666',
            textShadow: isActive ? `0 0 20px ${m.glow}` : 'none',
          }}
        >
          {stage.label}
        </span>
      </div>

      {/* Purity indicator */}
      <span
        className="text-[10px] font-mono uppercase tracking-wider"
        style={{
          color: isComplete ? m.base : '#444',
        }}
      >
        {isComplete ? '24K' : isActive ? '...' : '---'}
      </span>
    </div>
  );
};

// Molten text reveal
const MoltenText = ({ text, isGenerating }: { text: string; isGenerating: boolean }) => (
  <div
    className="relative min-h-[350px] p-10 rounded-2xl overflow-hidden"
    style={{
      background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
      border: '1px solid #333',
    }}
  >
    {/* Subtle metallic sheen overlay */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.03) 50%, transparent 60%)',
        animation: isGenerating ? 'sheen 3s ease-in-out infinite' : 'none',
      }}
    />

    {/* Edge glow */}
    <div
      className="absolute inset-0 pointer-events-none rounded-2xl"
      style={{
        boxShadow: `
          inset 0 1px 0 ${metals.gold.base}30,
          inset 1px 0 0 ${metals.gold.base}10,
          inset -1px 0 0 ${metals.gold.base}10,
          inset 0 -1px 0 ${metals.gold.dark}50
        `,
      }}
    />

    {/* Text content */}
    <div
      className="relative text-lg leading-relaxed"
      style={{
        color: '#e8e8e8',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
      }}
    >
      {text}
      {isGenerating && (
        <span
          className="inline-block w-0.5 h-6 ml-1 rounded-full"
          style={{
            background: `linear-gradient(180deg, ${metals.gold.light}, ${metals.gold.base})`,
            boxShadow: `0 0 10px ${metals.gold.glow}`,
            animation: 'moltenCursor 1s ease-in-out infinite',
          }}
        />
      )}
    </div>

    {/* Bottom molten pool effect */}
    {isGenerating && (
      <div
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{
          background: `linear-gradient(0deg, ${metals.gold.base}15, transparent)`,
        }}
      />
    )}
  </div>
);

// Progress as metal pouring
const MetalProgress = ({ progress }: { progress: number }) => (
  <div className="relative">
    {/* Track */}
    <div
      className="h-2 rounded-full overflow-hidden"
      style={{
        background: '#1a1a1a',
        border: '1px solid #333',
      }}
    >
      {/* Fill with metallic gradient */}
      <div
        className="h-full transition-all duration-500 relative"
        style={{
          width: `${progress}%`,
          background: `linear-gradient(90deg,
            ${metals.bronze.base},
            ${metals.gold.base} 50%,
            ${metals.gold.light} 75%,
            ${metals.gold.base}
          )`,
          boxShadow: `0 0 20px ${metals.gold.glow}`,
        }}
      >
        {/* Shine effect */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)',
          }}
        />
      </div>
    </div>

    {/* Purity label */}
    <div className="flex justify-between mt-3">
      <span className="text-xs text-gray-600">Forging</span>
      <span
        className="text-sm font-mono"
        style={{
          color: metals.gold.base,
          textShadow: `0 0 10px ${metals.gold.glow}`,
        }}
      >
        {progress}% Pure
      </span>
    </div>
  </div>
);

export const LiquidMetal: React.FC<TheaterProps> = ({
  stages,
  currentStageIndex,
  streamedText,
  isGenerating,
  progress,
  onCancel,
}) => {
  const metalTypes: (keyof typeof metals)[] = ['gold', 'silver', 'roseGold', 'bronze'];

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0d0d0d 0%, #1a1a1a 50%, #0d0d0d 100%)',
      }}
    >
      {/* Floating metal blobs */}
      <div className="absolute inset-0 pointer-events-none">
        {isGenerating && (
          <>
            <MetalBlob metal="gold" size={200} x={10} y={20} delay={0} isActive={true} />
            <MetalBlob metal="silver" size={150} x={85} y={70} delay={1} isActive={true} />
            <MetalBlob metal="roseGold" size={100} x={75} y={15} delay={2} isActive={true} />
            <MetalBlob metal="bronze" size={120} x={20} y={75} delay={1.5} isActive={true} />
          </>
        )}
      </div>

      {/* Ambient light effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, ${metals.gold.glow}20 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, ${metals.silver.glow}20 0%, transparent 50%)
          `,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="flex items-start justify-between mb-16">
          <div>
            <p
              className="text-[11px] uppercase tracking-[0.4em] mb-3"
              style={{ color: metals.gold.base }}
            >
              Precision Crafted
            </p>
            <h1
              className="text-4xl font-light text-white"
              style={{
                textShadow: `0 2px 20px ${metals.gold.glow}`,
              }}
            >
              Forging Your Content
            </h1>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-sm px-5 py-2 rounded-lg transition-all"
              style={{
                color: '#888',
                border: '1px solid #333',
                background: '#1a1a1a',
              }}
            >
              Quench
            </button>
          )}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Forging stages */}
          <div className="lg:col-span-4">
            <p
              className="text-[10px] uppercase tracking-[0.3em] mb-6"
              style={{ color: '#666' }}
            >
              Forging Process
            </p>
            <div
              className="p-6 rounded-xl"
              style={{
                background: 'rgba(26, 26, 26, 0.8)',
                border: '1px solid #333',
              }}
            >
              {stages.map((stage, index) => (
                <ForgingStage
                  key={stage.id}
                  stage={stage}
                  index={index}
                  isActive={index === currentStageIndex}
                  isComplete={index < currentStageIndex}
                  metal={metalTypes[index % metalTypes.length]}
                />
              ))}
            </div>
          </div>

          {/* Content output */}
          <div className="lg:col-span-8">
            <p
              className="text-[10px] uppercase tracking-[0.3em] mb-6"
              style={{ color: '#666' }}
            >
              Refined Output
            </p>
            <MoltenText text={streamedText} isGenerating={isGenerating} />
          </div>
        </div>

        {/* Progress */}
        <div className="mt-16">
          <MetalProgress progress={progress} />
        </div>
      </div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes metalMorph0 {
          0%, 100% { border-radius: 60% 40% 50% 50%; }
          50% { border-radius: 40% 60% 50% 50%; }
        }
        @keyframes metalMorph1 {
          0%, 100% { border-radius: 50% 50% 40% 60%; }
          50% { border-radius: 50% 50% 60% 40%; }
        }
        @keyframes metalMorph2 {
          0%, 100% { border-radius: 40% 60% 60% 40%; }
          50% { border-radius: 60% 40% 40% 60%; }
        }
        @keyframes heatPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes sheen {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes moltenCursor {
          0%, 100% { opacity: 1; transform: scaleY(1); }
          50% { opacity: 0.7; transform: scaleY(0.9); }
        }
      `}</style>
    </div>
  );
};

export default LiquidMetal;
