'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { UIProvider } from '@/contexts/UIContext'
import { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <UIProvider>
          {children}
        </UIProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
