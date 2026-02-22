/**
 * INK DIFFUSION THEME
 *
 * Complete Ink Diffusion UI theme for Scribengine.
 * Editorial Luxury design with sophisticated mechanics.
 */

// Design tokens
export { tokens, cssVariables } from './primitives/design-tokens'

// Primitives
export { InkButton } from './primitives/InkButton'
export { InkCard } from './primitives/InkCard'
export { InkInput } from './primitives/InkInput'
export { InkTextarea } from './primitives/InkTextarea'
export { InkProgress } from './primitives/InkProgress'
export { InkBadge } from './primitives/InkBadge'

// Generation components
export { GenerationTheater } from './generation/GenerationTheater'
export { InkDrop } from './generation/InkDrop'
export { StageIndicator } from './generation/StageIndicator'
export { WritingSurface } from './generation/WritingSurface'
export { ProgressVisualization } from './generation/ProgressVisualization'

// Hooks
export {
  useGenerationSimulation,
  BUDGET_STAGES,
  STANDARD_STAGES,
  PREMIUM_STAGES,
} from './hooks/useGenerationSimulation'

// Layout components
export { InkSidebar } from './InkSidebar'
export { InkDashboardHeader } from './InkDashboardHeader'

// Pages
export {
  InkDashboardHome,
  InkProjectsList,
  InkSettings,
  InkProfiles,
  InkBilling,
  InkNewProject,
  InkProjectDetail,
  // Unique Ink Diffusion pages (not in Classic UI)
  InkContentPreview,
  InkPricingConfigurator,
  InkAnalytics,
} from './pages'

// Homepage
export { InkHomepage } from './homepage'
export * from './homepage/icons/InkIcons'
