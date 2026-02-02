'use client';

/**
 * INK CARD
 *
 * Premium card with subtle paper texture and ink accent options.
 * Feels like high-quality stationery.
 */

import React from 'react';
import { tokens } from '../design-tokens';

interface InkCardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'flat';
  accent?: 'none' | 'ink' | 'sage' | 'top' | 'left';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  onClick?: () => void;
  className?: string;
}

export const InkCard: React.FC<InkCardProps> = ({
  children,
  variant = 'elevated',
  accent = 'none',
  padding = 'md',
  hover = false,
  onClick,
  className = '',
}) => {
  const paddingMap = {
    none: '0',
    sm: tokens.spacing[4],
    md: tokens.spacing[6],
    lg: tokens.spacing[8],
    xl: tokens.spacing[10],
  };

  const getAccentStyle = () => {
    switch (accent) {
      case 'ink':
        return { boxShadow: `inset 0 0 0 1px ${tokens.colors.ink[200]}` };
      case 'sage':
        return { boxShadow: `inset 0 0 0 1px ${tokens.colors.sage[200]}` };
      case 'top':
        return { borderTop: `3px solid ${tokens.colors.ink[700]}` };
      case 'left':
        return { borderLeft: `3px solid ${tokens.colors.ink[700]}` };
      default:
        return {};
    }
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'elevated':
        return {
          background: tokens.colors.paper.white,
          boxShadow: tokens.shadows.lg,
        };
      case 'outlined':
        return {
          background: tokens.colors.paper.white,
          border: `1px solid ${tokens.colors.paper.border}`,
        };
      case 'flat':
        return {
          background: tokens.colors.paper.warm,
        };
      default:
        return {};
    }
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden transition-all duration-300
        ${hover ? 'cursor-pointer hover:-translate-y-1' : ''}
        ${className}
      `}
      style={{
        padding: paddingMap[padding],
        borderRadius: tokens.radius.xl,
        ...getVariantStyle(),
        ...getAccentStyle(),
        ...(hover ? {
          ':hover': {
            boxShadow: tokens.shadows.xl,
          }
        } : {}),
      }}
    >
      {/* Subtle paper texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative">
        {children}
      </div>
    </div>
  );
};

export default InkCard;
