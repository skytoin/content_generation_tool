'use client';

/**
 * INK ANALYTICS PAGE
 *
 * Analytics that tell stories, not just show charts.
 * Advisor-style insights with actionable recommendations.
 *
 * COPIED EXACTLY FROM DEMO for visual consistency.
 */

import React from 'react';
import { tokens } from '../primitives/design-tokens';
import { InkCard } from '../primitives/InkCard';
import { InkButton } from '../primitives/InkButton';
import { InkBadge } from '../primitives/InkBadge';

// Sparkline component
const Sparkline = ({ data, color, height = 40 }: { data: number[]; color: string; height?: number }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Gradient fill */}
      <defs>
        <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} 100,${height}`}
        fill={`url(#gradient-${color.replace('#', '')})`}
      />
    </svg>
  );
};

// Insight card with advisor-style copy
const InsightCard = ({
  title,
  insight,
  metric,
  trend,
  sparkData,
  action,
  color = tokens.colors.ink[700],
}: {
  title: string;
  insight: string;
  metric: string;
  trend: { value: string; positive: boolean };
  sparkData: number[];
  action?: { label: string; onClick: () => void };
  color?: string;
}) => (
  <InkCard variant="elevated" padding="lg">
    <div className="flex items-start justify-between mb-4">
      <p
        className="text-xs uppercase tracking-[0.15em]"
        style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
      >
        {title}
      </p>
      <span
        className="text-xs font-medium px-2 py-1 rounded-full"
        style={{
          background: trend.positive ? tokens.colors.sage[50] : tokens.colors.ink[50],
          color: trend.positive ? tokens.colors.sage[700] : tokens.colors.ink[700],
          fontFamily: tokens.fonts.mono,
        }}
      >
        {trend.value}
      </span>
    </div>

    <div className="mb-4">
      <p
        className="text-3xl font-light mb-2"
        style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
      >
        {metric}
      </p>
      <Sparkline data={sparkData} color={color} />
    </div>

    <p
      className="text-base leading-relaxed mb-4"
      style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.serif }}
    >
      "{insight}"
    </p>

    {action && (
      <button
        onClick={action.onClick}
        className="text-sm font-medium flex items-center gap-2 transition-all hover:gap-3"
        style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
      >
        {action.label}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    )}
  </InkCard>
);

// Recommendation card
const RecommendationCard = ({
  title,
  description,
  impact,
  type,
}: {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  type: 'blog' | 'social' | 'email';
}) => (
  <div
    className="flex items-start gap-4 p-5 rounded-xl transition-all hover:scale-[1.01] cursor-pointer"
    style={{
      background: tokens.colors.paper.white,
      border: `1px solid ${tokens.colors.paper.border}`,
    }}
  >
    <div
      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
      style={{ background: tokens.colors.ink[50], color: tokens.colors.ink[700] }}
    >
      {type === 'blog' && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      )}
      {type === 'social' && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      )}
      {type === 'email' && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      )}
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <h4
          className="font-medium"
          style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
        >
          {title}
        </h4>
        <InkBadge
          variant={impact === 'high' ? 'ink' : impact === 'medium' ? 'sage' : 'subtle'}
          size="sm"
        >
          {impact} impact
        </InkBadge>
      </div>
      <p
        className="text-sm"
        style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
      >
        {description}
      </p>
    </div>

    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={tokens.colors.text.muted}
      strokeWidth="2"
      className="shrink-0"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  </div>
);

export const InkAnalytics: React.FC = () => {
  return (
    <div
      className="min-h-screen"
      style={{ background: tokens.colors.paper.cream }}
    >
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <header className="mb-12">
          <p
            className="text-xs uppercase tracking-[0.2em] mb-2"
            style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
          >
            Content Intelligence
          </p>
          <h1
            className="text-4xl font-light mb-2"
            style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
          >
            Your Content Advisor
          </h1>
          <p
            className="text-lg"
            style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.serif }}
          >
            Insights and recommendations to improve your content performance
          </p>
        </header>

        {/* Key Insights Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <InsightCard
            title="Engagement Pattern"
            insight="Your audience engages 40% more with question-based headlines. Consider framing your next piece as a question."
            metric="Tuesday, 2pm"
            trend={{ value: '+23%', positive: true }}
            sparkData={[30, 45, 35, 60, 55, 70, 65, 80, 75, 90]}
            color={tokens.colors.ink[700]}
            action={{ label: 'Create question-based content', onClick: () => {} }}
          />

          <InsightCard
            title="Content Length"
            insight="Your long-form pieces (2,500+ words) get 3x more shares than shorter content. Depth resonates with your audience."
            metric="2,847 avg words"
            trend={{ value: '+15%', positive: true }}
            sparkData={[1200, 1800, 2200, 2400, 2600, 2800, 2500, 2900, 2700, 2847]}
            color={tokens.colors.sage[500]}
            action={{ label: 'View top performing posts', onClick: () => {} }}
          />

          <InsightCard
            title="Style Analysis"
            insight="Your conversational tone is working. Posts with a personal voice see 2x engagement compared to formal writing."
            metric="94% quality score"
            trend={{ value: '+5%', positive: true }}
            sparkData={[82, 85, 88, 87, 90, 89, 91, 93, 92, 94]}
            color={tokens.colors.ink[500]}
          />
        </section>

        {/* Recommendations Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2
                className="text-2xl mb-1"
                style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
              >
                Recommended Actions
              </h2>
              <p
                className="text-sm"
                style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
              >
                Based on your performance data
              </p>
            </div>
            <InkButton variant="ghost" size="sm">View all</InkButton>
          </div>

          <div className="space-y-3">
            <RecommendationCard
              title="Create a LinkedIn thought leadership series"
              description="Your industry insights perform 3x better on LinkedIn. A weekly series could establish authority."
              impact="high"
              type="social"
            />
            <RecommendationCard
              title="Republish top blog as email sequence"
              description="Your 'Strategic Patience' post had 89% read-through. Convert it to a 3-part email course."
              impact="high"
              type="email"
            />
            <RecommendationCard
              title="Add more data-driven case studies"
              description="Posts with specific metrics get 45% more saves. Include more numbers in your next piece."
              impact="medium"
              type="blog"
            />
          </div>
        </section>

        {/* Performance Overview */}
        <section>
          <InkCard variant="flat" padding="xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { label: 'Total words generated', value: '47,293', sublabel: 'This month' },
                { label: 'Projects completed', value: '23', sublabel: 'Across all types' },
                { label: 'Average quality score', value: '94%', sublabel: 'Above target' },
                { label: 'Time saved', value: '~47 hrs', sublabel: 'vs. manual writing' },
              ].map((stat, i) => (
                <div key={i} className={i > 0 ? 'border-l border-gray-200 pl-8' : ''}>
                  <p
                    className="text-sm mb-2"
                    style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                  >
                    {stat.label}
                  </p>
                  <p
                    className="text-3xl font-light mb-1"
                    style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: tokens.colors.sage[600], fontFamily: tokens.fonts.sans }}
                  >
                    {stat.sublabel}
                  </p>
                </div>
              ))}
            </div>
          </InkCard>
        </section>
      </div>
    </div>
  );
};

export default InkAnalytics;
