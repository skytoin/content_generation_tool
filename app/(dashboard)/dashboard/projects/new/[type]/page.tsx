'use client'

import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { StyleSelector } from '@/components/dashboard/StyleSelector'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'

const serviceConfigs: Record<string, { name: string; icon: string; description: string }> = {
  'blog-post': {
    name: 'Blog Post',
    icon: '📝',
    description: 'SEO-optimized articles for your website',
  },
  'social-media': {
    name: 'Social Media Package',
    icon: '📱',
    description: 'Engaging posts for multiple platforms',
  },
  'email-sequence': {
    name: 'Email Sequence',
    icon: '📧',
    description: 'Converting email campaigns',
  },
  'seo-report': {
    name: 'SEO Report',
    icon: '📊',
    description: 'Comprehensive SEO analysis',
  },
}

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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Load existing project data if editing
  useEffect(() => {
    if (projectId) {
      fetch(`/api/projects/${projectId}`)
        .then(res => res.json())
        .then(project => {
          if (project.formData) setFormData(project.formData)
          if (project.styleSelections) setStyleSelections(project.styleSelections)
          if (project.additionalInfo) setAdditionalInfo(project.additionalInfo)
        })
        .catch(console.error)
    }
  }, [projectId])

  const handleSubmit = async () => {
    if (!formData.topic || !formData.company || !formData.audience) {
      setError('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Create or update project
      let currentProjectId = projectId

      if (!currentProjectId) {
        // Create new project
        const createRes = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: projectName,
            serviceType: type,
            formData,
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
            formData,
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

      // Generate content
      const generateRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: type === 'blog-post' ? 'blog-premium' : type,
          formData,
          styleSelections,
          additionalInfo,
        }),
      })

      const result = await generateRes.json()

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
            disabled={isLoading || !formData.topic || !formData.company || !formData.audience}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating (2-5 min)...
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
              <span className="text-primary-700">Running 8-stage premium pipeline...</span>
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
