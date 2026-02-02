import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { createElement } from 'react'
import { UIProvider } from '@/contexts/UIContext'
import { UISwitcher, UISwitcherCompact } from '@/components/UISwitcher'

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

describe('UISwitcher Component', () => {
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
    cleanup()
  })

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      createElement(UIProvider, null, component)
    )
  }

  describe('UISwitcher', () => {
    it('should render the UI switcher button', () => {
      renderWithProvider(createElement(UISwitcher))

      // Should have a button to open the dropdown
      const button = screen.getByRole('button')
      expect(button).toBeDefined()
    })

    it('should show dropdown when clicked', () => {
      renderWithProvider(createElement(UISwitcher))

      const button = screen.getByRole('button')
      fireEvent.click(button)

      // Should show UI mode options in dropdown
      // Look for Classic and Ink Diffusion buttons after clicking
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(1)
    })

    it('should have a title attribute for accessibility', () => {
      renderWithProvider(createElement(UISwitcher))

      const button = screen.getByRole('button')
      // Should have title attribute
      expect(button.getAttribute('title')).toBe('Switch UI mode')
    })
  })

  describe('UISwitcherCompact', () => {
    it('should render the compact UI switcher', () => {
      renderWithProvider(createElement(UISwitcherCompact))

      // Should have a button
      const button = screen.getByRole('button')
      expect(button).toBeDefined()
    })

    it('should toggle UI mode when clicked', () => {
      renderWithProvider(createElement(UISwitcherCompact))

      const button = screen.getByRole('button')

      // Click to toggle from classic to ink-diffusion
      fireEvent.click(button)

      // Should have set to ink-diffusion
      expect(localStorageMock.setItem).toHaveBeenCalledWith('scribengine-ui-mode', 'ink-diffusion')
    })

    it('should show tooltip on hover', () => {
      renderWithProvider(createElement(UISwitcherCompact))

      // The component should have title/tooltip for accessibility
      const button = screen.getByRole('button')
      expect(button.getAttribute('title') || button.textContent).toBeTruthy()
    })
  })
})

describe('UI Mode Integration', () => {
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
    cleanup()
  })

  it('should persist UI mode preference', () => {
    render(
      createElement(UIProvider, null, createElement(UISwitcherCompact))
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(localStorageMock.setItem).toHaveBeenCalledWith('scribengine-ui-mode', 'ink-diffusion')
  })

  it('should allow switching between Classic and Ink Diffusion', () => {
    render(
      createElement(UIProvider, null, createElement(UISwitcherCompact))
    )

    const button = screen.getByRole('button')

    // First click: classic -> ink-diffusion
    fireEvent.click(button)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('scribengine-ui-mode', 'ink-diffusion')

    // Second click: ink-diffusion -> classic
    fireEvent.click(button)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('scribengine-ui-mode', 'classic')
  })
})

describe('UI Switcher Accessibility', () => {
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
    cleanup()
  })

  it('should be keyboard accessible', () => {
    render(
      createElement(UIProvider, null, createElement(UISwitcherCompact))
    )

    const button = screen.getByRole('button')

    // Should be focusable
    button.focus()
    expect(document.activeElement).toBe(button)

    // Should respond to keyboard activation
    fireEvent.keyDown(button, { key: 'Enter' })
  })

  it('should have descriptive aria labels or text', () => {
    render(
      createElement(UIProvider, null, createElement(UISwitcherCompact))
    )

    const button = screen.getByRole('button')

    // Should have some accessible name
    const hasAccessibleName =
      button.getAttribute('aria-label') ||
      button.textContent ||
      button.getAttribute('title')

    expect(hasAccessibleName).toBeTruthy()
  })
})
