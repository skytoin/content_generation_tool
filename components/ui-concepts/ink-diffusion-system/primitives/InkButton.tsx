'use client';

/**
 * INK BUTTON
 *
 * Premium button with ink bleed hover effect.
 * The ink spreads from center on hover like ink on paper.
 */

import React from 'react';
import { tokens } from '../design-tokens';

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
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const baseStyles = `
    relative overflow-hidden
    font-medium tracking-wide
    transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
    ${sizeClasses[size]}
  `;

  const variantStyles = {
    primary: `
      bg-[${tokens.colors.ink[700]}] text-white
      hover:bg-[${tokens.colors.ink[800]}]
      rounded-lg
    `,
    secondary: `
      bg-transparent text-[${tokens.colors.ink[700]}]
      border border-[${tokens.colors.ink[700]}]
      hover:bg-[${tokens.colors.ink[50]}]
      rounded-lg
    `,
    ghost: `
      bg-transparent text-[${tokens.colors.text.secondary}]
      hover:text-[${tokens.colors.ink[700]}]
      hover:bg-[${tokens.colors.paper.warm}]
      rounded-lg
    `,
    sage: `
      bg-[${tokens.colors.sage[500]}] text-white
      hover:bg-[${tokens.colors.sage[600]}]
      rounded-lg
    `,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} group`}
      style={{
        fontFamily: tokens.fonts.sans,
        background: variant === 'primary' ? tokens.colors.ink[700] :
                    variant === 'sage' ? tokens.colors.sage[500] :
                    variant === 'secondary' ? 'transparent' : 'transparent',
        color: variant === 'primary' || variant === 'sage' ? '#fff' :
               variant === 'secondary' ? tokens.colors.ink[700] :
               tokens.colors.text.secondary,
        border: variant === 'secondary' ? `1px solid ${tokens.colors.ink[700]}` : 'none',
        borderRadius: tokens.radius.lg,
      }}
    >
      {/* Ink spread effect on hover */}
      <span
        className="absolute inset-0 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-lg"
        style={{
          background: variant === 'primary' ? tokens.colors.ink[800] :
                      variant === 'sage' ? tokens.colors.sage[600] :
                      variant === 'secondary' ? tokens.colors.ink[50] :
                      tokens.colors.paper.warm,
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
