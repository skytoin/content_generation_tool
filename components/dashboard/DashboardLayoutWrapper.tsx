'use client'

import { useState } from 'react'
import { useUIMode } from '@/contexts/UIContext'
import { Sidebar } from './Sidebar'
import { InkSidebar } from '@/components/themes/ink-diffusion/InkSidebar'
import { tokens } from '@/components/ui-concepts/ink-diffusion-system/design-tokens'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface DashboardLayoutWrapperProps {
  children: React.ReactNode
}

// Navigation items for mobile menu
const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { href: '/dashboard/projects', label: 'Projects', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { href: '/dashboard/projects/new', label: 'New Project', icon: 'M12 4v16m8-8H4' },
]

export function DashboardLayoutWrapper({ children }: DashboardLayoutWrapperProps) {
  const { uiMode, toggleUIMode } = useUIMode()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isInkDiffusion = uiMode === 'ink-diffusion'

  return (
    <div
      className={`min-h-screen ${isInkDiffusion ? '' : 'bg-slate-50'}`}
      style={isInkDiffusion ? { background: tokens.colors.paper.cream } : undefined}
    >
      {/* Mobile header - visible only on small screens */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 flex items-center justify-between px-4"
        style={{
          background: isInkDiffusion ? tokens.colors.paper.white : 'white',
          borderBottom: `1px solid ${isInkDiffusion ? tokens.colors.paper.border : '#e2e8f0'}`,
        }}
      >
        {/* Logo/Brand */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: isInkDiffusion
                ? `linear-gradient(135deg, ${tokens.colors.ink[700]}, ${tokens.colors.sage[500]})`
                : 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
            }}
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <span
            className="font-semibold text-lg"
            style={{
              color: isInkDiffusion ? tokens.colors.text.primary : '#1e293b',
              fontFamily: isInkDiffusion ? tokens.fonts.serif : 'inherit',
            }}
          >
            Scribengine
          </span>
        </Link>

        {/* Right side buttons */}
        <div className="flex items-center gap-2">
          {/* UI Mode Toggle */}
          <button
            onClick={toggleUIMode}
            className="p-2 rounded-lg transition-colors"
            style={{
              background: isInkDiffusion ? tokens.colors.ink[50] : '#f1f5f9',
              color: isInkDiffusion ? tokens.colors.ink[700] : '#475569',
            }}
            title={`Switch to ${isInkDiffusion ? 'Classic' : 'Ink Diffusion'} UI`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </button>

          {/* Hamburger menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg transition-colors"
            style={{
              background: mobileMenuOpen
                ? (isInkDiffusion ? tokens.colors.ink[100] : '#e2e8f0')
                : 'transparent',
              color: isInkDiffusion ? tokens.colors.text.primary : '#1e293b',
            }}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 z-30 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu panel */}
          <div
            className="lg:hidden fixed top-16 left-0 right-0 z-30 max-h-[calc(100vh-4rem)] overflow-y-auto"
            style={{
              background: isInkDiffusion ? tokens.colors.paper.white : 'white',
              borderBottom: `1px solid ${isInkDiffusion ? tokens.colors.paper.border : '#e2e8f0'}`,
            }}
          >
            {/* Navigation links */}
            <nav className="p-4 space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
                    style={{
                      background: isActive
                        ? (isInkDiffusion ? tokens.colors.ink[50] : '#f1f5f9')
                        : 'transparent',
                      color: isActive
                        ? (isInkDiffusion ? tokens.colors.ink[700] : '#1e293b')
                        : (isInkDiffusion ? tokens.colors.text.secondary : '#64748b'),
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* UI Mode section */}
            <div
              className="p-4 border-t"
              style={{ borderColor: isInkDiffusion ? tokens.colors.paper.border : '#e2e8f0' }}
            >
              <p
                className="text-xs uppercase tracking-wider mb-3 px-4"
                style={{ color: isInkDiffusion ? tokens.colors.text.muted : '#94a3b8' }}
              >
                Dashboard Style
              </p>
              <button
                onClick={() => {
                  toggleUIMode()
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors"
                style={{
                  background: isInkDiffusion ? tokens.colors.ink[50] : '#f1f5f9',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      background: isInkDiffusion
                        ? `linear-gradient(135deg, ${tokens.colors.ink[700]}, ${tokens.colors.sage[500]})`
                        : 'linear-gradient(135deg, #64748b, #334155)'
                    }}
                  >
                    <span className="text-white text-sm font-bold">
                      {isInkDiffusion ? 'I' : 'C'}
                    </span>
                  </div>
                  <div className="text-left">
                    <p
                      className="font-medium"
                      style={{ color: isInkDiffusion ? tokens.colors.ink[700] : '#1e293b' }}
                    >
                      {isInkDiffusion ? 'Ink Diffusion' : 'Classic'} UI
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: isInkDiffusion ? tokens.colors.text.muted : '#64748b' }}
                    >
                      Tap to switch
                    </p>
                  </div>
                </div>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ color: isInkDiffusion ? tokens.colors.text.muted : '#94a3b8' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        {isInkDiffusion ? <InkSidebar /> : <Sidebar />}
      </div>

      {/* Main content */}
      <div className="lg:pl-64 pt-16 lg:pt-0">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
