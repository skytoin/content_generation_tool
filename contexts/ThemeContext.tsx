'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'original' | 'premium-blend' | 'ink-diffusion'

// Increment this version when changing the default theme
// This will reset all users to the new default once
const THEME_VERSION = '2'
const THEME_KEY = 'scribengine-theme'
const THEME_VERSION_KEY = 'scribengine-theme-version'
const DEFAULT_THEME: Theme = 'ink-diffusion'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check if we need to reset due to version change
    const storedVersion = localStorage.getItem(THEME_VERSION_KEY)

    if (storedVersion !== THEME_VERSION) {
      // Version mismatch - reset to new default and update version
      localStorage.setItem(THEME_KEY, DEFAULT_THEME)
      localStorage.setItem(THEME_VERSION_KEY, THEME_VERSION)
      setTheme(DEFAULT_THEME)
    } else {
      // Load saved theme from localStorage
      const savedTheme = localStorage.getItem(THEME_KEY) as Theme | null
      if (savedTheme && (savedTheme === 'original' || savedTheme === 'premium-blend' || savedTheme === 'ink-diffusion')) {
        setTheme(savedTheme)
      }
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      // Save theme to localStorage
      localStorage.setItem(THEME_KEY, theme)
      // Apply theme to document
      document.documentElement.setAttribute('data-theme', theme)
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prev => prev === 'original' ? 'premium-blend' : 'original')
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  // Return default values if used outside provider (e.g., during SSG)
  if (context === undefined) {
    return {
      theme: DEFAULT_THEME,
      setTheme: () => {},
      toggleTheme: () => {},
    }
  }
  return context
}
