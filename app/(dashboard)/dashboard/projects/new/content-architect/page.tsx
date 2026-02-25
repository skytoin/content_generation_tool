'use client'

import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// Tier configurations
const tiers = [
  {
    id: 'budget',
    name: 'Budget',
    price: 19,
    description: 'Essential strategic guidance',
    features: [
      'Business & audience analysis',
      'Service recommendations',
      'Basic content strategy',
      'Platform-specific tips',
      'Execution plan',
    ],
    bestFor: 'Startups getting started',
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 49,
    description: 'Comprehensive planning',
    features: [
      'Everything in Budget',
      'Analytics integration',
      'Trend analysis',
      'Hashtag optimization',
      'Detailed content calendar',
    ],
    bestFor: 'Growing businesses',
    recommended: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 99,
    description: 'Executive-level consulting',
    features: [
      'Everything in Standard',
      'Full analytics suite',
      'Competitive intelligence',
      'ROI projections',
      'Claude Opus-powered',
    ],
    bestFor: 'Established businesses',
  },
]

// Industry options
const industries = [
  { value: 'technology', label: 'Technology & SaaS' },
  { value: 'ecommerce', label: 'E-commerce & Retail' },
  { value: 'healthcare', label: 'Healthcare & Wellness' },
  { value: 'finance', label: 'Finance & Fintech' },
  { value: 'education', label: 'Education & Training' },
  { value: 'marketing', label: 'Marketing & Agency' },
  { value: 'professional_services', label: 'Professional Services' },
  { value: 'other', label: 'Other' },
]

// Goal options
const goals = [
  { value: 'brand_awareness', label: 'Brand Awareness' },
  { value: 'lead_generation', label: 'Lead Generation' },
  { value: 'sales', label: 'Direct Sales' },
  { value: 'thought_leadership', label: 'Thought Leadership' },
  { value: 'seo_traffic', label: 'SEO & Organic Traffic' },
  { value: 'community', label: 'Community Building' },
]

// Platform options
const platforms = [
  { value: 'blog', label: 'Blog / Website', icon: '📝' },
  { value: 'instagram', label: 'Instagram', icon: '📸' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { value: 'twitter', label: 'Twitter / X', icon: '🐦' },
  { value: 'facebook', label: 'Facebook', icon: '👥' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'youtube', label: 'YouTube', icon: '🎬' },
]

function ContentArchitectForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectName = searchParams.get('name') || 'Content Strategy'

  // Form state
  const [selectedTier, setSelectedTier] = useState('standard')
  const [description, setDescription] = useState('')
  const [industry, setIndustry] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companyDescription, setCompanyDescription] = useState('')
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [includeImages, setIncludeImages] = useState(true)
  const [competitorUrls, setCompetitorUrls] = useState('')
  const [additionalContext, setAdditionalContext] = useState('')

  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'form' | 'result'>('form')

  const handleGoalToggle = (goal: string) => {
    setSelectedGoals(prev =>
      prev.includes(goal)
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    )
  }

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError('Please describe your content needs')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/generate/content-architect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          tier: selectedTier,
          businessInfo: {
            industry,
            companyName,
            companyDescription,
          },
          goals: selectedGoals,
          platforms: selectedPlatforms,
          includeImages,
          competitorUrls: competitorUrls
            .split('\n')
            .map(url => url.trim())
            .filter(url => url),
          additionalContext,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate recommendations')
      }

      setResult(data)
      setActiveTab('result')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('form')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'form'
              ? 'bg-primary-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Configure
        </button>
        <button
          onClick={() => setActiveTab('result')}
          disabled={!result}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'result'
              ? 'bg-primary-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Results {result && '✓'}
        </button>
      </div>

      {activeTab === 'form' ? (
        <>
          {/* Tier Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Select Your Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tiers.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`relative p-5 rounded-xl border-2 transition-all text-left ${
                    selectedTier === tier.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {tier.recommended && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-500 text-white text-xs font-bold rounded-full">
                      RECOMMENDED
                    </span>
                  )}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-slate-900">{tier.name}</h3>
                    <span className="text-2xl font-bold text-primary-600">${tier.price}</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">{tier.description}</p>
                  <ul className="space-y-2">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs text-slate-400">Best for: {tier.bestFor}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Describe Your Content Needs *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about your business, what you're trying to achieve, and what kind of content you need. The more detail you provide, the better recommendations you'll receive."
              rows={4}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all resize-none"
            />
            <p className="text-xs text-slate-400 mt-2">
              Example: "We're a B2B SaaS startup in the HR tech space. We want to establish thought leadership and generate leads through content marketing. Our target audience is HR managers at mid-sized companies."
            </p>
          </div>

          {/* Business Info */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your company name"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Company Description
              </label>
              <textarea
                value={companyDescription}
                onChange={(e) => setCompanyDescription(e.target.value)}
                placeholder="What does your company do? e.g. 'We build AI-powered tools for marketing teams'"
                rows={2}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all resize-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all bg-white"
                >
                  <option value="">Select industry...</option>
                  {industries.map((ind) => (
                    <option key={ind.value} value={ind.value}>{ind.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Goals */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Content Goals</h2>
            <p className="text-sm text-slate-500 mb-4">Select all that apply</p>
            <div className="flex flex-wrap gap-3">
              {goals.map((goal) => (
                <button
                  key={goal.value}
                  onClick={() => handleGoalToggle(goal.value)}
                  className={`px-4 py-2 rounded-full border-2 transition-all ${
                    selectedGoals.includes(goal.value)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  {goal.label}
                </button>
              ))}
            </div>
          </div>

          {/* Platforms */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Target Platforms</h2>
            <p className="text-sm text-slate-500 mb-4">Where do you want to publish content?</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {platforms.map((platform) => (
                <button
                  key={platform.value}
                  onClick={() => handlePlatformToggle(platform.value)}
                  className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
                    selectedPlatforms.includes(platform.value)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xl">{platform.icon}</span>
                  <span className="text-sm font-medium">{platform.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Additional Options</h2>

            {/* Image recommendations toggle */}
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <p className="font-medium text-slate-700">Include Image Recommendations</p>
                <p className="text-sm text-slate-500">Get suggestions for AI image generation</p>
              </div>
              <button
                onClick={() => setIncludeImages(!includeImages)}
                className={`w-12 h-6 rounded-full transition-all ${
                  includeImages ? 'bg-primary-500' : 'bg-slate-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-all ${
                  includeImages ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            {/* Competitor URLs */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Competitor URLs (optional)
              </label>
              <textarea
                value={competitorUrls}
                onChange={(e) => setCompetitorUrls(e.target.value)}
                placeholder="Enter competitor websites (one per line) for competitive analysis"
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all resize-none"
              />
            </div>

            {/* Additional Context */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Additional Context (optional)
              </label>
              <textarea
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                placeholder="Any other information that might help us provide better recommendations..."
                rows={2}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all resize-none"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 text-slate-600 hover:text-slate-900 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !description.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating Strategy...
                </>
              ) : (
                <>
                  Generate Strategy
                  <span className="text-sm opacity-75">(${tiers.find(t => t.id === selectedTier)?.price})</span>
                </>
              )}
            </button>
          </div>
        </>
      ) : (
        /* Results View */
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Your Content Strategy</h2>
              <p className="text-sm text-slate-500">
                Generated with {result?.tierInfo?.name} tier • {result?.metadata?.analyticsConfidence} confidence
              </p>
            </div>
            <button
              onClick={() => setActiveTab('form')}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Modify Request →
            </button>
          </div>

          {/* Warnings */}
          {result?.metadata?.warnings?.length > 0 && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="font-medium text-amber-800 mb-2">Notes:</p>
              <ul className="text-sm text-amber-700 space-y-1">
                {result.metadata.warnings.map((warning: string, idx: number) => (
                  <li key={idx}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Formatted Output */}
          <div className="prose prose-slate max-w-none">
            <pre className="bg-slate-50 p-6 rounded-xl overflow-x-auto text-sm whitespace-pre-wrap font-mono">
              {result?.formattedOutput}
            </pre>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => {
                navigator.clipboard.writeText(result?.formattedOutput || '')
              }}
              className="btn-secondary flex items-center gap-2"
            >
              📋 Copy to Clipboard
            </button>
            <button
              onClick={() => {
                const blob = new Blob([result?.formattedOutput || ''], { type: 'text/plain' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `content-strategy-${Date.now()}.txt`
                a.click()
              }}
              className="btn-secondary flex items-center gap-2"
            >
              💾 Download
            </button>
          </div>

          {/* Recommendations Cards */}
          {result?.data?.recommendations?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Recommended Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.data.recommendations.map((rec: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border-2 ${
                      rec.priority === 'high'
                        ? 'border-red-200 bg-red-50'
                        : rec.priority === 'medium'
                        ? 'border-amber-200 bg-amber-50'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-slate-900">{rec.serviceName}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        rec.priority === 'high'
                          ? 'bg-red-200 text-red-800'
                          : rec.priority === 'medium'
                          ? 'bg-amber-200 text-amber-800'
                          : 'bg-slate-200 text-slate-800'
                      }`}>
                        {rec.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{rec.reason}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Tier: {rec.recommendedTier}</span>
                      {rec.estimatedPrice && (
                        <span className="font-medium text-primary-600">${rec.estimatedPrice}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ContentArchitectPage() {
  return (
    <>
      <DashboardHeader
        title="Content Architect"
        subtitle="Get strategic content recommendations tailored to your business"
      />
      <Suspense fallback={
        <div className="p-6 lg:p-8 max-w-6xl">
          <div className="animate-pulse space-y-6">
            <div className="bg-slate-200 rounded-xl h-48"></div>
            <div className="bg-slate-200 rounded-xl h-32"></div>
            <div className="bg-slate-200 rounded-xl h-32"></div>
          </div>
        </div>
      }>
        <ContentArchitectForm />
      </Suspense>
    </>
  )
}
