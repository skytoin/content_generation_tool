'use client';

/**
 * INK INPUT
 *
 * Elegant form input with ink-style focus states.
 * Underline expands like ink spreading when focused.
 */

import React, { useState } from 'react';
import { tokens } from '../design-tokens';

interface InkInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number';
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
}

export const InkInput: React.FC<InkInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  hint,
  disabled = false,
  required = false,
  icon,
}) => {
  const [focused, setFocused] = useState(false);
  const [filled, setFilled] = useState(!!value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilled(!!e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <div className="relative">
      {/* Label */}
      {label && (
        <label
          className="block mb-2 text-sm font-medium transition-colors duration-300"
          style={{
            color: focused ? tokens.colors.ink[700] : tokens.colors.text.secondary,
            fontFamily: tokens.fonts.sans,
          }}
        >
          {label}
          {required && (
            <span style={{ color: tokens.colors.ink[700] }} className="ml-1">*</span>
          )}
        </label>
      )}

      {/* Input container */}
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300"
            style={{
              color: focused ? tokens.colors.ink[700] : tokens.colors.text.muted,
            }}
          >
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full outline-none transition-all duration-300"
          style={{
            padding: icon ? '1rem 1rem 1rem 3rem' : '1rem',
            fontSize: tokens.fontSize.base,
            fontFamily: tokens.fonts.sans,
            color: tokens.colors.text.primary,
            background: tokens.colors.paper.white,
            border: `1px solid ${error ? tokens.colors.ink[400] : focused ? tokens.colors.ink[700] : tokens.colors.paper.border}`,
            borderRadius: tokens.radius.lg,
            boxShadow: focused ? tokens.shadows.ink : 'none',
          }}
        />

        {/* Ink spread underline effect */}
        <div
          className="absolute bottom-0 left-1/2 h-0.5 transition-all duration-500"
          style={{
            width: focused ? '100%' : '0%',
            marginLeft: focused ? '-50%' : '0',
            background: `linear-gradient(90deg, transparent, ${tokens.colors.ink[700]}, transparent)`,
          }}
        />
      </div>

      {/* Error or hint */}
      {(error || hint) && (
        <p
          className="mt-2 text-sm transition-colors duration-300"
          style={{
            color: error ? tokens.colors.ink[600] : tokens.colors.text.muted,
            fontFamily: tokens.fonts.sans,
          }}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
};

export default InkInput;
