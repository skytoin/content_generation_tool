// Shared types for Generation Theater concepts

export interface GenerationStage {
  id: string;
  label: string;
  description?: string;
  status: 'pending' | 'active' | 'completed';
  duration?: number; // estimated ms
}

export interface GenerationTheaterProps {
  stages: GenerationStage[];
  currentStageIndex: number;
  streamedText: string;
  isGenerating: boolean;
  progress: number; // 0-100
  onCancel?: () => void;
}

export interface TheaterConfig {
  enabled: boolean; // Master toggle - OFF by default
  variant: 'minimal' | 'cinematic' | 'technical' | 'ambient';
  showStreamingText: boolean;
  showStages: boolean;
  showProgress: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
}

// Default stages for different pipelines
export const BLOG_GENERATION_STAGES: GenerationStage[] = [
  { id: 'analyze', label: 'Analyzing your audience', status: 'pending' },
  { id: 'research', label: 'Researching current trends', status: 'pending' },
  { id: 'outline', label: 'Structuring narrative arc', status: 'pending' },
  { id: 'voice', label: 'Matching your voice signature', status: 'pending' },
  { id: 'draft', label: 'Crafting initial draft', status: 'pending' },
  { id: 'refine', label: 'Refining for engagement', status: 'pending' },
  { id: 'polish', label: 'Final polish', status: 'pending' },
];

export const INSTAGRAM_GENERATION_STAGES: GenerationStage[] = [
  { id: 'trends', label: 'Scanning trending topics', status: 'pending' },
  { id: 'hooks', label: 'Crafting scroll-stopping hooks', status: 'pending' },
  { id: 'caption', label: 'Writing compelling caption', status: 'pending' },
  { id: 'hashtags', label: 'Optimizing hashtag strategy', status: 'pending' },
  { id: 'visual', label: 'Generating image concepts', status: 'pending' },
  { id: 'review', label: 'Quality review', status: 'pending' },
];

export const EMAIL_GENERATION_STAGES: GenerationStage[] = [
  { id: 'audience', label: 'Understanding your audience', status: 'pending' },
  { id: 'subject', label: 'Crafting subject lines', status: 'pending' },
  { id: 'sequence', label: 'Building email sequence', status: 'pending' },
  { id: 'cta', label: 'Optimizing calls-to-action', status: 'pending' },
  { id: 'personalize', label: 'Adding personalization', status: 'pending' },
];
