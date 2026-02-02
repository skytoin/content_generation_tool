'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type UIMode = 'classic' | 'ink-diffusion'

// Increment this version when changing the default UI mode
// This will reset all users to the new default once
const UI_MODE_VERSION = '2'
const UI_MODE_KEY = 'scribengine-ui-mode'
const UI_MODE_VERSION_KEY = 'scribengine-ui-mode-version'
const DEFAULT_UI_MODE: UIMode = 'ink-diffusion'

interface UIContextType {
  uiMode: UIMode
  setUIMode: (mode: UIMode) => void
  toggleUIMode: () => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export function UIProvider({ children }: { children: ReactNode }) {
  const [uiMode, setUIMode] = useState<UIMode>(DEFAULT_UI_MODE)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check if we need to reset due to version change
    const storedVersion = localStorage.getItem(UI_MODE_VERSION_KEY)

    if (storedVersion !== UI_MODE_VERSION) {
      // Version mismatch - reset to new default and update version
      localStorage.setItem(UI_MODE_KEY, DEFAULT_UI_MODE)
      localStorage.setItem(UI_MODE_VERSION_KEY, UI_MODE_VERSION)
      setUIMode(DEFAULT_UI_MODE)
    } else {
      // Load saved UI mode from localStorage
      const savedMode = localStorage.getItem(UI_MODE_KEY) as UIMode | null
      if (savedMode && (savedMode === 'classic' || savedMode === 'ink-diffusion')) {
        setUIMode(savedMode)
      }
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      // Save UI mode to localStorage
      localStorage.setItem(UI_MODE_KEY, uiMode)
      // Apply UI mode to document for CSS targeting if needed
      document.documentElement.setAttribute('data-ui-mode', uiMode)
    }
  }, [uiMode, mounted])

  const toggleUIMode = () => {
    setUIMode(prev => prev === 'classic' ? 'ink-diffusion' : 'classic')
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <UIContext.Provider value={{ uiMode, setUIMode, toggleUIMode }}>
      {children}
    </UIContext.Provider>
  )
}

export function useUIMode() {
  const context = useContext(UIContext)
  // Return default values if used outside provider (e.g., during SSG)
  if (context === undefined) {
    return {
      uiMode: 'ink-diffusion' as UIMode,
      setUIMode: () => {},
      toggleUIMode: () => {},
    }
  }
  return context
}
