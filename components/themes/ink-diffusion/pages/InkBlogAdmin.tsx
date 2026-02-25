'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { tokens } from '../primitives/design-tokens'
import { InkCard } from '../primitives/InkCard'
import { InkButton } from '../primitives/InkButton'
import { InkBadge } from '../primitives/InkBadge'
import type { BlogPostFull } from '@/lib/blog/types'

interface InkBlogAdminProps {
  posts: BlogPostFull[]
}

export function InkBlogAdmin({ posts }: InkBlogAdminProps) {
  const router = useRouter()
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const filtered = posts.filter((p) => {
    if (filter === 'published') return p.status === 'published'
    if (filter === 'draft') return p.status === 'draft'
    return true
  })

  const handleDelete = async (id: string) => {
    setDeleting(id)
    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' })
      if (res.ok) {
        router.refresh()
      }
    } finally {
      setDeleting(null)
      setConfirmDelete(null)
    }
  }

  const formatDate = (date: string | Date | null) => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-3xl font-medium"
            style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.primary }}
          >
            Blog Posts
          </h1>
          <p className="text-sm mt-1" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
            {posts.length} post{posts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/dashboard/blog/new">
          <InkButton
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            New Post
          </InkButton>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(['all', 'published', 'draft'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize"
            style={{
              fontFamily: tokens.fonts.sans,
              background: filter === f ? tokens.colors.ink[700] : 'transparent',
              color: filter === f ? '#fff' : tokens.colors.text.secondary,
              border: filter === f ? 'none' : `1px solid ${tokens.colors.paper.border}`,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Posts List */}
      {filtered.length === 0 ? (
        <InkCard variant="outlined" padding="lg">
          <div className="text-center py-8">
            <p style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
              No {filter !== 'all' ? filter : ''} posts found.
            </p>
          </div>
        </InkCard>
      ) : (
        <div className="space-y-3">
          {filtered.map((post) => (
            <InkCard key={post.id} variant="outlined" padding="none">
              <div className="flex items-center justify-between p-4 sm:p-5">
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-3 mb-1">
                    <h3
                      className="font-medium truncate"
                      style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.primary }}
                    >
                      {post.title}
                    </h3>
                    <InkBadge
                      variant={post.status === 'published' ? 'sage' : 'default'}
                      size="sm"
                    >
                      {post.status}
                    </InkBadge>
                  </div>
                  <p className="text-xs" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
                    {post.status === 'published' ? `Published ${formatDate(post.publishedAt)}` : `Created ${formatDate(post.createdAt)}`}
                    {' · '}/blog/{post.slug}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {post.status === 'published' && (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: tokens.colors.text.muted }}
                      title="View"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  )}
                  <Link
                    href={`/dashboard/blog/${post.id}/edit`}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: tokens.colors.ink[700] }}
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>

                  {confirmDelete === post.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deleting === post.id}
                        className="px-2 py-1 text-xs font-medium rounded text-white"
                        style={{ background: '#dc2626' }}
                      >
                        {deleting === post.id ? '...' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="px-2 py-1 text-xs font-medium rounded"
                        style={{ color: tokens.colors.text.muted }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(post.id)}
                      className="p-2 rounded-lg transition-colors hover:bg-red-50"
                      style={{ color: '#dc2626' }}
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </InkCard>
          ))}
        </div>
      )}
    </div>
  )
}
