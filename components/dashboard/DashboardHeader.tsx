'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface DashboardHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export function DashboardHeader({ title, subtitle, action }: DashboardHeaderProps) {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-slate-900 truncate">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            )}
          </div>
          {action && (
            <div className="ml-4 flex-shrink-0">
              {action}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
