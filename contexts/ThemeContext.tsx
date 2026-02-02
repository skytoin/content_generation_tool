'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'original' | 'premium-blend' | 'ink-diffusion'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('original')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('scribengine-theme') as Theme | null
    if (savedTheme && (savedTheme === 'original' || savedTheme === 'premium-blend' || savedTheme === 'ink-diffusion')) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      // Save theme to localStorage
      localStorage.setItem('scribengine-theme', theme)
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
      theme: 'original' as Theme,
      setTheme: () => {},
      toggleTheme: () => {},
    }
  }
  return context
}
