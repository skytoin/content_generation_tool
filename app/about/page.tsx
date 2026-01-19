import Link from 'next/link'

export const metadata = {
  title: 'About Us - Scribengine',
  description: 'Learn about Scribengine and our mission to make professional content accessible to businesses of all sizes.',
}

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-accent-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">About Scribengine</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Making professional content creation accessible, affordable, and efficient for businesses of all sizes.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Our Mission</h2>
          <p className="text-slate-600 mb-4">
            Content marketing is essential for modern businesses, but creating high-quality content is time-consuming and expensive. Hiring freelance writers or agencies can cost hundreds of dollars per article, and in-house content creation requires significant resources.
          </p>
          <p className="text-slate-600 mb-4">
            Scribengine was built to solve this problem. We combine the latest advancements in AI technology with carefully designed workflows to deliver professional-quality content at a fraction of the traditional cost. Our AI learns your unique writing style and brand voice, ensuring every piece of content feels authentically yours.
          </p>
          <p className="text-slate-600">
            Our mission is simple: democratize access to professional, customized content creation so that businesses of all sizes can compete effectively in the digital marketplace.
          </p>
        </div>

        {/* How We Work Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">How We Work</h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Style Learning</h3>
                <p className="text-slate-600">
                  Share your existing content samples and our AI learns your unique writing style, tone, and brand voice to ensure consistency.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Advanced Research</h3>
                <p className="text-slate-600">
                  Our AI conducts real-time web research to gather current facts, statistics, and expert insights relevant to your topic.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Customized Writing</h3>
                <p className="text-slate-600">
                  Using models from OpenAI and Anthropic, we generate content that matches your learned brand voice and audience expectations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Quality Review</h3>
                <p className="text-slate-600">
                  Every piece goes through automated quality checks to ensure accuracy, readability, and alignment with your style preferences.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold">5</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Final Polish</h3>
                <p className="text-slate-600">
                  Premium content receives an additional revision pass using our most advanced AI models for expert-level quality.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Our Technology</h2>
          <p className="text-slate-600 mb-6">
            We leverage cutting-edge AI technology from the world&apos;s leading AI research companies:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-2">OpenAI</h3>
              <p className="text-slate-600 text-sm">
                GPT-4o and GPT-4.1 models power our Budget and Standard tiers, providing excellent quality at competitive prices.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-2">Anthropic</h3>
              <p className="text-slate-600 text-sm">
                Claude Sonnet and Claude Opus power our Premium tier, delivering the highest quality content with nuanced understanding.
              </p>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Company Information</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Legal Entity</h3>
              <p className="text-slate-600">
                Scribengine is a product of MISTTRADES, a company registered in the United States.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Headquarters</h3>
              <p className="text-slate-600">
                971 US Highway 202 N, Suite N<br />
                Branchburg, NJ 08876<br />
                United States
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Contact</h3>
              <p className="text-slate-600">
                Email: support@misttrades.com<br />
                Phone: (718) 581-9645
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Support Hours</h3>
              <p className="text-slate-600">
                Monday - Friday: 9am - 5pm EST<br />
                Saturday: 10am - 2pm EST
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready to Get Started?</h2>
          <p className="text-slate-600 mb-6">
            Experience the future of content creation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="btn-primary">
              Create Free Account
            </Link>
            <Link href="/contact" className="btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
