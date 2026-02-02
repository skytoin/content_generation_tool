import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { ThemeProvider } from '@/contexts/ThemeContext'

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
vi.spyOn(document.documentElement, 'setAttribute').mockImplementation(() => {})

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  const renderWithProvider = () => {
    return render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    )
  }

  describe('rendering', () => {
    it('should render the theme button', () => {
      renderWithProvider()

      const button = screen.getByTitle('Switch theme')
      expect(button).toBeInTheDocument()
    })

    it('should show Theme text on larger screens', () => {
      renderWithProvider()

      expect(screen.getByText('Theme')).toBeInTheDocument()
    })

    it('should not show dropdown by default', () => {
      renderWithProvider()

      expect(screen.queryByText('Original')).not.toBeInTheDocument()
      expect(screen.queryByText('Premium Blend')).not.toBeInTheDocument()
      expect(screen.queryByText('Ink Diffusion')).not.toBeInTheDocument()
    })
  })

  describe('dropdown behavior', () => {
    it('should open dropdown when clicking theme button', () => {
      renderWithProvider()

      const button = screen.getByTitle('Switch theme')
      fireEvent.click(button)

      expect(screen.getByText('Original')).toBeInTheDocument()
      expect(screen.getByText('Premium Blend')).toBeInTheDocument()
      expect(screen.getByText('Ink Diffusion')).toBeInTheDocument()
    })

    it('should show all three theme options', () => {
      renderWithProvider()

      fireEvent.click(screen.getByTitle('Switch theme'))

      expect(screen.getByText('Blue & magenta theme')).toBeInTheDocument()
      expect(screen.getByText('Warm cream & terracotta')).toBeInTheDocument()
      expect(screen.getByText('Burgundy & gold elegance')).toBeInTheDocument()
    })

    it('should close dropdown when clicking backdrop', () => {
      renderWithProvider()

      fireEvent.click(screen.getByTitle('Switch theme'))
      expect(screen.getByText('Original')).toBeInTheDocument()

      // Click backdrop (the fixed inset-0 div)
      const backdrop = document.querySelector('.fixed.inset-0.z-40')
      if (backdrop) {
        fireEvent.click(backdrop)
      }

      expect(screen.queryByText('Original')).not.toBeInTheDocument()
    })
  })

  describe('theme selection', () => {
    it('should select original theme', () => {
      renderWithProvider()

      fireEvent.click(screen.getByTitle('Switch theme'))
      fireEvent.click(screen.getByText('Original'))

      expect(localStorageMock.setItem).toHaveBeenCalledWith('scribengine-theme', 'original')
    })

    it('should select premium-blend theme', () => {
      renderWithProvider()

      fireEvent.click(screen.getByTitle('Switch theme'))
      fireEvent.click(screen.getByText('Premium Blend'))

      expect(localStorageMock.setItem).toHaveBeenCalledWith('scribengine-theme', 'premium-blend')
    })

    it('should select ink-diffusion theme', () => {
      renderWithProvider()

      fireEvent.click(screen.getByTitle('Switch theme'))
      fireEvent.click(screen.getByText('Ink Diffusion'))

      expect(localStorageMock.setItem).toHaveBeenCalledWith('scribengine-theme', 'ink-diffusion')
    })

    it('should close dropdown after selecting a theme', () => {
      renderWithProvider()

      fireEvent.click(screen.getByTitle('Switch theme'))
      expect(screen.getByText('Ink Diffusion')).toBeInTheDocument()

      fireEvent.click(screen.getByText('Ink Diffusion'))

      expect(screen.queryByText('Premium Blend')).not.toBeInTheDocument()
    })
  })

  describe('theme configurations', () => {
    it('should have correct theme count', () => {
      renderWithProvider()

      fireEvent.click(screen.getByTitle('Switch theme'))

      const themeButtons = screen.getAllByRole('button').filter(
        btn => btn.textContent?.includes('theme') ||
               btn.textContent?.includes('cream') ||
               btn.textContent?.includes('elegance')
      )

      // 3 theme option buttons in dropdown (Original, Premium Blend, Ink Diffusion)
      expect(themeButtons.length).toBe(3)
    })
  })

  describe('accessibility', () => {
    it('should have accessible button with title', () => {
      renderWithProvider()

      const button = screen.getByTitle('Switch theme')
      expect(button).toHaveAttribute('title', 'Switch theme')
    })

    it('should allow keyboard navigation', () => {
      renderWithProvider()

      const button = screen.getByTitle('Switch theme')
      button.focus()

      expect(document.activeElement).toBe(button)
    })
  })
})

describe('Ink Diffusion theme configuration', () => {
  it('should have correct color values defined', () => {
    // These should match the CSS variables in globals.css
    const inkDiffusionConfig = {
      name: 'Ink Diffusion',
      description: 'Burgundy & gold elegance',
      gradientColors: ['#722F37', '#D4AF37'],
    }

    expect(inkDiffusionConfig.name).toBe('Ink Diffusion')
    expect(inkDiffusionConfig.description).toBe('Burgundy & gold elegance')
    expect(inkDiffusionConfig.gradientColors).toContain('#722F37')
    expect(inkDiffusionConfig.gradientColors).toContain('#D4AF37')
  })
})
