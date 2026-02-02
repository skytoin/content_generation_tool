'use client'

import { tokens } from './primitives/design-tokens'

interface InkDashboardHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export function InkDashboardHeader({ title, subtitle, action }: InkDashboardHeaderProps) {
  return (
    <header
      style={{
        background: tokens.colors.paper.white,
        borderBottom: `1px solid ${tokens.colors.paper.border}`,
      }}
    >
      <div className="px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1
              className="text-2xl font-light truncate"
              style={{
                fontFamily: tokens.fonts.serif,
                color: tokens.colors.text.primary,
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className="mt-1 text-sm"
                style={{
                  fontFamily: tokens.fonts.sans,
                  color: tokens.colors.text.muted,
                }}
              >
                {subtitle}
              </p>
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
