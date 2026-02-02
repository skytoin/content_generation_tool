'use client';

/**
 * USE GENERATION SIMULATION
 *
 * Hook to simulate generation stages while waiting for non-streaming API response.
 * Provides visual feedback during the 1-5 minute generation process.
 */

import { useState, useCallback, useRef, useEffect } from 'react';

export interface Stage {
  id: string;
  label: string;
  duration: number; // estimated duration in ms
}

// Default stages for different quality tiers
export const BUDGET_STAGES: Stage[] = [
  { id: 'write', label: 'Writing', duration: 15000 },
];

export const STANDARD_STAGES: Stage[] = [
  { id: 'analyze', label: 'Analyzing Topic', duration: 10000 },
  { id: 'write', label: 'Writing Draft', duration: 20000 },
  { id: 'refine', label: 'Refining', duration: 10000 },
];

export const PREMIUM_STAGES: Stage[] = [
  { id: 'analyze', label: 'Deep Analysis', duration: 15000 },
  { id: 'research', label: 'Researching', duration: 20000 },
  { id: 'write', label: 'Writing Draft', duration: 25000 },
  { id: 'critique', label: 'Self-Critique', duration: 15000 },
  { id: 'revise', label: 'Final Revision', duration: 15000 },
];

export interface GenerationState {
  isGenerating: boolean;
  currentStageIndex: number;
  stages: Stage[];
  streamedText: string;
  progress: number;
  finalContent: string | null;
  error: string | null;
}

export interface UseGenerationSimulationOptions {
  tier: 'budget' | 'standard' | 'premium';
  onComplete?: (content: string) => void;
  onError?: (error: string) => void;
}

export function useGenerationSimulation(options: UseGenerationSimulationOptions) {
  const { tier, onComplete, onError } = options;

  // Get stages for tier
  const getStagesForTier = useCallback(() => {
    switch (tier) {
      case 'budget': return BUDGET_STAGES;
      case 'standard': return STANDARD_STAGES;
      case 'premium': return PREMIUM_STAGES;
      default: return STANDARD_STAGES;
    }
  }, [tier]);

  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    currentStageIndex: 0,
    stages: getStagesForTier(),
    streamedText: '',
    progress: 0,
    finalContent: null,
    error: null,
  });

  const stageTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const apiPromiseRef = useRef<Promise<string> | null>(null);
  const isCancelledRef = useRef(false);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (stageTimerRef.current) clearTimeout(stageTimerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, []);

  // Start the simulated stage progression
  const startStageProgression = useCallback((stages: Stage[]) => {
    let currentIndex = 0;

    const advanceStage = () => {
      if (isCancelledRef.current) return;

      if (currentIndex < stages.length - 1) {
        currentIndex++;
        setState(prev => ({
          ...prev,
          currentStageIndex: currentIndex,
          progress: Math.min(90, (currentIndex / stages.length) * 100),
        }));

        // Schedule next stage
        stageTimerRef.current = setTimeout(advanceStage, stages[currentIndex].duration);
      }
    };

    // Start with first stage
    if (stages.length > 0) {
      stageTimerRef.current = setTimeout(advanceStage, stages[0].duration);
    }
  }, []);

  // Stream text word by word for visual effect
  const streamText = useCallback((text: string) => {
    const words = text.split(' ');
    let currentWordIndex = 0;
    const wordsPerInterval = 3; // Stream 3 words at a time for speed
    const intervalMs = 50; // 50ms between word groups

    const streamInterval = setInterval(() => {
      if (isCancelledRef.current) {
        clearInterval(streamInterval);
        return;
      }

      if (currentWordIndex < words.length) {
        const nextWords = words.slice(currentWordIndex, currentWordIndex + wordsPerInterval);
        currentWordIndex += wordsPerInterval;

        setState(prev => ({
          ...prev,
          streamedText: prev.streamedText + (prev.streamedText ? ' ' : '') + nextWords.join(' '),
        }));
      } else {
        clearInterval(streamInterval);
        setState(prev => ({
          ...prev,
          isGenerating: false,
          progress: 100,
          finalContent: text,
        }));
        onComplete?.(text);
      }
    }, intervalMs);

    return () => clearInterval(streamInterval);
  }, [onComplete]);

  // Start generation
  const startGeneration = useCallback(async (
    apiCall: () => Promise<string>
  ) => {
    isCancelledRef.current = false;
    const stages = getStagesForTier();

    setState({
      isGenerating: true,
      currentStageIndex: 0,
      stages,
      streamedText: '',
      progress: 5,
      finalContent: null,
      error: null,
    });

    // Start visual stage progression
    startStageProgression(stages);

    // Start progress simulation (slow increase to max 90%)
    progressTimerRef.current = setInterval(() => {
      if (isCancelledRef.current) return;
      setState(prev => ({
        ...prev,
        progress: Math.min(85, prev.progress + 0.5),
      }));
    }, 1000);

    try {
      // Make the actual API call
      apiPromiseRef.current = apiCall();
      const content = await apiPromiseRef.current;

      if (isCancelledRef.current) return;

      // Stop the simulated progression
      if (stageTimerRef.current) clearTimeout(stageTimerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);

      // Move to final stage
      setState(prev => ({
        ...prev,
        currentStageIndex: stages.length - 1,
        progress: 90,
      }));

      // Stream the content for visual effect
      streamText(content);

    } catch (error) {
      if (isCancelledRef.current) return;

      const errorMessage = error instanceof Error ? error.message : 'Generation failed';

      // Stop timers
      if (stageTimerRef.current) clearTimeout(stageTimerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);

      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: errorMessage,
      }));

      onError?.(errorMessage);
    }
  }, [getStagesForTier, startStageProgression, streamText, onError]);

  // Cancel generation
  const cancelGeneration = useCallback(() => {
    isCancelledRef.current = true;
    if (stageTimerRef.current) clearTimeout(stageTimerRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);

    setState(prev => ({
      ...prev,
      isGenerating: false,
      error: 'Generation cancelled',
    }));
  }, []);

  // Reset state
  const reset = useCallback(() => {
    isCancelledRef.current = true;
    if (stageTimerRef.current) clearTimeout(stageTimerRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);

    setState({
      isGenerating: false,
      currentStageIndex: 0,
      stages: getStagesForTier(),
      streamedText: '',
      progress: 0,
      finalContent: null,
      error: null,
    });
  }, [getStagesForTier]);

  return {
    ...state,
    startGeneration,
    cancelGeneration,
    reset,
  };
}

export default useGenerationSimulation;
