'use client';

/**
 * INK ICONS
 *
 * Elegant SVG icons for the Ink Diffusion homepage.
 * Replaces emojis with sophisticated line icons.
 */

import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

const defaultProps = {
  size: 24,
  color: 'currentColor',
};

// Feather quill for writing/blog posts
export const QuillIcon: React.FC<IconProps> = ({ className, size = defaultProps.size, color = defaultProps.color }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
    <line x1="16" y1="8" x2="2" y2="22" />
    <line x1="17.5" y1="15" x2="9" y2="15" />
  </svg>
);

// Connected nodes for social media
export const NetworkIcon: React.FC<IconProps> = ({ className, size = defaultProps.size, color = defaultProps.color }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="3" />
    <circle cx="5" cy="19" r="3" />
    <circle cx="19" cy="19" r="3" />
    <line x1="12" y1="8" x2="5" y2="16" />
    <line x1="12" y1="8" x2="19" y2="16" />
  </svg>
);

// Elegant envelope for email
export const EnvelopeIcon: React.FC<IconProps> = ({ className, size = defaultProps.size, color = defaultProps.color }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 6L12 13L2 6" />
    <circle cx="12" cy="17" r="1.5" fill={color} stroke="none" />
  </svg>
);

// Magnifying glass with chart for SEO
export const AnalyticsIcon: React.FC<IconProps> = ({ className, size = defaultProps.size, color = defaultProps.color }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="10" r="7" />
    <line x1="21" y1="21" x2="15" y2="15" />
    <line x1="7" y1="13" x2="7" y2="9" />
    <line x1="10" y1="13" x2="10" y2="7" />
    <line x1="13" y1="13" x2="13" y2="10" />
  </svg>
);

// Stacked papers for content bundle
export const BundleIcon: React.FC<IconProps> = ({ className, size = defaultProps.size, color = defaultProps.color }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="14" height="17" rx="2" />
    <rect x="6" y="2" width="14" height="17" rx="2" />
    <line x1="10" y1="9" x2="16" y2="9" />
    <line x1="10" y1="13" x2="16" y2="13" />
    <line x1="10" y1="17" x2="14" y2="17" />
  </svg>
);

// Checkmark for features
export const CheckIcon: React.FC<IconProps> = ({ className, size = defaultProps.size, color = defaultProps.color }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Arrow right for CTAs
export const ArrowRightIcon: React.FC<IconProps> = ({ className, size = defaultProps.size, color = defaultProps.color }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// Quote marks for testimonials
export const QuoteIcon: React.FC<IconProps> = ({ className, size = defaultProps.size, color = defaultProps.color }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <path d="M11 7H7a4 4 0 0 0-4 4v1a3 3 0 0 0 3 3h1a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2H6a2 2 0 0 1 2-2h3V7zM21 7h-4a4 4 0 0 0-4 4v1a3 3 0 0 0 3 3h1a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-1a2 2 0 0 1 2-2h3V7z" />
  </svg>
);

// Plus for FAQ expand
export const PlusIcon: React.FC<IconProps> = ({ className, size = defaultProps.size, color = defaultProps.color }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// Minus for FAQ collapse
export const MinusIcon: React.FC<IconProps> = ({ className, size = defaultProps.size, color = defaultProps.color }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// Play button for video CTAs
export const PlayIcon: React.FC<IconProps> = ({ className, size = defaultProps.size, color = defaultProps.color }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

// Ink drop for style/brand
export const InkDropIcon: React.FC<IconProps> = ({ className, size = defaultProps.size, color = defaultProps.color }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
);

// Document/page icon
export const DocumentIcon: React.FC<IconProps> = ({ className, size = defaultProps.size, color = defaultProps.color }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

// Target/goal icon
export const TargetIcon: React.FC<IconProps> = ({ className, size = defaultProps.size, color = defaultProps.color }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

// Lightning/speed icon
export const SpeedIcon: React.FC<IconProps> = ({ className, size = defaultProps.size, color = defaultProps.color }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

// Star/quality icon
export const StarIcon: React.FC<IconProps> = ({ className, size = defaultProps.size, color = defaultProps.color }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// Crown/premium icon
export const CrownIcon: React.FC<IconProps> = ({ className, size = defaultProps.size, color = defaultProps.color }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 17l2-11 5 5 3-7 3 7 5-5 2 11H2z" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);

// Chevron down for dropdowns
export const ChevronDownIcon: React.FC<IconProps> = ({ className, size = defaultProps.size, color = defaultProps.color }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// Export all icons
export const InkIcons = {
  Quill: QuillIcon,
  Network: NetworkIcon,
  Envelope: EnvelopeIcon,
  Analytics: AnalyticsIcon,
  Bundle: BundleIcon,
  Check: CheckIcon,
  ArrowRight: ArrowRightIcon,
  Quote: QuoteIcon,
  Plus: PlusIcon,
  Minus: MinusIcon,
  Play: PlayIcon,
  InkDrop: InkDropIcon,
  Document: DocumentIcon,
  Target: TargetIcon,
  Speed: SpeedIcon,
  Star: StarIcon,
  Crown: CrownIcon,
  ChevronDown: ChevronDownIcon,
};

export default InkIcons;
