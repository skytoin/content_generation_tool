'use client'

/**
 * INK DASHBOARD HOME
 *
 * Main dashboard with Ink Diffusion design system.
 * Shows projects, quick actions, and insights using proper primitives.
 */

import Link from 'next/link'
import { tokens } from '../primitives/design-tokens'
import { InkCard } from '../primitives/InkCard'
import { InkButton } from '../primitives/InkButton'
import { InkBadge } from '../primitives/InkBadge'
import { InkProgress } from '../primitives/InkProgress'
import { InkDashboardHeader } from '../InkDashboardHeader'

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

const SparkleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3L14.5 8.5L20 9.5L16 14L17 20L12 17L7 20L8 14L4 9.5L9.5 8.5L12 3Z" />
  </svg>
)

interface InkDashboardHomeProps {
  userName?: string
  stats: { name: string; value: number; icon: string; trend?: string }[]
  recentProjects: {
    id: string
    name: string
    serviceType: string
    status: string
    tier?: string
    wordCount?: number
    createdAt: Date
  }[]
}

export function InkDashboardHome({ userName, stats, recentProjects }: InkDashboardHomeProps) {
  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'blog-post': return <DocumentIcon />
      case 'social-media': return <SparkleIcon />
      case 'email-sequence': return <DocumentIcon />
      default: return <DocumentIcon />
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: tokens.colors.paper.cream }}
    >
      {/* Subtle ink wash background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          background: `radial-gradient(ellipse at 20% 0%, ${tokens.colors.ink[300]} 0%, transparent 50%),
                       radial-gradient(ellipse at 80% 100%, ${tokens.colors.sage[300]} 0%, transparent 50%)`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <p
                className="text-sm uppercase tracking-[0.2em] mb-2"
                style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
              >
                Welcome back{userName ? `, ${userName.split(' ')[0]}` : ''}
              </p>
              <h1
                className="text-2xl sm:text-4xl font-light mb-2"
                style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
              >
                Your Creative Studio
              </h1>
              <p
                className="text-lg"
                style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.serif }}
              >
                Where words take shape
              </p>
            </div>

            <Link href="/dashboard/projects/new">
              <InkButton variant="primary" icon={<PlusIcon />}>
                New Project
              </InkButton>
            </Link>
          </div>
        </header>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <InkCard key={stat.name} variant="elevated" padding="lg" accent={index === 0 ? 'left' : 'none'}>
              <div className="flex items-start justify-between">
                <div>
                  <p
                    className="text-3xl font-light mb-1"
                    style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                  >
                    {stat.name}
                  </p>
                </div>
                {stat.trend && (
                  <span
                    className="text-sm font-medium px-2 py-1 rounded-full"
                    style={{
                      color: tokens.colors.sage[700],
                      background: tokens.colors.sage[50],
                      fontFamily: tokens.fonts.mono,
                    }}
                  >
                    {stat.trend}
                  </span>
                )}
                <span className="text-3xl opacity-30">{stat.icon}</span>
              </div>
            </InkCard>
          ))}
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <section className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-xl"
                style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
              >
                Recent Projects
              </h2>
              <Link
                href="/dashboard/projects"
                className="text-sm hover:underline"
                style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
              >
                View all
              </Link>
            </div>

            {recentProjects.length === 0 ? (
              <InkCard variant="elevated" padding="xl">
                <div className="text-center py-8">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: tokens.colors.paper.warm, color: tokens.colors.text.muted }}
                  >
                    <DocumentIcon />
                  </div>
                  <h3
                    className="text-lg mb-2"
                    style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
                  >
                    No projects yet
                  </h3>
                  <p
                    className="text-sm mb-6"
                    style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                  >
                    Create your first content project to get started
                  </p>
                  <Link href="/dashboard/projects/new">
                    <InkButton variant="primary">Create Your First Project</InkButton>
                  </Link>
                </div>
              </InkCard>
            ) : (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                    <InkCard variant="elevated" padding="md" hover>
                      <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ background: tokens.colors.paper.warm, color: tokens.colors.ink[700] }}
                        >
                          {getServiceIcon(project.serviceType)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3
                              className="font-medium truncate"
                              style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
                            >
                              {project.name}
                            </h3>
                            {project.tier && (
                              <InkBadge tier={project.tier as 'budget' | 'standard' | 'premium'} size="sm">
                                {project.tier}
                              </InkBadge>
                            )}
                          </div>

                          <div className="flex items-center gap-4">
                            <span
                              className="text-sm capitalize"
                              style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                            >
                              {project.serviceType.replace('-', ' ')}
                            </span>
                            <span
                              className="text-sm"
                              style={{ color: tokens.colors.text.subtle, fontFamily: tokens.fonts.sans }}
                            >
                              {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {/* Progress bar for processing */}
                          {project.status === 'processing' && (
                            <div className="mt-3">
                              <InkProgress value={50} size="sm" showLabel={false} />
                            </div>
                          )}
                        </div>

                        {/* Status */}
                        <div className="text-right">
                          {project.status === 'completed' && project.wordCount && (
                            <div>
                              <p
                                className="text-lg font-light"
                                style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
                              >
                                {project.wordCount.toLocaleString()}
                              </p>
                              <p
                                className="text-xs"
                                style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                              >
                                words
                              </p>
                            </div>
                          )}
                          {project.status === 'processing' && (
                            <InkBadge variant="ink" size="sm">
                              <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                Generating
                              </span>
                            </InkBadge>
                          )}
                          {project.status === 'draft' && (
                            <InkBadge variant="subtle" size="sm">Draft</InkBadge>
                          )}
                        </div>
                      </div>
                    </InkCard>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Quick Actions Sidebar */}
          <section>
            <h2
              className="text-xl mb-6"
              style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
            >
              Quick Actions
            </h2>

            <InkCard variant="flat" padding="lg">
              <div className="space-y-4">
                {[
                  { href: '/dashboard/projects/new?type=blog-post', icon: <DocumentIcon />, label: 'Blog Post', desc: 'Long-form content' },
                  { href: '/dashboard/projects/new?type=social-media', icon: <SparkleIcon />, label: 'Social Pack', desc: 'Multi-platform posts' },
                  { href: '/dashboard/projects/new?type=email-sequence', icon: <DocumentIcon />, label: 'Email Sequence', desc: '5-email campaign' },
                ].map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="w-full flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[1.02]"
                    style={{
                      background: tokens.colors.paper.white,
                      border: `1px solid ${tokens.colors.paper.border}`,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: tokens.colors.ink[50], color: tokens.colors.ink[700] }}
                    >
                      {action.icon}
                    </div>
                    <div className="text-left">
                      <p
                        className="font-medium"
                        style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
                      >
                        {action.label}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                      >
                        {action.desc}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </InkCard>

            {/* Usage card */}
            <InkCard variant="outlined" padding="lg" className="mt-6">
              <h3
                className="text-sm uppercase tracking-wider mb-4"
                style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
              >
                This Month
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm" style={{ color: tokens.colors.text.secondary }}>Words</span>
                    <span className="text-sm font-medium" style={{ color: tokens.colors.ink[700] }}>2,847 / 10,000</span>
                  </div>
                  <InkProgress value={28} size="sm" showLabel={false} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm" style={{ color: tokens.colors.text.secondary }}>Projects</span>
                    <span className="text-sm font-medium" style={{ color: tokens.colors.ink[700] }}>12 / 20</span>
                  </div>
                  <InkProgress value={60} size="sm" showLabel={false} color="sage" />
                </div>
              </div>
            </InkCard>
          </section>
        </div>
      </div>
    </div>
  )
}

export default InkDashboardHome
