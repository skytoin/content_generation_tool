import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { getCurrentUser } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Project } from '@prisma/client'

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

  return (
    <>
      <DashboardHeader
        title={`Welcome back${user?.name ? `, ${user.name.split(' ')[0]}` : ''}!`}
        subtitle="Here's an overview of your content projects"
        action={
          <Link href="/dashboard/projects/new" className="btn-primary">
            New Project
          </Link>
        }
      />

      <div className="p-6 lg:p-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/dashboard/projects/new?type=blog-post"
              className="flex flex-col items-center p-4 bg-slate-50 rounded-xl hover:bg-primary-50 hover:border-primary-200 border border-transparent transition-all"
            >
              <span className="text-2xl mb-2">📝</span>
              <span className="text-sm font-medium text-slate-700">Blog Post</span>
            </Link>
            <Link
              href="/dashboard/projects/new?type=social-media"
              className="flex flex-col items-center p-4 bg-slate-50 rounded-xl hover:bg-primary-50 hover:border-primary-200 border border-transparent transition-all"
            >
              <span className="text-2xl mb-2">📱</span>
              <span className="text-sm font-medium text-slate-700">Social Media</span>
            </Link>
            <Link
              href="/dashboard/projects/new?type=email-sequence"
              className="flex flex-col items-center p-4 bg-slate-50 rounded-xl hover:bg-primary-50 hover:border-primary-200 border border-transparent transition-all"
            >
              <span className="text-2xl mb-2">📧</span>
              <span className="text-sm font-medium text-slate-700">Email Sequence</span>
            </Link>
            <Link
              href="/dashboard/projects/new?type=seo-report"
              className="flex flex-col items-center p-4 bg-slate-50 rounded-xl hover:bg-primary-50 hover:border-primary-200 border border-transparent transition-all"
            >
              <span className="text-2xl mb-2">📊</span>
              <span className="text-sm font-medium text-slate-700">SEO Report</span>
            </Link>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Projects</h2>
            <Link href="/dashboard/projects" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No projects yet</h3>
              <p className="text-slate-500 mb-6">Create your first content project to get started</p>
              <Link href="/dashboard/projects/new" className="btn-primary">
                Create Your First Project
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {recentProjects.map((project: Project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="flex items-center px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{project.name}</p>
                    <p className="text-sm text-slate-500">{project.serviceType}</p>
                  </div>
                  <div className="ml-4 flex items-center space-x-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      project.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : project.status === 'processing'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {project.status}
                    </span>
                    <span className="text-sm text-slate-400">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
