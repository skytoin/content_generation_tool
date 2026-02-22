'use client'

/**
 * INK NEW PROJECT - Complete Customization Flow
 *
 * Full-featured content creation wizard with ALL Classic UI options
 * styled in Ink Diffusion editorial luxury aesthetic.
 * Includes integrated Generation Theater for in-place generation.
 */

import { tokens } from '../primitives/design-tokens'
import { InkButton } from '../primitives/InkButton'
import { InkCard } from '../primitives/InkCard'
import { InkProgress } from '../primitives/InkProgress'
import { InkBadge } from '../primitives/InkBadge'
import { InkStyleSelector } from '../primitives/InkStyleSelector'
import { mapAnalysisToStyleRecommendations } from '@/lib/style-recommendations'
import { GenerationTheater } from '../generation/GenerationTheater'
import { useGenerationSimulation } from '../hooks/useGenerationSimulation'
import { useState, useEffect, Suspense, useCallback } from 'react'
import type { CompanyProfile } from './InkProfiles'
import { useRouter, useSearchParams } from 'next/navigation'
import { LENGTH_TIERS, type LengthTier, type QualityTier } from '@/lib/pricing-config'

// Content types
const contentTypes = [
  {
    id: 'content-architect',
    name: 'Content Architect',
    description: 'Strategic content planning with AI-powered recommendations',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 21h18M3 7v1a3 3 0 003 3h12a3 3 0 003-3V7M6 21V11M18 21V11M12 21V11M12 7V3M8 7l4-4 4 4" />
      </svg>
    ),
    isNew: true,
  },
  {
    id: 'blog-post',
    name: 'Long-Form Article',
    description: 'In-depth articles crafted for engagement and SEO',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    id: 'social-media',
    name: 'Social Collection',
    description: 'A curated set of posts across platforms',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
      </svg>
    ),
  },
  {
    id: 'email-sequence',
    name: 'Email Campaign',
    description: 'Conversion-focused email sequences',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21.5 12H16c-.7 2-2 3-4 3s-3.3-1-4-3H2.5" />
        <path d="M5.5 5.1L12 10l6.5-4.9M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
]

// Social platforms
const socialPlatforms = [
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Carousels, single posts, stories',
    features: ['Caption optimization', 'Hashtag strategy', 'AI images'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Professional B2B engagement',
    features: ['Text posts', 'Carousels', 'Articles', 'Polls'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    description: 'Tweets, threads, and quote tweets',
    features: ['Thread optimization', 'Viral hooks', 'Voice cloning'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
]

// X/Twitter content types
const xContentTypes = [
  { id: 'tweets', name: 'Tweet Pack', description: 'Multiple standalone tweets', recommended: true },
  { id: 'thread', name: 'Thread', description: '3x engagement of single tweets' },
  { id: 'quote-tweets', name: 'Quote Tweets', description: '2x engagement, relationship building' },
]

// Instagram content types
const instagramContentTypes = [
  { id: 'carousel', name: 'Carousel', description: '114% more engagement', recommended: true },
  { id: 'single_post', name: 'Single Post', description: 'One impactful image' },
  { id: 'reels_cover', name: 'Reels Cover', description: '9:16 vertical format' },
  { id: 'story', name: 'Story', description: 'Ephemeral content' },
]

// LinkedIn content types
const linkedinContentTypes = [
  { id: 'text-posts', name: 'Text Posts', description: 'Hook-driven posts for maximum reach', recommended: true },
  { id: 'carousel', name: 'Carousel', description: '2.5-3x more reach than text' },
  { id: 'article', name: 'Article', description: 'Long-form thought leadership' },
  { id: 'poll', name: 'Poll', description: 'Built-in engagement mechanics' },
]

// Instagram image options
const instagramImageStyles = [
  { id: 'photography', name: 'Photography' },
  { id: 'illustration', name: 'Illustration' },
  { id: 'minimalist', name: 'Minimalist' },
  { id: '3d_render', name: '3D Render' },
  { id: 'flat_design', name: 'Flat Design' },
]

const instagramImageMoods = [
  { id: 'professional', name: 'Professional' },
  { id: 'playful', name: 'Playful' },
  { id: 'elegant', name: 'Elegant' },
  { id: 'bold', name: 'Bold' },
  { id: 'calm', name: 'Calm' },
  { id: 'energetic', name: 'Energetic' },
]

const carouselImageCounts = [1, 3, 5, 7, 10]

// Content Architect options
const caIndustries = [
  { value: 'technology', label: 'Technology & SaaS' },
  { value: 'ecommerce', label: 'E-commerce & Retail' },
  { value: 'healthcare', label: 'Healthcare & Wellness' },
  { value: 'finance', label: 'Finance & Fintech' },
  { value: 'education', label: 'Education & Training' },
  { value: 'marketing', label: 'Marketing & Agency' },
  { value: 'professional_services', label: 'Professional Services' },
  { value: 'other', label: 'Other' },
]

const caGoals = [
  { value: 'brand_awareness', label: 'Brand Awareness' },
  { value: 'lead_generation', label: 'Lead Generation' },
  { value: 'sales', label: 'Direct Sales' },
  { value: 'thought_leadership', label: 'Thought Leadership' },
  { value: 'seo_traffic', label: 'SEO & Organic Traffic' },
  { value: 'community', label: 'Community Building' },
]

const caPlatforms = [
  { value: 'blog', label: 'Blog / Website', icon: '📝' },
  { value: 'instagram', label: 'Instagram', icon: '📸' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { value: 'twitter', label: 'Twitter / X', icon: '🐦' },
  { value: 'facebook', label: 'Facebook', icon: '👥' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'youtube', label: 'YouTube', icon: '🎬' },
]

// Quality tiers
const qualityTiers = [
  {
    id: 'budget',
    name: 'Swift',
    tagline: 'Fast & focused',
    description: 'GPT-4 powered, 4 research queries',
    features: ['Single AI pass', 'Quick turnaround', 'Core optimization'],
  },
  {
    id: 'standard',
    name: 'Refined',
    tagline: 'Depth & polish',
    description: 'GPT-4 + Claude Sonnet, 7 research queries',
    features: ['Multi-AI blend', 'Research-backed', 'Voice calibration'],
    recommended: true,
  },
  {
    id: 'premium',
    name: 'Masterwork',
    tagline: 'Uncompromising',
    description: 'Claude Opus 4.5, live web search',
    features: ['Best AI models', 'Expert depth', 'Publication ready'],
  },
]

// Service pricing
const servicePricing: Record<string, Record<string, number>> = {
  'social-media': { budget: 12, standard: 22, premium: 45 },
  'email-sequence': { budget: 15, standard: 28, premium: 55 },
  'content-architect': { budget: 19, standard: 35, premium: 65 },
}

interface WizardState {
  projectName: string
  contentType: string
  // Social media specific
  platform: string
  // Instagram specific
  instagramContentType: string
  generateImages: boolean
  numberOfImages: number
  imageStyle: string
  imageMood: string
  colorPreferences: string
  subjectsToInclude: string
  subjectsToAvoid: string
  additionalImageNotes: string
  // Reference images for style learning
  referenceImages: string[]
  referenceImageInstructions: string
  // X/Twitter specific
  xContentType: string
  tweetCount: number
  threadLength: number
  quoteTweetCount: number
  targetAccounts: string
  sampleTweets: string
  // LinkedIn specific
  linkedinContentType: string
  postCount: number
  carouselCount: number
  articleCount: number
  pollCount: number
  sampleLinkedInPosts: string
  // Content Architect specific
  caDescription: string
  caIndustry: string
  caCompanyName: string
  caGoals: string[]
  caPlatforms: string[]
  caIncludeImages: boolean
  caCompetitorUrls: string
  caAdditionalContext: string
  // Basic info
  industry: string
  topic: string
  company: string
  audience: string
  goals: string
  sampleArticles: string
  additionalInfo: string
  // Style
  styleSelections: Record<string, string>
  // Tiers
  qualityTier: QualityTier
  lengthTier: LengthTier
}

// View modes
type ViewMode = 'wizard' | 'generating' | 'complete'

function InkNewProjectWizard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedType = searchParams.get('type')
  const preselectedPlatform = searchParams.get('platform')
  const preselectedSubtype = searchParams.get('subtype')
  const preselectedTopic = searchParams.get('topic')
  const sourceProjectId = searchParams.get('source')

  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAdvancedStyles, setShowAdvancedStyles] = useState(false)

  // Generation Theater state
  const [viewMode, setViewMode] = useState<ViewMode>('wizard')
  const [projectId, setProjectId] = useState<string | null>(null)
  const [generatedContent, setGeneratedContent] = useState<string>('')
  const [sourceLoaded, setSourceLoaded] = useState(false)

  const [state, setState] = useState<WizardState>({
    projectName: '',
    contentType: preselectedType || '',
    platform: preselectedPlatform || '',
    instagramContentType: preselectedPlatform === 'instagram' && preselectedSubtype ? preselectedSubtype : 'carousel',
    generateImages: false,
    numberOfImages: 5,
    imageStyle: 'photography',
    imageMood: 'professional',
    colorPreferences: '',
    subjectsToInclude: '',
    subjectsToAvoid: '',
    additionalImageNotes: '',
    referenceImages: [],
    referenceImageInstructions: '',
    // X/Twitter defaults
    xContentType: preselectedPlatform === 'twitter' && preselectedSubtype ? preselectedSubtype : 'tweets',
    tweetCount: 7,
    threadLength: 5,
    quoteTweetCount: 10,
    targetAccounts: '',
    sampleTweets: '',
    // LinkedIn defaults
    linkedinContentType: preselectedPlatform === 'linkedin' && preselectedSubtype ? preselectedSubtype : 'text-posts',
    postCount: 5,
    carouselCount: 1,
    articleCount: 1,
    pollCount: 3,
    sampleLinkedInPosts: '',
    // Content Architect defaults
    caDescription: '',
    caIndustry: '',
    caCompanyName: '',
    caGoals: [],
    caPlatforms: [],
    caIncludeImages: true,
    caCompetitorUrls: '',
    caAdditionalContext: '',
    industry: '',
    topic: preselectedTopic || '',
    company: '',
    audience: '',
    goals: '',
    sampleArticles: '',
    additionalInfo: '',
    styleSelections: {},
    qualityTier: 'standard',
    lengthTier: 'standard',
  })

  // Company profile state
  const [profiles, setProfiles] = useState<CompanyProfile[]>([])
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null)
  const [profileFieldsApplied, setProfileFieldsApplied] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch('/api/company-profiles')
      .then(res => res.ok ? res.json() : [])
      .then((data: CompanyProfile[]) => {
        setProfiles(data)
        // Auto-select default profile
        const defaultProfile = data.find((p: CompanyProfile) => p.isDefault)
        if (defaultProfile) {
          applyProfile(defaultProfile)
        }
      })
      .catch(() => {})
  }, [])

  // Fetch source project data when launched from Content Launchpad
  useEffect(() => {
    if (!sourceProjectId) return

    fetch(`/api/projects/${sourceProjectId}`)
      .then(res => res.ok ? res.json() : null)
      .then(async (sourceProject) => {
        if (!sourceProject) return

        const sourceFormData = sourceProject.formData || {}
        const sd = sourceProject.structuredData as any

        const updates: Partial<WizardState> = {}

        // Pre-fill from source project's form data
        if (sourceFormData.companyName) updates.company = sourceFormData.companyName
        if (sourceFormData.company) updates.company = sourceFormData.company
        if (sourceFormData.industry) updates.industry = sourceFormData.industry
        if (sourceFormData.audience) updates.audience = sourceFormData.audience

        // Goals - join array to string
        if (Array.isArray(sourceFormData.goals)) {
          updates.goals = sourceFormData.goals.join(', ')
        } else if (sourceFormData.goals) {
          updates.goals = sourceFormData.goals
        }

        // If the source project has an associated company profile, load it for audience/samples
        if (sourceProject.companyProfileId) {
          try {
            const profileRes = await fetch(`/api/company-profiles/${sourceProject.companyProfileId}`)
            if (profileRes.ok) {
              const profile = await profileRes.json()
              if (profile.primaryAudience && !updates.audience) {
                updates.audience = profile.primaryAudience
              }
              if (profile.companyName && !updates.company) {
                updates.company = profile.companyName
              }
              if (profile.industry && !updates.industry) {
                updates.industry = profile.industry
              }
              if (profile.primaryGoals && !updates.goals) {
                updates.goals = profile.primaryGoals
              }
              if (profile.sampleContent) {
                updates.sampleArticles = profile.sampleContent
                updates.sampleTweets = profile.sampleContent
                updates.sampleLinkedInPosts = profile.sampleContent
              }
            }
          } catch {}
        }

        // Extract audience from structured data if not in formData or profile
        if (!updates.audience && sd?.analysis?.audienceProfile) {
          const ap = sd.analysis.audienceProfile
          updates.audience = ap.primary_demographic || ap.summary || ''
        }
        // Fallback: parse audience from report text for old projects without structuredData
        if (!updates.audience && sourceProject.result) {
          const text = sourceProject.result as string
          const demoMatch = text.match(/primary[_ ]demographic[:\s]*([^\n]+)/i)
          if (demoMatch) {
            updates.audience = demoMatch[1].trim()
          } else {
            const targetMatch = text.match(/targeting\s+([^\n.]+)/i)
            if (targetMatch) updates.audience = targetMatch[1].trim()
          }
        }

        // Extract industry from structured data if not in formData
        if (!updates.industry && sd?.analysis?.businessContext?.industry) {
          updates.industry = sd.analysis.businessContext.industry
        }

        // Add SEO keywords context to additionalInfo
        if (sd?.seoInsights?.topKeywords?.length) {
          const keywords = sd.seoInsights.topKeywords
            .slice(0, 8)
            .map((k: any) => typeof k === 'string' ? k : k?.keyword || '')
            .filter(Boolean)
          if (keywords.length > 0) {
            updates.additionalInfo = `Target SEO keywords: ${keywords.join(', ')}`
          }
        }
        // Fallback: parse keywords from report text for old projects without structuredData
        if (!updates.additionalInfo && sourceProject.result) {
          const text = sourceProject.result as string
          const kwSection = text.match(/Keyword Opportunities:\n([\s\S]*?)(?:\n\n|\nCompetitor|\nContent Gaps)/i)
          if (kwSection) {
            const kwLines = kwSection[1].match(/^\s+(.+?)\s+—\s+Volume:/gm)
            if (kwLines && kwLines.length > 0) {
              const parsed = kwLines
                .slice(0, 8)
                .map((line: string) => line.replace(/^\s+/, '').replace(/\s+—\s+Volume:.*/, '').trim())
                .filter(Boolean)
              if (parsed.length > 0) {
                updates.additionalInfo = `Target SEO keywords: ${parsed.join(', ')}`
              }
            }
          }
        }

        // Pre-fill style selections: use stored recommendations or compute on-the-fly
        if (sd?.styleRecommendations && typeof sd.styleRecommendations === 'object') {
          updates.styleSelections = { ...sd.styleRecommendations }
        } else if (sd?.analysis) {
          // Compute style recommendations on-the-fly from existing analysis data
          // (works for old projects that don't have styleRecommendations stored)
          const computed = mapAnalysisToStyleRecommendations(
            sd.analysis,
            sd.strategy,
            sd.seoInsights
          )
          if (Object.keys(computed).length > 0) {
            updates.styleSelections = computed
          }
        }

        // Auto-generate project name from platform + topic
        if (preselectedTopic) {
          const platformLabel =
            preselectedPlatform === 'twitter' ? 'X' :
            preselectedPlatform === 'linkedin' ? 'LinkedIn' :
            preselectedPlatform === 'instagram' ? 'Instagram' :
            preselectedType === 'blog-post' ? 'Blog' : ''
          if (platformLabel) {
            updates.projectName = `${platformLabel}: ${preselectedTopic}`
          }
        }

        setState(prev => ({ ...prev, ...updates }))
        setSourceLoaded(true)

        // Auto-advance to details step (skip type/platform selection)
        if (preselectedType && (preselectedType === 'blog-post' || preselectedPlatform)) {
          // Step 0 = type, Step 1 = platform (for social), Step 2+ = details
          // Find the details step index
          setCurrentStep(prev => {
            if (preselectedType === 'social-media' && preselectedPlatform) return 2
            if (preselectedType === 'blog-post') return 1
            return prev
          })
        }
      })
      .catch(() => {})
  }, [sourceProjectId])

  const applyProfile = (profile: CompanyProfile) => {
    setSelectedProfileId(profile.id)
    const applied = new Set<string>()
    const updates: Partial<WizardState> = {}

    if (profile.companyName) { updates.company = profile.companyName; updates.caCompanyName = profile.companyName; applied.add('company') }
    if (profile.primaryAudience) { updates.audience = profile.primaryAudience; applied.add('audience') }
    if (profile.primaryGoals) { updates.goals = profile.primaryGoals; applied.add('goals') }
    if (profile.sampleContent) { updates.sampleArticles = profile.sampleContent; applied.add('sampleArticles') }
    if (profile.brandGuidelines) { updates.additionalInfo = profile.brandGuidelines; applied.add('additionalInfo') }
    if (profile.sampleContent) { updates.sampleTweets = profile.sampleContent; applied.add('sampleTweets') }
    if (profile.sampleContent) { updates.sampleLinkedInPosts = profile.sampleContent; applied.add('sampleLinkedInPosts') }
    if (profile.industry) { updates.industry = profile.industry; applied.add('industry') }
    // Content Architect fields from profile
    if (profile.industry) { updates.caIndustry = profile.industry; applied.add('caIndustry') }
    if (profile.brandGuidelines) { updates.caAdditionalContext = profile.brandGuidelines; applied.add('caAdditionalContext') }

    setState(prev => ({ ...prev, ...updates }))
    setProfileFieldsApplied(applied)
  }

  const clearProfile = () => {
    setSelectedProfileId(null)
    const clearedFields: Partial<WizardState> = {}
    profileFieldsApplied.forEach(field => {
      if (field === 'company' || field === 'audience' || field === 'goals' || field === 'industry' || field === 'sampleArticles' || field === 'additionalInfo' || field === 'sampleTweets' || field === 'sampleLinkedInPosts' || field === 'caCompanyName' || field === 'caIndustry' || field === 'caAdditionalContext') {
        clearedFields[field as keyof WizardState] = '' as any
      }
    })
    setState(prev => ({ ...prev, ...clearedFields }))
    setProfileFieldsApplied(new Set())
  }

  const updateState = <K extends keyof WizardState>(key: K, value: WizardState[K]) => {
    setState({ ...state, [key]: value })
    // If user manually edits a profile-filled field, remove the "from profile" indicator
    if (profileFieldsApplied.has(key)) {
      setProfileFieldsApplied(prev => {
        const next = new Set(prev)
        next.delete(key)
        return next
      })
    }
  }

  // Generation simulation hook
  const generation = useGenerationSimulation({
    tier: state.qualityTier,
    onComplete: useCallback((content: string) => {
      setGeneratedContent(content)
      // Redirect to project detail after a brief moment
      if (projectId) {
        setTimeout(() => {
          router.push(`/dashboard/projects/${projectId}`)
        }, 2000)
      }
    }, [projectId, router]),
    onError: useCallback((err: string) => {
      setError(err)
      setViewMode('wizard')
    }, []),
  })

  const isSocialMedia = state.contentType === 'social-media'
  const isInstagram = isSocialMedia && state.platform === 'instagram'
  const isTwitter = isSocialMedia && state.platform === 'twitter'
  const isLinkedIn = isSocialMedia && state.platform === 'linkedin'
  const isBlogPost = state.contentType === 'blog-post'
  const isContentArchitect = state.contentType === 'content-architect'

  // Dynamic steps based on content type
  const getSteps = () => {
    const baseSteps = [
      { id: 'type', label: 'Type' },
    ]

    if (isSocialMedia) {
      baseSteps.push({ id: 'platform', label: 'Platform' })
    }

    baseSteps.push({ id: 'details', label: 'Details' })

    if (!isContentArchitect) {
      baseSteps.push({ id: 'style', label: 'Style' })
    }

    if (isInstagram) {
      baseSteps.push({ id: 'images', label: 'Images' })
    }

    if (isTwitter) {
      baseSteps.push({ id: 'x-options', label: 'Options' })
    }

    if (isLinkedIn) {
      baseSteps.push({ id: 'linkedin-options', label: 'Options' })
    }

    baseSteps.push({ id: 'quality', label: 'Quality' })

    return baseSteps
  }

  const steps = getSteps()

  const canProceed = () => {
    const stepId = steps[currentStep]?.id
    switch (stepId) {
      case 'type': return state.contentType && state.projectName.trim()
      case 'platform': return state.platform
      case 'details': return isContentArchitect
        ? state.caDescription.trim().length >= 10
        : state.topic.trim() && state.company.trim() && state.audience.trim()
      case 'style': return true
      case 'images': return true
      case 'x-options': return true
      case 'linkedin-options': return true
      case 'quality': return state.qualityTier
      default: return false
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1 && canProceed()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getCurrentPrice = (): number => {
    if (isBlogPost) {
      const lengthConfig = LENGTH_TIERS.find(t => t.id === state.lengthTier)
      return lengthConfig?.prices[state.qualityTier] ?? 0
    }
    return servicePricing[state.contentType]?.[state.qualityTier] ?? 0
  }

  // LinkedIn formatting functions
  const formatLinkedInTextPosts = (result: any): string => {
    const posts = result.posts || []
    let content = `\u{1F4BC} LINKEDIN TEXT POSTS\n\n`
    posts.forEach((post: any, i: number) => {
      content += `--- Post ${i + 1} ---\n`
      content += `${post.text}\n`
      content += `[${post.characterCount} chars | ${post.contentType}]\n`
      if (post.hashtags?.length > 0) {
        content += `Hashtags: ${post.hashtags.join(' ')}\n`
      }
      if (post.firstComment) {
        content += `First Comment: ${post.firstComment}\n`
      }
      content += `\n`
    })
    if (result.qualityReport) {
      content += `\n\u{1F4CA} QUALITY REPORT\n`
      content += `Score: ${result.qualityReport.overallScore}/10\n`
      content += `Algorithm: ${result.qualityReport.algorithmScore}/10\n`
    }
    return content
  }

  const formatLinkedInCarousels = (result: any): string => {
    const carousels = result.carousels || []
    let content = `\u{1F3A0} LINKEDIN CAROUSEL\n\n`
    carousels.forEach((carousel: any, i: number) => {
      content += `--- Carousel ${i + 1} ---\n`
      content += `Caption: ${carousel.caption}\n`
      content += `[${carousel.captionCharacterCount} chars]\n`
      if (carousel.slides?.length > 0) {
        carousel.slides.forEach((slide: any) => {
          content += `  Slide ${slide.slideNumber}: ${slide.headline}\n`
          content += `    ${slide.body}\n`
          if (slide.visualDirection) {
            content += `    Visual: ${slide.visualDirection}\n`
          }
        })
      }
      if (carousel.hashtags?.length > 0) {
        content += `Hashtags: ${carousel.hashtags.join(' ')}\n`
      }
      if (carousel.firstComment) {
        content += `First Comment: ${carousel.firstComment}\n`
      }
      content += `\n`
    })
    if (result.qualityReport) {
      content += `\n\u{1F4CA} QUALITY REPORT\n`
      content += `Score: ${result.qualityReport.overallScore}/10\n`
      content += `Algorithm: ${result.qualityReport.algorithmScore}/10\n`
    }
    return content
  }

  const formatLinkedInArticles = (result: any): string => {
    const articles = result.articles || []
    let content = `\u{1F4F0} LINKEDIN ARTICLE\n\n`
    articles.forEach((article: any, i: number) => {
      content += `--- Article ${i + 1} ---\n`
      content += `Title: ${article.title}\n`
      content += `Subtitle: ${article.subtitle}\n`
      content += `[${article.wordCount} words]\n\n`
      content += `${article.body}\n\n`
      if (article.companionPost) {
        content += `Companion Post: ${article.companionPost}\n`
      }
      if (article.companionPostFirstComment) {
        content += `First Comment: ${article.companionPostFirstComment}\n`
      }
      if (article.seoKeywords?.length > 0) {
        content += `SEO Keywords: ${article.seoKeywords.join(', ')}\n`
      }
      content += `\n`
    })
    if (result.qualityReport) {
      content += `\n\u{1F4CA} QUALITY REPORT\n`
      content += `Score: ${result.qualityReport.overallScore}/10\n`
      content += `Depth: ${result.qualityReport.depthScore}/10\n`
    }
    return content
  }

  const formatLinkedInPolls = (result: any): string => {
    const polls = result.polls || []
    let content = `\u{1F4CA} LINKEDIN POLLS\n\n`
    polls.forEach((poll: any, i: number) => {
      content += `--- Poll ${i + 1} ---\n`
      content += `Question: ${poll.question}\n`
      content += `[${poll.questionCharacterCount} chars]\n`
      if (poll.options?.length > 0) {
        poll.options.forEach((opt: string, j: number) => {
          content += `  Option ${j + 1}: ${opt}\n`
        })
      }
      if (poll.companionText) {
        content += `Companion Text: ${poll.companionText}\n`
      }
      if (poll.firstComment) {
        content += `First Comment: ${poll.firstComment}\n`
      }
      content += `[${poll.pollType}]\n\n`
    })
    if (result.qualityReport) {
      content += `\n\u{1F4CA} QUALITY REPORT\n`
      content += `Score: ${result.qualityReport.overallScore}/10\n`
      content += `Engagement: ${result.qualityReport.engagementPrediction}/10\n`
    }
    return content
  }

  const handleGenerate = async () => {
    if (!canProceed()) return

    setIsLoading(true)
    setError('')

    try {
      const effectiveServiceType = isContentArchitect ? 'content-architect' : isInstagram ? 'instagram' : isTwitter ? `x-${state.xContentType}` : isLinkedIn ? `linkedin-${state.linkedinContentType}` : state.contentType

      // Create project
      const projectFormData = isInstagram
        ? {
            topic: state.topic,
            company: state.company,
            audience: state.audience,
            goals: state.goals,
            sampleArticles: state.sampleArticles,
            platform: state.platform,
            contentType: state.instagramContentType,
            imageOptions: {
              generateImages: state.generateImages,
              numberOfImages: state.numberOfImages,
              style: state.imageStyle,
              mood: state.imageMood,
              colorPreferences: state.colorPreferences,
              subjectsToInclude: state.subjectsToInclude,
              subjectsToAvoid: state.subjectsToAvoid,
              additionalImageNotes: state.additionalImageNotes,
              referenceImages: state.referenceImages,
              referenceImageInstructions: state.referenceImageInstructions,
            },
          }
        : isTwitter
        ? {
            topic: state.topic,
            company: state.company,
            audience: state.audience,
            goals: state.goals,
            platform: state.platform,
            xContentType: state.xContentType,
            tweetCount: state.tweetCount,
            threadLength: state.threadLength,
            quoteTweetCount: state.quoteTweetCount,
            targetAccounts: state.targetAccounts,
            sampleTweets: state.sampleTweets,
          }
        : isLinkedIn
        ? {
            topic: state.topic,
            company: state.company,
            audience: state.audience,
            goals: state.goals,
            platform: state.platform,
            linkedinContentType: state.linkedinContentType,
            postCount: state.postCount,
            carouselCount: state.carouselCount,
            articleCount: state.articleCount,
            pollCount: state.pollCount,
            sampleLinkedInPosts: state.sampleLinkedInPosts,
          }
        : isContentArchitect
        ? {
            description: state.caDescription,
            industry: state.caIndustry,
            companyName: state.caCompanyName,
            goals: state.caGoals,
            platforms: state.caPlatforms,
            includeImages: state.caIncludeImages,
            competitorUrls: state.caCompetitorUrls,
            additionalContext: state.caAdditionalContext,
          }
        : {
            topic: state.topic,
            company: state.company,
            audience: state.audience,
            goals: state.goals,
            sampleArticles: state.sampleArticles,
          }

      const createRes = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: state.projectName,
          serviceType: effectiveServiceType,
          tier: state.qualityTier,
          lengthTier: isBlogPost ? state.lengthTier : 'standard',
          formData: projectFormData,
          styleSelections: state.styleSelections,
          additionalInfo: state.additionalInfo,
          companyProfileId: selectedProfileId || undefined,
        }),
      })

      const project = await createRes.json()

      if (!createRes.ok) {
        throw new Error(project.error || 'Failed to create project')
      }

      // Store project ID and switch to Generation Theater view
      setProjectId(project.id)
      setViewMode('generating')
      setIsLoading(false)

      // Update project status to processing
      await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'processing' }),
      })

      // Start generation with the appropriate API call
      generation.startGeneration(async () => {
        let result: any
        let mainContent = ''

        if (isInstagram) {
          // Use Instagram-specific API
          const generateRes = await fetch('/api/generate/instagram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tier: state.qualityTier,
              formData: {
                company: state.company,
                industry: state.industry || 'General',
                topic: state.topic,
                audience: state.audience,
                goals: state.goals,
                goal: state.goals,
                contentType: state.instagramContentType,
              },
              styleSelections: {
                ...state.styleSelections,
                post_format: state.instagramContentType,
              },
              imageOptions: {
                generateImages: state.generateImages,
                numberOfImages: state.numberOfImages,
                style: state.imageStyle,
                mood: state.imageMood,
                colorPreferences: state.colorPreferences ? state.colorPreferences.split(',').map(s => s.trim()) : [],
                subjectsToInclude: state.subjectsToInclude ? state.subjectsToInclude.split(',').map(s => s.trim()) : [],
                subjectsToAvoid: state.subjectsToAvoid ? state.subjectsToAvoid.split(',').map(s => s.trim()) : [],
                additionalImageNotes: state.additionalImageNotes,
                referenceImages: state.referenceImages,
                referenceImageInstructions: state.referenceImageInstructions,
              },
              additionalInfo: state.additionalInfo,
            }),
          })

          result = await generateRes.json()
          if (result.error) throw new Error(result.error)

          // Format Instagram result
          const caption = result.content?.caption || ''
          const hashtags = result.content?.hashtags?.join(' ') || ''
          const altText = result.content?.altText || ''
          const slides = result.content?.slides || []

          mainContent = `📸 INSTAGRAM CONTENT\n\n`
          mainContent += `📝 CAPTION:\n${caption}\n\n`
          mainContent += `#️⃣ HASHTAGS:\n${hashtags}\n\n`
          mainContent += `🔍 ALT TEXT:\n${altText}\n\n`

          if (slides.length > 0) {
            mainContent += `📑 CAROUSEL SLIDES:\n`
            slides.forEach((slide: any) => {
              mainContent += `\n--- Slide ${slide.slideNumber} ---\n`
              mainContent += `Headline: ${slide.headline}\n`
              mainContent += `Subtext: ${slide.subtext}\n`
              if (slide.visualDirection) {
                mainContent += `Visual: ${slide.visualDirection}\n`
              }
            })
          }

          // Store image URLs if present
          if (result.images?.length > 0) {
            mainContent += `\n<!-- IMAGE_DATA\n`
            result.images.forEach((img: any) => {
              mainContent += `Slide ${img.slideNumber}: ${img.imageUrl}\n`
            })
            mainContent += `-->\n`
          }
        } else if (isTwitter) {
          // Use X/Twitter-specific API
          const xApiEndpoint = state.xContentType === 'tweets'
            ? '/api/generate/x/tweets'
            : state.xContentType === 'thread'
            ? '/api/generate/x/threads'
            : '/api/generate/x/quote-tweets'

          const generateRes = await fetch(xApiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tier: state.qualityTier,
              formData: {
                company: state.company,
                industry: state.industry || 'General',
                topic: state.topic,
                audience: state.audience,
                goals: state.goals,
                tweetCount: state.tweetCount,
                threadLength: state.threadLength,
                quoteTweetCount: state.quoteTweetCount,
                targetAccounts: state.targetAccounts ? state.targetAccounts.split(',').map(s => s.trim()) : [],
                sampleTweets: state.sampleTweets,
              },
              styleSelections: {
                ...state.styleSelections,
                voice_learning: state.sampleTweets ? 'basic' : 'none',
              },
              additionalInfo: state.additionalInfo,
            }),
          })

          result = await generateRes.json()
          if (result.error) throw new Error(result.error)

          // Format X/Twitter result based on content type
          if (state.xContentType === 'tweets') {
            const tweets = result.tweets || []
            mainContent = `🐦 X TWEET PACK\n\n`
            tweets.forEach((tweet: any, i: number) => {
              mainContent += `--- Tweet ${i + 1} ---\n`
              mainContent += `${tweet.text}\n`
              mainContent += `[${tweet.characterCount} chars | ${tweet.contentType}]\n\n`
            })
            if (result.qualityReport) {
              mainContent += `\n📊 QUALITY REPORT\n`
              mainContent += `Score: ${result.qualityReport.overallScore}/10\n`
              mainContent += `Shadowban Risk: ${result.qualityReport.shadowbanRisk}\n`
            }
          } else if (state.xContentType === 'thread') {
            const thread = result.thread || []
            mainContent = `🧵 X THREAD\n\n`
            thread.forEach((tweet: any) => {
              mainContent += `--- ${tweet.position}/${thread.length} ---\n`
              mainContent += `${tweet.text}\n`
              mainContent += `[${tweet.characterCount} chars | ${tweet.purpose}]\n\n`
            })
            if (result.hookVariations?.length > 0) {
              mainContent += `\n🎣 HOOK VARIATIONS\n`
              result.hookVariations.forEach((hook: string, i: number) => {
                mainContent += `${i + 1}. ${hook}\n`
              })
            }
            if (result.qualityReport) {
              mainContent += `\n📊 QUALITY REPORT\n`
              mainContent += `Overall: ${result.qualityReport.overallScore}/10\n`
              mainContent += `Hook: ${result.qualityReport.hookScore}/10\n`
              mainContent += `Flow: ${result.qualityReport.flowScore}/10\n`
            }
          } else {
            // Quote tweets
            const quotes = result.quoteTweets || []
            mainContent = `💬 X QUOTE TWEETS\n\n`
            quotes.forEach((qt: any, i: number) => {
              mainContent += `--- Quote ${i + 1} ---\n`
              mainContent += `Target: ${qt.targetContext}\n`
              mainContent += `Response: ${qt.responseText}\n`
              mainContent += `[${qt.characterCount} chars | ${qt.quoteType}]\n\n`
            })
            if (result.qualityReport) {
              mainContent += `\n📊 QUALITY REPORT\n`
              mainContent += `Overall: ${result.qualityReport.overallScore}/10\n`
              mainContent += `Authenticity: ${result.qualityReport.authenticityScore}/10\n`
              mainContent += `Value Add: ${result.qualityReport.valueAddScore}/10\n`
            }
          }
        } else if (isLinkedIn) {
          // Use LinkedIn-specific API
          const linkedinApiEndpoint = state.linkedinContentType === 'text-posts'
            ? '/api/generate/linkedin/text-posts'
            : state.linkedinContentType === 'carousel'
            ? '/api/generate/linkedin/carousels'
            : state.linkedinContentType === 'article'
            ? '/api/generate/linkedin/articles'
            : '/api/generate/linkedin/polls'

          const generateRes = await fetch(linkedinApiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tier: state.qualityTier,
              formData: {
                company: state.company,
                industry: state.industry || 'General',
                topic: state.topic,
                audience: state.audience,
                goals: state.goals,
                postCount: state.postCount,
                carouselCount: state.carouselCount,
                articleCount: state.articleCount,
                pollCount: state.pollCount,
                sampleLinkedInPosts: state.sampleLinkedInPosts,
              },
              styleSelections: {
                ...state.styleSelections,
                voice_learning: state.sampleLinkedInPosts ? 'basic' : 'none',
              },
              additionalInfo: state.additionalInfo,
            }),
          })

          result = await generateRes.json()
          if (result.error) throw new Error(result.error)

          // Format LinkedIn result based on content type
          if (state.linkedinContentType === 'text-posts') {
            mainContent = formatLinkedInTextPosts(result)
          } else if (state.linkedinContentType === 'carousel') {
            mainContent = formatLinkedInCarousels(result)
          } else if (state.linkedinContentType === 'article') {
            mainContent = formatLinkedInArticles(result)
          } else {
            mainContent = formatLinkedInPolls(result)
          }
        } else if (isContentArchitect) {
          // Use Content Architect API
          const generateRes = await fetch('/api/generate/content-architect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              description: state.caDescription,
              tier: state.qualityTier,
              businessInfo: {
                industry: state.caIndustry,
                companyName: state.caCompanyName,
              },
              goals: state.caGoals,
              platforms: state.caPlatforms,
              includeImages: state.caIncludeImages,
              competitorUrls: state.caCompetitorUrls
                .split('\n')
                .map(url => url.trim())
                .filter(url => url),
              additionalContext: state.caAdditionalContext,
            }),
          })

          result = await generateRes.json()
          if (result.error) throw new Error(result.error)

          mainContent = result.formattedOutput || ''
          // Store structured data for Content Launchpad
          if (result.data) {
            (result as any)._structuredData = result.data
          }
        } else {
          // Use standard generate API
          const generateRes = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              serviceId: effectiveServiceType,
              formData: projectFormData,
              styleSelections: state.styleSelections,
              additionalInfo: state.additionalInfo,
              tier: state.qualityTier,
              lengthTier: isBlogPost ? state.lengthTier : 'standard',
            }),
          })

          result = await generateRes.json()
          if (result.error) throw new Error(result.error)

          // Parse content
          const content = result.content || ''
          const reportStart = content.indexOf('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
          mainContent = reportStart > 0 ? content.substring(0, reportStart).trim() : content
        }

        // Update project with result
        await fetch(`/api/projects/${project.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'completed',
            result: mainContent,
            wordCount: mainContent.split(/\s+/).length,
            completedAt: new Date().toISOString(),
            ...((result as any)._structuredData && { structuredData: (result as any)._structuredData }),
          }),
        })

        return mainContent
      })
    } catch (err: any) {
      setError(err.message || 'Failed to create project')
      setIsLoading(false)
      setViewMode('wizard')
    }
  }

  const stepId = steps[currentStep]?.id

  // Show Generation Theater when generating
  if (viewMode === 'generating') {
    return (
      <GenerationTheater
        stages={generation.stages}
        currentStageIndex={generation.currentStageIndex}
        streamedText={generation.streamedText}
        isGenerating={generation.isGenerating}
        progress={generation.progress}
        title={state.projectName}
        contentType={isContentArchitect ? 'content-architect' : isInstagram ? 'instagram' : isTwitter ? 'twitter' : isLinkedIn ? 'linkedin' : isBlogPost ? 'blog' : 'social'}
        error={generation.error}
        onCancel={() => {
          generation.cancelGeneration()
          setViewMode('wizard')
        }}
      />
    )
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: tokens.colors.paper.cream }}
    >
      {/* Ink wash background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, ${tokens.colors.ink[400]} 0%, transparent 50%),
                       radial-gradient(ellipse at 70% 80%, ${tokens.colors.sage[400]} 0%, transparent 50%)`,
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Header */}
        <header className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{ background: tokens.colors.paper.warm, border: `1px solid ${tokens.colors.paper.border}` }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: tokens.colors.ink[500] }} />
            <span
              className="text-xs uppercase tracking-[0.2em]"
              style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
            >
              New Creation
            </span>
          </div>
          <h1
            className="text-4xl font-light mb-2"
            style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
          >
            {stepId === 'type' && 'What shall we create?'}
            {stepId === 'platform' && 'Choose your platform'}
            {stepId === 'details' && (isContentArchitect ? 'Describe your strategy needs' : 'Tell us about your content')}
            {stepId === 'style' && 'Define your voice'}
            {stepId === 'images' && 'Visual direction'}
            {stepId === 'x-options' && 'Configure your X content'}
            {stepId === 'linkedin-options' && 'Configure your LinkedIn content'}
            {stepId === 'quality' && 'Choose your tier'}
          </h1>
        </header>

        {/* Progress */}
        <div className="mb-10">
          <InkProgress
            value={(currentStep / (steps.length - 1)) * 100}
            variant="steps"
            steps={steps.map(s => s.label)}
            currentStep={currentStep}
          />
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-6 p-4 rounded-xl"
            style={{ background: tokens.colors.ink[50], border: `1px solid ${tokens.colors.ink[200]}` }}
          >
            <p style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}>{error}</p>
          </div>
        )}

        {/* Step Content */}
        <InkCard variant="elevated" padding="xl">
          {/* STEP: Content Type */}
          {stepId === 'type' && (
            <div className="space-y-6">
              <div>
                <label
                  className="block text-sm font-medium mb-3"
                  style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}
                >
                  Project Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Q1 Marketing Campaign"
                  value={state.projectName}
                  onChange={(e) => updateState('projectName', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all text-lg"
                  style={{
                    background: tokens.colors.paper.warm,
                    border: `2px solid ${state.projectName ? tokens.colors.ink[200] : tokens.colors.paper.border}`,
                    fontFamily: tokens.fonts.serif,
                    color: tokens.colors.text.primary,
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-4"
                  style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}
                >
                  Content Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contentTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => updateState('contentType', type.id)}
                      className="relative text-left p-5 rounded-xl transition-all"
                      style={{
                        background: state.contentType === type.id ? tokens.colors.paper.white : tokens.colors.paper.warm,
                        border: `2px solid ${state.contentType === type.id ? tokens.colors.ink[700] : 'transparent'}`,
                        boxShadow: state.contentType === type.id ? tokens.shadows.lg : 'none',
                      }}
                    >
                      {type.isNew && (
                        <span
                          className="absolute -top-2 -right-2 px-2 py-1 text-xs font-medium rounded-full"
                          style={{ background: tokens.colors.ink[700], color: '#fff', fontFamily: tokens.fonts.sans }}
                        >
                          New
                        </span>
                      )}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                        style={{
                          background: state.contentType === type.id ? tokens.colors.ink[50] : tokens.colors.paper.white,
                          color: state.contentType === type.id ? tokens.colors.ink[700] : tokens.colors.text.muted,
                        }}
                      >
                        {type.icon}
                      </div>
                      <h3 className="font-medium mb-1" style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>
                        {type.name}
                      </h3>
                      <p className="text-sm" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
                        {type.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP: Platform Selection */}
          {stepId === 'platform' && (
            <div className="space-y-6">
              <p className="text-sm" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
                Select your social media platform
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {socialPlatforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => updateState('platform', platform.id)}
                    className="relative text-left p-5 rounded-xl transition-all"
                    style={{
                      background: state.platform === platform.id ? tokens.colors.paper.white : tokens.colors.paper.warm,
                      border: `2px solid ${state.platform === platform.id ? tokens.colors.ink[700] : 'transparent'}`,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                      style={{
                        background: state.platform === platform.id ? tokens.colors.ink[50] : tokens.colors.paper.white,
                        color: state.platform === platform.id ? tokens.colors.ink[700] : tokens.colors.text.muted,
                      }}
                    >
                      {platform.icon}
                    </div>
                    <h3 className="font-medium mb-1" style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>
                      {platform.name}
                    </h3>
                    <p className="text-sm mb-2" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
                      {platform.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {platform.features.map((f, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: tokens.colors.paper.white, color: tokens.colors.text.muted }}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>

              {/* Instagram content type */}
              {state.platform === 'instagram' && (
                <div className="pt-6 border-t" style={{ borderColor: tokens.colors.paper.border }}>
                  <label className="block text-sm font-medium mb-3" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                    Content Format
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {instagramContentTypes.map((ct) => (
                      <button
                        key={ct.id}
                        onClick={() => updateState('instagramContentType', ct.id)}
                        className="relative p-4 rounded-xl text-center transition-all"
                        style={{
                          background: state.instagramContentType === ct.id ? tokens.colors.paper.white : tokens.colors.paper.warm,
                          border: `2px solid ${state.instagramContentType === ct.id ? tokens.colors.ink[700] : 'transparent'}`,
                        }}
                      >
                        {ct.recommended && (
                          <span
                            className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-xs font-medium rounded-full"
                            style={{ background: tokens.colors.sage[500], color: '#fff' }}
                          >
                            Best
                          </span>
                        )}
                        <h4 className="font-medium text-sm" style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>
                          {ct.name}
                        </h4>
                        <p className="text-xs mt-1" style={{ color: tokens.colors.text.muted }}>{ct.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* X/Twitter content type */}
              {state.platform === 'twitter' && (
                <div className="pt-6 border-t" style={{ borderColor: tokens.colors.paper.border }}>
                  <label className="block text-sm font-medium mb-3" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                    Content Type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {xContentTypes.map((ct) => (
                      <button
                        key={ct.id}
                        onClick={() => updateState('xContentType', ct.id)}
                        className="relative p-4 rounded-xl text-center transition-all"
                        style={{
                          background: state.xContentType === ct.id ? tokens.colors.paper.white : tokens.colors.paper.warm,
                          border: `2px solid ${state.xContentType === ct.id ? tokens.colors.ink[700] : 'transparent'}`,
                        }}
                      >
                        {ct.recommended && (
                          <span
                            className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-xs font-medium rounded-full"
                            style={{ background: tokens.colors.sage[500], color: '#fff' }}
                          >
                            Best
                          </span>
                        )}
                        <h4 className="font-medium text-sm" style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>
                          {ct.name}
                        </h4>
                        <p className="text-xs mt-1" style={{ color: tokens.colors.text.muted }}>{ct.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* LinkedIn content type */}
              {state.platform === 'linkedin' && (
                <div className="pt-6 border-t" style={{ borderColor: tokens.colors.paper.border }}>
                  <label className="block text-sm font-medium mb-3" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                    Content Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {linkedinContentTypes.map((ct) => (
                      <button
                        key={ct.id}
                        onClick={() => updateState('linkedinContentType', ct.id)}
                        className="relative p-4 rounded-xl text-center transition-all"
                        style={{
                          background: state.linkedinContentType === ct.id ? tokens.colors.paper.white : tokens.colors.paper.warm,
                          border: `2px solid ${state.linkedinContentType === ct.id ? tokens.colors.ink[700] : 'transparent'}`,
                        }}
                      >
                        {ct.recommended && (
                          <span
                            className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-xs font-medium rounded-full"
                            style={{ background: tokens.colors.sage[500], color: '#fff' }}
                          >
                            Best
                          </span>
                        )}
                        <h4 className="font-medium text-sm" style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>
                          {ct.name}
                        </h4>
                        <p className="text-xs mt-1" style={{ color: tokens.colors.text.muted }}>{ct.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP: Details */}
          {stepId === 'details' && (
            <div className="space-y-6">
              {/* Pre-filled from Strategy banner */}
              {sourceLoaded && sourceProjectId && (
                <div
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                  style={{
                    background: tokens.colors.sage[50],
                    border: `1px solid ${tokens.colors.sage[200]}`,
                    color: tokens.colors.sage[900],
                    fontFamily: tokens.fonts.sans,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                  <span>
                    <strong>Pre-filled from your strategy report.</strong> Feel free to edit any field below.
                  </span>
                </div>
              )}

              {/* Profile Selector Pills */}
              {profiles.length > 0 && (
                <div>
                  <label
                    className="block text-sm font-medium mb-3"
                    style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}
                  >
                    Company Profile
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={clearProfile}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm transition-all"
                      style={{
                        background: !selectedProfileId ? tokens.colors.ink[700] : tokens.colors.paper.warm,
                        color: !selectedProfileId ? '#fff' : tokens.colors.text.secondary,
                        border: `1px solid ${!selectedProfileId ? tokens.colors.ink[700] : tokens.colors.paper.border}`,
                        fontFamily: tokens.fonts.sans,
                      }}
                    >
                      Start Fresh
                    </button>
                    {profiles.map((profile) => (
                      <button
                        key={profile.id}
                        onClick={() => applyProfile(profile)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm transition-all"
                        style={{
                          background: selectedProfileId === profile.id ? tokens.colors.ink[700] : tokens.colors.paper.warm,
                          color: selectedProfileId === profile.id ? '#fff' : tokens.colors.text.secondary,
                          border: `1px solid ${selectedProfileId === profile.id ? tokens.colors.ink[700] : tokens.colors.paper.border}`,
                          fontFamily: tokens.fonts.sans,
                        }}
                      >
                        {profile.isDefault && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        )}
                        {selectedProfileId === profile.id && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                        {profile.companyName}
                      </button>
                    ))}
                    <a
                      href="/dashboard/profiles"
                      className="flex items-center gap-1 px-3 py-2 rounded-full text-sm transition-all"
                      style={{
                        background: 'transparent',
                        color: tokens.colors.text.subtle,
                        border: `1px dashed ${tokens.colors.paper.border}`,
                        fontFamily: tokens.fonts.sans,
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 4v16m8-8H4" />
                      </svg>
                      New
                    </a>
                  </div>
                  {selectedProfileId && (
                    <p className="text-xs mt-2" style={{ color: tokens.colors.sage[600], fontFamily: tokens.fonts.sans }}>
                      Fields auto-filled from profile. Edit any field to override.
                    </p>
                  )}
                </div>
              )}

              {isContentArchitect ? (
                <>
                  {/* Content Architect form */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                      Describe Your Content Needs <span style={{ color: tokens.colors.ink[500] }}>*</span>
                    </label>
                    <textarea
                      value={state.caDescription}
                      onChange={(e) => updateState('caDescription', e.target.value)}
                      placeholder="Tell us about your business, what you're trying to achieve, and what kind of content you need. The more detail you provide, the better recommendations you'll receive."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                      style={{ background: tokens.colors.paper.warm, border: `1px solid ${tokens.colors.paper.border}`, fontFamily: tokens.fonts.sans, color: tokens.colors.text.primary }}
                    />
                    <p className="text-xs mt-2" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
                      Minimum 10 characters. Example: &quot;We&apos;re a B2B SaaS startup in the HR tech space. We want to establish thought leadership and generate leads.&quot;
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                        Company Name
                        {profileFieldsApplied.has('company') && (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: tokens.colors.sage[50], color: tokens.colors.sage[700] }}>From profile</span>
                        )}
                      </label>
                      <input
                        type="text"
                        placeholder="Your company name"
                        value={state.caCompanyName}
                        onChange={(e) => updateState('caCompanyName', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl outline-none"
                        style={{ background: tokens.colors.paper.warm, border: `1px solid ${tokens.colors.paper.border}`, fontFamily: tokens.fonts.sans, color: tokens.colors.text.primary }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                        Industry
                        {profileFieldsApplied.has('caIndustry') && (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: tokens.colors.sage[50], color: tokens.colors.sage[700] }}>From profile</span>
                        )}
                      </label>
                      <select
                        value={state.caIndustry}
                        onChange={(e) => updateState('caIndustry', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl outline-none"
                        style={{ background: tokens.colors.paper.warm, border: `1px solid ${tokens.colors.paper.border}`, fontFamily: tokens.fonts.sans, color: tokens.colors.text.primary }}
                      >
                        <option value="">Select industry...</option>
                        {caIndustries.map((ind) => (
                          <option key={ind.value} value={ind.value}>{ind.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Goals multi-select */}
                  <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                      Content Goals
                    </label>
                    <p className="text-xs mb-3" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
                      Select all that apply
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {caGoals.map((goal) => (
                        <button
                          key={goal.value}
                          onClick={() => {
                            const current = state.caGoals
                            updateState('caGoals', current.includes(goal.value)
                              ? current.filter(g => g !== goal.value)
                              : [...current, goal.value]
                            )
                          }}
                          className="px-4 py-2 rounded-full transition-all text-sm"
                          style={{
                            background: state.caGoals.includes(goal.value) ? tokens.colors.ink[700] : tokens.colors.paper.warm,
                            color: state.caGoals.includes(goal.value) ? '#fff' : tokens.colors.text.primary,
                            border: `1px solid ${state.caGoals.includes(goal.value) ? tokens.colors.ink[700] : tokens.colors.paper.border}`,
                            fontFamily: tokens.fonts.sans,
                          }}
                        >
                          {goal.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Platforms multi-select */}
                  <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                      Target Platforms
                    </label>
                    <p className="text-xs mb-3" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
                      Where do you want to publish content?
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {caPlatforms.map((platform) => (
                        <button
                          key={platform.value}
                          onClick={() => {
                            const current = state.caPlatforms
                            updateState('caPlatforms', current.includes(platform.value)
                              ? current.filter(p => p !== platform.value)
                              : [...current, platform.value]
                            )
                          }}
                          className="p-3 rounded-xl transition-all flex items-center gap-2 text-sm"
                          style={{
                            background: state.caPlatforms.includes(platform.value) ? tokens.colors.ink[700] : tokens.colors.paper.warm,
                            color: state.caPlatforms.includes(platform.value) ? '#fff' : tokens.colors.text.primary,
                            border: `1px solid ${state.caPlatforms.includes(platform.value) ? tokens.colors.ink[700] : tokens.colors.paper.border}`,
                            fontFamily: tokens.fonts.sans,
                          }}
                        >
                          <span>{platform.icon}</span>
                          <span>{platform.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Include Images toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: tokens.colors.paper.warm }}>
                    <div>
                      <p className="font-medium" style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>
                        Include Image Recommendations
                      </p>
                      <p className="text-sm" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
                        Get suggestions for AI image generation
                      </p>
                    </div>
                    <button
                      onClick={() => updateState('caIncludeImages', !state.caIncludeImages)}
                      className="relative w-12 h-6 rounded-full transition-colors"
                      style={{ background: state.caIncludeImages ? tokens.colors.ink[700] : tokens.colors.paper.border }}
                    >
                      <span
                        className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
                        style={{ left: state.caIncludeImages ? '26px' : '4px' }}
                      />
                    </button>
                  </div>

                  {/* Competitor URLs */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                      Competitor URLs (optional)
                    </label>
                    <textarea
                      value={state.caCompetitorUrls}
                      onChange={(e) => updateState('caCompetitorUrls', e.target.value)}
                      placeholder="Enter competitor websites (one per line) for competitive analysis"
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                      style={{ background: tokens.colors.paper.warm, border: `1px solid ${tokens.colors.paper.border}`, fontFamily: tokens.fonts.sans, color: tokens.colors.text.primary }}
                    />
                  </div>

                  {/* Additional Context */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                      Additional Context (optional)
                    </label>
                    <textarea
                      value={state.caAdditionalContext}
                      onChange={(e) => updateState('caAdditionalContext', e.target.value)}
                      placeholder="Any other information that might help us provide better recommendations..."
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                      style={{ background: tokens.colors.paper.warm, border: `1px solid ${tokens.colors.paper.border}`, fontFamily: tokens.fonts.sans, color: tokens.colors.text.primary }}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Standard form fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                        Topic / Title <span style={{ color: tokens.colors.ink[500] }}>*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., The Future of Remote Work"
                        value={state.topic}
                        onChange={(e) => updateState('topic', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl outline-none"
                        style={{ background: tokens.colors.paper.warm, border: `1px solid ${tokens.colors.paper.border}`, fontFamily: tokens.fonts.sans, color: tokens.colors.text.primary }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                        Company / Brand <span style={{ color: tokens.colors.ink[500] }}>*</span>
                        {profileFieldsApplied.has('company') && (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: tokens.colors.sage[50], color: tokens.colors.sage[700] }}>From profile</span>
                        )}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Acme Corporation"
                        value={state.company}
                        onChange={(e) => updateState('company', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl outline-none"
                        style={{ background: tokens.colors.paper.warm, border: `1px solid ${tokens.colors.paper.border}`, fontFamily: tokens.fonts.sans, color: tokens.colors.text.primary }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                        Target Audience <span style={{ color: tokens.colors.ink[500] }}>*</span>
                        {profileFieldsApplied.has('audience') && (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: tokens.colors.sage[50], color: tokens.colors.sage[700] }}>From profile</span>
                        )}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Marketing managers aged 30-45"
                        value={state.audience}
                        onChange={(e) => updateState('audience', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl outline-none"
                        style={{ background: tokens.colors.paper.warm, border: `1px solid ${tokens.colors.paper.border}`, fontFamily: tokens.fonts.sans, color: tokens.colors.text.primary }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                        Goals (optional)
                        {profileFieldsApplied.has('goals') && (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: tokens.colors.sage[50], color: tokens.colors.sage[700] }}>From profile</span>
                        )}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Generate leads for trial signups"
                        value={state.goals}
                        onChange={(e) => updateState('goals', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl outline-none"
                        style={{ background: tokens.colors.paper.warm, border: `1px solid ${tokens.colors.paper.border}`, fontFamily: tokens.fonts.sans, color: tokens.colors.text.primary }}
                      />
                    </div>
                  </div>

                  {/* Sample articles */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                      Sample Articles for Style Matching (optional)
                    </label>
                    <div
                      className="p-3 rounded-lg mb-2"
                      style={{ background: tokens.colors.sage[50], border: `1px solid ${tokens.colors.sage[200]}` }}
                    >
                      <p className="text-xs" style={{ color: tokens.colors.sage[700], fontFamily: tokens.fonts.sans }}>
                        We analyze: tone, formality, sentence patterns, vocabulary
                      </p>
                    </div>
                    <textarea
                      placeholder="Paste 1-5 sample articles to match your voice..."
                      value={state.sampleArticles}
                      onChange={(e) => updateState('sampleArticles', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                      style={{ background: tokens.colors.paper.warm, border: `1px solid ${tokens.colors.paper.border}`, fontFamily: tokens.fonts.sans, color: tokens.colors.text.primary }}
                    />
                  </div>

                  {/* Additional info */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                      Additional Information (optional)
                    </label>
                    <textarea
                      placeholder="Links, facts, requirements, special requests..."
                      value={state.additionalInfo}
                      onChange={(e) => updateState('additionalInfo', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                      style={{ background: tokens.colors.paper.warm, border: `1px solid ${tokens.colors.paper.border}`, fontFamily: tokens.fonts.sans, color: tokens.colors.text.primary }}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP: Style */}
          {stepId === 'style' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
                  Customize style options or let AI infer from your samples
                </p>
                <button
                  onClick={() => setShowAdvancedStyles(!showAdvancedStyles)}
                  className="text-sm flex items-center gap-2"
                  style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4" />
                  </svg>
                  {showAdvancedStyles ? 'Hide' : 'Show'} advanced options
                </button>
              </div>

              {(showAdvancedStyles || Object.keys(state.styleSelections).length > 0) ? (
                <InkStyleSelector
                  selections={state.styleSelections}
                  onChange={(selections) => updateState('styleSelections', selections)}
                />
              ) : (
                <div
                  className="p-6 rounded-xl text-center"
                  style={{ background: tokens.colors.paper.warm }}
                >
                  <p className="text-sm mb-2" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
                    AI will automatically infer the best style based on your content details and samples
                  </p>
                  <p className="text-xs" style={{ color: tokens.colors.text.subtle }}>
                    Click "Show advanced options" to manually customize 30+ style parameters
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP: Images (Instagram) */}
          {stepId === 'images' && (
            <div className="space-y-6">
              {/* Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: tokens.colors.paper.warm }}>
                <div>
                  <p className="font-medium" style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>
                    Generate AI Images
                  </p>
                  <p className="text-sm" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
                    Create custom images for each slide/post
                  </p>
                </div>
                <button
                  onClick={() => updateState('generateImages', !state.generateImages)}
                  className="relative w-12 h-6 rounded-full transition-colors"
                  style={{ background: state.generateImages ? tokens.colors.ink[700] : tokens.colors.paper.border }}
                >
                  <span
                    className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
                    style={{ left: state.generateImages ? '26px' : '4px' }}
                  />
                </button>
              </div>

              {state.generateImages && (
                <div className="space-y-5 pt-4 border-t" style={{ borderColor: tokens.colors.paper.border }}>
                  {/* Number of images */}
                  {state.instagramContentType === 'carousel' && (
                    <div>
                      <label className="block text-sm font-medium mb-3" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                        Number of Images
                      </label>
                      <div className="flex gap-2">
                        {carouselImageCounts.map((count) => (
                          <button
                            key={count}
                            onClick={() => updateState('numberOfImages', count)}
                            className="flex-1 py-3 rounded-xl text-center transition-all"
                            style={{
                              background: state.numberOfImages === count ? tokens.colors.ink[700] : tokens.colors.paper.warm,
                              color: state.numberOfImages === count ? '#fff' : tokens.colors.text.primary,
                              fontFamily: tokens.fonts.sans,
                            }}
                          >
                            {count}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Style */}
                  <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                      Image Style
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {instagramImageStyles.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => updateState('imageStyle', style.id)}
                          className="px-4 py-2 rounded-lg transition-all"
                          style={{
                            background: state.imageStyle === style.id ? tokens.colors.ink[700] : tokens.colors.paper.warm,
                            color: state.imageStyle === style.id ? '#fff' : tokens.colors.text.primary,
                            fontFamily: tokens.fonts.sans,
                          }}
                        >
                          {style.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mood */}
                  <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                      Image Mood
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {instagramImageMoods.map((mood) => (
                        <button
                          key={mood.id}
                          onClick={() => updateState('imageMood', mood.id)}
                          className="px-4 py-2 rounded-lg transition-all"
                          style={{
                            background: state.imageMood === mood.id ? tokens.colors.ink[700] : tokens.colors.paper.warm,
                            color: state.imageMood === mood.id ? '#fff' : tokens.colors.text.primary,
                            fontFamily: tokens.fonts.sans,
                          }}
                        >
                          {mood.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colors & Subjects */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                        Color Preferences
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., blue, white, gold"
                        value={state.colorPreferences}
                        onChange={(e) => updateState('colorPreferences', e.target.value)}
                        className="w-full px-4 py-2 rounded-xl outline-none"
                        style={{ background: tokens.colors.paper.warm, border: `1px solid ${tokens.colors.paper.border}`, fontFamily: tokens.fonts.sans }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                        Subjects to Include
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., laptops, office, coffee"
                        value={state.subjectsToInclude}
                        onChange={(e) => updateState('subjectsToInclude', e.target.value)}
                        className="w-full px-4 py-2 rounded-xl outline-none"
                        style={{ background: tokens.colors.paper.warm, border: `1px solid ${tokens.colors.paper.border}`, fontFamily: tokens.fonts.sans }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                      Subjects to Avoid
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., faces, text, logos"
                      value={state.subjectsToAvoid}
                      onChange={(e) => updateState('subjectsToAvoid', e.target.value)}
                      className="w-full px-4 py-2 rounded-xl outline-none"
                      style={{ background: tokens.colors.paper.warm, border: `1px solid ${tokens.colors.paper.border}`, fontFamily: tokens.fonts.sans }}
                    />
                  </div>

                  {/* Reference Images Section */}
                  <div className="pt-5 mt-5 border-t" style={{ borderColor: tokens.colors.paper.border }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: tokens.colors.sage[50] }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={tokens.colors.sage[600]} strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>
                          Reference Images
                        </p>
                        <p className="text-xs" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
                          Upload images for style guidance or image-to-image generation
                        </p>
                      </div>
                    </div>

                    <div
                      className="p-4 rounded-xl mb-4"
                      style={{ background: tokens.colors.ink[50], border: `1px solid ${tokens.colors.ink[100]}` }}
                    >
                      <p className="text-sm mb-2" style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.sans }}>
                        How reference images can be used:
                      </p>
                      <ul className="text-xs space-y-1" style={{ color: tokens.colors.ink[600], fontFamily: tokens.fonts.sans }}>
                        <li>• Style matching - AI creates images with similar aesthetic</li>
                        <li>• Color palette extraction - Match colors from your images</li>
                        <li>• Composition reference - Guide layout and framing</li>
                        <li>• Brand consistency - Maintain visual identity</li>
                      </ul>
                    </div>

                    {/* File Upload */}
                    <div className="mb-4">
                      <label
                        className="block w-full p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-solid"
                        style={{
                          borderColor: tokens.colors.paper.border,
                          background: tokens.colors.paper.warm,
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={async (e) => {
                            const files = e.target.files
                            if (!files) return
                            const base64Images: string[] = []
                            for (const file of Array.from(files)) {
                              const reader = new FileReader()
                              const base64 = await new Promise<string>((resolve) => {
                                reader.onload = () => resolve(reader.result as string)
                                reader.readAsDataURL(file)
                              })
                              base64Images.push(base64)
                            }
                            updateState('referenceImages', [...state.referenceImages, ...base64Images])
                          }}
                        />
                        <div className="text-center">
                          <svg
                            className="mx-auto mb-2"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={tokens.colors.text.muted}
                            strokeWidth="1.5"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                          </svg>
                          <p className="text-sm font-medium" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                            Click to upload or drag images here
                          </p>
                          <p className="text-xs mt-1" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
                            PNG, JPG up to 10MB each
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Preview uploaded images */}
                    {state.referenceImages.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm mb-2" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                          {state.referenceImages.length} image{state.referenceImages.length > 1 ? 's' : ''} uploaded
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {state.referenceImages.map((img, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={img}
                                alt={`Reference ${idx + 1}`}
                                className="w-20 h-20 object-cover rounded-xl"
                                style={{ border: `2px solid ${tokens.colors.paper.border}` }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newImages = [...state.referenceImages]
                                  newImages.splice(idx, 1)
                                  updateState('referenceImages', newImages)
                                }}
                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ background: tokens.colors.ink[700], color: '#fff' }}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Instructions for how to use reference images */}
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                        How should AI use these images?
                      </label>
                      <textarea
                        value={state.referenceImageInstructions}
                        onChange={(e) => updateState('referenceImageInstructions', e.target.value)}
                        placeholder="e.g., Match the color palette and minimalist style. Use similar lighting and composition. The images show our brand aesthetic - maintain this visual identity..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                        style={{
                          background: state.referenceImages.length > 0 ? tokens.colors.paper.warm : tokens.colors.paper.cream,
                          border: `1px solid ${tokens.colors.paper.border}`,
                          fontFamily: tokens.fonts.sans,
                          color: tokens.colors.text.primary,
                          opacity: state.referenceImages.length > 0 ? 1 : 0.5,
                        }}
                        disabled={state.referenceImages.length === 0}
                      />
                      {state.referenceImages.length === 0 && (
                        <p className="text-xs mt-1" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
                          Upload images first to provide instructions
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP: X/Twitter Options */}
          {stepId === 'x-options' && (
            <div className="space-y-6">
              {/* Tweet Pack options */}
              {state.xContentType === 'tweets' && (
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                    Number of Tweets
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[7, 14, 30, 60].map((count) => (
                      <button
                        key={count}
                        onClick={() => updateState('tweetCount', count)}
                        className="px-6 py-3 rounded-xl text-center transition-all"
                        style={{
                          background: state.tweetCount === count ? tokens.colors.ink[700] : tokens.colors.paper.warm,
                          color: state.tweetCount === count ? '#fff' : tokens.colors.text.primary,
                          fontFamily: tokens.fonts.sans,
                        }}
                      >
                        {count} tweets
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Thread options */}
              {state.xContentType === 'thread' && (
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                    Thread Length
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 4, label: 'Mini (3-4)', hint: 'Quick insights' },
                      { value: 7, label: 'Standard (5-7)', hint: 'Most popular' },
                      { value: 10, label: 'Deep (8-10)', hint: 'In-depth topic' },
                      { value: 15, label: 'Ultimate (11-15)', hint: 'Comprehensive guide' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => updateState('threadLength', opt.value)}
                        className="relative px-5 py-3 rounded-xl text-center transition-all"
                        style={{
                          background: state.threadLength === opt.value ? tokens.colors.ink[700] : tokens.colors.paper.warm,
                          color: state.threadLength === opt.value ? '#fff' : tokens.colors.text.primary,
                          fontFamily: tokens.fonts.sans,
                        }}
                      >
                        {opt.value === 7 && (
                          <span
                            className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-xs font-medium rounded-full"
                            style={{ background: tokens.colors.sage[500], color: '#fff' }}
                          >
                            Best
                          </span>
                        )}
                        <div className="font-medium">{opt.label}</div>
                        <div className="text-xs opacity-70">{opt.hint}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quote Tweet options */}
              {state.xContentType === 'quote-tweets' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                      Number of Quote Tweets
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[10, 20, 30].map((count) => (
                        <button
                          key={count}
                          onClick={() => updateState('quoteTweetCount', count)}
                          className="px-6 py-3 rounded-xl text-center transition-all"
                          style={{
                            background: state.quoteTweetCount === count ? tokens.colors.ink[700] : tokens.colors.paper.warm,
                            color: state.quoteTweetCount === count ? '#fff' : tokens.colors.text.primary,
                            fontFamily: tokens.fonts.sans,
                          }}
                        >
                          {count} quotes
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                      Target Accounts (optional)
                    </label>
                    <p className="text-xs mb-2" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
                      Accounts you want to engage with. AI will create strategic responses.
                    </p>
                    <input
                      type="text"
                      placeholder="e.g., @paulg, @naval, @sama"
                      value={state.targetAccounts}
                      onChange={(e) => updateState('targetAccounts', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl outline-none"
                      style={{ background: tokens.colors.paper.warm, border: `1px solid ${tokens.colors.paper.border}`, fontFamily: tokens.fonts.sans, color: tokens.colors.text.primary }}
                    />
                  </div>
                </div>
              )}

              {/* Voice Learning Section */}
              <div className="pt-6 border-t" style={{ borderColor: tokens.colors.paper.border }}>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: tokens.colors.ink[50] }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={tokens.colors.ink[600]} strokeWidth="1.5">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="22" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>
                      Voice Learning
                    </p>
                    <p className="text-xs" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
                      Paste your best tweets so AI can match your voice
                    </p>
                  </div>
                </div>

                <div
                  className="p-4 rounded-xl mb-4"
                  style={{ background: tokens.colors.sage[50], border: `1px solid ${tokens.colors.sage[100]}` }}
                >
                  <p className="text-sm mb-2" style={{ color: tokens.colors.sage[700], fontFamily: tokens.fonts.sans }}>
                    For best results, include 5-20 of your top-performing tweets:
                  </p>
                  <ul className="text-xs space-y-1" style={{ color: tokens.colors.sage[600], fontFamily: tokens.fonts.sans }}>
                    <li>• Your most engaging/viral tweets</li>
                    <li>• Tweets that got lots of replies</li>
                    <li>• Examples of your signature style</li>
                  </ul>
                </div>

                <textarea
                  value={state.sampleTweets}
                  onChange={(e) => updateState('sampleTweets', e.target.value)}
                  placeholder="Paste your sample tweets here, one per line or separated by blank lines..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                  style={{
                    background: tokens.colors.paper.warm,
                    border: `1px solid ${tokens.colors.paper.border}`,
                    fontFamily: tokens.fonts.sans,
                    color: tokens.colors.text.primary,
                  }}
                />
              </div>
            </div>
          )}

          {/* STEP: LinkedIn Options */}
          {stepId === 'linkedin-options' && (
            <div className="space-y-6">
              {/* Text Posts options */}
              {state.linkedinContentType === 'text-posts' && (
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                    Number of Posts
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[5, 10, 15, 30].map((count) => (
                      <button
                        key={count}
                        onClick={() => updateState('postCount', count)}
                        className="px-6 py-3 rounded-xl text-center transition-all"
                        style={{
                          background: state.postCount === count ? tokens.colors.ink[700] : tokens.colors.paper.warm,
                          color: state.postCount === count ? '#fff' : tokens.colors.text.primary,
                          fontFamily: tokens.fonts.sans,
                        }}
                      >
                        {count} posts
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Carousel options */}
              {state.linkedinContentType === 'carousel' && (
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                    Number of Carousels
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 5].map((count) => (
                      <button
                        key={count}
                        onClick={() => updateState('carouselCount', count)}
                        className="px-6 py-3 rounded-xl text-center transition-all"
                        style={{
                          background: state.carouselCount === count ? tokens.colors.ink[700] : tokens.colors.paper.warm,
                          color: state.carouselCount === count ? '#fff' : tokens.colors.text.primary,
                          fontFamily: tokens.fonts.sans,
                        }}
                      >
                        {count} {count === 1 ? 'carousel' : 'carousels'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Article options */}
              {state.linkedinContentType === 'article' && (
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                    Number of Articles
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3].map((count) => (
                      <button
                        key={count}
                        onClick={() => updateState('articleCount', count)}
                        className="px-6 py-3 rounded-xl text-center transition-all"
                        style={{
                          background: state.articleCount === count ? tokens.colors.ink[700] : tokens.colors.paper.warm,
                          color: state.articleCount === count ? '#fff' : tokens.colors.text.primary,
                          fontFamily: tokens.fonts.sans,
                        }}
                      >
                        {count} {count === 1 ? 'article' : 'articles'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Poll options */}
              {state.linkedinContentType === 'poll' && (
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                    Number of Polls
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[3, 5, 10].map((count) => (
                      <button
                        key={count}
                        onClick={() => updateState('pollCount', count)}
                        className="px-6 py-3 rounded-xl text-center transition-all"
                        style={{
                          background: state.pollCount === count ? tokens.colors.ink[700] : tokens.colors.paper.warm,
                          color: state.pollCount === count ? '#fff' : tokens.colors.text.primary,
                          fontFamily: tokens.fonts.sans,
                        }}
                      >
                        {count} polls
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Voice Learning Section */}
              <div className="pt-6 border-t" style={{ borderColor: tokens.colors.paper.border }}>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: '#E8F0FE' }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A66C2" strokeWidth="1.5">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="22" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>
                      Voice Learning
                    </p>
                    <p className="text-xs" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
                      Paste your best LinkedIn posts so AI can match your voice
                    </p>
                  </div>
                </div>

                <div
                  className="p-4 rounded-xl mb-4"
                  style={{ background: tokens.colors.sage[50], border: `1px solid ${tokens.colors.sage[100]}` }}
                >
                  <p className="text-sm mb-2" style={{ color: tokens.colors.sage[700], fontFamily: tokens.fonts.sans }}>
                    For best results, include 5-20 of your top-performing posts:
                  </p>
                  <ul className="text-xs space-y-1" style={{ color: tokens.colors.sage[600], fontFamily: tokens.fonts.sans }}>
                    <li>• Posts with high engagement (comments, reactions)</li>
                    <li>• Content that reflects your professional voice</li>
                    <li>• Examples of your signature style</li>
                  </ul>
                </div>

                <textarea
                  value={state.sampleLinkedInPosts}
                  onChange={(e) => updateState('sampleLinkedInPosts', e.target.value)}
                  placeholder="Paste your sample LinkedIn posts here, one per section separated by blank lines..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                  style={{
                    background: tokens.colors.paper.warm,
                    border: `1px solid ${tokens.colors.paper.border}`,
                    fontFamily: tokens.fonts.sans,
                    color: tokens.colors.text.primary,
                  }}
                />
              </div>
            </div>
          )}

          {/* STEP: Quality */}
          {stepId === 'quality' && (
            <div className="space-y-6">
              {/* Length tier for blog posts */}
              {isBlogPost && (
                <div className="mb-8">
                  <label className="block text-sm font-medium mb-3" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                    Article Length
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {LENGTH_TIERS.map((tier) => (
                      <button
                        key={tier.id}
                        onClick={() => updateState('lengthTier', tier.id)}
                        className="relative p-3 rounded-xl text-center transition-all"
                        style={{
                          background: state.lengthTier === tier.id ? tokens.colors.paper.white : tokens.colors.paper.warm,
                          border: `2px solid ${state.lengthTier === tier.id ? tokens.colors.ink[700] : 'transparent'}`,
                        }}
                      >
                        {tier.id === 'standard' && (
                          <span
                            className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-xs font-medium rounded-full"
                            style={{ background: tokens.colors.sage[500], color: '#fff' }}
                          >
                            Popular
                          </span>
                        )}
                        <h4 className="font-medium text-sm" style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>
                          {tier.name}
                        </h4>
                        <p className="text-xs mt-1" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.mono }}>
                          {tier.wordRange}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quality tiers */}
              <div>
                <label className="block text-sm font-medium mb-4" style={{ color: tokens.colors.text.secondary, fontFamily: tokens.fonts.sans }}>
                  Quality Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {qualityTiers.map((tier) => {
                    const price = isBlogPost
                      ? LENGTH_TIERS.find(t => t.id === state.lengthTier)?.prices[tier.id as QualityTier] ?? 0
                      : servicePricing[state.contentType]?.[tier.id] ?? 0

                    return (
                      <button
                        key={tier.id}
                        onClick={() => updateState('qualityTier', tier.id as QualityTier)}
                        className="relative text-left p-5 rounded-xl transition-all"
                        style={{
                          background: state.qualityTier === tier.id ? tokens.colors.paper.white : tokens.colors.paper.warm,
                          border: `2px solid ${state.qualityTier === tier.id ? tokens.colors.ink[700] : 'transparent'}`,
                          boxShadow: state.qualityTier === tier.id ? tokens.shadows.lg : 'none',
                        }}
                      >
                        {tier.recommended && (
                          <span
                            className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap"
                            style={{ background: tokens.colors.ink[700], color: '#fff', fontFamily: tokens.fonts.sans }}
                          >
                            Recommended
                          </span>
                        )}
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium" style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}>
                            {tier.name}
                          </h4>
                          <span
                            className="text-xl font-light"
                            style={{ color: tokens.colors.ink[700], fontFamily: tokens.fonts.serif }}
                          >
                            ${price}
                          </span>
                        </div>
                        <p className="text-xs mb-3" style={{ color: tokens.colors.ink[600], fontFamily: tokens.fonts.sans }}>
                          {tier.tagline}
                        </p>
                        <ul className="space-y-1">
                          {tier.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs" style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}>
                              <div className="w-1 h-1 rounded-full" style={{ background: tokens.colors.sage[500] }} />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t" style={{ borderColor: tokens.colors.paper.border }}>
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="text-sm flex items-center gap-2 transition-all disabled:opacity-30"
              style={{ color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            {currentStep < steps.length - 1 ? (
              <InkButton variant="primary" onClick={handleNext} disabled={!canProceed()}>
                Continue
              </InkButton>
            ) : (
              <InkButton variant="primary" onClick={handleGenerate} disabled={!canProceed() || isLoading} loading={isLoading}>
                {isLoading ? 'Creating...' : `Generate — $${getCurrentPrice()}`}
              </InkButton>
            )}
          </div>
        </InkCard>
      </div>
    </div>
  )
}

export function InkNewProject() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: tokens.colors.paper.cream }}>
          <div
            className="w-8 h-8 border-4 rounded-full animate-spin"
            style={{ borderColor: tokens.colors.ink[200], borderTopColor: tokens.colors.ink[700] }}
          />
        </div>
      }
    >
      <InkNewProjectWizard />
    </Suspense>
  )
}

export default InkNewProject
