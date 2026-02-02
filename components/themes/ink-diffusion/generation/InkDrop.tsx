'use client';

/**
 * INK DROP
 *
 * Animated ink drop with bloom effect for the Generation Theater.
 * Creates ambient visual interest during content generation.
 */

import React from 'react';

interface InkDropProps {
  x: number;       // Percentage position (0-100)
  y: number;       // Percentage position (0-100)
  size: number;    // Size in pixels
  delay: number;   // Animation delay in seconds
  color: string;   // Color value
}

export const InkDrop: React.FC<InkDropProps> = ({ x, y, size, delay, color }) => (
  <div
    className="absolute rounded-full pointer-events-none ink-drop"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      background: `radial-gradient(circle at 30% 30%, ${color}60 0%, ${color}20 40%, transparent 70%)`,
      filter: 'blur(30px)',
      animationDelay: `${delay}s`,
      opacity: 0,
    }}
  />
);

export default InkDrop;
