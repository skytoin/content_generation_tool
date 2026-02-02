'use client'

/**
 * INK STYLE SELECTOR
 *
 * Elegant style customization with Ink Diffusion aesthetic.
 * Collapsible categories with ink-themed styling.
 */

import { useState } from 'react'
import { styleCategories, getTotalOptions } from '@/lib/style-categories'
import { tokens } from './design-tokens'

interface InkStyleSelectorProps {
  selections: Record<string, string>
  onChange: (selections: Record<string, string>) => void
}

// SVG icons for categories
const categoryIcons: Record<string, React.ReactNode> = {
  tone_of_voice: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8" />
    </svg>
  ),
  writing_style: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
    </svg>
  ),
  audience_sophistication: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  content_depth: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  ),
  brand_personality: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <path d="M9 9h6v6H9z" />
    </svg>
  ),
  emotional_appeal: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  perspective_voice: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  content_purpose: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  opening_hook: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  cta_style: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  ),
  formatting_preferences: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="21" y1="10" x2="3" y2="10" />
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="14" x2="3" y2="14" />
      <line x1="21" y1="18" x2="3" y2="18" />
    </svg>
  ),
  evidence_credibility: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  seo_discoverability: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
}

export function InkStyleSelector({ selections, onChange }: InkStyleSelectorProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const totalOptions = getTotalOptions()

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleChange = (optionId: string, value: string) => {
    onChange({ ...selections, [optionId]: value })
  }

  const clearSelection = (optionId: string) => {
    const newSelections = { ...selections }
    delete newSelections[optionId]
    onChange(newSelections)
  }

  const selectedCount = Object.keys(selections).length

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <p
          className="text-sm"
          style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
        >
          {selectedCount} of {totalOptions} options customized
        </p>
        {selectedCount > 0 && (
          <button
            onClick={() => onChange({})}
            className="text-sm transition-colors"
            style={{ color: tokens.colors.ink[600], fontFamily: tokens.fonts.sans }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {styleCategories.map((category) => {
          const setCount = category.options.filter(opt => selections[opt.id]).length
          const isExpanded = expandedCategories.includes(category.id)
          const icon = categoryIcons[category.id] || categoryIcons.tone_of_voice

          return (
            <div
              key={category.id}
              className="rounded-xl overflow-hidden transition-all"
              style={{
                border: `1px solid ${isExpanded ? tokens.colors.ink[200] : tokens.colors.paper.border}`,
                background: isExpanded ? tokens.colors.paper.white : tokens.colors.paper.warm,
              }}
            >
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-4 transition-colors"
                style={{
                  background: isExpanded ? tokens.colors.paper.warm : 'transparent',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{
                      background: isExpanded ? tokens.colors.ink[50] : tokens.colors.paper.white,
                      color: isExpanded ? tokens.colors.ink[700] : tokens.colors.text.muted,
                    }}
                  >
                    {icon}
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <span
                      className="font-medium block text-sm sm:text-base"
                      style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
                    >
                      {category.name}
                    </span>
                    <span
                      className="text-xs line-clamp-1 sm:line-clamp-none"
                      style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                    >
                      {category.description}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {setCount > 0 && (
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        background: tokens.colors.ink[50],
                        color: tokens.colors.ink[700],
                        fontFamily: tokens.fonts.mono,
                      }}
                    >
                      {setCount} set
                    </span>
                  )}
                  <svg
                    className="transition-transform"
                    style={{
                      color: tokens.colors.text.muted,
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {isExpanded && (
                <div
                  className="p-4 space-y-5"
                  style={{ borderTop: `1px solid ${tokens.colors.paper.border}` }}
                >
                  {category.options.map((option) => (
                    <div key={option.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label
                          className="text-sm font-medium"
                          style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}
                        >
                          {option.label}
                        </label>
                        {selections[option.id] && (
                          <button
                            onClick={() => clearSelection(option.id)}
                            className="text-xs transition-colors"
                            style={{ color: tokens.colors.ink[500], fontFamily: tokens.fonts.sans }}
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <p
                        className="text-xs"
                        style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                      >
                        {option.hint}
                      </p>
                      <select
                        value={selections[option.id] || ''}
                        onChange={(e) =>
                          e.target.value
                            ? handleChange(option.id, e.target.value)
                            : clearSelection(option.id)
                        }
                        className="w-full rounded-xl px-4 py-3 text-sm transition-all outline-none"
                        style={{
                          background: selections[option.id] ? tokens.colors.ink[50] : tokens.colors.paper.warm,
                          border: `1px solid ${selections[option.id] ? tokens.colors.ink[200] : tokens.colors.paper.border}`,
                          color: tokens.colors.text.primary,
                          fontFamily: tokens.fonts.sans,
                        }}
                      >
                        <option value="">Auto-infer from context</option>
                        {option.choices.map((choice) => (
                          <option key={choice.value} value={choice.value}>
                            {choice.label} — {choice.hint}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default InkStyleSelector
