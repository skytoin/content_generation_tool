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
import { GenerationTheater } from '../generation/GenerationTheater'
import { useGenerationSimulation } from '../hooks/useGenerationSimulation'
import { useState, Suspense, useCallback } from 'react'
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
    features: ['Thought leadership', 'Professional tone'],
    comingSoon: true,
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
    description: 'Threads and tweets for engagement',
    features: ['Thread optimization', 'Viral hooks'],
    comingSoon: true,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
      </svg>
    ),
  },
]

// Instagram content types
const instagramContentTypes = [
  { id: 'carousel', name: 'Carousel', description: '114% more engagement', recommended: true },
  { id: 'single_post', name: 'Single Post', description: 'One impactful image' },
  { id: 'reels_cover', name: 'Reels Cover', description: '9:16 vertical format' },
  { id: 'story', name: 'Story', description: 'Ephemeral content' },
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
  // Basic info
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

  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAdvancedStyles, setShowAdvancedStyles] = useState(false)

  // Generation Theater state
  const [viewMode, setViewMode] = useState<ViewMode>('wizard')
  const [projectId, setProjectId] = useState<string | null>(null)
  const [generatedContent, setGeneratedContent] = useState<string>('')

  const [state, setState] = useState<WizardState>({
    projectName: '',
    contentType: preselectedType || '',
    platform: '',
    instagramContentType: 'carousel',
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
    topic: '',
    company: '',
    audience: '',
    goals: '',
    sampleArticles: '',
    additionalInfo: '',
    styleSelections: {},
    qualityTier: 'standard',
    lengthTier: 'standard',
  })

  const updateState = <K extends keyof WizardState>(key: K, value: WizardState[K]) => {
    setState({ ...state, [key]: value })
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
  const isBlogPost = state.contentType === 'blog-post'

  // Dynamic steps based on content type
  const getSteps = () => {
    const baseSteps = [
      { id: 'type', label: 'Type' },
    ]

    if (isSocialMedia) {
      baseSteps.push({ id: 'platform', label: 'Platform' })
    }

    baseSteps.push(
      { id: 'details', label: 'Details' },
      { id: 'style', label: 'Style' },
    )

    if (isInstagram) {
      baseSteps.push({ id: 'images', label: 'Images' })
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
      case 'details': return state.topic.trim() && state.company.trim() && state.audience.trim()
      case 'style': return true
      case 'images': return true
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

  const handleGenerate = async () => {
    if (!canProceed()) return

    setIsLoading(true)
    setError('')

    try {
      const effectiveServiceType = isInstagram ? 'instagram' : state.contentType

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
                industry: state.goals || 'General',
                topic: state.topic,
                audience: state.audience,
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
        contentType={isInstagram ? 'instagram' : isBlogPost ? 'blog' : 'social'}
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
            {stepId === 'details' && 'Tell us about your content'}
            {stepId === 'style' && 'Define your voice'}
            {stepId === 'images' && 'Visual direction'}
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
                    onClick={() => !platform.comingSoon && updateState('platform', platform.id)}
                    disabled={platform.comingSoon}
                    className="relative text-left p-5 rounded-xl transition-all"
                    style={{
                      background: state.platform === platform.id ? tokens.colors.paper.white : tokens.colors.paper.warm,
                      border: `2px solid ${state.platform === platform.id ? tokens.colors.ink[700] : 'transparent'}`,
                      opacity: platform.comingSoon ? 0.5 : 1,
                      cursor: platform.comingSoon ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {platform.comingSoon && (
                      <span
                        className="absolute top-2 right-2 px-2 py-1 text-xs rounded-full"
                        style={{ background: tokens.colors.paper.border, color: tokens.colors.text.muted, fontFamily: tokens.fonts.sans }}
                      >
                        Coming Soon
                      </span>
                    )}
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
            </div>
          )}

          {/* STEP: Details */}
          {stepId === 'details' && (
            <div className="space-y-6">
              {/* Basic fields */}
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

              {showAdvancedStyles ? (
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
