'use client'

import { usePathname } from 'next/navigation'

interface MainContentProps {
  children: React.ReactNode
}

export function MainContent({ children }: MainContentProps) {
  const pathname = usePathname()

  // Don't add pt-16 padding on dashboard pages (no navbar there)
  const isDashboard = pathname?.startsWith('/dashboard')

  return (
    <main className={isDashboard ? '' : 'pt-16'}>
      {children}
    </main>
  )
}
