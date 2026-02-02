'use client';

/**
 * INK BUTTON
 *
 * Premium button with ink bleed hover effect.
 * The ink spreads from center on hover like ink on paper.
 */

import React from 'react';
import { tokens } from './design-tokens';

interface InkButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'sage';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const InkButton: React.FC<InkButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const getBackground = () => {
    switch (variant) {
      case 'primary': return tokens.colors.ink[700];
      case 'sage': return tokens.colors.sage[500];
      case 'secondary': return 'transparent';
      case 'ghost': return 'transparent';
      default: return tokens.colors.ink[700];
    }
  };

  const getHoverBackground = () => {
    switch (variant) {
      case 'primary': return tokens.colors.ink[800];
      case 'sage': return tokens.colors.sage[600];
      case 'secondary': return tokens.colors.ink[50];
      case 'ghost': return tokens.colors.paper.warm;
      default: return tokens.colors.ink[800];
    }
  };

  const getColor = () => {
    switch (variant) {
      case 'primary':
      case 'sage':
        return '#fff';
      case 'secondary':
        return tokens.colors.ink[700];
      case 'ghost':
        return tokens.colors.text.secondary;
      default:
        return '#fff';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden
        font-medium tracking-wide
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${fullWidth ? 'w-full' : ''}
        ${sizeClasses[size]}
        group
        ${className}
      `}
      style={{
        fontFamily: tokens.fonts.sans,
        background: getBackground(),
        color: getColor(),
        border: variant === 'secondary' ? `1px solid ${tokens.colors.ink[700]}` : 'none',
        borderRadius: tokens.radius.lg,
      }}
    >
      {/* Ink spread effect on hover */}
      <span
        className="absolute inset-0 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-lg"
        style={{
          background: getHoverBackground(),
          transformOrigin: 'center',
        }}
      />

      {/* Content */}
      <span className="relative flex items-center justify-center gap-2">
        {loading ? (
          <span
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
          />
        ) : (
          <>
            {icon && iconPosition === 'left' && icon}
            {children}
            {icon && iconPosition === 'right' && icon}
          </>
        )}
      </span>
    </button>
  );
};

export default InkButton;
