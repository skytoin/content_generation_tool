'use client'

import { useUIMode } from '@/contexts/UIContext'
import { Sidebar } from './Sidebar'
import { InkSidebar } from '@/components/themes/ink-diffusion/InkSidebar'
import { tokens } from '@/components/ui-concepts/ink-diffusion-system/design-tokens'

interface DashboardLayoutWrapperProps {
  children: React.ReactNode
}

export function DashboardLayoutWrapper({ children }: DashboardLayoutWrapperProps) {
  const { uiMode } = useUIMode()
  const isInkDiffusion = uiMode === 'ink-diffusion'

  return (
    <div
      className={`min-h-screen ${isInkDiffusion ? '' : 'bg-slate-50'}`}
      style={isInkDiffusion ? { background: tokens.colors.paper.cream } : undefined}
    >
      {/* Sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        {isInkDiffusion ? <InkSidebar /> : <Sidebar />}
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
