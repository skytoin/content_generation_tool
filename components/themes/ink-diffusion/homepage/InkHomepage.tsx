'use client';

/**
 * INK HOMEPAGE - Main Component
 *
 * Composes all sections into the complete Ink Diffusion homepage.
 * Displayed when theme === 'ink-diffusion'
 */

import React from 'react';
import { tokens } from '../primitives/design-tokens';
import { HeroSection } from './sections/HeroSection';
import { ServicesSection } from './sections/ServicesSection';
import { StyleLearningSection } from './sections/StyleLearningSection';
import { PricingSection } from './sections/PricingSection';
import { BlogPricingSection } from './sections/BlogPricingSection';
import { HowItWorksSection } from './sections/HowItWorksSection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { FAQSection } from './sections/FAQSection';
import { AboutSection } from './sections/AboutSection';
import { CTASection } from './sections/CTASection';

// Beta mode check
const IS_BETA_MODE = process.env.NEXT_PUBLIC_SITE_MODE === 'beta';

export const InkHomepage: React.FC = () => {
  return (
    <div style={{ background: tokens.colors.paper.cream }}>
      {/* Hero */}
      <HeroSection />

      {/* Style Learning - Key differentiator */}
      <StyleLearningSection />

      {/* Services */}
      <ServicesSection />

      {/* Quality Tiers / Pricing */}
      <PricingSection />

      {/* Blog Post Detailed Pricing */}
      <BlogPricingSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Testimonials - Hidden in beta mode */}
      {!IS_BETA_MODE && <TestimonialsSection />}

      {/* FAQ */}
      <FAQSection />

      {/* About */}
      <AboutSection />

      {/* Final CTA */}
      <CTASection />
    </div>
  );
};

export default InkHomepage;
