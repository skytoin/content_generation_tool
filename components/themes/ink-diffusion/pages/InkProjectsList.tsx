'use client'

/**
 * INK PROJECTS LIST
 *
 * Projects list page with Ink Diffusion styling.
 * Grid/list view with filtering and search.
 */

import Link from 'next/link'
import { tokens } from '../primitives/design-tokens'
import { InkCard } from '../primitives/InkCard'
import { InkButton } from '../primitives/InkButton'
import { InkBadge } from '../primitives/InkBadge'

// Icons
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const DocumentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
)

interface Project {
  id: string
  name: string
  serviceType: string
  status: string
  tier?: string
  createdAt: Date
  wordCount?: number | null
}

interface InkProjectsListProps {
  projects: Project[]
}

export function InkProjectsList({ projects }: InkProjectsListProps) {
  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'blog-post': return '📝'
      case 'social-media': return '📱'
      case 'instagram': return '📸'
      case 'email-sequence': return '📧'
      case 'seo-report': return '📊'
      case 'content-architect': return '🏗️'
      default: return '📄'
    }
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
          background: `radial-gradient(ellipse at 80% 20%, ${tokens.colors.sage[300]} 0%, transparent 50%)`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-xs uppercase tracking-[0.3em] mb-2"
                style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
              >
                Content Library
              </p>
              <h1
                className="text-4xl font-light mb-2"
                style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
              >
                Your Projects
              </h1>
              <p
                className="text-lg"
                style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.serif }}
              >
                {projects.length} project{projects.length !== 1 ? 's' : ''} in your collection
              </p>
            </div>

            <Link href="/dashboard/projects/new">
              <InkButton variant="primary" icon={<PlusIcon />}>
                New Project
              </InkButton>
            </Link>
          </div>
        </header>

        {/* Content */}
        {projects.length === 0 ? (
          <InkCard variant="elevated" padding="xl">
            <div className="text-center py-12">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background: tokens.colors.paper.warm, color: tokens.colors.text.muted }}
              >
                <DocumentIcon />
              </div>
              <h3
                className="text-xl mb-2"
                style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
              >
                No projects yet
              </h3>
              <p
                className="text-sm mb-8 max-w-md mx-auto"
                style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
              >
                Create your first content project to get started with AI-powered content generation.
              </p>
              <Link href="/dashboard/projects/new">
                <InkButton variant="primary">Create Your First Project</InkButton>
              </Link>
            </div>
          </InkCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                <InkCard variant="elevated" padding="lg" hover>
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: tokens.colors.paper.warm }}
                    >
                      {getServiceIcon(project.serviceType)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-medium truncate mb-1"
                        style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
                      >
                        {project.name}
                      </h3>
                      <p
                        className="text-sm capitalize mb-3"
                        style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                      >
                        {project.serviceType.replace('-', ' ')}
                      </p>

                      <div className="flex items-center gap-2 flex-wrap">
                        {project.tier && (
                          <InkBadge tier={project.tier as 'budget' | 'standard' | 'premium'} size="sm">
                            {project.tier}
                          </InkBadge>
                        )}
                        {project.status === 'completed' && (
                          <InkBadge variant="sage" size="sm">Complete</InkBadge>
                        )}
                        {project.status === 'processing' && (
                          <InkBadge variant="ink" size="sm">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                              Processing
                            </span>
                          </InkBadge>
                        )}
                        {project.status === 'draft' && (
                          <InkBadge variant="subtle" size="sm">Draft</InkBadge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div
                    className="mt-4 pt-4 flex items-center justify-between"
                    style={{ borderTop: `1px solid ${tokens.colors.paper.border}` }}
                  >
                    <span
                      className="text-xs"
                      style={{ color: tokens.colors.text.subtle, fontFamily: tokens.fonts.sans }}
                    >
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                    {project.wordCount && (
                      <span
                        className="text-sm font-medium"
                        style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.mono }}
                      >
                        {project.wordCount.toLocaleString()} words
                      </span>
                    )}
                  </div>
                </InkCard>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default InkProjectsList
