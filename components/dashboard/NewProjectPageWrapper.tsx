'use client'

import { useUIMode } from '@/contexts/UIContext'
import { InkNewProject } from '@/components/themes/ink-diffusion'
import { DashboardHeader } from './DashboardHeader'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const serviceTypes = [
  {
    id: 'content-architect',
    name: 'Content Architect',
    description: 'Strategic content planning & service recommendations',
    icon: '🏗️',
    priceLabel: 'From $19',
    badge: 'NEW',
  },
  {
    id: 'blog-post',
    name: 'Blog Post',
    description: 'SEO-optimized articles for your website',
    icon: '📝',
    priceLabel: 'From $29',
  },
  {
    id: 'social-media',
    name: 'Social Media Package',
    description: 'Engaging posts for multiple platforms',
    icon: '📱',
    priceLabel: 'From $19',
  },
  {
    id: 'email-sequence',
    name: 'Email Sequence',
    description: 'Converting email campaigns',
    icon: '📧',
    priceLabel: 'From $39',
  },
  {
    id: 'seo-report',
    name: 'SEO Report',
    description: 'Comprehensive SEO analysis',
    icon: '📊',
    priceLabel: 'From $49',
  },
]

function ClassicNewProjectForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedType = searchParams.get('type')

  const [selectedType, setSelectedType] = useState(preselectedType || '')
  const [projectName, setProjectName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleContinue = async () => {
    if (!selectedType || !projectName.trim()) return

    setIsLoading(true)
    router.push(`/dashboard/projects/new/${selectedType}?name=${encodeURIComponent(projectName)}`)
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      {/* Project Name */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <label htmlFor="projectName" className="block text-sm font-medium text-slate-700 mb-2">
          Project Name
        </label>
        <input
          id="projectName"
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="e.g., Q1 Marketing Blog Post"
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
        />
      </div>

      {/* Service Type Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Select Content Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {serviceTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`flex items-start p-4 rounded-xl border-2 transition-all text-left ${
                selectedType === type.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className="text-3xl mr-4">{type.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    {type.name}
                    {(type as any).badge && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-primary-500 text-white rounded-full">
                        {(type as any).badge}
                      </span>
                    )}
                  </h3>
                  <span className="text-sm text-primary-600 font-medium">{type.priceLabel}</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{type.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!selectedType || !projectName.trim() || isLoading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Loading...' : 'Continue'}
        </button>
      </div>
    </div>
  )
}

export function NewProjectPageWrapper() {
  const { uiMode } = useUIMode()

  if (uiMode === 'ink-diffusion') {
    return <InkNewProject />
  }

  // Classic UI
  return (
    <>
      <DashboardHeader
        title="Create New Project"
        subtitle="Select a content type to get started"
      />
      <Suspense fallback={
        <div className="p-6 lg:p-8 max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="bg-slate-200 rounded-xl h-24"></div>
            <div className="bg-slate-200 rounded-xl h-64"></div>
          </div>
        </div>
      }>
        <ClassicNewProjectForm />
      </Suspense>
    </>
  )
}
