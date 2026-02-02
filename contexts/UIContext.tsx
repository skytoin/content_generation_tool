'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type UIMode = 'classic' | 'ink-diffusion'

interface UIContextType {
  uiMode: UIMode
  setUIMode: (mode: UIMode) => void
  toggleUIMode: () => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export function UIProvider({ children }: { children: ReactNode }) {
  const [uiMode, setUIMode] = useState<UIMode>('classic')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load saved UI mode from localStorage
    const savedMode = localStorage.getItem('scribengine-ui-mode') as UIMode | null
    if (savedMode && (savedMode === 'classic' || savedMode === 'ink-diffusion')) {
      setUIMode(savedMode)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      // Save UI mode to localStorage
      localStorage.setItem('scribengine-ui-mode', uiMode)
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
      uiMode: 'classic' as UIMode,
      setUIMode: () => {},
      toggleUIMode: () => {},
    }
  }
  return context
}
