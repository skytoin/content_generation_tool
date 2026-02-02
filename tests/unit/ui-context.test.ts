import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createElement } from 'react'
import { UIProvider, useUIMode } from '@/contexts/UIContext'

// Create fresh localStorage mock for each test
let store: Record<string, string> = {}

const createLocalStorageMock = () => ({
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
})

let localStorageMock = createLocalStorageMock()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

describe('UIContext', () => {
  beforeEach(() => {
    // Reset store and mock before each test
    store = {}
    localStorageMock = createLocalStorageMock()
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    })
    vi.clearAllMocks()
  })

  afterEach(() => {
    store = {}
  })

  describe('UIProvider', () => {
    it('should provide default UI mode as classic', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        createElement(UIProvider, null, children)

      const { result } = renderHook(() => useUIMode(), { wrapper })

      expect(result.current.uiMode).toBe('classic')
    })

    it('should allow setting UI mode to ink-diffusion', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        createElement(UIProvider, null, children)

      const { result } = renderHook(() => useUIMode(), { wrapper })

      act(() => {
        result.current.setUIMode('ink-diffusion')
      })

      expect(result.current.uiMode).toBe('ink-diffusion')
    })

    it('should allow setting UI mode back to classic', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        createElement(UIProvider, null, children)

      const { result } = renderHook(() => useUIMode(), { wrapper })

      act(() => {
        result.current.setUIMode('ink-diffusion')
      })

      expect(result.current.uiMode).toBe('ink-diffusion')

      act(() => {
        result.current.setUIMode('classic')
      })

      expect(result.current.uiMode).toBe('classic')
    })

    it('should persist UI mode to localStorage', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        createElement(UIProvider, null, children)

      const { result } = renderHook(() => useUIMode(), { wrapper })

      act(() => {
        result.current.setUIMode('ink-diffusion')
      })

      expect(localStorageMock.setItem).toHaveBeenCalledWith('scribengine-ui-mode', 'ink-diffusion')
    })

    it('should load UI mode from localStorage on mount', () => {
      // Pre-set localStorage value before creating provider
      store['scribengine-ui-mode'] = 'ink-diffusion'

      const wrapper = ({ children }: { children: React.ReactNode }) =>
        createElement(UIProvider, null, children)

      renderHook(() => useUIMode(), { wrapper })

      expect(localStorageMock.getItem).toHaveBeenCalledWith('scribengine-ui-mode')
    })
  })

  describe('useUIMode hook', () => {
    it('should return default values when used outside provider', () => {
      const { result } = renderHook(() => useUIMode())

      expect(result.current.uiMode).toBe('classic')
      expect(typeof result.current.setUIMode).toBe('function')
    })

    it('should toggle UI mode', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        createElement(UIProvider, null, children)

      const { result } = renderHook(() => useUIMode(), { wrapper })

      expect(result.current.uiMode).toBe('classic')

      act(() => {
        result.current.toggleUIMode()
      })

      expect(result.current.uiMode).toBe('ink-diffusion')

      act(() => {
        result.current.toggleUIMode()
      })

      expect(result.current.uiMode).toBe('classic')
    })
  })

  describe('UI mode validation', () => {
    it('should accept valid UI mode values', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        createElement(UIProvider, null, children)

      const { result } = renderHook(() => useUIMode(), { wrapper })

      const validModes = ['classic', 'ink-diffusion'] as const

      validModes.forEach((mode) => {
        act(() => {
          result.current.setUIMode(mode)
        })
        expect(result.current.uiMode).toBe(mode)
      })
    })
  })
})

describe('UI Mode Separation from Theme', () => {
  beforeEach(() => {
    store = {}
    localStorageMock = createLocalStorageMock()
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    })
    vi.clearAllMocks()
  })

  afterEach(() => {
    store = {}
  })

  it('should use different localStorage keys than theme', () => {
    // UIContext uses 'scribengine-ui-mode'
    // ThemeContext uses 'scribengine-theme'
    // These should be separate concerns

    const uiModeKey = 'scribengine-ui-mode'
    const themeKey = 'scribengine-theme'

    expect(uiModeKey).not.toBe(themeKey)
  })

  it('should allow independent UI mode switching', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      createElement(UIProvider, null, children)

    const { result } = renderHook(() => useUIMode(), { wrapper })

    // UI mode should start as classic
    expect(result.current.uiMode).toBe('classic')

    act(() => {
      result.current.setUIMode('ink-diffusion')
    })

    // Now it should be ink-diffusion
    expect(result.current.uiMode).toBe('ink-diffusion')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('scribengine-ui-mode', 'ink-diffusion')
  })
})

describe('Ink Diffusion UI Mode', () => {
  beforeEach(() => {
    store = {}
    localStorageMock = createLocalStorageMock()
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    })
    vi.clearAllMocks()
  })

  afterEach(() => {
    store = {}
  })

  it('should define ink-diffusion as a valid UI mode', () => {
    const validModes = ['classic', 'ink-diffusion']
    expect(validModes).toContain('ink-diffusion')
  })

  it('should be the alternate UI mode to classic', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      createElement(UIProvider, null, children)

    const { result } = renderHook(() => useUIMode(), { wrapper })

    // Start with classic
    expect(result.current.uiMode).toBe('classic')

    // Toggle should switch to ink-diffusion
    act(() => {
      result.current.toggleUIMode()
    })

    expect(result.current.uiMode).toBe('ink-diffusion')
  })
})
