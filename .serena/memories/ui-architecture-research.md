# Next.js UI Architecture & Routing Research

## 1. APP DIRECTORY STRUCTURE

### Route Groups Organization
```
app/
├── (auth)/                          # Public auth routes
│   ├── login/page.tsx              # Email/Google login
│   └── signup/page.tsx             # Email/Google signup
│
├── (dashboard)/                     # Protected routes (requires auth)
│   ├── layout.tsx                   # DashboardLayoutWrapper
│   └── dashboard/
│       ├── page.tsx                 # Dashboard home
│       ├── projects/
│       │   ├── page.tsx             # Projects list
│       │   ├── new/page.tsx         # New project selection
│       │   ├── new/[type]/page.tsx  # Service-specific new project
│       │   ├── new/content-architect/page.tsx
│       │   └── [id]/page.tsx        # Project detail view
│       ├── profiles/page.tsx        # Company profiles
│       ├── settings/page.tsx        # User settings
│       └── billing/page.tsx         # Billing/payments
│
├── layout.tsx                       # Root layout (NavBar, Footer, MainContent)
├── page.tsx                         # Home page with InkHomepage
├── about/page.tsx                   # About page
├── contact/page.tsx                 # Contact page
├── privacy/page.tsx                 # Privacy policy
├── terms/page.tsx                   # Terms of service
├── success/page.tsx                 # Success page (post-purchase)
└── test/page.tsx                    # Test/demo page
```

### Route Group Strategy
- `(auth)` - No special protection, public auth endpoints
- `(dashboard)` - Protected by middleware, requires authentication
- Root routes - Public landing pages, marketing content
- API routes in `app/api/` - Organized by feature

## 2. PUBLIC VS AUTHENTICATED PAGES SEPARATION

### Authentication Strategy: NextAuth v4 + Middleware

**Middleware Protection** (`middleware.ts`):
```typescript
- Protects /dashboard/* routes - requires valid token
- Protects /api/projects/* routes - requires auth
- Protects /api/user/* routes - requires auth
- Redirects unauthenticated dashboard access to /login
- Auth routes (login/signup) remain public
```

**Page Layer Authentication**:
- Login page (`app/(auth)/login/page.tsx`):
  - Google OAuth
  - Email magic link auth
  - Redirects authenticated users to dashboard
  - Uses `useSession()` to check auth state
  
- Signup page (`app/(auth)/signup/page.tsx`):
  - Similar auth flows as login
  - Shows benefits list (2 free projects, no credit card needed)
  - Redirects to dashboard on completion

**Protected Pages**:
- All `/dashboard/*` routes protected by DashboardLayoutWrapper
- Component-level auth checks with `useSession()`
- Redirect on auth status changes with `useRouter()`

## 3. THEME SYSTEM (INK-DIFFUSION)

### Multiple Theme Support

**Theme Context** (`contexts/ThemeContext.tsx`):
- Type: `'original' | 'premium-blend' | 'ink-diffusion'`
- Default: `'ink-diffusion'` (THEME_VERSION = '2')
- Stored in localStorage: `scribengine-theme`
- Applied to document: `document.documentElement.setAttribute('data-theme', theme)`
- CSS Variables in `globals.css` for theme values

**UI Mode Context** (`contexts/UIContext.tsx`):
- Type: `'classic' | 'ink-diffusion'`
- Default: `'ink-diffusion'` (UI_MODE_VERSION = '2')
- Controls dashboard UI variant (sidebar, colors, typography)
- Independent from page theme
- Stored in localStorage: `scribengine-ui-mode`

### Ink Diffusion Theme Components

**Design Tokens** (`components/themes/ink-diffusion/primitives/design-tokens.ts`):
- Color palette (burgundy #722F37, gold #D4AF37, cream #FAF7F2)
- Typography (serif: Playfair Display, sans: DM Sans)
- Spacing and sizing scales
- Border colors (#E8E2D6)

**Primitive Components**:
- `InkButton.tsx` - Styled button
- `InkCard.tsx` - Card container
- `InkInput.tsx` - Text input
- `InkTextarea.tsx` - Multi-line input
- `InkBadge.tsx` - Badge/tag
- `InkProgress.tsx` - Progress bar
- `InkStyleSelector.tsx` - Custom style selector

**Page Components** (in `pages/` subdirectory):
- `InkNewProject.tsx` - New project creation with step-by-step wizard
- `InkProjectDetail.tsx` - View/manage project
- `InkProjectsList.tsx` - Projects grid/list view
- `InkDashboardHome.tsx` - Dashboard overview
- `InkContentPreview.tsx` - Preview generated content
- `InkAnalytics.tsx` - Analytics dashboard
- `InkProfiles.tsx` - Company profiles management
- `InkSettings.tsx` - User settings
- `InkBilling.tsx` - Billing interface

**Generation Components** (real-time streaming display):
- `GenerationTheater.tsx` - Main generation display orchestrator
- `WritingSurface.tsx` - Streaming text output for blog posts
- `XSurface.tsx` - X/Twitter content display
- `LinkedInSurface.tsx` - LinkedIn content display
- `InstagramSurface.tsx` - Instagram content display
- `ContentArchitectSurface.tsx` - Content architect tool display
- `InkDrop.tsx` - Loading animation
- `StageIndicator.tsx` - Pipeline stage indicator
- `ProgressVisualization.tsx` - Generation progress

**Preview Components** (iPhone mockups):
- `XPreview.tsx` - Twitter post preview in phone frame
- `LinkedInPreview.tsx` - LinkedIn post preview
- `InstagramPreview.tsx` - Instagram preview
- `BlogArticleView.tsx` - Blog article view
- `ContentLaunchpad.tsx` - Content publishing interface

**Homepage Components** (marketing homepage sections):
- `InkHomepage.tsx` - Main homepage component
- `HeroSection.tsx` - Hero/banner section
- `HowItWorksSection.tsx` - Process/steps
- `StyleLearningSection.tsx` - Style learning feature
- `ServicesSection.tsx` - Services offered
- `PricingSection.tsx` - Pricing tiers
- `FAQSection.tsx` - FAQ accordion
- `AboutSection.tsx` - About company
- `TestimonialsSection.tsx` - Customer testimonials
- `CTASection.tsx` - Call-to-action
- `BlogPricingSection.tsx` - Blog-specific pricing
- `GenerationDemoSection.tsx` - Demo section

**Navigation Components**:
- `InkSidebar.tsx` - Desktop sidebar (replaces Classic Sidebar)
- Navigation items: Dashboard, Projects, New Project, Profiles, Billing, Settings

### CSS Theming (`globals.css`)

Variables set per theme via `[data-theme="..."]`:
```css
[data-theme="ink-diffusion"] {
  --theme-bg: #FAF7F2;              /* Cream background */
  --theme-accent: #722F37;          /* Burgundy primary */
  --theme-accent-secondary: #D4AF37; /* Gold accent */
  --theme-text-primary: #2C2C2C;    /* Dark charcoal */
}
```

Google Fonts imported:
- Playfair Display (serif, elegant)
- DM Sans (sans-serif, modern)
- Fraunces (serif, premium)
- Inter (sans-serif, readable)

## 4. PUBLIC-FACING PAGES (MARKETING)

### Landing Page (`app/page.tsx`)
- Renders `InkHomepage` when theme is `'ink-diffusion'`
- Components:
  - Hero section with CTA
  - Pricing tiers display
  - Services/packages grid (5 content types)
  - Blog post pricing table
  - How it works steps
  - Testimonials (hidden in BETA_MODE)
  - FAQ accordion
  - About company
  - Final CTA
- Features:
  - Session-aware buttons (logged in vs signup)
  - Service selection routing to new project flow
  - Smooth scrolling to sections

### Additional Public Pages
- `about/page.tsx` - About page
- `contact/page.tsx` - Contact form
- `privacy/page.tsx` - Privacy policy
- `terms/page.tsx` - Terms of service
- `success/page.tsx` - Post-purchase success message

### Navigation (`components/NavBar.tsx`)
- Hidden on `/dashboard/*` routes
- Theme-aware logo rendering
- Session state controls (login/signup or dashboard)
- User profile dropdown (when logged in)
- Mobile responsive with hamburger menu
- Links: Services, Pricing, How It Works, FAQ
- Theme switcher integrated

## 5. IMAGE HANDLING

### Current Implementation
- NO dedicated image upload components found in main codebase
- NO Cloudinary or S3 integration visible
- Image prompt enhancer found: `app/api/generate/image-prompt-enhancer.ts`
- Ideogram client found: `app/api/generate/ideogram-client.ts`
- User avatars from session: `session.user?.image` (Google OAuth profile picture)
- Static SVG icons throughout (inline SVG, no external image assets)
- No `<Image />` component usage from Next.js Image

### Images in Use
- Google profile pictures (via NextAuth)
- Inline SVG icons throughout UI
- Gradient backgrounds (CSS-based)
- User avatars from OAuth providers

### Potential Image Handling Pattern
- Image generation likely through Ideogram API
- Image prompts enhanced via ML
- No local image storage/uploads detected
- Could integrate S3/Cloudinary if image upload needed in future

## 6. COMPONENT LIBRARY

### UI Framework
- **Tailwind CSS v3.4.6**
  - Primary colors: Blue (#0ea5e9) and Magenta (#d946ef)
  - Extended with custom color palette
  - Animation utilities (gradient, float)
  - Responsive classes for mobile-first design

### Component Strategy
**NOT using shadcn/ui or pre-built component library**
- Custom primitive components built from scratch
- Two sets of primitives: Classic + Ink Diffusion
- Styled with Tailwind utilities + inline styles

### Tailwind Configuration
```javascript
// tailwind.config.js
colors: {
  primary: { 50-900 scale, base: #0ea5e9 }
  accent: { 50-900 scale, base: #d946ef }
}
animations: {
  gradient: 8s linear infinite
  float: 6s ease-in-out infinite
}
```

### Typography
**Fonts imported** (Google Fonts):
- Playfair Display (serif) - Headlines, elegant
- DM Sans (sans-serif) - Body text, modern
- Fraunces (serif) - Premium brand
- Inter (sans-serif) - Fallback

**Font usage**:
- Ink Diffusion: `font-family: tokens.fonts.serif` (Playfair)
- Classic: System fonts via CSS variables
- Dynamic switching via `useTheme()` context

### Icon Strategy
- Lucide React v0.411.0 (installed but not heavily used)
- Inline SVG icons predominant
- Custom SVG illustrations in components
- No external icon libraries in use

### State Management
- React Context (SessionProvider, ThemeProvider, UIProvider)
- NextAuth.js v4.24.13 for authentication
- localStorage for theme persistence
- Component-level state with `useState()`

### Key Libraries
- **nextauth**: Authentication
- **react**: UI framework
- **next**: Framework
- **framer-motion**: Animations
- **stripe**: Payments
- **@anthropic-ai/sdk**: Claude AI API
- **openai**: OpenAI API
- **resend**: Email service
- **zod**: Schema validation
- **uuid**: ID generation
- **prisma**: Database ORM

## 7. ROUTING PATTERNS

### API Routes Organization
```
app/api/
├── auth/[...nextauth]/route.ts      # NextAuth endpoint
├── checkout/route.ts                 # Stripe checkout
├── company-profiles/                 # CRUD for company profiles
├── generate/                         # Content generation
│   ├── route.ts                      # Generic generation
│   ├── linkedin/
│   │   ├── text-posts/route.ts
│   │   ├── carousels/route.ts
│   │   ├── articles/route.ts
│   │   └── polls/route.ts
│   ├── x/
│   │   ├── tweets/route.ts
│   │   ├── threads/route.ts
│   │   └── quote-tweets/route.ts
│   ├── instagram/route.ts
│   ├── content-architect/route.ts
│   ├── *-pipeline.ts files (backend processors)
│   └── *-options.ts files (configuration)
└── projects/route.ts                 # Project CRUD
```

### Middleware Configuration
```typescript
// matcher routes protected:
- /dashboard/:path*
- /api/projects/:path*
- /api/user/:path*
```

## 8. LAYOUT STRUCTURE

### Root Layout (`app/layout.tsx`)
```
<html>
  <body>
    <Providers>
      <NavBar />           # Public nav (hidden on dashboard)
      <MainContent>        # Wrapper
        {children}
      </MainContent>
      <Footer />           # Global footer
    </Providers>
  </body>
</html>
```

### Dashboard Layout (`app/(dashboard)/layout.tsx`)
```
<DashboardLayoutWrapper>
  {children}
</DashboardLayoutWrapper>
```

**DashboardLayoutWrapper** features:
- Mobile header with logo, UI toggle, hamburger
- Desktop sidebar (Classic or Ink mode)
- Mobile bottom nav menu
- Main content area
- Conditional styling based on UI mode

### Providers Setup (`components/Providers.tsx`)
1. SessionProvider (NextAuth)
2. ThemeProvider (page theme)
3. UIProvider (dashboard UI mode)

## 9. DESIGN PATTERNS

### Surface Components Pattern
- Real-time streaming display during generation
- Named pattern: `*Surface.tsx` for generation output
- Named pattern: `*Preview.tsx` for static previews in phone frames

### Pipeline Pattern
- Backend: `*-pipeline.ts` files for AI processing
- Routes: Standard API route handlers
- Options: `*-options.ts` for configurable parameters

### Form Pattern
- Multi-step wizards (NewProject uses step-based form)
- FormData interfaces for type safety
- Server submission, client-side state management

### Theme Switching
- Context-based theme management
- localStorage persistence
- Version tracking for resetting users
- CSS variables for dynamic styling

## Summary

This is a modern Next.js app with:
- App Router with route groups for organization
- Middleware-based authentication
- Theme system with Ink Diffusion as primary visual language
- Custom-built primitive components (no shadcn)
- Tailwind CSS for utility styling
- NextAuth for authentication (Google OAuth + email magic links)
- Multiple protected and public routes
- Real-time content generation streaming UI
- Mobile-responsive design throughout
- Context-based state management
- No centralized image storage (could be future enhancement)
