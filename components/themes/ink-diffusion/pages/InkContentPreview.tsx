'use client';

/**
 * INK CONTENT PREVIEW PAGE
 *
 * Shows generated content in realistic preview frames:
 * - Blog: Medium-style reader view with browser chrome
 * - Instagram: iPhone frame with Instagram UI chrome
 * - X/Twitter: iPhone frame with X UI chrome
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

const sampleXContent = {
  username: 'yourbrand',
  displayName: 'Your Brand',
  tweets: [
    {
      text: `The best marketers aren't the loudest—they're the most memorable.

Strategic patience beats tactical noise every time.`,
      likes: '847',
      retweets: '124',
    },
    {
      text: `Hot take: Your content strategy probably has too many tactics and not enough strategy.

The fix? Fewer posts, more purpose.`,
      likes: '1.2K',
      retweets: '256',
    },
    {
      text: `The content that "failed" today might be your biggest asset in 6 months.

Evergreen thinking > viral chasing`,
      likes: '623',
      retweets: '98',
    },
  ],
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

// X Logo
const XLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// X/Twitter phone preview
const XPhonePreview = () => {
  const [currentTweet, setCurrentTweet] = useState(0);
  const tweet = sampleXContent.tweets[currentTweet];

  return (
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

          {/* X header */}
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: '#eff3f4' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#0f1419">
              <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z" />
            </svg>
            <span className="font-bold" style={{ fontFamily: '-apple-system, sans-serif', color: '#0f1419' }}>
              Post
            </span>
            <div style={{ color: '#0f1419' }}>
              <XLogo />
            </div>
          </div>

          {/* Tweet content */}
          <div className="p-4">
            <div className="flex gap-3">
              {/* Avatar */}
              <div
                className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
                style={{ background: '#1d9bf0' }}
              >
                {sampleXContent.displayName.charAt(0)}
              </div>

              <div className="flex-1">
                {/* User info */}
                <div className="flex items-center gap-1">
                  <span className="font-bold text-[15px]" style={{ color: '#0f1419' }}>
                    {sampleXContent.displayName}
                  </span>
                  <svg width="18" height="18" viewBox="0 0 22 22" fill="#1d9bf0">
                    <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.852-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                  </svg>
                  <span className="text-[15px]" style={{ color: '#536471' }}>
                    @{sampleXContent.username} · 2h
                  </span>
                </div>

                {/* Tweet text */}
                <p
                  className="text-[15px] leading-5 mt-2 whitespace-pre-wrap"
                  style={{ color: '#0f1419', fontFamily: '-apple-system, sans-serif' }}
                >
                  {tweet.text}
                </p>

                {/* Tweet metrics */}
                <div className="flex items-center gap-6 mt-4 text-sm" style={{ color: '#536471' }}>
                  <span>{tweet.likes} likes</span>
                  <span>{tweet.retweets} reposts</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t" style={{ borderColor: '#eff3f4' }}>
                  {[
                    'M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z',
                    'M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z',
                    'M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91z',
                    'M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.001 3.999c0 1.11-.9 2-2 2h-14c-1.1 0-2-.9-2-2V15h2v4h14v-4h2z',
                  ].map((icon, idx) => (
                    <button key={idx} className="p-2 rounded-full hover:bg-blue-50" style={{ color: '#536471' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d={icon} />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tweet navigation */}
          <div className="flex items-center justify-center gap-4 px-4 py-3 border-t" style={{ borderColor: '#eff3f4' }}>
            {sampleXContent.tweets.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentTweet(idx)}
                className="w-2 h-2 rounded-full transition-colors"
                style={{
                  background: idx === currentTweet ? '#1d9bf0' : '#cfd9de',
                }}
              />
            ))}
          </div>

          {/* Home indicator */}
          <div className="flex justify-center py-2">
            <div className="w-32 h-1 rounded-full bg-black" />
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const [activeTab, setActiveTab] = useState<'blog' | 'instagram' | 'x'>('blog');

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
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'blog', label: 'Blog Preview', icon: '📝' },
            { id: 'instagram', label: 'Instagram Preview', icon: '📸' },
            { id: 'x', label: 'X Preview', icon: '🐦' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'blog' | 'instagram' | 'x')}
              className="px-6 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
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
          {activeTab === 'blog' && <BlogPreview />}
          {activeTab === 'instagram' && <InstagramPreview />}
          {activeTab === 'x' && <XPhonePreview />}
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
