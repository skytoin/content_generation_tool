'use client';

/**
 * INK CONTENT PREVIEW PAGE
 *
 * Shows generated content in realistic preview frames:
 * - Blog: Medium-style reader view with browser chrome
 * - Instagram: iPhone frame with Instagram UI chrome
 *
 * COPIED EXACTLY FROM DEMO for visual consistency.
 */

import React, { useState } from 'react';
import { tokens } from '../primitives/design-tokens';
import { InkButton } from '../primitives/InkButton';
import { InkBadge } from '../primitives/InkBadge';

// Sample content - matches demo exactly
const sampleBlogContent = {
  title: 'The Art of Strategic Patience in Content Marketing',
  subtitle: 'Why the best brands play the long game',
  author: 'Scribengine',
  date: 'January 28, 2025',
  readTime: '6 min read',
  content: `In an age of instant gratification, the most powerful competitive advantage might be the willingness to wait.

Consider this: while your competitors chase viral moments and quick wins, what if you focused on building something that compounds? Content that gets better with time, not worse. An audience that grows through trust, not tricks.

The brands that will dominate the next decade aren't the loudest ones. They're the ones who understood that great content marketing is a marathon disguised as a sprint.

## The Compounding Effect

Every piece of content you publish is a seed. Some sprout quickly. Most take time. But the ones that truly matter—the ones that bring customers back year after year—those are the ones you almost gave up on.

Strategic patience means understanding this fundamental truth: the content that seems to "fail" today might be your biggest asset tomorrow.`,
};

const sampleInstagramContent = {
  username: 'yourbrand',
  caption: `The best content doesn't announce its sophistication—it simply demonstrates it. ✨

Every word carries intention. Every pause creates anticipation. Every insight lands with quiet authority.

That's the difference between forgettable and unforgettable.

#ContentMarketing #BrandStrategy #ContentCreation #Marketing`,
  hashtags: ['ContentMarketing', 'BrandStrategy', 'ContentCreation', 'Marketing', 'Branding'],
  likes: '1,247',
};

// Medium-style blog preview
const BlogPreview = () => (
  <div className="relative">
    {/* Browser chrome */}
    <div
      className="rounded-t-xl px-4 py-3 flex items-center gap-3"
      style={{ background: tokens.colors.paper.warm, borderBottom: `1px solid ${tokens.colors.paper.border}` }}
    >
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: '#28ca41' }} />
      </div>
      <div
        className="flex-1 mx-4 px-4 py-1.5 rounded-lg text-center text-sm"
        style={{ background: tokens.colors.paper.white, color: tokens.colors.text.muted }}
      >
        medium.com/@yourbrand
      </div>
    </div>

    {/* Content area */}
    <div
      className="rounded-b-xl overflow-hidden"
      style={{ background: tokens.colors.paper.white }}
    >
      {/* Medium-style header */}
      <div className="px-8 pt-8 pb-4 border-b" style={{ borderColor: tokens.colors.paper.border }}>
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
            style={{ background: tokens.colors.ink[700] }}
          >
            S
          </div>
          <div>
            <p className="font-medium" style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>
              {sampleBlogContent.author}
            </p>
            <p className="text-sm" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
              {sampleBlogContent.date} · {sampleBlogContent.readTime}
            </p>
          </div>
        </div>
      </div>

      {/* Article content */}
      <article className="px-8 py-10 max-w-[680px] mx-auto">
        <h1
          className="text-4xl font-bold leading-tight mb-4"
          style={{ color: tokens.colors.text.primary, fontFamily: 'Georgia, serif' }}
        >
          {sampleBlogContent.title}
        </h1>
        <h2
          className="text-xl mb-8"
          style={{ color: tokens.colors.text.muted, fontFamily: 'Georgia, serif' }}
        >
          {sampleBlogContent.subtitle}
        </h2>

        <div
          className="prose prose-lg"
          style={{ color: tokens.colors.text.secondary, fontFamily: 'Georgia, serif', lineHeight: 1.8 }}
        >
          {sampleBlogContent.content.split('\n\n').map((para, i) => (
            <p key={i} className="mb-6">
              {para.startsWith('## ') ? (
                <strong className="text-2xl block mt-8 mb-4" style={{ color: tokens.colors.text.primary }}>
                  {para.replace('## ', '')}
                </strong>
              ) : (
                para
              )}
            </p>
          ))}
        </div>
      </article>
    </div>
  </div>
);

// Instagram phone preview
const InstagramPreview = () => (
  <div className="flex justify-center">
    {/* Phone frame */}
    <div
      className="relative rounded-[3rem] p-3"
      style={{
        background: 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%)',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}
    >
      {/* Screen */}
      <div
        className="relative w-[320px] rounded-[2.5rem] overflow-hidden"
        style={{ background: '#fff' }}
      >
        {/* Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-10" />

        {/* Instagram header */}
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: '#eee' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span className="font-semibold" style={{ fontFamily: '-apple-system, sans-serif' }}>
            Post
          </span>
          <div className="w-6" />
        </div>

        {/* Post content */}
        <div>
          {/* Image placeholder */}
          <div
            className="w-full aspect-square flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${tokens.colors.ink[100]}, ${tokens.colors.sage[100]})` }}
          >
            <div className="text-center">
              <div
                className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
                style={{ background: tokens.colors.ink[700] }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <p style={{ color: tokens.colors.text.muted, fontSize: '13px' }}>Your image here</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </div>

          {/* Likes */}
          <div className="px-4">
            <p className="font-semibold text-sm" style={{ fontFamily: '-apple-system, sans-serif' }}>
              {sampleInstagramContent.likes} likes
            </p>
          </div>

          {/* Caption */}
          <div className="px-4 py-2">
            <p className="text-sm" style={{ fontFamily: '-apple-system, sans-serif', lineHeight: 1.4 }}>
              <span className="font-semibold">{sampleInstagramContent.username}</span>{' '}
              {sampleInstagramContent.caption}
            </p>
          </div>

          {/* Hashtags */}
          <div className="px-4 pb-4 flex flex-wrap gap-1">
            {sampleInstagramContent.hashtags.map((tag, i) => (
              <span
                key={i}
                className="text-sm"
                style={{ color: '#00376b', fontFamily: '-apple-system, sans-serif' }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Home indicator */}
        <div className="flex justify-center py-2">
          <div className="w-32 h-1 rounded-full bg-black" />
        </div>
      </div>
    </div>
  </div>
);

export const InkContentPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blog' | 'instagram'>('blog');

  return (
    <div
      className="min-h-screen"
      style={{ background: tokens.colors.paper.cream }}
    >
      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Header */}
        <header className="mb-12">
          <p
            className="text-xs uppercase tracking-[0.2em] mb-2"
            style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
          >
            Content Preview
          </p>
          <h1
            className="text-4xl font-light mb-4"
            style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
          >
            See your content in context
          </h1>
          <p
            className="text-lg"
            style={{ color: tokens.colors.text.secondary }}
          >
            Preview how your content will appear on different platforms
          </p>
        </header>

        {/* Tab navigation */}
        <div className="flex items-center gap-2 mb-8">
          {[
            { id: 'blog', label: 'Blog Preview', icon: '📝' },
            { id: 'instagram', label: 'Instagram Preview', icon: '📱' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'blog' | 'instagram')}
              className="px-6 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: activeTab === tab.id ? tokens.colors.paper.white : 'transparent',
                color: activeTab === tab.id ? tokens.colors.ink[700] : tokens.colors.text.muted,
                boxShadow: activeTab === tab.id ? tokens.shadows.md : 'none',
                fontFamily: tokens.fonts.sans,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Preview container */}
        <div
          className="rounded-2xl p-8"
          style={{ background: tokens.colors.paper.warm }}
        >
          {activeTab === 'blog' ? <BlogPreview /> : <InstagramPreview />}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center gap-4">
            <InkBadge variant="sage">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Quality verified
            </InkBadge>
            <span
              className="text-sm"
              style={{ color: tokens.colors.text.muted }}
            >
              2,450 words · 8 min read
            </span>
          </div>

          <div className="flex items-center gap-3">
            <InkButton variant="ghost">Edit content</InkButton>
            <InkButton variant="secondary">Download</InkButton>
            <InkButton variant="primary">Publish</InkButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InkContentPreview;
