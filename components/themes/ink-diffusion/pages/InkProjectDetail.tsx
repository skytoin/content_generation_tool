'use client'

/**
 * INK PROJECT DETAIL
 *
 * Project detail view with Ink Diffusion styling.
 * Shows generated content, quality report, and project info.
 * Features beautiful content presentation with BlogArticleView and InstagramPreview.
 */

import { useState } from 'react'
import { tokens } from '../primitives/design-tokens'
import { InkCard } from '../primitives/InkCard'
import { InkButton } from '../primitives/InkButton'
import { InkBadge } from '../primitives/InkBadge'
import { InkDashboardHeader } from '../InkDashboardHeader'
import { BlogArticleView } from '../content-display/BlogArticleView'
import { InstagramPreview } from '../content-display/InstagramPreview'
import { CopyButton, DownloadButton, DeleteButton, RegenerateButton } from '@/components/dashboard/ProjectActions'
import Link from 'next/link'
import { getLengthTier, type LengthTier } from '@/lib/pricing-config'

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
}

interface InkProjectDetailProps {
  project: Project
  instagramImages: { slideNumber: number; url: string }[]
  isInstagram: boolean
}

export function InkProjectDetail({ project, instagramImages, isInstagram }: InkProjectDetailProps) {
  const [viewMode, setViewMode] = useState<ContentViewMode>(isInstagram ? 'raw' : 'formatted')
  const [showInstagramPreview, setShowInstagramPreview] = useState(false)

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'blog-post': return '📝'
      case 'social-media': return '📱'
      case 'instagram': return '📸'
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

              {/* Input Settings */}
              {project.formData && (
                <InkCard variant="outlined" padding="lg">
                  <h3
                    className="text-sm uppercase tracking-wider mb-4"
                    style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                  >
                    Input Settings
                  </h3>
                  <dl className="space-y-3 text-sm">
                    {project.formData.topic && (
                      <div>
                        <dt
                          className="text-xs uppercase"
                          style={{ color: tokens.colors.text.subtle, fontFamily: tokens.fonts.sans }}
                        >
                          Topic
                        </dt>
                        <dd
                          className="mt-1"
                          style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
                        >
                          {project.formData.topic}
                        </dd>
                      </div>
                    )}
                    {project.formData.company && (
                      <div>
                        <dt
                          className="text-xs uppercase"
                          style={{ color: tokens.colors.text.subtle, fontFamily: tokens.fonts.sans }}
                        >
                          Company
                        </dt>
                        <dd
                          className="mt-1"
                          style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
                        >
                          {project.formData.company}
                        </dd>
                      </div>
                    )}
                    {project.formData.audience && (
                      <div>
                        <dt
                          className="text-xs uppercase"
                          style={{ color: tokens.colors.text.subtle, fontFamily: tokens.fonts.sans }}
                        >
                          Audience
                        </dt>
                        <dd
                          className="mt-1"
                          style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
                        >
                          {project.formData.audience}
                        </dd>
                      </div>
                    )}
                    {project.formData.goals && (
                      <div>
                        <dt
                          className="text-xs uppercase"
                          style={{ color: tokens.colors.text.subtle, fontFamily: tokens.fonts.sans }}
                        >
                          Goals
                        </dt>
                        <dd
                          className="mt-1"
                          style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
                        >
                          {project.formData.goals}
                        </dd>
                      </div>
                    )}
                  </dl>
                </InkCard>
              )}

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
                    <RegenerateButton
                      projectId={project.id}
                      serviceType={project.serviceType}
                      formData={project.formData}
                      styleSelections={project.styleSelections}
                      additionalInfo={project.additionalInfo || ''}
                      tier={project.tier || 'standard'}
                      lengthTier={project.lengthTier || 'standard'}
                      existingResult={project.result}
                    />
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

export default InkProjectDetail
