'use client'

import React from 'react'
import Link from 'next/link'
import { tokens } from '../primitives/design-tokens'
import { InkBadge } from '../primitives/InkBadge'
import type { BlogPostFull } from '@/lib/blog/types'

interface InkBlogPostProps {
  post: BlogPostFull
  contentHtml: string
}

export function InkBlogPost({ post, contentHtml }: InkBlogPostProps) {
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

  // Estimate reading time from HTML (strip tags, count words)
  const estimateReadingTime = (html: string): number => {
    const text = html.replace(/<[^>]*>/g, '')
    const words = text.split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.ceil(words / 200))
  }

  const readingTime = estimateReadingTime(contentHtml)

  const tags = parseTags(post.tags)

  return (
    <div style={{ background: tokens.colors.paper.cream, minHeight: '100vh' }}>
      {/* Hero header section — full width with constrained content */}
      <div
        className="pt-24 pb-12 sm:pt-28 sm:pb-16"
        style={{
          background: `linear-gradient(180deg, ${tokens.colors.paper.white} 0%, ${tokens.colors.paper.cream} 100%)`,
        }}
      >
        <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-10">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 mb-8 text-sm font-medium transition-all hover:gap-3"
            style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {tags.map((tag) => (
                <Link key={tag} href={`/blog?tag=${tag}`}>
                  <InkBadge variant="ink" size="sm">{tag}</InkBadge>
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1
            className="text-3xl sm:text-4xl md:text-[2.75rem] lg:text-5xl font-medium leading-[1.15] mb-6"
            style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.primary }}
          >
            {post.title}
          </h1>

          {/* Date + Reading Time */}
          <div className="flex items-center gap-3">
            <div
              className="w-1 h-4 rounded-full"
              style={{ background: tokens.colors.ink[700] }}
            />
            <p
              className="text-sm tracking-wide"
              style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
            >
              {formatDate(post.publishedAt)} &middot; {readingTime} min read
            </p>
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-10 pb-20">
        {/* Featured Image */}
        {post.featuredImage && (
          <div
            className="mb-10 sm:mb-12 -mt-2 overflow-hidden shadow-lg"
            style={{ borderRadius: tokens.radius.xl }}
          >
            <img
              src={post.featuredImage}
              alt={post.featuredImageAlt || post.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Article Body */}
        <div
          className="prose-ink"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-3 my-14">
          <div className="h-px flex-1" style={{ background: tokens.colors.paper.border }} />
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: tokens.colors.ink[700], opacity: 0.4 }}
          />
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: tokens.colors.ink[700], opacity: 0.2 }}
          />
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: tokens.colors.ink[700], opacity: 0.4 }}
          />
          <div className="h-px flex-1" style={{ background: tokens.colors.paper.border }} />
        </div>

        {/* Scribengine Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex items-center gap-5"
          style={{
            background: tokens.colors.paper.white,
            border: `1px solid ${tokens.colors.paper.border}`,
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${tokens.colors.ink[700]}, ${tokens.colors.ink[700]}dd)`,
              boxShadow: `0 4px 12px ${tokens.colors.ink[700]}30`,
            }}
          >
            <span
              className="text-lg font-semibold"
              style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.paper.white }}
            >
              S
            </span>
          </div>
          <div>
            <p
              className="text-xs uppercase tracking-widest mb-1"
              style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
            >
              Published by
            </p>
            <p
              className="font-medium text-lg"
              style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
            >
              Scribengine Team
            </p>
          </div>
        </div>
      </article>
    </div>
  )
}
