'use client'

/**
 * INK PROJECT DETAIL
 *
 * Project detail view with Ink Diffusion styling.
 * Shows generated content, quality report, and project info.
 * Features beautiful content presentation with BlogArticleView and InstagramPreview.
 */

import { useState, useMemo } from 'react'
import { tokens } from '../primitives/design-tokens'
import { InkCard } from '../primitives/InkCard'
import { InkButton } from '../primitives/InkButton'
import { InkBadge } from '../primitives/InkBadge'
import { InkDashboardHeader } from '../InkDashboardHeader'
import { BlogArticleView } from '../content-display/BlogArticleView'
import { InstagramPreview } from '../content-display/InstagramPreview'
import { XPreview } from '../content-display/XPreview'
import { LinkedInPreview } from '../content-display/LinkedInPreview'
import { ContentLaunchpad } from '../content-display/ContentLaunchpad'
import { CopyButton, DownloadButton, DeleteButton, RegenerateButton } from '@/components/dashboard/ProjectActions'
import Link from 'next/link'
import { getLengthTier, type LengthTier } from '@/lib/pricing-config'
import { allStyleCategories, defaultStyleProfile } from '@/app/api/generate/options'
import type { StyleCategory, StyleOption } from '@/app/api/generate/options'

type ContentViewMode = 'raw' | 'formatted' | 'preview'

interface Project {
  id: string
  name: string
  serviceType: string
  status: string
  result: string | null
  qualityReport: string | null
  wordCount: number | null
  formData: any
  styleSelections: any
  additionalInfo: string | null
  tier?: string
  lengthTier?: string
  createdAt: Date
  completedAt: Date | null
  structuredData?: any
}

interface InkProjectDetailProps {
  project: Project
  instagramImages: { slideNumber: number; url: string }[]
  isInstagram: boolean
  isTwitter: boolean
  isLinkedIn: boolean
}

export function InkProjectDetail({ project, instagramImages, isInstagram, isTwitter, isLinkedIn }: InkProjectDetailProps) {
  const [viewMode, setViewMode] = useState<ContentViewMode>(isInstagram || isTwitter || isLinkedIn ? 'raw' : 'formatted')
  const [showInstagramPreview, setShowInstagramPreview] = useState(false)
  const [showXPreview, setShowXPreview] = useState(false)
  const [showLinkedInPreview, setShowLinkedInPreview] = useState(false)

  // Editable settings state
  const [editedFormData, setEditedFormData] = useState<Record<string, any>>({ ...project.formData })
  const [editedStyleSelections, setEditedStyleSelections] = useState<Record<string, any>>({ ...project.styleSelections })
  const [editedAdditionalInfo, setEditedAdditionalInfo] = useState<string>(project.additionalInfo || '')
  const [settingsExpanded, setSettingsExpanded] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  // Track if anything changed
  const hasChanges = useMemo(() => {
    const formChanged = JSON.stringify(editedFormData) !== JSON.stringify(project.formData)
    const styleChanged = JSON.stringify(editedStyleSelections) !== JSON.stringify(project.styleSelections)
    const infoChanged = editedAdditionalInfo !== (project.additionalInfo || '')
    return formChanged || styleChanged || infoChanged
  }, [editedFormData, editedStyleSelections, editedAdditionalInfo, project.formData, project.styleSelections, project.additionalInfo])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryId)) next.delete(categoryId)
      else next.add(categoryId)
      return next
    })
  }

  const updateStyleSelection = (optionId: string, value: string) => {
    setEditedStyleSelections(prev => ({ ...prev, [optionId]: value }))
  }

  const updateFormField = (field: string, value: string) => {
    setEditedFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    setSaveMessage(null)
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: editedFormData,
          styleSelections: editedStyleSelections,
          additionalInfo: editedAdditionalInfo,
        }),
      })
      if (!res.ok) throw new Error('Failed to save')
      setSaveMessage('Settings saved')
      setTimeout(() => setSaveMessage(null), 2000)
    } catch {
      setSaveMessage('Failed to save')
    } finally {
      setIsSaving(false)
    }
  }

  const handleResetSettings = () => {
    setEditedFormData({ ...project.formData })
    setEditedStyleSelections({ ...project.styleSelections })
    setEditedAdditionalInfo(project.additionalInfo || '')
  }

  // Get display label for a style value
  const getStyleLabel = (optionId: string, value: string): string => {
    for (const cat of allStyleCategories) {
      for (const opt of cat.options) {
        if (opt.id === optionId) {
          const found = opt.options.find(o => o.value === value)
          return found?.label || value
        }
      }
    }
    return value
  }

  // Known formData fields to display with labels
  const formDataFields = [
    { key: 'topic', label: 'Topic' },
    { key: 'company', label: 'Company' },
    { key: 'audience', label: 'Audience' },
    { key: 'goals', label: 'Goals' },
    { key: 'industry', label: 'Industry' },
    { key: 'author', label: 'Author' },
    { key: 'keywords', label: 'Keywords' },
    { key: 'contentType', label: 'Content Type' },
    { key: 'tone', label: 'Tone' },
    { key: 'targetUrl', label: 'Target URL' },
    { key: 'competitors', label: 'Competitors' },
  ]

  // Get non-empty formData fields
  const visibleFormFields = formDataFields.filter(f => editedFormData?.[f.key])

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'blog-post': return '📝'
      case 'social-media': return '📱'
      case 'instagram': return '📸'
      case 'twitter': return '🐦'
      case 'linkedin': return '💼'
      case 'linkedin-text-posts': return '💼'
      case 'linkedin-carousel': return '🎠'
      case 'linkedin-article': return '📰'
      case 'linkedin-poll': return '📊'
      case 'email-sequence': return '📧'
      case 'seo-report': return '📊'
      default: return '📄'
    }
  }

  const getLengthBadge = (lengthTier: string) => {
    const config = getLengthTier(lengthTier as LengthTier)
    if (config) {
      return { label: config.name, wordRange: config.wordRange }
    }
    return { label: 'Standard', wordRange: '1,500-2,500' }
  }

  const lengthInfo = getLengthBadge(project.lengthTier || 'standard')
  const isBlogPost = project.serviceType === 'blog-post' || project.serviceType === 'blog-basic' || project.serviceType === 'blog-premium'
  const isContentArchitect = project.serviceType === 'content-architect'

  // Extract Content Launchpad data from structuredData (or text-parse fallback for old projects)
  const launchpadData = useMemo(() => {
    if (!isContentArchitect || project.status !== 'completed' || !project.result) return null

    const sd = project.structuredData as any

    let contentPillars: string[] = []
    let platformStrategy: Record<string, string> = {}
    let topKeywords: string[] = []

    if (sd?.strategy) {
      // Structured data available (new projects)
      contentPillars = sd.strategy.contentPillars || []
      platformStrategy = sd.strategy.platformStrategy || {}
      topKeywords = (sd.seoInsights?.topKeywords || []).map((k: any) =>
        typeof k === 'string' ? k : k?.keyword || ''
      ).filter(Boolean)
    } else {
      // Text-parsing fallback for old projects without structuredData
      const text = (project.result || '').replace(/\r\n/g, '\n')

      // Parse content pillars: numbered lines "  1. Pillar" after "Content Pillars:"
      // Grab everything until the next major section (emoji-headed or all-caps heading)
      const pillarsMatch = text.match(/Content Pillars:\s*\n([\s\S]*?)(?=\n\s*\n\s*[📱📦🎯📊💡🔍✅⚡]|\n\s*\n[A-Z][A-Z\s]{3,}(?:\n|$))/i)
      if (pillarsMatch) {
        // Match all numbered lines like "  1. Topic" or "1. Topic" or "- Topic"
        const items = pillarsMatch[1].match(/(?:^\s*\d+\.\s+|^\s*[-•*]\s+)(.+)/gm)
        if (items) {
          contentPillars = items.map((l: string) => l.replace(/^\s*(?:\d+\.\s+|[-•*]\s+)/, '').trim()).filter(Boolean)
        }
      }

      // Parse platform strategy: "PLATFORM: description" blocks after "PLATFORM STRATEGY" section
      // Section ends at the next emoji-headed section
      const platformMatch = text.match(/PLATFORM STRATEGY\s*\n[━─=]+\s*\n([\s\S]*?)(?=\n\s*\n\s*[📦🎯📊💡🔍✅⚡]|\n\s*\n[A-Z][A-Z\s]{3,}(?:\n|$)|$)/i)
      if (platformMatch) {
        const platformText = platformMatch[1].trim()
        // Match lines like "TWITTER: ..." or "LINKEDIN: ..." or "X (TWITTER): ..."
        const platformLines = platformText.match(/^([A-Z][A-Z\s()\/]*?):\s*(.+(?:\n(?![A-Z][A-Z\s()\/]*?:).+)*)/gm)
        if (platformLines) {
          for (const line of platformLines) {
            const colonIdx = line.indexOf(':')
            if (colonIdx > 0) {
              const key = line.substring(0, colonIdx).trim().toLowerCase()
              const value = line.substring(colonIdx + 1).trim()
              if (key && value) {
                platformStrategy[key] = value
              }
            }
          }
        }
      }
    }

    if (contentPillars.length === 0 && Object.keys(platformStrategy).length === 0) return null

    // Platforms the user originally selected when creating the CA project
    const selectedPlatforms: string[] = project.formData?.platforms || []

    return {
      contentPillars,
      platformStrategy,
      selectedPlatforms,
      topKeywords,
      company: project.formData?.companyName || project.formData?.company || '',
      industry: project.formData?.industry || sd?.analysis?.businessContext?.industry || '',
      audience: sd?.analysis?.audienceProfile?.primary_demographic
        || sd?.analysis?.audienceProfile?.summary
        || project.formData?.audience
        || '',
      goals: Array.isArray(project.formData?.goals)
        ? project.formData.goals.join(', ')
        : project.formData?.goals || '',
    }
  }, [isContentArchitect, project.status, project.result, project.structuredData, project.formData])

  // Helper function to remove hidden IMAGE_DATA comment from display
  const cleanContentForDisplay = (content: string): string => {
    return content.replace(/\n*<!--\s*IMAGE_DATA[\s\S]*?-->\s*/g, '').trim()
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: tokens.colors.paper.cream }}
    >
      {/* Subtle ink wash background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          background: `radial-gradient(ellipse at 20% 0%, ${tokens.colors.ink[300]} 0%, transparent 50%)`,
        }}
      />

      <div className="relative">
        {/* Header */}
        <div
          className="px-4 sm:px-8 py-4 sm:py-6 border-b"
          style={{
            background: tokens.colors.paper.white,
            borderColor: tokens.colors.paper.border,
          }}
        >
          <div className="max-w-7xl mx-auto flex items-start justify-between gap-4">
            <div>
              <p
                className="text-xs uppercase tracking-[0.2em] mb-2"
                style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
              >
                {project.serviceType.replace('-', ' ')} • Created {new Date(project.createdAt).toLocaleDateString()}
              </p>
              <h1
                className="text-xl sm:text-3xl font-light mb-2 line-clamp-2"
                style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
              >
                {project.name}
              </h1>
              <div className="flex items-center gap-3">
                {project.tier && (
                  <InkBadge tier={project.tier as 'budget' | 'standard' | 'premium'}>
                    {project.tier}
                  </InkBadge>
                )}
                {project.status === 'completed' && (
                  <InkBadge variant="sage">Completed</InkBadge>
                )}
                {project.status === 'processing' && (
                  <InkBadge variant="ink">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      Processing
                    </span>
                  </InkBadge>
                )}
                {project.status === 'draft' && (
                  <InkBadge variant="subtle">Draft</InkBadge>
                )}
                {/* Content Launchpad anchor button */}
                {launchpadData && (
                  <button
                    onClick={() => document.getElementById('content-launchpad')?.scrollIntoView({ behavior: 'smooth' })}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all hover:scale-105"
                    style={{
                      fontFamily: tokens.fonts.sans,
                      background: `linear-gradient(135deg, ${tokens.colors.ink[700]}, ${tokens.colors.ink[600]})`,
                      color: '#fff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                    Launch Content
                  </button>
                )}
              </div>
            </div>
            <Link href="/dashboard/projects">
              <InkButton variant="ghost">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </InkButton>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Generated Content */}
              {project.result ? (
                <>
                  {/* Instagram Preview Modal */}
                  {isInstagram && showInstagramPreview && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center p-4"
                      style={{ background: 'rgba(0, 0, 0, 0.8)' }}
                      onClick={() => setShowInstagramPreview(false)}
                    >
                      <div
                        className="relative max-h-[90vh] overflow-auto"
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setShowInstagramPreview(false)}
                          className="absolute -top-12 right-0 p-2 rounded-full transition-colors"
                          style={{
                            background: 'rgba(255,255,255,0.1)',
                            color: '#fff',
                          }}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <InstagramPreview
                          content={project.result}
                          images={instagramImages}
                          companyName={project.formData?.company || project.name}
                        />
                      </div>
                    </div>
                  )}

                  {/* X/Twitter Preview Modal */}
                  {isTwitter && showXPreview && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center p-4"
                      style={{ background: 'rgba(0, 0, 0, 0.9)' }}
                      onClick={() => setShowXPreview(false)}
                    >
                      <div
                        className="relative max-h-[90vh] overflow-auto"
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setShowXPreview(false)}
                          className="absolute -top-12 right-0 p-2 rounded-full transition-colors"
                          style={{
                            background: 'rgba(255,255,255,0.1)',
                            color: '#fff',
                          }}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <XPreview
                          content={project.result}
                          companyName={project.formData?.company || project.name}
                        />
                      </div>
                    </div>
                  )}

                  {/* LinkedIn Preview Modal */}
                  {isLinkedIn && showLinkedInPreview && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center p-4"
                      style={{ background: 'rgba(0, 0, 0, 0.85)' }}
                      onClick={() => setShowLinkedInPreview(false)}
                    >
                      <div
                        className="relative max-h-[90vh] overflow-auto"
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setShowLinkedInPreview(false)}
                          className="absolute -top-12 right-0 p-2 rounded-full transition-colors"
                          style={{
                            background: 'rgba(255,255,255,0.1)',
                            color: '#fff',
                          }}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <LinkedInPreview
                          content={project.result}
                          companyName={project.formData?.company || project.name}
                        />
                      </div>
                    </div>
                  )}

                  <InkCard variant="elevated" padding="none">
                    <div
                      className="px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      style={{ borderBottom: `1px solid ${tokens.colors.paper.border}` }}
                    >
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                        <h2
                          className="text-base sm:text-lg"
                          style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
                        >
                          Generated Content
                        </h2>

                        {/* View Toggle */}
                        <div
                          className="flex rounded-lg overflow-hidden"
                          style={{ border: `1px solid ${tokens.colors.paper.border}` }}
                        >
                          <button
                            onClick={() => setViewMode('raw')}
                            className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium transition-colors"
                            style={{
                              fontFamily: tokens.fonts.sans,
                              background: viewMode === 'raw' ? tokens.colors.ink[100] : 'transparent',
                              color: viewMode === 'raw' ? tokens.colors.ink[800] : tokens.colors.text.muted,
                            }}
                          >
                            Raw
                          </button>
                          <button
                            onClick={() => setViewMode('formatted')}
                            className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium transition-colors"
                            style={{
                              fontFamily: tokens.fonts.sans,
                              background: viewMode === 'formatted' ? tokens.colors.ink[100] : 'transparent',
                              color: viewMode === 'formatted' ? tokens.colors.ink[800] : tokens.colors.text.muted,
                              borderLeft: `1px solid ${tokens.colors.paper.border}`,
                            }}
                          >
                            <span className="hidden sm:inline">{isInstagram ? 'Formatted' : 'Article View'}</span>
                            <span className="sm:hidden">{isInstagram ? 'Format' : 'Article'}</span>
                          </button>
                        </div>

                        {/* Instagram Preview Button */}
                        {isInstagram && (
                          <button
                            onClick={() => setShowInstagramPreview(true)}
                            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                            style={{
                              fontFamily: tokens.fonts.sans,
                              background: 'linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)',
                              color: '#fff',
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="5" y="2" width="14" height="20" rx="3" />
                              <circle cx="12" cy="18" r="1" />
                            </svg>
                            <span className="hidden sm:inline">Phone Preview</span>
                            <span className="sm:hidden">Preview</span>
                          </button>
                        )}

                        {/* X/Twitter Preview Button */}
                        {isTwitter && (
                          <button
                            onClick={() => setShowXPreview(true)}
                            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                            style={{
                              fontFamily: tokens.fonts.sans,
                              background: '#000',
                              color: '#fff',
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                            <span className="hidden sm:inline">Phone Preview</span>
                            <span className="sm:hidden">Preview</span>
                          </button>
                        )}

                        {/* LinkedIn Preview Button */}
                        {isLinkedIn && (
                          <button
                            onClick={() => setShowLinkedInPreview(true)}
                            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                            style={{
                              fontFamily: tokens.fonts.sans,
                              background: '#0A66C2',
                              color: '#fff',
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="5" y="2" width="14" height="20" rx="3" />
                              <circle cx="12" cy="18" r="1" />
                            </svg>
                            <span className="hidden sm:inline">Phone Preview</span>
                            <span className="sm:hidden">Preview</span>
                          </button>
                        )}
                      </div>
                      <CopyButton text={project.result || ''} />
                    </div>

                    <div className="p-4 sm:p-6">
                      {viewMode === 'raw' ? (
                        /* Raw Text View */
                        <div
                          className="p-4 sm:p-6 rounded-xl overflow-auto max-h-[600px]"
                          style={{ background: tokens.colors.paper.warm }}
                        >
                          <pre
                            className="whitespace-pre-wrap text-sm leading-relaxed"
                            style={{
                              fontFamily: tokens.fonts.sans,
                              color: tokens.colors.text.primary,
                            }}
                          >
                            {cleanContentForDisplay(project.result)}
                          </pre>
                        </div>
                      ) : isBlogPost ? (
                        /* Blog Article View */
                        <div className="overflow-auto max-h-[800px] -mx-6 -mb-6 px-6 pb-6">
                          <BlogArticleView
                            content={cleanContentForDisplay(project.result)}
                            title={project.name}
                            company={project.formData?.company}
                            author={project.formData?.author}
                            publishDate={project.completedAt || project.createdAt}
                            wordCount={project.wordCount || undefined}
                            topic={project.formData?.topic}
                          />
                        </div>
                      ) : isInstagram ? (
                        /* Instagram Formatted View */
                        <div className="overflow-auto max-h-[600px]">
                          <InstagramFormattedContent
                            content={project.result}
                            images={instagramImages}
                          />
                        </div>
                      ) : isTwitter ? (
                        /* X/Twitter Formatted View */
                        <div className="overflow-auto max-h-[600px]">
                          <XFormattedContent content={project.result} />
                        </div>
                      ) : isLinkedIn ? (
                        /* LinkedIn Formatted View */
                        <div className="overflow-auto max-h-[600px]">
                          <LinkedInFormattedContent content={project.result} />
                        </div>
                      ) : isContentArchitect ? (
                        /* Content Architect Formatted View */
                        <div className="overflow-auto max-h-[800px] -mx-6 -mb-6 px-6 pb-6">
                          <ContentArchitectView content={project.result} />
                        </div>
                      ) : (
                        /* Default formatted view for other content types */
                        <div className="overflow-auto max-h-[600px]">
                          <BlogArticleView
                            content={cleanContentForDisplay(project.result)}
                            title={project.name}
                            company={project.formData?.company}
                            publishDate={project.completedAt || project.createdAt}
                            wordCount={project.wordCount || undefined}
                          />
                        </div>
                      )}
                    </div>
                  </InkCard>
                </>
              ) : (
                <InkCard variant="elevated" padding="xl">
                  <div className="text-center py-8">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{ background: tokens.colors.paper.warm }}
                    >
                      <span className="text-3xl">{getServiceIcon(project.serviceType)}</span>
                    </div>
                    {project.status === 'draft' ? (
                      <>
                        <h3
                          className="text-lg mb-2"
                          style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
                        >
                          Ready to Generate
                        </h3>
                        <p
                          className="text-sm mb-6"
                          style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                        >
                          Start generating content for this project
                        </p>
                        <Link href={`/dashboard/projects/new/${project.serviceType}?projectId=${project.id}`}>
                          <InkButton variant="primary">Continue Setup</InkButton>
                        </Link>
                      </>
                    ) : project.status === 'processing' ? (
                      <>
                        <h3
                          className="text-lg mb-2"
                          style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
                        >
                          Generating Content...
                        </h3>
                        <p
                          className="text-sm"
                          style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                        >
                          This may take a few minutes
                        </p>
                        <div
                          className="mt-4 w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto"
                          style={{ borderColor: `${tokens.colors.ink[700]} transparent ${tokens.colors.ink[200]} ${tokens.colors.ink[200]}` }}
                        />
                      </>
                    ) : (
                      <>
                        <h3
                          className="text-lg mb-2"
                          style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
                        >
                          No Content Yet
                        </h3>
                        <p
                          className="text-sm"
                          style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                        >
                          Content generation has not started
                        </p>
                      </>
                    )}
                  </div>
                </InkCard>
              )}

              {/* Instagram Images Gallery */}
              {isInstagram && instagramImages.length > 0 && (
                <InkCard variant="elevated" padding="none">
                  <div
                    className="px-6 py-4"
                    style={{ borderBottom: `1px solid ${tokens.colors.paper.border}` }}
                  >
                    <h2
                      className="text-lg flex items-center gap-2"
                      style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
                    >
                      <span>🖼️</span> Generated Images ({instagramImages.length})
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {instagramImages.map((image) => (
                        <div key={image.slideNumber} className="relative group">
                          <div
                            className="aspect-square rounded-xl overflow-hidden"
                            style={{
                              border: `1px solid ${tokens.colors.paper.border}`,
                              background: tokens.colors.paper.warm,
                            }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={image.url}
                              alt={`Slide ${image.slideNumber}`}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          <div
                            className="absolute top-2 left-2 text-xs font-medium px-2 py-1 rounded"
                            style={{
                              fontFamily: tokens.fonts.sans,
                              background: 'rgba(0,0,0,0.7)',
                              color: '#fff',
                            }}
                          >
                            Slide {image.slideNumber}
                          </div>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <a
                              href={image.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg"
                              style={{
                                fontFamily: tokens.fonts.sans,
                                background: tokens.colors.paper.white,
                                color: tokens.colors.ink[700],
                              }}
                            >
                              Open Full Size
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p
                      className="mt-4 text-xs"
                      style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                    >
                      Note: These images are temporary and will expire. Download them to keep permanently.
                    </p>
                  </div>
                </InkCard>
              )}

              {/* Quality Report */}
              {project.qualityReport && (
                <InkCard variant="elevated" padding="none">
                  <div
                    className="px-6 py-4"
                    style={{ borderBottom: `1px solid ${tokens.colors.paper.border}` }}
                  >
                    <h2
                      className="text-lg"
                      style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
                    >
                      Quality Report
                    </h2>
                  </div>
                  <div className="p-6">
                    <div
                      className="p-6 rounded-xl"
                      style={{ background: tokens.colors.paper.warm }}
                    >
                      <pre
                        className="whitespace-pre-wrap text-sm"
                        style={{
                          fontFamily: tokens.fonts.mono,
                          color: tokens.colors.text.secondary,
                        }}
                      >
                        {project.qualityReport}
                      </pre>
                    </div>
                  </div>
                </InkCard>
              )}

              {/* Content Launchpad — below report for Content Architect projects */}
              {launchpadData && (
                <div id="content-launchpad">
                  <ContentLaunchpad
                    sourceProjectId={project.id}
                    contentPillars={launchpadData.contentPillars}
                    platformStrategy={launchpadData.platformStrategy}
                    selectedPlatforms={launchpadData.selectedPlatforms}
                    topKeywords={launchpadData.topKeywords}
                    company={launchpadData.company}
                    industry={launchpadData.industry}
                    audience={launchpadData.audience}
                    goals={launchpadData.goals}
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Info */}
              <InkCard variant="outlined" padding="lg">
                <h3
                  className="text-sm uppercase tracking-wider mb-4"
                  style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                >
                  Project Details
                </h3>
                <dl className="space-y-4">
                  <div>
                    <dt
                      className="text-xs uppercase"
                      style={{ color: tokens.colors.text.subtle, fontFamily: tokens.fonts.sans }}
                    >
                      Type
                    </dt>
                    <dd
                      className="mt-1 text-sm capitalize"
                      style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
                    >
                      {project.serviceType.replace('-', ' ')}
                    </dd>
                  </div>
                  {isBlogPost && (
                    <div>
                      <dt
                        className="text-xs uppercase"
                        style={{ color: tokens.colors.text.subtle, fontFamily: tokens.fonts.sans }}
                      >
                        Length
                      </dt>
                      <dd className="mt-1">
                        <span
                          className="text-sm"
                          style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
                        >
                          {lengthInfo.label}
                        </span>
                        <span
                          className="block text-xs mt-0.5"
                          style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.mono }}
                        >
                          {lengthInfo.wordRange} words
                        </span>
                      </dd>
                    </div>
                  )}
                  {project.wordCount && (
                    <div>
                      <dt
                        className="text-xs uppercase"
                        style={{ color: tokens.colors.text.subtle, fontFamily: tokens.fonts.sans }}
                      >
                        Word Count
                      </dt>
                      <dd
                        className="mt-1 text-lg font-light"
                        style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.serif }}
                      >
                        {project.wordCount.toLocaleString()}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt
                      className="text-xs uppercase"
                      style={{ color: tokens.colors.text.subtle, fontFamily: tokens.fonts.sans }}
                    >
                      Created
                    </dt>
                    <dd
                      className="mt-1 text-sm"
                      style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
                    >
                      {new Date(project.createdAt).toLocaleString()}
                    </dd>
                  </div>
                  {project.completedAt && (
                    <div>
                      <dt
                        className="text-xs uppercase"
                        style={{ color: tokens.colors.text.subtle, fontFamily: tokens.fonts.sans }}
                      >
                        Completed
                      </dt>
                      <dd
                        className="mt-1 text-sm"
                        style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
                      >
                        {new Date(project.completedAt).toLocaleString()}
                      </dd>
                    </div>
                  )}
                </dl>
              </InkCard>

              {/* Settings & Customization */}
              <InkCard variant="outlined" padding="none">
                {/* Header — always visible */}
                <button
                  onClick={() => setSettingsExpanded(!settingsExpanded)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left"
                  style={{ borderBottom: settingsExpanded ? `1px solid ${tokens.colors.paper.border}` : 'none' }}
                >
                  <div>
                    <h3
                      className="text-sm uppercase tracking-wider"
                      style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                    >
                      Settings & Customization
                    </h3>
                    {!settingsExpanded && visibleFormFields.length > 0 && (
                      <p
                        className="text-xs mt-1 truncate max-w-[200px]"
                        style={{ color: tokens.colors.text.subtle, fontFamily: tokens.fonts.sans }}
                      >
                        {visibleFormFields.map(f => f.label).join(', ')} + {allStyleCategories.length} style categories
                      </p>
                    )}
                  </div>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className="shrink-0 transition-transform"
                    style={{
                      color: tokens.colors.text.muted,
                      transform: settingsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {settingsExpanded && (
                  <div className="px-5 py-4 space-y-5">
                    {/* Input Fields */}
                    {visibleFormFields.length > 0 && (
                      <div>
                        <h4
                          className="text-xs uppercase tracking-wider mb-3"
                          style={{ color: tokens.colors.ink[500], fontFamily: tokens.fonts.sans }}
                        >
                          Input Fields
                        </h4>
                        <div className="space-y-3">
                          {visibleFormFields.map(field => (
                            <div key={field.key}>
                              <label
                                className="block text-xs uppercase mb-1"
                                style={{ color: tokens.colors.text.subtle, fontFamily: tokens.fonts.sans }}
                              >
                                {field.label}
                              </label>
                              {(editedFormData[field.key]?.length > 80 || field.key === 'goals') ? (
                                <textarea
                                  value={editedFormData[field.key] || ''}
                                  onChange={e => updateFormField(field.key, e.target.value)}
                                  rows={3}
                                  className="w-full px-3 py-2 text-sm rounded-lg resize-y"
                                  style={{
                                    fontFamily: tokens.fonts.sans,
                                    color: tokens.colors.text.primary,
                                    background: tokens.colors.paper.warm,
                                    border: `1px solid ${tokens.colors.paper.border}`,
                                    outline: 'none',
                                  }}
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={editedFormData[field.key] || ''}
                                  onChange={e => updateFormField(field.key, e.target.value)}
                                  className="w-full px-3 py-2 text-sm rounded-lg"
                                  style={{
                                    fontFamily: tokens.fonts.sans,
                                    color: tokens.colors.text.primary,
                                    background: tokens.colors.paper.warm,
                                    border: `1px solid ${tokens.colors.paper.border}`,
                                    outline: 'none',
                                  }}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Additional Info */}
                    <div>
                      <label
                        className="block text-xs uppercase tracking-wider mb-1"
                        style={{ color: tokens.colors.ink[500], fontFamily: tokens.fonts.sans }}
                      >
                        Additional Instructions
                      </label>
                      <textarea
                        value={editedAdditionalInfo}
                        onChange={e => setEditedAdditionalInfo(e.target.value)}
                        placeholder="Any extra instructions for the AI..."
                        rows={3}
                        className="w-full px-3 py-2 text-sm rounded-lg resize-y"
                        style={{
                          fontFamily: tokens.fonts.sans,
                          color: tokens.colors.text.primary,
                          background: tokens.colors.paper.warm,
                          border: `1px solid ${tokens.colors.paper.border}`,
                          outline: 'none',
                        }}
                      />
                    </div>

                    {/* Style Categories */}
                    <div>
                      <h4
                        className="text-xs uppercase tracking-wider mb-3"
                        style={{ color: tokens.colors.ink[500], fontFamily: tokens.fonts.sans }}
                      >
                        Style Settings ({allStyleCategories.length} categories)
                      </h4>
                      <div className="space-y-1">
                        {allStyleCategories.map(category => {
                          const isOpen = expandedCategories.has(category.id)
                          // Count customized options in this category
                          const customizedCount = category.options.filter(opt => {
                            const current = editedStyleSelections?.[opt.id]
                            const def = (defaultStyleProfile as Record<string, any>)[opt.id]
                            return current && current !== def
                          }).length

                          return (
                            <div
                              key={category.id}
                              className="rounded-lg overflow-hidden"
                              style={{ border: `1px solid ${tokens.colors.paper.border}` }}
                            >
                              {/* Category header */}
                              <button
                                onClick={() => toggleCategory(category.id)}
                                className="w-full px-3 py-2.5 flex items-center justify-between text-left transition-colors"
                                style={{
                                  background: isOpen ? tokens.colors.ink[50] : tokens.colors.paper.white,
                                }}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span
                                    className="text-xs font-medium truncate"
                                    style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
                                  >
                                    {category.name}
                                  </span>
                                  {customizedCount > 0 && (
                                    <span
                                      className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                                      style={{ background: tokens.colors.ink[100], color: tokens.colors.ink[700] }}
                                    >
                                      {customizedCount} custom
                                    </span>
                                  )}
                                </div>
                                <svg
                                  width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                  className="shrink-0 transition-transform"
                                  style={{
                                    color: tokens.colors.text.muted,
                                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                  }}
                                >
                                  <path d="M6 9l6 6 6-6" />
                                </svg>
                              </button>

                              {/* Category options */}
                              {isOpen && (
                                <div
                                  className="px-3 py-3 space-y-3"
                                  style={{
                                    background: tokens.colors.paper.warm,
                                    borderTop: `1px solid ${tokens.colors.paper.border}`,
                                  }}
                                >
                                  <p
                                    className="text-[11px] leading-relaxed mb-2"
                                    style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                                  >
                                    {category.description}
                                  </p>
                                  {category.options.map(styleOpt => {
                                    const currentValue = editedStyleSelections?.[styleOpt.id]
                                      || (defaultStyleProfile as Record<string, any>)[styleOpt.id]
                                      || ''

                                    // Skip array types (like evidence_types) — show as read-only
                                    if (Array.isArray(currentValue)) {
                                      return (
                                        <div key={styleOpt.id}>
                                          <label
                                            className="block text-[11px] font-medium mb-1"
                                            style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}
                                          >
                                            {styleOpt.label}
                                          </label>
                                          <p
                                            className="text-xs px-2 py-1.5 rounded"
                                            style={{
                                              color: tokens.colors.text.muted,
                                              background: tokens.colors.paper.white,
                                              border: `1px solid ${tokens.colors.paper.border}`,
                                              fontFamily: tokens.fonts.sans,
                                            }}
                                          >
                                            {currentValue.join(', ')}
                                          </p>
                                        </div>
                                      )
                                    }

                                    return (
                                      <div key={styleOpt.id}>
                                        <label
                                          className="block text-[11px] font-medium mb-1"
                                          style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}
                                          title={styleOpt.hint}
                                        >
                                          {styleOpt.label}
                                        </label>
                                        <select
                                          value={currentValue}
                                          onChange={e => updateStyleSelection(styleOpt.id, e.target.value)}
                                          className="w-full px-2 py-1.5 text-xs rounded-lg appearance-none cursor-pointer"
                                          style={{
                                            fontFamily: tokens.fonts.sans,
                                            color: tokens.colors.text.primary,
                                            background: tokens.colors.paper.white,
                                            border: `1px solid ${tokens.colors.paper.border}`,
                                            outline: 'none',
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 8px center',
                                            paddingRight: '28px',
                                          }}
                                        >
                                          {styleOpt.options.map(o => (
                                            <option key={o.value} value={o.value}>
                                              {o.label}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Save / Reset buttons */}
                    {hasChanges && (
                      <div
                        className="flex items-center gap-2 pt-3"
                        style={{ borderTop: `1px solid ${tokens.colors.paper.border}` }}
                      >
                        <button
                          onClick={handleSaveSettings}
                          disabled={isSaving}
                          className="flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                          style={{
                            background: tokens.colors.ink[700],
                            color: '#fff',
                            fontFamily: tokens.fonts.sans,
                          }}
                        >
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          onClick={handleResetSettings}
                          className="px-3 py-2 text-xs font-medium rounded-lg transition-colors"
                          style={{
                            background: tokens.colors.paper.warm,
                            color: tokens.colors.text.muted,
                            border: `1px solid ${tokens.colors.paper.border}`,
                            fontFamily: tokens.fonts.sans,
                          }}
                        >
                          Reset
                        </button>
                      </div>
                    )}
                    {saveMessage && (
                      <p
                        className="text-xs text-center"
                        style={{ color: saveMessage === 'Settings saved' ? tokens.colors.sage[700] : '#dc2626', fontFamily: tokens.fonts.sans }}
                      >
                        {saveMessage}
                      </p>
                    )}
                  </div>
                )}
              </InkCard>

              {/* Actions */}
              <InkCard variant="outlined" padding="lg">
                <h3
                  className="text-sm uppercase tracking-wider mb-4"
                  style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                >
                  Actions
                </h3>
                <div className="space-y-3">
                  {project.result && project.status === 'completed' && (
                    <>
                      {hasChanges && (
                        <p
                          className="text-xs px-3 py-2 rounded-lg"
                          style={{
                            background: tokens.colors.ink[50],
                            color: tokens.colors.ink[700],
                            fontFamily: tokens.fonts.sans,
                          }}
                        >
                          Unsaved setting changes will be used for regeneration.
                        </p>
                      )}
                      <RegenerateButton
                        projectId={project.id}
                        serviceType={project.serviceType}
                        formData={editedFormData}
                        styleSelections={editedStyleSelections}
                        additionalInfo={editedAdditionalInfo}
                        tier={project.tier || 'standard'}
                        lengthTier={project.lengthTier || 'standard'}
                        existingResult={project.result}
                      />
                    </>
                  )}
                  {project.result && (
                    <DownloadButton
                      content={project.result}
                      filename={`${project.name.replace(/\s+/g, '-').toLowerCase()}.txt`}
                    />
                  )}
                  <DeleteButton projectId={project.id} />
                </div>
              </InkCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Content Architect Formatted View
 * Parses the structured strategic output and renders it with proper cards,
 * numbered lists on separate lines, and visual hierarchy.
 */
interface ContentArchitectViewProps {
  content: string
}

function ContentArchitectView({ content }: ContentArchitectViewProps) {
  // Parse sections by emoji headers
  const parseSection = (emoji: string, title: string): string | null => {
    const pattern = new RegExp(`${emoji}\\s*${title}\\s*\\n━+\\n([\\s\\S]*?)(?=\\n\\n[📊🎯📱📦📈🔍🖼📋━╔]|$)`)
    const match = content.match(pattern)
    return match?.[1]?.trim() || null
  }

  const analysisSummary = parseSection('📊', 'ANALYSIS SUMMARY')
  const strategicOverview = parseSection('🎯', 'STRATEGIC OVERVIEW')
  const platformStrategy = parseSection('📱', 'PLATFORM STRATEGY')
  const recommendations = parseSection('📦', 'SERVICE RECOMMENDATIONS')
  const analyticsInsights = parseSection('📈', 'ANALYTICS INSIGHTS')
  const seoIntelligence = parseSection('🔍', 'SEO INTELLIGENCE')
  const imageRecs = parseSection('🖼️', 'IMAGE RECOMMENDATIONS')
  const executionPlan = parseSection('📋', 'EXECUTION PLAN')

  // Parse footer metadata
  const footerMatch = content.match(/Generated:\s*(.*?)\nTier:\s*(.*?)\nConfidence:\s*(.*?)(?:\n|$)/)
  const metadata = footerMatch ? {
    generated: footerMatch[1]?.trim(),
    tier: footerMatch[2]?.trim(),
    confidence: footerMatch[3]?.trim(),
  } : null

  // Parse warnings
  const warningsMatch = content.match(/⚠️ Notes:\s*(.*)/)
  const warnings = warningsMatch?.[1]?.trim()

  // Render a text block, converting numbered items and bullet points to proper lines
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n')
    const elements: React.ReactNode[] = []

    lines.forEach((line, i) => {
      const trimmed = line.trim()
      if (!trimmed) {
        elements.push(<div key={i} className="h-3" />)
        return
      }

      // Numbered items: "1. Something" or "  1. Something"
      const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)/)
      if (numberedMatch) {
        elements.push(
          <div key={i} className="flex gap-3 py-1.5">
            <span
              className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold"
              style={{ background: tokens.colors.ink[100], color: tokens.colors.ink[700] }}
            >
              {numberedMatch[1]}
            </span>
            <span className="pt-1" style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>
              {renderInlineFormatting(numberedMatch[2])}
            </span>
          </div>
        )
        return
      }

      // Bullet points: "• Something" or "  • Something"
      const bulletMatch = trimmed.match(/^[•\-]\s+(.+)/)
      if (bulletMatch) {
        elements.push(
          <div key={i} className="flex gap-2.5 py-1 pl-1">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2" style={{ background: tokens.colors.sage[500] }} />
            <span style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>
              {renderInlineFormatting(bulletMatch[1])}
            </span>
          </div>
        )
        return
      }

      // Sub-items with indentation: "   Tier: STANDARD"
      const labelMatch = trimmed.match(/^(\w[\w\s]*?):\s+(.+)/)
      if (labelMatch && line.startsWith('   ')) {
        elements.push(
          <div key={i} className="flex gap-2 py-0.5 pl-10">
            <span className="font-medium text-sm" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
              {labelMatch[1]}:
            </span>
            <span className="text-sm" style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>
              {labelMatch[2]}
            </span>
          </div>
        )
        return
      }

      // Section sub-headers (e.g., "Primary Focus: ...")
      const topLabelMatch = trimmed.match(/^([\w\s]+?):\s+(.+)/)
      if (topLabelMatch && !line.startsWith(' ')) {
        elements.push(
          <div key={i} className="py-1">
            <span className="font-medium text-sm" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
              {topLabelMatch[1]}:{' '}
            </span>
            <span style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>
              {topLabelMatch[2]}
            </span>
          </div>
        )
        return
      }

      // Phase headers (⚡ QUICK WINS, 📍 PHASE 1, etc.)
      const phaseMatch = trimmed.match(/^([⚡📍🔴🟡🟢]\s*.+?)(?:\s*:)?$/)
      if (phaseMatch) {
        elements.push(
          <h4
            key={i}
            className="font-semibold text-sm mt-4 mb-1 uppercase tracking-wide"
            style={{ color: tokens.colors.ink[600], fontFamily: tokens.fonts.sans }}
          >
            {phaseMatch[1]}
          </h4>
        )
        return
      }

      // Platform headers (INSTAGRAM:, LINKEDIN:, etc.) - all caps followed by colon
      const platformHeaderMatch = trimmed.match(/^([A-Z][A-Z\s/]+):\s*(.*)/)
      if (platformHeaderMatch) {
        elements.push(
          <div key={i} className="mt-3 mb-1">
            <span
              className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider"
              style={{ background: tokens.colors.ink[100], color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
            >
              {platformHeaderMatch[1]}
            </span>
            {platformHeaderMatch[2] && (
              <p className="mt-1.5 text-sm leading-relaxed" style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>
                {platformHeaderMatch[2]}
              </p>
            )}
          </div>
        )
        return
      }

      // JSON blocks - render as formatted key-value pairs
      if (trimmed.startsWith('{') || trimmed.startsWith('"')) {
        try {
          const jsonStr = trimmed.startsWith('{') ? trimmed : undefined
          if (jsonStr) {
            const parsed = JSON.parse(jsonStr)
            elements.push(
              <div key={i} className="pl-2 py-1 space-y-1">
                {Object.entries(parsed).map(([k, v], j) => (
                  <div key={j} className="flex gap-2 text-sm">
                    <span className="font-medium" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
                      {k.replace(/_/g, ' ')}:
                    </span>
                    <span style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>
                      {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                    </span>
                  </div>
                ))}
              </div>
            )
            return
          }
        } catch {
          // Not JSON, render as text
        }
      }

      // Regular paragraph text
      elements.push(
        <p key={i} className="text-sm leading-relaxed py-0.5" style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>
          {renderInlineFormatting(trimmed)}
        </p>
      )
    })

    return <div>{elements}</div>
  }

  // Render inline bold/emphasis
  const renderInlineFormatting = (text: string): React.ReactNode => {
    // Handle **bold** and *italic*
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: tokens.colors.text.primary }}>{part.slice(2, -2)}</strong>
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i}>{part.slice(1, -1)}</em>
      }
      return part
    })
  }

  // Section card component
  const SectionCard = ({ emoji, title, children, accent }: {
    emoji: string
    title: string
    children: React.ReactNode
    accent?: string
  }) => (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: `1px solid ${tokens.colors.paper.border}` }}
    >
      <div
        className="px-5 py-3 flex items-center gap-3"
        style={{ background: accent || tokens.colors.paper.warm, borderBottom: `1px solid ${tokens.colors.paper.border}` }}
      >
        <span className="text-lg">{emoji}</span>
        <h3
          className="font-semibold text-sm uppercase tracking-wider"
          style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
        >
          {title}
        </h3>
      </div>
      <div className="px-5 py-4" style={{ background: tokens.colors.paper.white }}>
        {children}
      </div>
    </div>
  )

  // Parse individual recommendations
  const parseRecommendations = () => {
    if (!recommendations) return []
    const recs: { num: number; name: string; priority: string; details: string }[] = []
    // Split into individual recommendation blocks by numbered items
    const blocks = recommendations.split(/(?=\n?\d+\.\s)/).filter(b => b.trim())
    for (const block of blocks) {
      const headerMatch = block.match(/(\d+)\.\s+(.+)/)
      if (!headerMatch) continue
      const num = parseInt(headerMatch[1])
      const headerLine = headerMatch[2]
      // Determine priority from emoji in the header line
      let priority = 'low'
      if (headerLine.includes('\uD83D\uDD34') || headerLine.includes('🔴')) priority = 'high'
      else if (headerLine.includes('\uD83D\uDFE1') || headerLine.includes('🟡')) priority = 'medium'
      else if (headerLine.includes('\uD83D\uDFE2') || headerLine.includes('🟢')) priority = 'low'
      // Strip emoji and whitespace from name
      const name = headerLine.replace(/[\u{1F534}\u{1F7E1}\u{1F7E2}\u{FE0F}\u{200D}]/gu, '').trim()
      // Everything after the first line is details
      const lines = block.split('\n')
      const details = lines.slice(1).join('\n').trim()
      recs.push({ num, name, priority, details })
    }
    return recs
  }

  const parsedRecs = parseRecommendations()

  // Parse and render SEO Intelligence section with structured sub-sections
  const renderSEOIntelligence = (seoText: string) => {
    // Parse sub-sections: "Keyword Opportunities:", "Competitor Domains:", etc.
    const parseSEOSubSection = (label: string): string[] => {
      const regex = new RegExp(`${label}:\\n([\\s\\S]*?)(?=\\n[A-Z][a-z]+ [A-Z]|$)`)
      const match = seoText.match(regex)
      if (!match) return []
      return match[1].split('\n').map(l => l.trim()).filter(Boolean)
    }

    const keywordLines = parseSEOSubSection('Keyword Opportunities')
    const competitorLines = parseSEOSubSection('Competitor Domains')
    const gapLines = parseSEOSubSection('Content Gaps')
    const warningLines = parseSEOSubSection('Keyword Warnings')
    const intentLines = parseSEOSubSection('Search Intent Breakdown')

    // Parse keyword lines into structured data
    const keywords = keywordLines.map(line => {
      // Clicks field is optional — only included when there's actual clickstream data
      const m = line.match(/(.+?)\s*—\s*Volume:\s*(\d+),\s*Difficulty:\s*(\d+)(?:,\s*Clicks:\s*(\d+))?,\s*Intent:\s*(\w+)/)
      if (!m) return null
      return { keyword: m[1], volume: parseInt(m[2]), difficulty: parseInt(m[3]), clicks: m[4] ? parseInt(m[4]) : 0, intent: m[5] }
    }).filter(Boolean) as { keyword: string; volume: number; difficulty: number; clicks: number; intent: string }[]
    const hasClickData = keywords.some(kw => kw.clicks > 0)

    const competitors = competitorLines.map(line => {
      const m = line.match(/(.+?)\s*—\s*Rank:\s*(\d+),\s*Traffic:\s*(\d+),\s*Keywords:\s*(\d+)/)
      if (!m) return null
      return { domain: m[1], rank: parseInt(m[2]), traffic: parseInt(m[3]), keywords: parseInt(m[4]) }
    }).filter(Boolean) as { domain: string; rank: number; traffic: number; keywords: number }[]

    const intentMap: Record<string, string> = {
      informational: '#3B82F6',
      navigational: '#8B5CF6',
      commercial: '#F59E0B',
      transactional: '#10B981',
    }

    return (
      <div className="space-y-5">
        {/* Keyword Opportunities Table */}
        {keywords.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
              Keyword Opportunities
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ fontFamily: tokens.fonts.sans }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${tokens.colors.paper.border}` }}>
                    <th className="text-left py-2 pr-4 font-semibold" style={{ color: tokens.colors.text.secondary }}>Keyword</th>
                    <th className="text-right py-2 px-3 font-semibold" style={{ color: tokens.colors.text.secondary }}>Volume</th>
                    <th className="text-right py-2 px-3 font-semibold" style={{ color: tokens.colors.text.secondary }}>Difficulty</th>
                    {hasClickData && <th className="text-right py-2 px-3 font-semibold" style={{ color: tokens.colors.text.secondary }}>Clicks</th>}
                    <th className="text-left py-2 pl-3 font-semibold" style={{ color: tokens.colors.text.secondary }}>Intent</th>
                  </tr>
                </thead>
                <tbody>
                  {keywords.map((kw, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${tokens.colors.paper.border}` }}>
                      <td className="py-2 pr-4 font-medium" style={{ color: tokens.colors.text.primary }}>{kw.keyword}</td>
                      <td className="text-right py-2 px-3" style={{ color: tokens.colors.text.primary }}>{kw.volume.toLocaleString()}</td>
                      <td className="text-right py-2 px-3">
                        <span
                          className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            background: kw.difficulty > 70 ? '#FEE2E2' : kw.difficulty > 40 ? '#FEF3C7' : '#D1FAE5',
                            color: kw.difficulty > 70 ? '#991B1B' : kw.difficulty > 40 ? '#92400E' : '#065F46',
                          }}
                        >
                          {kw.difficulty}
                        </span>
                      </td>
                      {hasClickData && <td className="text-right py-2 px-3" style={{ color: tokens.colors.text.primary }}>{kw.clicks.toLocaleString()}</td>}
                      <td className="py-2 pl-3">
                        <span
                          className="inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white"
                          style={{ background: intentMap[kw.intent] || '#6B7280' }}
                        >
                          {kw.intent}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Competitor Cards */}
        {competitors.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
              Competitor Landscape
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {competitors.map((c, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl"
                  style={{ background: tokens.colors.paper.warm, border: `1px solid ${tokens.colors.paper.border}` }}
                >
                  <div className="font-semibold text-sm mb-2 truncate" style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>
                    {c.domain}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-xs" style={{ color: tokens.colors.text.muted }}>Rank</div>
                      <div className="font-bold text-sm" style={{ color: tokens.colors.ink[700] }}>{c.rank.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: tokens.colors.text.muted }}>Traffic</div>
                      <div className="font-bold text-sm" style={{ color: tokens.colors.ink[700] }}>{c.traffic.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: tokens.colors.text.muted }}>Keywords</div>
                      <div className="font-bold text-sm" style={{ color: tokens.colors.ink[700] }}>{c.keywords.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Gaps */}
        {gapLines.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
              Content Gaps
            </h4>
            <div className="space-y-1.5">
              {gapLines.map((line, i) => {
                const m = line.match(/"(.+?)"\s*—\s*(\d+)\s*competitors?,\s*Avg Volume:\s*(\d+)/)
                if (!m) return <div key={i} className="text-sm" style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>{line}</div>
                return (
                  <div key={i} className="flex items-center justify-between py-1.5 px-3 rounded-lg" style={{ background: tokens.colors.paper.warm }}>
                    <span className="text-sm font-medium" style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>{m[1]}</span>
                    <div className="flex items-center gap-3 text-xs" style={{ color: tokens.colors.text.muted }}>
                      <span>{m[2]} competitors</span>
                      <span className="font-medium" style={{ color: tokens.colors.ink[600] }}>Vol: {parseInt(m[3]).toLocaleString()}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Keyword Warnings */}
        {warningLines.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
              Keyword Warnings
            </h4>
            <div className="space-y-2">
              {warningLines.map((line, i) => {
                const isAlternative = line.startsWith('Alternatives:')
                if (isAlternative) return null
                const m = line.match(/"(.+?)"\s*—\s*(.+)/)
                // Find next line for alternatives
                const nextLine = warningLines[i + 1]
                const altMatch = nextLine?.match(/Alternatives:\s*(.+)/)
                return (
                  <div
                    key={i}
                    className="p-3 rounded-xl"
                    style={{ background: '#FFF8E1', border: '1px solid #FFE082' }}
                  >
                    <div className="flex items-start gap-2">
                      <span className="flex-shrink-0 mt-0.5">⚠️</span>
                      <div>
                        <span className="font-medium text-sm" style={{ color: '#F57F17', fontFamily: tokens.fonts.sans }}>
                          {m ? m[1] : line}
                        </span>
                        {m && (
                          <p className="text-xs mt-1" style={{ color: '#795548', fontFamily: tokens.fonts.sans }}>
                            {m[2]}
                          </p>
                        )}
                        {altMatch && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {altMatch[1].split(',').map((alt, j) => (
                              <span
                                key={j}
                                className="px-2 py-0.5 rounded-full text-xs font-medium"
                                style={{ background: '#E8F5E9', color: '#2E7D32' }}
                              >
                                {alt.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Search Intent Breakdown */}
        {intentLines.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
              Search Intent Breakdown
            </h4>
            <div className="flex flex-wrap gap-3">
              {intentLines.map((line, i) => {
                const m = line.match(/(\w+):\s*(\d+)\s*keywords?/)
                if (!m) return null
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg"
                    style={{ background: tokens.colors.paper.warm, border: `1px solid ${tokens.colors.paper.border}` }}
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: intentMap[m[1]] || '#6B7280' }}
                    />
                    <span className="text-sm capitalize" style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>
                      {m[1]}
                    </span>
                    <span className="text-sm font-bold" style={{ color: tokens.colors.ink[700] }}>
                      {m[2]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Fallback: if no structured data could be parsed, render as formatted text */}
        {keywords.length === 0 && competitors.length === 0 && gapLines.length === 0 && warningLines.length === 0 && intentLines.length === 0 && (
          renderFormattedText(seoText)
        )}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Metadata bar */}
      {metadata && (
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ background: tokens.colors.ink[100], color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
          >
            {metadata.tier}
          </span>
          <span
            className="px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{
              background: metadata.confidence === 'HIGH' ? tokens.colors.sage[50] : tokens.colors.paper.warm,
              color: metadata.confidence === 'HIGH' ? tokens.colors.sage[700] : tokens.colors.text.muted,
              fontFamily: tokens.fonts.sans,
            }}
          >
            Confidence: {metadata.confidence}
          </span>
          <span className="text-xs" style={{ color: tokens.colors.text.subtle, fontFamily: tokens.fonts.sans }}>
            {metadata.generated}
          </span>
        </div>
      )}

      {/* Warnings */}
      {warnings && (
        <div
          className="flex items-start gap-2 px-4 py-3 rounded-xl text-sm"
          style={{ background: '#FFF8E1', border: '1px solid #FFE082', color: '#F57F17', fontFamily: tokens.fonts.sans }}
        >
          <span className="flex-shrink-0">⚠️</span>
          <span>{warnings}</span>
        </div>
      )}

      {/* Analysis Summary */}
      {analysisSummary && (
        <SectionCard emoji="📊" title="Analysis Summary">
          {renderFormattedText(analysisSummary)}
        </SectionCard>
      )}

      {/* Strategic Overview */}
      {strategicOverview && (
        <SectionCard emoji="🎯" title="Strategic Overview" accent={tokens.colors.ink[50]}>
          {renderFormattedText(strategicOverview)}
        </SectionCard>
      )}

      {/* Platform Strategy */}
      {platformStrategy && (
        <SectionCard emoji="📱" title="Platform Strategy">
          {renderFormattedText(platformStrategy)}
        </SectionCard>
      )}

      {/* Service Recommendations */}
      {parsedRecs.length > 0 ? (
        <SectionCard emoji="📦" title="Service Recommendations">
          <div className="space-y-4">
            {parsedRecs.map((rec) => (
              <div
                key={rec.num}
                className="p-4 rounded-xl"
                style={{
                  background: rec.priority === 'high' ? '#FFF5F5' : rec.priority === 'medium' ? '#FFFDE7' : tokens.colors.paper.warm,
                  border: `1px solid ${rec.priority === 'high' ? '#FFCDD2' : rec.priority === 'medium' ? '#FFF9C4' : tokens.colors.paper.border}`,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ background: tokens.colors.ink[700], color: '#fff' }}
                    >
                      {rec.num}
                    </span>
                    <h4 className="font-semibold" style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>
                      {rec.name}
                    </h4>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase"
                    style={{
                      background: rec.priority === 'high' ? '#EF5350' : rec.priority === 'medium' ? '#FFC107' : tokens.colors.sage[500],
                      color: rec.priority === 'medium' ? '#333' : '#fff',
                    }}
                  >
                    {rec.priority}
                  </span>
                </div>
                <div className="pl-9">
                  {renderFormattedText(rec.details)}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : recommendations && (
        <SectionCard emoji="📦" title="Service Recommendations">
          {renderFormattedText(recommendations)}
        </SectionCard>
      )}

      {/* Analytics Insights */}
      {analyticsInsights && (
        <SectionCard emoji="📈" title="Analytics Insights" accent={tokens.colors.sage[50]}>
          {renderFormattedText(analyticsInsights)}
        </SectionCard>
      )}

      {/* SEO Intelligence */}
      {seoIntelligence && (
        <SectionCard emoji="🔍" title="SEO Intelligence" accent="#EFF6FF">
          {renderSEOIntelligence(seoIntelligence)}
        </SectionCard>
      )}

      {/* Image Recommendations */}
      {imageRecs && (
        <SectionCard emoji="🖼️" title="Image Recommendations">
          {renderFormattedText(imageRecs)}
        </SectionCard>
      )}

      {/* Execution Plan */}
      {executionPlan && (
        <SectionCard emoji="📋" title="Execution Plan" accent={tokens.colors.ink[50]}>
          {renderFormattedText(executionPlan)}
        </SectionCard>
      )}
    </div>
  )
}

/**
 * Instagram Formatted Content Component
 * Displays Instagram content in a beautifully formatted view
 */
interface InstagramFormattedContentProps {
  content: string
  images: { slideNumber: number; url: string }[]
}

function InstagramFormattedContent({ content, images }: InstagramFormattedContentProps) {
  // Parse Instagram content
  const captionMatch = content.match(/📝 CAPTION:\n([\s\S]*?)(?=\n#️⃣|$)/)
  const hashtagMatch = content.match(/#️⃣ HASHTAGS:\n([\s\S]*?)(?=\n🔍|$)/)
  const altTextMatch = content.match(/🔍 ALT TEXT:\n([\s\S]*?)(?=\n📑|$)/)

  const caption = captionMatch?.[1]?.trim() || ''
  const hashtags = hashtagMatch?.[1]?.trim() || ''
  const altText = altTextMatch?.[1]?.trim() || ''

  // Parse slides
  const slides: { slideNumber: number; headline: string; subtext: string; visual?: string; imageUrl?: string }[] = []
  const slidesSection = content.match(/📑 CAROUSEL SLIDES:\n([\s\S]*?)(?=\n<!--|$)/)
  if (slidesSection) {
    const slideRegex = /--- Slide (\d+) ---\s*\n([\s\S]*?)(?=\n--- Slide |\n<!--|$)/g
    let slideMatch
    while ((slideMatch = slideRegex.exec(slidesSection[1])) !== null) {
      const slideNum = parseInt(slideMatch[1])
      const slideContent = slideMatch[2]
      const headlineMatch = slideContent.match(/Headline:\s*(.*?)(?:\n|$)/)
      const subtextMatch = slideContent.match(/Subtext:\s*(.*?)(?:\n|$)/)
      const visualMatch = slideContent.match(/Visual:\s*(.*?)(?:\n|$)/)
      const image = images.find(img => img.slideNumber === slideNum)

      slides.push({
        slideNumber: slideNum,
        headline: headlineMatch?.[1]?.trim() || '',
        subtext: subtextMatch?.[1]?.trim() || '',
        visual: visualMatch?.[1]?.trim(),
        imageUrl: image?.url,
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Caption Section */}
      {caption && (
        <div
          className="p-6 rounded-xl"
          style={{ background: tokens.colors.paper.warm }}
        >
          <h3
            className="text-sm uppercase tracking-wider mb-3 flex items-center gap-2"
            style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
          >
            <span>📝</span> Caption
          </h3>
          <p
            className="text-lg leading-relaxed whitespace-pre-wrap"
            style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
          >
            {caption}
          </p>
        </div>
      )}

      {/* Hashtags Section */}
      {hashtags && (
        <div
          className="p-6 rounded-xl"
          style={{ background: tokens.colors.sage[50] }}
        >
          <h3
            className="text-sm uppercase tracking-wider mb-3 flex items-center gap-2"
            style={{ color: tokens.colors.sage[700], fontFamily: tokens.fonts.sans }}
          >
            <span>#️⃣</span> Hashtags
          </h3>
          <p
            className="text-base"
            style={{ color: tokens.colors.ink[600], fontFamily: tokens.fonts.sans }}
          >
            {hashtags}
          </p>
        </div>
      )}

      {/* Carousel Slides */}
      {slides.length > 0 && (
        <div>
          <h3
            className="text-sm uppercase tracking-wider mb-4 flex items-center gap-2"
            style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
          >
            <span>📑</span> Carousel Slides ({slides.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {slides.map((slide) => (
              <div
                key={slide.slideNumber}
                className="rounded-xl overflow-hidden"
                style={{
                  border: `1px solid ${tokens.colors.paper.border}`,
                  background: tokens.colors.paper.white,
                }}
              >
                {/* Slide Image */}
                {slide.imageUrl ? (
                  <div className="aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slide.imageUrl}
                      alt={`Slide ${slide.slideNumber}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="aspect-square flex items-center justify-center"
                    style={{ background: tokens.colors.paper.warm }}
                  >
                    <span className="text-6xl opacity-30">🖼️</span>
                  </div>
                )}

                {/* Slide Content */}
                <div className="p-4">
                  <div
                    className="text-xs font-medium mb-2"
                    style={{ color: tokens.colors.ink[500], fontFamily: tokens.fonts.sans }}
                  >
                    Slide {slide.slideNumber}
                  </div>
                  <h4
                    className="text-lg font-medium mb-1"
                    style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
                  >
                    {slide.headline}
                  </h4>
                  <p
                    className="text-sm mb-2"
                    style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}
                  >
                    {slide.subtext}
                  </p>
                  {slide.visual && (
                    <p
                      className="text-xs px-2 py-1 rounded inline-block"
                      style={{
                        background: tokens.colors.sage[50],
                        color: tokens.colors.sage[700],
                        fontFamily: tokens.fonts.sans,
                      }}
                    >
                      Visual: {slide.visual}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alt Text Section */}
      {altText && (
        <div
          className="p-4 rounded-lg"
          style={{
            background: tokens.colors.ink[50],
            border: `1px solid ${tokens.colors.ink[100]}`,
          }}
        >
          <h3
            className="text-xs uppercase tracking-wider mb-2 flex items-center gap-2"
            style={{ color: tokens.colors.ink[500], fontFamily: tokens.fonts.sans }}
          >
            <span>🔍</span> Alt Text (Accessibility)
          </h3>
          <p
            className="text-sm"
            style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
          >
            {altText}
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * X/Twitter Formatted Content Component
 * Displays X content in a beautifully formatted view
 */
interface XFormattedContentProps {
  content: string
}

function XFormattedContent({ content }: XFormattedContentProps) {
  // Detect content type
  const isTweetPack = content.includes('🐦 X TWEET PACK')
  const isThread = content.includes('🧵 X THREAD')
  const isQuoteTweets = content.includes('💬 X QUOTE TWEETS')

  // Parse tweets
  const parseTweets = () => {
    const tweets: { id: number; text: string; meta: string }[] = []
    const tweetRegex = /--- Tweet (\d+) ---\s*\n([\s\S]*?)(?=\n--- Tweet |\n\n📊|$)/g
    let match
    while ((match = tweetRegex.exec(content)) !== null) {
      const tweetContent = match[2].trim()
      const lines = tweetContent.split('\n')
      const metaLine = lines.find(l => l.startsWith('[')) || ''
      const textLines = lines.filter(l => !l.startsWith('['))
      tweets.push({
        id: parseInt(match[1]),
        text: textLines.join('\n').trim(),
        meta: metaLine,
      })
    }
    return tweets
  }

  // Parse thread
  const parseThread = () => {
    const thread: { position: number; text: string; meta: string }[] = []
    const threadRegex = /--- (\d+)\/\d+ ---\s*\n([\s\S]*?)(?=\n--- \d+\/|\n\n🎣|\n\n📊|$)/g
    let match
    while ((match = threadRegex.exec(content)) !== null) {
      const tweetContent = match[2].trim()
      const lines = tweetContent.split('\n')
      const metaLine = lines.find(l => l.startsWith('[')) || ''
      const textLines = lines.filter(l => !l.startsWith('['))
      thread.push({
        position: parseInt(match[1]),
        text: textLines.join('\n').trim(),
        meta: metaLine,
      })
    }
    return thread
  }

  // Parse quote tweets
  const parseQuoteTweets = () => {
    const quotes: { id: number; target: string; response: string; meta: string }[] = []
    const quoteRegex = /--- Quote (\d+) ---\s*\n([\s\S]*?)(?=\n--- Quote |\n\n📊|$)/g
    let match
    while ((match = quoteRegex.exec(content)) !== null) {
      const quoteContent = match[2]
      const targetMatch = quoteContent.match(/Target:\s*(.*)/)
      const responseMatch = quoteContent.match(/Response:\s*(.*)/)
      const metaMatch = quoteContent.match(/\[.*\]/)
      quotes.push({
        id: parseInt(match[1]),
        target: targetMatch?.[1]?.trim() || '',
        response: responseMatch?.[1]?.trim() || '',
        meta: metaMatch?.[0] || '',
      })
    }
    return quotes
  }

  // Parse quality report
  const parseQualityReport = () => {
    const reportMatch = content.match(/📊 QUALITY REPORT\n([\s\S]*?)(?=\n\n🎯|$)/)
    return reportMatch?.[1]?.trim() || null
  }

  const tweets = isTweetPack ? parseTweets() : []
  const thread = isThread ? parseThread() : []
  const quoteTweets = isQuoteTweets ? parseQuoteTweets() : []
  const qualityReport = parseQualityReport()

  return (
    <div className="space-y-8">
      {/* Tweet Pack */}
      {isTweetPack && tweets.length > 0 && (
        <div>
          <h3
            className="text-sm uppercase tracking-wider mb-4 flex items-center gap-2"
            style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
          >
            <span>🐦</span> Tweet Pack ({tweets.length} tweets)
          </h3>
          <div className="space-y-4">
            {tweets.map((tweet) => (
              <div
                key={tweet.id}
                className="p-4 rounded-xl"
                style={{
                  background: tokens.colors.paper.warm,
                  border: `1px solid ${tokens.colors.paper.border}`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded"
                    style={{ background: tokens.colors.ink[100], color: tokens.colors.ink[700] }}
                  >
                    Tweet {tweet.id}
                  </span>
                  {tweet.meta && (
                    <span
                      className="text-xs"
                      style={{ color: tokens.colors.text.muted }}
                    >
                      {tweet.meta}
                    </span>
                  )}
                </div>
                <p
                  className="text-base leading-relaxed whitespace-pre-wrap"
                  style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
                >
                  {tweet.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Thread */}
      {isThread && thread.length > 0 && (
        <div>
          <h3
            className="text-sm uppercase tracking-wider mb-4 flex items-center gap-2"
            style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
          >
            <span>🧵</span> Thread ({thread.length} tweets)
          </h3>
          <div className="relative">
            {/* Thread line */}
            <div
              className="absolute left-4 top-6 bottom-6 w-0.5"
              style={{ background: tokens.colors.ink[200] }}
            />
            <div className="space-y-4">
              {thread.map((tweet) => (
                <div
                  key={tweet.position}
                  className="pl-10 relative"
                >
                  {/* Thread dot */}
                  <div
                    className="absolute left-3 top-5 w-3 h-3 rounded-full border-2"
                    style={{
                      background: tokens.colors.paper.white,
                      borderColor: tokens.colors.ink[400],
                    }}
                  />
                  <div
                    className="p-4 rounded-xl"
                    style={{
                      background: tokens.colors.paper.warm,
                      border: `1px solid ${tokens.colors.paper.border}`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded"
                        style={{ background: tokens.colors.sage[100], color: tokens.colors.sage[700] }}
                      >
                        {tweet.position}/{thread.length}
                      </span>
                      {tweet.meta && (
                        <span
                          className="text-xs"
                          style={{ color: tokens.colors.text.muted }}
                        >
                          {tweet.meta}
                        </span>
                      )}
                    </div>
                    <p
                      className="text-base leading-relaxed whitespace-pre-wrap"
                      style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
                    >
                      {tweet.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quote Tweets */}
      {isQuoteTweets && quoteTweets.length > 0 && (
        <div>
          <h3
            className="text-sm uppercase tracking-wider mb-4 flex items-center gap-2"
            style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
          >
            <span>💬</span> Quote Tweets ({quoteTweets.length})
          </h3>
          <div className="space-y-4">
            {quoteTweets.map((quote) => (
              <div
                key={quote.id}
                className="p-4 rounded-xl"
                style={{
                  background: tokens.colors.paper.warm,
                  border: `1px solid ${tokens.colors.paper.border}`,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded"
                    style={{ background: tokens.colors.ink[100], color: tokens.colors.ink[700] }}
                  >
                    Quote {quote.id}
                  </span>
                  {quote.meta && (
                    <span
                      className="text-xs"
                      style={{ color: tokens.colors.text.muted }}
                    >
                      {quote.meta}
                    </span>
                  )}
                </div>
                {/* Your response */}
                <p
                  className="text-base leading-relaxed mb-3"
                  style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
                >
                  {quote.response}
                </p>
                {/* Original tweet being quoted */}
                <div
                  className="p-3 rounded-lg"
                  style={{
                    background: tokens.colors.paper.white,
                    border: `1px solid ${tokens.colors.paper.border}`,
                  }}
                >
                  <p
                    className="text-xs uppercase tracking-wider mb-1"
                    style={{ color: tokens.colors.text.subtle }}
                  >
                    Replying to
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: tokens.colors.text.secondary }}
                  >
                    {quote.target}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quality Report */}
      {qualityReport && (
        <div
          className="p-4 rounded-lg"
          style={{
            background: tokens.colors.ink[50],
            border: `1px solid ${tokens.colors.ink[100]}`,
          }}
        >
          <h3
            className="text-xs uppercase tracking-wider mb-2 flex items-center gap-2"
            style={{ color: tokens.colors.ink[500], fontFamily: tokens.fonts.sans }}
          >
            <span>📊</span> Quality Report
          </h3>
          <pre
            className="text-sm whitespace-pre-wrap"
            style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.mono }}
          >
            {qualityReport}
          </pre>
        </div>
      )}
    </div>
  )
}

/**
 * LinkedIn Formatted Content Component
 * Displays LinkedIn content in a beautifully formatted view
 */
interface LinkedInFormattedContentProps {
  content: string
}

function LinkedInFormattedContent({ content }: LinkedInFormattedContentProps) {
  const isTextPosts = content.includes('💼 LINKEDIN TEXT POSTS')
  const isCarousel = content.includes('🎠 LINKEDIN CAROUSEL')
  const isArticle = content.includes('📰 LINKEDIN ARTICLE')
  const isPolls = content.includes('📊 LINKEDIN POLLS') && !content.startsWith('📊 QUALITY')

  const LINKEDIN_BLUE = '#0A66C2'

  // Parse text posts
  const parseTextPosts = () => {
    const posts: { id: number; text: string; meta: string; hashtags: string; firstComment: string }[] = []
    const postRegex = /--- Post (\d+) ---\s*\n([\s\S]*?)(?=\n--- Post |\n\n📊|$)/gu
    let match
    while ((match = postRegex.exec(content)) !== null) {
      const postContent = match[2].trim()
      const lines = postContent.split('\n')
      const metaLine = lines.find(l => l.startsWith('[')) || ''
      const hashtagLine = lines.find(l => l.startsWith('Hashtags:')) || ''
      const firstCommentLine = lines.find(l => l.startsWith('First Comment:')) || ''
      const textLines = lines.filter(l => !l.startsWith('[') && !l.startsWith('Hashtags:') && !l.startsWith('First Comment:'))
      posts.push({
        id: parseInt(match[1]),
        text: textLines.join('\n').trim(),
        meta: metaLine,
        hashtags: hashtagLine.replace('Hashtags: ', ''),
        firstComment: firstCommentLine.replace('First Comment: ', ''),
      })
    }
    return posts
  }

  // Parse carousels
  const parseCarousels = () => {
    const carousels: { id: number; caption: string; meta: string; slides: string[]; hashtags: string; firstComment: string }[] = []
    const carouselRegex = /--- Carousel (\d+) ---\s*\n([\s\S]*?)(?=\n--- Carousel |\n\n📊|$)/gu
    let match
    while ((match = carouselRegex.exec(content)) !== null) {
      const carouselContent = match[2].trim()
      const captionMatch = carouselContent.match(/Caption:\s*(.*?)(?:\n|$)/)
      const hashtagLine = carouselContent.match(/Hashtags:\s*(.*)/)
      const firstCommentLine = carouselContent.match(/First Comment:\s*(.*)/)
      const metaLine = carouselContent.match(/\[.*chars\]/)
      const slideLines: string[] = []
      const slideRegex = /Slide \d+:\s*(.*)/g
      let slideMatch
      while ((slideMatch = slideRegex.exec(carouselContent)) !== null) {
        slideLines.push(slideMatch[1])
      }
      carousels.push({
        id: parseInt(match[1]),
        caption: captionMatch?.[1]?.trim() || '',
        meta: metaLine?.[0] || '',
        slides: slideLines,
        hashtags: hashtagLine?.[1] || '',
        firstComment: firstCommentLine?.[1] || '',
      })
    }
    return carousels
  }

  // Parse articles
  const parseArticles = () => {
    const articles: { id: number; title: string; subtitle: string; meta: string; body: string; companionPost: string; firstComment: string; seoKeywords: string }[] = []
    const articleRegex = /--- Article (\d+) ---\s*\n([\s\S]*?)(?=\n--- Article |\n\n📊|$)/gu
    let match
    while ((match = articleRegex.exec(content)) !== null) {
      const articleContent = match[2].trim()
      const titleMatch = articleContent.match(/Title:\s*(.*)/)
      const subtitleMatch = articleContent.match(/Subtitle:\s*(.*)/)
      const metaMatch = articleContent.match(/\[\d+ words\]/)
      const companionMatch = articleContent.match(/Companion Post:\s*(.*)/)
      const firstCommentMatch = articleContent.match(/First Comment:\s*(.*)/)
      const seoMatch = articleContent.match(/SEO Keywords:\s*(.*)/)
      // Body is everything between the meta line and Companion Post
      const bodyStart = articleContent.indexOf('\n\n', articleContent.indexOf('['))
      const bodyEnd = articleContent.indexOf('\nCompanion Post:')
      const body = bodyStart > -1 && bodyEnd > -1 ? articleContent.substring(bodyStart, bodyEnd).trim() : ''
      articles.push({
        id: parseInt(match[1]),
        title: titleMatch?.[1]?.trim() || '',
        subtitle: subtitleMatch?.[1]?.trim() || '',
        meta: metaMatch?.[0] || '',
        body,
        companionPost: companionMatch?.[1]?.trim() || '',
        firstComment: firstCommentMatch?.[1]?.trim() || '',
        seoKeywords: seoMatch?.[1]?.trim() || '',
      })
    }
    return articles
  }

  // Parse polls
  const parsePolls = () => {
    const polls: { id: number; question: string; meta: string; options: string[]; companionText: string; firstComment: string; pollType: string }[] = []
    const pollRegex = /--- Poll (\d+) ---\s*\n([\s\S]*?)(?=\n--- Poll |\n\n📊|$)/gu
    let match
    while ((match = pollRegex.exec(content)) !== null) {
      const pollContent = match[2].trim()
      const questionMatch = pollContent.match(/Question:\s*(.*)/)
      const metaMatch = pollContent.match(/\[\d+ chars\]/)
      const companionMatch = pollContent.match(/Companion Text:\s*(.*)/)
      const firstCommentMatch = pollContent.match(/First Comment:\s*(.*)/)
      const pollTypeMatch = pollContent.match(/\[(opinion|data|prediction|scenario|preference|educational|debate|trend)\]/i)
      const options: string[] = []
      const optionRegex = /Option \d+:\s*(.*)/g
      let optMatch
      while ((optMatch = optionRegex.exec(pollContent)) !== null) {
        options.push(optMatch[1])
      }
      polls.push({
        id: parseInt(match[1]),
        question: questionMatch?.[1]?.trim() || '',
        meta: metaMatch?.[0] || '',
        options,
        companionText: companionMatch?.[1]?.trim() || '',
        firstComment: firstCommentMatch?.[1]?.trim() || '',
        pollType: pollTypeMatch?.[1] || '',
      })
    }
    return polls
  }

  // Parse quality report
  const parseQualityReport = () => {
    // Match quality report that's at the END of the content (not the polls header)
    const lines = content.split('\n')
    const lastReportIdx = content.lastIndexOf('📊 QUALITY REPORT')
    if (lastReportIdx === -1) return null
    const reportSection = content.substring(lastReportIdx + '📊 QUALITY REPORT'.length).trim()
    return reportSection || null
  }

  const textPosts = isTextPosts ? parseTextPosts() : []
  const carousels = isCarousel ? parseCarousels() : []
  const articles = isArticle ? parseArticles() : []
  const polls = isPolls ? parsePolls() : []
  const qualityReport = parseQualityReport()

  return (
    <div className="space-y-8">
      {/* Text Posts */}
      {isTextPosts && textPosts.length > 0 && (
        <div>
          <h3
            className="text-sm uppercase tracking-wider mb-4 flex items-center gap-2"
            style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
          >
            <span style={{ color: LINKEDIN_BLUE }}>in</span> Text Posts ({textPosts.length})
          </h3>
          <div className="space-y-4">
            {textPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 rounded-xl"
                style={{
                  background: tokens.colors.paper.warm,
                  border: `1px solid ${tokens.colors.paper.border}`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded"
                    style={{ background: '#E8F0FE', color: LINKEDIN_BLUE }}
                  >
                    Post {post.id}
                  </span>
                  {post.meta && (
                    <span className="text-xs" style={{ color: tokens.colors.text.muted }}>
                      {post.meta}
                    </span>
                  )}
                </div>
                <p
                  className="text-base leading-relaxed whitespace-pre-wrap mb-2"
                  style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
                >
                  {post.text}
                </p>
                {post.hashtags && (
                  <p className="text-sm" style={{ color: LINKEDIN_BLUE }}>
                    {post.hashtags}
                  </p>
                )}
                {post.firstComment && (
                  <div
                    className="mt-3 p-3 rounded-lg"
                    style={{ background: tokens.colors.paper.white, border: `1px solid ${tokens.colors.paper.border}` }}
                  >
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: tokens.colors.text.subtle }}>
                      First Comment
                    </p>
                    <p className="text-sm" style={{ color: tokens.colors.text.secondary }}>
                      {post.firstComment}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Carousels */}
      {isCarousel && carousels.length > 0 && (
        <div>
          <h3
            className="text-sm uppercase tracking-wider mb-4 flex items-center gap-2"
            style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
          >
            <span>🎠</span> Carousels ({carousels.length})
          </h3>
          <div className="space-y-6">
            {carousels.map((carousel) => (
              <div
                key={carousel.id}
                className="p-4 rounded-xl"
                style={{
                  background: tokens.colors.paper.warm,
                  border: `1px solid ${tokens.colors.paper.border}`,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded"
                    style={{ background: '#E8F0FE', color: LINKEDIN_BLUE }}
                  >
                    Carousel {carousel.id}
                  </span>
                  {carousel.meta && (
                    <span className="text-xs" style={{ color: tokens.colors.text.muted }}>
                      {carousel.meta}
                    </span>
                  )}
                </div>
                <p
                  className="text-base leading-relaxed whitespace-pre-wrap mb-3"
                  style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
                >
                  {carousel.caption}
                </p>
                {carousel.slides.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {carousel.slides.map((slide, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg flex items-start gap-3"
                        style={{ background: tokens.colors.paper.white, border: `1px solid ${tokens.colors.paper.border}` }}
                      >
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded shrink-0"
                          style={{ background: LINKEDIN_BLUE, color: '#fff' }}
                        >
                          {idx + 1}
                        </span>
                        <p className="text-sm" style={{ color: tokens.colors.text.secondary }}>
                          {slide}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                {carousel.hashtags && (
                  <p className="text-sm" style={{ color: LINKEDIN_BLUE }}>
                    {carousel.hashtags}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Articles */}
      {isArticle && articles.length > 0 && (
        <div>
          <h3
            className="text-sm uppercase tracking-wider mb-4 flex items-center gap-2"
            style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
          >
            <span>📰</span> Articles ({articles.length})
          </h3>
          <div className="space-y-6">
            {articles.map((article) => (
              <div
                key={article.id}
                className="rounded-xl overflow-hidden"
                style={{ border: `1px solid ${tokens.colors.paper.border}`, background: tokens.colors.paper.white }}
              >
                <div className="p-5" style={{ borderBottom: `1px solid ${tokens.colors.paper.border}` }}>
                  <h4
                    className="text-xl font-medium mb-1"
                    style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
                  >
                    {article.title}
                  </h4>
                  {article.subtitle && (
                    <p className="text-sm" style={{ color: tokens.colors.text.muted }}>
                      {article.subtitle}
                    </p>
                  )}
                  {article.meta && (
                    <span className="text-xs mt-2 inline-block" style={{ color: tokens.colors.text.subtle }}>
                      {article.meta}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <p
                    className="text-base leading-relaxed whitespace-pre-wrap"
                    style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
                  >
                    {article.body.length > 500 ? article.body.substring(0, 500) + '...' : article.body}
                  </p>
                </div>
                {(article.companionPost || article.seoKeywords) && (
                  <div className="p-5" style={{ background: tokens.colors.paper.warm, borderTop: `1px solid ${tokens.colors.paper.border}` }}>
                    {article.companionPost && (
                      <div className="mb-3">
                        <p className="text-xs uppercase tracking-wider mb-1" style={{ color: tokens.colors.text.subtle }}>
                          Companion Post
                        </p>
                        <p className="text-sm" style={{ color: tokens.colors.text.secondary }}>
                          {article.companionPost}
                        </p>
                      </div>
                    )}
                    {article.seoKeywords && (
                      <div>
                        <p className="text-xs uppercase tracking-wider mb-1" style={{ color: tokens.colors.text.subtle }}>
                          SEO Keywords
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {article.seoKeywords.split(',').map((kw, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{ background: '#E8F0FE', color: LINKEDIN_BLUE }}
                            >
                              {kw.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Polls */}
      {isPolls && polls.length > 0 && (
        <div>
          <h3
            className="text-sm uppercase tracking-wider mb-4 flex items-center gap-2"
            style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
          >
            <span>📊</span> Polls ({polls.length})
          </h3>
          <div className="space-y-4">
            {polls.map((poll) => (
              <div
                key={poll.id}
                className="p-4 rounded-xl"
                style={{
                  background: tokens.colors.paper.warm,
                  border: `1px solid ${tokens.colors.paper.border}`,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded"
                    style={{ background: '#E8F0FE', color: LINKEDIN_BLUE }}
                  >
                    Poll {poll.id}
                  </span>
                  {poll.pollType && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: tokens.colors.sage[100], color: tokens.colors.sage[700] }}
                    >
                      {poll.pollType}
                    </span>
                  )}
                </div>
                <p
                  className="text-lg font-medium mb-3"
                  style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
                >
                  {poll.question}
                </p>
                {poll.options.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {poll.options.map((opt, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-2.5 rounded-lg"
                        style={{ background: tokens.colors.paper.white, border: `1px solid ${tokens.colors.paper.border}` }}
                      >
                        <span className="text-sm" style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>
                          {opt}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {poll.companionText && (
                  <div
                    className="mt-3 p-3 rounded-lg"
                    style={{ background: tokens.colors.paper.white, border: `1px solid ${tokens.colors.paper.border}` }}
                  >
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: tokens.colors.text.subtle }}>
                      Companion Text
                    </p>
                    <p className="text-sm" style={{ color: tokens.colors.text.secondary }}>
                      {poll.companionText}
                    </p>
                  </div>
                )}
                {poll.firstComment && (
                  <div
                    className="mt-2 p-3 rounded-lg"
                    style={{ background: tokens.colors.paper.white, border: `1px solid ${tokens.colors.paper.border}` }}
                  >
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: tokens.colors.text.subtle }}>
                      First Comment
                    </p>
                    <p className="text-sm" style={{ color: tokens.colors.text.secondary }}>
                      {poll.firstComment}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quality Report */}
      {qualityReport && (
        <div
          className="p-4 rounded-lg"
          style={{
            background: tokens.colors.ink[50],
            border: `1px solid ${tokens.colors.ink[100]}`,
          }}
        >
          <h3
            className="text-xs uppercase tracking-wider mb-2 flex items-center gap-2"
            style={{ color: tokens.colors.ink[500], fontFamily: tokens.fonts.sans }}
          >
            <span>📊</span> Quality Report
          </h3>
          <pre
            className="text-sm whitespace-pre-wrap"
            style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.mono }}
          >
            {qualityReport}
          </pre>
        </div>
      )}
    </div>
  )
}

export default InkProjectDetail
