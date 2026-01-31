'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { useState } from 'react'

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium text-slate-600"
        title="Switch theme"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
        <span className="hidden sm:inline">Theme</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden">
            <div className="p-2">
              <button
                onClick={() => {
                  if (theme !== 'original') toggleTheme()
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  theme === 'original'
                    ? 'bg-primary-50 text-primary-700'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-fuchsia-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">O</span>
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">Original</div>
                  <div className="text-xs text-slate-500">Blue & magenta theme</div>
                </div>
                {theme === 'original' && (
                  <svg className="w-4 h-4 ml-auto text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              <button
                onClick={() => {
                  if (theme !== 'premium-blend') toggleTheme()
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors mt-1 ${
                  theme === 'premium-blend'
                    ? 'bg-orange-50 text-orange-700'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-green-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">Premium Blend</div>
                  <div className="text-xs text-slate-500">Warm cream & terracotta</div>
                </div>
                {theme === 'premium-blend' && (
                  <svg className="w-4 h-4 ml-auto text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
