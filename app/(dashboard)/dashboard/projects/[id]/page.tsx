import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { CopyButton, DownloadButton, DeleteButton, RegenerateButton } from '@/components/dashboard/ProjectActions'
import { requireUserId } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getLengthTier, type LengthTier } from '@/lib/pricing-config'

// Helper function to extract image URLs from Instagram content
// Looks for URLs in both visible text and hidden IMAGE_DATA comment
function extractInstagramImages(content: string): { slideNumber: number; url: string }[] {
  const images: { slideNumber: number; url: string }[] = []
  const regex = /Slide\s+(\d+):\s+(https:\/\/[^\s<]+)/g
  let match

  while ((match = regex.exec(content)) !== null) {
    images.push({
      slideNumber: parseInt(match[1], 10),
      url: match[2].replace(/\n$/, '') // Clean trailing newlines
    })
  }

  return images
}

// Helper function to remove hidden IMAGE_DATA comment from display
function cleanContentForDisplay(content: string): string {
  // Remove <!-- IMAGE_DATA ... --> block
  return content.replace(/\n*<!--\s*IMAGE_DATA[\s\S]*?-->\s*/g, '').trim()
}

// Helper to check if project is Instagram type
function isInstagramProject(serviceType: string, result: string | null): boolean {
  return (serviceType === 'instagram' || serviceType === 'social-media') &&
    result !== null &&
    result.includes('INSTAGRAM CONTENT')
}

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const userId = await requireUserId()
  const { id } = await params

  const project = await prisma.project.findFirst({
    where: {
      id,
      userId,
    },
  })

  if (!project) {
    notFound()
  }

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'blog-post': return '📝'
      case 'social-media': return '📱'
      case 'instagram': return '📸'
      case 'email-sequence': return '📧'
      case 'seo-report': return '📊'
      default: return '📄'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'budget': return { label: '💰 Budget', color: 'bg-green-100 text-green-800' }
      case 'standard': return { label: '⭐ Standard', color: 'bg-blue-100 text-blue-800' }
      case 'premium': return { label: '👑 Premium', color: 'bg-purple-100 text-purple-800' }
      default: return { label: '👑 Premium', color: 'bg-purple-100 text-purple-800' }
    }
  }

  const getLengthBadge = (lengthTier: string) => {
    const config = getLengthTier(lengthTier as LengthTier)
    if (config) {
      return { label: `📏 ${config.name}`, wordRange: config.wordRange }
    }
    return { label: '📏 Standard', wordRange: '1,500-2,500' }
  }

  const tierInfo = getTierBadge((project as any).tier || 'premium')
  const lengthInfo = getLengthBadge((project as any).lengthTier || 'standard')
  const isBlogPost = project.serviceType === 'blog-post' || project.serviceType === 'blog-basic' || project.serviceType === 'blog-premium'

  // Check for Instagram project and extract images
  const isInstagram = isInstagramProject(project.serviceType, project.result)
  const instagramImages = isInstagram && project.result ? extractInstagramImages(project.result) : []

  return (
    <>
      <DashboardHeader
        title={project.name}
        subtitle={`${project.serviceType.replace('-', ' ')} • Created ${new Date(project.createdAt).toLocaleDateString()}`}
        action={
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
            <Link href="/dashboard/projects" className="text-slate-600 hover:text-slate-900">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
          </div>
        }
      />

      <div className="p-6 lg:p-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Generated Content */}
            {project.result ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Generated Content</h2>
                  <CopyButton text={project.result || ''} />
                </div>
                <div className="p-6">
                  <div className="prose prose-slate max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 bg-slate-50 p-4 rounded-lg overflow-auto max-h-[600px]">
                      {cleanContentForDisplay(project.result)}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">{getServiceIcon(project.serviceType)}</span>
                </div>
                {project.status === 'draft' ? (
                  <>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">Ready to Generate</h3>
                    <p className="text-slate-500 mb-6">Start generating content for this project</p>
                    <Link
                      href={`/dashboard/projects/new/${project.serviceType}?projectId=${project.id}`}
                      className="btn-primary"
                    >
                      Continue Setup
                    </Link>
                  </>
                ) : project.status === 'processing' ? (
                  <>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">Generating Content...</h3>
                    <p className="text-slate-500">This may take a few minutes</p>
                    <div className="mt-4 w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No Content Yet</h3>
                    <p className="text-slate-500">Content generation has not started</p>
                  </>
                )}
              </div>
            )}

            {/* Instagram Images Gallery */}
            {isInstagram && instagramImages.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200">
                  <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <span>🖼️</span> Generated Images ({instagramImages.length})
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {instagramImages.map((image) => (
                      <div key={image.slideNumber} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={image.url}
                            alt={`Slide ${image.slideNumber}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded">
                          Slide {image.slideNumber}
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <a
                            href={image.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-slate-900 px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg hover:bg-slate-100 transition-colors"
                          >
                            Open Full Size
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-slate-500">
                    Note: These images are temporary and will expire. Download them to keep permanently.
                  </p>
                </div>
              </div>
            )}

            {/* Quality Report */}
            {project.qualityReport && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200">
                  <h2 className="text-lg font-semibold text-slate-900">Quality Report</h2>
                </div>
                <div className="p-6">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 bg-slate-50 p-4 rounded-lg">
                    {project.qualityReport}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Project Details</h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs text-slate-500 uppercase">Type</dt>
                  <dd className="mt-1 text-sm text-slate-900 capitalize">{project.serviceType.replace('-', ' ')}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 uppercase">Quality Tier</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${tierInfo.color}`}>
                      {tierInfo.label}
                    </span>
                  </dd>
                </div>
                {isBlogPost && (
                  <div>
                    <dt className="text-xs text-slate-500 uppercase">Length Tier</dt>
                    <dd className="mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                        {lengthInfo.label}
                      </span>
                      <span className="block mt-1 text-xs text-slate-500">{lengthInfo.wordRange} words</span>
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs text-slate-500 uppercase">Status</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </dd>
                </div>
                {project.wordCount && (
                  <div>
                    <dt className="text-xs text-slate-500 uppercase">Word Count</dt>
                    <dd className="mt-1 text-sm text-slate-900">{project.wordCount.toLocaleString()} words</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs text-slate-500 uppercase">Created</dt>
                  <dd className="mt-1 text-sm text-slate-900">{new Date(project.createdAt).toLocaleString()}</dd>
                </div>
                {project.completedAt && (
                  <div>
                    <dt className="text-xs text-slate-500 uppercase">Completed</dt>
                    <dd className="mt-1 text-sm text-slate-900">{new Date(project.completedAt).toLocaleString()}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Input Settings */}
            {project.formData && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Input Settings</h3>
                <dl className="space-y-3 text-sm">
                  {(project.formData as any).topic && (
                    <div>
                      <dt className="text-xs text-slate-500 uppercase">Topic</dt>
                      <dd className="mt-1 text-slate-900">{(project.formData as any).topic}</dd>
                    </div>
                  )}
                  {(project.formData as any).company && (
                    <div>
                      <dt className="text-xs text-slate-500 uppercase">Company</dt>
                      <dd className="mt-1 text-slate-900">{(project.formData as any).company}</dd>
                    </div>
                  )}
                  {(project.formData as any).audience && (
                    <div>
                      <dt className="text-xs text-slate-500 uppercase">Audience</dt>
                      <dd className="mt-1 text-slate-900">{(project.formData as any).audience}</dd>
                    </div>
                  )}
                  {(project.formData as any).goals && (
                    <div>
                      <dt className="text-xs text-slate-500 uppercase">Goals</dt>
                      <dd className="mt-1 text-slate-900">{(project.formData as any).goals}</dd>
                    </div>
                  )}
                  {(project.formData as any).contentType && (
                    <div>
                      <dt className="text-xs text-slate-500 uppercase">Content Type</dt>
                      <dd className="mt-1 text-slate-900 capitalize">{(project.formData as any).contentType?.replace('_', ' ')}</dd>
                    </div>
                  )}
                  {(project.formData as any).imageOptions && (
                    <>
                      <div>
                        <dt className="text-xs text-slate-500 uppercase">Image Generation</dt>
                        <dd className="mt-1 text-slate-900">
                          {(project.formData as any).imageOptions.generateImages ? '✅ Enabled' : '❌ Disabled'}
                        </dd>
                      </div>
                      {(project.formData as any).imageOptions.generateImages && (
                        <>
                          <div>
                            <dt className="text-xs text-slate-500 uppercase">Image Count</dt>
                            <dd className="mt-1 text-slate-900">{(project.formData as any).imageOptions.numberOfImages || 5}</dd>
                          </div>
                          <div>
                            <dt className="text-xs text-slate-500 uppercase">Image Style</dt>
                            <dd className="mt-1 text-slate-900 capitalize">{(project.formData as any).imageOptions.style || 'photography'}</dd>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </dl>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Actions</h3>
              <div className="space-y-3">
                {project.result && project.status === 'completed' && (
                  <RegenerateButton
                    projectId={project.id}
                    serviceType={project.serviceType}
                    formData={project.formData as any}
                    styleSelections={project.styleSelections as any}
                    additionalInfo={(project.additionalInfo as string) || ''}
                    tier={(project as any).tier || 'standard'}
                    lengthTier={(project as any).lengthTier || 'standard'}
                    existingResult={project.result}
                  />
                )}
                {project.result && (
                  <DownloadButton
                    content={project.result}
                    filename={`${project.name.replace(/\s+/g, '-').toLowerCase()}.txt`}
                  />
                )}
                <DeleteButton projectId={project.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
