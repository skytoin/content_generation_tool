'use client'

import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { tokens } from './primitives/design-tokens'
import { UISwitcherCompact } from '@/components/UISwitcher'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  {
    name: 'Projects',
    href: '/dashboard/projects',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  },
  {
    name: 'New Project',
    href: '/dashboard/projects/new',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
      </svg>
    )
  },
  {
    name: 'Billing',
    href: '/dashboard/billing',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
]

export function InkSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: tokens.colors.paper.white,
        borderRight: `1px solid ${tokens.colors.paper.border}`,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center h-16 px-6"
        style={{ borderBottom: `1px solid ${tokens.colors.paper.border}` }}
      >
        <Link href="/" className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: tokens.colors.ink[700] }}
          >
            <span
              className="text-lg font-semibold"
              style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.paper.white }}
            >
              S
            </span>
          </div>
          <span
            className="text-lg"
            style={{ fontFamily: tokens.fonts.serif, color: tokens.colors.text.primary }}
          >
            Scrib<span style={{ color: tokens.colors.ink[700] }}>engine</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200"
              style={{
                fontFamily: tokens.fonts.sans,
                background: active ? `${tokens.colors.ink[700]}10` : 'transparent',
                color: active ? tokens.colors.ink[700] : tokens.colors.text.secondary,
                borderLeft: active ? `3px solid ${tokens.colors.ink[700]}` : '3px solid transparent',
              }}
            >
              <span style={{ color: active ? tokens.colors.ink[700] : tokens.colors.text.muted }}>
                {item.icon}
              </span>
              <span className="ml-3">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* UI Switcher */}
      <div className="px-4 pb-4">
        <UISwitcherCompact />
      </div>

      {/* User section */}
      <div
        className="p-4"
        style={{ borderTop: `1px solid ${tokens.colors.paper.border}` }}
      >
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                className="w-10 h-10 rounded-xl"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${tokens.colors.ink[700]}, ${tokens.colors.sage[500]})` }}
              >
                <span
                  className="text-sm font-medium"
                  style={{ color: tokens.colors.paper.white }}
                >
                  {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || 'U'}
                </span>
              </div>
            )}
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p
              className="text-sm font-medium truncate"
              style={{ fontFamily: tokens.fonts.sans, color: tokens.colors.text.primary }}
            >
              {session?.user?.name || 'User'}
            </p>
            <p
              className="text-xs truncate"
              style={{ color: tokens.colors.text.muted }}
            >
              {session?.user?.email}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="ml-2 p-2 rounded-lg transition-colors"
            style={{ color: tokens.colors.text.muted }}
            title="Sign out"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
