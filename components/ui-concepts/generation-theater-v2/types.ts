// Generation Theater V2 - Premium Concepts
// Uses actual Scribengine color palettes

export interface GenerationStage {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed';
}

export interface TheaterProps {
  stages: GenerationStage[];
  currentStageIndex: number;
  streamedText: string;
  isGenerating: boolean;
  progress: number;
  onCancel?: () => void;
  theme?: 'original' | 'premium-blend';
}

// Color palettes from your actual themes
export const COLORS = {
  original: {
    primary: '#0ea5e9',      // Sky blue
    primaryDark: '#0284c7',
    primaryLight: '#38bdf8',
    accent: '#d946ef',       // Fuchsia
    accentDark: '#c026d3',
    accentLight: '#f0abfc',
    bg: '#f8fafc',
    bgAlt: '#f1f5f9',
    text: '#0f172a',
    textMuted: '#64748b',
  },
  premiumBlend: {
    primary: '#c75d3a',      // Terracotta
    primaryDark: '#a84d2e',
    primaryLight: '#e07a54',
    accent: '#7d8c6e',       // Sage
    accentDark: '#5f6b52',
    accentLight: '#9aab89',
    bg: '#faf9f7',           // Warm cream
    bgAlt: '#f5f3f0',
    text: '#1a1a1a',
    textMuted: '#64748b',
  },
};

export const BLOG_STAGES: GenerationStage[] = [
  { id: 'analyze', label: 'Reading your voice', status: 'pending' },
  { id: 'research', label: 'Gathering insights', status: 'pending' },
  { id: 'architect', label: 'Shaping the narrative', status: 'pending' },
  { id: 'compose', label: 'Composing prose', status: 'pending' },
  { id: 'refine', label: 'Refining every word', status: 'pending' },
  { id: 'perfect', label: 'Final touches', status: 'pending' },
];
