'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { LENGTH_TIERS, QUALITY_TIERS } from '@/lib/pricing-config'

// Pricing tiers for non-blog service types
const tierPricing: Record<string, { budget: number; standard: number; premium: number }> = {
  'social-pack': { budget: 12, standard: 22, premium: 45 },
  'email-sequence': { budget: 15, standard: 28, premium: 55 },
  'seo-report': { budget: 20, standard: 35, premium: 65 },
  'content-bundle': { budget: 40, standard: 80, premium: 150 },
}

const services = [
  {
    id: 'blog-post',
    name: 'Blog Post',
    description: 'SEO-optimized articles with customizable length',
    deliverables: ['SEO-optimized article', 'Meta description', 'H1/H2 structure', 'Internal linking suggestions', 'Same day delivery'],
    icon: '📝',
    popular: true,
    isBlogPost: true, // Flag to use length-based pricing
  },
  {
    id: 'social-pack',
    name: 'Social Media Pack',
    description: '30 posts across platforms for one month',
    deliverables: ['10 LinkedIn posts', '10 Twitter/X posts', '10 Instagram captions', 'Hashtag research', 'Same day delivery'],
    icon: '📱',
    popular: false,
  },
  {
    id: 'email-sequence',
    name: 'Email Sequence',
    description: '5-email nurture sequence for any goal',
    deliverables: ['5 strategic emails', 'Subject line options', 'Call-to-action optimization', 'A/B testing suggestions', 'Same day delivery'],
    icon: '✉️',
    popular: false,
  },
  {
    id: 'seo-report',
    name: 'SEO Content Audit',
    description: 'Comprehensive content strategy report',
    deliverables: ['Full site content audit', 'Keyword opportunity analysis', '10 article topic suggestions', 'Competitor content gaps', 'Same day delivery'],
    icon: '📊',
    popular: false,
  },
  {
    id: 'content-bundle',
    name: 'Monthly Content Bundle',
    description: 'Everything you need for content marketing',
    deliverables: ['4 premium blog posts', '30 social media posts', '1 email sequence', 'Content calendar', 'Priority support'],
    icon: '🚀',
    popular: true,
  },
]

const tiers = [
  {
    id: 'budget',
    name: 'Budget',
    description: 'Great quality at the lowest price',
    badge: '💰 Best Value',
    color: 'from-green-500 to-emerald-500',
    features: ['GPT-4o powered', '4 research queries', 'Standard quality checks', 'Fast delivery'],
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Enhanced quality with premium finishing',
    badge: '⭐ Recommended',
    color: 'from-blue-500 to-indigo-500',
    features: ['GPT-4o + Claude Sonnet', '7 research queries', 'Advanced quality checks', 'Professional polish'],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Best-in-class AI content generation',
    badge: '👑 Top Quality',
    color: 'from-purple-500 to-pink-500',
    features: ['Claude Opus 4.5 final edit', 'Live web search', 'Comprehensive research', 'Expert-level quality'],
  },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Marketing Director, TechStart',
    content: 'ContentForge AI has transformed our content strategy. We went from publishing 2 posts a month to 8, and our organic traffic increased 340%.',
    avatar: 'SC',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Founder, GrowthLab',
    content: 'The quality is incredible. I genuinely cannot tell the difference from human-written content. Our engagement rates have never been higher.',
    avatar: 'MR',
  },
  {
    name: 'Emma Thompson',
    role: 'Content Lead, ScaleUp Co',
    content: 'We saved $4,000/month by switching from freelancers. The turnaround is faster and the quality is more consistent.',
    avatar: 'ET',
  },
]

const faqs = [
  {
    q: 'How is the content generated?',
    a: 'We use advanced AI models combined with human editorial review to ensure quality, accuracy, and brand voice alignment. Every piece goes through quality checks before delivery.',
  },
  {
    q: 'What\'s the turnaround time?',
    a: 'Most orders are delivered within 24-72 hours. Complex projects like SEO audits may take 5-7 business days. You\'ll receive an email notification when your content is ready.',
  },
  {
    q: 'Can I request revisions?',
    a: 'Absolutely! We offer one free revision within 7 days of delivery. Just reply to your delivery email with your feedback.',
  },
  {
    q: 'Is the content original?',
    a: 'Yes, 100%. All content is generated fresh for each order and passes plagiarism checks. You receive full ownership rights to use as you wish.',
  },
  {
    q: 'What industries do you support?',
    a: 'We support virtually any industry - tech, healthcare, finance, e-commerce, SaaS, professional services, and more. Just provide context about your business.',
  },
  {
    q: 'How do I get started?',
    a: 'Simply choose a service, fill out the brief form with your requirements, and complete payment. You\'ll receive your content via email within the stated timeframe.',
  },
]

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const { data: session } = useSession()
  const router = useRouter()

  const handleServiceClick = (serviceId: string) => {
    if (session) {
      // Logged in - go to dashboard to create project
      router.push(`/dashboard/projects/new/${serviceId}`)
    } else {
      // Not logged in - go to login with callback
      router.push(`/login?callbackUrl=${encodeURIComponent(`/dashboard/projects/new/${serviceId}`)}`)
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 -z-10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '3s'}} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-8">
              <span className="animate-pulse mr-2">🔥</span>
              <span>Over 10,000 pieces of content delivered</span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Professional Content
              <span className="block text-gradient">Powered by AI</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
              Get high-quality blog posts, social media content, email sequences, and SEO reports delivered to your inbox in hours, not weeks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {session ? (
                <button onClick={() => router.push('/dashboard/projects/new')} className="btn-primary text-lg">
                  Create New Project
                </button>
              ) : (
                <button onClick={() => router.push('/signup')} className="btn-primary text-lg">
                  Get Started Free
                </button>
              )}
              <a href="#services" className="btn-secondary text-lg">
                View Services & Pricing
              </a>
            </div>
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No subscription required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>100% satisfaction guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Delivered in 24-72 hours</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10,000+', label: 'Content Pieces Delivered' },
              { value: '500+', label: 'Happy Customers' },
              { value: '4.9/5', label: 'Average Rating' },
              { value: '<24h', label: 'Average Delivery Time' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-slate-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers Section */}
      <section id="pricing" className="py-20 bg-slate-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Choose Your Quality Tier
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Three quality levels to match your budget and needs. Same great content, different AI models.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative glass rounded-2xl p-8 card-hover ${tier.popular ? 'ring-2 ring-primary-500 scale-105' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-medium px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${tier.color} text-white mb-4`}>
                  {tier.badge}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{tier.name}</h3>
                <p className="text-slate-600 text-sm mb-6">{tier.description}</p>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Choose Your Content Package
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Professional content for every need. Select a service, then choose your quality tier.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className={`relative glass rounded-2xl p-8 card-hover ${service.popular ? 'pricing-popular ring-2 ring-primary-500' : ''}`}
              >
                {service.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-medium px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{service.name}</h3>
                <p className="text-slate-600 text-sm mb-4">{service.description}</p>

                {/* Pricing Display */}
                {'isBlogPost' in service && service.isBlogPost ? (
                  <div className="mb-6">
                    <div className="p-4 rounded-lg bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100">
                      <div className="text-center">
                        <span className="text-2xl font-bold text-primary-700">From $3</span>
                        <span className="text-slate-600 text-sm block mt-1">Choose your length & quality tier</span>
                      </div>
                      <a
                        href="#blog-pricing"
                        className="block mt-3 text-center text-sm font-medium text-primary-600 hover:text-primary-700"
                      >
                        View Full Pricing Table ↓
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-green-50">
                      <span className="text-sm font-medium text-green-700">💰 Budget</span>
                      <span className="text-lg font-bold text-green-700">${tierPricing[service.id]?.budget}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50 ring-1 ring-blue-200">
                      <span className="text-sm font-medium text-blue-700">⭐ Standard</span>
                      <span className="text-lg font-bold text-blue-700">${tierPricing[service.id]?.standard}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50">
                      <span className="text-sm font-medium text-purple-700">👑 Premium</span>
                      <span className="text-lg font-bold text-purple-700">${tierPricing[service.id]?.premium}</span>
                    </div>
                  </div>
                )}

                <ul className="space-y-3 mb-8">
                  {service.deliverables.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleServiceClick(service.id)}
                  className={`block w-full text-center py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    service.popular
                      ? 'btn-primary'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {session ? 'Create Project' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Post Pricing Table */}
      <section id="blog-pricing" className="py-20 bg-slate-50 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Blog Post Pricing
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Choose your article length and quality tier. Longer content = more value for your readers.
            </p>
          </div>

          {/* Pricing Table */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Length Tier</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Word Count</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-green-700">
                      <span className="inline-flex items-center gap-1">💰 Budget</span>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-700">
                      <span className="inline-flex items-center gap-1">⭐ Standard</span>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-purple-700">
                      <span className="inline-flex items-center gap-1">👑 Premium</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {LENGTH_TIERS.map((tier, index) => (
                    <tr key={tier.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-900">{tier.name}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-slate-600">
                        {tier.wordRange} words
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold">
                          ${tier.prices.budget}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold">
                          ${tier.prices.standard}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-bold">
                          ${tier.prices.premium}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quality Tier Descriptions */}
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {QUALITY_TIERS.map((tier) => {
              const colorClasses = {
                budget: 'border-green-200 bg-green-50/50',
                standard: 'border-blue-200 bg-blue-50/50',
                premium: 'border-purple-200 bg-purple-50/50',
              }
              const textClasses = {
                budget: 'text-green-700',
                standard: 'text-blue-700',
                premium: 'text-purple-700',
              }
              return (
                <div key={tier.id} className={`rounded-xl border p-4 ${colorClasses[tier.id]}`}>
                  <h4 className={`font-semibold mb-2 ${textClasses[tier.id]}`}>{tier.name}</h4>
                  <p className="text-sm text-slate-600 mb-3">{tier.description}</p>
                  <ul className="space-y-1">
                    {tier.features.slice(0, 3).map((feature, i) => (
                      <li key={i} className="text-xs text-slate-500 flex items-center gap-1">
                        <span className="text-green-500">✓</span> {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          {/* CTA */}
          <div className="mt-10 text-center">
            <button
              onClick={() => handleServiceClick('blog-post')}
              className="btn-primary text-lg"
            >
              {session ? 'Create Blog Post' : 'Get Started'}
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600">
              Three simple steps to professional content
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Choose Your Service',
                description: 'Select the content type you need—blog posts, social media, emails, or SEO reports.',
                icon: '🎯',
              },
              {
                step: '02',
                title: 'Share Your Brief',
                description: 'Tell us about your business, target audience, and content goals. The more detail, the better.',
                icon: '📋',
              },
              {
                step: '03',
                title: 'Receive Your Content',
                description: 'Get polished, ready-to-publish content delivered straight to your inbox.',
                icon: '✨',
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="glass rounded-2xl p-8 text-center h-full">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <div className="text-sm font-bold text-primary-500 mb-2">STEP {item.step}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-slate-300 text-2xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Trusted by Growing Businesses
            </h2>
            <p className="text-xl text-slate-600">
              See what our customers have to say
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="glass rounded-2xl p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-600 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-slate-50 scroll-mt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="glass rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                >
                  <span className="font-semibold text-slate-900">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-slate-500 transform transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-slate-600">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-accent-600 p-12 text-center text-white">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdjJoLTYweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+')] opacity-50" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Scale Your Content?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Join hundreds of businesses using ContentForge AI to create professional content at scale.
              </p>
              <button
                onClick={() => session ? router.push('/dashboard/projects/new') : router.push('/signup')}
                className="inline-block bg-white text-primary-600 font-bold py-4 px-8 rounded-xl hover:bg-slate-100 transition-colors shadow-xl"
              >
                {session ? 'Create New Project' : 'Get Started Now'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
