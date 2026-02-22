'use client';

/**
 * CONTENT ARCHITECT SURFACE
 *
 * Displays Content Architect output during generation with a strategic
 * dashboard-style layout. Parses the structured output format
 * (emoji section headers + box-drawing separators) into styled cards.
 */

import React, { useMemo } from 'react';
import { tokens } from '../primitives/design-tokens';

// Section definitions with styling
const SECTION_CONFIG: Record<string, { emoji: string; title: string; accent: string; icon: string }> = {
  analysis: { emoji: '📊', title: 'Analysis Summary', accent: '#6366F1', icon: '📊' },
  strategy: { emoji: '🎯', title: 'Strategic Overview', accent: '#059669', icon: '🎯' },
  platform: { emoji: '📱', title: 'Platform Strategy', accent: '#0891B2', icon: '📱' },
  recommendations: { emoji: '📦', title: 'Service Recommendations', accent: '#D97706', icon: '📦' },
  analytics: { emoji: '📈', title: 'Analytics Insights', accent: '#7C3AED', icon: '📈' },
  seo: { emoji: '🔍', title: 'SEO Intelligence', accent: '#2563EB', icon: '🔍' },
  images: { emoji: '🖼️', title: 'Image Recommendations', accent: '#DB2777', icon: '🖼️' },
  execution: { emoji: '📋', title: 'Execution Plan', accent: '#DC2626', icon: '📋' },
};

interface ParsedSection {
  key: string;
  emoji: string;
  title: string;
  accent: string;
  content: string;
  lines: ParsedLine[];
}

interface ParsedLine {
  type: 'text' | 'bullet' | 'numbered' | 'keyValue' | 'phase' | 'platform' | 'priority' | 'empty';
  text: string;
  label?: string;
  value?: string;
  number?: number;
  priorityLevel?: 'high' | 'medium' | 'low';
}

interface ContentArchitectSurfaceProps {
  text: string;
  isGenerating: boolean;
  title?: string;
}

function parseContentArchitectText(text: string): { sections: ParsedSection[]; headerFound: boolean; footerText: string } {
  const sections: ParsedSection[] = [];
  let headerFound = false;
  let footerText = '';

  // Detect header
  if (text.includes('CONTENT ARCHITECT') || text.includes('╔═')) {
    headerFound = true;
  }

  // Detect footer
  const footerMatch = text.match(/Generated:[\s\S]*?━+\s*$/)
  if (footerMatch) {
    footerText = footerMatch[0].replace(/━+/g, '').trim()
  }

  // Parse each section
  const sectionPatterns = [
    { key: 'analysis', pattern: /📊\s*ANALYSIS SUMMARY\s*\n━+\n([\s\S]*?)(?=\n\n[📊🎯📱📦📈🔍🖼📋━╔]|$)/ },
    { key: 'strategy', pattern: /🎯\s*STRATEGIC OVERVIEW\s*\n━+\n([\s\S]*?)(?=\n\n[📊🎯📱📦📈🔍🖼📋━╔]|$)/ },
    { key: 'platform', pattern: /📱\s*PLATFORM STRATEGY\s*\n━+\n([\s\S]*?)(?=\n\n[📊🎯📱📦📈🔍🖼📋━╔]|$)/ },
    { key: 'recommendations', pattern: /📦\s*SERVICE RECOMMENDATIONS\s*\n━+\n([\s\S]*?)(?=\n\n[📊🎯📱📦📈🔍🖼📋━╔]|$)/ },
    { key: 'analytics', pattern: /📈\s*ANALYTICS INSIGHTS\s*\n━+\n([\s\S]*?)(?=\n\n[📊🎯📱📦📈🔍🖼📋━╔]|$)/ },
    { key: 'seo', pattern: /🔍\s*SEO INTELLIGENCE\s*\n━+\n([\s\S]*?)(?=\n\n[📊🎯📱📦📈🔍🖼📋━╔]|$)/ },
    { key: 'images', pattern: /🖼️?\s*IMAGE RECOMMENDATIONS\s*\n━+\n([\s\S]*?)(?=\n\n[📊🎯📱📦📈🔍🖼📋━╔]|$)/ },
    { key: 'execution', pattern: /📋\s*EXECUTION PLAN\s*\n━+\n([\s\S]*?)(?=\n━━━━|Generated:|$)/ },
  ];

  for (const { key, pattern } of sectionPatterns) {
    const match = text.match(pattern);
    if (match) {
      const config = SECTION_CONFIG[key];
      const content = match[1].trim();
      sections.push({
        key,
        emoji: config.emoji,
        title: config.title,
        accent: config.accent,
        content,
        lines: parseLines(content, key),
      });
    }
  }

  return { sections, headerFound, footerText };
}

function parseLines(content: string, sectionKey: string): ParsedLine[] {
  const lines: ParsedLine[] = [];
  const rawLines = content.split('\n');

  for (const raw of rawLines) {
    const trimmed = raw.trim();
    if (!trimmed) {
      lines.push({ type: 'empty', text: '' });
      continue;
    }

    // Priority items (🔴 🟡 🟢)
    if (trimmed.includes('🔴') || trimmed.includes('🟡') || trimmed.includes('🟢')) {
      const level = trimmed.includes('🔴') ? 'high' : trimmed.includes('🟡') ? 'medium' : 'low';
      lines.push({ type: 'priority', text: trimmed, priorityLevel: level });
      continue;
    }

    // Phase headers (⚡ QUICK WINS, 📍 PHASE)
    if (/^[⚡📍]\s/.test(trimmed)) {
      lines.push({ type: 'phase', text: trimmed });
      continue;
    }

    // Platform headers (INSTAGRAM:, LINKEDIN:, etc.)
    if (/^[A-Z]{2,}[:/]\s/.test(trimmed) && sectionKey === 'platform') {
      const colonIdx = trimmed.indexOf(':');
      lines.push({
        type: 'platform',
        text: trimmed,
        label: trimmed.substring(0, colonIdx),
        value: trimmed.substring(colonIdx + 1).trim(),
      });
      continue;
    }

    // Numbered items (1. Something, 2. Something)
    const numMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (numMatch) {
      lines.push({ type: 'numbered', text: numMatch[2], number: parseInt(numMatch[1]) });
      continue;
    }

    // Bullet items (•, -, *)
    if (/^[•\-*]\s/.test(trimmed)) {
      lines.push({ type: 'bullet', text: trimmed.replace(/^[•\-*]\s+/, '') });
      continue;
    }

    // Key-value pairs (Label: Value)
    const kvMatch = trimmed.match(/^([A-Z][A-Za-z\s]+):\s+(.+)/);
    if (kvMatch && sectionKey !== 'platform') {
      lines.push({ type: 'keyValue', text: trimmed, label: kvMatch[1], value: kvMatch[2] });
      continue;
    }

    // Indented key-value (   Tier: STANDARD)
    const indentedKv = trimmed.match(/^(Tier|Price|Why|Impact|Reason|Tools Used|Recommended Tool|Note):\s+(.+)/);
    if (indentedKv) {
      lines.push({ type: 'keyValue', text: trimmed, label: indentedKv[1], value: indentedKv[2] });
      continue;
    }

    lines.push({ type: 'text', text: trimmed });
  }

  return lines;
}

// Platform color mapping
const PLATFORM_COLORS: Record<string, string> = {
  INSTAGRAM: '#E4405F',
  LINKEDIN: '#0A66C2',
  TWITTER: '#1DA1F2',
  X: '#1DA1F2',
  BLOG: '#2D3748',
  FACEBOOK: '#1877F2',
  EMAIL: '#059669',
};

export const ContentArchitectSurface: React.FC<ContentArchitectSurfaceProps> = ({
  text,
  isGenerating,
  title = 'Content Strategy',
}) => {
  const { sections, headerFound, footerText } = useMemo(() => parseContentArchitectText(text), [text]);
  const wordCount = useMemo(() => text.split(/\s+/).filter(Boolean).length, [text]);

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
        <div className="w-full h-full rounded-2xl" style={{ background: tokens.colors.paper.cream }} />
      </div>

      {/* Main surface */}
      <div
        className="relative min-h-[450px] rounded-xl overflow-hidden"
        style={{
          background: tokens.colors.paper.white,
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.8),
            0 25px 50px -12px rgba(26, 26, 26, 0.15),
            0 0 0 1px ${tokens.colors.paper.border}
          `,
        }}
      >
        {/* Header bar */}
        <div
          className="px-8 py-5 border-b flex items-center justify-between"
          style={{ borderColor: tokens.colors.paper.border, background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏗️</span>
            <div>
              <h2 className="text-lg font-semibold text-white" style={{ fontFamily: tokens.fonts.sans }}>
                Content Architect
              </h2>
              <p className="text-xs text-slate-300" style={{ fontFamily: tokens.fonts.sans }}>
                {isGenerating ? 'Building strategic plan...' : 'Strategic Content Plan'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {wordCount > 0 && (
              <span className="text-xs px-2 py-1 rounded bg-slate-600 text-slate-200" style={{ fontFamily: tokens.fonts.mono }}>
                {wordCount} words
              </span>
            )}
            {isGenerating && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Analyzing
              </span>
            )}
          </div>
        </div>

        {/* Content area */}
        <div className="p-6 space-y-4">
          {sections.length === 0 && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <span className="text-4xl mb-4 block">🏗️</span>
                <p className="text-sm" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
                  {isGenerating ? 'Analyzing your business and building strategy...' : 'Strategy will appear here...'}
                </p>
              </div>
            </div>
          )}

          {sections.map((section) => (
            <SectionCard key={section.key} section={section} />
          ))}

          {/* Footer metadata */}
          {footerText && !isGenerating && (
            <div
              className="mt-6 pt-4 border-t text-xs text-center"
              style={{ borderColor: tokens.colors.paper.border, color: tokens.colors.text.muted, fontFamily: tokens.fonts.mono }}
            >
              {footerText}
            </div>
          )}
        </div>

        {/* Generating indicator at bottom */}
        {isGenerating && (
          <div className="px-6 pb-4">
            <div className="h-0.5 rounded-full overflow-hidden" style={{ background: tokens.colors.paper.border }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.min(sections.length / 6 * 100, 95)}%`,
                  background: 'linear-gradient(90deg, #6366F1, #059669, #D97706)',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Individual section card
const SectionCard: React.FC<{ section: ParsedSection }> = ({ section }) => {
  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ borderColor: `${section.accent}20`, background: `${section.accent}04` }}
    >
      {/* Section header */}
      <div
        className="px-4 py-2.5 flex items-center gap-2 border-b"
        style={{ borderColor: `${section.accent}15`, background: `${section.accent}08` }}
      >
        <span className="text-base">{section.emoji}</span>
        <h3
          className="text-sm font-semibold uppercase tracking-wider"
          style={{ color: section.accent, fontFamily: tokens.fonts.sans }}
        >
          {section.title}
        </h3>
      </div>

      {/* Section body */}
      <div className="px-4 py-3 space-y-1">
        {section.lines.map((line, i) => (
          <LineRenderer key={i} line={line} accent={section.accent} sectionKey={section.key} />
        ))}
      </div>
    </div>
  );
};

// Individual line renderer
const LineRenderer: React.FC<{ line: ParsedLine; accent: string; sectionKey: string }> = ({ line, accent, sectionKey }) => {
  switch (line.type) {
    case 'empty':
      return <div className="h-2" />;

    case 'phase':
      return (
        <div className="mt-3 mb-1.5 pt-2 border-t" style={{ borderColor: `${accent}15` }}>
          <span className="text-sm font-semibold" style={{ color: accent, fontFamily: tokens.fonts.sans }}>
            {line.text}
          </span>
        </div>
      );

    case 'platform': {
      const platformColor = PLATFORM_COLORS[line.label || ''] || accent;
      return (
        <div className="mb-2">
          <span
            className="inline-block text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded mr-2"
            style={{ background: `${platformColor}15`, color: platformColor, fontFamily: tokens.fonts.sans }}
          >
            {line.label}
          </span>
          <span className="text-sm" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
            {line.value}
          </span>
        </div>
      );
    }

    case 'priority': {
      const colors = {
        high: { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B' },
        medium: { bg: '#FFFBEB', border: '#FDE68A', text: '#92400E' },
        low: { bg: '#F0FDF4', border: '#BBF7D0', text: '#166534' },
      };
      const c = colors[line.priorityLevel || 'medium'];
      return (
        <div className="text-sm font-medium py-0.5" style={{ color: c.text, fontFamily: tokens.fonts.sans }}>
          {line.text}
        </div>
      );
    }

    case 'numbered':
      return (
        <div className="flex items-start gap-2 py-0.5">
          <span
            className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
            style={{ background: accent }}
          >
            {line.number}
          </span>
          <span className="text-sm leading-relaxed" style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>
            {line.text}
          </span>
        </div>
      );

    case 'bullet':
      return (
        <div className="flex items-start gap-2 py-0.5 pl-2">
          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: accent }} />
          <span className="text-sm leading-relaxed" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
            {line.text}
          </span>
        </div>
      );

    case 'keyValue':
      return (
        <div className="flex items-baseline gap-2 py-0.5 pl-2">
          <span className="text-xs font-semibold uppercase tracking-wider flex-shrink-0" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
            {line.label}:
          </span>
          <span className="text-sm" style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>
            {line.value}
          </span>
        </div>
      );

    case 'text':
    default:
      return (
        <p className="text-sm leading-relaxed py-0.5" style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>
          {line.text}
        </p>
      );
  }
};

export default ContentArchitectSurface;
