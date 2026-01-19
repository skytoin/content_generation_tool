import type { Metadata } from 'next'
import { Providers } from '@/components/Providers'
import { NavBar } from '@/components/NavBar'
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
        <main className="pt-16">
          {children}
        </main>
        <footer className="bg-slate-900 text-white py-16 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-12">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-xl font-bold">Scrib<span className="text-primary-400">engine</span></span>
                </div>
                <p className="text-slate-400 text-sm">Professional AI-powered content for businesses that want to scale.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Services</h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><a href="/#services" className="hover:text-white transition-colors">Blog Posts</a></li>
                  <li><a href="/#services" className="hover:text-white transition-colors">Social Media</a></li>
                  <li><a href="/#services" className="hover:text-white transition-colors">Email Sequences</a></li>
                  <li><a href="/#services" className="hover:text-white transition-colors">SEO Reports</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><a href="/#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                  <li><a href="/#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="/#faq" className="hover:text-white transition-colors">FAQ</a></li>
                  <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                </ul>
                <h4 className="font-semibold mb-4 mt-6">Contact</h4>
                <p className="text-slate-400 text-sm">Questions? Reach out anytime.</p>
                <a href="mailto:support@misttrades.com" className="text-primary-400 hover:text-primary-300 transition-colors text-sm">support@misttrades.com</a>
              </div>
            </div>
            <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500 text-sm">
              <p>© {new Date().getFullYear()} MISTTRADES. All rights reserved.</p>
              <p className="mt-2">Scribengine is a product of MISTTRADES</p>
            </div>
          </div>
        </footer>
        </Providers>
      </body>
    </html>
  )
}
