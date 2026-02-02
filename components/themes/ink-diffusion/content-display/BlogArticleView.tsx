'use client';

/**
 * BLOG ARTICLE VIEW
 *
 * Beautiful editorial-style blog presentation.
 * Renders content with proper typography, headers, and formatting.
 */

import React, { useMemo } from 'react';
import { tokens } from '../primitives/design-tokens';

interface BlogArticleViewProps {
  content: string;
  title: string;
  company?: string;
  author?: string;
  publishDate?: Date;
  wordCount?: number;
  topic?: string;
}

// Parse content into structured sections
function parseContent(rawContent: string) {
  const lines = rawContent.split('\n');
  const sections: Array<{
    type: 'title' | 'heading' | 'subheading' | 'paragraph' | 'list' | 'quote' | 'divider';
    content: string;
    items?: string[];
  }> = [];

  let currentList: string[] = [];
  let isInList = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      if (isInList && currentList.length > 0) {
        sections.push({ type: 'list', content: '', items: [...currentList] });
        currentList = [];
        isInList = false;
      }
      continue;
    }

    // Headings
    if (trimmed.startsWith('# ')) {
      sections.push({ type: 'title', content: trimmed.slice(2) });
    } else if (trimmed.startsWith('## ')) {
      sections.push({ type: 'heading', content: trimmed.slice(3) });
    } else if (trimmed.startsWith('### ')) {
      sections.push({ type: 'subheading', content: trimmed.slice(4) });
    }
    // List items
    else if (trimmed.match(/^[-•*]\s/) || trimmed.match(/^\d+\.\s/)) {
      isInList = true;
      const listContent = trimmed.replace(/^[-•*]\s/, '').replace(/^\d+\.\s/, '');
      currentList.push(listContent);
    }
    // Blockquotes
    else if (trimmed.startsWith('>')) {
      sections.push({ type: 'quote', content: trimmed.slice(1).trim() });
    }
    // Dividers
    else if (trimmed.match(/^[-=_]{3,}$/)) {
      sections.push({ type: 'divider', content: '' });
    }
    // Regular paragraphs
    else {
      if (isInList && currentList.length > 0) {
        sections.push({ type: 'list', content: '', items: [...currentList] });
        currentList = [];
        isInList = false;
      }
      sections.push({ type: 'paragraph', content: trimmed });
    }
  }

  // Flush remaining list
  if (currentList.length > 0) {
    sections.push({ type: 'list', content: '', items: currentList });
  }

  return sections;
}

// Format inline text (bold, italic, links)
function formatInlineText(text: string): React.ReactNode {
  // Simple bold (**text**)
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export const BlogArticleView: React.FC<BlogArticleViewProps> = ({
  content,
  title,
  company,
  author,
  publishDate,
  wordCount,
  topic,
}) => {
  const sections = useMemo(() => parseContent(content), [content]);
  const readingTime = wordCount ? Math.ceil(wordCount / 200) : null;

  return (
    <article
      className="max-w-3xl mx-auto"
      style={{ background: tokens.colors.paper.white }}
    >
      {/* Article Header */}
      <header className="mb-12 text-center">
        {/* Category/Topic Badge */}
        {topic && (
          <p
            className="text-xs uppercase tracking-[0.25em] mb-6"
            style={{ color: tokens.colors.ink[600], fontFamily: tokens.fonts.sans }}
          >
            {topic}
          </p>
        )}

        {/* Title */}
        <h1
          className="text-2xl sm:text-4xl md:text-5xl font-light leading-tight mb-4 sm:mb-6"
          style={{
            color: tokens.colors.text.primary,
            fontFamily: tokens.fonts.serif,
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h1>

        {/* Meta Info */}
        <div
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm"
          style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
        >
          {(author || company) && (
            <span className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                style={{ background: tokens.colors.ink[100], color: tokens.colors.ink[700] }}
              >
                {(author || company || 'A').charAt(0).toUpperCase()}
              </div>
              <span style={{ color: tokens.colors.text.secondary }}>
                {author || company}
              </span>
            </span>
          )}
          {publishDate && (
            <>
              <span style={{ color: tokens.colors.paper.border }}>•</span>
              <time>{new Date(publishDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}</time>
            </>
          )}
          {readingTime && (
            <>
              <span style={{ color: tokens.colors.paper.border }}>•</span>
              <span>{readingTime} min read</span>
            </>
          )}
        </div>

        {/* Decorative line */}
        <div
          className="mt-10 mx-auto w-16 h-px"
          style={{ background: tokens.colors.ink[200] }}
        />
      </header>

      {/* Article Body */}
      <div className="prose-custom">
        {sections.map((section, index) => {
          switch (section.type) {
            case 'title':
              return (
                <h2
                  key={index}
                  className="text-3xl font-light mt-12 mb-6"
                  style={{
                    color: tokens.colors.text.primary,
                    fontFamily: tokens.fonts.serif,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {formatInlineText(section.content)}
                </h2>
              );

            case 'heading':
              return (
                <h3
                  key={index}
                  className="text-2xl font-light mt-10 mb-4"
                  style={{
                    color: tokens.colors.text.primary,
                    fontFamily: tokens.fonts.serif,
                  }}
                >
                  {formatInlineText(section.content)}
                </h3>
              );

            case 'subheading':
              return (
                <h4
                  key={index}
                  className="text-lg font-medium mt-8 mb-3"
                  style={{
                    color: tokens.colors.text.primary,
                    fontFamily: tokens.fonts.sans,
                  }}
                >
                  {formatInlineText(section.content)}
                </h4>
              );

            case 'paragraph':
              return (
                <p
                  key={index}
                  className="text-lg leading-[1.9] mb-6"
                  style={{
                    color: tokens.colors.text.secondary,
                    fontFamily: tokens.fonts.serif,
                  }}
                >
                  {formatInlineText(section.content)}
                </p>
              );

            case 'list':
              return (
                <ul
                  key={index}
                  className="mb-6 space-y-3 pl-0"
                  style={{ listStyle: 'none' }}
                >
                  {section.items?.map((item, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-lg leading-relaxed"
                      style={{
                        color: tokens.colors.text.secondary,
                        fontFamily: tokens.fonts.serif,
                      }}
                    >
                      <span
                        className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-3"
                        style={{ background: tokens.colors.ink[400] }}
                      />
                      <span>{formatInlineText(item)}</span>
                    </li>
                  ))}
                </ul>
              );

            case 'quote':
              return (
                <blockquote
                  key={index}
                  className="my-8 pl-6 py-2"
                  style={{
                    borderLeft: `3px solid ${tokens.colors.ink[300]}`,
                  }}
                >
                  <p
                    className="text-xl italic leading-relaxed"
                    style={{
                      color: tokens.colors.text.muted,
                      fontFamily: tokens.fonts.serif,
                    }}
                  >
                    {formatInlineText(section.content)}
                  </p>
                </blockquote>
              );

            case 'divider':
              return (
                <div
                  key={index}
                  className="my-12 flex items-center justify-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full" style={{ background: tokens.colors.ink[200] }} />
                  <div className="w-2 h-2 rounded-full" style={{ background: tokens.colors.ink[200] }} />
                  <div className="w-2 h-2 rounded-full" style={{ background: tokens.colors.ink[200] }} />
                </div>
              );

            default:
              return null;
          }
        })}
      </div>

      {/* Article Footer */}
      <footer className="mt-16 pt-8 border-t" style={{ borderColor: tokens.colors.paper.border }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {company && (
              <>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
                  style={{ background: tokens.colors.ink[100], color: tokens.colors.ink[700] }}
                >
                  {company.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
                  >
                    {company}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                  >
                    {wordCount?.toLocaleString()} words
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Share hint */}
          <p
            className="text-xs uppercase tracking-wider"
            style={{ color: tokens.colors.text.subtle, fontFamily: tokens.fonts.sans }}
          >
            Generated with Scribengine
          </p>
        </div>
      </footer>
    </article>
  );
};

export default BlogArticleView;
