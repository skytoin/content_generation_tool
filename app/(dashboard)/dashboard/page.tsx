import { DashboardPageWrapper } from '@/components/dashboard/DashboardPageWrapper'
import { getCurrentUser } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  // Get user's recent projects
  const recentProjects = user ? await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
  }) : []

  // Get project stats
  const totalProjects = user ? await prisma.project.count({
    where: { userId: user.id },
  }) : 0

  const completedProjects = user ? await prisma.project.count({
    where: { userId: user.id, status: 'completed' },
  }) : 0

  const stats = [
    { name: 'Total Projects', value: totalProjects, icon: '📁' },
    { name: 'Completed', value: completedProjects, icon: '✅' },
    { name: 'In Progress', value: totalProjects - completedProjects, icon: '⏳' },
  ]

  // Transform projects to match wrapper interface
  const projectsData = recentProjects.map((p: { id: string; name: string; serviceType: string; status: string; createdAt: Date }) => ({
    id: p.id,
    name: p.name,
    serviceType: p.serviceType,
    status: p.status,
    createdAt: p.createdAt,
  }))

  return (
    <DashboardPageWrapper
      userName={user?.name || undefined}
      stats={stats}
      recentProjects={projectsData}
    />
  )
}
