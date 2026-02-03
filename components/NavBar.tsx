'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { ThemeSwitcher } from './ThemeSwitcher'
import { useTheme } from '@/contexts/ThemeContext'

export function NavBar() {
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme } = useTheme()
  const pathname = usePathname()

  // Hide navbar on dashboard pages (dashboard has its own sidebar navigation)
  if (pathname?.startsWith('/dashboard')) {
    return null
  }

  return (
    <nav className="fixed top-0 w-full z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            {theme === 'ink-diffusion' ? (
              // Ink Diffusion Logo - elegant serif style
              <span className="text-xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                <span className="font-light" style={{ color: '#722F37' }}>Scrib</span>
                <span className="italic font-light" style={{ color: '#2C3E50' }}>engine</span>
              </span>
            ) : theme === 'premium-blend' ? (
              // Premium Blend Logo
              <span className="text-xl">
                <span className="font-fraunces italic font-medium" style={{ color: '#c75d3a', fontFamily: 'Fraunces, serif' }}>Scrib</span>
                <span className="font-semibold tracking-tight" style={{ fontFamily: 'DM Sans, sans-serif' }}>engine</span>
              </span>
            ) : (
              // Original Logo
              <>
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-slate-800">Scrib<span className="text-primary-500">engine</span></span>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/#services" className="text-slate-600 hover:text-primary-600 transition-colors">Services</a>
            <a href="/#pricing" className="text-slate-600 hover:text-primary-600 transition-colors">Pricing</a>
            <a href="/#how-it-works" className="text-slate-600 hover:text-primary-600 transition-colors">How It Works</a>
            <a href="/#faq" className="text-slate-600 hover:text-primary-600 transition-colors">FAQ</a>

            <ThemeSwitcher />

            {status === 'loading' ? (
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-slate-600 hover:text-primary-600 transition-colors font-medium">
                  Dashboard
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2">
                    {session.user?.image ? (
                      <img src={session.user.image} alt="" className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                      </div>
                    )}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-3 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-900 truncate">{session.user?.name || 'User'}</p>
                      <p className="text-xs text-slate-500 truncate">{session.user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link href="/dashboard" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                        Dashboard
                      </Link>
                      <Link href="/dashboard/settings" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                        Settings
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-slate-600 hover:text-primary-600 transition-colors font-medium">
                  Log in
                </Link>
                <Link href="/signup" className="btn-primary text-sm py-2 px-5">
                  Sign up free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="space-y-2">
              <a href="/#services" className="block px-4 py-2 text-slate-600 hover:text-primary-600">Services</a>
              <a href="/#pricing" className="block px-4 py-2 text-slate-600 hover:text-primary-600">Pricing</a>
              <a href="/#how-it-works" className="block px-4 py-2 text-slate-600 hover:text-primary-600">How It Works</a>
              <a href="/#faq" className="block px-4 py-2 text-slate-600 hover:text-primary-600">FAQ</a>

              {/* Theme Switcher for mobile */}
              <div className="px-4 py-2 border-t border-slate-100 mt-2 pt-4">
                <p className="text-xs text-slate-500 mb-2">Theme</p>
                <ThemeSwitcher />
              </div>

              {session ? (
                <>
                  <Link href="/dashboard" className="block px-4 py-2 text-primary-600 font-medium">Dashboard</Link>
                  <Link href="/dashboard/settings" className="block px-4 py-2 text-slate-600">Settings</Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="block w-full text-left px-4 py-2 text-red-600"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block px-4 py-2 text-slate-600 font-medium">Log in</Link>
                  <Link href="/signup" className="block mx-4 mt-2 btn-primary text-center">Sign up free</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
