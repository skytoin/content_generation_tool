import { ProjectsPageWrapper } from '@/components/dashboard/ProjectsPageWrapper'
import { requireUserId } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'

export default async function ProjectsPage() {
  const userId = await requireUserId()

  const projects = await prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })

  // Transform projects to match wrapper interface
  const projectsData = projects.map((p: { id: string; name: string; serviceType: string; status: string; createdAt: Date; wordCount?: number | null }) => ({
    id: p.id,
    name: p.name,
    serviceType: p.serviceType,
    status: p.status,
    createdAt: p.createdAt,
    wordCount: p.wordCount,
  }))

  return <ProjectsPageWrapper projects={projectsData} />
}
