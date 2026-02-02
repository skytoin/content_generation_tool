'use client';

/**
 * SERVICES SECTION - Ink Diffusion Homepage
 *
 * Editorial grid with numbered cards, no emojis.
 */

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { tokens } from '../../primitives/design-tokens';
import { QuillIcon, NetworkIcon, EnvelopeIcon, AnalyticsIcon, BundleIcon, ArrowRightIcon } from '../icons/InkIcons';

const services = [
  {
    number: '01',
    id: 'blog-post',
    title: 'Blog Posts',
    description: 'Long-form articles with SEO optimization, style matching, and multi-stage quality review.',
    price: 'From $3',
    Icon: QuillIcon,
    color: tokens.colors.ink[700],
    features: ['500 - 7,000 words', 'SEO optimized', 'Your voice, amplified'],
  },
  {
    number: '02',
    id: 'social-pack',
    title: 'Social Media Pack',
    description: '30 ready-to-post pieces across LinkedIn, Twitter, and Instagram with hashtag research.',
    price: 'From $12',
    Icon: NetworkIcon,
    color: '#E07A5F', // coral
    features: ['30 posts included', 'Platform-optimized', 'Hashtag strategy'],
  },
  {
    number: '03',
    id: 'email-sequence',
    title: 'Email Sequences',
    description: '5-email campaigns with personalization hooks, subject line variants, and CTA optimization.',
    price: 'From $15',
    Icon: EnvelopeIcon,
    color: '#83C5BE', // mint
    features: ['5-email sequence', 'A/B subject lines', 'Conversion focused'],
  },
  {
    number: '04',
    id: 'seo-report',
    title: 'SEO Content Audit',
    description: 'Comprehensive content strategy report with keyword analysis and topic suggestions.',
    price: 'From $20',
    Icon: AnalyticsIcon,
    color: tokens.colors.sage[500],
    features: ['Full site audit', 'Keyword opportunities', '10 topic suggestions'],
  },
  {
    number: '05',
    id: 'content-bundle',
    title: 'Monthly Bundle',
    description: 'Complete content package: 4 blog posts, 30 social posts, and 1 email sequence.',
    price: 'From $40',
    Icon: BundleIcon,
    color: '#C9A962', // gold
    features: ['4 blog posts', '30 social posts', '1 email sequence'],
    popular: true,
  },
];

export const ServicesSection: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleServiceClick = (serviceId: string) => {
    if (session) {
      router.push(`/dashboard/projects/new/${serviceId}`);
    } else {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/dashboard/projects/new/${serviceId}`)}`);
    }
  };

  return (
    <section id="services" className="py-20 sm:py-32 px-4 sm:px-8 scroll-mt-20" style={{ background: tokens.colors.paper.white }}>
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-12 lg:mb-20">
          <div className="lg:col-span-4">
            <p
              className="text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-3 sm:mb-4"
              style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
            >
              Our Services
            </p>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-light leading-tight"
              style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.primary }}
            >
              Content for
              <br />
              <em>every</em> channel
            </h2>
          </div>
          <div className="lg:col-span-8 flex items-end">
            <p
              className="text-lg sm:text-xl max-w-lg"
              style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.secondary }}
            >
              From long-form thought leadership to scroll-stopping social content,
              we craft words that work as hard as you do.
            </p>
          </div>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative p-6 sm:p-8 rounded-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
              style={{
                background: tokens.colors.paper.cream,
                border: `1px solid ${service.popular ? service.color : tokens.colors.paper.border}`,
              }}
              onClick={() => handleServiceClick(service.id)}
            >
              {/* Popular badge */}
              {service.popular && (
                <div
                  className="absolute -top-3 left-6 px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: service.color, color: '#fff' }}
                >
                  Most Popular
                </div>
              )}

              {/* Number */}
              <span
                className="text-6xl sm:text-8xl font-bold absolute -top-2 sm:-top-4 -left-1 sm:-left-2 opacity-10"
                style={{ fontFamily: tokens.fonts.serif, color: service.color }}
              >
                {service.number}
              </span>

              <div className="relative">
                {/* Icon and price */}
                <div className="flex items-start justify-between mb-4">
                  <service.Icon size={32} color={service.color} />
                  <p
                    className="text-sm font-medium"
                    style={{ color: service.color, fontFamily: tokens.fonts.mono }}
                  >
                    {service.price}
                  </p>
                </div>

                <h3
                  className="text-xl sm:text-2xl mb-3 sm:mb-4"
                  style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.primary }}
                >
                  {service.title}
                </h3>
                <p
                  className="text-sm mb-5 sm:mb-6 leading-relaxed"
                  style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                >
                  {service.description}
                </p>

                <ul className="space-y-2 mb-6 sm:mb-8">
                  {service.features.map((feature, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2 text-sm"
                      style={{ color: tokens.colors.text.secondary }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: service.color }}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className="text-sm font-medium flex items-center gap-2 transition-all group-hover:gap-3"
                  style={{ color: service.color }}
                >
                  Get started
                  <ArrowRightIcon size={16} color={service.color} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
