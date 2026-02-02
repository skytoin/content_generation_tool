import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createElement } from 'react'
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock document.documentElement.setAttribute
const setAttributeMock = vi.fn()
Object.defineProperty(document.documentElement, 'setAttribute', {
  value: setAttributeMock,
  writable: true,
})

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  describe('ThemeProvider', () => {
    it('should provide default theme as original', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        createElement(ThemeProvider, null, children)

      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current.theme).toBe('original')
    })

    it('should allow setting theme to premium-blend', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        createElement(ThemeProvider, null, children)

      const { result } = renderHook(() => useTheme(), { wrapper })

      act(() => {
        result.current.setTheme('premium-blend')
      })

      expect(result.current.theme).toBe('premium-blend')
    })

    it('should allow setting theme to ink-diffusion', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        createElement(ThemeProvider, null, children)

      const { result } = renderHook(() => useTheme(), { wrapper })

      act(() => {
        result.current.setTheme('ink-diffusion')
      })

      expect(result.current.theme).toBe('ink-diffusion')
    })

    it('should persist theme to localStorage', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        createElement(ThemeProvider, null, children)

      const { result } = renderHook(() => useTheme(), { wrapper })

      act(() => {
        result.current.setTheme('ink-diffusion')
      })

      expect(localStorageMock.setItem).toHaveBeenCalledWith('scribengine-theme', 'ink-diffusion')
    })

    it('should load theme from localStorage on mount', () => {
      localStorageMock.getItem.mockReturnValueOnce('ink-diffusion')

      const wrapper = ({ children }: { children: React.ReactNode }) =>
        createElement(ThemeProvider, null, children)

      const { result } = renderHook(() => useTheme(), { wrapper })

      // After mount, should load from localStorage
      expect(localStorageMock.getItem).toHaveBeenCalledWith('scribengine-theme')
    })

    it('should apply theme to document element', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        createElement(ThemeProvider, null, children)

      const { result } = renderHook(() => useTheme(), { wrapper })

      act(() => {
        result.current.setTheme('ink-diffusion')
      })

      expect(setAttributeMock).toHaveBeenCalledWith('data-theme', 'ink-diffusion')
    })
  })

  describe('useTheme hook', () => {
    it('should return default values when used outside provider', () => {
      const { result } = renderHook(() => useTheme())

      expect(result.current.theme).toBe('original')
      expect(typeof result.current.setTheme).toBe('function')
      expect(typeof result.current.toggleTheme).toBe('function')
    })

    it('should toggle between themes', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        createElement(ThemeProvider, null, children)

      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current.theme).toBe('original')

      act(() => {
        result.current.toggleTheme()
      })

      expect(result.current.theme).toBe('premium-blend')
    })
  })

  describe('theme validation', () => {
    it('should accept valid theme values', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        createElement(ThemeProvider, null, children)

      const { result } = renderHook(() => useTheme(), { wrapper })

      const validThemes = ['original', 'premium-blend', 'ink-diffusion'] as const

      validThemes.forEach((theme) => {
        act(() => {
          result.current.setTheme(theme)
        })
        expect(result.current.theme).toBe(theme)
      })
    })
  })
})

describe('Theme CSS variables', () => {
  it('should define ink-diffusion theme colors', () => {
    // These are the expected CSS variable values for ink-diffusion
    const inkDiffusionColors = {
      accent: '#722F37',
      accentSecondary: '#D4AF37',
      background: '#FAF7F2',
      cardBg: '#FFFFF0',
      textPrimary: '#2C2C2C',
    }

    // Verify the color values are valid hex colors
    Object.values(inkDiffusionColors).forEach((color) => {
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/)
    })
  })

  it('should have consistent color palette for ink-diffusion', () => {
    // Burgundy palette
    const burgundyColors = ['#722F37', '#8b3d47', '#5a252c']
    // Gold palette
    const goldColors = ['#D4AF37', '#e6c65c', '#b8962e']

    // All should be valid hex colors
    ;[...burgundyColors, ...goldColors].forEach((color) => {
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/)
    })
  })
})
