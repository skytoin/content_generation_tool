'use client';

/**
 * DEMO PAGE - Preview all Generation Theater variants
 *
 * This page lets you:
 * 1. Toggle between all 5 variants
 * 2. See them with simulated generation
 * 3. Test different stages and progress levels
 *
 * Access at: /demo/generation-theater (you'll need to create the route)
 */

import React, { useState, useEffect } from 'react';
import { MinimalTheater } from './Variant1-Minimal';
import { CinematicTheater } from './Variant2-Cinematic';
import { TechnicalTheater } from './Variant3-Technical';
import { AmbientTheater } from './Variant4-Ambient';
import { CardsTheater } from './Variant5-Cards';
import {
  GenerationStage,
  BLOG_GENERATION_STAGES,
  INSTAGRAM_GENERATION_STAGES,
  TheaterConfig
} from './types';

// Sample generated text for demo
const SAMPLE_TEXT = `The future of content marketing isn't about volume—it's about resonance. When your brand voice authentically connects with your audience, something remarkable happens: engagement transforms from metric to relationship.

Consider this: in an era where AI can generate endless content, what separates memorable brands from forgettable ones? It's not the quantity of posts or the frequency of emails. It's the distinctive voice that makes readers pause, nod, and think, "This brand gets me."

Your audience craves authenticity in a sea of sameness. They can spot generic, templated content from miles away. But when they encounter writing that feels genuinely crafted for them—content that speaks to their specific challenges, aspirations, and worldview—they lean in.

This is the art of strategic content creation: understanding not just what to say, but how to say it in a way that's unmistakably yours.`;

const VARIANTS = [
  { id: 'minimal', name: 'Minimal Elegant', component: MinimalTheater, bg: 'bg-white' },
  { id: 'cinematic', name: 'Cinematic', component: CinematicTheater, bg: 'bg-gray-950' },
  { id: 'technical', name: 'Technical', component: TechnicalTheater, bg: 'bg-gray-950' },
  { id: 'ambient', name: 'Ambient', component: AmbientTheater, bg: 'bg-gray-950' },
  { id: 'cards', name: 'Cards', component: CardsTheater, bg: 'bg-gray-100' },
];

const PIPELINES = [
  { id: 'blog', name: 'Blog Post', stages: BLOG_GENERATION_STAGES },
  { id: 'instagram', name: 'Instagram', stages: INSTAGRAM_GENERATION_STAGES },
];

export const GenerationTheaterDemo: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState(VARIANTS[0]);
  const [selectedPipeline, setSelectedPipeline] = useState(PIPELINES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [streamedText, setStreamedText] = useState('');

  // Reset state when variant changes
  useEffect(() => {
    setCurrentStageIndex(0);
    setProgress(0);
    setStreamedText('');
    setIsPlaying(false);
  }, [selectedVariant, selectedPipeline]);

  // Simulate generation when playing
  useEffect(() => {
    if (!isPlaying) return;

    const stages = selectedPipeline.stages;
    const totalStages = stages.length;
    const textWords = SAMPLE_TEXT.split(' ');

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + 1, 100);

        // Update stage based on progress
        const stageProgress = newProgress / 100;
        const newStageIndex = Math.min(
          Math.floor(stageProgress * totalStages),
          totalStages - 1
        );
        setCurrentStageIndex(newStageIndex);

        // Update streamed text
        const wordsToShow = Math.floor((newProgress / 100) * textWords.length);
        setStreamedText(textWords.slice(0, wordsToShow).join(' '));

        if (newProgress >= 100) {
          setIsPlaying(false);
        }

        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, selectedPipeline]);

  const handleCancel = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentStageIndex(0);
    setProgress(0);
    setStreamedText('');
    setIsPlaying(false);
  };

  const TheaterComponent = selectedVariant.component;
  const stages = selectedPipeline.stages.map((stage, index) => ({
    ...stage,
    status: index < currentStageIndex
      ? 'completed' as const
      : index === currentStageIndex
        ? 'active' as const
        : 'pending' as const
  }));

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Control panel - fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          {/* Variant selector */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Variant:</span>
            <div className="flex gap-1">
              {VARIANTS.map(variant => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`
                    px-3 py-1.5 text-sm rounded-lg transition-all
                    ${selectedVariant.id === variant.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }
                  `}
                >
                  {variant.name}
                </button>
              ))}
            </div>
          </div>

          {/* Pipeline selector */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Pipeline:</span>
            <div className="flex gap-1">
              {PIPELINES.map(pipeline => (
                <button
                  key={pipeline.id}
                  onClick={() => setSelectedPipeline(pipeline)}
                  className={`
                    px-3 py-1.5 text-sm rounded-lg transition-all
                    ${selectedPipeline.id === pipeline.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }
                  `}
                >
                  {pipeline.name}
                </button>
              ))}
            </div>
          </div>

          {/* Playback controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`
                px-4 py-1.5 text-sm rounded-lg transition-all flex items-center gap-2
                ${isPlaying
                  ? 'bg-yellow-600 text-white'
                  : 'bg-green-600 text-white hover:bg-green-500'
                }
              `}
            >
              {isPlaying ? (
                <>
                  <span>⏸</span> Pause
                </>
              ) : (
                <>
                  <span>▶</span> {progress > 0 ? 'Resume' : 'Play Demo'}
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-1.5 text-sm rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all"
            >
              Reset
            </button>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm">Progress:</span>
            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-white text-sm font-mono w-10">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Theater preview area */}
      <div className={`pt-20 ${selectedVariant.bg}`}>
        <TheaterComponent
          stages={stages}
          currentStageIndex={currentStageIndex}
          streamedText={streamedText}
          isGenerating={isPlaying}
          progress={progress}
          onCancel={handleCancel}
        />
      </div>

      {/* Info panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-white font-medium">{selectedVariant.name}</h3>
              <p className="text-gray-400 text-sm mt-1">
                {selectedVariant.id === 'minimal' && 'Clean, sophisticated, Notion-like aesthetic. Focus on content.'}
                {selectedVariant.id === 'cinematic' && 'Rich visual feedback with glow effects. Premium, theatrical feel.'}
                {selectedVariant.id === 'technical' && 'Developer-friendly with logs, stats, and terminal aesthetic.'}
                {selectedVariant.id === 'ambient' && 'Abstract, meditative experience. Floating orbs and subtle animations.'}
                {selectedVariant.id === 'cards' && 'Clear stage-by-stage progress. Works well in light mode.'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs">
                Stage {currentStageIndex + 1} of {stages.length}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {stages[currentStageIndex]?.label}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerationTheaterDemo;
