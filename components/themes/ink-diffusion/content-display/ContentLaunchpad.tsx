'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { tokens } from '../primitives/design-tokens'
import { InkButton } from '../primitives/InkButton'

interface ContentLaunchpadProps {
  sourceProjectId: string
  contentPillars: string[]
  platformStrategy: Record<string, string>
  selectedPlatforms: string[]
  topKeywords?: string[]
  company?: string
  industry?: string
  audience?: string
  goals?: string
}

const PLATFORM_MAP: Record<string, { label: string; color: string; bgColor: string; icon: JSX.Element; subtypes: { id: string; label: string }[] }> = {
  linkedin: {
    label: 'LinkedIn',
    color: '#0A66C2',
    bgColor: '#EDF4FC',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
      </svg>
    ),
    subtypes: [
      { id: 'text-posts', label: 'Text Posts' },
      { id: 'carousels', label: 'Carousel' },
      { id: 'articles', label: 'Article' },
      { id: 'polls', label: 'Poll' },
    ],
  },
  twitter: {
    label: 'X',
    color: '#000000',
    bgColor: '#F0F0F0',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    subtypes: [
      { id: 'tweets', label: 'Tweets' },
      { id: 'thread', label: 'Thread' },
      { id: 'quote-tweets', label: 'Quote Tweets' },
    ],
  },
  blog: {
    label: 'Blog Article',
    color: tokens.colors.ink[700],
    bgColor: tokens.colors.ink[50],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    subtypes: [],
  },
  instagram: {
    label: 'Instagram',
    color: '#E1306C',
    bgColor: '#FEF0F4',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
    subtypes: [
      { id: 'carousel', label: 'Carousel' },
      { id: 'single-post', label: 'Single Post' },
      { id: 'reels-cover', label: 'Reels Cover' },
      { id: 'story', label: 'Story' },
    ],
  },
}

function normalizePlatformKey(key: string): string | null {
  const lower = key.toLowerCase().trim()
  if (lower.includes('linkedin')) return 'linkedin'
  if (lower.includes('twitter') || lower.includes('x (twitter)') || lower === 'x' || lower === 'x/twitter') return 'twitter'
  if (lower.includes('blog') || lower.includes('website') || lower.includes('article')) return 'blog'
  if (lower.includes('instagram')) return 'instagram'
  return null
}

/** Styled select wrapper that matches Ink Diffusion design */
function InkSelect({ value, onChange, placeholder, options, accentColor }: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  options: { value: string; label: string }[]
  accentColor?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selectedLabel = options.find(o => o.value === value)?.label

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-sm transition-all text-left"
        style={{
          fontFamily: tokens.fonts.sans,
          background: value ? (accentColor ? `${accentColor}08` : tokens.colors.paper.warm) : tokens.colors.paper.warm,
          border: `1.5px solid ${value && accentColor ? accentColor : open ? tokens.colors.ink[300] : tokens.colors.paper.border}`,
          color: value ? tokens.colors.text.primary : tokens.colors.text.muted,
        }}
      >
        <span className={value ? 'font-medium' : ''}>{selectedLabel || placeholder}</span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className="shrink-0 transition-transform"
          style={{ transform: open ? 'rotate(180deg)' : 'none', color: tokens.colors.text.subtle }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute z-20 mt-1 w-full rounded-xl overflow-hidden shadow-lg"
          style={{
            background: tokens.colors.paper.white,
            border: `1px solid ${tokens.colors.paper.border}`,
          }}
        >
          {options.map(option => (
            <button
              key={option.value}
              onClick={() => { onChange(option.value); setOpen(false) }}
              className="w-full px-4 py-2.5 text-sm text-left transition-colors flex items-center gap-2"
              style={{
                fontFamily: tokens.fonts.sans,
                background: option.value === value ? (accentColor ? `${accentColor}12` : tokens.colors.ink[50]) : 'transparent',
                color: option.value === value ? (accentColor || tokens.colors.ink[700]) : tokens.colors.text.secondary,
                fontWeight: option.value === value ? 600 : 400,
              }}
              onMouseEnter={e => { (e.target as HTMLElement).style.background = tokens.colors.paper.warm }}
              onMouseLeave={e => {
                (e.target as HTMLElement).style.background = option.value === value
                  ? (accentColor ? `${accentColor}12` : tokens.colors.ink[50])
                  : 'transparent'
              }}
            >
              {option.value === value && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function ContentLaunchpad({
  sourceProjectId,
  contentPillars,
  platformStrategy,
  selectedPlatforms: userSelectedPlatforms,
  topKeywords,
}: ContentLaunchpadProps) {
  const router = useRouter()
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [selectedSubtype, setSelectedSubtype] = useState<string | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<string>('')
  const [customTopic, setCustomTopic] = useState('')

  // Show platforms the user selected when creating the CA project
  // Normalize and filter to only those we support in the launchpad
  const availablePlatforms = userSelectedPlatforms
    .map(normalizePlatformKey)
    .filter((p): p is string => p !== null && PLATFORM_MAP[p] !== undefined)
    .filter((p, i, arr) => arr.indexOf(p) === i)

  if (availablePlatforms.length === 0 && contentPillars.length === 0) {
    return null
  }

  const currentPlatformConfig = selectedPlatform ? PLATFORM_MAP[selectedPlatform] : null
  const isCustom = selectedTopic === '__custom__'
  const activeTopic = isCustom ? customTopic : selectedTopic
  const hasSubtypes = currentPlatformConfig ? currentPlatformConfig.subtypes.length > 0 : false
  const canGenerate = selectedPlatform && activeTopic && (!hasSubtypes || selectedSubtype)

  const topicOptions = [
    ...contentPillars.map(p => ({ value: p, label: p })),
    { value: '__custom__', label: 'Custom topic...' },
  ]

  const handleGenerate = () => {
    if (!canGenerate || !selectedPlatform) return

    const params = new URLSearchParams()
    params.set('source', sourceProjectId)

    if (selectedPlatform === 'blog') {
      params.set('type', 'blog-post')
    } else {
      params.set('type', 'social-media')
      params.set('platform', selectedPlatform === 'twitter' ? 'twitter' : selectedPlatform)
      if (selectedSubtype) {
        params.set('subtype', selectedSubtype)
      }
    }

    if (activeTopic) {
      params.set('topic', activeTopic)
    }

    router.push(`/dashboard/projects/new?${params.toString()}`)
  }

  return (
    <div
      className="rounded-2xl"
      style={{
        border: `1px solid ${tokens.colors.paper.border}`,
        background: tokens.colors.paper.white,
      }}
    >
      {/* Header */}
      <div
        className="relative px-6 sm:px-8 py-5 sm:py-6"
        style={{
          background: `linear-gradient(135deg, ${tokens.colors.ink[50]} 0%, ${tokens.colors.paper.white} 100%)`,
          borderBottom: `1px solid ${tokens.colors.paper.border}`,
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{
          background: `linear-gradient(90deg, ${tokens.colors.ink[700]}, ${tokens.colors.sage[500]}, ${tokens.colors.ink[400]})`,
        }} />
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: `linear-gradient(135deg, ${tokens.colors.ink[700]}, ${tokens.colors.ink[600]})`,
              boxShadow: `0 2px 8px ${tokens.colors.ink[700]}33`,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </div>
          <div>
            <h2
              className="text-lg font-light"
              style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
            >
              Content Launchpad
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
            >
              Turn your strategy into content
            </p>
          </div>
        </div>
      </div>

      {/* Compact form */}
      <div className="px-6 sm:px-8 py-6 space-y-5">

        {/* Platform cards — these stay as compact cards since there are only 2-4 */}
        <div>
          <label
            className="block text-xs font-medium uppercase tracking-[0.1em] mb-3"
            style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
          >
            Platform
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {availablePlatforms.map(platformKey => {
              const config = PLATFORM_MAP[platformKey]
              const isSelected = selectedPlatform === platformKey
              return (
                <button
                  key={platformKey}
                  onClick={() => {
                    setSelectedPlatform(platformKey)
                    setSelectedSubtype(null)
                  }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    fontFamily: tokens.fonts.sans,
                    background: isSelected ? config.bgColor : tokens.colors.paper.warm,
                    color: isSelected ? config.color : tokens.colors.text.muted,
                    border: `1.5px solid ${isSelected ? config.color : 'transparent'}`,
                  }}
                >
                  <span style={{ color: isSelected ? config.color : tokens.colors.text.subtle }}>
                    {config.icon}
                  </span>
                  {config.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content Type + Topic dropdowns — shown after platform is selected */}
        {selectedPlatform && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Content Type dropdown — only for platforms with subtypes */}
            {hasSubtypes && (
              <div>
                <label
                  className="block text-xs font-medium uppercase tracking-[0.1em] mb-2"
                  style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                >
                  Content Type
                </label>
                <InkSelect
                  value={selectedSubtype || ''}
                  onChange={v => setSelectedSubtype(v)}
                  placeholder="Select type..."
                  options={currentPlatformConfig!.subtypes.map(s => ({ value: s.id, label: s.label }))}
                  accentColor={currentPlatformConfig!.color}
                />
              </div>
            )}

            {/* Topic dropdown */}
            <div className={!hasSubtypes ? 'sm:col-span-2' : ''}>
              <label
                className="block text-xs font-medium uppercase tracking-[0.1em] mb-2"
                style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
              >
                Topic
                {contentPillars.length > 0 && (
                  <span
                    className="ml-2 normal-case tracking-normal font-normal"
                    style={{ color: tokens.colors.text.subtle }}
                  >
                    from your strategy pillars
                  </span>
                )}
              </label>
              <InkSelect
                value={selectedTopic}
                onChange={v => { setSelectedTopic(v); if (v !== '__custom__') setCustomTopic('') }}
                placeholder="Choose a topic..."
                options={topicOptions}
                accentColor={tokens.colors.sage[600]}
              />
              {isCustom && (
                <input
                  type="text"
                  value={customTopic}
                  onChange={e => setCustomTopic(e.target.value)}
                  placeholder="Type your topic..."
                  className="mt-2 w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{
                    fontFamily: tokens.fonts.sans,
                    background: tokens.colors.paper.warm,
                    border: `1.5px solid ${tokens.colors.paper.border}`,
                    color: tokens.colors.text.primary,
                  }}
                  autoFocus
                />
              )}
            </div>
          </div>
        )}

        {/* SEO Keywords hint — compact inline */}
        {selectedPlatform && topKeywords && topKeywords.length > 0 && (
          <div
            className="flex items-center gap-2 text-xs"
            style={{ color: tokens.colors.text.subtle, fontFamily: tokens.fonts.sans }}
          >
            <span
              className="font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-[10px]"
              style={{ background: tokens.colors.sage[100], color: tokens.colors.sage[800] }}
            >
              SEO
            </span>
            {topKeywords.slice(0, 5).join(' \u00B7 ')}
          </div>
        )}

        {/* Generate */}
        {selectedPlatform && (
          <div>
            <InkButton
              variant="primary"
              onClick={handleGenerate}
              disabled={!canGenerate}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
              {canGenerate
                ? `Generate ${currentPlatformConfig?.label || ''} Content`
                : !activeTopic
                  ? 'Pick a topic to continue'
                  : 'Select a content type'}
            </InkButton>
          </div>
        )}
      </div>
    </div>
  )
}
