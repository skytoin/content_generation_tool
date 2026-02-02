'use client';

/**
 * DEMO PAGE V2 - Premium Generation Theater Concepts
 *
 * Preview all 5 premium variants with your actual color palettes
 */

import React, { useState, useEffect } from 'react';
import { InkDiffusion } from './InkDiffusion';
import { ConstellationMap } from './ConstellationMap';
import { ArchitectBlueprint } from './ArchitectBlueprint';
import { LiquidMetal } from './LiquidMetal';
import { BotanicalGrowth } from './BotanicalGrowth';
import { GenerationStage, BLOG_STAGES, COLORS } from './types';

const SAMPLE_TEXT = `The most compelling content doesn't announce its sophistication—it simply demonstrates it. Every word carries intention, every pause creates anticipation, every insight lands with quiet authority.

This is what separates forgettable content from work that resonates: the invisible craft behind visible impact. Your audience may not consciously notice the careful rhythm of your sentences, the strategic placement of your arguments, or the subtle callbacks that create cohesion. But they feel it.

Great content marketing isn't about volume or frequency. It's about creating moments of genuine connection—those rare instances when a reader pauses, nods, and thinks: "This brand understands me."

The future belongs to those who can balance analytical precision with creative intuition, who treat every piece of content as both a strategic asset and an act of genuine communication.`;

const VARIANTS = [
  {
    id: 'ink',
    name: 'Ink Diffusion',
    component: InkDiffusion,
    description: 'Editorial, artistic — words bleed into existence like ink on paper',
    palette: 'Premium-Blend',
  },
  {
    id: 'constellation',
    name: 'Constellation Map',
    component: ConstellationMap,
    description: 'Magical, cosmic — ideas connect like stars forming patterns',
    palette: 'Original',
  },
  {
    id: 'blueprint',
    name: 'Architect Blueprint',
    component: ArchitectBlueprint,
    description: 'Precise, structured — content constructed with technical craft',
    palette: 'Original',
  },
  {
    id: 'metal',
    name: 'Liquid Metal',
    component: LiquidMetal,
    description: 'Ultra-luxury — molten precious metals forge your words',
    palette: 'Dark + Metallics',
  },
  {
    id: 'botanical',
    name: 'Botanical Growth',
    component: BotanicalGrowth,
    description: 'Organic, alive — content grows like plants in time-lapse',
    palette: 'Premium-Blend',
  },
];

export const GenerationTheaterDemoV2: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState(VARIANTS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [streamedText, setStreamedText] = useState('');

  // Reset on variant change
  useEffect(() => {
    setCurrentStageIndex(0);
    setProgress(0);
    setStreamedText('');
    setIsPlaying(false);
  }, [selectedVariant]);

  // Simulate generation
  useEffect(() => {
    if (!isPlaying) return;

    const words = SAMPLE_TEXT.split(' ');
    const totalStages = BLOG_STAGES.length;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + 0.8, 100);

        const newStageIndex = Math.min(
          Math.floor((newProgress / 100) * totalStages),
          totalStages - 1
        );
        setCurrentStageIndex(newStageIndex);

        const wordsToShow = Math.floor((newProgress / 100) * words.length);
        setStreamedText(words.slice(0, wordsToShow).join(' '));

        if (newProgress >= 100) {
          setIsPlaying(false);
        }

        return newProgress;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleReset = () => {
    setCurrentStageIndex(0);
    setProgress(0);
    setStreamedText('');
    setIsPlaying(false);
  };

  const TheaterComponent = selectedVariant.component;
  const stages: GenerationStage[] = BLOG_STAGES.map((stage, index) => ({
    ...stage,
    status: index < currentStageIndex
      ? 'completed'
      : index === currentStageIndex
        ? 'active'
        : 'pending'
  }));

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Control Panel */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Variant selector */}
          <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-2">
            {VARIANTS.map(variant => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant)}
                className={`
                  px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all
                  ${selectedVariant.id === variant.id
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }
                `}
              >
                {variant.name}
              </button>
            ))}
          </div>

          {/* Info and controls */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                {selectedVariant.palette}
              </p>
              <p className="text-white/80 text-sm">
                {selectedVariant.description}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Progress display */}
              <div className="flex items-center gap-3 mr-4">
                <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-white/50 text-sm font-mono w-12">
                  {Math.round(progress)}%
                </span>
              </div>

              {/* Controls */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`
                  px-5 py-2 rounded-lg text-sm font-medium transition-all
                  ${isPlaying
                    ? 'bg-amber-500 text-black'
                    : 'bg-white text-black hover:bg-white/90'
                  }
                `}
              >
                {isPlaying ? 'Pause' : progress > 0 ? 'Resume' : 'Play'}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white border border-white/20 hover:border-white/40 transition-all"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Theater Preview */}
      <div className="pt-32">
        <TheaterComponent
          stages={stages}
          currentStageIndex={currentStageIndex}
          streamedText={streamedText}
          isGenerating={isPlaying}
          progress={Math.round(progress)}
          onCancel={() => setIsPlaying(false)}
        />
      </div>

      {/* Info Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10 py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-wider">Stage</p>
              <p className="text-white/80 text-sm">
                {stages[currentStageIndex]?.label || 'Ready'}
              </p>
            </div>
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-wider">Words</p>
              <p className="text-white/80 text-sm font-mono">
                {streamedText.split(' ').filter(Boolean).length}
              </p>
            </div>
          </div>
          <p className="text-white/30 text-xs">
            Generation Theater V2 — Premium Concepts
          </p>
        </div>
      </div>
    </div>
  );
};

export default GenerationTheaterDemoV2;
