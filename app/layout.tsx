import type { Metadata } from 'next'
import { Providers } from '@/components/Providers'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { MainContent } from '@/components/MainContent'
import './globals.css'

export const metadata: Metadata = {
  title: 'Scribengine - Professional AI-Powered Content Agency',
  description: 'Get high-quality blog posts, social media content, email sequences, and SEO reports delivered in minutes. Powered by advanced AI, reviewed by experts.',
  keywords: 'AI content writing, blog posts, social media content, email marketing, SEO analysis, content agency',
  openGraph: {
    title: 'Scribengine - Professional AI-Powered Content Agency',
    description: 'Get high-quality content delivered in minutes. Blog posts, social media, emails, and SEO reports.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Providers>
          <NavBar />
          <MainContent>{children}</MainContent>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
