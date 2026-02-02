'use client';

/**
 * INK TEXTAREA
 *
 * Elegant textarea with ink-style focus states.
 * Matches the InkInput styling for consistency.
 */

import React, { useState } from 'react';
import { tokens } from './design-tokens';

interface InkTextareaProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  name?: string;
  id?: string;
  className?: string;
}

export const InkTextarea: React.FC<InkTextareaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  hint,
  disabled = false,
  required = false,
  rows = 4,
  name,
  id,
  className = '',
}) => {
  const [focused, setFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={id || name}
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

      {/* Textarea container */}
      <div className="relative">
        <textarea
          name={name}
          id={id || name}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className="w-full outline-none transition-all duration-300 resize-none"
          style={{
            padding: '1rem',
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

export default InkTextarea;
