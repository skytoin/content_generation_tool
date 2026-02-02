'use client';

/**
 * INK BADGE
 *
 * Status badges and tier indicators with ink styling.
 * Replaces emoji-based badges with elegant designed elements.
 */

import React from 'react';
import { tokens } from '../design-tokens';

interface InkBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'ink' | 'sage' | 'outline' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  tier?: 'budget' | 'standard' | 'premium';
}

// Tier-specific badge designs (replacing emoji)
const tierConfig = {
  budget: {
    label: 'Budget',
    color: tokens.colors.sage[600],
    bg: tokens.colors.sage[50],
    border: tokens.colors.sage[200],
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  standard: {
    label: 'Standard',
    color: tokens.colors.ink[700],
    bg: tokens.colors.ink[50],
    border: tokens.colors.ink[200],
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  premium: {
    label: 'Premium',
    color: '#9D7A3D',
    bg: '#FDF8F0',
    border: '#E8D5B0',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    ),
  },
};

export const InkBadge: React.FC<InkBadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
  tier,
}) => {
  const sizeMap = {
    sm: { padding: '0.25rem 0.5rem', fontSize: '0.6875rem' },
    md: { padding: '0.375rem 0.75rem', fontSize: '0.75rem' },
    lg: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
  };

  // If tier is specified, use tier config
  if (tier) {
    const config = tierConfig[tier];
    return (
      <span
        className="inline-flex items-center gap-1.5 font-medium uppercase tracking-wider"
        style={{
          padding: sizeMap[size].padding,
          fontSize: sizeMap[size].fontSize,
          fontFamily: tokens.fonts.sans,
          color: config.color,
          background: config.bg,
          border: `1px solid ${config.border}`,
          borderRadius: tokens.radius.full,
        }}
      >
        {config.icon}
        {config.label}
      </span>
    );
  }

  // Standard variants
  const variantStyles = {
    default: {
      color: tokens.colors.text.secondary,
      background: tokens.colors.paper.warm,
      border: 'none',
    },
    ink: {
      color: tokens.colors.ink[700],
      background: tokens.colors.ink[50],
      border: `1px solid ${tokens.colors.ink[200]}`,
    },
    sage: {
      color: tokens.colors.sage[700],
      background: tokens.colors.sage[50],
      border: `1px solid ${tokens.colors.sage[200]}`,
    },
    outline: {
      color: tokens.colors.text.secondary,
      background: 'transparent',
      border: `1px solid ${tokens.colors.paper.border}`,
    },
    subtle: {
      color: tokens.colors.text.muted,
      background: tokens.colors.paper.cream,
      border: 'none',
    },
  };

  const styles = variantStyles[variant];

  return (
    <span
      className="inline-flex items-center gap-1.5 font-medium"
      style={{
        padding: sizeMap[size].padding,
        fontSize: sizeMap[size].fontSize,
        fontFamily: tokens.fonts.sans,
        color: styles.color,
        background: styles.background,
        border: styles.border,
        borderRadius: tokens.radius.full,
      }}
    >
      {icon}
      {children}
    </span>
  );
};

export default InkBadge;
