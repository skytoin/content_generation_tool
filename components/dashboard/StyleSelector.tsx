'use client'

import { useState } from 'react'
import { styleCategories, getTotalOptions } from '@/lib/style-categories'

interface StyleSelectorProps {
  selections: Record<string, string>
  onChange: (selections: Record<string, string>) => void
}

export function StyleSelector({ selections, onChange }: StyleSelectorProps) {
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

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {Object.keys(selections).length} of {totalOptions} options customized
        </p>
        {Object.keys(selections).length > 0 && (
          <button
            onClick={() => onChange({})}
            className="text-sm text-red-500 hover:text-red-600"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-2">
        {styleCategories.map((category) => (
          <div key={category.id} className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{category.icon}</span>
                <div className="text-left">
                  <span className="font-medium text-slate-900">{category.name}</span>
                  <span className="text-slate-500 text-sm ml-2 hidden sm:inline">
                    {category.description}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {category.options.some(opt => selections[opt.id]) && (
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                    {category.options.filter(opt => selections[opt.id]).length} set
                  </span>
                )}
                <svg
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    expandedCategories.includes(category.id) ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {expandedCategories.includes(category.id) && (
              <div className="p-4 space-y-4 bg-white border-t border-slate-200">
                {category.options.map((option) => (
                  <div key={option.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-medium text-slate-700 text-sm">
                        {option.label}
                      </label>
                      {selections[option.id] && (
                        <button
                          onClick={() => clearSelection(option.id)}
                          className="text-xs text-red-500 hover:text-red-600"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{option.hint}</p>
                    <select
                      value={selections[option.id] || ''}
                      onChange={(e) =>
                        e.target.value
                          ? handleChange(option.id, e.target.value)
                          : clearSelection(option.id)
                      }
                      className={`w-full rounded-lg p-2.5 text-sm transition-all border ${
                        selections[option.id]
                          ? 'bg-primary-50 border-primary-300 text-primary-900'
                          : 'bg-white border-slate-200 text-slate-700'
                      } focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500`}
                    >
                      <option value="">Auto-infer from context</option>
                      {option.choices.map((choice) => (
                        <option key={choice.value} value={choice.value}>
                          {choice.label} - {choice.hint}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
