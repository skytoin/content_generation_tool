/**
 * INK DIFFUSION DESIGN SYSTEM
 *
 * A premium, editorial design language for Scribengine.
 *
 * Inspired by:
 * - Traditional printmaking and letterpress
 * - High-end stationery and paper goods
 * - Editorial magazine layouts
 * - Japanese wabi-sabi aesthetics
 *
 * Colors:
 * - Primary: Terracotta (#c75d3a) — warm, earthy, premium
 * - Secondary: Sage (#7d8c6e) — calm, natural, sophisticated
 * - Backgrounds: Warm cream, paper whites
 * - Typography: Fraunces (serif) + DM Sans (sans)
 *
 * PAGES INCLUDED:
 *
 * 1. Dashboard - Main overview with projects, stats, quick actions
 * 2. Generation Theater - Enhanced content generation experience
 * 3. Content Preview - Blog (Medium-style) & Instagram (phone frame)
 * 4. Pricing Configurator - Interactive step-by-step pricing
 * 5. Analytics - Advisor-style insights with recommendations
 * 6. Customization Flow - Stepped form with visual selectors
 *
 * PRIMITIVES:
 * - InkButton - Premium button with ink spread hover
 * - InkCard - Card with paper texture and accent options
 * - InkInput - Input with ink-style focus states
 * - InkProgress - Linear and step progress with ink bleed
 * - InkBadge - Status badges replacing emoji
 *
 * LAYOUT:
 * - Sidebar - Navigation with ink accent on active states
 *
 * DEMO:
 * Visit /demo/ink-diffusion-system to preview all pages
 */

// Design tokens
export * from './design-tokens';

// Primitives
export { InkButton } from './primitives/InkButton';
export { InkCard } from './primitives/InkCard';
export { InkInput } from './primitives/InkInput';
export { InkProgress } from './primitives/InkProgress';
export { InkBadge } from './primitives/InkBadge';

// Layout
export { Sidebar } from './layout/Sidebar';

// Pages
export { DashboardPage } from './pages/DashboardPage';
export { GenerationPage } from './pages/GenerationPage';
export { ContentPreviewPage } from './pages/ContentPreviewPage';
export { PricingConfiguratorPage } from './pages/PricingConfiguratorPage';
export { AnalyticsPage } from './pages/AnalyticsPage';
export { CustomizationFlowPage } from './pages/CustomizationFlowPage';

// Demo
export { ShowcasePage } from './ShowcasePage';
