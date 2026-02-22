'use client';

/**
 * LINKEDIN SURFACE
 *
 * Displays LinkedIn content in an authentic LinkedIn post format.
 * Shows text posts, carousels, articles, and polls in LinkedIn style.
 */

import React, { useMemo, useState } from 'react';
import { tokens } from '../primitives/design-tokens';

// LinkedIn brand colors
const LINKEDIN = {
  blue: '#0A66C2',
  blueDark: '#004182',
  blueLight: '#70B5F9',
  bg: '#F4F2EE',
  text: '#191919',
  secondary: '#666666',
  border: '#E0E0E0',
  white: '#FFFFFF',
};

interface ParsedPost {
  id: number;
  text: string;
  characterCount: number;
  hookText: string;
  contentType: string;
  hashtags: string[];
  firstComment: string;
}

interface ParsedCarousel {
  id: number;
  caption: string;
  slides: { slideNumber: number; headline: string; body: string; visual?: string }[];
  hashtags: string[];
  firstComment: string;
}

interface ParsedArticle {
  id: number;
  title: string;
  subtitle: string;
  body: string;
  companionPost: string;
  seoKeywords: string[];
  firstComment: string;
}

interface ParsedPoll {
  id: number;
  question: string;
  questionCharacterCount: number;
  options: string[];
  companionText: string;
  firstComment: string;
  duration: string;
}

interface QualityReport {
  overallScore?: number;
  algorithmScore?: number;
  engagementPrediction?: number;
  depthScore?: number;
  feedback?: string[];
}

interface ParsedLinkedInContent {
  contentType: 'text-posts' | 'carousel' | 'article' | 'poll' | 'unknown';
  posts: ParsedPost[];
  carousels: ParsedCarousel[];
  articles: ParsedArticle[];
  polls: ParsedPoll[];
  qualityReport: QualityReport;
}

interface LinkedInSurfaceProps {
  text: string;
  isGenerating: boolean;
  title?: string;
}

function parseLinkedInContent(text: string): ParsedLinkedInContent {
  const result: ParsedLinkedInContent = {
    contentType: 'unknown',
    posts: [],
    carousels: [],
    articles: [],
    polls: [],
    qualityReport: {},
  };

  if (text.includes('\u{1F4BC} LINKEDIN TEXT POSTS')) {
    result.contentType = 'text-posts';

    const postRegex = /--- Post (\d+) ---\s*\n([\s\S]*?)(?=\n--- Post |\n\n\u{1F4CA} QUALITY|$)/gu;
    let match;
    while ((match = postRegex.exec(text)) !== null) {
      const postNum = parseInt(match[1]);
      const content = match[2].trim();

      const lines = content.split('\n');
      const metaLine = lines.find(l => l.startsWith('['));
      const hashtagLine = lines.find(l => l.startsWith('Hashtags:'));
      const firstCommentLine = lines.find(l => l.startsWith('First Comment:'));
      const hookLine = lines.find(l => l.startsWith('Hook:'));
      const typeLine = lines.find(l => l.startsWith('Type:'));

      const textLines = lines.filter(l =>
        !l.startsWith('[') &&
        !l.startsWith('Hashtags:') &&
        !l.startsWith('First Comment:') &&
        !l.startsWith('Hook:') &&
        !l.startsWith('Type:')
      );
      const postText = textLines.join('\n').trim();

      const metaMatch = metaLine?.match(/\[(\d+) chars/);

      result.posts.push({
        id: postNum,
        text: postText,
        characterCount: metaMatch ? parseInt(metaMatch[1]) : postText.length,
        hookText: hookLine?.replace('Hook:', '').trim() || postText.substring(0, 210),
        contentType: typeLine?.replace('Type:', '').trim() || 'insight',
        hashtags: hashtagLine?.replace('Hashtags:', '').trim().split(/\s+/) || [],
        firstComment: firstCommentLine?.replace('First Comment:', '').trim() || '',
      });
    }
  } else if (text.includes('\u{1F3A0} LINKEDIN CAROUSEL')) {
    result.contentType = 'carousel';

    const carouselRegex = /--- Carousel (\d+) ---\s*\n([\s\S]*?)(?=\n--- Carousel |\n\n\u{1F4CA} QUALITY|$)/gu;
    let match;
    while ((match = carouselRegex.exec(text)) !== null) {
      const carouselNum = parseInt(match[1]);
      const content = match[2].trim();

      const captionMatch = content.match(/Caption:\s*([\s\S]*?)(?=\nSlide \d+:|$)/);
      const hashtagLine = content.match(/Hashtags:\s*(.*)/);
      const firstCommentMatch = content.match(/First Comment:\s*(.*)/);

      const slides: ParsedCarousel['slides'] = [];
      const slideRegex = /Slide (\d+):\s*\n([\s\S]*?)(?=\nSlide \d+:|\nHashtags:|\nFirst Comment:|$)/g;
      let slideMatch;
      while ((slideMatch = slideRegex.exec(content)) !== null) {
        const slideContent = slideMatch[2].trim();
        const headlineMatch = slideContent.match(/Headline:\s*(.*)/);
        const bodyMatch = slideContent.match(/Body:\s*(.*)/);
        const visualMatch = slideContent.match(/Visual:\s*(.*)/);
        slides.push({
          slideNumber: parseInt(slideMatch[1]),
          headline: headlineMatch?.[1]?.trim() || '',
          body: bodyMatch?.[1]?.trim() || slideContent,
          visual: visualMatch?.[1]?.trim(),
        });
      }

      result.carousels.push({
        id: carouselNum,
        caption: captionMatch?.[1]?.trim() || '',
        slides,
        hashtags: hashtagLine?.[1]?.trim().split(/\s+/) || [],
        firstComment: firstCommentMatch?.[1]?.trim() || '',
      });
    }
  } else if (text.includes('\u{1F4F0} LINKEDIN ARTICLE')) {
    result.contentType = 'article';

    const articleRegex = /--- Article (\d+) ---\s*\n([\s\S]*?)(?=\n--- Article |\n\n\u{1F4CA} QUALITY|$)/gu;
    let match;
    while ((match = articleRegex.exec(text)) !== null) {
      const articleNum = parseInt(match[1]);
      const content = match[2].trim();

      const titleMatch = content.match(/Title:\s*(.*)/);
      const subtitleMatch = content.match(/Subtitle:\s*(.*)/);
      const bodyMatch = content.match(/Body:\s*([\s\S]*?)(?=\nCompanion Post:|\nSEO Keywords:|\nFirst Comment:|$)/);
      const companionMatch = content.match(/Companion Post:\s*([\s\S]*?)(?=\nSEO Keywords:|\nFirst Comment:|$)/);
      const seoMatch = content.match(/SEO Keywords:\s*(.*)/);
      const firstCommentMatch = content.match(/First Comment:\s*(.*)/);

      result.articles.push({
        id: articleNum,
        title: titleMatch?.[1]?.trim() || 'Untitled Article',
        subtitle: subtitleMatch?.[1]?.trim() || '',
        body: bodyMatch?.[1]?.trim() || content,
        companionPost: companionMatch?.[1]?.trim() || '',
        seoKeywords: seoMatch?.[1]?.trim().split(',').map(s => s.trim()) || [],
        firstComment: firstCommentMatch?.[1]?.trim() || '',
      });
    }
  } else if (text.includes('\u{1F4CA} LINKEDIN POLLS')) {
    result.contentType = 'poll';

    const pollRegex = /--- Poll (\d+) ---\s*\n([\s\S]*?)(?=\n--- Poll |\n\n\u{1F4CA} QUALITY|$)/gu;
    let match;
    while ((match = pollRegex.exec(text)) !== null) {
      const pollNum = parseInt(match[1]);
      const content = match[2].trim();

      const questionMatch = content.match(/Question:\s*(.*)/);
      const optionMatches = content.match(/Option \d+:\s*(.*)/g);
      const companionMatch = content.match(/Companion Text:\s*([\s\S]*?)(?=\nFirst Comment:|\nDuration:|$)/);
      const firstCommentMatch = content.match(/First Comment:\s*(.*)/);
      const durationMatch = content.match(/Duration:\s*(.*)/);

      const question = questionMatch?.[1]?.trim() || '';
      const options = optionMatches?.map(o => o.replace(/Option \d+:\s*/, '').trim()) || [];

      result.polls.push({
        id: pollNum,
        question,
        questionCharacterCount: question.length,
        options,
        companionText: companionMatch?.[1]?.trim() || '',
        firstComment: firstCommentMatch?.[1]?.trim() || '',
        duration: durationMatch?.[1]?.trim() || '1 week',
      });
    }
  }

  // Parse quality report (avoid matching the LINKEDIN POLLS marker)
  const reportMatch = text.match(/\u{1F4CA} QUALITY REPORT\n([\s\S]*?)$/u);
  if (reportMatch) {
    const reportContent = reportMatch[1];
    const overallMatch = reportContent.match(/(?:Score|Overall):\s*(\d+)\/10/);
    const algoMatch = reportContent.match(/Algorithm:\s*(\d+)\/10/);
    const engagementMatch = reportContent.match(/Engagement:\s*(\d+)\/10/);
    const depthMatch = reportContent.match(/Depth:\s*(\d+)\/10/);

    result.qualityReport = {
      overallScore: overallMatch ? parseInt(overallMatch[1]) : undefined,
      algorithmScore: algoMatch ? parseInt(algoMatch[1]) : undefined,
      engagementPrediction: engagementMatch ? parseInt(engagementMatch[1]) : undefined,
      depthScore: depthMatch ? parseInt(depthMatch[1]) : undefined,
    };
  }

  return result;
}

// LinkedIn Logo component
const LinkedInLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// LinkedIn reaction icons
const ReactionIcons = () => (
  <div className="flex items-center gap-4 mt-3 pt-2" style={{ borderTop: `1px solid ${tokens.colors.paper.border}` }}>
    {['Like', 'Celebrate', 'Support', 'Insightful', 'Comment', 'Repost', 'Send'].map((action) => (
      <button key={action} className="flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
        <span className="text-xs" style={{ color: tokens.colors.text.muted }}>{action}</span>
      </button>
    ))}
  </div>
);

// Post Card component
const PostCard: React.FC<{
  text: string;
  characterCount: number;
  contentType: string;
  hashtags: string[];
  firstComment: string;
}> = ({ text, characterCount, contentType, hashtags, firstComment }) => (
  <div
    className="relative p-4 rounded-xl transition-all hover:bg-opacity-50"
    style={{
      background: tokens.colors.paper.white,
      border: `1px solid ${tokens.colors.paper.border}`,
    }}
  >
    {/* User info row */}
    <div className="flex items-start gap-3">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: LINKEDIN.blue }}
      >
        <span className="text-sm font-bold text-white">Y</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="font-bold text-sm" style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>
            Your Brand
          </span>
          <span className="text-xs px-1.5 py-0.5 rounded border" style={{ color: LINKEDIN.secondary, borderColor: LINKEDIN.border }}>
            1st
          </span>
        </div>
        <p className="text-xs" style={{ color: tokens.colors.text.muted }}>Professional headline</p>

        {/* Post text */}
        <p
          className="mt-3 text-[15px] leading-relaxed whitespace-pre-wrap"
          style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
        >
          {text}
        </p>

        {/* Hashtags */}
        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {hashtags.map((tag, i) => (
              <span key={i} className="text-sm" style={{ color: LINKEDIN.blue }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-4 mt-3">
          <span className="text-xs" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.mono }}>
            {characterCount}/3,000 chars
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: tokens.colors.sage[50], color: tokens.colors.sage[700] }}
          >
            {contentType}
          </span>
        </div>

        <ReactionIcons />

        {/* First Comment */}
        {firstComment && (
          <div
            className="mt-3 p-3 rounded-lg"
            style={{ background: tokens.colors.paper.warm, border: `1px dashed ${tokens.colors.paper.border}` }}
          >
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: tokens.colors.text.muted }}>
              First Comment
            </p>
            <p className="text-sm" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
              {firstComment}
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Carousel Card component
const CarouselCard: React.FC<{
  caption: string;
  slides: { slideNumber: number; headline: string; body: string; visual?: string }[];
  hashtags: string[];
  firstComment: string;
}> = ({ caption, slides, hashtags, firstComment }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div
      className="p-4 rounded-xl"
      style={{
        background: tokens.colors.paper.white,
        border: `1px solid ${tokens.colors.paper.border}`,
      }}
    >
      {/* User info */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: LINKEDIN.blue }}
        >
          <span className="text-sm font-bold text-white">Y</span>
        </div>
        <div>
          <span className="font-bold text-sm" style={{ color: tokens.colors.text.primary }}>Your Brand</span>
          <p className="text-xs" style={{ color: tokens.colors.text.muted }}>Professional headline</p>
        </div>
      </div>

      {/* Caption */}
      <p
        className="text-sm leading-relaxed whitespace-pre-wrap mb-3"
        style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
      >
        {caption}
      </p>

      {/* Slide viewer */}
      {slides.length > 0 && (
        <div className="relative">
          <div
            className="p-6 rounded-lg min-h-[200px] flex flex-col justify-center"
            style={{ background: LINKEDIN.bg }}
          >
            <h4 className="text-lg font-bold mb-2" style={{ color: LINKEDIN.text }}>
              {slides[currentSlide]?.headline}
            </h4>
            <p className="text-sm" style={{ color: LINKEDIN.secondary }}>
              {slides[currentSlide]?.body}
            </p>
            {slides[currentSlide]?.visual && (
              <p className="text-xs mt-2 italic" style={{ color: LINKEDIN.secondary }}>
                Visual: {slides[currentSlide].visual}
              </p>
            )}
          </div>

          {/* Navigation */}
          {slides.length > 1 && (
            <div className="flex items-center justify-between mt-2">
              <button
                onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                disabled={currentSlide === 0}
                className="p-1 rounded-full disabled:opacity-30"
                style={{ color: LINKEDIN.blue }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
              </button>
              <div className="flex gap-1">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className="w-2 h-2 rounded-full transition-colors"
                    style={{ background: i === currentSlide ? LINKEDIN.blue : LINKEDIN.border }}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
                disabled={currentSlide === slides.length - 1}
                className="p-1 rounded-full disabled:opacity-30"
                style={{ color: LINKEDIN.blue }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hashtags */}
      {hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {hashtags.map((tag, i) => (
            <span key={i} className="text-sm" style={{ color: LINKEDIN.blue }}>{tag}</span>
          ))}
        </div>
      )}

      <ReactionIcons />

      {/* First Comment */}
      {firstComment && (
        <div
          className="mt-3 p-3 rounded-lg"
          style={{ background: tokens.colors.paper.warm, border: `1px dashed ${tokens.colors.paper.border}` }}
        >
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: tokens.colors.text.muted }}>First Comment</p>
          <p className="text-sm" style={{ color: tokens.colors.text.secondary }}>{firstComment}</p>
        </div>
      )}
    </div>
  );
};

// Article Card component
const ArticleCard: React.FC<{
  title: string;
  subtitle: string;
  body: string;
  companionPost: string;
  seoKeywords: string[];
  firstComment: string;
}> = ({ title, subtitle, body, companionPost, seoKeywords, firstComment }) => (
  <div
    className="p-4 rounded-xl"
    style={{
      background: tokens.colors.paper.white,
      border: `1px solid ${tokens.colors.paper.border}`,
    }}
  >
    {/* Article header */}
    <h3
      className="text-xl font-bold mb-1"
      style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
    >
      {title}
    </h3>
    {subtitle && (
      <p className="text-sm mb-3" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.serif }}>
        {subtitle}
      </p>
    )}

    {/* Body preview */}
    <p
      className="text-sm leading-relaxed whitespace-pre-wrap mb-3"
      style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}
    >
      {body.length > 500 ? body.substring(0, 500) + '...' : body}
    </p>
    {body.length > 500 && (
      <p className="text-sm font-medium mb-3" style={{ color: LINKEDIN.blue }}>Read more</p>
    )}

    {/* Companion Post */}
    {companionPost && (
      <div
        className="p-3 rounded-lg mb-3"
        style={{ background: tokens.colors.paper.warm, border: `1px solid ${tokens.colors.paper.border}` }}
      >
        <p className="text-xs uppercase tracking-wider mb-1" style={{ color: tokens.colors.text.muted }}>
          Companion Post
        </p>
        <p className="text-sm whitespace-pre-wrap" style={{ color: tokens.colors.text.primary }}>
          {companionPost}
        </p>
      </div>
    )}

    {/* SEO Keywords */}
    {seoKeywords.length > 0 && (
      <div className="flex flex-wrap gap-1 mb-3">
        {seoKeywords.map((kw, i) => (
          <span
            key={i}
            className="text-xs px-2 py-1 rounded-full"
            style={{ background: tokens.colors.sage[50], color: tokens.colors.sage[700] }}
          >
            {kw}
          </span>
        ))}
      </div>
    )}

    <ReactionIcons />

    {/* First Comment */}
    {firstComment && (
      <div
        className="mt-3 p-3 rounded-lg"
        style={{ background: tokens.colors.paper.warm, border: `1px dashed ${tokens.colors.paper.border}` }}
      >
        <p className="text-xs uppercase tracking-wider mb-1" style={{ color: tokens.colors.text.muted }}>First Comment</p>
        <p className="text-sm" style={{ color: tokens.colors.text.secondary }}>{firstComment}</p>
      </div>
    )}
  </div>
);

// Poll Card component
const PollCard: React.FC<{
  question: string;
  questionCharacterCount: number;
  options: string[];
  companionText: string;
  firstComment: string;
  duration: string;
}> = ({ question, questionCharacterCount, options, companionText, firstComment, duration }) => (
  <div
    className="p-4 rounded-xl"
    style={{
      background: tokens.colors.paper.white,
      border: `1px solid ${tokens.colors.paper.border}`,
    }}
  >
    {/* User info */}
    <div className="flex items-start gap-3 mb-3">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: LINKEDIN.blue }}
      >
        <span className="text-sm font-bold text-white">Y</span>
      </div>
      <div>
        <span className="font-bold text-sm" style={{ color: tokens.colors.text.primary }}>Your Brand</span>
        <p className="text-xs" style={{ color: tokens.colors.text.muted }}>Professional headline</p>
      </div>
    </div>

    {/* Companion text */}
    {companionText && (
      <p
        className="text-sm leading-relaxed whitespace-pre-wrap mb-3"
        style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
      >
        {companionText}
      </p>
    )}

    {/* Poll question */}
    <div
      className="p-4 rounded-lg mb-3"
      style={{ background: LINKEDIN.bg, border: `1px solid ${LINKEDIN.border}` }}
    >
      <h4 className="text-base font-bold mb-1" style={{ color: LINKEDIN.text }}>
        {question}
      </h4>
      <span className="text-xs" style={{ color: LINKEDIN.secondary }}>
        {questionCharacterCount}/140 chars
      </span>

      {/* Option bars */}
      <div className="space-y-2 mt-3">
        {options.map((option, i) => (
          <div
            key={i}
            className="relative px-4 py-2.5 rounded-full text-sm font-medium cursor-pointer transition-colors hover:bg-opacity-80"
            style={{
              border: `1px solid ${LINKEDIN.blue}`,
              color: LINKEDIN.blue,
              background: 'transparent',
            }}
          >
            {option}
          </div>
        ))}
      </div>

      {/* Duration badge */}
      <div className="mt-3 flex items-center gap-2">
        <span
          className="text-xs px-2 py-1 rounded-full"
          style={{ background: tokens.colors.ink[50], color: tokens.colors.ink[600] }}
        >
          {duration}
        </span>
      </div>
    </div>

    <ReactionIcons />

    {/* First Comment */}
    {firstComment && (
      <div
        className="mt-3 p-3 rounded-lg"
        style={{ background: tokens.colors.paper.warm, border: `1px dashed ${tokens.colors.paper.border}` }}
      >
        <p className="text-xs uppercase tracking-wider mb-1" style={{ color: tokens.colors.text.muted }}>First Comment</p>
        <p className="text-sm" style={{ color: tokens.colors.text.secondary }}>{firstComment}</p>
      </div>
    )}
  </div>
);

export const LinkedInSurface: React.FC<LinkedInSurfaceProps> = ({
  text,
  isGenerating,
  title = 'LinkedIn Content',
}) => {
  const parsed = useMemo(() => parseLinkedInContent(text), [text]);

  const getContentTitle = () => {
    switch (parsed.contentType) {
      case 'text-posts': return 'Text Posts';
      case 'carousel': return 'Carousels';
      case 'article': return 'Articles';
      case 'poll': return 'Polls';
      default: return 'LinkedIn Content';
    }
  };

  const getContentCount = () => {
    switch (parsed.contentType) {
      case 'text-posts': return `${parsed.posts.length} posts`;
      case 'carousel': return `${parsed.carousels.length} carousels`;
      case 'article': return `${parsed.articles.length} articles`;
      case 'poll': return `${parsed.polls.length} polls`;
      default: return '';
    }
  };

  return (
    <div className="relative">
      {/* Outer frame */}
      <div
        className="absolute -inset-4 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${tokens.colors.paper.dark} 0%, ${tokens.colors.paper.border} 100%)`,
          padding: '1px',
        }}
      >
        <div
          className="w-full h-full rounded-2xl"
          style={{ background: tokens.colors.paper.cream }}
        />
      </div>

      {/* Main surface */}
      <div
        className="relative min-h-[500px] p-6 rounded-xl overflow-hidden"
        style={{
          background: tokens.colors.paper.white,
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.8),
            0 25px 50px -12px rgba(26, 26, 26, 0.15),
            0 0 0 1px ${tokens.colors.paper.border}
          `,
        }}
      >
        {/* Header */}
        <div className="mb-6 pb-4 border-b" style={{ borderColor: tokens.colors.paper.border }}>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: LINKEDIN.blue }}
            >
              <LinkedInLogo />
            </div>
            <div>
              <p
                className="font-medium"
                style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
              >
                {title || getContentTitle()}
              </p>
              <p
                className="text-xs"
                style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
              >
                {isGenerating ? 'Creating your content...' : `LinkedIn ${getContentTitle()} Preview`}
              </p>
            </div>

            {/* Content count */}
            <div className="ml-auto">
              <span
                className="text-sm px-3 py-1 rounded-full"
                style={{ background: tokens.colors.ink[50], color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
              >
                {getContentCount()}
              </span>
            </div>
          </div>
        </div>

        {/* Text Posts */}
        {parsed.contentType === 'text-posts' && parsed.posts.length > 0 && (
          <div className="space-y-4">
            {parsed.posts.map((post) => (
              <PostCard
                key={post.id}
                text={post.text}
                characterCount={post.characterCount}
                contentType={post.contentType}
                hashtags={post.hashtags}
                firstComment={post.firstComment}
              />
            ))}
          </div>
        )}

        {/* Carousels */}
        {parsed.contentType === 'carousel' && parsed.carousels.length > 0 && (
          <div className="space-y-4">
            {parsed.carousels.map((carousel) => (
              <CarouselCard
                key={carousel.id}
                caption={carousel.caption}
                slides={carousel.slides}
                hashtags={carousel.hashtags}
                firstComment={carousel.firstComment}
              />
            ))}
          </div>
        )}

        {/* Articles */}
        {parsed.contentType === 'article' && parsed.articles.length > 0 && (
          <div className="space-y-4">
            {parsed.articles.map((article) => (
              <ArticleCard
                key={article.id}
                title={article.title}
                subtitle={article.subtitle}
                body={article.body}
                companionPost={article.companionPost}
                seoKeywords={article.seoKeywords}
                firstComment={article.firstComment}
              />
            ))}
          </div>
        )}

        {/* Polls */}
        {parsed.contentType === 'poll' && parsed.polls.length > 0 && (
          <div className="space-y-4">
            {parsed.polls.map((poll) => (
              <PollCard
                key={poll.id}
                question={poll.question}
                questionCharacterCount={poll.questionCharacterCount}
                options={poll.options}
                companionText={poll.companionText}
                firstComment={poll.firstComment}
                duration={poll.duration}
              />
            ))}
          </div>
        )}

        {/* Quality Report */}
        {parsed.qualityReport.overallScore !== undefined && (
          <div
            className="mt-6 p-4 rounded-xl"
            style={{ background: tokens.colors.paper.warm }}
          >
            <p className="text-sm font-medium mb-3" style={{ color: tokens.colors.text.primary }}>
              Quality Report
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {parsed.qualityReport.overallScore !== undefined && (
                <div>
                  <p className="text-xs uppercase tracking-wider" style={{ color: tokens.colors.text.muted }}>Overall</p>
                  <p className="text-2xl font-bold" style={{ color: tokens.colors.ink[700] }}>
                    {parsed.qualityReport.overallScore}/10
                  </p>
                </div>
              )}
              {parsed.qualityReport.algorithmScore !== undefined && (
                <div>
                  <p className="text-xs uppercase tracking-wider" style={{ color: tokens.colors.text.muted }}>Algorithm</p>
                  <p className="text-2xl font-bold" style={{ color: tokens.colors.sage[600] }}>
                    {parsed.qualityReport.algorithmScore}/10
                  </p>
                </div>
              )}
              {parsed.qualityReport.engagementPrediction !== undefined && (
                <div>
                  <p className="text-xs uppercase tracking-wider" style={{ color: tokens.colors.text.muted }}>Engagement</p>
                  <p className="text-2xl font-bold" style={{ color: tokens.colors.sage[600] }}>
                    {parsed.qualityReport.engagementPrediction}/10
                  </p>
                </div>
              )}
              {parsed.qualityReport.depthScore !== undefined && (
                <div>
                  <p className="text-xs uppercase tracking-wider" style={{ color: tokens.colors.text.muted }}>Depth</p>
                  <p className="text-2xl font-bold" style={{ color: tokens.colors.sage[600] }}>
                    {parsed.qualityReport.depthScore}/10
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Generating indicator */}
        {isGenerating && (
          <div
            className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full flex items-center gap-2"
            style={{ background: LINKEDIN.blue }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: '#fff' }}
            />
            <span
              className="text-xs"
              style={{ color: '#fff', fontFamily: tokens.fonts.sans }}
            >
              Creating...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkedInSurface;
