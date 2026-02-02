'use client';

/**
 * CONSTELLATION MAP
 *
 * Concept: Ideas connect like stars forming constellations.
 * Each stage completion lights up a new star cluster.
 * Lines draw between points creating a "map of thought."
 *
 * Feel: Magical, intelligent, vast potential — ideas as cosmos
 * Palette: Original (Sky blue + Fuchsia)
 */

import React, { useMemo } from 'react';
import { TheaterProps, COLORS } from './types';

const colors = COLORS.original;

// Generate constellation points for each stage
const generateConstellation = (stageIndex: number, total: number) => {
  const baseX = 15 + (stageIndex * 70 / total);
  const points = [];
  const pointCount = 4 + Math.floor(Math.random() * 3);

  for (let i = 0; i < pointCount; i++) {
    points.push({
      x: baseX + (Math.random() - 0.5) * 20,
      y: 20 + Math.random() * 60,
      size: 2 + Math.random() * 3,
      delay: i * 0.1,
    });
  }
  return points;
};

// Star point component
const Star = ({
  x, y, size, isActive, isComplete, delay
}: {
  x: number;
  y: number;
  size: number;
  isActive: boolean;
  isComplete: boolean;
  delay: number;
}) => (
  <div
    className="absolute transition-all duration-1000"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      borderRadius: '50%',
      background: isComplete
        ? colors.accent
        : isActive
          ? colors.primary
          : '#374151',
      boxShadow: isComplete
        ? `0 0 ${size * 4}px ${colors.accent}, 0 0 ${size * 8}px ${colors.accent}50`
        : isActive
          ? `0 0 ${size * 4}px ${colors.primary}, 0 0 ${size * 8}px ${colors.primary}50`
          : 'none',
      opacity: isComplete || isActive ? 1 : 0.3,
      transform: `translate(-50%, -50%) scale(${isActive ? 1.5 : 1})`,
      transitionDelay: `${delay}s`,
    }}
  >
    {isActive && (
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: colors.primary,
          animation: 'starPulse 2s ease-in-out infinite',
        }}
      />
    )}
  </div>
);

// Line connecting stars
const ConstellationLine = ({
  from, to, isVisible
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  isVisible: boolean;
}) => {
  const length = Math.sqrt(
    Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2)
  );
  const angle = Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI;

  return (
    <div
      className="absolute h-px origin-left transition-all duration-1000"
      style={{
        left: `${from.x}%`,
        top: `${from.y}%`,
        width: `${length}%`,
        transform: `rotate(${angle}deg)`,
        background: `linear-gradient(90deg, ${colors.accent}60, ${colors.primary}60)`,
        opacity: isVisible ? 0.6 : 0,
        transitionDelay: '0.3s',
      }}
    />
  );
};

// Stage label floating near constellation
const StageLabel = ({
  stage, isActive, isComplete, position
}: {
  stage: { label: string };
  isActive: boolean;
  isComplete: boolean;
  position: { x: number; y: number };
}) => (
  <div
    className="absolute transition-all duration-700 whitespace-nowrap"
    style={{
      left: `${position.x}%`,
      top: `${position.y + 8}%`,
      transform: 'translateX(-50%)',
      opacity: isActive || isComplete ? 1 : 0.3,
    }}
  >
    <span
      className="text-xs uppercase tracking-[0.15em]"
      style={{
        color: isActive ? colors.primary : isComplete ? colors.accent : '#64748b',
      }}
    >
      {stage.label}
    </span>
  </div>
);

// Streaming text with cosmic feel
const CosmicText = ({ text, isGenerating }: { text: string; isGenerating: boolean }) => (
  <div
    className="min-h-[300px] p-8 rounded-2xl relative overflow-hidden"
    style={{
      background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
      border: '1px solid rgba(255,255,255,0.1)',
    }}
  >
    {/* Subtle star field background */}
    <div className="absolute inset-0 opacity-30">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-px h-px bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.3 + Math.random() * 0.7,
            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </div>

    {/* Text content */}
    <div className="relative text-lg leading-relaxed text-gray-200">
      {text}
      {isGenerating && (
        <span
          className="inline-block w-0.5 h-5 ml-1"
          style={{
            background: `linear-gradient(180deg, ${colors.primary}, ${colors.accent})`,
            boxShadow: `0 0 10px ${colors.primary}`,
            animation: 'cosmicCursor 1s ease-in-out infinite',
          }}
        />
      )}
    </div>

    {/* Bottom glow */}
    <div
      className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
      style={{
        background: `linear-gradient(0deg, ${colors.primary}10, transparent)`,
      }}
    />
  </div>
);

// Progress as orbital ring
const OrbitalProgress = ({ progress }: { progress: number }) => (
  <div className="relative h-2 rounded-full overflow-hidden" style={{ background: '#1e293b' }}>
    <div
      className="absolute inset-y-0 left-0 transition-all duration-500"
      style={{
        width: `${progress}%`,
        background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
        boxShadow: `0 0 20px ${colors.primary}80`,
      }}
    />
    {/* Orbiting dot */}
    <div
      className="absolute top-1/2 w-3 h-3 -mt-1.5 rounded-full transition-all duration-500"
      style={{
        left: `calc(${progress}% - 6px)`,
        background: '#fff',
        boxShadow: `0 0 10px ${colors.accent}, 0 0 20px ${colors.primary}`,
      }}
    />
  </div>
);

export const ConstellationMap: React.FC<TheaterProps> = ({
  stages,
  currentStageIndex,
  streamedText,
  isGenerating,
  progress,
  onCancel,
}) => {
  // Generate constellation data
  const constellations = useMemo(() =>
    stages.map((_, index) => ({
      points: generateConstellation(index, stages.length),
      center: { x: 15 + (index * 70 / stages.length), y: 50 },
    })),
  [stages.length]);

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      }}
    >
      {/* Cosmic dust overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, ${colors.primary}10 0%, transparent 50%),
                       radial-gradient(ellipse at 70% 80%, ${colors.accent}10 0%, transparent 50%)`,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-light text-white mb-2">
              Mapping Your Ideas
            </h1>
            <p className="text-gray-400 text-sm">
              Watch as concepts connect and crystallize
            </p>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-white transition-colors text-sm px-4 py-2 border border-gray-700 rounded-lg hover:border-gray-500"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Constellation visualization */}
        <div
          className="relative h-48 mb-8 rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          {/* Stars and lines */}
          {constellations.map((constellation, stageIndex) => {
            const isActive = stageIndex === currentStageIndex;
            const isComplete = stageIndex < currentStageIndex;

            return (
              <React.Fragment key={stageIndex}>
                {/* Lines between points */}
                {constellation.points.slice(0, -1).map((point, i) => (
                  <ConstellationLine
                    key={`line-${stageIndex}-${i}`}
                    from={point}
                    to={constellation.points[i + 1]}
                    isVisible={isComplete || isActive}
                  />
                ))}

                {/* Stars */}
                {constellation.points.map((point, i) => (
                  <Star
                    key={`star-${stageIndex}-${i}`}
                    {...point}
                    isActive={isActive}
                    isComplete={isComplete}
                    delay={i * 0.1}
                  />
                ))}

                {/* Stage label */}
                <StageLabel
                  stage={stages[stageIndex]}
                  isActive={isActive}
                  isComplete={isComplete}
                  position={constellation.center}
                />
              </React.Fragment>
            );
          })}

          {/* Connecting line between constellations */}
          {constellations.slice(0, -1).map((c, i) => (
            <ConstellationLine
              key={`connect-${i}`}
              from={{ x: c.center.x + 8, y: c.center.y }}
              to={{ x: constellations[i + 1].center.x - 8, y: constellations[i + 1].center.y }}
              isVisible={i < currentStageIndex}
            />
          ))}
        </div>

        {/* Text output */}
        <CosmicText text={streamedText} isGenerating={isGenerating} />

        {/* Progress */}
        <div className="mt-8">
          <OrbitalProgress progress={progress} />
          <div className="flex justify-between mt-3">
            <span className="text-xs text-gray-500">
              {stages[currentStageIndex]?.label}
            </span>
            <span className="text-xs text-gray-400 tabular-nums">
              {progress}% complete
            </span>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes starPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(2); opacity: 0; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes cosmicCursor {
          0%, 100% { opacity: 1; transform: scaleY(1); }
          50% { opacity: 0.5; transform: scaleY(0.8); }
        }
      `}</style>
    </div>
  );
};

export default ConstellationMap;
