'use client'

import React from 'react'
import Link from 'next/link'
import { tokens } from '../primitives/design-tokens'
import { InkCard } from '../primitives/InkCard'
import { InkButton } from '../primitives/InkButton'
import { InkBadge } from '../primitives/InkBadge'
import type { BlogPostListItem } from '@/lib/blog/types'

interface InkBlogIndexProps {
  posts: BlogPostListItem[]
  currentPage: number
  totalPages: number
  currentTag: string | null
}

export function InkBlogIndex({ posts, currentPage, totalPages, currentTag }: InkBlogIndexProps) {
  const formatDate = (date: string | Date | null) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const parseTags = (tags: string | null): string[] => {
    if (!tags) return []
    return tags.split(',').map(t => t.trim()).filter(Boolean)
  }

  return (
    <div style={{ background: tokens.colors.paper.cream, minHeight: '100vh' }}>
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <h1
          className="text-4xl md:text-5xl font-medium mb-4"
          style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.primary }}
        >
          Blog
        </h1>
        <p
          className="text-lg max-w-2xl"
          style={{ fontFamily: tokens.fonts.sans, color: tokens.colors.text.secondary }}
        >
          Insights, tips, and strategies for content marketing, SEO, and social media.
        </p>
        {currentTag && (
          <div className="mt-4 flex items-center gap-2">
            <span style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans, fontSize: '0.875rem' }}>
              Filtered by:
            </span>
            <InkBadge variant="ink">{currentTag}</InkBadge>
            <Link
              href="/blog"
              className="text-sm underline"
              style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
            >
              Clear
            </Link>
          </div>
        )}
      </div>

      {/* Blog Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans, fontSize: '1.125rem' }}>
              No posts yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                <InkCard hover variant="outlined" padding="none">
                  {/* Featured Image */}
                  <div className="aspect-[16/10] overflow-hidden" style={{ borderRadius: `${tokens.radius.xl} ${tokens.radius.xl} 0 0` }}>
                    {post.featuredImage ? (
                      <img
                        src={post.featuredImage}
                        alt={post.featuredImageAlt || post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${tokens.colors.ink[100]}, ${tokens.colors.sage[100]})`,
                        }}
                      >
                        <svg className="w-12 h-12" style={{ color: tokens.colors.ink[300] }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Tags */}
                    {parseTags(post.tags).length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {parseTags(post.tags).slice(0, 3).map((tag) => (
                          <InkBadge key={tag} variant="subtle" size="sm">{tag}</InkBadge>
                        ))}
                      </div>
                    )}

                    <h2
                      className="text-xl font-medium mb-2 line-clamp-2 group-hover:opacity-80 transition-opacity"
                      style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.primary }}
                    >
                      {post.title}
                    </h2>

                    {post.excerpt && (
                      <p
                        className="text-sm mb-4 line-clamp-3"
                        style={{ fontFamily: tokens.fonts.sans, color: tokens.colors.text.secondary }}
                      >
                        {post.excerpt}
                      </p>
                    )}

                    <div
                      className="flex items-center justify-between text-xs"
                      style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                    >
                      <span>{formatDate(post.publishedAt)}</span>
                      <span
                        className="font-medium group-hover:underline"
                        style={{ color: tokens.colors.ink[700] }}
                      >
                        Read more
                      </span>
                    </div>
                  </div>
                </InkCard>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-16">
            {currentPage > 1 && (
              <Link href={`/blog?page=${currentPage - 1}${currentTag ? `&tag=${currentTag}` : ''}`}>
                <InkButton variant="secondary" size="sm">Previous</InkButton>
              </Link>
            )}

            <span
              className="text-sm"
              style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
            >
              Page {currentPage} of {totalPages}
            </span>

            {currentPage < totalPages && (
              <Link href={`/blog?page=${currentPage + 1}${currentTag ? `&tag=${currentTag}` : ''}`}>
                <InkButton variant="secondary" size="sm">Next</InkButton>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
