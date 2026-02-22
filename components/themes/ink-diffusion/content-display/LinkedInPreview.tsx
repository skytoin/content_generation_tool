'use client';

/**
 * LINKEDIN PREVIEW
 *
 * Shows LinkedIn content in a realistic phone mockup.
 * Displays text posts, carousels, articles, and polls in authentic LinkedIn style.
 */

import React, { useState, useMemo } from 'react';
import { tokens } from '../primitives/design-tokens';

// LinkedIn brand colors
const LI = {
  blue: '#0A66C2',
  bg: '#F4F2EE',
  text: '#191919',
  secondary: '#666666',
  border: '#E0E0E0',
  white: '#FFFFFF',
};

interface LinkedInPreviewProps {
  content: string;
  companyName?: string;
}

function parseLinkedInContent(text: string) {
  const result = {
    contentType: 'unknown' as 'text-posts' | 'carousel' | 'article' | 'poll' | 'unknown',
    posts: [] as { id: number; text: string; hashtags: string[]; firstComment: string; contentType: string }[],
    carousels: [] as { id: number; caption: string; slides: { headline: string; body: string }[]; hashtags: string[] }[],
    articles: [] as { id: number; title: string; subtitle: string; body: string; companionPost: string }[],
    polls: [] as { id: number; question: string; options: string[]; companionText: string }[],
  };

  if (text.includes('\u{1F4BC} LINKEDIN TEXT POSTS')) {
    result.contentType = 'text-posts';

    const postRegex = /--- Post (\d+) ---\s*\n([\s\S]*?)(?=\n--- Post |\n\n\u{1F4CA} QUALITY|$)/gu;
    let match;
    while ((match = postRegex.exec(text)) !== null) {
      const content = match[2].trim();
      const lines = content.split('\n');
      const hashtagLine = lines.find(l => l.startsWith('Hashtags:'));
      const firstCommentLine = lines.find(l => l.startsWith('First Comment:'));
      const typeLine = lines.find(l => l.startsWith('Type:'));
      const textLines = lines.filter(l =>
        !l.startsWith('[') && !l.startsWith('Hashtags:') && !l.startsWith('First Comment:') &&
        !l.startsWith('Hook:') && !l.startsWith('Type:')
      );

      result.posts.push({
        id: parseInt(match[1]),
        text: textLines.join('\n').trim(),
        hashtags: hashtagLine?.replace('Hashtags:', '').trim().split(/\s+/) || [],
        firstComment: firstCommentLine?.replace('First Comment:', '').trim() || '',
        contentType: typeLine?.replace('Type:', '').trim() || 'insight',
      });
    }
  } else if (text.includes('\u{1F3A0} LINKEDIN CAROUSEL')) {
    result.contentType = 'carousel';

    const carouselRegex = /--- Carousel (\d+) ---\s*\n([\s\S]*?)(?=\n--- Carousel |\n\n\u{1F4CA} QUALITY|$)/gu;
    let match;
    while ((match = carouselRegex.exec(text)) !== null) {
      const content = match[2].trim();
      const captionMatch = content.match(/Caption:\s*([\s\S]*?)(?=\nSlide \d+:|$)/);
      const hashtagLine = content.match(/Hashtags:\s*(.*)/);

      const slides: { headline: string; body: string }[] = [];
      const slideRegex = /Slide (\d+):\s*\n([\s\S]*?)(?=\nSlide \d+:|\nHashtags:|\nFirst Comment:|$)/g;
      let slideMatch;
      while ((slideMatch = slideRegex.exec(content)) !== null) {
        const slideContent = slideMatch[2].trim();
        const headlineMatch = slideContent.match(/Headline:\s*(.*)/);
        const bodyMatch = slideContent.match(/Body:\s*(.*)/);
        slides.push({
          headline: headlineMatch?.[1]?.trim() || '',
          body: bodyMatch?.[1]?.trim() || slideContent,
        });
      }

      result.carousels.push({
        id: parseInt(match[1]),
        caption: captionMatch?.[1]?.trim() || '',
        slides,
        hashtags: hashtagLine?.[1]?.trim().split(/\s+/) || [],
      });
    }
  } else if (text.includes('\u{1F4F0} LINKEDIN ARTICLE')) {
    result.contentType = 'article';

    const articleRegex = /--- Article (\d+) ---\s*\n([\s\S]*?)(?=\n--- Article |\n\n\u{1F4CA} QUALITY|$)/gu;
    let match;
    while ((match = articleRegex.exec(text)) !== null) {
      const content = match[2].trim();
      const titleMatch = content.match(/Title:\s*(.*)/);
      const subtitleMatch = content.match(/Subtitle:\s*(.*)/);
      const bodyMatch = content.match(/Body:\s*([\s\S]*?)(?=\nCompanion Post:|\nSEO Keywords:|\nFirst Comment:|$)/);
      const companionMatch = content.match(/Companion Post:\s*([\s\S]*?)(?=\nSEO Keywords:|\nFirst Comment:|$)/);

      result.articles.push({
        id: parseInt(match[1]),
        title: titleMatch?.[1]?.trim() || 'Untitled',
        subtitle: subtitleMatch?.[1]?.trim() || '',
        body: bodyMatch?.[1]?.trim() || '',
        companionPost: companionMatch?.[1]?.trim() || '',
      });
    }
  } else if (text.includes('\u{1F4CA} LINKEDIN POLLS')) {
    result.contentType = 'poll';

    const pollRegex = /--- Poll (\d+) ---\s*\n([\s\S]*?)(?=\n--- Poll |\n\n\u{1F4CA} QUALITY|$)/gu;
    let match;
    while ((match = pollRegex.exec(text)) !== null) {
      const content = match[2].trim();
      const questionMatch = content.match(/Question:\s*(.*)/);
      const optionMatches = content.match(/Option \d+:\s*(.*)/g);
      const companionMatch = content.match(/Companion Text:\s*([\s\S]*?)(?=\nFirst Comment:|\nDuration:|$)/);

      result.polls.push({
        id: parseInt(match[1]),
        question: questionMatch?.[1]?.trim() || '',
        options: optionMatches?.map(o => o.replace(/Option \d+:\s*/, '').trim()) || [],
        companionText: companionMatch?.[1]?.trim() || '',
      });
    }
  }

  return result;
}

// LinkedIn Logo
const LinkedInLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={LI.blue}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// Post display in phone
const LinkedInPostDisplay: React.FC<{
  text: string;
  displayName: string;
  hashtags: string[];
}> = ({ text, displayName, hashtags }) => (
  <div>
    <div className="flex gap-3">
      <div
        className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
        style={{ background: LI.blue }}
      >
        {displayName.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="font-bold text-[14px]" style={{ color: LI.text }}>{displayName}</span>
          <span className="text-xs px-1 py-0.5 rounded border" style={{ color: LI.secondary, borderColor: LI.border }}>1st</span>
        </div>
        <p className="text-[12px]" style={{ color: LI.secondary }}>Professional headline</p>
        <p className="text-[11px]" style={{ color: LI.secondary }}>1m &middot; <svg style={{ display: 'inline' }} width="12" height="12" viewBox="0 0 24 24" fill={LI.secondary}><circle cx="12" cy="12" r="10" fill="none" stroke={LI.secondary} strokeWidth="2" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" fill="none" stroke={LI.secondary} strokeWidth="1.5" /></svg></p>

        <p
          className="text-[14px] leading-5 mt-2 whitespace-pre-wrap"
          style={{ color: LI.text }}
        >
          {text}
        </p>

        {hashtags.length > 0 && (
          <p className="text-[13px] mt-1" style={{ color: LI.blue }}>
            {hashtags.join(' ')}
          </p>
        )}

        {/* Reaction stats */}
        <div className="flex items-center justify-between mt-3 pt-2" style={{ borderTop: `1px solid ${LI.border}` }}>
          <span className="text-[11px]" style={{ color: LI.secondary }}>1,234 reactions &middot; 47 comments</span>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between mt-2 pt-1">
          {['Like', 'Comment', 'Repost', 'Send'].map((action) => (
            <button key={action} className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-gray-100">
              <span className="text-[12px] font-medium" style={{ color: LI.secondary }}>{action}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Poll display in phone
const LinkedInPollDisplay: React.FC<{
  question: string;
  options: string[];
  companionText: string;
  displayName: string;
}> = ({ question, options, companionText, displayName }) => (
  <div>
    <div className="flex gap-3">
      <div
        className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
        style={{ background: LI.blue }}
      >
        {displayName.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="font-bold text-[14px]" style={{ color: LI.text }}>{displayName}</span>
        </div>
        <p className="text-[12px]" style={{ color: LI.secondary }}>Professional headline &middot; 1m</p>

        {companionText && (
          <p className="text-[14px] leading-5 mt-2 whitespace-pre-wrap" style={{ color: LI.text }}>
            {companionText}
          </p>
        )}

        <div className="mt-3 p-3 rounded-lg" style={{ background: LI.bg }}>
          <p className="text-[14px] font-bold mb-2" style={{ color: LI.text }}>{question}</p>
          <div className="space-y-2">
            {options.map((option, i) => (
              <div
                key={i}
                className="px-3 py-2 rounded-full text-[13px] text-center"
                style={{ border: `1px solid ${LI.blue}`, color: LI.blue }}
              >
                {option}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 pt-1">
          {['Like', 'Comment', 'Repost', 'Send'].map((action) => (
            <button key={action} className="flex items-center gap-1 px-2 py-1.5 rounded">
              <span className="text-[12px] font-medium" style={{ color: LI.secondary }}>{action}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const LinkedInPreview: React.FC<LinkedInPreviewProps> = ({
  content,
  companyName = 'Your Brand',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const parsed = useMemo(() => parseLinkedInContent(content), [content]);

  const displayName = companyName;

  const items = parsed.contentType === 'text-posts'
    ? parsed.posts
    : parsed.contentType === 'carousel'
    ? parsed.carousels
    : parsed.contentType === 'article'
    ? parsed.articles
    : parsed.polls;

  const totalItems = items.length || 1;

  return (
    <div className="flex flex-col items-center">
      {/* Phone Frame */}
      <div
        className="relative rounded-[2rem] sm:rounded-[3rem] p-2 sm:p-3 transform scale-[0.85] sm:scale-100 origin-top"
        style={{
          background: 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
          boxShadow: `
            0 50px 100px -20px rgba(0,0,0,0.5),
            0 30px 60px -30px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.1)
          `,
        }}
      >
        {/* Notch */}
        <div
          className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-5 sm:h-7 rounded-full z-20"
          style={{ background: '#000' }}
        />

        {/* Screen */}
        <div
          className="relative w-[320px] sm:w-[375px] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden"
          style={{ background: LI.white }}
        >
          {/* LinkedIn Header */}
          <div
            className="flex items-center justify-between px-4 py-2.5"
            style={{ background: LI.white, borderBottom: `1px solid ${LI.border}` }}
          >
            <LinkedInLogo />
            <div
              className="flex-1 mx-3 px-3 py-1.5 rounded text-[12px]"
              style={{ background: LI.bg, color: LI.secondary }}
            >
              Search
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={LI.secondary}>
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
          </div>

          {/* Content Area */}
          <div className="p-4 min-h-[400px]" style={{ background: LI.bg }}>
            <div className="rounded-lg p-3" style={{ background: LI.white }}>
              {/* Text Posts */}
              {parsed.contentType === 'text-posts' && parsed.posts[currentIndex] && (
                <LinkedInPostDisplay
                  text={parsed.posts[currentIndex].text}
                  displayName={displayName}
                  hashtags={parsed.posts[currentIndex].hashtags}
                />
              )}

              {/* Carousel */}
              {parsed.contentType === 'carousel' && parsed.carousels[currentIndex] && (
                <div>
                  <div className="flex gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
                      style={{ background: LI.blue }}
                    >
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-[14px]" style={{ color: LI.text }}>{displayName}</span>
                      <p className="text-[12px]" style={{ color: LI.secondary }}>Professional headline &middot; 1m</p>
                    </div>
                  </div>
                  <p className="text-[14px] leading-5 mb-2 whitespace-pre-wrap" style={{ color: LI.text }}>
                    {parsed.carousels[currentIndex].caption}
                  </p>
                  {parsed.carousels[currentIndex].slides.length > 0 && (
                    <div className="p-4 rounded" style={{ background: LI.bg }}>
                      <p className="text-[14px] font-bold" style={{ color: LI.text }}>
                        {parsed.carousels[currentIndex].slides[0].headline}
                      </p>
                      <p className="text-[12px] mt-1" style={{ color: LI.secondary }}>
                        {parsed.carousels[currentIndex].slides[0].body}
                      </p>
                      <p className="text-[11px] mt-2" style={{ color: LI.blue }}>
                        {parsed.carousels[currentIndex].slides.length} slides
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Article */}
              {parsed.contentType === 'article' && parsed.articles[currentIndex] && (
                <div>
                  <div className="flex gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
                      style={{ background: LI.blue }}
                    >
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-[14px]" style={{ color: LI.text }}>{displayName}</span>
                      <p className="text-[12px]" style={{ color: LI.secondary }}>Published an article &middot; 1m</p>
                    </div>
                  </div>
                  <div className="rounded" style={{ background: LI.bg }}>
                    <div className="p-3">
                      <h3 className="text-[16px] font-bold" style={{ color: LI.text }}>
                        {parsed.articles[currentIndex].title}
                      </h3>
                      {parsed.articles[currentIndex].subtitle && (
                        <p className="text-[12px] mt-1" style={{ color: LI.secondary }}>
                          {parsed.articles[currentIndex].subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Poll */}
              {parsed.contentType === 'poll' && parsed.polls[currentIndex] && (
                <LinkedInPollDisplay
                  question={parsed.polls[currentIndex].question}
                  options={parsed.polls[currentIndex].options}
                  companionText={parsed.polls[currentIndex].companionText}
                  displayName={displayName}
                />
              )}
            </div>
          </div>

          {/* Navigation */}
          {totalItems > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: LI.border, background: LI.white }}>
              <button
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-full text-sm font-bold disabled:opacity-30 transition-colors"
                style={{ background: LI.blue, color: '#fff' }}
              >
                Previous
              </button>
              <span className="text-sm font-medium" style={{ color: LI.secondary }}>
                {currentIndex + 1} / {totalItems}
              </span>
              <button
                onClick={() => setCurrentIndex(prev => Math.min(totalItems - 1, prev + 1))}
                disabled={currentIndex === totalItems - 1}
                className="px-4 py-2 rounded-full text-sm font-bold disabled:opacity-30 transition-colors"
                style={{ background: LI.blue, color: '#fff' }}
              >
                Next
              </button>
            </div>
          )}

          {/* Home indicator */}
          <div className="flex justify-center pb-2" style={{ background: LI.white }}>
            <div className="w-32 h-1 rounded-full" style={{ background: '#000' }} />
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      {totalItems > 1 && (
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 max-w-[400px]">
          {items.map((item: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden p-2 text-left transition-all"
              style={{
                border: idx === currentIndex
                  ? `2px solid ${LI.blue}`
                  : `1px solid ${tokens.colors.paper.border}`,
                opacity: idx === currentIndex ? 1 : 0.6,
                background: tokens.colors.paper.warm,
              }}
            >
              <p
                className="text-[10px] leading-tight line-clamp-3"
                style={{ color: tokens.colors.text.secondary }}
              >
                {'text' in item ? item.text : 'question' in item ? item.question : 'caption' in item ? item.caption : item.title}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LinkedInPreview;
