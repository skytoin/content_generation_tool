/**
 * INK DIFFUSION DESIGN SYSTEM - Production Tokens
 * Editorial Luxury Color Palette
 *
 * A premium, editorial design language inspired by:
 * - Traditional printmaking and letterpress
 * - High-end stationery and paper goods
 * - Editorial magazine layouts
 * - Luxury brand aesthetics
 */

export const tokens = {
  // Color Palette - Editorial Luxury
  colors: {
    // Primary - Burgundy (rich, luxurious, sophisticated)
    ink: {
      900: '#4a1f24',
      800: '#5a252c',
      700: '#722F37',  // Main accent - burgundy
      600: '#8b3d47',
      500: '#a34d58',
      400: '#c77d8f',
      300: '#dba8b4',
      200: '#ecd0d6',
      100: '#f5e8eb',
      50: '#faf4f5',
    },
    // Secondary - Gold (warm, elegant, premium)
    sage: {
      900: '#6b5a1f',
      800: '#8a7426',
      700: '#a8902e',
      600: '#b8962e',
      500: '#D4AF37',  // Main secondary - gold
      400: '#e6c65c',
      300: '#efd77f',
      200: '#f5e6a8',
      100: '#faf2d4',
      50: '#fdf9eb',
    },
    // Neutrals - Warm paper tones
    paper: {
      white: '#FFFFF0',  // ivory
      cream: '#FAF7F2',
      warm: '#f5f1eb',
      muted: '#ebe5dc',
      border: '#ddd5c9',
      dark: '#ccc3b5',
    },
    // Text
    text: {
      primary: '#2C2C2C',  // charcoal
      secondary: '#4a4a4a',
      muted: '#6b6b6b',
      subtle: '#8a8a8a',
      inverse: '#FAF7F2',
    },
    // Extended palette for accents
    extended: {
      navy: '#1a2744',
      coral: '#E07A5F',
      mint: '#83C5BE',
      rose: '#C77D8F',
    },
  },

  // Typography
  fonts: {
    serif: "'Playfair Display', Georgia, serif",
    sans: "'Inter', -apple-system, sans-serif",
    mono: "'JetBrains Mono', 'SF Mono', monospace",
  },

  // Font sizes with optical adjustments
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },

  // Spacing scale
  spacing: {
    px: '1px',
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
  },

  // Border radius
  radius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },

  // Shadows - soft, diffused, paper-like with burgundy tints
  shadows: {
    sm: '0 1px 2px rgba(44, 44, 44, 0.04)',
    md: '0 4px 12px rgba(44, 44, 44, 0.06)',
    lg: '0 8px 24px rgba(44, 44, 44, 0.08)',
    xl: '0 16px 48px rgba(44, 44, 44, 0.10)',
    ink: '0 4px 20px rgba(114, 47, 55, 0.15)',
    gold: '0 4px 20px rgba(212, 175, 55, 0.15)',
  },

  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.23, 1, 0.32, 1)',
    normal: '300ms cubic-bezier(0.23, 1, 0.32, 1)',
    slow: '500ms cubic-bezier(0.23, 1, 0.32, 1)',
    spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  // Z-index scale
  zIndex: {
    dropdown: 100,
    sticky: 200,
    modal: 300,
    tooltip: 400,
    toast: 500,
  },
};

// CSS Variables for easy theming
export const cssVariables = `
  :root {
    --ink-primary: ${tokens.colors.ink[700]};
    --ink-dark: ${tokens.colors.ink[800]};
    --ink-light: ${tokens.colors.ink[400]};
    --gold-primary: ${tokens.colors.sage[500]};
    --gold-dark: ${tokens.colors.sage[700]};
    --gold-light: ${tokens.colors.sage[300]};
    --paper-white: ${tokens.colors.paper.white};
    --paper-cream: ${tokens.colors.paper.cream};
    --paper-warm: ${tokens.colors.paper.warm};
    --text-primary: ${tokens.colors.text.primary};
    --text-secondary: ${tokens.colors.text.secondary};
    --text-muted: ${tokens.colors.text.muted};
    --font-serif: ${tokens.fonts.serif};
    --font-sans: ${tokens.fonts.sans};
  }
`;

export default tokens;
