'use client';

/**
 * BLOG PRICING SECTION - Ink Diffusion Homepage
 *
 * Detailed pricing table for blog posts.
 */

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { tokens } from '../../primitives/design-tokens';
import { LENGTH_TIERS, QUALITY_TIERS } from '@/lib/pricing-config';

export const BlogPricingSection: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleGetStarted = () => {
    if (session) {
      router.push('/dashboard/projects/new/blog-post');
    } else {
      router.push('/login?callbackUrl=' + encodeURIComponent('/dashboard/projects/new/blog-post'));
    }
  };

  return (
    <section
      id="blog-pricing"
      className="py-20 sm:py-32 px-4 sm:px-8 scroll-mt-20"
      style={{ background: tokens.colors.paper.white }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <p
            className="text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-3 sm:mb-4"
            style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
          >
            Blog Post Pricing
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-light mb-4 sm:mb-6"
            style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.primary }}
          >
            Choose length and quality
          </h2>
          <p
            className="text-base sm:text-lg max-w-2xl mx-auto"
            style={{ color: tokens.colors.text.secondary }}
          >
            Longer content delivers more value for your readers.
            Higher quality tiers use more advanced AI models.
          </p>
        </div>

        {/* Pricing Table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: tokens.colors.paper.cream,
            border: `1px solid ${tokens.colors.paper.border}`,
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: tokens.colors.ink[50] }}>
                  <th
                    className="px-4 sm:px-6 py-4 text-left text-sm font-medium"
                    style={{ color: tokens.colors.text.primary }}
                  >
                    Length
                  </th>
                  <th
                    className="px-4 sm:px-6 py-4 text-center text-sm font-medium"
                    style={{ color: tokens.colors.text.primary }}
                  >
                    Words
                  </th>
                  <th
                    className="px-4 sm:px-6 py-4 text-center text-sm font-medium"
                    style={{ color: tokens.colors.sage[600] }}
                  >
                    Budget
                  </th>
                  <th
                    className="px-4 sm:px-6 py-4 text-center text-sm font-medium"
                    style={{ color: '#C9A962' }}
                  >
                    Standard
                  </th>
                  <th
                    className="px-4 sm:px-6 py-4 text-center text-sm font-medium"
                    style={{ color: tokens.colors.ink[700] }}
                  >
                    Premium
                  </th>
                </tr>
              </thead>
              <tbody>
                {LENGTH_TIERS.map((tier, index) => (
                  <tr
                    key={tier.id}
                    style={{
                      background: index % 2 === 0 ? tokens.colors.paper.white : tokens.colors.paper.cream,
                      borderTop: `1px solid ${tokens.colors.paper.border}`,
                    }}
                  >
                    <td
                      className="px-4 sm:px-6 py-4 font-medium text-sm"
                      style={{ color: tokens.colors.text.primary }}
                    >
                      {tier.name}
                    </td>
                    <td
                      className="px-4 sm:px-6 py-4 text-center text-sm"
                      style={{ color: tokens.colors.text.muted }}
                    >
                      {tier.wordRange}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <span
                        className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium"
                        style={{ background: tokens.colors.sage[100], color: tokens.colors.sage[700] }}
                      >
                        ${tier.prices.budget}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <span
                        className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium"
                        style={{ background: '#FDF8E8', color: '#8B7355' }}
                      >
                        ${tier.prices.standard}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <span
                        className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium"
                        style={{ background: tokens.colors.ink[50], color: tokens.colors.ink[700] }}
                      >
                        ${tier.prices.premium}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quality Tier Descriptions */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {QUALITY_TIERS.map((tier) => {
            const styleMap: Record<string, { bg: string; border: string; text: string }> = {
              budget: {
                bg: tokens.colors.sage[50],
                border: tokens.colors.sage[200],
                text: tokens.colors.sage[700],
              },
              standard: {
                bg: '#FDF8E8',
                border: '#E8DCC4',
                text: '#8B7355',
              },
              premium: {
                bg: tokens.colors.ink[50],
                border: tokens.colors.ink[200],
                text: tokens.colors.ink[700],
              },
            };
            const style = styleMap[tier.id];

            return (
              <div
                key={tier.id}
                className="rounded-xl p-4 sm:p-5"
                style={{ background: style.bg, border: `1px solid ${style.border}` }}
              >
                <h4
                  className="font-medium mb-2"
                  style={{ color: style.text }}
                >
                  {tier.name}
                </h4>
                <p
                  className="text-sm mb-3"
                  style={{ color: tokens.colors.text.muted }}
                >
                  {tier.description}
                </p>
                <ul className="space-y-1">
                  {tier.features.slice(0, 3).map((feature, i) => (
                    <li
                      key={i}
                      className="text-xs flex items-center gap-1"
                      style={{ color: tokens.colors.text.secondary }}
                    >
                      <span style={{ color: style.text }}>✓</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <button
            onClick={handleGetStarted}
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-medium transition-all hover:scale-105"
            style={{
              background: tokens.colors.ink[700],
              color: '#fff',
              boxShadow: `0 10px 30px ${tokens.colors.ink[700]}30`,
            }}
          >
            {session ? 'Create Blog Post' : 'Get Started'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogPricingSection;
