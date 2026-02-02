'use client'

import { useUIMode, UIMode } from '@/contexts/UIContext'
import { useState } from 'react'
import { tokens } from '@/components/ui-concepts/ink-diffusion-system/design-tokens'

const uiModes: { id: UIMode; name: string; description: string; gradient: string }[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Original Scribengine UI',
    gradient: 'from-slate-400 to-slate-600',
  },
  {
    id: 'ink-diffusion',
    name: 'Ink Diffusion',
    description: 'Editorial luxury design',
    gradient: 'from-[#722F37] to-[#D4AF37]',
  },
]

export function UISwitcher() {
  const { uiMode, setUIMode } = useUIMode()
  const [isOpen, setIsOpen] = useState(false)

  const currentMode = uiModes.find(m => m.id === uiMode)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium text-slate-600"
        title="Switch UI mode"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
        <span className="hidden sm:inline">UI</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Dashboard Style
              </p>
            </div>
            <div className="p-2">
              {uiModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setUIMode(mode.id)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                    uiMode === mode.id
                      ? mode.id === 'ink-diffusion'
                        ? 'bg-[#722F37]/10 text-[#722F37]'
                        : 'bg-slate-100 text-slate-700'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${mode.gradient} flex items-center justify-center`}>
                    <span className="text-white text-xs font-bold">{mode.name.charAt(0)}</span>
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium text-sm">{mode.name}</div>
                    <div className="text-xs text-slate-500">{mode.description}</div>
                  </div>
                  {uiMode === mode.id && (
                    <svg
                      className={`w-5 h-5 ${mode.id === 'ink-diffusion' ? 'text-[#722F37]' : 'text-slate-600'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                Switch between UI styles without losing your data
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Compact version for sidebar
export function UISwitcherCompact() {
  const { uiMode, toggleUIMode } = useUIMode()

  return (
    <button
      onClick={toggleUIMode}
      className="flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all"
      style={{
        background: uiMode === 'ink-diffusion'
          ? `${tokens.colors.ink[700]}10`
          : 'rgba(0,0,0,0.03)',
        border: `1px solid ${uiMode === 'ink-diffusion' ? tokens.colors.ink[200] : 'transparent'}`,
      }}
      title="Switch UI mode"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: uiMode === 'ink-diffusion'
              ? `linear-gradient(135deg, ${tokens.colors.ink[700]}, ${tokens.colors.sage[500]})`
              : 'linear-gradient(135deg, #64748b, #334155)'
          }}
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
          </svg>
        </div>
        <div className="text-left">
          <p
            className="text-sm font-medium"
            style={{
              color: uiMode === 'ink-diffusion'
                ? tokens.colors.ink[700]
                : tokens.colors.text.primary
            }}
          >
            {uiMode === 'ink-diffusion' ? 'Ink Diffusion' : 'Classic'} UI
          </p>
          <p className="text-xs" style={{ color: tokens.colors.text.muted }}>
            Click to switch
          </p>
        </div>
      </div>
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        style={{ color: tokens.colors.text.muted }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
      </svg>
    </button>
  )
}
