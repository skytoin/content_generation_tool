import { ProjectDetailWrapper } from '@/components/dashboard/ProjectDetailWrapper'
import { requireUserId } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

// Helper function to extract image URLs from Instagram content
function extractInstagramImages(content: string): { slideNumber: number; url: string }[] {
  const images: { slideNumber: number; url: string }[] = []
  const regex = /Slide\s+(\d+):\s+(https:\/\/[^\s<]+)/g
  let match

  while ((match = regex.exec(content)) !== null) {
    images.push({
      slideNumber: parseInt(match[1], 10),
      url: match[2].replace(/\n$/, '')
    })
  }

  return images
}

// Helper to check if project is Instagram type
function isInstagramProject(serviceType: string, result: string | null): boolean {
  return (serviceType === 'instagram' || serviceType === 'social-media') &&
    result !== null &&
    result.includes('INSTAGRAM CONTENT')
}

// Helper to check if project is X/Twitter type
function isTwitterProject(serviceType: string, result: string | null): boolean {
  return (serviceType === 'twitter' || serviceType === 'social-media') &&
    result !== null &&
    (result.includes('🐦 X TWEET PACK') ||
     result.includes('🧵 X THREAD') ||
     result.includes('💬 X QUOTE TWEETS'))
}

// Helper to check if project is LinkedIn type
function isLinkedInProject(serviceType: string, result: string | null): boolean {
  return (serviceType.startsWith('linkedin') || serviceType === 'social-media') &&
    result !== null &&
    (result.includes('💼 LINKEDIN TEXT POSTS') ||
     result.includes('🎠 LINKEDIN CAROUSEL') ||
     result.includes('📰 LINKEDIN ARTICLE') ||
     result.includes('📊 LINKEDIN POLLS'))
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

  // Check for Instagram project and extract images
  const isInstagram = isInstagramProject(project.serviceType, project.result)
  const instagramImages = isInstagram && project.result ? extractInstagramImages(project.result) : []

  // Check for X/Twitter project
  const isTwitter = isTwitterProject(project.serviceType, project.result)

  // Check for LinkedIn project
  const isLinkedIn = isLinkedInProject(project.serviceType, project.result)

  // Transform project for wrapper
  const projectData = {
    id: project.id,
    name: project.name,
    serviceType: project.serviceType,
    status: project.status,
    result: project.result,
    qualityReport: project.qualityReport,
    wordCount: project.wordCount,
    formData: project.formData,
    styleSelections: project.styleSelections,
    additionalInfo: project.additionalInfo as string | null,
    tier: (project as any).tier,
    lengthTier: (project as any).lengthTier,
    createdAt: project.createdAt,
    completedAt: project.completedAt,
    structuredData: project.structuredData,
  }

  return (
    <ProjectDetailWrapper
      project={projectData}
      instagramImages={instagramImages}
      isInstagram={isInstagram}
      isTwitter={isTwitter}
      isLinkedIn={isLinkedIn}
    />
  )
}
