'use client'

import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { StyleSelector } from '@/components/dashboard/StyleSelector'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { LENGTH_TIERS, type LengthTier, type QualityTier } from '@/lib/pricing-config'

// Social media platform options
const socialPlatforms = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    description: 'Carousels, single posts, stories with captions & hashtags',
    features: ['Caption optimization', 'Hashtag strategy', 'Alt text', 'Optional AI images'],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    description: 'Professional posts for B2B engagement',
    features: ['Professional tone', 'Thought leadership', 'Industry insights'],
    comingSoon: true,
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: '🐦',
    description: 'Threads and tweets for maximum engagement',
    features: ['Thread optimization', 'Viral hooks', 'Hashtag strategy'],
    comingSoon: true,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '👥',
    description: 'Posts optimized for Facebook algorithm',
    features: ['Engagement hooks', 'Community building', 'Share optimization'],
    comingSoon: true,
  },
]

// Instagram-specific options
const instagramContentTypes = [
  { id: 'carousel', name: 'Carousel', description: '114% more engagement', recommended: true },
  { id: 'single_post', name: 'Single Post', description: 'One impactful image' },
  { id: 'reels_cover', name: 'Reels Cover', description: '9:16 vertical format' },
  { id: 'story', name: 'Story', description: 'Ephemeral content' },
]

const instagramImageStyles = [
  { id: 'photography', name: 'Photography', hint: 'Realistic, professional photos' },
  { id: 'illustration', name: 'Illustration', hint: 'Hand-drawn or digital art' },
  { id: 'minimalist', name: 'Minimalist', hint: 'Clean, simple visuals' },
  { id: '3d_render', name: '3D Render', hint: 'Three-dimensional graphics' },
  { id: 'flat_design', name: 'Flat Design', hint: 'Simple shapes, bold colors' },
]

const instagramImageMoods = [
  { id: 'professional', name: 'Professional' },
  { id: 'playful', name: 'Playful' },
  { id: 'elegant', name: 'Elegant' },
  { id: 'bold', name: 'Bold' },
  { id: 'calm', name: 'Calm' },
  { id: 'energetic', name: 'Energetic' },
]

// Number of images options for carousel
const carouselImageCounts = [
  { count: 1, label: '1 Image', description: 'Cover slide only' },
  { count: 3, label: '3 Images', description: 'Quick carousel' },
  { count: 5, label: '5 Images', description: 'Standard carousel', recommended: true },
  { count: 7, label: '7 Images', description: 'Detailed carousel' },
  { count: 10, label: '10 Images', description: 'Maximum slides' },
]

const serviceConfigs: Record<string, { name: string; icon: string; description: string; apiServiceId?: string; isBlogPost?: boolean }> = {
  // Standard dashboard types
  'blog-post': {
    name: 'Blog Post',
    icon: '📝',
    description: 'SEO-optimized articles for your website',
    apiServiceId: 'blog-post',
    isBlogPost: true,
  },
  'social-media': {
    name: 'Social Media Package',
    icon: '📱',
    description: 'Engaging posts for multiple platforms',
    apiServiceId: 'social-pack',
  },
  'email-sequence': {
    name: 'Email Sequence',
    icon: '📧',
    description: 'Converting email campaigns',
    apiServiceId: 'email-sequence',
  },
  'seo-report': {
    name: 'SEO Content Audit',
    icon: '📊',
    description: 'Comprehensive content strategy report',
    apiServiceId: 'seo-report',
  },
  // Homepage service types (legacy - redirect to blog-post)
  'blog-basic': {
    name: 'Blog Post',
    icon: '📝',
    description: 'SEO-optimized articles for your website',
    apiServiceId: 'blog-post',
    isBlogPost: true,
  },
  'blog-premium': {
    name: 'Blog Post',
    icon: '📝',
    description: 'SEO-optimized articles for your website',
    apiServiceId: 'blog-post',
    isBlogPost: true,
  },
  'social-pack': {
    name: 'Social Media Pack',
    icon: '📱',
    description: '30 posts for LinkedIn, Twitter/X, and Instagram',
    apiServiceId: 'social-pack',
  },
  'content-bundle': {
    name: 'Monthly Content Bundle',
    icon: '🚀',
    description: '4 blog posts, 30 social posts, 1 email sequence',
    apiServiceId: 'content-bundle',
  },
}

// Non-blog service pricing (blog uses length-based pricing from config)
const servicePricing: Record<string, { budget: number; standard: number; premium: number }> = {
  'social-pack': { budget: 12, standard: 22, premium: 45 },
  'social-media': { budget: 12, standard: 22, premium: 45 },
  'email-sequence': { budget: 15, standard: 28, premium: 55 },
  'seo-report': { budget: 20, standard: 35, premium: 65 },
  'content-bundle': { budget: 40, standard: 80, premium: 150 },
}

const tierConfigs = [
  {
    id: 'budget',
    name: 'Budget',
    badge: '💰 Best Value',
    description: 'GPT-4o powered, 4 research queries',
    color: 'border-green-500 bg-green-50',
    textColor: 'text-green-700',
    selectedColor: 'ring-2 ring-green-500 bg-green-100',
  },
  {
    id: 'standard',
    name: 'Standard',
    badge: '⭐ Recommended',
    description: 'GPT-4o + Claude Sonnet, 7 research queries',
    color: 'border-blue-500 bg-blue-50',
    textColor: 'text-blue-700',
    selectedColor: 'ring-2 ring-blue-500 bg-blue-100',
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    badge: '👑 Top Quality',
    description: 'Claude Opus 4.5, live web search, expert quality',
    color: 'border-purple-500 bg-purple-50',
    textColor: 'text-purple-700',
    selectedColor: 'ring-2 ring-purple-500 bg-purple-100',
  },
]

function ProjectForm() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  const type = params.type as string
  const projectName = searchParams.get('name') || 'New Project'
  const projectId = searchParams.get('projectId')

  const config = serviceConfigs[type] || serviceConfigs['blog-post']

  const [formData, setFormData] = useState({
    topic: '',
    company: '',
    audience: '',
    goals: '',
    sampleArticles: '',
  })
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [styleSelections, setStyleSelections] = useState<Record<string, string>>({})
  const [selectedTier, setSelectedTier] = useState<QualityTier>('standard')
  const [selectedLengthTier, setSelectedLengthTier] = useState<LengthTier>('standard')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Social media platform selection
  const [selectedPlatform, setSelectedPlatform] = useState<string>('')
  const isSocialMedia = type === 'social-media'

  // Instagram-specific options
  const [instagramOptions, setInstagramOptions] = useState({
    contentType: 'carousel' as string,
    generateImages: false,
    numberOfImages: 5,
    imageStyle: 'photography' as string,
    imageMood: 'professional' as string,
    colorPreferences: '' as string,
    subjectsToInclude: '' as string,
    subjectsToAvoid: '' as string,
    additionalImageNotes: '' as string,
    referenceImages: [] as string[],
    referenceImageInstructions: '' as string,
  })

  // Check if current service is a blog post
  const isBlogPost = config.isBlogPost === true

  // Get current price based on selections
  const getCurrentPrice = (): number => {
    if (isBlogPost) {
      const lengthConfig = LENGTH_TIERS.find(t => t.id === selectedLengthTier)
      return lengthConfig?.prices[selectedTier] ?? 0
    }
    return servicePricing[type]?.[selectedTier] ?? servicePricing['social-pack'][selectedTier]
  }

  // Load existing project data if editing
  useEffect(() => {
    if (projectId) {
      fetch(`/api/projects/${projectId}`)
        .then(res => res.json())
        .then(project => {
          if (project.formData) setFormData(project.formData)
          if (project.styleSelections) setStyleSelections(project.styleSelections)
          if (project.additionalInfo) setAdditionalInfo(project.additionalInfo)
          if (project.tier) setSelectedTier(project.tier as QualityTier)
          if (project.lengthTier) setSelectedLengthTier(project.lengthTier as LengthTier)
        })
        .catch(console.error)
    }
  }, [projectId])

  const handleSubmit = async () => {
    if (!formData.topic || !formData.company || !formData.audience) {
      setError('Please fill in all required fields')
      return
    }

    // For social media, require platform selection
    if (isSocialMedia && !selectedPlatform) {
      setError('Please select a social media platform')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Determine service type based on platform selection
      const effectiveServiceType = isSocialMedia && selectedPlatform === 'instagram'
        ? 'instagram'
        : config.apiServiceId || type

      // Create or update project
      let currentProjectId = projectId

      if (!currentProjectId) {
        // Create new project
        const createRes = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: projectName,
            serviceType: effectiveServiceType,
            tier: selectedTier,
            lengthTier: isBlogPost ? selectedLengthTier : 'standard',
            formData: {
              ...formData,
              platform: selectedPlatform,
              contentType: instagramOptions.contentType,
            },
            styleSelections,
            additionalInfo,
          }),
        })
        const newProject = await createRes.json()
        if (createRes.ok) {
          currentProjectId = newProject.id
        } else {
          throw new Error(newProject.error || 'Failed to create project')
        }
      } else {
        // Update existing project
        await fetch(`/api/projects/${currentProjectId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            formData: {
              ...formData,
              platform: selectedPlatform,
              contentType: instagramOptions.contentType,
            },
            styleSelections,
            additionalInfo,
            status: 'processing',
          }),
        })
      }

      // Update status to processing
      await fetch(`/api/projects/${currentProjectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'processing' }),
      })

      let result: any

      // Route to appropriate API based on platform
      if (isSocialMedia && selectedPlatform === 'instagram') {
        // Use Instagram-specific API
        const generateRes = await fetch('/api/generate/instagram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            formData: {
              company: formData.company,
              industry: formData.goals || 'General',
              topic: formData.topic,
              audience: formData.audience,
              goal: formData.goals,
              contentType: instagramOptions.contentType,
            },
            styleSelections: {
              ...styleSelections,
              post_format: instagramOptions.contentType,
            },
            imageOptions: {
              generateImages: instagramOptions.generateImages,
              numberOfImages: instagramOptions.numberOfImages,
              style: instagramOptions.imageStyle,
              mood: instagramOptions.imageMood,
              colorPreferences: instagramOptions.colorPreferences
                ? instagramOptions.colorPreferences.split(',').map(s => s.trim())
                : [],
              subjectsToInclude: instagramOptions.subjectsToInclude
                ? instagramOptions.subjectsToInclude.split(',').map(s => s.trim())
                : [],
              subjectsToAvoid: instagramOptions.subjectsToAvoid
                ? instagramOptions.subjectsToAvoid.split(',').map(s => s.trim())
                : [],
              additionalImageNotes: instagramOptions.additionalImageNotes,
              referenceImages: instagramOptions.referenceImages,
              referenceImageInstructions: instagramOptions.referenceImageInstructions,
            },
            additionalInfo,
          }),
        })

        result = await generateRes.json()

        if (result.error) {
          throw new Error(result.error)
        }

        // Format Instagram result for display
        const caption = result.content?.caption || ''
        const hashtags = result.content?.hashtags?.join(' ') || ''
        const altText = result.content?.altText || ''
        const slides = result.content?.slides || []
        const qualityScore = result.qualityReport?.totalScore || 0

        // Build formatted content
        let mainContent = `📸 INSTAGRAM CONTENT\n\n`
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
          mainContent += '\n'
        }

        if (result.images?.length > 0) {
          mainContent += `🖼️ GENERATED IMAGES:\n`
          result.images.forEach((img: any) => {
            mainContent += `Slide ${img.slideNumber}: ${img.imageUrl}\n`
          })
          mainContent += '\n'
        }

        const qualityReport = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 INSTAGRAM QUALITY REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 QUALITY SCORE: ${qualityScore}/100

📈 BREAKDOWN:
• Caption Quality: ${result.qualityReport?.breakdown?.captionQuality || 0}/40
• SEO & Discoverability: ${result.qualityReport?.breakdown?.seoDiscoverability || 0}/25
• Visual Direction: ${result.qualityReport?.breakdown?.visualDirection || 0}/20
• Engagement Potential: ${result.qualityReport?.breakdown?.engagementPotential || 0}/15

💡 FEEDBACK:
${result.qualityReport?.feedback?.join('\n') || 'No feedback available'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Built with: Instagram 8-Stage Pipeline (GPT-4.1 + GPT Image 1.5)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

        // Update project with result
        await fetch(`/api/projects/${currentProjectId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'completed',
            result: mainContent,
            qualityReport,
            wordCount: mainContent.split(/\s+/).length,
            completedAt: new Date().toISOString(),
          }),
        })
      } else {
        // Use standard generate API
        const generateRes = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceId: config.apiServiceId || type,
            formData,
            styleSelections,
            additionalInfo,
            tier: selectedTier,
            lengthTier: isBlogPost ? selectedLengthTier : 'standard',
          }),
        })

        result = await generateRes.json()

        if (result.error) {
          throw new Error(result.error)
        }

        // Parse content and quality report
        const content = result.content || ''
        const reportStart = content.indexOf('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        const mainContent = reportStart > 0 ? content.substring(0, reportStart).trim() : content
        const qualityReport = reportStart > 0 ? content.substring(reportStart).trim() : ''

        // Update project with result
        await fetch(`/api/projects/${currentProjectId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'completed',
            result: mainContent,
            qualityReport,
            wordCount: mainContent.split(/\s+/).length,
            completedAt: new Date().toISOString(),
          }),
        })
      }

      // Redirect to project view
      router.push(`/dashboard/projects/${currentProjectId}`)
    } catch (err: any) {
      setError(err.message || 'Failed to generate content')
      setIsLoading(false)
    }
  }

  return (
    <>
      <DashboardHeader
        title={`${config.icon} ${projectName}`}
        subtitle={`${config.name} - ${config.description}`}
      />

      <div className="p-6 lg:p-8 max-w-4xl">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Platform Selection - Only for Social Media */}
        {isSocialMedia && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <span className="text-xl">📱</span> Select Platform
            </h2>
            <p className="text-slate-500 text-sm mb-4">
              Choose which social media platform to create content for
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {socialPlatforms.map((platform) => (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => !platform.comingSoon && setSelectedPlatform(platform.id)}
                  disabled={platform.comingSoon}
                  className={`relative flex items-start p-4 rounded-xl border-2 text-left transition-all ${
                    platform.comingSoon
                      ? 'border-slate-100 bg-slate-50 cursor-not-allowed opacity-60'
                      : selectedPlatform === platform.id
                        ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {platform.comingSoon && (
                    <span className="absolute top-2 right-2 text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                      Coming Soon
                    </span>
                  )}
                  <span className="text-3xl mr-4">{platform.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{platform.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{platform.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {platform.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Instagram Options - Only when Instagram is selected */}
        {isSocialMedia && selectedPlatform === 'instagram' && (
          <>
            {/* Content Type */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-xl">📑</span> Content Type
              </h2>
              <p className="text-slate-500 text-sm mb-4">
                Select the type of Instagram content to create
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {instagramContentTypes.map((contentType) => (
                  <button
                    key={contentType.id}
                    type="button"
                    onClick={() => setInstagramOptions({ ...instagramOptions, contentType: contentType.id })}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                      instagramOptions.contentType === contentType.id
                        ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {contentType.recommended && (
                      <span className="absolute -top-2 -right-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                        Best
                      </span>
                    )}
                    <h3 className="font-semibold text-slate-900 text-sm">{contentType.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{contentType.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Image Generation Options */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-xl">🖼️</span> Image Generation (Optional)
              </h2>
              <p className="text-slate-500 text-sm mb-4">
                Generate AI images for your posts using DALL-E 3
              </p>

              {/* Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl mb-4">
                <div>
                  <p className="font-medium text-slate-900">Generate AI Images</p>
                  <p className="text-sm text-slate-500">Creates custom images for each slide/post</p>
                </div>
                <button
                  type="button"
                  onClick={() => setInstagramOptions({ ...instagramOptions, generateImages: !instagramOptions.generateImages })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    instagramOptions.generateImages ? 'bg-primary-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      instagramOptions.generateImages ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Image Options (only show when enabled) */}
              {instagramOptions.generateImages && (
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  {/* Number of Images (for carousel) */}
                  {instagramOptions.contentType === 'carousel' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Number of Images to Generate
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {carouselImageCounts.map((option) => (
                          <button
                            key={option.count}
                            type="button"
                            onClick={() => setInstagramOptions({ ...instagramOptions, numberOfImages: option.count })}
                            className={`relative p-3 rounded-lg text-center transition-all ${
                              instagramOptions.numberOfImages === option.count
                                ? 'bg-primary-500 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {option.recommended && (
                              <span className="absolute -top-1 -right-1 text-xs bg-green-500 text-white px-1 rounded">
                                ★
                              </span>
                            )}
                            <span className="block font-semibold">{option.count}</span>
                            <span className="text-xs opacity-75">images</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Image Style */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Image Style
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {instagramImageStyles.map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => setInstagramOptions({ ...instagramOptions, imageStyle: style.id })}
                          className={`px-4 py-2 rounded-lg text-sm transition-all ${
                            instagramOptions.imageStyle === style.id
                              ? 'bg-primary-500 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {style.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image Mood */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Image Mood
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {instagramImageMoods.map((mood) => (
                        <button
                          key={mood.id}
                          type="button"
                          onClick={() => setInstagramOptions({ ...instagramOptions, imageMood: mood.id })}
                          className={`px-4 py-2 rounded-lg text-sm transition-all ${
                            instagramOptions.imageMood === mood.id
                              ? 'bg-primary-500 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {mood.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Preferences */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Color Preferences (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={instagramOptions.colorPreferences}
                      onChange={(e) => setInstagramOptions({ ...instagramOptions, colorPreferences: e.target.value })}
                      placeholder="e.g., blue, white, gold"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                    />
                  </div>

                  {/* Subjects to Include */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Subjects to Include (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={instagramOptions.subjectsToInclude}
                      onChange={(e) => setInstagramOptions({ ...instagramOptions, subjectsToInclude: e.target.value })}
                      placeholder="e.g., laptops, office, coffee"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                    />
                  </div>

                  {/* Subjects to Avoid */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Subjects to Avoid (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={instagramOptions.subjectsToAvoid}
                      onChange={(e) => setInstagramOptions({ ...instagramOptions, subjectsToAvoid: e.target.value })}
                      placeholder="e.g., faces, text, logos"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                    />
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Additional Image Notes
                    </label>
                    <textarea
                      value={instagramOptions.additionalImageNotes}
                      onChange={(e) => setInstagramOptions({ ...instagramOptions, additionalImageNotes: e.target.value })}
                      placeholder="Any specific requirements for the generated images..."
                      className="w-full px-4 py-2 h-20 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 resize-none"
                    />
                  </div>

                  {/* Reference Images Section */}
                  <div className="pt-4 border-t border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <span>📷</span> Reference Images (Optional)
                    </h3>
                    <p className="text-xs text-slate-500 mb-3">
                      Upload images you want the AI to use as style references. The AI will analyze these and create similar images.
                    </p>

                    {/* File Upload */}
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Upload Reference Images
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
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
                          setInstagramOptions({
                            ...instagramOptions,
                            referenceImages: [...instagramOptions.referenceImages, ...base64Images]
                          })
                        }}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                      />
                    </div>

                    {/* Preview uploaded images */}
                    {instagramOptions.referenceImages.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-slate-600 mb-2">
                          {instagramOptions.referenceImages.length} image(s) uploaded
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {instagramOptions.referenceImages.map((img, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={img}
                                alt={`Reference ${idx + 1}`}
                                className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newImages = [...instagramOptions.referenceImages]
                                  newImages.splice(idx, 1)
                                  setInstagramOptions({ ...instagramOptions, referenceImages: newImages })
                                }}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Instructions for how to use reference images */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        How should the AI use these images?
                      </label>
                      <textarea
                        value={instagramOptions.referenceImageInstructions}
                        onChange={(e) => setInstagramOptions({ ...instagramOptions, referenceImageInstructions: e.target.value })}
                        placeholder="e.g., Match the color palette and minimalist style of these images. Use similar lighting and composition. Keep the same professional aesthetic..."
                        className="w-full px-4 py-2 h-24 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 resize-none text-sm"
                        disabled={instagramOptions.referenceImages.length === 0}
                      />
                      {instagramOptions.referenceImages.length === 0 && (
                        <p className="text-xs text-slate-400 mt-1">Upload images first to provide instructions</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-xl">📝</span> Basic Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Topic / Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g., How AI is Transforming Small Business Marketing"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Company / Brand <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g., Acme Software"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Target Audience <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                placeholder="e.g., Non-technical startup founders aged 30-50"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Goals (optional)
              </label>
              <input
                type="text"
                value={formData.goals}
                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                placeholder="e.g., Generate leads for free trial signups"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Style Learning */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <span className="text-xl">📚</span> Teach Us Your Writing Style
          </h2>
          <p className="text-slate-500 text-sm mb-4">
            Paste 1-5 sample articles to match your voice (optional but recommended)
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-blue-700 font-medium mb-2">What we analyze:</p>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>Tone, formality, and personality</li>
              <li>Sentence patterns and rhythm</li>
              <li>Vocabulary and signature phrases</li>
            </ul>
          </div>
          <textarea
            value={formData.sampleArticles}
            onChange={(e) => setFormData({ ...formData, sampleArticles: e.target.value })}
            placeholder="Paste your existing articles or content here..."
            className="w-full px-4 py-3 h-40 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all resize-none"
          />
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <span className="text-xl">📎</span> Additional Information
          </h2>
          <p className="text-slate-500 text-sm mb-4">
            Links, facts, requirements, or special requests
          </p>
          <textarea
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Enter any additional context, links to research, specific requirements..."
            className="w-full px-4 py-3 h-28 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all resize-none"
          />
        </div>

        {/* Style Customization */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <span className="text-xl">🎨</span> Style Customization
          </h2>
          <p className="text-slate-500 text-sm mb-4">
            Customize any style options or let AI infer from your samples
          </p>
          <StyleSelector
            selections={styleSelections}
            onChange={setStyleSelections}
          />
        </div>

        {/* Length Tier Selection - Only for blog posts */}
        {isBlogPost && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <span className="text-xl">📏</span> Choose Article Length
            </h2>
            <p className="text-slate-500 text-sm mb-4">
              Select how long you want your article to be
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {LENGTH_TIERS.map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setSelectedLengthTier(tier.id)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                    selectedLengthTier === tier.id
                      ? 'ring-2 ring-primary-500 border-primary-500 bg-primary-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  {tier.id === 'standard' && (
                    <div className="absolute -top-2 -right-2">
                      <span className="bg-primary-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    </div>
                  )}
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">{tier.name}</h3>
                  <p className="text-xs text-slate-500">{tier.wordRange} words</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tier Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <span className="text-xl">⚡</span> Choose Quality Tier
          </h2>
          <p className="text-slate-500 text-sm mb-4">
            Select your preferred quality level and pricing
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {tierConfigs.map((tier) => {
              // Calculate price based on tier and length selection
              const tierPrice = isBlogPost
                ? LENGTH_TIERS.find(t => t.id === selectedLengthTier)?.prices[tier.id as QualityTier] ?? 0
                : servicePricing[type]?.[tier.id as QualityTier] ?? servicePricing['social-pack'][tier.id as QualityTier]

              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setSelectedTier(tier.id as QualityTier)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                    selectedTier === tier.id
                      ? tier.selectedColor
                      : `${tier.color} border-transparent hover:border-slate-300`
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-2 -right-2">
                      <span className="bg-blue-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${tier.textColor}`}>{tier.badge}</span>
                    <span className={`text-xl font-bold ${tier.textColor}`}>
                      ${tierPrice}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{tier.name}</h3>
                  <p className="text-xs text-slate-600">{tier.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 text-slate-600 hover:text-slate-900 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !formData.topic || !formData.company || !formData.audience || (isSocialMedia && !selectedPlatform)}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {selectedPlatform === 'instagram' ? 'Generating Instagram Content (1-3 min)...' : 'Generating (2-5 min)...'}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Content
              </>
            )}
          </button>
        </div>

        {isLoading && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-3 bg-primary-50 rounded-xl px-6 py-4 border border-primary-200">
              <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-primary-700">
                {selectedPlatform === 'instagram'
                  ? 'Running Instagram 8-stage pipeline...'
                  : 'Running 8-stage premium pipeline...'}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default function ProjectFormPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ProjectForm />
    </Suspense>
  )
}
